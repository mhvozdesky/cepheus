import os
from unittest.mock import patch, MagicMock

from rest_framework.test import APITestCase
from extra_settings.models import Setting

from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from .test_data.utils import register_data
from accounts.models import Account, PasswordGenerationToken
from .tasks import send_mail_delayed
from email_notifications.utils import reset_password_url


class TestAccountViewSetAuth(APITestCase):
    def setUp(self):
        self.allow_registration()

    @staticmethod
    def allow_registration():
        allow_registration_obj = Setting.objects.get(name='ALLOW_REGISTRATION')
        allow_registration_obj.value = True
        allow_registration_obj.save()

    @staticmethod
    def not_allow_registration():
        allow_registration_obj = Setting.objects.get(name='ALLOW_REGISTRATION')
        allow_registration_obj.value = False
        allow_registration_obj.save()

    def test_register_successfully(self):
        request = self.client.post(
            reverse('accounts-register'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 201)
        account = Account.objects.filter(email=register_data['email'])
        self.assertTrue(account.exists())

    def test_register_is_not_allowed(self):
        self.not_allow_registration()
        request = self.client.post(
            reverse('accounts-register'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 403)

    def test_register_email_exists(self):
        Account.objects.create(email=register_data['email'])
        request = self.client.post(
            reverse('accounts-register'),
            data=register_data,
            format='json'
        )

        self.assertEqual(request.status_code, 400)
        self.assertTrue('email' in request.data)

    def test_register_password_wrong(self):
        new_register_data = register_data.copy()
        new_register_data['password'] = '1'
        request = self.client.post(
            reverse('accounts-register'),
            data=new_register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 400)
        self.assertTrue('password' in request.data)
        self.assertTrue('re_password' in request.data)

    def test_required_fields(self):
        request = self.client.post(
            reverse('accounts-register'),
            data={},
            format='json'
        )
        self.assertEqual(request.status_code, 400)
        self.assertTrue('password' in request.data)
        self.assertTrue('re_password' in request.data)
        self.assertTrue('email' in request.data)

    def test_login_credential_wrong(self):
        request = self.client.post(
            reverse('accounts-login'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 400)

    def test_login_password_wrong(self):
        Account.objects.create_user(email=register_data['email'], password='Aaaa2222')
        request = self.client.post(
            reverse('accounts-login'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 400)

    def test_login_email_wrong(self):
        Account.objects.create_user(email='anton+2@example.com', password=register_data['password'])
        request = self.client.post(
            reverse('accounts-login'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 400)

    def test_login_successfully(self):
        Account.objects.create_user(email=register_data['email'], password=register_data['password'])
        request = self.client.post(
            reverse('accounts-login'),
            data=register_data,
            format='json'
        )
        self.assertEqual(request.status_code, 200)

    def test_login_required_fields(self):
        request = self.client.post(
            reverse('accounts-login'),
            data={},
            format='json'
        )
        self.assertEqual(request.status_code, 400)
        self.assertTrue('password' in request.data)
        self.assertTrue('email' in request.data)


class TestAccountViewSet(APITestCase):
    def setUp(self):
        self.password = 'Aaaa1111!'
        self.super_user = Account.objects.create_superuser(email='super_user@example.com', password=self.password)
        self.user = Account.objects.create_user(email='user@example.com', password=self.password)
        self.client.force_login(self.user)

    def super_user_login(self):
        self.client.logout()
        self.client.force_login(self.super_user)

    def test_accounts_list_not_auth(self):
        self.client.logout()
        request = self.client.get(reverse('accounts-list'))
        self.assertEqual(request.status_code, 403)

    def test_accounts_list(self):
        request = self.client.get(reverse('accounts-list'))
        self.assertEqual(request.status_code, 200)
        self.assertEqual(len(request.data['results']), 2)
        self.assertTrue('password' not in request.data['results'][0])

    def test_accounts_detail_not_auth(self):
        self.client.logout()
        request = self.client.get(reverse('accounts-detail', args=[self.super_user.pk]))
        self.assertEqual(request.status_code, 403)

    def test_accounts_detail(self):
        request = self.client.get(reverse('accounts-detail', args=[self.super_user.pk]))
        self.assertEqual(request.status_code, 200)
        self.assertEqual(request.data['id'], self.super_user.pk)
        self.assertTrue('password' not in request.data)

    def test_accounts_me_not_auth(self):
        self.client.logout()
        request = self.client.get(reverse('accounts-me'))
        self.assertEqual(request.status_code, 403)

    def test_accounts_me(self):
        request = self.client.get(reverse('accounts-me'))
        self.assertEqual(request.status_code, 200)
        self.assertEqual(request.data['id'], self.user.pk)
        self.assertTrue('password' not in request.data)

    def test_accounts_me_update_not_auth(self):
        self.client.logout()
        request = self.client.patch(
            reverse('accounts-me'),
            data={},
            format='json'
        )
        self.assertEqual(request.status_code, 403)

    def test_accounts_me_update(self):
        request = self.client.patch(
            reverse('accounts-me'),
            data={'first_name': 'Anton'},
            format='json'
        )
        self.user.refresh_from_db()

        self.assertEqual(request.status_code, 200)
        self.assertEqual(self.user.first_name, 'Anton')

    def test_accounts_update_not_super(self):
        request = self.client.patch(
            reverse('accounts-detail', args=[self.user.pk]),
            data={'first_name': 'Anton'},
            format='json'
        )
        self.assertEqual(request.status_code, 403)

    def test_accounts_update_super(self):
        self.super_user_login()
        request = self.client.patch(
            reverse('accounts-detail', args=[self.user.pk]),
            data={'first_name': 'Anton'},
            format='json'
        )
        self.user.refresh_from_db()
        self.assertEqual(request.status_code, 200)
        self.assertEqual(self.user.first_name, 'Anton')

    @patch('accounts.admin.views.send_mail_delayed')
    def test_generation_password_not_super(self, mock_task_send_mail):
        request = self.client.post(
            reverse('admin_send_email'),
            data={'user_id': 1}
        )
        self.assertEqual(request.status_code, 403)

    @patch('accounts.admin.views.send_mail_delayed')
    def test_generation_password_super_exception(self, mock_task_send_mail):
        self.super_user_login()
        mock_task_send_mail.delay = MagicMock()
        mock_task_send_mail.delay.side_effect = KeyError('error')

        request = self.client.post(
            reverse('admin_send_email'),
            data={'user_id': 1}
        )
        self.assertEqual(request.status_code, 500)

    @patch('accounts.admin.views.send_mail_delayed')
    def test_generation_password_super_successfully(self, mock_task_send_mail):
        self.super_user_login()
        mock_task_send_mail.delay = MagicMock()
        mock_task_send_mail.delay.return_value = MagicMock()

        request = self.client.post(
            reverse('admin_send_email'),
            data={'user_id': self.user.pk}
        )
        self.assertEqual(request.status_code, 200)
        mock_task_send_mail.delay.assert_called_with('send_pass_generations', self.user.pk)

    @patch('email_notifications.utils.send_pass_generations')
    def test_send_mail_delayed(self, mock_send_pass_generations):
        result = send_mail_delayed('send_pass_generations', self.user.pk)
        self.assertEqual(result, f'A message was sent to user_id {self.user.pk} by email {self.user.email}')
        mock_send_pass_generations.assert_called_with(self.user)

    def test_reset_password_url(self):
        protocol = os.environ.get('CEPHEUS_PROTOCOL')
        host = os.environ.get('CEPHEUS_HOST')
        port = os.environ.get('CEPHEUS_PORT')
        user_id = urlsafe_base64_encode(force_bytes(self.user.id))

        result = reset_password_url(self.user)
        token = PasswordGenerationToken.objects.get(user=self.user).token
        expected_result = f'{protocol}://{host}:{port}/confirm-password/{user_id}/{token}/'
        self.assertEqual(result, expected_result)

    def test_reset_password_user_id_wrong(self):
        token = PasswordGenerationToken.objects.create(user=self.user).token
        request = self.client.post(
            reverse('reset_password', args=['spam', token])
        )
        self.assertEqual(request.status_code, 400)
        self.assertEqual(request.data['detail'], 'Invalid token')

    def test_reset_password_token_wrong(self):
        user_id = urlsafe_base64_encode(force_bytes(self.user.id))
        request = self.client.post(
            reverse('reset_password', args=[user_id, 'token'])
        )
        self.assertEqual(request.status_code, 400)
        self.assertEqual(request.data['detail'], 'Invalid token')

    def test_reset_password_required_fields(self):
        token = PasswordGenerationToken.objects.create(user=self.user).token
        user_id = urlsafe_base64_encode(force_bytes(self.user.id))

        request = self.client.post(
            reverse('reset_password', args=[user_id, token])
        )

        self.assertEqual(request.status_code, 400)
        self.assertTrue('password' in request.data)
        self.assertTrue('re_password' in request.data)

    def test_reset_password_required_fields(self):
        token = PasswordGenerationToken.objects.create(user=self.user).token
        user_id = urlsafe_base64_encode(force_bytes(self.user.id))

        request = self.client.post(
            reverse('reset_password', args=[user_id, token]),
            data={
                'password': 'Aaaa1111!',
                're_password': '1111'
            },
            format='json'
        )

        self.assertEqual(request.status_code, 400)

    def test_reset_password_successfully(self):
        token = PasswordGenerationToken.objects.create(user=self.user).token
        user_id = urlsafe_base64_encode(force_bytes(self.user.id))

        request = self.client.post(
            reverse('reset_password', args=[user_id, token]),
            data={
                'password': 'Aaaa2222!',
                're_password': 'Aaaa2222!'
            },
            format='json'
        )
        self.user.refresh_from_db()

        self.assertEqual(request.status_code, 200)
        self.assertTrue(self.user.check_password('Aaaa2222!'))

    def test_self_reset_password_not_mail_field(self):
        request = self.client.post(
            reverse('accounts-reset-password'),
            data={},
            format='json'
        )
        self.assertEqual(request.status_code, 400)

    def test_self_reset_password_mail_wrong(self):
        request = self.client.post(
            reverse('accounts-reset-password'),
            data={"email": "mailexample.com"},
            format='json'
        )
        self.assertEqual(request.status_code, 400)

    def test_self_reset_password_not_found(self):
        request = self.client.post(
            reverse('accounts-reset-password'),
            data={"email": "mail@example.com"},
            format='json'
        )
        self.assertEqual(request.status_code, 404)

    @patch('accounts.views.send_mail_delayed')
    def test_self_reset_password_successfully(self, mock_send_mail_delayed):
        mock_send_mail_delayed.delay = MagicMock()

        request = self.client.post(
            reverse('accounts-reset-password'),
            data={"email": self.user.email},
            format='json'
        )
        self.assertEqual(request.status_code, 200)
        mock_send_mail_delayed.delay.assert_called_with('send_pass_generations', self.user.pk)


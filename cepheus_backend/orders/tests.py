from django.urls import reverse

from rest_framework.test import APITestCase

from accounts.models import Account
from .test_data.utils import fill_db
from .models import Order, Good


class BaseTestsOrders(APITestCase):
    def setUp(self):
        self.password = 'Aaaa1111!'
        self.super_user = Account.objects.create_superuser(email='super_user@example.com', password=self.password)
        self.user = Account.objects.create_user(email='user@example.com', password=self.password)
        self.client.force_login(self.user)

        fill_db()


class TestOrderViewSet(BaseTestsOrders):
    def test_not_auth(self):
        self.client.logout()
        request = self.client.get(reverse('orders-list'))
        self.assertEqual(request.status_code, 403)

    def test_order_list(self):
        request = self.client.get(reverse('orders-list'))
        self.assertEqual(request.status_code, 200)
        self.assertEqual(len(request.data['results']), 2)

    def test_order_detail(self):
        order = Order.objects.all().first()
        request = self.client.get(reverse('orders-detail', args=[order.pk]))
        self.assertEqual(request.status_code, 200)
        self.assertEqual(len(request.data['goods']), 2)

    def test_order_patch(self):
        order = Order.objects.all().first()
        good = Good.objects.all().first()
        data = {
            'goods': [
                {
                    'quantity': 1,
                    'price': 150,
                    'amount': 150,
                    'good': good.pk
                }
            ]
        }
        request = self.client.patch(
            reverse('orders-detail', args=[order.pk]),
            data=data,
            format='json'
        )
        self.assertEqual(request.status_code, 200)
        self.assertEqual(len(request.data['goods']), 1)

    def test_order_delete(self):
        orders = Order.objects.all()
        order = Order.objects.all().first()
        num_orders = len(orders)
        request = self.client.delete(reverse('orders-detail', args=[order.pk]))
        self.assertEqual(request.status_code, 204)
        self.assertEqual(len(Order.objects.all()), num_orders-1)

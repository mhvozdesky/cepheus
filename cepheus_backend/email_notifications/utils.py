from functools import wraps

from django.core.mail import send_mail
from django.template import loader
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from common.utils import get_base_url
from accounts.models import PasswordGenerationToken


def reset_password_url(user):
    base_url = get_base_url()
    user_id = urlsafe_base64_encode(force_bytes(user.id))
    token_obj = PasswordGenerationToken.objects.create(user=user)
    PasswordGenerationToken.objects.filter(user=user).exclude(pk=token_obj.pk).update(active=False)
    return f'{base_url}/reset-password/{user_id}/{token_obj.token}/'


def sender(subject):
    def fun_wrap(fun):
        @wraps(fun)
        def cur_email(user, *args, **kwargs):
            msg_html = fun(user, *args, **kwargs)
            send_mail(
                subject,
                '',
                None,
                [user.email],
                html_message=msg_html
            )
        return cur_email
    return fun_wrap


@sender('Password generation Cepheus')
def send_pass_generations(user):
    template = loader.get_template("email_templates/password_genetation.html")
    context = {
        'first_name': user.first_name if user.first_name else 'Dear client',
        'url': reset_password_url(user)
    }
    return template.render(context)

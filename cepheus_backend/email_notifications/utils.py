from functools import wraps

from django.core.mail import send_mail
from django.template import loader


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
        'url': 'http://example.com'
    }
    return template.render(context)

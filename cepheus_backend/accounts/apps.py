from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def f1(self):
        from .models import Account

        a = Account.objects.get(email='admin@example.com')

        print

    def ready(self):
        self.f1()

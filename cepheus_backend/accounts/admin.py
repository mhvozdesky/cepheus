from django.contrib.admin import site

from .models import Account

site.register(Account)

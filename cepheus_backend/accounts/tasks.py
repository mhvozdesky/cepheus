import logging

import email_notifications

from celery import shared_task
from celery.utils.log import get_task_logger

from django.core.exceptions import ObjectDoesNotExist

from accounts.models import Account


task_logger = get_task_logger(__name__)


@shared_task
def send_mail_delayed(fun_name, user_id, *args, **kwargs):
    function_to_call = getattr(email_notifications.utils, fun_name)
    try:
        user = Account.objects.get(pk=user_id)
    except ObjectDoesNotExist:
        task_logger.info(f'User with id {user_id} not found')
        return
    function_to_call(user, *args, **kwargs)

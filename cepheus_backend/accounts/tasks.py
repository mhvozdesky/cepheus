from celery import shared_task
from celery.utils.log import get_task_logger

from accounts.models import Account
from email_notifications import utils


task_logger = get_task_logger(__name__)


@shared_task
def send_mail_delayed(fun_name, user_id, *args, **kwargs):
    function_to_call = getattr(utils, fun_name)
    user = Account.objects.get(pk=user_id)
    function_to_call(user, *args, **kwargs)
    return f'A message was sent to user_id {user_id} by email {user.email}'

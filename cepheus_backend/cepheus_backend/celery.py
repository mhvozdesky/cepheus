import os
from datetime import timedelta

from celery import Celery
from celery.schedules import crontab

from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spiral_backend.settings')

app = Celery('cepheus', broker='redis://{}:{}'.format(settings.REDIS_HOST, settings.REDIS_PORT))

app.conf.update(
    result_backend='django-db',
    broker_transport_options={'visibility_timeout': timedelta(hours=25).total_seconds()},
    broker_connection_retry_on_startup=True
)

app.autodiscover_tasks()

# app.conf.beat_schedule = {
#     'notify_questionnaire_is_ready_each_hour': {
#         'task': 'notify_questionnaire_is_ready',
#         'schedule': crontab(hour='*', minute=0),
#         'args': (),
#     },
# }

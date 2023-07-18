from django.urls import path

from . import views

urlpatterns = [
    path('send-email/', views.SendEmail.as_view(), name='admin_send_email')
]

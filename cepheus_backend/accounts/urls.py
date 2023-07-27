from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AccountViewSet, ResetPasswordViewSet

router = DefaultRouter()
router.register('accounts', AccountViewSet, basename='accounts')


urlpatterns = [
    path('', include(router.urls)),
    path('generation-password/', include('accounts.admin.urls')),
    path('reset-password/<uidb64>/<token>/', ResetPasswordViewSet.as_view({'post': 'reset'}), name='reset_password')
]

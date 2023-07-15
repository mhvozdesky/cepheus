from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AccountViewSet

router = DefaultRouter()
router.register('accounts', AccountViewSet, 'accounts')


urlpatterns = [
    path('', include(router.urls))
]

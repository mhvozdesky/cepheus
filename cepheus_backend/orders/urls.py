from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, CategoryViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='orders')
router.register('categories', CategoryViewSet, basename='categories')


urlpatterns = [
    path('', include(router.urls))
]

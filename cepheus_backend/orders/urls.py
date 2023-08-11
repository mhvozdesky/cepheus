from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, CategoryViewSet, CustomerViewSet,  GoodViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='orders')
router.register('categories', CategoryViewSet, basename='categories')
router.register('customers', CustomerViewSet, basename='customers')
router.register('goods', GoodViewSet, basename='goods')


urlpatterns = [
    path('', include(router.urls))
]

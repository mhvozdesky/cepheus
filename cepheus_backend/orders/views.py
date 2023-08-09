from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Order, Category, Customer
from .serializers import OrderSerializer, CategorySerializer, CustomerSerializer


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    lookup_field = 'pk'
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    lookup_field = 'pk'
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    lookup_field = 'pk'
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]



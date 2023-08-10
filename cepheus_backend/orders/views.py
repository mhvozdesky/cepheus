from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Order, Category, Customer, Good
from .serializers import (OrderListSerializer, CategorySerializer, CustomerSerializer,
                          GoodSerializer, OrderDetailSerializer)


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by('title')
    lookup_field = 'pk'
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    lookup_field = 'pk'
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class GoodViewSet(ModelViewSet):
    queryset = Good.objects.all().order_by('-created_at')
    lookup_field = 'pk'
    serializer_class = GoodSerializer
    permission_classes = [IsAuthenticated]

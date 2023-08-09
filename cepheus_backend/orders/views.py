from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Order, Category
from .serializers import OrderSerializer, CategorySerializer


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



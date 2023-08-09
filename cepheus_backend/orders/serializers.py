from rest_framework.serializers import ModelSerializer

from .models import Order, Category, Customer


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

from rest_framework.serializers import ModelSerializer

from .models import Order, Category, Customer, Good


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


class GoodSerializer(ModelSerializer):
    class Meta:
        model = Good
        fields = '__all__'

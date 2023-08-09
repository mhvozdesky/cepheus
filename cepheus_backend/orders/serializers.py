from rest_framework.serializers import ModelSerializer

from .models import Order, Category


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

from rest_framework import serializers

from .models import Order, Category, Customer, Good, OrderGood


class GoodInOrderSerializer(serializers.ModelSerializer):
    good_title = serializers.CharField(source='good.title', read_only=True)

    class Meta:
        model = OrderGood
        fields = ['quantity', 'price', 'amount', 'good', 'good_title']


class OrderListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'


class OrderDetailSerializer(OrderListSerializer):
    goods = GoodInOrderSerializer(many=True, source='order_goods')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class GoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Good
        fields = '__all__'

from django.db import transaction

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

    @transaction.atomic
    def set_order_goods(self, instance, goods):
        OrderGood.objects.filter(order=instance).delete()
        for line in goods:
            line['order'] = instance
            OrderGood.objects.create(**line)

    def create(self, validated_data):
        goods = validated_data.pop('order_goods', None)
        instance = super().create(validated_data)
        if goods is not None:
            self.set_order_goods(instance, goods)
        return instance

    def update(self, instance, validated_data):
        goods = validated_data.pop('order_goods', None)
        instance = super().update(instance, validated_data)
        if goods is not None:
            self.set_order_goods(instance, goods)
        return instance


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

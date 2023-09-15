from django.db import transaction
from django.db.models import Sum

from rest_framework import serializers

from .models import Order, Category, Customer, Good, OrderGood


class GoodInOrderSerializer(serializers.ModelSerializer):
    good_title = serializers.CharField(source='good.title', read_only=True)
    vendor_code = serializers.CharField(source='good.vendor_code', read_only=True)

    class Meta:
        model = OrderGood
        fields = ['quantity', 'price', 'amount', 'good', 'good_title', 'vendor_code']


class OrderListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    responsible_display = serializers.CharField(source='responsible.get_full_name', read_only=True)
    number = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_number(self, obj):
        return obj.order_goods.count()

    def get_amount(self, obj):
        total_amount = obj.order_goods.aggregate(total_amount=Sum('amount'))['total_amount']
        if total_amount is None:
            return 0
        return total_amount


class OrderDetailSerializer(OrderListSerializer):
    goods = GoodInOrderSerializer(many=True, source='order_goods')
    latest_editor = serializers.SerializerMethodField()

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
        editor = self.context['request'].user
        validated_data.update({'latest_editor': editor})
        instance = super().update(instance, validated_data)
        if goods is not None:
            self.set_order_goods(instance, goods)
        return instance

    def get_latest_editor(self, obj):
        return obj.latest_editor.get_full_name if obj.latest_editor else 'auto'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class GoodSerializer(serializers.ModelSerializer):
    category_display = serializers.SerializerMethodField()

    class Meta:
        model = Good
        fields = '__all__'

    def get_category_display(self, obj):
        return obj.category.title if obj.category else ''

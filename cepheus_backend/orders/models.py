from django.db import models
from django.core.validators import MinValueValidator

from accounts.models import Account, PHONE_VALIDATOR
from common.custom_model_fields import LowercaseEmailField
from common.constants import GENDER_CHOICES, MALE


NEW = 'new'
IN_PROGRESS = 'in_progress'
CANCELED = 'canceled'
RETURNED = 'returned'
SHIPPED = 'shipped'
SHIPPED_BACK = 'shipped_back'
COMPLETED = 'completed'

ORDER_STATUSES = (
    (NEW, 'New'),
    (IN_PROGRESS, 'In Progress'),
    (CANCELED, 'Canceled'),
    (RETURNED, 'Returned'),
    (SHIPPED, 'Shipped'),
    (SHIPPED_BACK, 'Shipped Back'),
    (COMPLETED, 'Completed'),
)

NOT_PAID = 'not_paid'
PARTIALLY_PAID = 'partially_paid'
PAID = 'paid'
OVERPAID = 'overpaid'

PAYMENT_STATUSES = (
    (NOT_PAID, 'Not Paid'),
    (PARTIALLY_PAID, 'Partially Paid'),
    (PAID, 'Paid'),
    (OVERPAID, 'Overpaid')
)


class Customer(models.Model):
    email = LowercaseEmailField(max_length=255, db_index=True, unique=True)
    first_name = models.CharField(max_length=30, default='', blank=True)
    last_name = models.CharField(max_length=30, default='', blank=True)
    middle_name = models.CharField(max_length=30, default='', blank=True)
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        default='',
        validators=[PHONE_VALIDATOR]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=100,
        blank=True,
        choices=GENDER_CHOICES,
        default=MALE
    )

    def __str__(self):
        return f'{self.email}'


class Order(models.Model):
    responsible = models.ForeignKey(Account, blank=True, null=True, on_delete=models.SET_NULL, related_name='responsible_for')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.CharField(choices=ORDER_STATUSES, default=NEW, max_length=30, blank=True)
    payment_status = models.CharField(choices=PAYMENT_STATUSES, default=NOT_PAID, max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    place_of_delivery = models.CharField(max_length=300, blank=True, default='')
    latest_editor = models.ForeignKey(Account, blank=True, null=True, on_delete=models.SET_NULL, related_name='latest_editor_for')

    def __str__(self):
        return f'{self.pk}'


class Category(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.title}'


class Good(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    price = models.FloatField(blank=True, default=0.0)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    stock_balance = models.IntegerField(blank=True, default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    vendor_code = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return f'{self.title}: {self.pk}'


class OrderGood(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_goods')
    good = models.ForeignKey(Good, on_delete=models.CASCADE, related_name='order_goods')
    quantity = models.SmallIntegerField(blank=True, default=0)
    price = models.FloatField(blank=True, default=0.0)
    amount = models.FloatField(blank=True, default=0.0)

    def __str__(self):
        return f'order: {self.order_id}, good: {self.good_id}'

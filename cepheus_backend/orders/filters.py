import django_filters
import pytz

from datetime import time, datetime

from django.db.models import Value as V, F
from django.db.models.functions import Concat
from django import forms
from django_filters import rest_framework as filters

from .models import Good, Order, Customer, Category
from .utils import filter_list_method


class DateTimeFieldWithTZ(forms.DateField):
    def __init__(self, *args, **kwargs):
        self.mark = kwargs.pop('mark', None)
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        if value in self.empty_values:
            return None

        day_border = {
            'start': time(),
            'end': time(23, 59, 59, 999999)
        }

        user_date = datetime.strptime(value, '%Y-%m-%d').date()
        full_date = datetime.combine(user_date, day_border.get(self.mark))
        utc_timezone = pytz.timezone("UTC")
        return utc_timezone.localize(full_date)


class DateTimeFilterWithTZ(django_filters.DateFilter):
    field_class = DateTimeFieldWithTZ


class GoodFilters(filters.FilterSet):
    id = django_filters.CharFilter(method='filter_method')
    title = django_filters.CharFilter(lookup_expr='icontains', method='filter_method')
    vendor_code = django_filters.CharFilter(field_name='vendor_code', lookup_expr='icontains', method='filter_method')

    class Meta:
        model = Good
        fields = []

    def filter_method(self, queryset, name, value):
        return filter_list_method(self, queryset, name, value)


class OrderFilters(filters.FilterSet):
    id = django_filters.CharFilter(method='text_search_method')
    responsible_full_name = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')
    customer_email = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')
    created_start = DateTimeFilterWithTZ(field_name='created_at', lookup_expr='gte', mark='start')
    created_end = DateTimeFilterWithTZ(field_name='created_at', lookup_expr='lte', mark='end')
    modified_start = DateTimeFilterWithTZ(field_name='modified_at', lookup_expr='gte', mark='start')
    modified_end = DateTimeFilterWithTZ(field_name='modified_at', lookup_expr='lte', mark='end')

    class Meta:
        model = Order
        fields = ['status', 'payment_status']

    @staticmethod
    def _get_extended_queryset(queryset):
        return queryset.annotate(
            responsible_full_name=Concat('responsible__first_name', V(' '), 'responsible__last_name'),
            customer_email=F('customer__email')
        )

    def text_search_method(self, queryset, name, value):
        qs = self._get_extended_queryset(queryset)
        return filter_list_method(self, qs, name, value)


class CustomerFilters(filters.FilterSet):
    id = django_filters.CharFilter(method='text_search_method')
    full_name = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')
    email = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')

    class Meta:
        model = Customer
        fields = []

    @staticmethod
    def _get_extended_queryset(queryset):
        return queryset.annotate(
            responsible_full_name=Concat('first_name', V(' '), 'last_name')
        )

    def text_search_method(self, queryset, name, value):
        qs = self._get_extended_queryset(queryset)
        return filter_list_method(self, qs, name, value)


class CategoryFilters(filters.FilterSet):
    id = django_filters.CharFilter(method='text_search_method')
    title = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')

    class Meta:
        model = Category
        fields = []

    def text_search_method(self, queryset, name, value):
        return filter_list_method(self, queryset, name, value)

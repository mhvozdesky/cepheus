import django_filters

from django.db.models import Value as V, F
from django.db.models.functions import Concat

from django_filters import rest_framework as filters

from .models import Good, Order
from .utils import filter_list_method


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

    class Meta:
        model = Order
        fields = []

    @staticmethod
    def _get_extended_queryset(queryset):
        return queryset.annotate(
            responsible_full_name=Concat('responsible__first_name', V(' '), 'responsible__last_name'),
            customer_email=F('customer__email')
        )

    def text_search_method(self, queryset, name, value):
        qs = self._get_extended_queryset(queryset)
        return filter_list_method(self, qs, name, value)

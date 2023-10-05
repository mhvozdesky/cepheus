import django_filters

from django_filters import rest_framework as filters

from .models import Good
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

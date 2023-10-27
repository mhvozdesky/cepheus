import django_filters

from django_filters import rest_framework as filters
from django.db.models import Value as V, F
from django.db.models.functions import Concat

from orders.utils import filter_list_method
from .models import Account


class AccountFilters(filters.FilterSet):
    id = django_filters.CharFilter(method='text_search_method')
    full_name = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')
    email = django_filters.CharFilter(lookup_expr='icontains', method='text_search_method')

    class Meta:
        model = Account
        fields = []

    @staticmethod
    def _get_extended_queryset(queryset):
        return queryset.annotate(
            full_name=Concat('first_name', V(' '), 'last_name')
        )

    def text_search_method(self, queryset, name, value):
        qs = self._get_extended_queryset(queryset)
        return filter_list_method(self, qs, name, value)

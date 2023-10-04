import base64
import json

import django_filters

from django_filters import rest_framework as filters
from django.db.models import Q

from .models import Good


class GoodFilters(filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains', method='title_filter_method')
    vendor = django_filters.CharFilter(field_name='vendor_code', lookup_expr='icontains')

    class Meta:
        model = Good
        fields = ('id', 'title', 'vendor')

    def title_filter_method(self, queryset, name, value):
        decoded_bytes = base64.b64decode(value)
        decoded_string = decoded_bytes.decode('utf-8')
        value_list = json.loads(decoded_string)

        q_objects = Q()
        for value in value_list:
            q_objects |= Q(title__icontains=value)
        return queryset.filter(q_objects)

import base64
import json

from binascii import Error as binasciiError
from json.decoder import JSONDecodeError

from django.db.models import Q
from rest_framework.exceptions import ValidationError


def get_value_list(value):
    try:
        decoded_bytes = base64.b64decode(value)
        decoded_string = decoded_bytes.decode('utf-8')
        value_list = json.loads(decoded_string)
    except (binasciiError, JSONDecodeError) as e:
        raise ValidationError(f"Error during decoding: {str(e)}")
    return value_list


def filter_list_method(filter_instance, queryset, name, value):
    value_list = get_value_list(value)

    if not isinstance(value_list, list):
        raise ValidationError("The data must contain a list")

    q_objects = Q()
    filters_dict = filter_instance.get_filters()
    lookup_expr = filters_dict[name].lookup_expr
    for value in value_list:
        q_objects |= Q(**{f'{name}__{lookup_expr}': value})
    return queryset.filter(q_objects)

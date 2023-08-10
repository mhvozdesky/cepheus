from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CepheusPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'page_size': int(self.request.query_params.get('page_size', self.page_size)),
            'page': self.page.number,
            'last_page': self.page.paginator.num_pages,
            'results': data
        })

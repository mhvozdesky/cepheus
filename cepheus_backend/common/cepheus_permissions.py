from rest_framework.permissions import BasePermission


class ForbiddenToAll(BasePermission):
    def has_permission(self, request, view):
        return False

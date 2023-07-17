from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import login, logout
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView


from .models import Account
from .serializers import AccountSerializer, AccountRegisterSerializer, AccountAuthSerializer
from common.cepheus_permissions import ForbiddenToAll


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'pk'

    def get_object(self):
        if self.action == 'update_me':
            return self.request.user
        return super().get_object()

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            permission_classes = [IsAdminUser]
        elif self.action in ['login', 'register']:
            permission_classes = [AllowAny]
        elif self.action in ['create', 'destroy']:
            permission_classes = [ForbiddenToAll]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(methods=['post'], detail=False, serializer_class=AccountRegisterSerializer)
    def register(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        account = serializer.save()
        login(request, user=account)
        return Response(AccountSerializer(account).data, status=201)

    @action(methods=['post'], detail=False, serializer_class=AccountAuthSerializer)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data
        login(request, account)
        return Response({'detail': 'Login successful'}, status=200)

    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        return Response(self.get_serializer(request.user).data, status=200)

    @me.mapping.patch
    def update_me(self, request):
        return self.partial_update(request)

from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.contrib.auth import login, logout
from rest_framework.response import Response


from .models import Account
from .serializers import AccountSerializer, AccountRegisterSerializer, AccountAuthSerializer


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    @action(methods=['post'], detail=False, permission_classes=[AllowAny],
            serializer_class=AccountRegisterSerializer)
    def register(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        account = serializer.save()
        login(request, user=account)
        return Response(serializer.data, status=201)

    @action(methods=['post'], detail=False, serializer_class=AccountAuthSerializer)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data
        login(request, account)
        return Response({'detail': 'Login successful'}, status=200)

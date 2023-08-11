from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from extra_settings.models import Setting as ExtrSetting

from django.contrib.auth import login, logout
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404


from .models import Account, PasswordGenerationToken
from .serializers import AccountSerializer, AccountRegisterSerializer, AccountAuthSerializer,\
    ResetPasswordSerializer
from common.cepheus_permissions import ForbiddenToAll
from .tasks import send_mail_delayed


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all().order_by('-created')
    serializer_class = AccountSerializer
    lookup_field = 'pk'
    allow_registration = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.allow_registration is None:
            self.allow_registration = self.is_registration_allowed()

    @staticmethod
    def is_registration_allowed():
        allow_registration = ExtrSetting.objects.filter(name='ALLOW_REGISTRATION')
        return allow_registration.exists() and allow_registration.first().value

    def get_object(self):
        if self.action == 'update_me':
            return self.request.user
        return super().get_object()

    def get_permissions(self):
        permissions_mapping = {
            'update': [IsAdminUser],
            'partial_update': [IsAdminUser],
            'login': [AllowAny],
            'register': [AllowAny if self.allow_registration else ForbiddenToAll],
            'create': [ForbiddenToAll],
            'destroy': [ForbiddenToAll],
            'reset_password': [AllowAny]
        }
        permission_classes = permissions_mapping.get(self.action, [IsAuthenticated])
        return [permission() for permission in permission_classes]

    def permission_denied(self, request, message=None, code=None):
        permissions = self.get_permissions()
        forbidden_to_all = list(filter(lambda val: isinstance(val, ForbiddenToAll), permissions))
        if len(forbidden_to_all) > 0:
            raise PermissionDenied(detail=message, code=code)
        super().permission_denied(request, message, code)

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

    @action(methods=['post'], detail=False)
    def logout(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'})

    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        return Response(self.get_serializer(request.user).data, status=200)

    @me.mapping.patch
    def update_me(self, request):
        return self.partial_update(request)

    @action(methods=['post'], detail=False, url_path='reset-password')
    def reset_password(self, request):
        email = request.data.get('email')
        if not email:
            raise ValidationError({'detail': 'Email is required'})

        try:
            validate_email(email)
        except DjangoValidationError as e:
            raise ValidationError({'detail': e.message})

        account = get_object_or_404(Account, email=email)
        result = send_mail_delayed.delay('send_pass_generations', account.pk)
        return Response(
            {
                'detail': f'A link to reset your password has been sent to your email. '
                          f'If you did not receive the letter, please contact the administrator '
                          f'and report id {result.task_id}'
            }
        )


class ResetPasswordViewSet(ViewSet):
    def reset(self, request, uidb64, token):
        user = self.get_user_by_uidb64(uidb64)
        token_valid = self.check_token(user, token)
        if not user or not token_valid:
            return Response({'detail': 'Invalid token'}, status=400)
        serializer = ResetPasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['password'])
        user.save()
        self.delete_all_user_tokens(user)
        return Response({'detail': 'New password set'})

    @staticmethod
    def get_user_by_uidb64(uidb64):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            return Account.objects.get(pk=user_id)
        except Exception:
            return None

    @staticmethod
    def check_token(user, token):
        return PasswordGenerationToken.objects.filter(user=user, token=token, active=True).exists()

    @staticmethod
    def delete_all_user_tokens(user):
        PasswordGenerationToken.objects.filter(user=user).delete()

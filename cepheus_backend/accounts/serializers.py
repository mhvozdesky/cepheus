from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError

from .models import Account
from common.error_messages import RE_PASSWORD_NOT_EQUAL, WRONG_EMAIL_OR_PASSWORD


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        exclude = ['is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data.pop('password')
        instance = super().create(validated_data)
        return instance


class AccountRegisterSerializer(AccountSerializer):
    re_password = serializers.CharField(required=True, write_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_re_password(self, value):
        request = self.context.get('request')
        if request and request.data.get('password'):
            password = request.data.get('password')
            if password != value:
                raise ValidationError(RE_PASSWORD_NOT_EQUAL)
        return value

    def create(self, validated_data):
        if 're_password' in validated_data:
            validated_data.pop('re_password')
        raw_password = validated_data['password']
        validated_data['password'] = make_password(raw_password)
        instance = serializers.ModelSerializer.create(self, validated_data)
        return instance


class AccountAuthSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, data):
        email, password = data['email'].lower(), data['password']
        account = authenticate(request=self.context['request'], email=email,
                               password=password)
        if account is None:
            raise serializers.ValidationError(WRONG_EMAIL_OR_PASSWORD)

        return account

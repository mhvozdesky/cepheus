from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import RegexValidator

from common.custom_model_fields import LowercaseEmailField
from common.constants import GENDER_CHOICES, MALE, PHONE_REGEXP, PHONE_VALIDATION_MSG


PHONE_VALIDATOR = RegexValidator(PHONE_REGEXP, message=PHONE_VALIDATION_MSG)


class AccountManager(BaseUserManager):
    def create_user(self, *, password=None, **extra_fields):
        user = self.model(**extra_fields)
        if password is None:
            user.set_unusable_password()
        else:
            user.set_password(password)
        self._for_write = True
        user.save(force_insert=True, using=self.db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = self.create_user(
            email=email,
            password=password,
            is_superuser=True, is_staff=True,
            **extra_fields
        )
        return user


class Account(AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    email = LowercaseEmailField('Email', max_length=255, db_index=True, unique=True)
    created = models.DateTimeField('Created date', auto_now_add=True)
    modified = models.DateTimeField('Last modified date', auto_now=True)
    is_active = models.BooleanField('Active', default=True)
    is_staff = models.BooleanField(
        'Staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site.'
    )
    first_name = models.CharField(max_length=30, default='', blank=True)
    last_name = models.CharField(max_length=30, default='', blank=True)
    gender = models.CharField(
        max_length=100,
        blank=True,
        choices=GENDER_CHOICES,
        default=MALE
    )
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        default='',
        validators=[PHONE_VALIDATOR]
    )

    objects = AccountManager()

    def save(self, *args, **kwargs):
        created = not self.pk
        if created and not self.password:
            self.set_unusable_password()
        self.full_clean()
        super().save(*args, **kwargs)

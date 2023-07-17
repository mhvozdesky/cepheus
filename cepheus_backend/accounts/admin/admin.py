from django.contrib import admin

from accounts.models import Account


class AccountAdmin(admin.ModelAdmin):
    fieldsets = [
        (
            'Common information',
            {
                'fields': ['email', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone_number']
            }
        ),
        (
            'special information',
            {
                'fields': ['is_active', 'created', 'modified', 'last_login']
            }
        ),
        (
            'Permissions',
            {
                'fields': ['is_staff', 'is_superuser', 'groups', 'user_permissions']
            }
        )
    ]
    readonly_fields = ['created', 'modified', 'last_login']
    list_display = [
        'email',
        'first_name',
        'last_name'
    ]
    search_fields = ['email']


admin.site.register(Account, AccountAdmin)

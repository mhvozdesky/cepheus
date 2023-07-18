from django.contrib import admin
from django.utils.html import format_html

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
        ),
        (
            'Actions',
            {
                'fields': ['send_create_password_btn']
            }
        )
    ]
    readonly_fields = ['created', 'modified', 'last_login', 'send_create_password_btn']
    list_display = [
        'email',
        'first_name',
        'last_name'
    ]
    search_fields = ['email']

    def send_create_password_btn(self, obj):
        return format_html(
            '<div class="btn-wrapper"><div class="button send-email-btn" '
            'data-email_type_id="user_create_password" data-user_id="{}">Send create password email</div></div>',
            obj.pk,
        )

    send_create_password_btn.short_description = 'Send create password email'

    class Media:
        js = ('admin/custom_js/emails_actions.js',)
        css = {'all': ('admin/custom_css/custom_styles.css',)}


admin.site.register(Account, AccountAdmin)

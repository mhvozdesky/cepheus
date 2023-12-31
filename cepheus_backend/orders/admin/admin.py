from django.contrib import admin

from ..models import Customer, Order, Category, Good, OrderGood
from .forms import GoodAdminForm


class OrderGoodInline(admin.TabularInline):
    model = OrderGood
    extra = 0


class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderGoodInline]

    class Media:
        js = ('admin/custom_js/orders.js',)


class GoodAdmin(admin.ModelAdmin):
    form = GoodAdminForm


admin.site.register(Customer)
admin.site.register(Order, OrderAdmin)
admin.site.register(Category)
admin.site.register(Good, GoodAdmin)

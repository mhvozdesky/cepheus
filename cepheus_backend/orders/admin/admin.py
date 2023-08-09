from django.contrib import admin

from ..models import Customer, Order, Category, Good, OrderGood


class OrderGoodInline(admin.TabularInline):
    model = OrderGood
    extra = 0


class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderGoodInline]


admin.site.register(Customer)
admin.site.register(Order, OrderAdmin)
admin.site.register(Category)
admin.site.register(Good)

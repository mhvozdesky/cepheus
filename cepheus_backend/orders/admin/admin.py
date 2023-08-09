from django.contrib import admin

from ..models import Customer, Order, Category, Good


admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(Good)

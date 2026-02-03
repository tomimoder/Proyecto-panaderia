from django.contrib import admin
from .models import orders
# Register your models here.

@admin.register(orders)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'product', 'quantity', 'price', 'delivery_date', 'status', 'created_at']
    list_filter = ['status', 'delivery_date', 'created_at']
    search_fields = ['customer_name', 'phone', 'product']
    ordering = ['-created_at']
    date_hierarchy = 'delivery_date'
    
    # Campos de solo lectura
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    # Organización de campos en el formulario
    fieldsets = (
        ('Información del Cliente', {
            'fields': ('customer_name', 'phone')
        }),
        ('Detalles del Pedido', {
            'fields': ('product', 'quantity', 'price', 'delivery_date', 'notes')
        }),
        ('Estado', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)  # sección colapsable
        }),
    )

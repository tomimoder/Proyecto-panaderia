from django.utils import timezone
from django.db import models

# Create your models here.

class orders(models.Model):
    customer_name = models.CharField(max_length = 150, db_index = True)
    phone = models.CharField(max_length = 150)
    product = models.CharField(max_length = 150)
    quantity = models.IntegerField(default = 0)
    price = models.DecimalField(max_digits = 10, decimal_places = 2, help_text = "Precio unitario del producto")
    delivery_date = models.DateField(null = False, blank = False, db_index = True)
    notes = models.TextField(null = True, blank = True)
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente de procesar'),
        ('entregado', 'Porducto entregado'),
        ('cancelado', 'Producto cancelado')
    ]
    status = models.CharField(max_length = 20, choices = STATUS_CHOICES, default = 'pendiente')
    created_at = models.DateTimeField(auto_now_add = True)
    delivered_at = models.DateTimeField(null = True, blank = True)
    updated_at = models.DateTimeField(auto_now = True)

    def save(self, *args, **kwargs):
        if self.status == 'entregado' and not self.delivered_at:
            self.delivered_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer_name} - {self.product}"


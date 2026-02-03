from django.shortcuts import render
from rest_framework import viewsets
from .models import orders
from .serializer import OrderSerializer
from django.utils import timezone



# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = orders.objects.all()
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Si se está marcando como entregado, guardar la fecha
        if request.data.get('status') == 'entregado' and instance.status != 'entregado':
            request.data['delivered_at'] = timezone.now()
        
        return super().partial_update(request, *args, **kwargs)
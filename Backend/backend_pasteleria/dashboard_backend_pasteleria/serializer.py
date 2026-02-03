from .models import orders
from rest_framework import serializers

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = orders
        fields = '__all__'
        read_only__fields = ['id', 'created_at', 'update_at']
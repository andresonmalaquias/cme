from django_filters import filterset
from core import models


class UserFilter(filterset.FilterSet):
    class Meta:
        models = models.User
        fields = ['id', 'username', 'is_active']


class MaterialFilter(filterset.FilterSet):
    class Meta:
        models = models.Material
        fields = ['id', 'name', 'expiration_date', 'serial']

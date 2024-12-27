from django.db.models import Q
from django_filters import filterset
from core import models


class UserFilter(filterset.FilterSet):
    search = filterset.CharFilter(method='filter_search')

    @staticmethod
    def filter_search(queryset, name, value):
        return queryset.filter(Q(username__unaccent__icontains=value) | Q(name__unaccent__icontains=value))

    class Meta:
        model = models.User
        fields = ['username', 'name', 'search']


class MaterialFilter(filterset.FilterSet):
    search = filterset.CharFilter(method='filter_search')

    @staticmethod
    def filter_search(queryset, name, value):
        return queryset.filter(Q(username__unaccent__icontains=value) | Q(name__unaccent__icontains=value))

    class Meta:
        model = models.Material
        fields = ['id', 'name', 'expiration_date', 'serial']

from rest_framework import serializers

from core import models


class SerializerBase(serializers.HyperlinkedModelSerializer):
    def get_field_names(self, declared_fields, info):
        fields = super().get_field_names(declared_fields, info)
        fields.insert(0, 'id')
        return fields


class UserSerializer(SerializerBase):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = models.User
        fields = ['id', 'username', 'password', 'name', 'type']


class MaterialSerializer(SerializerBase):
    class Meta:
        model = models.Material
        fields = '__all__'


class MaterialProcessSerializer(SerializerBase):
    # material_id = serializers.IntegerField(source='material__id')

    class Meta:
        model = models.MaterialProcess
        fields = '__all__'

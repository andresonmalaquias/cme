from rest_framework import serializers


class MaterialSerializer(serializers.Serializer):
    # material_id = serializers.IntegerField(required=True)
    failure_occurred = serializers.BooleanField(required=True)
    failure_description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_failure_recoverable = serializers.BooleanField(required=False, allow_null=True)

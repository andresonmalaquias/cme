from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from core import models, serializers, filters, requests_serializer, actions


class BaseViewSet(viewsets.ModelViewSet):
    #permission_classes = [IsAuthenticated]
    ordering_fields = '__all__'
    ordering = ('-id',)


class UserViewSet(BaseViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    filter_class = filters.UserFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.set_password(raw_password=request.data.get('password'))
        user.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MaterialViewSet(BaseViewSet):
    queryset = models.Material.objects.all()
    serializer_class = serializers.MaterialSerializer
    filter_class = filters.MaterialFilter

    @action(detail=False, methods=['POST'])
    def next_step(self, request, *args, **kwargs):
        rs = requests_serializer.MaterialSerializer(data=request.data)
        rs.is_valid(raise_exception=True)

        actions.MaterialActions.create_next_step_to_material(**rs.validated_data)

        return Response(status=status.HTTP_200_OK, data={'detail': True})

    @action(detail=True, methods=['GET'])
    def get_step_serial(self, request, pk, *args, **kwargs):
        data = actions.MaterialActions.get_steps_a_serial_has_passed(pk)

        return Response(status=status.HTTP_200_OK, data=data)

    @action(detail=False, methods=['GET'])
    def generate_pdf_report(self, request, *args, **kwargs):
        material_actions = actions.MaterialActions()
        return material_actions.generate_pdf_report()

    @action(detail=False, methods=['GET'])
    def generate_xlsx_report(self, request, *args, **kwargs):
        material_actions = actions.MaterialActions()
        return material_actions.generate_xlsx_report()


class MaterialProcessViewSet(BaseViewSet):
    queryset = models.MaterialProcess.objects.all()
    serializer_class = serializers.MaterialProcessSerializer

from io import BytesIO

from django.db.models import Count, Q
from django.http import HttpResponse
from reportlab.pdfgen import canvas
import openpyxl
from uuid import UUID
from core import models, serializers


class MaterialActions:
    @staticmethod
    def create_next_step_to_material(material_process_id: int, failure_occurred: bool, failure_description: str = None,
                                     is_failure_recoverable: bool = None):
        """
        Caso uma falha ocorrá e for recuperável, então retorna para a etapa de Recebimento
        Caso a falha não for recuperável, então Inativa o material
        Caso contrário, segue para a próxima etapa
        """
        material_process = models.MaterialProcess.objects.get(id=material_process_id)
        print(failure_occurred, is_failure_recoverable)

        if not material_process:
            raise ValueError(f'MaterialProcess ID not found.')

        if failure_occurred:
            material_process.failure_occurred = failure_occurred
            material_process.failure_description = failure_description
            material_process.is_failure_recoverable = is_failure_recoverable

            if is_failure_recoverable:
                models.MaterialProcess(
                    material=material_process.material,
                    step=models.MaterialProcess.StepChoices.RECEIVING
                ).save()
            else:
                material = material_process.material
                material.is_active = False
                material.save()

            material_process.save()
        else:
            next_step = material_process.NEXT_STEP.get(material_process.step, material_process.StepChoices.RECEIVING)
            models.MaterialProcess(
                material=material_process.material,
                step=next_step
            ).save()

    @staticmethod
    def get_steps_a_serial_has_passed(material_id: int):
        """
        Pega todos os passos em que um séria passou pelo Id do material
        """
        queryset = models.MaterialProcess.objects.filter(
            material__id=material_id
        ).order_by('-step_date')
        serializer = serializers.MaterialProcessSerializer(queryset, many=True, context={'request': None})
        return serializer.data

    @staticmethod
    def get_serial_information():
        """
        Relaciona as informações do material com os processos que o material já percorreu.
        Realizando a contagem das falhas e quantas vezes o material chegou na etapa de Distribuição sem falhas.
        Contabilizando também as vezes em que ocorreu erros em uma das etapas.
        """
        return list(
            models.Material.objects
            .annotate(
                distribution_success_count=Count(
                    'processes',
                    filter=Q(processes__step='D', processes__failure_occurred=False)
                ),
                total_failure_count=Count(
                    'processes',
                    filter=Q(processes__failure_occurred=True)
                )
            )
            .order_by('serial')
            .values('serial', 'distribution_success_count', 'total_failure_count')
        )

    def generate_pdf_report(self):
        data = self.get_serial_information()
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer)

        pdf.drawString(100, 800, "Relatório de Seriais - Processos e Falhas")
        pdf.drawString(100, 780, "Serial Number | Concluído | Falhas Gerais")

        y = 760
        for entry in data:
            serial_number = str(entry['serial'])
            distribution_success_count = entry['distribution_success_count']
            total_failure_count = entry['total_failure_count']

            # Escreve as informações no PDF
            pdf.drawString(100, y, f"{serial_number} | {distribution_success_count} | {total_failure_count}")
            y -= 20

        pdf.save()

        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
        response['Content-Disposition'] = 'attachment; filename="serial_report.pdf"'

        return response

    def generate_xlsx_report(self):
        data = self.get_serial_information()
        buffer = BytesIO()
        workbook = openpyxl.Workbook()
        sheet = workbook.active

        # Gera o cabeçalhos
        sheet.append(["Serial Number", "Concluído", "Falhas Gerais"])

        # Trata os dados
        for entry in data:
            serial_number = str(entry['serial'])
            distribution_success_count = entry['distribution_success_count']
            total_failure_count = entry['total_failure_count']

            # Adiciona os dados à planilha
            sheet.append([serial_number, distribution_success_count, total_failure_count])

        workbook.save(buffer)

        buffer.seek(0)

        response = HttpResponse(buffer.getvalue(),
                                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response['Content-Disposition'] = 'attachment; filename="serial_report.xlsx"'
        return response

import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from core import managers


class User(AbstractUser):
    class Type(models.TextChoices):
        TECHNICAL = 'T', 'Técnico'
        NURSING = 'N', 'Enfermagem'
        ADMIN = 'A', 'Administrativo'

    username = models.CharField(
        db_column='tx_username',
        null=False,
        max_length=64,
        unique=True
    )
    password = models.CharField(
        db_column='tx_password',
        null=False,
        max_length=128,
    )
    name = models.CharField(
        db_column='tx_name',
        null=True,
        max_length=256
    )
    email = models.CharField(
        db_column='tx_email',
        null=True,
        blank=True,
        max_length=256
    )
    last_login = models.DateTimeField(
        db_column='dt_last_login',
        null=True
    )
    is_active = models.BooleanField(
        db_column='cs_active',
        null=False,
        default=True
    )
    is_superuser = models.BooleanField(
        db_column='cs_superuser',
        null=True,
        default=False
    )
    is_staff = models.BooleanField(
        db_column='cs_staff',
        null=True,
        default=False
    )
    is_default = models.BooleanField(
        db_column='cs_default',
        null=False,
        default=False
    )
    type = models.CharField(
        db_column='cs_type',
        max_length=1,
        null=False,
        default=Type.ADMIN,
        choices=Type.choices,
        verbose_name= 'Type'
    )

    objects = managers.UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name']

    class Meta:
        managed = True
        db_table = 'auth_user'


class ModelBase(models.Model):
    id = models.BigAutoField(
        db_column='id',
        primary_key=True
    )
    created_at = models.DateTimeField(
        db_column='dt_created',
        auto_now_add=True,
        null=True,
        blank=True,
        verbose_name='Created at'
    )
    modified_at = models.DateTimeField(
        db_column='dt_modified',
        auto_now=True,
        null=True,
        blank=True,
        verbose_name='Modified at'
    )
    is_active = models.BooleanField(
        db_column='cs_active',
        null=False,
        default=True,
        verbose_name='Active'
    )

    class Meta:
        abstract = True


class Material(ModelBase):
    name = models.CharField(
        db_column='tx_name',
        null=False,
        max_length=256
    )
    material_type = models.CharField(
        db_column='tx_material_type',
        null=False,
        max_length=100
    )
    expiration_date = models.DateField(
        db_column='dt_expiration_date',
        null=False,
    )
    serial = models.UUIDField(
        db_column='uuid_serial',
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    class Meta:
        managed = True
        db_table = 'core_material'
        verbose_name = 'Material'
        verbose_name_plural = 'Materials'


class MaterialProcess(ModelBase):
    class StepChoices(models.TextChoices):
        RECEIVING = 'R', 'Recebimento'
        WASHING = 'W', 'Lavagem'
        STERILIZATION = 'S', 'Esterilização'
        DISTRIBUTION = 'D', 'Distribuição'

    NEXT_STEP: dict = {
        StepChoices.RECEIVING: StepChoices.WASHING,
        StepChoices.WASHING: StepChoices.STERILIZATION,
        StepChoices.STERILIZATION: StepChoices.DISTRIBUTION,
        StepChoices.DISTRIBUTION: StepChoices.RECEIVING,
    }

    step = models.CharField(
        max_length=1,
        choices=StepChoices.choices,
        default=StepChoices.RECEIVING
    )
    step_date = models.DateTimeField(
        auto_now_add=True
    )
    failure_occurred = models.BooleanField(
        default=False
    )
    failure_description = models.TextField(
        blank=True,
        null=True
    )
    is_failure_recoverable = models.BooleanField(
        null=True
    )
    material = models.ForeignKey(
        'Material',
        on_delete=models.DO_NOTHING,
        db_column='id_material',
        db_index=False,
        related_name='processes',
        verbose_name='Material'
    )

    class Meta:
        managed = True
        db_table = 'core_material_process'
        verbose_name = 'Material Process'
        verbose_name_plural = 'Materials Processes'

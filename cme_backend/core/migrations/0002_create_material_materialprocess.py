from django.db import migrations, models
import django.db.models.deletion
import uuid
from core.models import User


def create_default_user(apps, schema_editor):
    User.objects.create_user(
        username='admin',
        password='Senha123#',
        first_name='Admin',
        last_name='Admin',
        is_superuser=True,
        is_staff=True,
        is_active=True,
        is_default=True
    )


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='dt_created', null=True, verbose_name='Created at')),
                ('modified_at', models.DateTimeField(auto_now=True, db_column='dt_modified', null=True, verbose_name='Modified at')),
                ('is_active', models.BooleanField(db_column='cs_active', default=True, verbose_name='Active')),
                ('name', models.CharField(db_column='tx_name', max_length=256)),
                ('2material_type', models.CharField(db_column='tx_material_type', max_length=100)),
                ('expiration_date', models.DateField(db_column='dt_expiration_date')),
                ('serial', models.UUIDField(db_column='uuid_serial', default=uuid.uuid4, editable=False, unique=True)),
            ],
            options={
                'verbose_name': 'Material',
                'verbose_name_plural': 'Materials',
                'db_table': 'core_material',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='MaterialProcess',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='dt_created', null=True, verbose_name='Created at')),
                ('modified_at', models.DateTimeField(auto_now=True, db_column='dt_modified', null=True, verbose_name='Modified at')),
                ('is_active', models.BooleanField(db_column='cs_active', default=True, verbose_name='Active')),
                ('step', models.CharField(choices=[('R', 'Recebimento'), ('W', 'Lavagem'), ('S', 'Esterilização'), ('D', 'Distribuição')], default='R', max_length=1)),
                ('step_date', models.DateTimeField(auto_now_add=True)),
                ('failure_occurred', models.BooleanField(default=False)),
                ('failure_description', models.TextField(blank=True, null=True)),
                ('is_failure_recoverable', models.BooleanField(null=True)),
                ('material', models.ForeignKey(db_column='id_material', db_index=False, on_delete=django.db.models.deletion.CASCADE, related_name='processes', to='core.material', verbose_name='Material')),
            ],
            options={
                'verbose_name': 'Material Process',
                'verbose_name_plural': 'Materials Processes',
                'db_table': 'core_material_process',
                'managed': True,
            },
        ),
        migrations.RunPython(create_default_user),  # Adicionando a criação do usuário padrão
    ]

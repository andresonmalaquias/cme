from django.contrib.auth.base_user import BaseUserManager

from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, name, password, **extra_fields):
        if not username:
            raise ValueError('The given username must be set')
        username = self.model.normalize_username(username)
        user = self.model(username=username, name=name, **extra_fields)
        user.set_password(raw_password=password)
        user.save(using=self._db)
        return user

    def create_user(self, username, name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_default', False)
        return self._create_user(username, name, password, **extra_fields)

    def create_superuser(self, username, name, password, **extra_fields):
        from core.models import User

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_default', False)
        extra_fields.setdefault('type', User.Type.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, name, password, **extra_fields)


class MaterialProcessManager(models.Manager):
    def save(self,*args, **kwargs):
        """
        Caso uma falha ocorrá e for recuperável, então retorna para o passo 'Recebimento'
        Caso a falha não for recuperável, então Inativa o material
        Caso contrário, segue para a próxima etapa
        """
        if self.failure_occurred:
            if self.is_failure_recoverable:
                self.step = self.StepChoices.RECEBIMENTO
            else:
                self.material.is_active = False
                self.material.save()
        else:
            next_step = self.NEXT_STEP.get(self.step, self.StepChoices.RECEBIMENTO)
            self.step = next_step

        super().save(*args, **kwargs)


from django.db.models.signals import post_save
from django.dispatch import receiver

from core import models


@receiver(post_save, sender=models.Material, weak=False, dispatch_uid='post_save_material')
def post_save_material(sender, instance, created, **kwargs):
    if created:
        models.MaterialProcess(material=instance).save()

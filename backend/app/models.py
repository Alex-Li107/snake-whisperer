from django.db import models
from django.utils import timezone


# Create your models here.
class PastMessages(models.Model):
    title = models.CharField(max_length=100)
    messages = models.JSONField(default=dict)
    date_modified = models.DateTimeField(auto_now=True, blank=True)

    def save(self, *args, **kwargs):
        self.date_modified = timezone.now()
        super(PastMessages, self).save(*args, **kwargs)

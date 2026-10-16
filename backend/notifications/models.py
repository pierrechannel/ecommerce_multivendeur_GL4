import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=40)
    contenu = models.TextField()
    lu = models.BooleanField(default=False)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notification"
        ordering = ["-cree_le"]

    def __str__(self):
        return f"{self.type} -> {self.utilisateur}"


class JournalAudit(models.Model):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="journaux_audit",
    )
    action = models.CharField(max_length=60)
    entite = models.CharField(max_length=60, blank=True)
    entite_id = models.UUIDField(null=True, blank=True)
    details = models.JSONField(null=True, blank=True)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "journal_audit"

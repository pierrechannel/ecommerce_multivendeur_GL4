from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["utilisateur", "type", "lu", "cree_le"]
    list_filter = ["type", "lu", "cree_le"]

from rest_framework import permissions, viewsets

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == "admin":
            return Notification.objects.select_related("utilisateur")
        return Notification.objects.filter(utilisateur=user)

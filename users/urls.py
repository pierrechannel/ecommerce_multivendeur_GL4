from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BoutiqueViewSet, RegisterView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("boutiques", BoutiqueViewSet)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("", include(router.urls)),
]

from django.conf import settings as django_settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', lambda request: redirect('admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include(django_settings.SITE_URLS)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

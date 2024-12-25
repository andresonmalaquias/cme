from rest_framework import routers

from core import viewsets


class DefaultRouter(routers.DefaultRouter):
    routers = dict()

    def register(self, prefix, viewset, basename=None):
        if basename is None:
            basename = self.get_default_basename(viewset)

        self.routers[prefix] = (prefix, viewset, basename)
        self.registry = list(self.routers.values())

        # invalidate the urls cache
        if hasattr(self, '_urls'):
            del self._urls


routers = DefaultRouter()
routers.register(r'user', viewsets.UserViewSet)
routers.register(r'material', viewsets.MaterialViewSet)
routers.register(r'material_process', viewsets.MaterialProcessViewSet)

urlpatterns = routers.urls

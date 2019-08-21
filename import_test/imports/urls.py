from django.conf.urls import url
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^add/$', views.add, name='add'),
    url(r'^upload/$', views.upload, name='upload'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

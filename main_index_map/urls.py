from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^addresses/create$', views.add_address, name='add_address'),
    url(
        r'^addresses/remove_all$',
        views.remove_all_addresses,
        name='remove_all_addresses'
    ),
]

from channels.routing import URLRouter
from django.urls import path

from main import routing as main_routing

websocket_urlpatterns = [
    path('', URLRouter(main_routing.websocket_urlpatterns))
]

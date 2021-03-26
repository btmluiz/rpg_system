from django.urls import path

from main import consumers

websocket_urlpatterns = [
    path('ws/room/<int:id>', consumers.RoomConsumer.as_asgi()),
]

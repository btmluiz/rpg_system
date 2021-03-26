import asyncio
from threading import Timer

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from main.models import Room
from main.serializers import LiveRoomDetailSerializer
from rpg_system.utils import validate_token, get_data


class RoomConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._manager = self.Manager(self)
        self._timout = None

    async def connect(self):
        await self.accept()

        await self.send_json({
            "type": "info",
            "data": "You has 5 seconds to send authorization code util the connection be close."
        })

        self._timout = Timer(5.0, lambda: asyncio.run(self._timeout_connection()))
        self._timout.start()

    async def disconnect(self, code):
        if self._manager.room_name:
            await self.channel_layer.group_discard(
                self._manager.room_name,
                self.channel_name
            )
            await self._print("disconnected")

    async def receive_json(self, content, **kwargs):
        if content['type'] == 'authorization':
            await self._print("Authorization received:", content['data']['Authorization'])
            await self._manager.authorization(content['data']['Authorization'])
            if self._timout is not None:
                self._timout.cancel()
                await self._print("timer canceled")
        elif content['type'] == "setup_room":
            await self._print("Setup room request received")
            await self._manager.setup_room()
        else:
            await self._print("Unknown request received", content)

    async def room_message(self, message):
        await self.send_json(message["content"])

    async def _timeout_connection(self):
        await self.send_json({
            "type": "authorization_response",
            "data": {
                "accepted": False,
                "message": "Authorization code did not send, connection timeout."
            }
        })
        await self.close()
        await self._print("timeout, authorization code was not send.")

    async def close(self, code=None):
        await super().close()
        await self._print("closed")

    async def _print(self, *args, **kwargs):
        await sync_to_async(print)("Room - %s:" % self._manager.room_name, *args, **kwargs)

    class Manager:
        def __init__(self, outer):
            self._room = None
            self._room_group_id = None
            self._user = None
            self._player = None
            self.room_name = ""
            self.outer = outer

        async def authorization(self, token):
            self._user = await sync_to_async(validate_token)(token)
            await self.outer.send_json({
                "type": "authorization_response",
                "data": {
                    "accepted": True
                }
            })

        async def setup_room(self):
            try:
                room_id = self.outer.scope['url_route']['kwargs']['id']
                self._room = await sync_to_async(Room.objects.get)(pk=room_id)
                self._player = await sync_to_async(self._room.players.get)(user__pk=self._user.pk)
                self.room_name = "%s-%s" % (room_id, self._player.pk)

                await self.outer.channel_layer.group_add(
                    self.room_name,
                    self.outer.channel_name
                )

                serializer = await sync_to_async(LiveRoomDetailSerializer)(instance=self._room, user=self._user.pk)
                data = await sync_to_async(get_data)(serializer)
                await self._print(data)
                await self.outer.send_json({
                    "type": "setup_room",
                    "data": data
                })
            except Exception as e:
                raise e

        async def _print(self, *args, **kwargs):
            await sync_to_async(print)("(Manager) Room - %s:" % self.room_name, *args, **kwargs)


class TestConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

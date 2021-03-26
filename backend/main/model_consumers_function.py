from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from main.models import Player, Room
from main.serializers import DetailObjectSerializer, DetailRoomSerializer


def send_mensage(channel_name, type, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(channel_name, {
        "type": "room_message",
        "content": {
            "type": type,
            "data": data
        }
    })


def update_details_object(details_object):
    try:
        player = Player.objects.get(details=details_object)
        room = Room.objects.get(players__pk=player.pk)
        room_name = "%s-%s" % (room.pk, player.pk)
        data = DetailObjectSerializer(instance=details_object, read_only=True).data

        send_mensage(room_name, "player_detail_update", data)
    except Player.DoesNotExist:
        try:
            room = Room.objects.get(details__pk=details_object.pk)
            detail = room.details.get(pk=details_object.pk)
            for player in room.players.all():
                room_name = "%s-%s" % (room.pk, player.pk)
                data = DetailRoomSerializer(instance=detail, read_only=True).data

                send_mensage(room_name, "room_detail_update", data)
        except Room.DoesNotExist:
            pass

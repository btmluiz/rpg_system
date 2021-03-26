from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from main.models import RpgUser, Player, Room, Template, RoomDetailObject, DetailObject


class RpgUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RpgUser
        fields = ('id', 'username',)


class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(method_name='get_username')

    def get_username(self, rpguser):
        return rpguser.user.username

    class Meta:
        model = Player
        fields = ('id', 'username',)


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ('id', 'name', 'data')


class RoomSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    master = RpgUserSerializer(read_only=True)
    template = TemplateSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'name', 'master', 'players', 'template')


class RoomsPlayerSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField(method_name='get_rooms')

    def get_rooms(self, player):
        rooms = Room.objects.filter(players__in=player)
        return RoomSerializer(many=True, read_only=True, instance=rooms).data

    class Meta:
        model = Player
        fields = ('rooms',)


class RpgUserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = RpgUser
        fields = ('token', 'username', 'password')


class DetailObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailObject
        fields = ('id', 'data',)


class DetailRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomDetailObject
        fields = ('id', 'name', 'data')


class LivePlayerRoomSerializer(serializers.ModelSerializer):
    details = DetailObjectSerializer(read_only=False)

    class Meta:
        model = Player
        fields = ('id', 'details',)


class LiveRoomDetailSerializer(serializers.ModelSerializer):
    master = RpgUserSerializer(read_only=True)
    details = DetailRoomSerializer(read_only=True, many=True)
    player = serializers.SerializerMethodField('get_player')

    def __init__(self, user, instance: Room = None, **kwargs):
        super().__init__(instance=instance, **kwargs)
        self.player = instance.players.get(user__pk=user)

    def get_player(self, player):
        return LivePlayerRoomSerializer(instance=self.player).data

    class Meta:
        model = Room
        fields = ('id', 'name', 'master', 'details', 'player')

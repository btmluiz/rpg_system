from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from main.models import RpgUser, Master, Player, Room


class RpgUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RpgUser
        fields = ('username',)


class MasterSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(method_name='get_username')

    def get_username(self, rpguser):
        return rpguser.user.username

    class Meta:
        model = Master
        fields = ('username',)


class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(method_name='get_username')

    def get_username(self, rpguser):
        return rpguser.user.username

    class Meta:
        model = Player
        fields = ('username',)


class RoomSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    master = MasterSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ('name', 'master', 'players')


class RoomsPlayerSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField(method_name='get_rooms')

    def get_rooms(self, player):
        rooms = Room.objects.filter(players=player)
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

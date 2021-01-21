from django.shortcuts import render

# Create your views here.
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import Room, Player, RpgUser
from main.serializers import RpgUserSerializer, RpgUserSerializerWithToken, RoomSerializer, RoomsPlayerSerializer


@api_view(['GET'])
def current_user(request):
    serializer = RpgUserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def get_rooms(request):
    player = Player.objects.get(user=request.user.pk)
    serializer = RoomsPlayerSerializer(player)
    return Response(serializer.data)


class RpgUserList(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = RpgUserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

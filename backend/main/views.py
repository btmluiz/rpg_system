from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt import authentication

from main.models import Room, Player, RpgUser
from main.serializers import RpgUserSerializer, RpgUserSerializerWithToken, RoomSerializer, RoomsPlayerSerializer, \
    TemplateSerializer


def teste(request):
    return HttpResponse(
        "<div>Teste de html</div>"
    )


@api_view(['GET'])
def current_user(request):
    serializer = RpgUserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def get_rooms(request):
    players = Player.objects.filter(user=request.user.pk)
    serializer = RoomsPlayerSerializer(players)
    return Response(serializer.data)


@api_view(['GET'])
def get_room(request, pk=None):
    if type(pk) is int:
        room = Room.objects.get(pk=pk)
        return JsonResponse(room.room_template.data, safe=False)


class RoomList(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication, authentication.JSONWebTokenAuthentication]
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        players = Player.objects.filter(user__pk=request.user.pk)
        serializer = RoomsPlayerSerializer(players)
        return Response(serializer.data)

    def put(self, request, format=None):
        serializer = RoomsPlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RpgUserList(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = RpgUserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

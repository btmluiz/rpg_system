from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class RpgUser(User):
    pass


class DetailObject(models.Model):
    data = models.JSONField()


class Master(models.Model):
    user = models.ForeignKey(RpgUser, on_delete=models.CASCADE)


class Player(models.Model):
    user = models.ForeignKey(RpgUser, on_delete=models.CASCADE)
    details = models.ForeignKey(DetailObject, on_delete=models.CASCADE)


class RoomDetailObject(DetailObject):
    name = models.CharField(max_length=255, null=False, blank=False)


class Room(models.Model):
    master = models.ForeignKey(Master, on_delete=models.CASCADE)
    players = models.ManyToManyField(Player)
    details = models.ManyToManyField(RoomDetailObject)

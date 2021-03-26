from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class RpgUser(User):
    class Meta:
        verbose_name = "RpgUser"

    def __str__(self):
        return "id#%i - %s" % (self.pk, self.username)


class DetailObject(models.Model):
    data = models.JSONField()

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save(force_insert, force_update, using, update_fields)
        from main.model_consumers_function import update_details_object
        update_details_object(self)

    def __str__(self):
        return "id#%i - DetailObject" % self.pk


class Player(models.Model):
    user = models.ForeignKey(RpgUser, on_delete=models.CASCADE)
    details = models.ForeignKey(DetailObject, on_delete=models.CASCADE)

    def __str__(self):
        return "id#%i - %s" % (self.pk, self.user.username)


class RoomDetailObject(DetailObject):
    name = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return "id#%i - %s" % (self.pk, self.name)


class Template(models.Model):
    name = models.CharField(max_length=255)
    data = models.JSONField(default=dict)

    def __str__(self):
        return "id#%i - %s" % (self.pk, self.name)


class Room(models.Model):
    name = models.CharField(max_length=255)
    master = models.ForeignKey(RpgUser, on_delete=models.CASCADE)
    players = models.ManyToManyField(Player)
    details = models.ManyToManyField(RoomDetailObject)
    room_template = models.ForeignKey(Template, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return "id#%i - %s" % (self.pk, self.name)

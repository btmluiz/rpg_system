from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from main.models import RpgUser, Master, Player, DetailObject, RoomDetailObject, Room

admin.site.register(RpgUser, UserAdmin)
admin.site.register(Master)
admin.site.register(Player)
admin.site.register(DetailObject)
admin.site.register(RoomDetailObject)
admin.site.register(Room)

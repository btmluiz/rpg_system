from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from main.models import RpgUser, Player, DetailObject, RoomDetailObject, Room, Template

admin.site.register(RpgUser, UserAdmin)
admin.site.register(Player)
admin.site.register(DetailObject)
admin.site.register(RoomDetailObject)
admin.site.register(Template)
admin.site.register(Room)

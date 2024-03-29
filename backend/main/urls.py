from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from main import views

urlpatterns = [
    path('login/', obtain_jwt_token),
    path('current_user/', views.current_user),
    path('users/', views.RpgUserList.as_view()),
    path('get_room/', views.get_rooms)
]

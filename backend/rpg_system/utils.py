from main.serializers import RpgUserSerializer


def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': RpgUserSerializer(user, context={'request': request}).data
    }

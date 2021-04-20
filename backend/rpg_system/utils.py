from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

from main.serializers import RpgUserSerializer


def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': RpgUserSerializer(user, context={'request': request}).data
    }


def validate_token(token: str):
    valid_data = VerifyJSONWebTokenSerializer().validate({'token': token})
    return valid_data['user']


def get_data(serializer):
    return serializer.data


def type_cast(value, cast):
    if cast == 'int':
        return int(value)
    elif cast == 'text':
        return str(value)
    else:
        return value

from rest_framework import serializers
from .models import PastMessages


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializes all the fields in the db into a json
    """
    class Meta:
        model = PastMessages
        fields = ["id", "title", "messages", "date_modified"]

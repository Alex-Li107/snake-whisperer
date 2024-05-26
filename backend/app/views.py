from django.shortcuts import render
from .models import PastMessages
from .serializers import MessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import json

# type hinting
from django.http import HttpRequest, HttpResponse, JsonResponse

# mamba prediction
from mamba.chat import chat
from mamba.utils import read_json_key

JSON_CONFIG = "models/special_tokens_map.json"


def get_all_past_msg(descending: bool = True) -> JsonResponse:
    """
    Serializes and returns all the past messages in increasing or descending date modified

    :param descending: whether the returned list should be in descending or increasing order
    :return: serialized past messages
    """
    if descending:
        objects = PastMessages.objects.all().order_by('-date_modified')
    else:
        objects = PastMessages.objects.all().order_by('date_modified')
    return MessageSerializer(objects, many=True).data


# Create your views here.
class Chat(APIView):
    """
    Endpoint for creating a new chat with mamba
    """

    def get(self, request: HttpRequest) -> HttpResponse:
        """
        Returns all entries in the DB sorted by date modified

        :param request: the HTTP request with a message
        :return: The entries in the DB
        """
        return Response({"messages": get_all_past_msg(), "username": request.session['username']}, status=200)

    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Handles receiving a message and running a prediction using it

        :param request: the HTTP request with a message
        :return: HTTP response with the response from mamba
        """
        eos_token = read_json_key(JSON_CONFIG, "eos_token")

        # get the message the user sent to the model
        data = json.loads(request.body.decode('utf-8'))
        message = data.get("message", "")

        # no past messages except for the new user message because it is a new chat
        past_messages = [dict(
            role="user",
            content=message
        )]

        mamba_resp = chat(past_messages, message)

        if len(message) > 30:
            title = message[:30] + "..."
        else:
            title = message[:30]

        # create message history json
        message_history = {
            "user": [message],
            "assistant": [mamba_resp]
        }
        message_history = json.dumps(message_history)

        # remove eos_token so its more human friendly
        index = mamba_resp.rfind(eos_token)
        mamba_resp_human_readable = mamba_resp[:index] + mamba_resp[index + len(eos_token):]

        chat_log = PastMessages.objects.create(title=title, messages=message_history)
        serializer = MessageSerializer(chat_log)
        return Response({"serializer_data": serializer.data, "mamba_reply": mamba_resp_human_readable}, status=201)


class ExistingChat(APIView):
    """
    Endpoint for interacting with an existing chat
    """

    def get(self, request: HttpRequest, pk: int) -> HttpResponse:
        """
        Returns all entries in the DB sorted by date modified

        :param request: the HTTP request with a message
        :param pk: object primary key
        :return: The entries in the DB
        """
        if not PastMessages.objects.filter(pk=pk).exists():
            return Response(status=404)
        return Response({"messages": get_all_past_msg(), "username": request.session['username']}, status=200)

    def put(self, request: HttpRequest, pk: int) -> HttpResponse:
        """
        Handles receiving a message from the user in an existing chat

        :param request: the HTTP request with a message
        :param pk: object primary key
        :return: HTTP response with the response from mamba
        """
        eos_token = read_json_key(JSON_CONFIG, "eos_token")

        # get the message the user sent to the model
        data = json.loads(request.body.decode('utf-8'))
        message = data.get("message", "")

        # get db object with matching primary key
        past_message_instance = PastMessages.objects.get(pk=pk)
        serializer = MessageSerializer(past_message_instance)

        # process past messages and add it to the dict
        past_messages = json.loads(serializer.data["messages"])
        user_msgs = past_messages["user"]
        mamba_msgs = past_messages["assistant"]

        messages = []
        for user_message, mamba_message in zip(user_msgs, mamba_msgs):
            messages.append(dict(
                role="user",
                content=user_message
            ))
            messages.append(dict(
                role="assistant",
                content=mamba_message
            ))

        messages.append(dict(
            role="user",
            content=message
        ))

        mamba_resp = chat(messages, message)

        # create message history json
        user_msgs.append(message)
        mamba_msgs.append(mamba_resp)

        message_history = {
            "user": user_msgs,
            "assistant": mamba_msgs
        }
        message_history = json.dumps(message_history)

        # remove eos_token so its more human friendly
        index = mamba_resp.rfind(eos_token)
        mamba_resp_human_readable = mamba_resp[:index] + mamba_resp[index + len(eos_token):]

        # update correct entry
        past_message_instance.messages = message_history
        past_message_instance.save()
        serializer = MessageSerializer(past_message_instance)
        return Response({"serializer_data": serializer.data, "mamba_reply": mamba_resp_human_readable}, status=200)

    def delete(self, request: HttpRequest, pk: int) -> HttpResponse:
        """
        Delete a conversation given its primary key

        :param request: the HTTP request
        :param pk: object primary key
        :return: HTTP response if delete is successful
        """
        PastMessages.objects.filter(pk=pk).delete()
        return Response(status=200)


class Home(APIView):
    """
    Endpoint for the home page
    """

    def get(self, request: HttpRequest) -> HttpResponse:
        """
        Returns status 200 and the username if it is already in the session
        :param request: the HTTP request
        :return: HTTP response
        """
        # check if "username" is in the session
        if "username" in request.session:
            return Response({"username": request.session['username']}, status=200)
        else:
            return Response(status=401)

    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Saves the name of the user in a session
        :param request: the HTTP request
        :return: HTTP response
        """
        data = json.loads(request.body.decode('utf-8'))
        request.session['username'] = data.get("username", "")

        return Response(status=200)

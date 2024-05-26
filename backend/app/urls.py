from django.urls import path
from . import views

urlpatterns = [
    path("chat/", views.Chat.as_view(), name="create-new-chat-view"),
    path("chat/<int:pk>/", views.ExistingChat.as_view(), name="continue-chat-view")
]
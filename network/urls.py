
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<str:profile>", views.profile_view, name="profile"),

    #API Routes
    path("posts", views.compose, name="compose"),
    path("posts/<str:posts>", views.post, name="post")
]


from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API Routes
    path("posts", views.compose, name="compose"),
    path("posts/<str:posts>", views.post, name="post"),
    path("profile/<int:id>", views.profile, name="profile"),
    path("follow", views.follow, name="follow"),
    path('posts/<int:post_id>/edit/', views.edit_post, name='edit_post'),
    path('posts/<int:post_id>/like', views.toggle_like, name='toggle_like'),

    #Profile Routes
    re_path(r'^(?P<profile>[a-zA-Z0-9_-]+)$', views.profile_view, name="profile_view"),
    path("<str:profile>/following_posts", views.following_posts, name="following_posts"),
]

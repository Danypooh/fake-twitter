from django.contrib import admin

from .models import User, Post, Media, Follower, Comment, Like, Retweet

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Media)
admin.site.register(Follower)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Retweet)

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # bio = models.TextField(blank=True, null=True)
    # profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.username

class Post(models.Model):
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name='posts',)
    content = models.TextField(max_length=280, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}'s Post at {self.created_at}"
    
    def serialize(self, user=None):  # Pass the user to this method
        liked_by_user = False
        if user:
            liked_by_user = Like.objects.filter(user=user, post=self).exists()

        return {
            'post_id': self.id,
            'author_id': self.author.id,
            'author': self.author.username,
            'content': self.content,
            'likes': self.likes.count(),
            'liked': liked_by_user,
            'created_at': self.created_at.strftime("%b %d %Y, %I:%M %p"),
        }

class Media(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="media")
    file = models.FileField(upload_to='post_media/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media for post {self.post.id}"

class Follower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    followed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'followed_user')

    def __str__(self):
        return f"{self.user.username} follows {self.followed_user.username}"
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.id}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # A user can like a post only once
        indexes = [
            models.Index(fields=['user', 'post']),  # Index for performance
        ]

    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"
    
class Retweet(models.Model):
    original_post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="retweets")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} retweeted {self.original_post.id}"

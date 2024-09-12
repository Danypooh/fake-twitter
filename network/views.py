import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse

from .models import User, Post, Media, Follower, Comment, Like, Retweet


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def compose(request):

    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Get request info
    data = json.loads(request.body)
    content = data.get("content")

    # Check for content in post
    if not content:
        return JsonResponse({
            "error": "At least one character written in content"
        }, status=400)
    
    # Create Post
    new_post = Post(
        author = request.user,
        content = content,
    )
    new_post.save()

    return JsonResponse({"message": "Posted successfully."}, status=201)

def post(request, posts):
    # Filter posts returned based on /posts route
    if posts == 'all':
        all_posts = Post.objects.all()

    elif posts == 'following':
        # Retrieve the users that logged-in user is following
        followed_users = Follower.objects.filter(user=request.user).values_list('followed_user', flat=True)
        all_posts = Post.objects.filter(author__in=followed_users)
    else:
        # Retrieve profile user
        try:
            user = User.objects.get(username=posts)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        all_posts = Post.objects.filter(author=user)
    
    # Return emails in reverse chronological order
    all_posts = all_posts.order_by('-created_at').all()
    return JsonResponse([post.serialize() for post in all_posts], safe=False)

def profile_view(request, profile):
    profile_user = User.objects.filter(username=profile).first()

    if not profile_user:
        return JsonResponse({'error': 'User not found'}, status=404)

    # Check if the logged-in user is the profile owner
    profile_owner = False
    if request.user.is_authenticated:
        profile_owner = request.user == profile_user
    
    context = {
        'profile_id': profile_user.id,
        'profile_user': profile_user.username,
        'profile_owner': profile_owner,
    }
    return render(request, "network/profile.html", context)

def profile(request, id):
    try:
        profile_user = User.objects.get(id=id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    if request.user.is_authenticated:
        # Check if the logged-in user is following the profile_user
        try:
            following = Follower.objects.filter(user=request.user, followed_user=profile_user).exists()
        except Follower.DoesNotExist:
            following = False
    else: 
        following = False
    

    response_data = {
        'followers_count': profile_user.followers.count(),
        'following_count': profile_user.following.count(),
        'following': following
    }
    
    return JsonResponse(response_data)

@login_required
def follow(request):
    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    try:
        data = json.loads(request.body)
        target_user_id = data.get("target_user_id")
        target_user = User.objects.get(id=target_user_id)
        user = request.user

        # Check if the current user is following the target user
        follower_relationship = Follower.objects.filter(user=user, followed_user=target_user).first()

        if follower_relationship:
            # If already following, unfollow
            follower_relationship.delete()
            return JsonResponse({'success': True, 'following': False})
        else:
            # If not following, create the follow relationship
            Follower.objects.create(user=user, followed_user=target_user)
            return JsonResponse({'success': True, 'following': True})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

---
name: django-patterns
description: Django patterns — models, views, DRF serializers, async views, query optimization, signals, and migrations
title: "Django Patterns (2025)"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: django, patterns
---

# Django Patterns (2025)

> Fat models, thin views. Use managers for queries. DRF for APIs.

---

## Model Design

```python
from django.db import models
from django.utils import timezone

class UserManager(models.Manager):
    """Custom manager — encapsulate common queries."""
    def active(self):
        return self.filter(is_active=True)

    def recently_joined(self, days: int = 7):
        cutoff = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff, is_active=True)

class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self) -> str:
        return self.name

    @property
    def display_name(self) -> str:
        """Business logic belongs in model, not views."""
        return self.name or self.email.split("@")[0]
```

---

## DRF Serializers

```python
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "display_name", "created_at"]
        read_only_fields = ["id", "created_at"]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
```

---

## Views / ViewSets

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.active()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Custom action: GET /users/recent/"""
        users = User.objects.recently_joined()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
```

---

## Django Async Views (5.0+)

```python
# Async function-based view
from django.http import JsonResponse
import httpx

async def external_api_view(request):
    """Use async for I/O-bound views."""
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
    return JsonResponse(response.json())

# ASGI deployment required:
# uvicorn myproject.asgi:application --workers 4
```

---

## Query Optimization

```python
# ❌ N+1 Problem
users = User.objects.all()
for user in users:
    print(user.profile.bio)      # Each access = 1 query!
    print(user.posts.count())    # Each access = 1 query!

# ✅ Fix: select_related (ForeignKey / OneToOne)
users = User.objects.select_related("profile").all()

# ✅ Fix: prefetch_related (ManyToMany / Reverse FK)
users = User.objects.prefetch_related("posts").all()

# ✅ Select specific fields
users = User.objects.only("id", "email", "name").all()

# ✅ Annotate counts without extra queries
from django.db.models import Count
users = User.objects.annotate(post_count=Count("posts")).all()
```

---

## Signals (Use Sparingly)

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Auto-create profile when user is created."""
    if created:
        Profile.objects.create(user=instance)

# Register in apps.py:
# class UsersConfig(AppConfig):
#     def ready(self):
#         import users.signals
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Business logic in views | Fat models, thin views |
| Raw SQL everywhere | Use ORM + managers |
| Forget `select_related` | Profile queries, fix N+1 |
| Overuse signals | Prefer explicit service calls |
| `settings.py` monolith | Split: base/dev/prod |
| Skip migrations | Always `makemigrations` + `migrate` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Why Django |
| [project-structure.md](project-structure.md) | Django directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing Django |
| [async-patterns.md](async-patterns.md) | Async in Django |

---

⚡ PikaKit v3.9.206

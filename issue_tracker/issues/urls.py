"""
URL mappings for the issues API.
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from issues.views import (
    IssueViewSet,
    CommentViewSet,
)

app_name = 'issues'

router = DefaultRouter()
router.register('', IssueViewSet)
router.register('comments', CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
]

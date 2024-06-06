"""
URL mappings for the projects API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from projects.views import ProjectViewSet, ProjectIssuesViewSet

app_name = 'projects'

router = DefaultRouter()
router.register('', ProjectViewSet)

project_issues_list = ProjectIssuesViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

urlpatterns = [
    path('', include(router.urls)),
    path(
        '<int:project_id>/issues/',
        project_issues_list,
        name='project-issues'
    ),
]

from django.contrib.auth import get_user_model
from core.models import (
    Project,
    Issue
)


def create_project(user, **params):
    """Create and return a new project."""

    defaults = {
        'name': 'Sample project title',
        'description': 'Sample description',
    }

    defaults.update(**params)

    project = Project.objects.create(created_by=user, **defaults)
    return project


def create_issue(user, project, **params):
    """Create and return a new issue."""

    defaults = {
        'title': 'Sample issue title',
        'description': 'Sample description',
        'status': 'New',
    }

    defaults.update(**params)

    issue = Issue.objects.create(
        created_by=user, assigned_to=user, project=project, **defaults
    )
    return issue


def create_user(email='user@example.com', password='testpass123', name='test'):
    """Create a return a new user."""
    return get_user_model().objects.create_user(
        email=email, password=password, name=name
    )

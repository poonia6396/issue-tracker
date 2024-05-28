"""
 Test for models.
"""
# from decimal import Decimal
# from unittest.mock import patch

from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


def create_user(email='user@example.com', password='testpass123'):
    """Create a return a new user."""
    return get_user_model().objects.create_user(email, password)


class ModelTests(TestCase):
    """Test models."""

    def test_create_user_with_email_successful(self):
        """Test creating a user with an email is successful."""
        email = 'test@example.com'
        password = 'testpass123'
        user = create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test email is normalized for new users."""
        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.com', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com'],
        ]
        for email, expected in sample_emails:
            user = create_user(email, 'sample123')
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test that creating a user without an email raises a ValueError."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'test123')

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            'test@example.com',
            'test123',
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_project(self):
        """Test creating a project"""
        user = create_user()
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')
        project = models.Project.objects.create(
            created_by=user,
            name='Sample Project name',
            description='Sample description',
        )

        project.members.set([user, user2])

        self.assertEqual(str(project), project.name)
        self.assertIn(user2, project.members.all())
        self.assertNotIn(user1, project.members.all())

    def test_create_issue(self):
        """Test creating an issue"""
        user = create_user()
        user1 = create_user(email='user1@example.com')
        project = models.Project.objects.create(
            created_by=user,
            name='Sample Project name',
            description='Sample description',
        )

        issue = models.Issue.objects.create(
            created_by=user,
            title='Sample Issue title',
            description='Sample description',
            assigned_to=user1,
            status='New',
            project=project,
        )

        self.assertEqual(str(issue), issue.title)
        self.assertEqual(user1, issue.assigned_to)

    def test_create_comment(self):
        """Test creating a comment"""
        user = create_user()
        project = models.Project.objects.create(
            created_by=user,
            name='Sample Project name',
            description='Sample description',
        )
        issue = models.Issue.objects.create(
            created_by=user,
            title='Sample Issue title',
            description='Sample description',
            assigned_to=user,
            project=project,
        )

        comment = models.Comment.objects.create(
            created_by=user,
            text='Sample comment',
            issue=issue,
        )

        self.assertEqual(
            str(comment),
            f"Comment by {user.email} on {issue.title}",
        )

    def test_create_label(self):
        """Test creating a label"""
        label = models.Label.objects.create(
            name='Sample label',
        )

        self.assertEqual(str(label), label.name)

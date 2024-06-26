"""
Tests for the issues API.
"""
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework import status

from core.models import (
    Label,
    Comment,
)
from core.tests.utils import (
    create_project, create_user, create_issue
)

from issues.serializers import (
    IssueSerializer,
    IssueDetailSerializer,
)


def issue_comment_url(issue_id):
    """Create and return an issue comments URL."""
    return reverse('issues:issue-comments', args=[issue_id])


def detail_url(issue_id):
    """Get url for issue detail API"""
    return reverse('issues:issue-detail', args=[issue_id])


class PublicIssueApiTests(APITestCase):
    """Test the public features of the issue API."""

    def test_auth_required(self):
        """Test auth is required to call API."""
        res = self.client.get(detail_url(1))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateIssueApiTests(APITestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.user = create_user()
        self.project = create_project(user=self.user)
        self.client.force_authenticate(self.user)

    def test_retrieve_issues(self):
        """Test retrieving issues"""
        user2 = create_user(email='user1@example.com')
        issue1 = create_issue(user=self.user, project=self.project)
        issue2 = create_issue(user=self.user, project=self.project)
        issue3 = create_issue(user=user2, project=self.project)

        url = reverse('issues:issue-list')

        res = self.client.get(url)

        s1 = IssueSerializer(issue1)
        s2 = IssueSerializer(issue2)
        s3 = IssueSerializer(issue3)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(s1.data, res.data)
        self.assertIn(s2.data, res.data)
        self.assertNotIn(s3.data, res.data)

    def test_get_issue_detail(self):
        """Test get issue detail."""

        issue = create_issue(user=self.user, project=self.project)

        url = detail_url(issue.id)
        res = self.client.get(url)

        serializer = IssueDetailSerializer(issue)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_issue_detail_not_self_created(self):
        """
        Test get issue detail that is not
        created by the authenticated user.
        """

        user2 = create_user(email='user1@example.com')
        issue = create_issue(user=user2, project=self.project)

        url = detail_url(issue.id)
        res = self.client.get(url)

        serializer = IssueDetailSerializer(issue)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_label_on_update(self):
        """Test create label when updating a issue."""
        issue = create_issue(user=self.user, project=self.project)

        payload = {'labels': [{'name': 'first'}]}
        url = detail_url(issue.id)
        res = self.client.patch(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        new_label = Label.objects.get(name='first')
        self.assertIn(new_label, issue.labels.all())

    def test_update_issue_assign_label(self):
        """Test assigning an existing label when updating a issue."""
        label_duesoon = Label.objects.create(name='duesoon')
        issue = create_issue(user=self.user, project=self.project)
        issue.labels.add(label_duesoon)

        label_processed = Label.objects.create(name='processed')
        payload = {'labels': [{'name': 'processed'}]}
        url = detail_url(issue.id)
        res = self.client.patch(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(label_processed, issue.labels.all())
        self.assertNotIn(label_duesoon, issue.labels.all())

    def test_clear_issue_labels(self):
        """Test clearing a issues labels."""
        label = Label.objects.create(name='bug')
        issue = create_issue(user=self.user, project=self.project)
        issue.labels.add(label)

        payload = {'labels': []}
        url = detail_url(issue.id)
        res = self.client.patch(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(issue.labels.count(), 0)


class IssueCommentsAPITest(APITestCase):
    def setUp(self):
        self.user = create_user()
        self.client.force_authenticate(self.user)
        self.project = create_project(user=self.user)
        self.issue = create_issue(user=self.user, project=self.project)

    def test_list_comments(self):
        """Test listing comments"""
        url = issue_comment_url(self.issue.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_comment(self):
        """Test creating a comments throug api"""
        url = issue_comment_url(self.issue.id)
        payload = {
            'text': 'Updated comment',
        }
        response = self.client.post(url, payload, format='json')
        self.issue.refresh_from_db()
        issue_comments = Comment.objects.filter(issue=self.issue)
        comment = Comment.objects.get(id=response.data['id'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn(comment, issue_comments)


class IssueAssignedAPITest(APITestCase):
    def setUp(self):
        self.user = create_user()
        self.user1 = create_user(email='user1@example.com')
        self.client.force_authenticate(user=self.user)

        self.project = create_project(user=self.user)

        # Create issues, some assigned to user, some not
        self.issue1 = create_issue(
            user=self.user, project=self.project, title='Issue1'
        )
        self.issue2 = create_issue(
            user=self.user, project=self.project, title='Issue2'
        )
        self.issue3 = create_issue(user=self.user1, project=self.project)

    def test_get_assigned_issues(self):
        """Test retrieving issues assigned to the authenticated user"""
        url = reverse('issues:issue-assigned')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], self.issue1.title)
        self.assertEqual(response.data[1]['title'], self.issue2.title)

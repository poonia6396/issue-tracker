"""
Tests for the projects API.
"""
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework import status

from core.models import (
    Project,
    Issue,
    Label,
)
from core.tests.utils import (
    create_issue, create_user, create_project
)
from projects.serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
)

from issues.serializers import IssueDetailSerializer


def detail_url(project_id):
    """Get url for project detail API"""
    return reverse('projects:project-detail', args=[project_id])


def project_issue_url(project_id):
    """Create and return an project issues URL."""
    return reverse('projects:project-issues', args=[project_id])


PROJECTS_URL = reverse('projects:project-list')


class PublicProjectApiTests(APITestCase):
    """Test the public features of the projects API."""

    def test_auth_required(self):
        """Test auth is required to call API."""
        res = self.client.get(PROJECTS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateProjectApiTests(APITestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_projects(self):
        """Test retrieving a list of projects."""
        create_project(user=self.user)
        create_project(user=self.user)

        res = self.client.get(PROJECTS_URL)

        projects = Project.objects.all().order_by('-id')
        serializer = ProjectSerializer(projects, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_project_detail(self):
        """Test get project detail."""

        project = create_project(user=self.user)

        url = detail_url(project.id)
        res = self.client.get(url)

        serializer = ProjectDetailSerializer(project)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_project(self):
        """Test creating a project."""
        payload = {
            'name': 'Sample project title',
            'description': 'Sample description',
        }
        res = self.client.post(PROJECTS_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        project = Project.objects.get(id=res.data['id'])
        for k, v in payload.items():
            self.assertEqual(getattr(project, k), v)
        self.assertEqual(project.created_by, self.user)

    def test_create_project_with_members(self):
        """Test creating a project with new members."""
        user1 = create_user(email='user1@example.com')
        payload = {
            'name': 'Sample project Name',
            'description': 'Sample description',
            'member_ids': [self.user.id, user1.id],
        }

        res = self.client.post(PROJECTS_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        projects = Project.objects.filter(created_by=self.user)
        self.assertEqual(projects.count(), 1)
        project = projects[0]
        self.assertEqual(project.members.count(), 2)
        for member_id in payload['member_ids']:
            exists = project.members.filter(
                id=member_id,
            ).exists()
            self.assertTrue(exists)

    def test_add_members_to_existing_project(self):
        """Test adding members to existing project."""
        project = create_project(user=self.user)
        user1 = create_user(email='user1@example.com')
        payload = {'member_ids': [user1.id]}
        url = detail_url(project.id)
        res = self.client.patch(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(user1, project.members.all())

    def test_update_members_of_existing_project(self):
        """Test update members of existing project."""
        project = create_project(user=self.user)
        user1 = create_user(email='user1@example.com')
        project.members.add(user1)
        payload = {'member_ids': [self.user.id]}
        url = detail_url(project.id)
        res = self.client.patch(url, payload, format='json')
        project.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn(user1, project.members.all())
        self.assertIn(self.user, project.members.all())


class ProjectIssuesAPITest(APITestCase):
    """Test issue create api for the projects"""

    def setUp(self):
        self.user = create_user()
        self.client.force_authenticate(self.user)
        self.project = create_project(user=self.user)

    def test_list_issues(self):
        url = project_issue_url(self.project.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_issue(self):
        """Test creating a new issue."""
        url = project_issue_url(self.project.id)
        payload = {
            'title': 'Sample issue title',
            'description': 'Sample description',
            'status': 'New',
            'priority': 'Low',
            'assigned_to_id': self.user.id,
        }
        response = self.client.post(url, payload, format='json')

        project_issues = Issue.objects.filter(project=self.project)
        issue = Issue.objects.get(id=response.data['id'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn(issue, project_issues)
        for k, v in payload.items():
            self.assertEqual(getattr(issue, k), v)

    def test_create_issue_with_new_labels(self):
        """Test creating a issue with new labels."""

        payload = {
            'title': 'Sample issue title',
            'description': 'Sample description',
            'status': 'New',
            'priority': 'Low',
            'assigned_to_id': 1,
            'labels': [
                {'name': 'Bug'},
                {'name': 'urgent'},
            ],
        }
        url = project_issue_url(self.project.id)
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        issues = Issue.objects.filter(created_by=self.user)
        self.assertEqual(issues.count(), 1)
        issue = issues[0]
        self.assertEqual(issue.labels.count(), 2)
        for label in payload['labels']:
            exists = issue.labels.filter(
                name=label['name'],
            ).exists()
            self.assertTrue(exists)

    def test_create_issue_with_existing_labels(self):
        """Test creating a issue with existing label."""
        label_bug = Label.objects.create(name='bug')
        payload = {
            'title': 'Sample issue title',
            'description': 'Sample description',
            'status': 'New',
            'priority': 'Low',
            'assigned_to_id': 1,
            'labels': [
                {'name': 'bug'},
                {'name': 'urgent'},
            ],
        }
        url = project_issue_url(self.project.id)
        res = self.client.post(url, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        issues = Issue.objects.filter(created_by=self.user)
        self.assertEqual(issues.count(), 1)
        issue = issues[0]
        self.assertEqual(issue.labels.count(), 2)
        self.assertIn(label_bug, issue.labels.all())
        for label in payload['labels']:
            exists = issue.labels.filter(
                name=label['name'],
            ).exists()
            self.assertTrue(exists)

    def test_filter_by_labels(self):
        """Test filtering issues by labels."""
        issue1 = create_issue(
            user=self.user, project=self.project, title='Issue 1'
        )
        issue2 = create_issue(
            user=self.user, project=self.project, title='Issue 2'
        )
        label1 = Label.objects.create(name='label1')
        label2 = Label.objects.create(name='label2')
        issue1.labels.add(label1)
        issue2.labels.add(label2)
        issue3 = create_issue(
            user=self.user, project=self.project, title='Issue 3'
        )

        params = {'labels': f'{label1.name},{label2.name}'}
        url = project_issue_url(self.project.id)
        res = self.client.get(url, params)

        s1 = IssueDetailSerializer(issue1)
        s2 = IssueDetailSerializer(issue2)
        s3 = IssueDetailSerializer(issue3)
        self.assertIn(s1.data, res.data)
        self.assertIn(s2.data, res.data)
        self.assertNotIn(s3.data, res.data)

    def test_filter_by_assigned_to(self):
        """Test filtering issues by assigned user."""
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')
        issue1 = create_issue(
            user=user1, project=self.project, title='Issue 1'
        )
        issue2 = create_issue(
            user=user2, project=self.project, title='Issue 2'
        )
        issue3 = create_issue(
            user=self.user, project=self.project, title='Issue 3'
        )

        params = {'assigned_to': f'{user1.id},{user2.id}'}
        url = project_issue_url(self.project.id)
        res = self.client.get(url, params)

        s1 = IssueDetailSerializer(issue1)
        s2 = IssueDetailSerializer(issue2)
        s3 = IssueDetailSerializer(issue3)
        self.assertIn(s1.data, res.data)
        self.assertIn(s2.data, res.data)
        self.assertNotIn(s3.data, res.data)

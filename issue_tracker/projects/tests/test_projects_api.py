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
    ProjectMembership
)
from core.tests.utils import (
    create_issue, create_user, create_project
)
from projects.serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
)

from issues.serializers import IssueDetailSerializer


def project_members_url(project_id, action):
    """Create and return an project members URL."""
    return reverse('projects:project-'+action, args=[project_id])


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
        user1 = create_user(email='user1@example.com')
        project1 = create_project(user=self.user)
        project2 = create_project(user=self.user)
        project3 = create_project(user=user1)

        res = self.client.get(PROJECTS_URL)

        s1 = ProjectSerializer(project1)
        s2 = ProjectSerializer(project2)
        s3 = ProjectSerializer(project3)
        self.assertIn(s1.data, res.data)
        self.assertIn(s2.data, res.data)
        self.assertNotIn(s3.data, res.data)

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


class ProjectMembersAPITest(APITestCase):
    """Test members api for the projects"""

    def setUp(self):
        
        # Create users
        self.user1 = create_user(email='user1@example.com')
        self.user2 = create_user(email='user2@example.com')
        self.user3 = create_user(email='user3@example.com')
        # Create a project
        self.project = create_project(user=self.user1)
        self.client.force_authenticate(user=self.user1)
        # Create ProjectMembership
        self.membership = ProjectMembership.objects.create(
            user=self.user1, project=self.project, role='owner'
        )

    def test_list_project_members(self):
        """Test listing project members"""
        url = project_members_url(self.project.id, 'members')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.user1.id)

    def test_add_project_member(self):
        """Test adding project members"""
        url = project_members_url(self.project.id, 'add_member')

        data = {
            'email': self.user2.email,
            'role': 'developer'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ProjectMembership.objects.filter(
            user=self.user2, project=self.project).exists()
        )

    def test_remove_project_member(self):
        """Test removing project member"""
        ProjectMembership.objects.create(
            user=self.user3, project=self.project, role='developer'
        )

        url = project_members_url(self.project.id, 'remove_member')

        data = {
            'email': self.user3.email
        }
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ProjectMembership.objects.filter(
            user=self.user3, project=self.project).exists()
        )

    def test_add_member_invalid_user(self):
        """Test adding an invalid member to project"""
        url = project_members_url(self.project.id, 'add_member')

        data = {
            'email': 'abc@cde.com',  # Non-existent user ID
            'role': 'developer'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_member_invalid_user(self):
        """Test removing an invalid member to project"""
        url = project_members_url(self.project.id, 'remove_member')

        data = {
            'email': 'abc.com'  # Non-existent user ID
        }
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


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
            'status': 'Open',
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
            'status': 'Open',
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
            'status': 'Open',
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

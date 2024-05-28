"""
Views for the projects API.
"""

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import (
    viewsets,
)
from core.models import (
    Project,
    Issue,
)
from projects.serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
)
from issues.serializers import IssueDetailSerializer
from issues.filters import IssueFilter


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Create the project object"""
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        """Retrieve projects for authenticated user."""
        return self.queryset.order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return ProjectSerializer
        # elif self.action == 'issues':
        #     return IssueDetailSerializer

        return self.serializer_class


class ProjectIssuesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IssueDetailSerializer
    filterset_class = IssueFilter

    def get_queryset(self):
        project_pk = self.kwargs['project_pk']
        return Issue.objects.filter(project_id=project_pk)

    def perform_create(self, serializer):
        """Create the issue object"""
        project_pk = self.kwargs['project_pk']
        project = Project.objects.get(id=project_pk)
        serializer.save(project=project, created_by=self.request.user)

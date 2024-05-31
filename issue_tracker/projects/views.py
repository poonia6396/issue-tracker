"""
Views for the projects API.
"""
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import (
    viewsets,
    status,
)
from core.models import (
    Project,
    Issue,
    ProjectMembership,
)
from projects.serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    ProjectMembershipSerializer,
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

        return self.serializer_class

    @action(detail=True,
            methods=['get'],
            url_path='members',
            url_name='members')
    def list_members(self, request, pk=None):
        project = self.get_object()
        members = ProjectMembership.objects.filter(project=project)
        serializer = ProjectMembershipSerializer(members, many=True)
        return Response(serializer.data)

    @action(detail=True,
            methods=['post'],
            url_path='members/add',
            url_name='add_member')
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role')

        if not user_id or not role:
            return Response(
                {"detail": "User ID and role are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(get_user_model, id=user_id)
        ProjectMembership.objects.create(user=user, project=project, role=role)
        return Response(
            {"message": "Member added successfully"},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True,
            methods=['delete'],
            url_path='members/remove',
            url_name='remove_member')
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {"detail": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return Response(
                {"detail": "No User matches the given query."},
                status=status.HTTP_404_NOT_FOUND
            )
        membership = get_object_or_404(
            ProjectMembership, user=user,
            project=project
        )
        membership.delete()
        return Response(
            {"message": "Member removed successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class ProjectIssuesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
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

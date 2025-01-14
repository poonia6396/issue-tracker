"""
Views for the projects API.
"""
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
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
from core.filters import IssueFilter
from user.serializers import UserSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [IsAuthenticated]

    def _params_to_ints(self, qs):
        """Convert a list of strings to integers."""
        return [int(str_id) for str_id in qs.split(',')]

    def _is_admin_user(self, user, project):
        try:

            request_user_membership = ProjectMembership.objects.get(
                user=user, project=project
            )
            return request_user_membership.role == 'admin'
        except ProjectMembership.DoesNotExist:
            return False

    def perform_create(self, serializer):
        """Create the project object"""
        project = serializer.save(created_by=self.request.user)
        ProjectMembership.objects.create(
            user=self.request.user,
            project=project,
            role='admin'
        )

    def get_queryset(self):
        """Retrieve projects for authenticated user."""
        queryset = self.queryset
        user = self.request.user

        queryset = queryset.filter(
            project_members__user__id=user.id
        )

        return queryset.order_by('-id')

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
        project = Project.objects.get(id=pk)
        members = ProjectMembership.objects.filter(
            project=project
        ).values_list('user', flat=True)
        users = get_user_model().objects.filter(id__in=members)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True,
            methods=['get'],
            url_path='memberships',
            url_name='memberships')
    def list_memberships(self, request, pk=None):
        project = Project.objects.get(id=pk)
        memberships = ProjectMembership.objects.filter(project=project)
        serializer = ProjectMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    @action(detail=True,
            methods=['post'],
            url_path='members/add',
            url_name='add_member')
    def add_member(self, request, pk=None):
        project = Project.objects.get(id=pk)
        email = request.data.get('email')
        role = request.data.get('role')

        if not email or not role:
            return Response(
                {"detail": "User email and role are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not self._is_admin_user(self.request.user, project):
            return Response(
                {"detail": "Users can only be added by admin members"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = get_object_or_404(get_user_model(), email=email)
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
        project = Project.objects.get(id=pk)
        email = request.data.get('email')
        if not email:
            return Response(
                {"detail": "User email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not self._is_admin_user(self.request.user, project):
            return Response(
                {"detail": "Users can only be removed by admin members"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user = get_user_model().objects.get(email=email)
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
    serializer_class = IssueDetailSerializer
    filterset_class = IssueFilter

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Issue.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        """Create the issue object"""
        project_id = self.kwargs['project_id']
        project = Project.objects.get(id=project_id)
        serializer.save(project=project, created_by=self.request.user)

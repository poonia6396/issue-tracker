"""
Serializers for the project API View.
"""
from rest_framework.serializers import (
    ModelSerializer,
    EmailField,
    CharField,
)
from core.models import (
    Project,
    ProjectMembership
)

from issues.serializers import IssueSerializer


class ProjectMembershipSerializer(ModelSerializer):
    user_email = EmailField(source='user.email', read_only=True)
    project_name = CharField(source='project.name', read_only=True)

    class Meta:
        model = ProjectMembership
        fields = [
            'id', 'user', 'project', 'role', 'user_email', 'project_name'
        ]


class ProjectSerializer(ModelSerializer):
    issues = IssueSerializer(many=True, required=False)
    members = ProjectMembershipSerializer(
        many=True, required=False, source='project_members'
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'issues', 'members']


class ProjectDetailSerializer(ProjectSerializer):
    """ Serializer for the project detail. """

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['description']


"""
Serializers for the project API View.
"""
from django.contrib.auth import get_user_model
from rest_framework.serializers import (
    ModelSerializer,
    ListField,
    PrimaryKeyRelatedField,
)
from core.models import Project

from user.serializers import UserSerializer
from issues.serializers import IssueSerializer


class ProjectSerializer(ModelSerializer):
    members = UserSerializer(many=True, required=False, read_only='True')
    issues = IssueSerializer(many=True, required=False)

    member_ids = ListField(
        child=PrimaryKeyRelatedField(queryset=get_user_model().objects.all()),
        write_only=True,
        required=False,
        source='members',
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'members', 'issues', 'member_ids']


class ProjectDetailSerializer(ProjectSerializer):
    """ Serializer for the project detail. """

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['description']

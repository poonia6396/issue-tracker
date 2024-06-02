"""
Serializers for the issues API View.
"""
from django.contrib.auth import get_user_model
from user.serializers import UserSerializer
from rest_framework import serializers
from core.models import Label, Issue, Comment


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']
        read_only_fields = ['id']


class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'created_by', 'text', 'created_at']
        read_only_fields = ['id']


class IssueSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(required=False)
    assigned_to = UserSerializer(required=False)
    labels = LabelSerializer(many=True, required=False)
    comments = CommentSerializer(
        many=True, required=False, source='issue_comments'
    )

    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.all(),
        write_only=True,
        source='assigned_to'
    )

    class Meta:
        model = Issue
        fields = [
            'id', 'title',
            'created_by', 'assigned_to', 'status',
            'labels', 'comments', 'assigned_to_id',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def _get_or_create_labels(self, labels, issue):
        """Handle getting or creating labels as needed."""
        for label in labels:

            label_obj, _ = Label.objects.get_or_create(
                **label,
            )
            issue.labels.add(label_obj)

    def create(self, validated_data):
        """Create an issue."""
        labels = validated_data.pop('labels', [])
        issue = Issue.objects.create(**validated_data)
        self._get_or_create_labels(labels, issue)
        return issue

    def update(self, instance, validated_data):
        """Update a recipe."""
        labels = validated_data.pop('labels', [])

        if labels is not None:
            instance.labels.clear()
            self._get_or_create_labels(labels, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class IssueDetailSerializer(IssueSerializer):
    """ Serializer for the issue detail. """

    class Meta(IssueSerializer.Meta):
        fields = IssueSerializer.Meta.fields + [
            'description', 'priority', 'updated_at', 'due_date', 'created_at'
        ]

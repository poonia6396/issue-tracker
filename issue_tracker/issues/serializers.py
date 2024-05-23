"""
Serializers for the issues API View.
"""

from rest_framework import serializers
from core.models import Label, Issue, Comment

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'created_by', 'text', 'created_at']


class IssueSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'created_at', 'updated_at', 
            'project', 'reported_by', 'assigned_to', 'status', 'priority', 
            'labels', 'due_date', 'comments'
        ]
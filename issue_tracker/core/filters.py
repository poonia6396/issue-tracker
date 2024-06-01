from django_filters import rest_framework as filters

from core.models import Issue, Project


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class ProjectFilter(filters.FilterSet):
    member_ids = NumberInFilter(
        field_name='project_members__user__id', lookup_expr='in'
    )

    class Meta:
        model = Project
        fields = ['member_ids']


class IssueFilter(filters.FilterSet):
    labels = CharInFilter(field_name='labels__name', lookup_expr='in')
    assigned_to = NumberInFilter(
        field_name='assigned_to__id', lookup_expr='in'
    )
    created_by = NumberInFilter(
        field_name='created_by__id', lookup_expr='in'
    )

    class Meta:
        model = Issue
        fields = ['labels', 'assigned_to', 'created_by']

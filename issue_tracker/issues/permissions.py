from rest_framework import permissions


class IsReporterOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow reporters of a issue to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if view.action == 'list':
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj.created_by == request.user \
                or request.user.role == 'Admin'
        return True

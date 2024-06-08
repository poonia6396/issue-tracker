"""
Views for the issues API.
"""
from rest_framework import (
    viewsets, mixins, status
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from core.models import Issue, Comment
from .serializers import (
    IssueSerializer,
    IssueDetailSerializer,
    CommentSerializer,
)
from issues.permissions import IsReporterOrReadOnly
from core.filters import IssueFilter


class IssueViewSet(mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet,):
    """View for manage recipe APIs."""
    serializer_class = IssueDetailSerializer
    queryset = Issue.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsReporterOrReadOnly]
    filter_class = IssueFilter

    def _params_to_ints(self, qs):
        """Convert a list of strings to integers."""
        return [int(str_id) for str_id in qs.split(',')]

    def perform_create(self, serializer):
        """Create the issue object"""
        serializer.save(created_by=self.request.user)

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return IssueSerializer
        elif self.action == 'comments':
            return CommentSerializer

        return self.serializer_class

    def get_queryset(self):
        """Retrieve issues for authenticated user."""
        queryset = self.queryset
        user = self.request.user
        queryset = queryset.filter(
            created_by__id=user.id
        )
        return queryset.order_by('-id')

    @action(methods=['GET', 'POST'], detail=True, url_path='comments')
    def comments(self, request, pk=None):
        """Fetch and create comments for an issue"""
        issue = self.get_object()
        if request.method == 'GET':
            comments = Comment.objects.filter(issue=issue)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    issue=issue,
                    created_by=self.request.user
                )
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'], url_path='assigned')
    def assigned(self, request):
        """Fetch issues assigned to the authenticated user"""
        user = self.request.user
        assigned_issues = self.queryset.filter(assigned_to=user)
        serializer = self.get_serializer(assigned_issues, many=True)
        return Response(serializer.data)


class CommentViewSet(mixins.DestroyModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet,):
    """View for manage comment APIs."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

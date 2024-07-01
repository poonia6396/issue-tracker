import axiosInstance from './axiosInstance';

interface LoginResponse {
  access: string;
  refresh: string;
}

export const loginUser = async (email: string, password: string ): Promise<LoginResponse> => {
  const response = await axiosInstance.post(`/user/token/`, { email, password });
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post(`/user/token/refresh`, { refresh: refreshToken });
  return response.data;
};

export const createUser = async (userData: { email: string, password: string, name: string }) => {
  const response = await axiosInstance.post("/user/create/", userData);
  return response.data;
};

export const getProjects = () => {
  return axiosInstance.get(`/projects/`);
};

export const getProjectsForUser = () => {
  return axiosInstance.get('/projects/');
};

export const getProject = (projectId: number) => {
  return axiosInstance.get(`/projects/${projectId}`);
};

export const createProject = (project: { name: string }) => {
  return axiosInstance.post(`/projects/`, project);
};

export const updateProject = (projectId: number, project: { name: string, description: string }) => {
  return axiosInstance.patch(`/projects/${projectId}/`, project);
};

export const createIssue = (issue: { title: string; description: string }, projectId: number) => {
  return axiosInstance.post(`/projects/${projectId}/issues/`, issue);
};

export const getIssuesForProject = (projectId: number, labels?: number[], assignees?: number[]) => {
  const params = new URLSearchParams();
  if (labels && labels.length) {
    params.append('labels', labels.join(','));
  }
  if (assignees && assignees.length) {
    params.append('assigned_to', assignees.join(','));
  }
  return axiosInstance.get(`/projects/${projectId}/issues?${params.toString()}`);
};

export const getIssuesCreatedBy = () => {
  return axiosInstance.get('/issues/');
};

export const getIssuesAssignedTo = () => {
  return axiosInstance.get('/issues/assigned');
};

export const getIssueDetails = (issueId: number) => {
  return axiosInstance.get(`/issues/${issueId}/`);
};

export const updateIssueLabels = (issueId: number, data: { labels: { name: string }[] }) => {
  return axiosInstance.patch(`/issues/${issueId}/`, data);
};

export const updateIssueDueDate = (issueId: number, data: { due_date: string }) => {
  return axiosInstance.patch(`/issues/${issueId}/`, data);
};

export const updateIssueAssignee = (issueId: number, data: { assigned_to_id: number | null }) => {
  return axiosInstance.patch(`/issues/${issueId}/`, data);
};

export const updateIssueStatus = async (issueId: number, status: string) => {
  return axiosInstance.patch(`/issues/${issueId}/`, { status: status });
};

export const getComments = (issueId: number) => {
  return axiosInstance.get(`/issues/${issueId}/comments/`);
};

export const addComment = (issueId: number, comment: { text: string }) => {
  return axiosInstance.post(`/issues/${issueId}/comments/`, comment);
};

export const updateComment = async (commentId: number, data: { text: string }) => {
  return axiosInstance.patch(`/issues/comments/${commentId}/`, data);
};

export const deleteComment = async (commentId: number) => {
  return axiosInstance.delete(`/issues/comments/${commentId}/`);
};

export const getUser = () => {
  return axiosInstance.get('/user/me');
};

export const getProjectMembers = (projectId: number) => {
  return axiosInstance.get(`/projects/${projectId}/members`);
};

export const getProjectMemberships = (projectId: number) => {
  return axiosInstance.get(`/projects/${projectId}/memberships`);
};

export const addProjectMember = (projectId: number, data: { email: string; role: string }) => {
  return axiosInstance.post(`/projects/${projectId}/members/add/`, data);
};

export const removeProjectMember = (projectId: number, data: { email: string }) => {
  return axiosInstance.delete(`/projects/${projectId}/members/remove`, {data: data});
};
import axiosInstance from './axiosInstance';


export const loginUser = (credentials: { email: string; password: string }) => {
  return axiosInstance.post(`/user/token/`, credentials);
};

export const getProjects = () => {
  return axiosInstance.get(`/projects/projects/`);
};

export const createProject = (project: { name: string }) => {
  return axiosInstance.post(`/projects/projects/`, project);
};

export const createIssue = (issue: { title: string; description: string }, projectId: number) => {
  return axiosInstance.post(`/projects/projects/${projectId}/issues/`, issue);
};

export const getIssuesForProject = (projectId: number) => {
  return axiosInstance.get(`/projects/projects/${projectId}/issues/`);
};

export const getIssueDetails = (issueId: number) => {
  return axiosInstance.get(`/issues/issues/${issueId}/`);
};

export const getComments = (issueId: number) => {
  return axiosInstance.get(`/issues/issues/${issueId}/comments/`);
};

export const addComment = (issueId: number, comment: { text: string }) => {
  return axiosInstance.post(`/issues/issues/${issueId}/comments/`, comment);
};

export const getUsers = () => {
  return axiosInstance.get('/user/');
};

export const createUser = (user: { email: string }) => {
  return axiosInstance.post('/user/create/', user);
};
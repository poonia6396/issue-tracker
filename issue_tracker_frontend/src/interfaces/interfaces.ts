export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Membership {
  id: number;
  user: number;
  project: number;
  role: string;
  user_email: string;
  project_name: string;
}

export interface Project {
  id: number;
  name: string;
  members: User[];
  memberships: Membership[];
  issues: Issue[];
  description: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  created_by: User
  assigned_to: User
  status: string;
  labels: Label[];
  priority: string;
  created_at: string;
  updated_at: string;
  due_date: Date | null;
}

export interface Label {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  created_by: User;
  created_at: string;
  text: string;
}
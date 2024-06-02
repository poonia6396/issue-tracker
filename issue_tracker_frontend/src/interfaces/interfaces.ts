export interface User {
  id: number;
  email: string;
  name: string;
}
  
export interface Project {
  id: number;
  name: string;
  members: User[];
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
  due_date: string | null;
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
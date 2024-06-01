export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Member {
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
  members: Member[];
  description: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  created_by: {
    email: string;
    name: string;
  };
  assigned_to: {
    email: string;
    name: string;
  };
  status: string;
  labels: { id: number; name: string }[];
  priority: string;
  updated_at: string;
  due_date: string | null;
}

export interface Comment {
  id: number;
  text: string;
}
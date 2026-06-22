export type Role = 'Client' | 'Freelancer' | 'Admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  skills: string[];
  bio: string;
  hourlyRate?: number;
  isBlocked: boolean;
  isVerified?: boolean;
  bookmarkedTasks?: string[];
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
  client_email: string;
  client_name?: string;
  status: 'Open' | 'In Progress' | 'Completed';
  deliverable_url: string;
  createdAt: string;
}

export interface Proposal {
  _id: string;
  task_id: string;
  freelancer_email: string;
  proposed_budget: number;
  estimated_days: number;
  cover_note: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  submitted_at: string;
}

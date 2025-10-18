export interface Task {
  id: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: string;
  assignedTo?: string;
  claimedBy?: string;
  createdAt: number;
  completedAt?: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
}
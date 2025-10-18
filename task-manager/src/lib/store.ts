import type { Task, User } from '@/types';

class DataStore {
  private tasks: Task[] = [];
  private users: User[] = [
    { id: '1', name: '成员A', color: '#00d4ff' },
    { id: '2', name: '成员B', color: '#00ff88' },
    { id: '3', name: '成员C', color: '#ff00ff' },
    { id: '4', name: '成员D', color: '#ffd700' },
  ];

  getTasks() {
    return [...this.tasks];
  }

  getUsers() {
    return [...this.users];
  }

  addTask(task: Task) {
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updates: Partial<Task>) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates };
      return this.tasks[index];
    }
    return null;
  }

  deleteTask(id: string) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const store = new DataStore();

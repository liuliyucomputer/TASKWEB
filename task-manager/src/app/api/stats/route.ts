import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import type { TaskStats } from '@/types';

export async function GET() {
  const tasks = store.getTasks();
  const users = store.getUsers();

  const stats: TaskStats[] = users.map(user => {
    const userTasks = tasks.filter(
      t => t.assignedTo === user.id || t.claimedBy === user.id
    );
    const completedTasks = userTasks.filter(t => t.status === 'completed');
    const inProgressTasks = userTasks.filter(t => t.status === 'in-progress');

    return {
      userId: user.id,
      userName: user.name,
      totalTasks: userTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      completionRate: userTasks.length > 0
        ? (completedTasks.length / userTasks.length) * 100
        : 0,
    };
  });

  return NextResponse.json({ stats });
}

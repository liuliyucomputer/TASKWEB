import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import type { Task } from '@/types';

export async function GET() {
  const tasks = store.getTasks();
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const task: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: body.content,
    status: 'pending',
    createdBy: body.createdBy,
    assignedTo: body.assignedTo,
    createdAt: Date.now(),
  };
  store.addTask(task);
  return NextResponse.json({ task });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const updated = store.updateTask(body.id, body.updates);
  return NextResponse.json({ task: updated });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    store.deleteTask(id);
  }
  return NextResponse.json({ success: true });
}

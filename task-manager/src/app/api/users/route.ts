import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const users = store.getUsers();
  return NextResponse.json({ users });
}

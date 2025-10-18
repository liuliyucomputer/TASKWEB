'use client';

import { useEffect, useState } from 'react';
import type { Task, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [newTask, setNewTask] = useState('');
  const [assignUser, setAssignUser] = useState<string>('none');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const [tasksRes, usersRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/users'),
    ]);
    const tasksData = await tasksRes.json();
    const usersData = await usersRes.json();
    setTasks(tasksData.tasks);
    setUsers(usersData.users);
    if (!currentUser && usersData.users.length > 0) {
      setCurrentUser(usersData.users[0].id);
    }
  };

  const createTask = async () => {
    if (!newTask.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newTask,
        createdBy: currentUser,
        assignedTo: assignUser && assignUser !== 'none' ? assignUser : undefined,
      }),
    });
    setNewTask('');
    setAssignUser('none');
    toast.success('任务发布成功', {
      style: { background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }
    });
    fetchData();
  };

  const claimTask = async (taskId: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        updates: { claimedBy: currentUser, status: 'in-progress' },
      }),
    });
    toast.success('任务已领取');
    fetchData();
  };

  const completeTask = async (taskId: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        updates: { status: 'completed', completedAt: Date.now() },
      }),
    });
    toast.success('任务已完成');
    fetchData();
  };

  const assignTask = async (taskId: string, userId: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        updates: { assignedTo: userId },
      }),
    });
    toast.success('任务已分配');
    fetchData();
  };

  const deleteTask = async (taskId: string) => {
    await fetch(`/api/tasks?id=${taskId}`, {
      method: 'DELETE',
    });
    toast.success('任务已删除');
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'in-progress': return '进行中';
      case 'completed': return '已完成';
      default: return status;
    }
  };

  const getUserName = (id?: string) => users.find(u => u.id === id)?.name || '未分配';
  const getUserColor = (id?: string) => users.find(u => u.id === id)?.color || '#666';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2 animate-slide-up">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          任务管理中心
        </h1>
        <p className="text-muted-foreground">协作·高效·科技</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4 animate-scale-in">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <Select value={currentUser} onValueChange={setCurrentUser}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="输入任务内容..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createTask()}
            className="flex-1"
          />
          <Select value={assignUser} onValueChange={setAssignUser}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="选择分配对象" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">不指定</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={createTask} className="glow w-full md:w-auto">
            发布任务
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.filter(t => t.status !== 'completed').map((task, idx) => (
          <div
            key={task.id}
            className="task-card animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              <Avatar className="border-2" style={{ borderColor: getUserColor(task.createdBy) }}>
                <AvatarFallback style={{ background: getUserColor(task.createdBy) }}>
                  {getUserName(task.createdBy)[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <p className="text-lg">{task.content}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>发布人: {getUserName(task.createdBy)}</span>
                  {task.assignedTo && <span>• 分配给: {getUserName(task.assignedTo)}</span>}
                  {task.claimedBy && <span>• 执行人: {getUserName(task.claimedBy)}</span>}
                </div>
              </div>

              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>

              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => claimTask(task.id)}>
                      领取
                    </Button>
                    <Select onValueChange={(userId) => assignTask(task.id, userId)}>
                      <SelectTrigger className="w-24 h-9">
                        <SelectValue placeholder="分配" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
                {task.status === 'in-progress' && task.claimedBy === currentUser && (
                  <Button size="sm" variant="outline" onClick={() => completeTask(task.id)}>
                    完成
                  </Button>
                )}
                {task.createdBy === currentUser && (
                  <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                    删除
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

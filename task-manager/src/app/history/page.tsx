'use client';

import { useEffect, useState } from 'react';
import type { Task, User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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
    setTasks(tasksData.tasks.sort((a: Task, b: Task) => b.createdAt - a.createdAt));
    setUsers(usersData.users);
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
  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2 animate-slide-up">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          历史记录
        </h1>
        <p className="text-muted-foreground">所有任务的完整记录</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="glass-hover rounded-xl p-4 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="border-2" style={{ borderColor: getUserColor(task.createdBy) }}>
                  <AvatarFallback style={{ background: getUserColor(task.createdBy) }}>
                    {getUserName(task.createdBy)[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <p className="text-base">{task.content}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>发布: {getUserName(task.createdBy)}</span>
                    {task.assignedTo && <span>• 分配: {getUserName(task.assignedTo)}</span>}
                    {task.claimedBy && <span>• 执行: {getUserName(task.claimedBy)}</span>}
                    <span>• {formatDate(task.createdAt)}</span>
                    {task.completedAt && <span>• 完成于 {formatDate(task.completedAt)}</span>}
                  </div>
                </div>

                <Badge className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              暂无任务记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { TaskStats, User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function StatsPage() {
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const [statsRes, usersRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/users'),
    ]);
    const statsData = await statsRes.json();
    const usersData = await usersRes.json();
    setStats(statsData.stats);
    setUsers(usersData.users);
  };

  const getUserColor = (id: string) => users.find(u => u.id === id)?.color || '#666';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2 animate-slide-up">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          数据统计
        </h1>
        <p className="text-muted-foreground">团队成员任务完成情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat.userId}
            className="glass rounded-2xl p-6 space-y-6 animate-scale-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2" style={{ borderColor: getUserColor(stat.userId) }}>
                <AvatarFallback className="text-2xl" style={{ background: getUserColor(stat.userId) }}>
                  {stat.userName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">{stat.userName}</h3>
                <p className="text-sm text-muted-foreground">任务执行者</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass-hover rounded-xl p-4 text-center space-y-1">
                <div className="text-3xl font-bold text-primary">{stat.totalTasks}</div>
                <div className="text-xs text-muted-foreground">总任务数</div>
              </div>
              <div className="glass-hover rounded-xl p-4 text-center space-y-1">
                <div className="text-3xl font-bold text-green-400">{stat.completedTasks}</div>
                <div className="text-xs text-muted-foreground">已完成</div>
              </div>
              <div className="glass-hover rounded-xl p-4 text-center space-y-1">
                <div className="text-3xl font-bold text-blue-400">{stat.inProgressTasks}</div>
                <div className="text-xs text-muted-foreground">进行中</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">完成率</span>
                <span className="font-bold text-accent">{stat.completionRate.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500 glow"
                  style={{ width: `${stat.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          暂无统计数据
        </div>
      )}
    </div>
  );
}

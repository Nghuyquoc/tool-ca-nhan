import React, { useState } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Repeat,
  Bell,
  Search,
} from 'lucide-react';
import { PriorityLevel, TaskStatus, TaskItem } from '../types';
import confetti from 'canvas-confetti';

export const TodoPage: React.FC = () => {
  const {
    tasks,
    taskView,
    setTaskView,
    taskCategoryFilter,
    taskPriorityFilter,
    taskSearchQuery,
    setTaskSearchQuery,
    createTask,
    toggleTaskStatus,
    deleteTask,
    openQuickCreateWithTab,
  } = useWorkspaceStore();

  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineDueTime, setInlineDueTime] = useState('18:00');
  const [inlinePriority, setInlinePriority] = useState<PriorityLevel>('medium');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filtering tasks based on active view
  let filteredTasks = tasks.filter((t: TaskItem) => {
    // Search
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCategory = t.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }

    // Category filter
    if (taskCategoryFilter && t.category !== taskCategoryFilter) return false;

    // Priority filter
    if (taskPriorityFilter && t.priority !== taskPriorityFilter) return false;

    // View filter
    if (taskView === 'completed') return t.status === 'completed';
    if (taskView === 'today') {
      return !t.dueDate || t.dueDate === todayStr;
    }
    if (taskView === 'tomorrow') {
      return t.dueDate === tomorrowStr;
    }
    if (taskView === 'upcoming') {
      return t.dueDate && t.dueDate > todayStr;
    }
    // 'all'
    return true;
  });

  const completedCount = tasks.filter((t: TaskItem) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t: TaskItem) => t.status !== 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;

    createTask({
      title: inlineTitle.trim(),
      status: 'todo',
      priority: inlinePriority,
      dueDate: taskView === 'tomorrow' ? tomorrowStr : todayStr,
      dueTime: inlineDueTime,
      category: taskCategoryFilter || 'Công việc',
      tags: [],
      hasAlarm: false,
    });

    setInlineTitle('');
  };

  const handleToggle = (id: string, currentStatus: TaskStatus) => {
    toggleTaskStatus(id);
    if (currentStatus !== 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-500">Khẩn cấp</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">Cao</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-500">Vừa</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">Thấp</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Quản lý công việc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Danh Sách Nhiệm Vụ (Todo List)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendingCount} việc cần làm • {completedCount} đã hoàn thành
          </p>
        </div>

        <button
          onClick={() => openQuickCreateWithTab('task')}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm hover:opacity-90 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Task Đầy Đủ</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center text-xs font-semibold mb-2">
          <span className="text-muted-foreground">Tiến độ hoàn thành</span>
          <span className="text-primary font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* View Tabs & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* View Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-secondary/60 border border-border text-xs font-semibold">
          {[
            { id: 'today', label: 'Hôm nay' },
            { id: 'tomorrow', label: 'Ngày mai' },
            { id: 'upcoming', label: 'Sắp tới' },
            { id: 'all', label: 'Tất cả' },
            { id: 'completed', label: 'Đã hoàn thành' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTaskView(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
                taskView === tab.id
                  ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm task..."
            value={taskSearchQuery}
            onChange={(e) => setTaskSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none border border-border"
          />
        </div>
      </div>

      {/* Inline Quick Add Task */}
      <form onSubmit={handleQuickAdd} className="flex items-center gap-2 p-2 bg-card border border-border rounded-2xl shadow-sm">
        <input
          type="text"
          placeholder="Thêm nhanh task (Ví dụ: Đọc sách 20 phút, Đi tập cầu)..."
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <input
          type="time"
          value={inlineDueTime}
          onChange={(e) => setInlineDueTime(e.target.value)}
          className="bg-secondary/60 px-2 py-1.5 rounded-xl text-xs font-mono focus:outline-none border border-border"
        />
        <select
          value={inlinePriority}
          onChange={(e) => setInlinePriority(e.target.value as PriorityLevel)}
          className="bg-secondary/60 px-2 py-1.5 rounded-xl text-xs focus:outline-none border border-border"
        >
          <option value="low" className="bg-card">Thấp</option>
          <option value="medium" className="bg-card">Vừa</option>
          <option value="high" className="bg-card">Cao</option>
          <option value="urgent" className="bg-card">Gấp</option>
        </select>
        <button
          type="submit"
          disabled={!inlineTitle.trim()}
          className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition shrink-0"
        >
          Thêm
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card/40 border border-border rounded-3xl">
            <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h3 className="font-semibold text-foreground text-sm">Không có công việc nào</h3>
            <p className="text-xs mt-0.5">Bạn đã giải quyết xong mọi việc hoặc chưa có task nào trong mục này!</p>
          </div>
        ) : (
          filteredTasks.map((task: TaskItem) => (
            <div
              key={task.id}
              className={`p-4 rounded-3xl border transition-all duration-200 flex items-start justify-between gap-3 group ${
                task.status === 'completed'
                  ? 'bg-card/30 border-border/40 opacity-70'
                  : 'bg-card border-border hover:border-primary/40 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                {/* Checkbox with bounce animation */}
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                    task.status === 'completed'
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {getPriorityBadge(task.priority)}
                    {task.category && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">
                        {task.category}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Badges footer: Due time, Recurring, Linked Alarm */}
                  <div className="flex items-center space-x-3 mt-2 text-[11px] text-muted-foreground flex-wrap gap-y-1">
                    {task.dueTime && (
                      <span className="flex items-center space-x-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{task.dueTime}</span>
                        {task.dueDate && <span>({task.dueDate})</span>}
                      </span>
                    )}

                    {task.isRecurring && (
                      <span className="flex items-center space-x-1 text-indigo-400">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Lặp lại</span>
                      </span>
                    )}

                    {task.hasAlarm && (
                      <span className="flex items-center space-x-1 text-red-400">
                        <Bell className="w-3.5 h-3.5" />
                        <span>Báo thức</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition"
                  title="Xóa task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

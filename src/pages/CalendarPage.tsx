import React, { useState } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { TaskItem } from '../types';

export const CalendarPage: React.FC = () => {
  const { tasks, openQuickCreateWithTab } = useWorkspaceStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in current month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar matrix days
  interface CalendarDayInfo {
    dayNumber: number;
    dateStr: string;
    isToday: boolean;
    dayTasks: TaskItem[];
  }

  const calendarCells: (CalendarDayInfo | null)[] = [];
  // Empty offset cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: d,
      dateStr: dStr,
      isToday: dStr === todayStr,
      dayTasks: tasks.filter((t: TaskItem) => t.dueDate === dStr),
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Lịch trình & Kế hoạch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Lịch Làm Việc (Calendar)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng quan deadline, công việc và lịch nhắc hẹn theo ngày
          </p>
        </div>

        {/* Month Navigation & View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-secondary/80 rounded-2xl p-1 border border-border">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-card text-muted-foreground hover:text-foreground transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-foreground">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-card text-muted-foreground hover:text-foreground transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openQuickCreateWithTab('task')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo task</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 border-b border-border bg-secondary/30 text-center py-2.5 text-xs font-bold text-muted-foreground">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/40 min-h-[500px]">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="bg-secondary/10 p-2 min-h-[90px]" />;
            }

            return (
              <div
                key={cell.dateStr}
                onClick={() => openQuickCreateWithTab('task')}
                className={`p-2 min-h-[90px] sm:min-h-[110px] flex flex-col justify-between hover:bg-secondary/40 transition cursor-pointer group ${
                  cell.isToday ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      cell.isToday
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {cell.dayTasks.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {cell.dayTasks.length} task
                    </span>
                  )}
                </div>

                {/* Task chips preview in calendar cell */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                  {cell.dayTasks.slice(0, 2).map((t: TaskItem) => (
                    <div
                      key={t.id}
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate flex items-center space-x-1 ${
                        t.status === 'completed'
                          ? 'bg-secondary text-muted-foreground line-through'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                  {cell.dayTasks.length > 2 && (
                    <div className="text-[9px] text-muted-foreground text-center">
                      +{cell.dayTasks.length - 2} việc khác
                    </div>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 text-[10px] text-primary flex items-center space-x-0.5 pt-1">
                  <Plus className="w-3 h-3" />
                  <span>Thêm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

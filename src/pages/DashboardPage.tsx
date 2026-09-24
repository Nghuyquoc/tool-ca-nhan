import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Bell,
  Flame,
  Plus,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { TaskItem, Alarm, NewsArticle, DashboardWidgetConfig } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    toggleTaskStatus,
    alarms,
    toggleAlarm,
    news,
    createNote,
    openQuickCreateWithTab,
    widgets,
    toggleWidget,
  } = useWorkspaceStore();

  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting based on time of day
  const hour = currentTime.getHours();
  let greeting = 'Chào buổi sáng 👋';
  if (hour >= 12 && hour < 18) {
    greeting = 'Chào buổi chiều ☀️';
  } else if (hour >= 18) {
    greeting = 'Chào buổi tối 🌙';
  }

  // Date formatting in Vietnamese
  const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dayName = daysOfWeek[currentTime.getDay()];
  const formattedDate = `Hôm nay là ${dayName}, ngày ${currentTime.getDate()} tháng ${currentTime.getMonth() + 1}, năm ${currentTime.getFullYear()}`;

  // Tasks today
  const todayStr = currentTime.toISOString().split('T')[0];
  const todayTasks = tasks.filter((t: TaskItem) => !t.dueDate || t.dueDate === todayStr);
  const completedTodayTasks = todayTasks.filter((t: TaskItem) => t.status === 'completed');
  const taskProgressPercent = todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0;

  // Next upcoming alarm
  const enabledAlarms = alarms.filter((a: Alarm) => a.isEnabled);
  const nextAlarm = enabledAlarms.length > 0 ? enabledAlarms[0] : null;

  // Compute time difference for Next Alarm
  const getAlarmRemainingText = (alarmTimeStr: string) => {
    const [targetH, targetM] = alarmTimeStr.split(':').map(Number);
    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();

    let diffMinutes = targetH * 60 + targetM - (nowH * 60 + nowM);
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Next day
    }
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    if (h === 0 && m === 0) return 'Đang diễn ra!';
    if (h === 0) return `Còn ${m} phút`;
    return `Còn ${h} giờ ${m} phút`;
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    const firstLine = quickNoteText.trim().split('\n')[0];
    const title = firstLine.length > 30 ? firstLine.slice(0, 30) + '...' : firstLine;
    createNote({
      title: `⚡ ${title}`,
      content: quickNoteText,
      tags: ['QuickNote'],
    });
    setQuickNoteText('');
    setQuickNoteSaved(true);
    setTimeout(() => setQuickNoteSaved(false), 2000);
  };

  const handleTaskToggleWithConfetti = (taskId: string) => {
    toggleTaskStatus(taskId);
    if (completedTodayTasks.length + 1 >= todayTasks.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  const totalNotesCount = useWorkspaceStore((s) => s.notes.filter((n) => !n.isTrash).length);
  const pendingTasksCount = tasks.filter((t: TaskItem) => t.status !== 'completed').length;
  const activeAlarmsCount = alarms.filter((a: Alarm) => a.isEnabled).length;
  const savedItemsCount = useWorkspaceStore((s) => s.notes.filter((n) => n.isFavorite && !n.isTrash).length + s.news.filter((nw) => nw.isSaved).length);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tổng quan ngày</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{formattedDate}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomizeModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Tùy chỉnh Widgets</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => navigate('/notes')}
          className="p-4 rounded-3xl bg-card border border-border hover:border-blue-500/50 hover:shadow-md transition-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Ghi chú</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{totalNotesCount}</div>
          <div className="text-[11px] text-blue-500 font-medium mt-0.5">Tất cả ghi chú →</div>
        </div>

        <div
          onClick={() => navigate('/todo')}
          className="p-4 rounded-3xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-md transition-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Việc cần làm</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{pendingTasksCount}</div>
          <div className="text-[11px] text-emerald-500 font-medium mt-0.5">Nhiệm vụ đang mở →</div>
        </div>

        <div
          onClick={() => navigate('/alarm')}
          className="p-4 rounded-3xl bg-card border border-border hover:border-red-500/50 hover:shadow-md transition-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Báo thức</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{activeAlarmsCount}</div>
          <div className="text-[11px] text-red-500 font-medium mt-0.5">Báo thức đang bật →</div>
        </div>

        <div
          onClick={() => navigate('/saved')}
          className="p-4 rounded-3xl bg-card border border-border hover:border-amber-500/50 hover:shadow-md transition-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Đã lưu & Yêu thích</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{savedItemsCount}</div>
          <div className="text-[11px] text-amber-500 font-medium mt-0.5">Kho lưu trữ cá nhân →</div>
        </div>
      </div>

      {/* 2. DYNAMIC WIDGETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* WIDGET: TODAY TASKS */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'today-tasks')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Công việc hôm nay</h2>
                </div>
                <button
                  onClick={() => openQuickCreateWithTab('task')}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                  title="Thêm task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-muted-foreground">
                    {completedTodayTasks.length} / {todayTasks.length} hoàn thành
                  </span>
                  <span className="font-bold text-primary">{taskProgressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${taskProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Task list preview */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {todayTasks.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    🎉 Bạn chưa có công việc nào hôm nay. Thư giãn nhé!
                  </div>
                ) : (
                  todayTasks.slice(0, 4).map((task: TaskItem) => (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between p-2.5 rounded-2xl border transition group ${
                        task.status === 'completed'
                          ? 'bg-secondary/30 border-transparent opacity-60'
                          : 'bg-secondary/60 border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <button
                          onClick={() => handleTaskToggleWithConfetti(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition active:scale-90 ${
                            task.status === 'completed'
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted-foreground hover:border-primary'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-medium truncate ${
                              task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            {task.dueTime && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                🕒 {task.dueTime}
                              </span>
                            )}
                            {task.priority === 'urgent' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/10 text-red-500">
                                GẤP
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => navigate('/todo')}
              className="mt-4 w-full py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center space-x-1 transition"
            >
              <span>Xem toàn bộ danh sách todo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* WIDGET: NEXT ALARM */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'next-alarm')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Báo thức kế tiếp</h2>
                </div>
                <button
                  onClick={() => openQuickCreateWithTab('alarm')}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                  title="Thêm báo thức"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {nextAlarm ? (
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-black font-mono tracking-tight text-foreground">
                        {nextAlarm.time}
                      </div>
                      <div className="text-sm font-semibold text-foreground mt-1">
                        {nextAlarm.title}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAlarm(nextAlarm.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
                        nextAlarm.isEnabled
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {nextAlarm.isEnabled ? 'BẬT' : 'TẮT'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1 text-primary font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getAlarmRemainingText(nextAlarm.time)}</span>
                    </span>
                    <span className="capitalize">{nextAlarm.sound} chime</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground text-xs rounded-2xl bg-secondary/30">
                  <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>Không còn báo thức nào hôm nay</p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/alarm')}
              className="mt-4 w-full py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center space-x-1 transition"
            >
              <span>Quản lý tất cả báo thức</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* WIDGET: QUICK NOTE */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'quick-note')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Ghi chú nhanh</h2>
                </div>
                {quickNoteSaved && (
                  <span className="text-xs font-semibold text-emerald-500 animate-fadeIn">
                    ✓ Đã lưu!
                  </span>
                )}
              </div>

              <textarea
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Nhập nhanh ý tưởng, số điện thoại, ghi chú vắn tắt..."
                rows={4}
                className="w-full text-xs sm:text-sm bg-secondary/40 rounded-2xl p-3 border border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-muted-foreground">
                Tự động chuyển vào Notes
              </span>
              <button
                onClick={handleSaveQuickNote}
                disabled={!quickNoteText.trim()}
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition"
              >
                Lưu nhanh
              </button>
            </div>
          </div>
        )}

        {/* WIDGET: PRODUCTIVITY & STREAK */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'productivity')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Hiệu suất & Streak</h2>
                </div>
                <span className="text-xs font-bold text-orange-500 px-2 py-0.5 rounded-full bg-orange-500/10 flex items-center space-x-1">
                  <Flame className="w-3 h-3 fill-orange-500" />
                  <span>5 ngày liên tục</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-secondary/40 border border-border text-center">
                  <div className="text-2xl font-black text-foreground">
                    {completedTodayTasks.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Hoàn thành hôm nay</div>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/40 border border-border text-center">
                  <div className="text-2xl font-black text-primary">
                    18
                  </div>
                  <div className="text-[11px] text-muted-foreground">Tuần này</div>
                </div>
              </div>

              {/* Weekly Mini Bars */}
              <div>
                <div className="text-[11px] text-muted-foreground mb-1.5">Tiến độ 7 ngày qua</div>
                <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
                  {[
                    { day: 'T2', val: 70 },
                    { day: 'T3', val: 85 },
                    { day: 'T4', val: 100 },
                    { day: 'T5', val: 60 },
                    { day: 'T6', val: 90 },
                    { day: 'T7', val: 40 },
                    { day: 'CN', val: 50 },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                      <div className="w-full bg-secondary rounded-t-md h-full flex items-end overflow-hidden">
                        <div
                          className="w-full bg-primary rounded-t-md transition-all duration-300"
                          style={{ height: `${d.val}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
              ⚡ Bạn đang làm việc với năng suất cao hơn 25% so với tuần trước!
            </div>
          </div>
        )}

        {/* WIDGET: UPCOMING DEADLINES */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'upcoming')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Sắp tới & Deadline</h2>
                </div>
              </div>

              <div className="space-y-2.5">
                {tasks
                  .filter((t: TaskItem) => t.status !== 'completed' && t.dueDate && t.dueDate > todayStr)
                  .slice(0, 3)
                  .map((t: TaskItem) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-foreground truncate">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Hạn chót: {t.dueDate} {t.dueTime ? `lúc ${t.dueTime}` : ''}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold text-[10px] shrink-0">
                        {t.category || 'Chung'}
                      </span>
                    </div>
                  ))}
                {tasks.filter((t: TaskItem) => t.status !== 'completed' && t.dueDate && t.dueDate > todayStr).length === 0 && (
                  <div className="py-6 text-center text-muted-foreground text-xs">
                    Không có deadline nào trong vài ngày tới!
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate('/calendar')}
              className="mt-4 w-full py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center space-x-1 transition"
            >
              <span>Xem lịch biểu đầy đủ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* WIDGET: LATEST NEWS */}
        {widgets.find((w: DashboardWidgetConfig) => w.id === 'latest-news')?.isEnabled && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm transition-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-foreground">Tin tức mới nhất</h2>
                </div>
                <button
                  onClick={() => navigate('/news')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-3">
                {news.slice(0, 3).map((item: NewsArticle) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/news')}
                    className="flex items-start space-x-3 cursor-pointer group"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:opacity-80 transition"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[10px] text-muted-foreground mt-1">
                        <span className="font-medium text-emerald-500">{item.category}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/news')}
              className="mt-4 w-full py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center space-x-1 transition"
            >
              <span>Mở trang tin tức công nghệ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. CUSTOMIZE WIDGETS MODAL */}
      {customizeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setCustomizeModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-card border-2 border-slate-700/80 dark:border-slate-600/80 rounded-3xl shadow-2xl ring-1 ring-white/10 p-6 overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-base text-foreground">Tùy biến Dashboard Widgets</h3>
              <button
                onClick={() => setCustomizeModalOpen(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 font-bold"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3">
              {widgets.map((widget: DashboardWidgetConfig) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/70 border border-border"
                >
                  <span className="text-sm font-semibold text-foreground">{widget.titleVi}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={widget.isEnabled}
                      onChange={() => toggleWidget(widget.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCustomizeModalOpen(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

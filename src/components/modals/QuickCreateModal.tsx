import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { X, FileText, CheckSquare, Bell, Clock, Plus, Tag, Folder, AlertCircle, Volume2 } from 'lucide-react';
import { PriorityLevel, RepeatType, AlarmSound } from '../../types';
import { previewSound } from '../../utils/sound';

export const QuickCreateModal: React.FC = () => {
  const {
    quickCreateOpen,
    setQuickCreateOpen,
    quickCreateDefaultTab,
    createNote,
    createTask,
    createAlarm,
    folders,
    tasks,
    settings,
  } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'note' | 'task' | 'alarm' | 'reminder'>(quickCreateDefaultTab);

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFolderId, setNoteFolderId] = useState<string>('');
  const [noteTagsInput, setNoteTagsInput] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskDueTime, setTaskDueTime] = useState('18:00');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('medium');
  const [taskCategory, setTaskCategory] = useState('Công việc');
  const [taskTagsInput, setTaskTagsInput] = useState('');
  const [taskHasReminder, setTaskHasReminder] = useState(true);
  const [taskReminderMinutes, setTaskReminderMinutes] = useState(15);
  const [taskHasAlarm, setTaskHasAlarm] = useState(false);
  const [taskIsRecurring, setTaskIsRecurring] = useState(false);
  const [taskRepeatType, setTaskRepeatType] = useState<RepeatType>('daily');
  const [taskRepeatDays, setTaskRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Alarm form state
  const [alarmTime, setAlarmTime] = useState('07:30');
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmDesc, setAlarmDesc] = useState('');
  const [alarmRepeatType, setAlarmRepeatType] = useState<RepeatType>('daily');
  const [alarmRepeatDays, setAlarmRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [alarmSound, setAlarmSound] = useState<AlarmSound>(settings.defaultSound || 'morning');
  const [alarmVolume, setAlarmVolume] = useState(settings.alarmVolume || 80);
  const [alarmSnoozeDuration, setAlarmSnoozeDuration] = useState(settings.defaultSnoozeMinutes || 5);
  const [alarmLinkedTaskId, setAlarmLinkedTaskId] = useState('');

  useEffect(() => {
    setActiveTab(quickCreateDefaultTab);
  }, [quickCreateDefaultTab]);

  // Global single-letter shortcut listener when modal is not focused in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveTab('note');
        setQuickCreateOpen(true);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setActiveTab('task');
        setQuickCreateOpen(true);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setActiveTab('alarm');
        setQuickCreateOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickCreateOpen]);

  if (!quickCreateOpen) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const tags = noteTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    createNote({
      title: noteTitle.trim(),
      content: noteContent,
      folderId: noteFolderId || undefined,
      tags,
    });
    setNoteTitle('');
    setNoteContent('');
    setNoteTagsInput('');
    setQuickCreateOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const tags = taskTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createTask({
      title: taskTitle.trim(),
      description: taskDesc,
      status: 'todo',
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      category: taskCategory,
      tags,
      reminderMinutesBefore: taskHasReminder ? taskReminderMinutes : undefined,
      hasAlarm: taskHasAlarm,
      isRecurring: taskIsRecurring,
      recurringRule: taskIsRecurring ? { type: taskRepeatType, customDays: taskRepeatDays } : undefined,
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskTagsInput('');
    setQuickCreateOpen(false);
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarmTime || !alarmTitle.trim()) return;

    createAlarm({
      title: alarmTitle.trim(),
      description: alarmDesc,
      time: alarmTime,
      isEnabled: true,
      repeatType: alarmRepeatType,
      repeatDays: alarmRepeatDays,
      sound: alarmSound,
      volume: alarmVolume,
      snoozeEnabled: true,
      snoozeDuration: alarmSnoozeDuration,
      vibrate: true,
      linkedTaskId: alarmLinkedTaskId || undefined,
    });

    setAlarmTitle('');
    setAlarmDesc('');
    setQuickCreateOpen(false);
  };

  const toggleDay = (day: number) => {
    if (alarmRepeatDays.includes(day)) {
      setAlarmRepeatDays(alarmRepeatDays.filter((d) => d !== day));
    } else {
      setAlarmRepeatDays([...alarmRepeatDays, day].sort());
    }
  };

  const dayLabels = [
    { day: 1, label: 'T2' },
    { day: 2, label: 'T3' },
    { day: 3, label: 'T4' },
    { day: 4, label: 'T5' },
    { day: 5, label: 'T6' },
    { day: 6, label: 'T7' },
    { day: 0, label: 'CN' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setQuickCreateOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('note')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'note'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ghi chú</span>
            </button>
            <button
              onClick={() => setActiveTab('task')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'task'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Công việc</span>
            </button>
            <button
              onClick={() => setActiveTab('alarm')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'alarm'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Báo thức</span>
            </button>
          </div>
          <button
            onClick={() => setQuickCreateOpen(false)}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* 1. NOTE TAB */}
          {activeTab === 'note' && (
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Tiêu đề ghi chú..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-base sm:text-lg font-bold bg-secondary/80 hover:bg-secondary focus:bg-card px-4 py-2.5 rounded-2xl border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-foreground placeholder:text-muted-foreground outline-none transition"
                  autoFocus
                />
              </div>
              <div>
                <textarea
                  placeholder="Nội dung ghi chú (hỗ trợ Markdown, checklist, link)..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                  className="w-full text-sm bg-secondary/80 hover:bg-secondary focus:bg-card p-3.5 rounded-2xl border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 resize-none text-foreground placeholder:text-muted-foreground outline-none transition leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 bg-secondary/80 hover:bg-secondary p-2 rounded-2xl border border-border">
                  <Folder className="w-4 h-4 text-blue-500 shrink-0 ml-1" />
                  <select
                    value={noteFolderId}
                    onChange={(e) => setNoteFolderId(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">Chọn thư mục (Tùy chọn)</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id} className="bg-card text-foreground">
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/80 hover:bg-secondary p-2 rounded-2xl border border-border">
                  <Tag className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
                  <input
                    type="text"
                    placeholder="Tags (cách nhau bằng phẩy)..."
                    value={noteTagsInput}
                    onChange={(e) => setNoteTagsInput(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-muted-foreground text-foreground"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!noteTitle.trim()}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 disabled:opacity-40 transition active:scale-95"
                >
                  Lưu Ghi Chú
                </button>
              </div>
            </form>
          )}

          {/* 2. TASK TAB */}
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Tên công việc (Ví dụ: Đi đánh cầu lúc 19:00)..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-base sm:text-lg font-bold bg-secondary/80 hover:bg-secondary focus:bg-card px-4 py-2.5 rounded-2xl border border-border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 text-foreground placeholder:text-muted-foreground outline-none transition"
                  autoFocus
                />
              </div>
              <div>
                <textarea
                  placeholder="Mô tả chi tiết hoặc checklist..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-secondary/80 hover:bg-secondary focus:bg-card p-3 rounded-2xl border border-border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 resize-none text-foreground placeholder:text-muted-foreground outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Ngày hết hạn</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card p-2 rounded-xl border border-border focus:outline-none text-xs text-foreground font-medium"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Giờ hết hạn</label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card p-2 rounded-xl border border-border focus:outline-none text-xs font-mono text-foreground font-medium"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Độ ưu tiên</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card p-2 rounded-xl border border-border focus:outline-none text-xs text-foreground font-medium cursor-pointer"
                  >
                    <option value="low" className="bg-card text-foreground">Thấp (Low)</option>
                    <option value="medium" className="bg-card text-foreground">Vừa (Medium)</option>
                    <option value="high" className="bg-card text-foreground">Cao (High)</option>
                    <option value="urgent" className="bg-card text-foreground">Khẩn cấp (Urgent)</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Danh mục</label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card p-2 rounded-xl border border-border focus:outline-none text-xs text-foreground font-medium"
                    placeholder="Công việc..."
                  />
                </div>
              </div>

              {/* Reminders, Alarm & Recurring */}
              <div className="p-4 bg-secondary/60 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="flex items-center space-x-2.5 cursor-pointer font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={taskHasReminder}
                      onChange={(e) => setTaskHasReminder(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                    />
                    <span>Nhắc nhở trước deadline</span>
                  </label>
                  {taskHasReminder && (
                    <select
                      value={taskReminderMinutes}
                      onChange={(e) => setTaskReminderMinutes(Number(e.target.value))}
                      className="bg-card text-foreground px-2.5 py-1 rounded-lg border border-border text-xs focus:outline-none font-medium cursor-pointer"
                    >
                      <option value={0} className="bg-card">Đúng giờ</option>
                      <option value={5} className="bg-card">5 phút trước</option>
                      <option value={10} className="bg-card">10 phút trước</option>
                      <option value={15} className="bg-card">15 phút trước</option>
                      <option value={30} className="bg-card">30 phút trước</option>
                      <option value={60} className="bg-card">1 giờ trước</option>
                      <option value={1440} className="bg-card">1 ngày trước</option>
                    </select>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-border/50">
                  <label className="flex items-center space-x-2.5 cursor-pointer font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={taskHasAlarm}
                      onChange={(e) => setTaskHasAlarm(e.target.checked)}
                      className="w-4 h-4 rounded text-red-500 focus:ring-0"
                    />
                    <span className="flex items-center space-x-1">
                      <Bell className="w-3.5 h-3.5 text-red-500" />
                      <span>Kích hoạt Báo thức vào lúc {taskDueTime}</span>
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="flex items-center space-x-2.5 cursor-pointer font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={taskIsRecurring}
                        onChange={(e) => setTaskIsRecurring(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-500 focus:ring-0"
                      />
                      <span className="flex items-center space-x-1.5">
                        <span>Lặp lại công việc (Recurring Task) 🔁</span>
                      </span>
                    </label>
                  </div>

                  {taskIsRecurring && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-xs">
                      {[
                        { id: 'daily', label: 'Hằng ngày' },
                        { id: 'weekdays', label: 'T2 - T6' },
                        { id: 'weekend', label: 'Cuối tuần' },
                        { id: 'weekly', label: 'Hằng tuần' },
                      ].map((r) => (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setTaskRepeatType(r.id as RepeatType)}
                          className={`py-2 px-2.5 rounded-xl font-bold transition-all duration-150 ${
                            taskRepeatType === r.id
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                              : 'bg-card text-foreground hover:bg-secondary border border-border'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/25 disabled:opacity-40 transition active:scale-95"
                >
                  Thêm Công Việc
                </button>
              </div>
            </form>
          )}

          {/* 3. ALARM TAB */}
          {activeTab === 'alarm' && (
            <form onSubmit={handleCreateAlarm} className="space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-36 shrink-0">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Giờ báo thức</label>
                  <input
                    type="time"
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full text-2xl font-mono font-bold bg-secondary/80 hover:bg-secondary focus:bg-card p-2.5 rounded-2xl border border-border focus:border-red-500 focus:ring-2 focus:ring-red-500/25 text-center text-foreground outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên báo thức</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thức dậy, Đi đánh cầu..."
                    value={alarmTitle}
                    onChange={(e) => setAlarmTitle(e.target.value)}
                    className="w-full text-sm font-semibold bg-secondary/80 hover:bg-secondary focus:bg-card p-3 rounded-2xl border border-border focus:border-red-500 focus:ring-2 focus:ring-red-500/25 text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
              </div>

              {/* Repeat Options */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Lặp lại</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-3 text-xs">
                  {[
                    { id: 'none', label: '1 lần' },
                    { id: 'daily', label: 'Hằng ngày' },
                    { id: 'weekdays', label: 'T2 - T6' },
                    { id: 'weekend', label: 'Cuối tuần' },
                    { id: 'custom', label: 'Tùy chỉnh' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setAlarmRepeatType(r.id as RepeatType)}
                      className={`py-2 px-2 rounded-xl font-bold transition-all duration-150 ${
                        alarmRepeatType === r.id
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                          : 'bg-secondary/80 text-foreground hover:bg-secondary border border-border'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Day selector for custom */}
                {alarmRepeatType === 'custom' && (
                  <div className="flex justify-between items-center bg-secondary/60 p-2.5 rounded-2xl border border-border mb-3">
                    {dayLabels.map(({ day, label }) => {
                      const isSelected = alarmRepeatDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all duration-150 ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-md shadow-red-600/25 scale-105'
                              : 'bg-card text-foreground hover:bg-secondary border border-border'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sound, Volume & Snooze */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-secondary/60 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-muted-foreground font-semibold">Âm thanh chuông</label>
                    <button
                      type="button"
                      onClick={() => previewSound(alarmSound, alarmVolume)}
                      className="text-primary hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Thử chuông</span>
                    </button>
                  </div>
                  <select
                    value={alarmSound}
                    onChange={(e) => setAlarmSound(e.target.value as AlarmSound)}
                    className="w-full bg-card text-foreground p-2 rounded-xl border border-border focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="morning" className="bg-card">Morning Breeze (Nhẹ nhàng)</option>
                    <option value="gentle" className="bg-card">Gentle Tone (Thư thái)</option>
                    <option value="chime" className="bg-card">Chime Bell (Chuông ngân)</option>
                    <option value="radar" className="bg-card">Radar Pulse (Mạnh mẽ)</option>
                    <option value="digital" className="bg-card">Digital Beep (Điện tử)</option>
                  </select>
                </div>

                <div className="p-3 bg-secondary/60 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-muted-foreground font-semibold">Báo lại (Snooze)</label>
                    <span className="font-mono text-primary font-bold">{alarmSnoozeDuration} phút</span>
                  </div>
                  <select
                    value={alarmSnoozeDuration}
                    onChange={(e) => setAlarmSnoozeDuration(Number(e.target.value))}
                    className="w-full bg-card text-foreground p-2 rounded-xl border border-border focus:outline-none font-medium cursor-pointer"
                  >
                    <option value={3} className="bg-card">3 phút</option>
                    <option value={5} className="bg-card">5 phút</option>
                    <option value={10} className="bg-card">10 phút</option>
                    <option value={15} className="bg-card">15 phút</option>
                  </select>
                </div>
              </div>

              {/* Link with task */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Liên kết công việc (Tùy chọn)</label>
                <select
                  value={alarmLinkedTaskId}
                  onChange={(e) => setAlarmLinkedTaskId(e.target.value)}
                  className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card p-2.5 rounded-2xl border border-border focus:outline-none text-xs text-foreground font-medium cursor-pointer"
                >
                  <option value="" className="bg-card text-foreground">Không liên kết công việc</option>
                  {tasks.filter(t => t.status !== 'completed').map((t) => (
                    <option key={t.id} value={t.id} className="bg-card text-foreground">
                      {t.title} {t.dueTime ? `(${t.dueTime})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!alarmTitle.trim() || !alarmTime}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-500/25 disabled:opacity-40 transition active:scale-95"
                >
                  Lưu Báo Thức
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

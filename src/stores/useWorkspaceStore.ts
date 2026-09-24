import { create } from 'zustand';
import { Note, NoteFolder, TaskItem, Alarm, NewsArticle, AppNotification, UserSettings, DashboardWidgetConfig, TaskStatus, PriorityLevel, RepeatType, AlarmSound } from '../types';
import { initialFolders, initialNotes, initialTasks, initialAlarms, initialNews, initialNotifications, initialWidgets, initialSettings } from '../mock/initialData';
import { playAlarmLoop, stopAlarmSound, playNotificationSound, playCompletionSound } from '../utils/sound';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface WorkspaceState {
  // Theme & Layout
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;

  // Modals & Navigation
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;
  quickCreateDefaultTab: 'note' | 'task' | 'alarm' | 'reminder';
  openQuickCreateWithTab: (tab: 'note' | 'task' | 'alarm' | 'reminder') => void;
  activeTriggeredAlarm: Alarm | null;
  triggerAlarm: (alarm: Alarm) => void;
  dismissAlarm: (alarmId: string) => void;
  snoozeAlarm: (alarmId: string, minutes?: number) => void;

  // Notes state
  folders: NoteFolder[];
  notes: Note[];
  activeNoteId: string | null;
  noteSearchQuery: string;
  selectedFolderId: string | null;
  selectedTag: string | null;
  noteFilter: 'all' | 'favorites' | 'recent' | 'trash';
  noteSortBy: 'updatedAt' | 'createdAt' | 'title';
  noteSaveStatus: 'saved' | 'saving';
  setActiveNoteId: (id: string | null) => void;
  setNoteSearchQuery: (query: string) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setNoteFilter: (filter: 'all' | 'favorites' | 'recent' | 'trash') => void;
  setNoteSortBy: (sortBy: 'updatedAt' | 'createdAt' | 'title') => void;
  createNote: (note?: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string, permanent?: boolean) => void;
  restoreNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  createFolder: (name: string, color?: string, icon?: string) => void;
  deleteFolder: (id: string) => void;

  // Todo state
  tasks: TaskItem[];
  taskView: 'today' | 'tomorrow' | 'upcoming' | 'all' | 'completed';
  taskCategoryFilter: string | null;
  taskPriorityFilter: PriorityLevel | null;
  taskSearchQuery: string;
  setTaskView: (view: 'today' | 'tomorrow' | 'upcoming' | 'all' | 'completed') => void;
  setTaskCategoryFilter: (category: string | null) => void;
  setTaskPriorityFilter: (priority: PriorityLevel | null) => void;
  setTaskSearchQuery: (query: string) => void;
  createTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => TaskItem;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Alarms state
  alarms: Alarm[];
  createAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>) => Alarm;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  duplicateAlarm: (id: string) => void;

  // News state
  news: NewsArticle[];
  newsCategory: string;
  newsSearchQuery: string;
  setNewsCategory: (category: string) => void;
  setNewsSearchQuery: (query: string) => void;
  toggleSaveArticle: (id: string) => void;
  markArticleAsRead: (id: string) => void;
  refreshNews: () => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: () => number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Dashboard customization
  widgets: DashboardWidgetConfig[];
  toggleWidget: (id: string) => void;
  reorderWidgets: (newWidgets: DashboardWidgetConfig[]) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Global search
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Engine ticker
  checkTriggers: () => void;
}

const STORAGE_KEY = 'personal_workspace_state_v1';

function loadStoredState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load local state:', e);
  }
  return null;
}

function saveState(state: Partial<WorkspaceState>) {
  try {
    const dataToSave = {
      notes: state.notes,
      folders: state.folders,
      tasks: state.tasks,
      alarms: state.alarms,
      news: state.news,
      notifications: state.notifications,
      widgets: state.widgets,
      settings: state.settings,
      theme: state.theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('Failed to save local state:', e);
  }
}

const stored = loadStoredState();

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Theme & Layout
  theme: stored?.theme || 'dark',
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveState(get());
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  rightPanelOpen: true,
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),

  // Modals & Navigation
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  quickCreateOpen: false,
  setQuickCreateOpen: (open) => set({ quickCreateOpen: open }),
  quickCreateDefaultTab: 'note',
  openQuickCreateWithTab: (tab) => set({ quickCreateOpen: true, quickCreateDefaultTab: tab }),

  activeTriggeredAlarm: null,
  triggerAlarm: (alarm) => {
    set({ activeTriggeredAlarm: alarm });
    const { settings } = get();
    // Check DND
    if (settings.doNotDisturb.enabled && !settings.doNotDisturb.allowAlarms) {
      // DND muted
    } else {
      playAlarmLoop(alarm.sound || settings.defaultSound, alarm.volume || settings.alarmVolume);
    }

    // Add notification
    get().addNotification({
      type: 'alarm',
      title: `⏰ Báo thức: ${alarm.title}`,
      content: alarm.description || `Đã đến giờ ${alarm.time}`,
      relatedEntityId: alarm.id,
      relatedEntityType: 'alarm',
    });

    // Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`⏰ ${alarm.title} (${alarm.time})`, {
        body: alarm.description || 'Đã đến giờ theo lịch hẹn của bạn',
        icon: '/icon-192.png',
        tag: `alarm-${alarm.id}`,
      });
    }
  },

  dismissAlarm: (alarmId) => {
    stopAlarmSound();
    set({ activeTriggeredAlarm: null });
    get().addToast('Đã tắt báo thức', 'info');
  },

  snoozeAlarm: (alarmId, minutes) => {
    stopAlarmSound();
    const duration = minutes || get().activeTriggeredAlarm?.snoozeDuration || get().settings.defaultSnoozeMinutes || 5;
    set({ activeTriggeredAlarm: null });
    get().addToast(`Đã báo lại sau ${duration} phút`, 'info');

    setTimeout(() => {
      const alarm = get().alarms.find(a => a.id === alarmId);
      if (alarm) {
        get().triggerAlarm(alarm);
      }
    }, duration * 60 * 1000);
  },

  // Notes
  folders: stored?.folders || initialFolders,
  notes: stored?.notes || initialNotes,
  activeNoteId: (stored?.notes || initialNotes)[0]?.id || null,
  noteSearchQuery: '',
  selectedFolderId: null,
  selectedTag: null,
  noteFilter: 'all',
  noteSortBy: 'updatedAt',
  noteSaveStatus: 'saved',

  setActiveNoteId: (id) => set({ activeNoteId: id }),
  setNoteSearchQuery: (query) => set({ noteSearchQuery: query }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id, noteFilter: 'all', selectedTag: null }),
  setSelectedTag: (tag) => set({ selectedTag: tag, noteFilter: 'all', selectedFolderId: null }),
  setNoteFilter: (filter) => set({ noteFilter: filter, selectedFolderId: null, selectedTag: null }),
  setNoteSortBy: (sortBy) => set({ noteSortBy: sortBy }),

  createNote: (custom) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: custom?.title || 'Ghi chú mới không tên',
      content: custom?.content || '',
      folderId: custom?.folderId || get().selectedFolderId || undefined,
      tags: custom?.tags || (get().selectedTag ? [get().selectedTag!] : []),
      isPinned: custom?.isPinned || false,
      isFavorite: custom?.isFavorite || false,
      isTrash: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      notes: [newNote, ...state.notes],
      activeNoteId: newNote.id,
      noteSaveStatus: 'saved',
    }));
    get().addToast('Đã tạo ghi chú mới', 'success');
    saveState(get());
    return newNote;
  },

  updateNote: (id, updates) => {
    set({ noteSaveStatus: 'saving' });
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    }));
    saveState(get());
    setTimeout(() => {
      set({ noteSaveStatus: 'saved' });
    }, 400);
  },

  deleteNote: (id, permanent = false) => {
    set((state) => {
      if (permanent) {
        return {
          notes: state.notes.filter((n) => n.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        };
      }
      return {
        notes: state.notes.map((n) => (n.id === id ? { ...n, isTrash: true } : n)),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
      };
    });
    get().addToast(permanent ? 'Đã xóa vĩnh viễn ghi chú' : 'Đã chuyển ghi chú vào thùng rác', 'info');
    saveState(get());
  },

  restoreNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, isTrash: false } : n)),
    }));
    get().addToast('Đã khôi phục ghi chú', 'success');
    saveState(get());
  },

  toggleFavoriteNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)),
    }));
    saveState(get());
  },

  togglePinNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }));
    saveState(get());
  },

  duplicateNote: (id) => {
    const original = get().notes.find((n) => n.id === id);
    if (!original) return;
    const duplicated: Note = {
      ...original,
      id: `note-${Date.now()}`,
      title: `${original.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      notes: [duplicated, ...state.notes],
      activeNoteId: duplicated.id,
    }));
    get().addToast('Đã nhân bản ghi chú', 'success');
    saveState(get());
  },

  createFolder: (name, color = '#3b82f6', icon = 'Folder') => {
    const newFolder: NoteFolder = {
      id: `folder-${Date.now()}`,
      name,
      color,
      icon,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ folders: [...state.folders, newFolder] }));
    get().addToast(`Đã tạo thư mục "${name}"`, 'success');
    saveState(get());
  },

  deleteFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      notes: state.notes.map((n) => (n.folderId === id ? { ...n, folderId: undefined } : n)),
    }));
    get().addToast('Đã xóa thư mục', 'info');
    saveState(get());
  },

  // Todo tasks
  tasks: stored?.tasks || initialTasks,
  taskView: 'today',
  taskCategoryFilter: null,
  taskPriorityFilter: null,
  taskSearchQuery: '',

  setTaskView: (view) => set({ taskView: view }),
  setTaskCategoryFilter: (cat) => set({ taskCategoryFilter: cat }),
  setTaskPriorityFilter: (pri) => set({ taskPriorityFilter: pri }),
  setTaskSearchQuery: (query) => set({ taskSearchQuery: query }),

  createTask: (taskData) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // If task has alarm enabled and dueTime, automatically create linked alarm!
    if (taskData.hasAlarm && taskData.dueTime) {
      const alarm: Alarm = {
        id: `alarm-${Date.now()}`,
        title: taskData.title,
        description: taskData.description || `Báo thức cho task: ${taskData.title}`,
        time: taskData.dueTime,
        date: taskData.dueDate,
        isEnabled: true,
        repeatType: taskData.recurringRule?.type || 'none',
        repeatDays: taskData.recurringRule?.customDays || [],
        sound: get().settings.defaultSound,
        volume: get().settings.alarmVolume,
        snoozeEnabled: true,
        snoozeDuration: get().settings.defaultSnoozeMinutes,
        vibrate: true,
        linkedTaskId: newTask.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newTask.linkedAlarmId = alarm.id;
      set((state) => ({
        alarms: [alarm, ...state.alarms],
      }));
    }

    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    get().addToast('Đã thêm công việc mới', 'success');
    saveState(get());
    return newTask;
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    get().addToast('Đã cập nhật công việc', 'success');
    saveState(get());
  },

  toggleTaskStatus: (id) => {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    const nextStatus: TaskStatus = current.status === 'completed' ? 'todo' : 'completed';
    const isNowCompleted = nextStatus === 'completed';

    if (isNowCompleted) {
      playCompletionSound();
    }

    // Check if task is recurring
    let nextRecurringTask: TaskItem | null = null;
    if (isNowCompleted && current.isRecurring && current.recurringRule && current.recurringRule.type !== 'none') {
      const { type, customDays } = current.recurringRule;
      const baseDate = current.dueDate ? new Date(current.dueDate) : new Date();
      const nextDate = new Date(baseDate);

      if (type === 'daily') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (type === 'weekdays') {
        do {
          nextDate.setDate(nextDate.getDate() + 1);
        } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
      } else if (type === 'weekend') {
        do {
          nextDate.setDate(nextDate.getDate() + 1);
        } while (nextDate.getDay() !== 0 && nextDate.getDay() !== 6);
      } else if (type === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (type === 'custom' && customDays && customDays.length > 0) {
        let count = 0;
        do {
          nextDate.setDate(nextDate.getDate() + 1);
          count++;
        } while (!customDays.includes(nextDate.getDay()) && count < 14);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const nextDueDateStr = nextDate.toISOString().split('T')[0];

      nextRecurringTask = {
        ...current,
        id: `task-${Date.now() + 1}`,
        status: 'todo',
        dueDate: nextDueDateStr,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
        linkedAlarmId: undefined,
      };

      // Also create linked alarm if recurring task has alarm
      if (current.hasAlarm && current.dueTime) {
        const nextAlarm: Alarm = {
          id: `alarm-${Date.now() + 2}`,
          title: current.title,
          description: `Báo thức lặp lại: ${current.title}`,
          time: current.dueTime,
          date: nextDueDateStr,
          isEnabled: true,
          repeatType: current.recurringRule.type,
          repeatDays: current.recurringRule.customDays || [],
          sound: get().settings.defaultSound,
          volume: get().settings.alarmVolume,
          snoozeEnabled: true,
          snoozeDuration: get().settings.defaultSnoozeMinutes,
          vibrate: true,
          linkedTaskId: nextRecurringTask.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        nextRecurringTask.linkedAlarmId = nextAlarm.id;
        set((state) => ({ alarms: [nextAlarm, ...state.alarms] }));
      }
    }

    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: nextStatus,
              completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            }
          : t
      );
      if (nextRecurringTask) {
        return { tasks: [nextRecurringTask, ...updatedTasks] };
      }
      return { tasks: updatedTasks };
    });

    // If completed and has linked alarm, disable alarm
    if (isNowCompleted && current.linkedAlarmId) {
      set((state) => ({
        alarms: state.alarms.map((a) => (a.id === current.linkedAlarmId ? { ...a, isEnabled: false } : a)),
      }));
    }

    if (nextRecurringTask) {
      get().addToast(`Đã hoàn thành! Tự động tạo lượt tiếp theo vào ngày ${nextRecurringTask.dueDate} 🔁`, 'success');
    } else {
      get().addToast(isNowCompleted ? 'Tuyệt vời! Đã hoàn thành công việc 🎉' : 'Đã mở lại công việc', 'success');
    }
    saveState(get());
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
    get().addToast('Đã xóa công việc', 'info');
    saveState(get());
  },

  // Alarms
  alarms: stored?.alarms || initialAlarms,

  createAlarm: (data) => {
    const newAlarm: Alarm = {
      ...data,
      id: `alarm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ alarms: [newAlarm, ...state.alarms] }));
    get().addToast(`Đã đặt báo thức lúc ${newAlarm.time}`, 'success');
    saveState(get());
    return newAlarm;
  },

  updateAlarm: (id, updates) => {
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    }));
    get().addToast('Đã cập nhật báo thức', 'success');
    saveState(get());
  },

  toggleAlarm: (id) => {
    set((state) => {
      const alarm = state.alarms.find((a) => a.id === id);
      const nextEnabled = !alarm?.isEnabled;
      return {
        alarms: state.alarms.map((a) => (a.id === id ? { ...a, isEnabled: nextEnabled } : a)),
      };
    });
    saveState(get());
  },

  deleteAlarm: (id) => {
    set((state) => ({
      alarms: state.alarms.filter((a) => a.id !== id),
    }));
    get().addToast('Đã xóa báo thức', 'info');
    saveState(get());
  },

  duplicateAlarm: (id) => {
    const original = get().alarms.find((a) => a.id === id);
    if (!original) return;
    const duplicated: Alarm = {
      ...original,
      id: `alarm-${Date.now()}`,
      title: `${original.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ alarms: [duplicated, ...state.alarms] }));
    get().addToast('Đã nhân bản báo thức', 'success');
    saveState(get());
  },

  // News
  news: stored?.news || initialNews,
  newsCategory: 'For You',
  newsSearchQuery: '',

  setNewsCategory: (category) => set({ newsCategory: category }),
  setNewsSearchQuery: (query) => set({ newsSearchQuery: query }),

  toggleSaveArticle: (id) => {
    set((state) => ({
      news: state.news.map((n) => (n.id === id ? { ...n, isSaved: !n.isSaved } : n)),
    }));
    const item = get().news.find((n) => n.id === id);
    get().addToast(item?.isSaved ? 'Đã lưu bài viết' : 'Đã bỏ lưu bài viết', 'info');
    saveState(get());
  },

  markArticleAsRead: (id) => {
    set((state) => ({
      news: state.news.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
    saveState(get());
  },

  refreshNews: () => {
    get().addToast('Đang cập nhật tin tức mới nhất từ các nhà cung cấp...', 'info');
    setTimeout(() => {
      get().addToast('Đã cập nhật nguồn tin mới thành công!', 'success');
    }, 600);
  },

  // Notifications
  notifications: stored?.notifications || initialNotifications,

  unreadNotificationCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
    saveState(get());
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    get().addToast('Đã đánh dấu tất cả thông báo là đã đọc', 'info');
    saveState(get());
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    saveState(get());
  },

  addNotification: (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    playNotificationSound();
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
    saveState(get());
  },

  // Dashboard widgets
  widgets: stored?.widgets || initialWidgets,

  toggleWidget: (id) => {
    set((state) => ({
      widgets: state.widgets.map((w) => (w.id === id ? { ...w, isEnabled: !w.isEnabled } : w)),
    }));
    saveState(get());
  },

  reorderWidgets: (newWidgets) => {
    set({ widgets: newWidgets });
    saveState(get());
  },

  // Settings
  settings: stored?.settings || initialSettings,

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().addToast('Đã lưu cấu hình cài đặt', 'success');
    saveState(get());
  },

  // Toasts
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Global search
  globalSearchQuery: '',
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  // Engine ticker
  checkTriggers: () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday

    const { alarms, activeTriggeredAlarm, triggerAlarm } = get();

    if (!activeTriggeredAlarm) {
      // Check alarms
      for (const alarm of alarms) {
        if (!alarm.isEnabled) continue;

        if (alarm.time === currentTimeStr) {
          // Check repeat condition
          let shouldTrigger = false;
          if (alarm.repeatType === 'none' || alarm.repeatType === 'daily') {
            shouldTrigger = true;
          } else if (alarm.repeatType === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) {
            shouldTrigger = true;
          } else if (alarm.repeatType === 'weekend' && (dayOfWeek === 0 || dayOfWeek === 6)) {
            shouldTrigger = true;
          } else if (alarm.repeatType === 'custom' && alarm.repeatDays.includes(dayOfWeek)) {
            shouldTrigger = true;
          }

          if (shouldTrigger) {
            triggerAlarm(alarm);
            break;
          }
        }
      }
    }
  },
}));

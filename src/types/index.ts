export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type RepeatType = 'none' | 'daily' | 'weekdays' | 'weekend' | 'weekly' | 'custom';
export type AlarmSound = 'morning' | 'gentle' | 'radar' | 'digital' | 'chime';

export interface NoteFolder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isTrash: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringRule {
  type: RepeatType;
  customDays?: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  endDate?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  category?: string;
  tags: string[];
  isRecurring?: boolean;
  recurringRule?: RecurringRule;
  createdAt: string;
  completedAt?: string;
  reminderMinutesBefore?: number;
  hasAlarm?: boolean;
  linkedAlarmId?: string;
}

export interface Alarm {
  id: string;
  title: string;
  description?: string;
  time: string; // HH:mm (24h)
  date?: string; // Optional specific date YYYY-MM-DD
  isEnabled: boolean;
  repeatType: RepeatType;
  repeatDays: number[]; // 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
  sound: AlarmSound;
  volume: number; // 0 to 100
  snoozeEnabled: boolean;
  snoozeDuration: number; // in minutes
  vibrate: boolean;
  linkedTaskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  isSaved?: boolean;
  isRead?: boolean;
  readTime?: string;
  author?: string;
}

export interface AppReminder {
  id: string;
  taskId?: string;
  title: string;
  reminderTime: string; // ISO string
  reminderType: string; // e.g. "15_min_before"
  isTriggered: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'alarm' | 'reminder' | 'task' | 'news' | 'system';
  title: string;
  content: string;
  relatedEntityId?: string;
  relatedEntityType?: 'task' | 'alarm' | 'note' | 'news';
  isRead: boolean;
  createdAt: string;
}

export interface RegisteredDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  browser: string;
  lastActive: string;
  isCurrent: boolean;
  pushEnabled: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  alarmVolume: number;
  defaultSound: AlarmSound;
  defaultSnoozeMinutes: number;
  todoRemindersEnabled: boolean;
  alarmNotificationsEnabled: boolean;
  newsNotificationsEnabled: boolean;
  doNotDisturb: {
    enabled: boolean;
    from: string; // "23:00"
    to: string; // "07:00"
    allowAlarms: boolean;
  };
  devices: RegisteredDevice[];
}

export interface DashboardWidgetConfig {
  id: string;
  name: string;
  titleVi: string;
  isEnabled: boolean;
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  createdAt: string;
}

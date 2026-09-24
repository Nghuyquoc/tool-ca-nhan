import { Note, NoteFolder, TaskItem, Alarm, NewsArticle, AppNotification, UserSettings, DashboardWidgetConfig } from '../types';

export const initialFolders: NoteFolder[] = [
  { id: 'folder-1', name: 'Công việc', color: '#3b82f6', icon: 'Briefcase', createdAt: '2026-09-01T08:00:00Z' },
  { id: 'folder-2', name: 'Cá nhân & Thói quen', color: '#10b981', icon: 'Heart', createdAt: '2026-09-02T08:00:00Z' },
  { id: 'folder-3', name: 'Học tập & Tech', color: '#8b5cf6', icon: 'Code', createdAt: '2026-09-03T08:00:00Z' },
  { id: 'folder-4', name: 'Ý tưởng dự án', color: '#f59e0b', icon: 'Lightbulb', createdAt: '2026-09-04T08:00:00Z' },
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: '🚀 Kiến trúc Hệ thống Personal Workspace',
    content: `# Kiến trúc Hệ thống Personal Workspace

Ứng dụng kết hợp 3 trụ cột năng suất chính:
- **Notes**: Ghi chú theo phong cách Notion/Apple Notes với Markdown & WYSIWYG
- **Todo & Calendar**: Quản lý tác vụ hằng ngày với độ ưu tiên, lặp lại và báo thức
- **News Feed**: Cập nhật tin tức công nghệ, AI, kinh doanh và xã hội từ nhiều nguồn

## Điểm nổi bật
1. **Realtime sync** hỗ trợ đa thiết bị
2. **Alarm & Reminder** chuẩn PWA và Web Audio synthesizer
3. **Command Palette & Global Search** qua phím tắt Ctrl+K

> *"Tối ưu hóa không gian làm việc là bước đầu tiên để làm chủ thời gian."*`,
    folderId: 'folder-3',
    tags: ['Architecture', 'Tech', 'React', 'DotNet'],
    isPinned: true,
    isFavorite: true,
    isTrash: false,
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-24T18:30:00Z',
  },
  {
    id: 'note-2',
    title: '🏸 Lịch tập cầu lông & Kỹ thuật Smash',
    content: `# Lịch tập cầu lông hàng tuần

- **Thứ 4**: 19:00 - 21:00 (Sân Kỳ Hòa)
- **Chủ nhật**: 17:00 - 19:00 (Sân Thống Nhất)

### Checklist chuẩn bị trước khi ra sân
- [x] Vợt căng cước 10.5kg
- [x] Quấn cán vợt mới
- [ ] 2 bình nước điện giải
- [ ] Băng cổ chân và giày cầu lông

### Ghi nhớ kỹ thuật
- Thả lỏng cổ tay khi chuẩn bị đập cầu
- Xoay hông và bật chân đúng nhịp`,
    folderId: 'folder-2',
    tags: ['Badminton', 'Sports', 'Health'],
    isPinned: true,
    isFavorite: true,
    isTrash: false,
    createdAt: '2026-09-22T10:15:00Z',
    updatedAt: '2026-09-24T14:20:00Z',
  },
  {
    id: 'note-3',
    title: '📚 Lộ trình học Deep Learning & Agentic Coding',
    content: `# Lộ trình học AI Agents

1. **Prompt Engineering & Tool Calling Patterns**
2. **Agentic Workflows**: ReAct, Planning, Subagents
3. **Vector Database & RAG Optimization** (Qdrant, pgvector)
4. **Fine-tuning & Local LLM Serving** (Ollama, vLLM)

\`\`\`python
# Agent tool call loop pattern
async def run_agent(task: str):
    response = await llm.generate_plan(task)
    for step in response.steps:
        await execute_tool(step)
\`\`\``,
    folderId: 'folder-3',
    tags: ['AI', 'Agentic', 'Python'],
    isPinned: false,
    isFavorite: true,
    isTrash: false,
    createdAt: '2026-09-23T11:00:00Z',
    updatedAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'note-4',
    title: '💡 Ý tưởng sản phẩm SaaS B2B Micro-tool',
    content: `# Ý tưởng Micro-SaaS

- Công cụ tự động tổng hợp tin tức ngành và gửi tóm tắt qua Telegram/Email vào 8:00 sáng.
- Tích hợp Kanban cho team nhỏ dưới 5 người với giao diện tối giản cực nhanh.`,
    folderId: 'folder-4',
    tags: ['Startup', 'Ideas'],
    isPinned: false,
    isFavorite: false,
    isTrash: false,
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z',
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: '🏸 Đi đánh cầu lông cùng team',
    description: 'Sân Kỳ Hòa, sân số 3. Mang theo 2 cây vợt và nước bù khoáng.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-09-24',
    dueTime: '19:00',
    category: 'Thể thao',
    tags: ['Cầu lông', 'Sức khỏe'],
    isRecurring: true,
    recurringRule: {
      type: 'custom',
      customDays: [3, 0], // Thứ 4, CN
    },
    reminderMinutesBefore: 15,
    hasAlarm: true,
    linkedAlarmId: 'alarm-3',
    createdAt: '2026-09-24T08:00:00Z',
  },
  {
    id: 'task-2',
    title: '⚡ Hoàn thành REST API Backend .NET 8',
    description: 'Kiểm tra endpoints /api/tasks, /api/notes, /api/alarms và SignalR hub.',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-09-24',
    dueTime: '17:00',
    category: 'Công việc',
    tags: ['DotNet', 'API', 'Backend'],
    isRecurring: false,
    reminderMinutesBefore: 30,
    hasAlarm: false,
    createdAt: '2026-09-24T08:30:00Z',
  },
  {
    id: 'task-3',
    title: '📚 Học tiếng Anh 30 phút (Từ vựng & Shadowing)',
    description: 'Nghe podcast BBC 6 Minute English và luyện phát âm.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-24',
    dueTime: '20:30',
    category: 'Học tập',
    tags: ['English', 'Daily'],
    isRecurring: true,
    recurringRule: {
      type: 'custom',
      customDays: [1, 3, 5], // T2, T4, T6
    },
    reminderMinutesBefore: 10,
    hasAlarm: true,
    linkedAlarmId: 'alarm-4',
    createdAt: '2026-09-24T09:00:00Z',
  },
  {
    id: 'task-4',
    title: '☕ Đọc 3 bài viết công nghệ trên Hacker News & TechCrunch',
    description: 'Cập nhật xu hướng AI Agent và WebAssembly.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-09-24',
    dueTime: '09:00',
    category: 'Tin tức',
    tags: ['News', 'Morning'],
    isRecurring: true,
    recurringRule: { type: 'daily' },
    createdAt: '2026-09-24T07:00:00Z',
    completedAt: '2026-09-24T08:45:00Z',
  },
  {
    id: 'task-5',
    title: '🚀 Deploy bản thử nghiệm PWA lên Vercel',
    description: 'Kiểm tra Service Worker offline cache và responsive layout.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-09-25',
    dueTime: '15:00',
    category: 'Dự án',
    tags: ['PWA', 'Deploy'],
    isRecurring: false,
    createdAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'task-6',
    title: '🛒 Mua đồ siêu thị cuối tuần',
    description: 'Trái cây, ức gà, sữa chua không đường và yến mạch.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-26',
    dueTime: '10:00',
    category: 'Cá nhân',
    tags: ['Shopping', 'Family'],
    isRecurring: false,
    createdAt: '2026-09-24T11:00:00Z',
  }
];

export const initialAlarms: Alarm[] = [
  {
    id: 'alarm-1',
    title: 'Thức dậy & Uống nước ấm',
    description: 'Bắt đầu ngày mới tràn đầy năng lượng',
    time: '07:00',
    isEnabled: true,
    repeatType: 'daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    sound: 'morning',
    volume: 85,
    snoozeEnabled: true,
    snoozeDuration: 5,
    vibrate: true,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
  },
  {
    id: 'alarm-2',
    title: 'Đi làm & Check mail',
    description: 'Chuẩn bị rời nhà đúng giờ tránh kẹt xe',
    time: '08:00',
    isEnabled: true,
    repeatType: 'weekdays',
    repeatDays: [1, 2, 3, 4, 5],
    sound: 'gentle',
    volume: 80,
    snoozeEnabled: true,
    snoozeDuration: 5,
    vibrate: true,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
  },
  {
    id: 'alarm-3',
    title: '🏸 Đi đánh cầu lông',
    description: 'Tập trung tại sân Kỳ Hòa lúc 19:00',
    time: '19:00',
    isEnabled: true,
    repeatType: 'custom',
    repeatDays: [3, 0], // Thứ 4, Chủ nhật
    sound: 'radar',
    volume: 90,
    snoozeEnabled: true,
    snoozeDuration: 5,
    vibrate: true,
    linkedTaskId: 'task-1',
    createdAt: '2026-09-22T00:00:00Z',
    updatedAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'alarm-4',
    title: '📚 Học tiếng Anh',
    description: '30 phút luyện nghe và nói',
    time: '20:30',
    isEnabled: true,
    repeatType: 'custom',
    repeatDays: [1, 3, 5], // T2, T4, T6
    sound: 'chime',
    volume: 75,
    snoozeEnabled: true,
    snoozeDuration: 10,
    vibrate: false,
    linkedTaskId: 'task-3',
    createdAt: '2026-09-22T00:00:00Z',
    updatedAt: '2026-09-22T00:00:00Z',
  },
  {
    id: 'alarm-5',
    title: 'Đi ngủ & Tắt màn hình',
    description: 'Ngủ đủ 7.5 tiếng để tái tạo năng lượng',
    time: '23:30',
    isEnabled: true,
    repeatType: 'daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    sound: 'gentle',
    volume: 70,
    snoozeEnabled: false,
    snoozeDuration: 5,
    vibrate: true,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
  }
];

export const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'OpenAI công bố bản cập nhật mô hình suy luận thế hệ mới với khả năng tự phản hồi',
    description: 'Bản cập nhật tập trung nâng cao khả năng lập luận toán học, coding chuyên sâu và tương tác với các công cụ lập trình phức tạp.',
    url: 'https://openai.com/news',
    source: 'TechCrunch AI',
    category: 'AI',
    publishedAt: '2026-09-24T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    isSaved: true,
    isRead: false,
    readTime: '3 phút đọc',
    author: 'Alex Morgan'
  },
  {
    id: 'news-2',
    title: '.NET 10 chính thức ra mắt với hiệu năng ASP.NET Core vượt trội và Native AOT tối ưu',
    description: 'Microsoft giới thiệu các cải tiến lớn về Garbage Collection, SignalR clustering và hiệu suất microservices giảm 40% memory footprint.',
    url: 'https://devblogs.microsoft.com/dotnet',
    source: 'Microsoft Developer',
    category: 'Programming',
    publishedAt: '2026-09-24T16:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: true,
    readTime: '4 phút đọc',
    author: 'Scott Hanselman'
  },
  {
    id: 'news-3',
    title: 'Việt Nam thúc đẩy trung tâm dữ liệu AI và công nghiệp bán dẫn tại TP.HCM & Hà Nội',
    description: 'Các dự án hạ tầng điện toán đám mây và phòng lab nghiên cứu chip bán dẫn thu hút nguồn vốn đầu tư công nghệ hàng tỷ USD.',
    url: 'https://vnexpress.net/so-hoa',
    source: 'VnExpress Số Hóa',
    category: 'Vietnam',
    publishedAt: '2026-09-24T14:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: false,
    readTime: '5 phút đọc',
    author: 'Bảo Lâm'
  },
  {
    id: 'news-4',
    title: 'Vite 6 và xu hướng phát triển Web Frontend cực nhanh với module federation thế hệ mới',
    description: 'Hệ sinh thái tooling frontend tiếp tục bùng nổ với tốc độ build tăng gấp 3 lần và hỗ trợ HMR gần như tức thì cho các ứng dụng lớn.',
    url: 'https://vitejs.dev',
    source: 'Frontend Weekly',
    category: 'Technology',
    publishedAt: '2026-09-24T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    isSaved: true,
    isRead: false,
    readTime: '3 phút đọc',
    author: 'Evan You'
  },
  {
    id: 'news-5',
    title: 'Thị trường Gaming 2026: Game AAA ứng dụng đồ họa thời gian thực Neural Rendering',
    description: 'Các studio game hàng đầu tích hợp công nghệ AI vật lý và sinh tạo môi trường vô tận mang lại trải nghiệm sống động chân thực.',
    url: 'https://ign.com',
    source: 'IGN News',
    category: 'Gaming',
    publishedAt: '2026-09-24T10:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: false,
    readTime: '4 phút đọc',
    author: 'Chris Vance'
  },
  {
    id: 'news-6',
    title: 'Kinh tế số và xu hướng tự động hóa quy trình làm việc cá nhân cho giới văn phòng',
    description: 'Làn sóng ứng dụng Personal Workspace và AI Assistants giúp nâng cao năng suất cá nhân trung bình 35% mỗi ngày.',
    url: 'https://forbes.com',
    source: 'Forbes Tech',
    category: 'Business',
    publishedAt: '2026-09-24T08:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: false,
    readTime: '6 phút đọc',
    author: 'Sarah Jenkins'
  },
  {
    id: 'news-7',
    title: 'Mạng xã hội thế hệ mới chuyển dịch mạnh sang giao thức mở và phi tập trung',
    description: 'Người dùng ngày càng quan tâm đến quyền riêng tư dữ liệu cá nhân và sở hữu danh tính số trực tuyến.',
    url: 'https://techcrunch.com',
    source: 'The Verge',
    category: 'Social Media',
    publishedAt: '2026-09-23T20:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: true,
    readTime: '4 phút đọc',
    author: 'Nilay Patel'
  },
  {
    id: 'news-8',
    title: 'Khủng hoảng năng lượng sạch toàn cầu và bước đột phá công nghệ pin thể rắn',
    description: 'Các hãng xe điện và trung tâm dữ liệu bắt đầu thử nghiệm thương mại hóa dòng pin thế hệ mới với mật độ năng lượng gấp đôi.',
    url: 'https://bloomberg.com',
    source: 'Bloomberg Green',
    category: 'World',
    publishedAt: '2026-09-23T15:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    isSaved: false,
    isRead: false,
    readTime: '5 phút đọc',
    author: 'David Fickling'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'alarm',
    title: '🏸 15 phút nữa đến giờ đánh cầu',
    content: '19:00 tại Sân Kỳ Hòa - Hãy chuẩn bị vợt và trang phục thể thao!',
    relatedEntityId: 'task-1',
    relatedEntityType: 'task',
    isRead: false,
    createdAt: '2026-09-24T18:45:00Z'
  },
  {
    id: 'notif-2',
    type: 'task',
    title: '⚠ Deadline API Backend .NET 8 còn 1 giờ',
    content: 'Hoàn thiện các controller và kiểm thử endpoints trước 17:00.',
    relatedEntityId: 'task-2',
    relatedEntityType: 'task',
    isRead: false,
    createdAt: '2026-09-24T16:00:00Z'
  },
  {
    id: 'notif-3',
    type: 'news',
    title: '📰 Có tin mới trong chủ đề AI',
    content: 'OpenAI công bố bản cập nhật mô hình suy luận thế hệ mới.',
    relatedEntityId: 'news-1',
    relatedEntityType: 'news',
    isRead: false,
    createdAt: '2026-09-24T09:30:00Z'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: '🎉 Chào mừng bạn đến với Personal Workspace',
    content: 'Nhấn Ctrl + K để mở Command Palette và khám phá các tính năng!',
    isRead: true,
    createdAt: '2026-09-24T07:00:00Z'
  }
];

export const initialWidgets: DashboardWidgetConfig[] = [
  { id: 'today-tasks', name: 'Today Tasks', titleVi: 'Công việc hôm nay', isEnabled: true, order: 0 },
  { id: 'next-alarm', name: 'Next Alarm', titleVi: 'Báo thức kế tiếp', isEnabled: true, order: 1 },
  { id: 'quick-note', name: 'Quick Note', titleVi: 'Ghi chú nhanh', isEnabled: true, order: 2 },
  { id: 'productivity', name: 'Productivity', titleVi: 'Hiệu suất & Streak', isEnabled: true, order: 3 },
  { id: 'upcoming', name: 'Upcoming', titleVi: 'Sắp tới & Deadline', isEnabled: true, order: 4 },
  { id: 'latest-news', name: 'Latest News', titleVi: 'Tin tức mới nhất', isEnabled: true, order: 5 },
];

export const initialSettings: UserSettings = {
  theme: 'dark',
  alarmVolume: 85,
  defaultSound: 'morning',
  defaultSnoozeMinutes: 5,
  todoRemindersEnabled: true,
  alarmNotificationsEnabled: true,
  newsNotificationsEnabled: true,
  doNotDisturb: {
    enabled: false,
    from: '23:00',
    to: '07:00',
    allowAlarms: true,
  },
  devices: [
    {
      id: 'device-1',
      name: 'MacBook Pro 16 / Windows PC (Hiện tại)',
      type: 'desktop',
      browser: 'Chrome 128 / Edge',
      lastActive: 'Vừa xong',
      isCurrent: true,
      pushEnabled: true,
    },
    {
      id: 'device-2',
      name: 'iPhone 15 Pro Max (PWA)',
      type: 'mobile',
      browser: 'Safari Mobile',
      lastActive: '10 phút trước',
      isCurrent: false,
      pushEnabled: true,
    },
    {
      id: 'device-3',
      name: 'iPad Pro 11 inch',
      type: 'tablet',
      browser: 'Mobile Safari',
      lastActive: '2 giờ trước',
      isCurrent: false,
      pushEnabled: false,
    }
  ]
};

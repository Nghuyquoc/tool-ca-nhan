import React, { useEffect, useState, useRef } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, CheckSquare, Bell, Newspaper, Plus, Moon, Sun, Calendar, Settings, ArrowRight } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    notes,
    tasks,
    alarms,
    news,
    openQuickCreateWithTab,
    theme,
    setTheme,
    setActiveNoteId,
  } = useWorkspaceStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredNotes = notes
    .filter((n) => !n.isTrash && (n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 3);

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.description?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredNews = news
    .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.description.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredAlarms = alarms
    .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.time.includes(query))
    .slice(0, 2);

  const quickActions = [
    {
      id: 'action-create-note',
      title: 'Tạo ghi chú mới (New Note)',
      subtitle: 'Phím tắt N',
      icon: FileText,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickCreateWithTab('note');
      },
    },
    {
      id: 'action-create-task',
      title: 'Tạo công việc mới (New Task)',
      subtitle: 'Phím tắt T',
      icon: CheckSquare,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickCreateWithTab('task');
      },
    },
    {
      id: 'action-create-alarm',
      title: 'Đặt báo thức mới (New Alarm)',
      subtitle: 'Phím tắt A',
      icon: Bell,
      action: () => {
        setCommandPaletteOpen(false);
        openQuickCreateWithTab('alarm');
      },
    },
    {
      id: 'action-toggle-theme',
      title: theme === 'dark' ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)',
      subtitle: 'Giao diện hệ thống',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'action-go-calendar',
      title: 'Mở Lịch & Deadline (Calendar)',
      subtitle: 'Xem theo Ngày/Tuần/Tháng',
      icon: Calendar,
      action: () => {
        setCommandPaletteOpen(false);
        navigate('/calendar');
      },
    },
    {
      id: 'action-go-news',
      title: 'Mở Tin tức tổng hợp (News Feed)',
      subtitle: 'AI, Công nghệ, Đời sống',
      icon: Newspaper,
      action: () => {
        setCommandPaletteOpen(false);
        navigate('/news');
      },
    },
    {
      id: 'action-go-settings',
      title: 'Cài đặt hệ thống & Thông báo (Settings)',
      subtitle: 'Âm thanh, DND, Thiết bị',
      icon: Settings,
      action: () => {
        setCommandPaletteOpen(false);
        navigate('/settings');
      },
    },
  ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.subtitle.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-secondary/80">
          <Search className="w-5 h-5 text-primary mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm ghi chú, công việc, tin tức hoặc lệnh nhanh..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm sm:text-base font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-card text-foreground border border-border shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Actions */}
          {quickActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Thao tác nhanh (Commands)
              </div>
              <div className="space-y-1">
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.action}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-secondary text-left transition group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{act.title}</div>
                          <div className="text-xs text-muted-foreground">{act.subtitle}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ghi chú (Notes)
              </div>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setCommandPaletteOpen(false);
                      navigate('/notes');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary text-left transition"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{note.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Công việc (Tasks)
              </div>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      navigate('/todo');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary text-left transition"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
                    </div>
                    {task.dueTime && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary font-mono text-muted-foreground">
                        {task.dueTime}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News Section */}
          {filteredNews.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tin tức (News)
              </div>
              <div className="space-y-1">
                {filteredNews.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      navigate('/news');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary text-left transition"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Newspaper className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{article.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{article.source}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alarms Section */}
          {filteredAlarms.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Báo thức (Alarms)
              </div>
              <div className="space-y-1">
                {filteredAlarms.map((alarm) => (
                  <button
                    key={alarm.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      navigate('/alarm');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary text-left transition"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Bell className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{alarm.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-foreground px-2 py-0.5 rounded bg-secondary">
                      {alarm.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickActions.length === 0 &&
            filteredNotes.length === 0 &&
            filteredTasks.length === 0 &&
            filteredNews.length === 0 &&
            filteredAlarms.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Không tìm thấy kết quả nào cho "{query}"</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-border bg-secondary/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>↑↓ để di chuyển</span>
            <span>↵ để chọn</span>
            <span>ESC để đóng</span>
          </div>
          <span>Personal Workspace v1.0</span>
        </div>
      </div>
    </div>
  );
};

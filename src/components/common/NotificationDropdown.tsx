import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { Bell, Check, Trash2, ExternalLink, Sparkles, CheckSquare, Newspaper, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useWorkspaceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = unreadNotificationCount();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifs = filterUnread
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alarm':
        return <Bell className="w-4 h-4 text-red-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const handleItemClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.relatedEntityType === 'task') {
      navigate('/todo');
    } else if (notif.relatedEntityType === 'news') {
      navigate('/news');
    } else if (notif.relatedEntityType === 'alarm') {
      navigate('/alarm');
    } else if (notif.relatedEntityType === 'note') {
      navigate('/notes');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition active:scale-95"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl z-50 overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-foreground">Trung tâm thông báo</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-primary hover:underline flex items-center space-x-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex px-4 py-2 border-b border-border text-xs gap-2 bg-secondary/10">
            <button
              onClick={() => setFilterUnread(false)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                !filterUnread
                  ? 'bg-secondary text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilterUnread(true)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterUnread
                  ? 'bg-secondary text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Không có thông báo nào</p>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 hover:bg-secondary/60 transition cursor-pointer flex items-start space-x-3 group ${
                    !notif.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-secondary shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.content}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

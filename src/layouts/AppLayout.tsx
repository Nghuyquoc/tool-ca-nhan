import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Bell,
  Calendar,
  Newspaper,
  Bookmark,
  Settings,
  Plus,
  Search,
  Moon,
  Sun,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Command,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { CommandPalette } from '../components/modals/CommandPalette';
import { QuickCreateModal } from '../components/modals/QuickCreateModal';
import { AlarmTriggerModal } from '../components/modals/AlarmTriggerModal';
import { ToastContainer } from '../components/common/ToastContainer';
import { NotificationDropdown } from '../components/common/NotificationDropdown';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelOpen,
    setRightPanelOpen,
    setCommandPaletteOpen,
    openQuickCreateWithTab,
    checkTriggers,
    alarms,
    tasks,
  } = useWorkspaceStore();

  // Realtime Alarm Engine interval ticker
  useEffect(() => {
    checkTriggers();
    const interval = setInterval(() => {
      checkTriggers();
    }, 5000); // checks every 5 seconds for pinpoint accuracy
    return () => clearInterval(interval);
  }, [checkTriggers]);

  // Request browser notification permission politely when user triggers an action or visits
  const handleRequestNotification = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/notes', label: 'Notes', icon: FileText, badge: null },
    { to: '/todo', label: 'Todo List', icon: CheckSquare, badge: tasks.filter(t => t.status !== 'completed').length || null },
    { to: '/alarm', label: 'Báo thức & Alarm', icon: Bell, badge: alarms.filter(a => a.isEnabled).length || null },
    { to: '/calendar', label: 'Calendar', icon: Calendar, badge: null },
    { to: '/news', label: 'News Feed', icon: Newspaper, badge: null },
    { to: '/saved', label: 'Saved Items', icon: Bookmark, badge: null },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* 1. DESKTOP & TABLET SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 z-30 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 h-16">
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Sparkles className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight truncate">
                <span className="font-bold text-sm tracking-tight text-foreground">Workspace</span>
                <span className="text-[11px] text-muted-foreground">Personal OS</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition hidden lg:flex"
            title={sidebarCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Create Button */}
        <div className="p-3">
          <button
            onClick={() => {
              handleRequestNotification();
              openQuickCreateWithTab('note');
            }}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm shadow-sm hover:opacity-90 active:scale-95 transition ${
              sidebarCollapsed ? 'px-0' : ''
            }`}
            title="Tạo nhanh (Phím tắt: N / T / A)"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Tạo nhanh</span>}
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25 scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Settings & User footer */}
        <div className="p-3 border-t border-border/50 space-y-1.5">
          <NavLink
            to="/settings"
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 ${
              location.pathname === '/settings'
                ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${
                location.pathname === '/settings' ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            />
            {!sidebarCollapsed && <span>Cài đặt & DND</span>}
          </NavLink>

          <div
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center justify-between px-3 py-2 rounded-2xl bg-secondary/30 text-muted-foreground hover:text-foreground cursor-pointer text-xs"
          >
            <div className="flex items-center space-x-2">
              <Command className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Phím tắt</span>}
            </div>
            {!sidebarCollapsed && <kbd className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded">Ctrl+K</kbd>}
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-border/60 bg-card/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
          {/* Global Search Trigger */}
          <div className="flex items-center space-x-3 flex-1 max-w-xl">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center space-x-3 w-full max-w-md py-2 px-3.5 rounded-2xl bg-secondary/80 hover:bg-secondary text-foreground hover:text-foreground border border-border text-xs sm:text-sm font-medium transition text-left shadow-sm"
            >
              <Search className="w-4 h-4 shrink-0 text-primary" />
              <span className="flex-1 truncate text-muted-foreground font-normal">Tìm kiếm mọi thứ (Ghi chú, Task, Tin tức)...</span>
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-card border border-border text-foreground shadow-xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Quick Add Dropdown */}
            <button
              onClick={() => {
                handleRequestNotification();
                openQuickCreateWithTab('task');
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>

            {/* Notification Bell with Badge */}
            <NotificationDropdown />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition"
              title="Đổi giao diện Sáng/Tối"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* User Profile Avatar */}
            <div
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-secondary cursor-pointer transition ml-1"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                HQ
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main View Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 z-40">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-12 rounded-xl text-[10px] font-medium transition ${
              isActive ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-12 rounded-xl text-[10px] font-medium transition ${
              isActive ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Notes</span>
        </NavLink>

        {/* Big Central Plus Button */}
        <button
          onClick={() => {
            handleRequestNotification();
            openQuickCreateWithTab('task');
          }}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition -mt-5"
          title="Tạo mới"
        >
          <Plus className="w-6 h-6" />
        </button>

        <NavLink
          to="/todo"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-12 rounded-xl text-[10px] font-medium transition ${
              isActive ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span>Todo</span>
        </NavLink>

        <NavLink
          to="/alarm"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-12 rounded-xl text-[10px] font-medium transition ${
              isActive ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span>Alarm</span>
        </NavLink>
      </div>

      {/* Global Modals & Overlays */}
      <CommandPalette />
      <QuickCreateModal />
      <AlarmTriggerModal />
      <ToastContainer />
    </div>
  );
};

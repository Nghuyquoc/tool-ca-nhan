import React, { useState } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Laptop,
  Bell,
  Volume2,
  Shield,
  Smartphone,
  Download,
  Upload,
  Sparkles,
} from 'lucide-react';
import { AlarmSound, RegisteredDevice } from '../types';
import { previewSound } from '../utils/sound';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, settings, updateSettings, addToast, notes, tasks, alarms, news } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'general' | 'alarms' | 'devices' | 'backup'>('alarms');

  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      notes,
      tasks,
      alarms,
      news,
      settings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Đã xuất dữ liệu sao lưu thành công', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.notes || parsed.tasks || parsed.alarms) {
          localStorage.setItem(
            'personal_workspace_state_v1',
            JSON.stringify({
              notes: parsed.notes || notes,
              tasks: parsed.tasks || tasks,
              alarms: parsed.alarms || alarms,
              news: parsed.news || news,
              settings: parsed.settings || settings,
              theme: parsed.settings?.theme || theme,
            })
          );
          addToast('Đã khôi phục dữ liệu thành công! Đang tải lại...', 'success');
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (err) {
        addToast('Tệp sao lưu không hợp lệ', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Tùy chỉnh hệ thống</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Cài Đặt & Đồng Bộ Thiết Bị
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quản lý báo thức, thông báo, giao diện và đồng bộ đa nền tảng
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 p-1 rounded-2xl bg-secondary/80 border border-border text-xs sm:text-sm font-semibold overflow-x-auto">
        {[
          { id: 'alarms', label: 'Báo thức & Thông báo', icon: Bell },
          { id: 'general', label: 'Giao diện & Chủ đề', icon: Sparkles },
          { id: 'devices', label: 'Thiết bị kết nối (Devices)', icon: Smartphone },
          { id: 'backup', label: 'Sao lưu & Dữ liệu', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ALARM & NOTIFICATIONS SETTINGS */}
      {activeTab === 'alarms' && (
        <div className="space-y-5">
          {/* Sound & Volume */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
            <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-primary" />
              <span>Âm lượng & Âm thanh Báo thức</span>
            </h3>

            {/* Volume slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Âm lượng chuông báo</span>
                <span className="font-mono text-primary">{settings.alarmVolume}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.alarmVolume}
                onChange={(e) => updateSettings({ alarmVolume: Number(e.target.value) })}
                className="w-full accent-primary h-2 bg-secondary rounded-lg cursor-pointer"
              />
            </div>

            {/* Sound and Snooze selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Âm báo mặc định</label>
                  <button
                    onClick={() => previewSound(settings.defaultSound, settings.alarmVolume)}
                    className="text-xs text-primary hover:underline flex items-center space-x-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe thử</span>
                  </button>
                </div>
                <select
                  value={settings.defaultSound}
                  onChange={(e) => updateSettings({ defaultSound: e.target.value as AlarmSound })}
                  className="w-full bg-secondary/50 p-2.5 rounded-2xl border border-border text-xs focus:outline-none"
                >
                  <option value="morning">Morning Breeze (Nhẹ nhàng)</option>
                  <option value="gentle">Gentle Tone (Thư thái)</option>
                  <option value="chime">Chime Bell (Chuông ngân)</option>
                  <option value="radar">Radar Pulse (Mạnh mẽ)</option>
                  <option value="digital">Digital Beep (Điện tử)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Thời gian báo lại mặc định (Default Snooze)
                </label>
                <select
                  value={settings.defaultSnoozeMinutes}
                  onChange={(e) => updateSettings({ defaultSnoozeMinutes: Number(e.target.value) })}
                  className="w-full bg-secondary/50 p-2.5 rounded-2xl border border-border text-xs focus:outline-none"
                >
                  <option value={3}>3 phút</option>
                  <option value={5}>5 phút</option>
                  <option value={10}>10 phút</option>
                  <option value={15}>15 phút</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>Tùy chọn Thông báo</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-foreground">Nhắc việc Todo Reminders</div>
                  <div className="text-xs text-muted-foreground">Thông báo trước deadline công việc</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.todoRemindersEnabled}
                  onChange={(e) => updateSettings({ todoRemindersEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-foreground">Báo thức Alarm Notifications</div>
                  <div className="text-xs text-muted-foreground">Thông báo toàn màn hình và âm thanh khi đến giờ</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.alarmNotificationsEnabled}
                  onChange={(e) => updateSettings({ alarmNotificationsEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-foreground">Tin tức mới News Notifications</div>
                  <div className="text-xs text-muted-foreground">Nhận thông báo khi có tin công nghệ hot</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.newsNotificationsEnabled}
                  onChange={(e) => updateSettings({ newsNotificationsEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Do Not Disturb (DND) */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-foreground">Không làm phiền (Do Not Disturb)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.doNotDisturb.enabled}
                  onChange={(e) =>
                    updateSettings({
                      doNotDisturb: { ...settings.doNotDisturb, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {settings.doNotDisturb.enabled && (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3 text-xs animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground block mb-1">Bắt đầu từ (From)</label>
                    <input
                      type="time"
                      value={settings.doNotDisturb.from}
                      onChange={(e) =>
                        updateSettings({
                          doNotDisturb: { ...settings.doNotDisturb, from: e.target.value },
                        })
                      }
                      className="w-full bg-card p-2 rounded-xl border border-border font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Đến khi (To)</label>
                    <input
                      type="time"
                      value={settings.doNotDisturb.to}
                      onChange={(e) =>
                        updateSettings({
                          doNotDisturb: { ...settings.doNotDisturb, to: e.target.value },
                        })
                      }
                      className="w-full bg-card p-2 rounded-xl border border-border font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={settings.doNotDisturb.allowAlarms}
                    onChange={(e) =>
                      updateSettings({
                        doNotDisturb: { ...settings.doNotDisturb, allowAlarms: e.target.checked },
                      })
                    }
                    className="rounded text-primary focus:ring-0"
                  />
                  <span>Vẫn cho phép chuông Báo thức khẩn cấp kêu trong thời gian Không làm phiền</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GENERAL & THEME */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground mb-3">Giao diện màu sắc</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Sáng (Light)', icon: Sun },
                { id: 'dark', label: 'Tối (Dark)', icon: Moon },
                { id: 'system', label: 'Hệ thống (Auto)', icon: Laptop },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition ${
                      theme === t.id
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                        : 'bg-secondary/40 border-border text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-DEVICE MANAGEMENT */}
      {activeTab === 'devices' && (
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Thiết bị đã đăng ký nhận thông báo</h3>
              <p className="text-xs text-muted-foreground">Đồng bộ dữ liệu Realtime và quản lý push notification</p>
            </div>
          </div>

          <div className="space-y-3">
            {settings.devices.map((device: RegisteredDevice) => (
              <div
                key={device.id}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  device.isCurrent ? 'bg-primary/5 border-primary/30' : 'bg-secondary/30 border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-secondary text-primary">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-foreground">{device.name}</h4>
                      {device.isCurrent && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                          Thiết bị này
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {device.browser} • Hoạt động: {device.lastActive}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {device.pushEnabled ? '✓ Đã bật Push' : 'Chưa kích hoạt'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BACKUP & EXPORT */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
          <div>
            <h3 className="text-base font-bold text-foreground">Sao lưu & Khôi phục dữ liệu</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toàn bộ dữ liệu ghi chú, công việc, báo thức và cài đặt được lưu giữ an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="p-5 rounded-2xl bg-secondary/40 border border-border hover:bg-secondary flex flex-col items-center justify-center space-y-2 transition group"
            >
              <Download className="w-6 h-6 text-primary group-hover:scale-110 transition" />
              <span className="text-sm font-semibold text-foreground">Xuất tệp JSON sao lưu</span>
              <span className="text-xs text-muted-foreground">Tải về máy toàn bộ dữ liệu</span>
            </button>

            <label className="p-5 rounded-2xl bg-secondary/40 border border-border hover:bg-secondary flex flex-col items-center justify-center space-y-2 transition group cursor-pointer">
              <Upload className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition" />
              <span className="text-sm font-semibold text-foreground">Khôi phục từ tệp JSON</span>
              <span className="text-xs text-muted-foreground">Nhập tệp sao lưu đã lưu trước đó</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

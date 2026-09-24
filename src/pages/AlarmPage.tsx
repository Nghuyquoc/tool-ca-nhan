import React from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  Bell,
  Plus,
  Volume2,
  Repeat,
  Trash2,
  Copy,
  Info,
  Play,
} from 'lucide-react';
import { previewSound } from '../utils/sound';
import { Alarm } from '../types';

export const AlarmPage: React.FC = () => {
  const {
    alarms,
    toggleAlarm,
    deleteAlarm,
    duplicateAlarm,
    openQuickCreateWithTab,
    triggerAlarm,
  } = useWorkspaceStore();

  const dayLabels = [
    { day: 1, label: 'T2' },
    { day: 2, label: 'T3' },
    { day: 3, label: 'T4' },
    { day: 4, label: 'T5' },
    { day: 5, label: 'T6' },
    { day: 6, label: 'T7' },
    { day: 0, label: 'CN' },
  ];

  const getRepeatDescription = (alarm: Alarm) => {
    switch (alarm.repeatType) {
      case 'none':
        return 'Một lần duy nhất';
      case 'daily':
        return 'Hằng ngày';
      case 'weekdays':
        return 'Thứ 2 - Thứ 6';
      case 'weekend':
        return 'Cuối tuần (T7, CN)';
      case 'custom':
        if (alarm.repeatDays.length === 0) return 'Không lặp';
        const dayMap: Record<number, string> = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 0: 'CN' };
        return `Vào ${alarm.repeatDays.map((d) => dayMap[d]).join(', ')}`;
      default:
        return 'Tùy chỉnh';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Hệ thống Báo thức & Nhắc việc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Báo Thức (Alarm System)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý báo thức độc lập và đồng bộ với Todo & Calendar
          </p>
        </div>

        <button
          onClick={() => openQuickCreateWithTab('alarm')}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-red-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Báo Thức</span>
        </button>
      </div>

      {/* Alarm Cards List */}
      <div className="space-y-4">
        {alarms.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card/40 border border-border rounded-3xl">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h3 className="font-semibold text-foreground text-sm">Chưa có báo thức nào</h3>
            <p className="text-xs mt-0.5">Hãy nhấn nút "Thêm Báo Thức" ở trên để tạo lịch báo thức đầu tiên!</p>
          </div>
        ) : (
          alarms.map((alarm: Alarm) => (
            <div
              key={alarm.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 shadow-sm relative overflow-hidden group ${
                alarm.isEnabled
                  ? 'bg-card border-border hover:border-red-500/40 shadow-red-500/5'
                  : 'bg-card/40 border-border/40 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Time & Title */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-foreground">
                      {alarm.time}
                    </span>
                    <button
                      onClick={() => previewSound(alarm.sound, alarm.volume)}
                      className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs flex items-center space-x-1 transition"
                      title="Nghe thử chuông"
                    >
                      <Volume2 className="w-4 h-4 text-primary" />
                      <span className="capitalize text-[11px]">{alarm.sound}</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {alarm.title}
                  </h3>

                  {alarm.description && (
                    <p className="text-xs text-muted-foreground">
                      {alarm.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center space-x-1 text-primary font-medium">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{getRepeatDescription(alarm)}</span>
                    </span>
                    {alarm.snoozeEnabled && (
                      <span>• Báo lại {alarm.snoozeDuration}m</span>
                    )}
                  </div>
                </div>

                {/* Right: Switch & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                  {/* ON/OFF Switch */}
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`px-5 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 ${
                      alarm.isEnabled
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {alarm.isEnabled ? 'ON' : 'OFF'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => triggerAlarm(alarm)}
                      className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs flex items-center space-x-1"
                      title="Kích hoạt thử ngay"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px]">Test</span>
                    </button>
                    <button
                      onClick={() => duplicateAlarm(alarm.id)}
                      className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                      title="Nhân bản"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom days indicators */}
              {alarm.repeatType === 'custom' && (
                <div className="flex items-center space-x-1.5 mt-3 pt-3 border-t border-border/40">
                  {dayLabels.map(({ day, label }) => {
                    const isActive = alarm.repeatDays.includes(day);
                    return (
                      <span
                        key={day}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : 'text-muted-foreground/40'
                        }`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* PWA & Alarm Limits Transparency Box */}
      <div className="p-4 rounded-3xl bg-secondary/40 border border-border flex items-start space-x-3 text-xs text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-foreground">Lưu ý về Báo thức trên nền tảng Web & PWA</h4>
          <p className="leading-relaxed">
            Ứng dụng hỗ trợ Web Notification và Web Audio Synthesizer khi tab trình duyệt đang mở hoặc chạy ngầm (PWA). Để đảm bảo báo thức phát ra âm thanh to rõ, hãy bật cấp quyền thông báo và không tắt âm lượng thiết bị.
          </p>
        </div>
      </div>
    </div>
  );
};

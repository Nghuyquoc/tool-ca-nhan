import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { Bell, Clock, CheckCircle2, RotateCcw, Volume2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlarmTriggerModal: React.FC = () => {
  const { activeTriggeredAlarm, dismissAlarm, snoozeAlarm, tasks } = useWorkspaceStore();
  const navigate = useNavigate();
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeTriggeredAlarm) return null;

  const linkedTask = activeTriggeredAlarm.linkedTaskId
    ? tasks.find((t) => t.id === activeTriggeredAlarm.linkedTaskId)
    : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-card border-2 border-red-500/50 dark:border-red-500/40 rounded-3xl p-8 text-center shadow-2xl shadow-red-500/20 ring-1 ring-white/10 transition-card">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Alarm Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/15 text-red-500 border border-red-500/40 animate-ring-alarm shadow-lg shadow-red-500/20">
          <Bell className="h-12 w-12 text-red-500" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 shadow-sm"></span>
          </span>
        </div>

        {/* Current Time Display */}
        <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-1">
          {currentTimeStr}
        </div>
        <div className="text-5xl font-black tracking-tight text-foreground mb-4">
          {activeTriggeredAlarm.time}
        </div>

        {/* Alarm Title & Description */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {activeTriggeredAlarm.title}
        </h2>
        {activeTriggeredAlarm.description && (
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            {activeTriggeredAlarm.description}
          </p>
        )}

        {/* Linked Task Chip */}
        {linkedTask && (
          <div className="mb-6 p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between text-left">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Liên kết công việc:</div>
                <div className="text-sm font-medium">{linkedTask.title}</div>
              </div>
            </div>
            <button
              onClick={() => {
                dismissAlarm(activeTriggeredAlarm.id);
                navigate('/todo');
              }}
              className="text-xs text-primary hover:underline flex items-center space-x-1"
            >
              <span>Xem Task</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Sound badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground mb-8">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Âm báo: {activeTriggeredAlarm.sound} ({activeTriggeredAlarm.volume}%)</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => snoozeAlarm(activeTriggeredAlarm.id, 5)}
            className="flex items-center justify-center space-x-2 w-full py-3.5 px-5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Báo lại 5 phút</span>
          </button>
          <button
            onClick={() => dismissAlarm(activeTriggeredAlarm.id)}
            className="flex items-center justify-center space-x-2 w-full py-3.5 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25 transition active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Tắt báo thức</span>
          </button>
        </div>
      </div>
    </div>
  );
};

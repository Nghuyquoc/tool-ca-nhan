import React from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspaceStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = 'border-border bg-card text-foreground';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'border-amber-500/30 bg-amber-950/20 text-amber-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'border-red-500/30 bg-red-950/20 text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slideUp ${colorClasses}`}
          >
            <div className="flex items-center space-x-3 text-sm font-medium">
              <Icon className="w-5 h-5 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

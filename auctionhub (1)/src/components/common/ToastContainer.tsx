import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { Gavel, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuction();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
        let borderClass = 'border-slate-200 dark:border-slate-700';

        if (toast.type === 'bid') {
          icon = <Gavel className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
          borderClass = 'border-violet-500/50';
        } else if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
          borderClass = 'border-emerald-500/50';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-4 h-4 text-amber-600" />;
          borderClass = 'border-amber-500/50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border ${borderClass} flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {toast.title}
                </h5>
                <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

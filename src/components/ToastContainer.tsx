import React from 'react';
import { usePOS } from '../context/POSContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePOS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-lg border text-xs flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-white border-emerald-300 text-stone-900'
                : isWarning
                ? 'bg-white border-amber-300 text-stone-900'
                : isError
                ? 'bg-white border-rose-300 text-stone-900'
                : 'bg-white border-purple-300 text-stone-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-purple-600" />}
            </div>

            <div className="flex-1 pr-1">
              <h5 className="font-bold text-xs text-stone-900 leading-tight">
                {toast.title}
              </h5>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-stone-600 shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

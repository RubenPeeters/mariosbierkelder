"use client";
import { useEffect } from "react";

export default function Toast({ message, onUndo, onDismiss }: {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300">
      <span className="text-sm">{message}</span>
      {onUndo && (
        <button onClick={onUndo} className="text-amber-400 font-bold text-sm hover:text-amber-300">
          Undo
        </button>
      )}
    </div>
  );
}

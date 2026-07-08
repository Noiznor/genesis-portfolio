"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type DetailModalProps = {
  isOpen: boolean;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onClose: () => void;
};

export function DetailModal({
  isOpen,
  title,
  eyebrow,
  children,
  onClose
}: DetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close detail modal"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-emerald-400/25 bg-[#020403]/95 shadow-2xl shadow-emerald-500/20">
        <div className="sticky top-0 z-10 border-b border-emerald-400/10 bg-[#020403]/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              {eyebrow ? (
                <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                  {eyebrow}
                </p>
              ) : null}

              <h2
                id="detail-modal-title"
                className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl"
              >
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-400/25 bg-emerald-400/5 text-emerald-200 shadow-lg shadow-emerald-500/10 transition duration-300 hover:scale-110 hover:rotate-90 hover:border-emerald-300 hover:bg-emerald-400/15 hover:text-emerald-50 hover:shadow-emerald-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020403]"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400/0 blur-md transition duration-300 group-hover:bg-emerald-400/25" />
              <span className="relative font-mono text-2xl leading-none transition duration-300 group-hover:drop-shadow-[0_0_10px_rgba(110,231,183,0.95)]">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}

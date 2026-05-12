'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  page: string;
  hint?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Pinnacle CRM! 👋',
    description: 'This guided tour walks you through every feature of your dashboard. Use the arrows to move between steps, or skip to explore on your own.',
    page: '/dashboard',
  },
  {
    title: 'Dashboard Overview',
    description: 'Your home base. See total revenue, open jobs, pending quotes, and overdue follow-ups at a glance. The charts below show 12-month revenue and lead source breakdown.',
    page: '/dashboard',
    hint: 'Scroll down to see the monthly revenue chart and lead source pie chart.',
  },
  {
    title: 'Lead Management',
    description: 'Every inquiry starts as a lead. Add them manually or they flow in automatically from the public website quote form. Filter by status, search by name, and convert ready leads to customers in one click.',
    page: '/dashboard/leads',
    hint: 'Try the "+ Add Lead" button, or click the arrow icon on any lead to convert them to a customer.',
  },
  {
    title: 'Customer Directory',
    description: 'Your full customer list. Filter by Active, VIP, Open Balance, or Top Spend. Click any customer name to open their detail page — showing all linked jobs, quotes, invoices, and follow-ups.',
    page: '/dashboard/customers',
    hint: 'Click a customer name to see their full history, or use "Edit Profile" to change their VIP status.',
  },
  {
    title: 'Job Tracking',
    description: 'Manage every job from Scheduled through Completed. Track service type, assigned technician, date, and job value. Use the status filter pills to focus on what needs attention.',
    page: '/dashboard/jobs',
    hint: 'Use the status pills (Scheduled, In Progress, Completed) to filter jobs by stage.',
  },
  {
    title: 'Quotes',
    description: 'Create and track quotes for customers. When a quote is accepted, click the "Convert to Job" arrow to automatically create a job record — no re-entry needed.',
    page: '/dashboard/quotes',
    hint: 'Click the arrow icon on any "Sent" quote to convert it to a job.',
  },
  {
    title: 'Invoice Tracking',
    description: 'Monitor all invoices and outstanding balances. Overdue invoices are highlighted with a red row. Connect QuickBooks (next step) to sync billing data automatically.',
    page: '/dashboard/invoices',
    hint: 'Rows with a red tint are overdue. The balance column shows what\'s still owed.',
  },
  {
    title: 'Follow-Ups',
    description: 'Never miss a callback or check-in. An alert banner shows how many tasks are overdue. Mark any follow-up complete with the checkmark button.',
    page: '/dashboard/follow-ups',
    hint: 'Click the green checkmark button on any pending follow-up to mark it complete.',
  },
  {
    title: 'Reports & Analytics',
    description: 'Visualize your business performance. Monthly revenue trends, top customers by spend, lead source breakdown, and quote win/loss rates — all in one place.',
    page: '/dashboard/reports',
    hint: 'Scroll down to see all charts. The KPI cards at the top summarize your key numbers.',
  },
  {
    title: 'QuickBooks Integration',
    description: 'Connect your QuickBooks Online account to sync customers, invoices, and payments automatically via OAuth2 authorization. The sync log shows every operation performed.',
    page: '/dashboard/quickbooks',
    hint: 'Click "Connect to QuickBooks" to start the OAuth authorization flow.',
  },
  {
    title: "You're all set! 🎉",
    description: 'Tour complete! All data shown is demo data — safe to edit and explore freely. You can restart this tour anytime from the Settings page.',
    page: '/dashboard/settings',
  },
];

interface TutorialContextType {
  isActive: boolean;
  step: number;
  totalSteps: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  isActive: false, step: 0, totalSteps: STEPS.length,
  start: () => {}, stop: () => {}, next: () => {}, prev: () => {},
});

export function useTutorial() { return useContext(TutorialContext); }

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);

  const start = useCallback(() => {
    setStep(0);
    setIsActive(true);
    router.push(STEPS[0].page);
  }, [router]);

  const stop = useCallback(() => setIsActive(false), []);

  const next = useCallback(() => {
    setStep(s => {
      const n = Math.min(s + 1, STEPS.length - 1);
      router.push(STEPS[n].page);
      return n;
    });
  }, [router]);

  const prev = useCallback(() => {
    setStep(s => {
      const p = Math.max(s - 1, 0);
      router.push(STEPS[p].page);
      return p;
    });
  }, [router]);

  return (
    <TutorialContext.Provider value={{ isActive, step, totalSteps: STEPS.length, start, stop, next, prev }}>
      {children}
      {isActive && <TutorialOverlay step={step} onNext={next} onPrev={prev} onStop={stop} />}
    </TutorialContext.Provider>
  );
}

function TutorialOverlay({
  step, onNext, onPrev, onStop,
}: { step: number; onNext: () => void; onPrev: () => void; onStop: () => void }) {
  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden animate-in">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Compass size={13} className="text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <button
            onClick={onStop}
            title="End tour"
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-2">{current.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{current.description}</p>

        {current.hint && (
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-800 font-medium">💡 {current.hint}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          {/* Dot indicators */}
          <div className="flex gap-1 items-center">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step ? 'w-4 h-1.5 bg-indigo-600' : 'w-1.5 h-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>
            )}
            {isLast ? (
              <button
                onClick={onStop}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Done ✓
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

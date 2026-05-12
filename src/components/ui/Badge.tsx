import React from 'react';

type BadgeVariant =
  | 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'orange' | 'gray' | 'indigo' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  gray:   'bg-gray-100 text-gray-700',
  indigo: 'bg-indigo-100 text-indigo-800',
  teal:   'bg-teal-100 text-teal-800',
};

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// ─── Status → Variant helpers ──────────────────────────────────────────────────

export function leadStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    New: 'blue', Contacted: 'teal', Quoted: 'purple', Scheduled: 'orange', Won: 'green', Lost: 'red',
  };
  return map[status] ?? 'gray';
}

export function jobStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Scheduled: 'blue', 'In Progress': 'orange', Completed: 'green', Canceled: 'red',
  };
  return map[status] ?? 'gray';
}

export function quoteStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Draft: 'gray', Sent: 'blue', Accepted: 'green', Declined: 'red', Expired: 'yellow',
  };
  return map[status] ?? 'gray';
}

export function invoiceStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Paid: 'green', Unpaid: 'blue', 'Partially Paid': 'yellow', Overdue: 'red',
  };
  return map[status] ?? 'gray';
}

export function followUpStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Pending: 'yellow', Completed: 'green', Skipped: 'gray',
  };
  return map[status] ?? 'gray';
}

export function followUpPriorityVariant(priority: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    High: 'red', Medium: 'orange', Low: 'gray',
  };
  return map[priority] ?? 'gray';
}

export function customerStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Active: 'green', Inactive: 'gray', VIP: 'purple',
  };
  return map[status] ?? 'gray';
}

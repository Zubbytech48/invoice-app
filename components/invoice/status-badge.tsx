'use client';

import { InvoiceStatus } from '@/lib/invoice-types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const statusConfig: Record<InvoiceStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  draft: {
    label: 'Draft',
    dotClass: 'bg-slate-500 dark:bg-slate-400',
    bgClass: 'bg-slate-500/10 dark:bg-slate-400/10',
    textClass: 'text-slate-600 dark:text-slate-400',
  },
  pending: {
    label: 'Pending',
    dotClass: 'bg-orange-500 dark:bg-orange-400',
    bgClass: 'bg-orange-500/10 dark:bg-orange-400/10',
    textClass: 'text-orange-600 dark:text-orange-400',
  },
  paid: {
    label: 'Paid',
    dotClass: 'bg-emerald-500 dark:bg-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-sm min-w-[104px] justify-center',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span className={cn('size-2 rounded-full', config.dotClass)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

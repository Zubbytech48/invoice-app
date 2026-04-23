'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { InvoiceStatus } from '@/lib/invoice-types';
import { useInvoices } from '@/lib/invoice-context';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const statuses: { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

export function StatusFilter() {
  const { filterStatus, setFilterStatus } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const currentLabel = statuses.find((s) => s.value === filterStatus)?.label || 'Filter';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 text-sm font-bold text-foreground',
          'hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <ChevronDown
          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-4 w-48 bg-card rounded-lg shadow-lg border p-4 z-50"
          role="listbox"
          aria-label="Filter invoices by status"
        >
          <div className="space-y-3">
            {statuses.map((status) => (
              <div key={status.value} className="flex items-center gap-3">
                <Checkbox
                  id={`filter-${status.value}`}
                  checked={filterStatus === status.value}
                  onCheckedChange={() => {
                    setFilterStatus(status.value);
                    setIsOpen(false);
                  }}
                  aria-labelledby={`filter-label-${status.value}`}
                />
                <Label
                  id={`filter-label-${status.value}`}
                  htmlFor={`filter-${status.value}`}
                  className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

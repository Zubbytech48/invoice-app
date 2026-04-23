'use client';

import { ChevronRight } from 'lucide-react';
import { useInvoices } from '@/lib/invoice-context';
import { formatCurrency, formatDate, calculateTotal } from '@/lib/invoice-types';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

export function InvoiceList() {
  const { filteredInvoices, selectInvoice, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card rounded-lg border p-6 animate-pulse"
          >
            <div className="h-4 bg-muted rounded w-1/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex justify-center mb-8">
          <img
            src="/illustration.png"
            alt="Messaging illustration"
            className="w-[400px] h-auto"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-4 text-balance">
          There is nothing here
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs text-pretty">
          Create an invoice by clicking the{' '}
          <span className="font-semibold">New Invoice</span> button and get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredInvoices.map((invoice) => (
        <button
          key={invoice.id}
          onClick={() => selectInvoice(invoice.id)}
          className={cn(
            'w-full bg-card rounded-lg border p-6 text-left transition-all',
            'hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'group'
          )}
          aria-label={`View invoice ${invoice.id} for ${invoice.clientName}`}
        >
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-foreground">
                <span className="text-muted-foreground">#</span>
                {invoice.id}
              </span>
              <span className="text-sm text-muted-foreground">{invoice.clientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Due {formatDate(invoice.paymentDue)}
                </p>
                <p className="font-bold text-foreground">
                  {formatCurrency(calculateTotal(invoice.items))}
                </p>
              </div>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:grid sm:grid-cols-[100px_1fr_1fr_1fr_auto_auto] items-center gap-4">
            <span className="font-bold text-foreground">
              <span className="text-muted-foreground">#</span>
              {invoice.id}
            </span>
            <span className="text-sm text-muted-foreground">
              Due {formatDate(invoice.paymentDue)}
            </span>
            <span className="text-sm text-muted-foreground">{invoice.clientName}</span>
            <span className="font-bold text-foreground text-right">
              {formatCurrency(calculateTotal(invoice.items))}
            </span>
            <StatusBadge status={invoice.status} />
            <ChevronRight
              className="size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </div>
        </button>
      ))}
    </div>
  );
}

'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from './app-sidebar';
import { StatusFilter } from './status-filter';
import { Empty } from '@/components/ui/empty';
import { cn } from '@/lib/utils';

interface EmptyInvoicesProps {
  onNewInvoice: () => void;
}

export function EmptyInvoices({ onNewInvoice }: EmptyInvoicesProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      {/* Main content */}
      <main
        className={cn(
          'pt-16 lg:pt-0 lg:pl-24',
          'min-h-screen'
        )}
      >
        <div className="max-w-3xl mx-auto px-6 py-8 lg:py-16">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 lg:mb-16">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground">Invoices</h1>
              <p className="text-sm text-muted-foreground mt-1">No invoices</p>
            </div>
            <Button onClick={onNewInvoice} className="gap-2">
              <Plus className="size-4" />
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </Button>
          </header>

          {/* Filter */}
          <div className="mb-8">
            <StatusFilter />
          </div>

          {/* Empty State */}
          <Empty>
            <div className="text-center">
              <p className="text-lg font-semibold text-muted-foreground">No invoices yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first invoice to get started
              </p>
            </div>
          </Empty>
        </div>
      </main>
    </div>
  );
}

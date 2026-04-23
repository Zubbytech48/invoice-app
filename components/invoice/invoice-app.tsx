'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoices } from '@/lib/invoice-context';
import { InvoiceList } from './invoice-list';
import { InvoiceDetail } from './invoice-detail';
import { InvoiceForm } from './invoice-form';
import { StatusFilter } from './status-filter';
import { AppSidebar } from './app-sidebar';
import { cn } from '@/lib/utils';

export function InvoiceApp() {
  const { selectedInvoice, filteredInvoices, isLoading } = useInvoices();
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);

  const invoiceCount = filteredInvoices.length;

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
          {selectedInvoice ? (
            <InvoiceDetail />
          ) : (
            <>
              {/* Header */}
              <header className="flex items-center justify-between mb-8 lg:mb-16">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-foreground">Invoices</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isLoading ? (
                      'Loading...'
                    ) : invoiceCount === 0 ? (
                      'No invoices'
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          There are {invoiceCount} total invoice{invoiceCount !== 1 ? 's' : ''}
                        </span>
                        <span className="sm:hidden">{invoiceCount} invoices</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <StatusFilter />
                  <Button
                    onClick={() => setShowNewInvoiceForm(true)}
                    className="gap-2 pl-2 pr-4 bg-primary hover:bg-primary/90"
                  >
                    <span className="bg-white rounded-full p-2">
                      <Plus className="size-3 text-primary" />
                    </span>
                    <span className="hidden sm:inline">New Invoice</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
              </header>

              {/* Invoice list */}
              <InvoiceList />
            </>
          )}
        </div>
      </main>

      {/* New invoice form */}
      <InvoiceForm
        isOpen={showNewInvoiceForm}
        onClose={() => setShowNewInvoiceForm(false)}
      />
    </div>
  );
}

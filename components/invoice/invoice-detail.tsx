'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoices } from '@/lib/invoice-context';
import { formatCurrency, formatDate, calculateTotal } from '@/lib/invoice-types';
import { StatusBadge } from './status-badge';
import { ConfirmDeleteModal } from './confirm-delete-modal';
import { InvoiceForm } from './invoice-form';
import { cn } from '@/lib/utils';

export function InvoiceDetail() {
  const { selectedInvoice, selectInvoice, deleteInvoice, markAsPending, markAsPaid } =
    useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!selectedInvoice) return null;

  const total = calculateTotal(selectedInvoice.items);
  const canEdit = selectedInvoice.status === 'draft' || selectedInvoice.status === 'pending';
  const canMarkPending = selectedInvoice.status === 'draft';
  const canMarkPaid = selectedInvoice.status === 'pending';

  const handleDelete = () => {
    deleteInvoice(selectedInvoice.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Back button */}
        <button
          onClick={() => selectInvoice(null)}
          className="flex items-center gap-4 text-sm font-bold text-foreground hover:text-muted-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="size-4 text-primary group-hover:-translate-x-1 transition-transform" />
          Go back
        </button>

        {/* Status bar */}
        <div className="bg-card rounded-lg border p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={selectedInvoice.status} />
          </div>

          {/* Actions - Fixed at bottom on mobile */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 sm:relative sm:p-0 sm:border-0 sm:bg-transparent">
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <Button
                  variant="secondary"
                  onClick={() => setShowEditForm(true)}
                  className="flex-1 sm:flex-initial"
                >
                  Edit
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 sm:flex-initial"
              >
                Delete
              </Button>
              {canMarkPending && (
                <Button
                  onClick={() => markAsPending(selectedInvoice.id)}
                  className="flex-1 sm:flex-initial"
                >
                  Mark as Pending
                </Button>
              )}
              {canMarkPaid && (
                <Button
                  onClick={() => markAsPaid(selectedInvoice.id)}
                  className="flex-1 sm:flex-initial"
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Invoice details card */}
        <div className="bg-card rounded-lg border p-6 sm:p-8 lg:p-12 mb-20 sm:mb-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-lg font-bold text-foreground mb-2">
                <span className="text-muted-foreground">#</span>
                {selectedInvoice.id}
              </h1>
              <p className="text-sm text-muted-foreground">{selectedInvoice.description}</p>
            </div>
            <div className="text-sm text-muted-foreground sm:text-right">
              <p>{selectedInvoice.clientAddress}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Invoice Date</p>
              <p className="font-bold text-foreground">{formatDate(selectedInvoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Payment Due</p>
              <p className="font-bold text-foreground">{formatDate(selectedInvoice.paymentDue)}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 sm:row-span-2">
              <p className="text-xs text-muted-foreground mb-2">Sent to</p>
              <p className="font-bold text-foreground mb-1">{selectedInvoice.clientEmail}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground mb-2">Bill To</p>
              <p className="font-bold text-foreground mb-1">{selectedInvoice.clientName}</p>
              <p className="text-sm text-muted-foreground">{selectedInvoice.clientAddress}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-secondary/50 dark:bg-secondary/20 rounded-t-lg overflow-hidden">
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left font-medium p-4">Item Name</th>
                  <th className="text-center font-medium p-4">QTY.</th>
                  <th className="text-right font-medium p-4">Price</th>
                  <th className="text-right font-medium p-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item) => (
                  <tr key={item.id} className="text-foreground">
                    <td className="font-bold p-4">{item.name}</td>
                    <td className="text-center text-muted-foreground p-4">{item.quantity}</td>
                    <td className="text-right text-muted-foreground p-4">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="text-right font-bold p-4">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile items */}
            <div className="sm:hidden p-4 space-y-4">
              {selectedInvoice.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-800 dark:bg-slate-900 rounded-b-lg p-6 flex items-center justify-between">
            <span className="text-sm text-white">Amount Due</span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        invoiceId={selectedInvoice.id}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <InvoiceForm
        invoice={selectedInvoice}
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
      />
    </>
  );
}

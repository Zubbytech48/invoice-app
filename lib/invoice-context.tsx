'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Invoice, 
  InvoiceStatus, 
  InvoiceFormData, 
  generateId, 
  sampleInvoices 
} from './invoice-types';

const STORAGE_KEY = 'invoices-app-data';

interface InvoiceContextType {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  filterStatus: InvoiceStatus | 'all';
  isLoading: boolean;
  setFilterStatus: (status: InvoiceStatus | 'all') => void;
  selectInvoice: (id: string | null) => void;
  createInvoice: (data: InvoiceFormData, status: InvoiceStatus) => void;
  updateInvoice: (id: string, data: InvoiceFormData) => void;
  deleteInvoice: (id: string) => void;
  markAsPending: (id: string) => void;
  markAsPaid: (id: string) => void;
  filteredInvoices: Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInvoices(parsed.invoices || []);
      } else {
        // Initialize with sample data
        setInvoices(sampleInvoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ invoices: sampleInvoices }));
      }
    } catch (error) {
      console.error('Failed to load invoices from localStorage:', error);
      setInvoices(sampleInvoices);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ invoices }));
      } catch (error) {
        console.error('Failed to save invoices to localStorage:', error);
      }
    }
  }, [invoices, isLoading]);

  const selectedInvoice = useMemo(() => {
    return invoices.find((inv) => inv.id === selectedInvoiceId) || null;
  }, [invoices, selectedInvoiceId]);

  const filteredInvoices = useMemo(() => {
    if (filterStatus === 'all') return invoices;
    return invoices.filter((inv) => inv.status === filterStatus);
  }, [invoices, filterStatus]);

  const selectInvoice = useCallback((id: string | null) => {
    setSelectedInvoiceId(id);
  }, []);

  const createInvoice = useCallback((data: InvoiceFormData, status: InvoiceStatus) => {
    const now = new Date().toISOString().split('T')[0];
    const newInvoice: Invoice = {
      id: generateId(),
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      clientCity: data.clientCity,
      clientPostCode: data.clientPostCode,
      clientCountry: data.clientCountry,
      senderStreet: data.senderStreet,
      senderCity: data.senderCity,
      senderPostCode: data.senderPostCode,
      senderCountry: data.senderCountry,
      description: data.description,
      status,
      items: data.items.map((item, index) => ({
        ...item,
        id: `item-${index}-${Date.now()}`,
      })),
      createdAt: now,
      updatedAt: now,
      paymentDue: data.paymentDue,
      paymentTerms: data.paymentTerms,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  }, []);

  const updateInvoice = useCallback((id: string, data: InvoiceFormData) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              clientName: data.clientName,
              clientEmail: data.clientEmail,
              clientAddress: data.clientAddress,
              clientCity: data.clientCity,
              clientPostCode: data.clientPostCode,
              clientCountry: data.clientCountry,
              senderStreet: data.senderStreet,
              senderCity: data.senderCity,
              senderPostCode: data.senderPostCode,
              senderCountry: data.senderCountry,
              description: data.description,
              paymentDue: data.paymentDue,
              paymentTerms: data.paymentTerms,
              items: data.items.map((item, index) => ({
                ...item,
                id: `item-${index}-${Date.now()}`,
              })),
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : inv
      )
    );
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setSelectedInvoiceId(null);
  }, []);

  const markAsPending = useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status === 'draft'
          ? { ...inv, status: 'pending' as InvoiceStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : inv
      )
    );
  }, []);

  const markAsPaid = useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status === 'pending'
          ? { ...inv, status: 'paid' as InvoiceStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : inv
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      invoices,
      selectedInvoice,
      filterStatus,
      isLoading,
      setFilterStatus,
      selectInvoice,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPending,
      markAsPaid,
      filteredInvoices,
    }),
    [
      invoices,
      selectedInvoice,
      filterStatus,
      isLoading,
      selectInvoice,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPending,
      markAsPaid,
      filteredInvoices,
    ]
  );

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}

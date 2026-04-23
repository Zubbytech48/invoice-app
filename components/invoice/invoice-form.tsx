'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Invoice,
  type InvoiceFormData,
  type FormErrors,
  validateInvoiceForm,
  formatCurrency,
} from '@/lib/invoice-types';
import { useInvoices } from '@/lib/invoice-context';
import { cn } from '@/lib/utils';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const emptyItem = { name: '', quantity: 1, price: 0 };

export function InvoiceForm({ invoice, isOpen, onClose }: InvoiceFormProps) {
  const { createInvoice, updateInvoice } = useInvoices();
  const formRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isEditing = !!invoice;

  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: '',
    paymentDue: '',
    paymentTerms: '',
    items: [{ ...emptyItem }],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate form when editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        clientCity: invoice.clientCity,
        clientPostCode: invoice.clientPostCode,
        clientCountry: invoice.clientCountry,
        senderStreet: invoice.senderStreet,
        senderCity: invoice.senderCity,
        senderPostCode: invoice.senderPostCode,
        senderCountry: invoice.senderCountry,
        description: invoice.description,
        paymentDue: invoice.paymentDue,
        paymentTerms: invoice.paymentTerms,
        items: invoice.items.map(({ name, quantity, price }) => ({ name, quantity, price })),
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        clientCity: '',
        clientPostCode: '',
        clientCountry: '',
        senderStreet: '',
        senderCity: '',
        senderPostCode: '',
        senderCountry: '',
        description: '',
        paymentDue: '',
        paymentTerms: '',
        items: [{ ...emptyItem }],
      });
      setErrors({});
      setTouched({});
    }
  }, [invoice, isOpen]);

  // Focus trap and escape handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    closeButtonRef.current?.focus();

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof formData.items)[0],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setTouched((prev) => ({ ...prev, items: true }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = validateInvoiceForm(formData);
    setErrors(validationErrors);
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      description: true,
      paymentDue: true,
      items: true,
    };
    setTouched(allTouched);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSaveDraft = () => {
    // For draft, we allow partial validation - just need client name and at least one item
    const draftErrors: FormErrors = {};
    if (!formData.clientName.trim()) {
      draftErrors.clientName = 'Client name is required for draft';
    }
    if (formData.items.length === 0) {
      draftErrors.items = 'At least one item is required';
    }

    if (Object.keys(draftErrors).length > 0) {
      setErrors(draftErrors);
      setTouched({ clientName: true, items: true });
      return;
    }

    createInvoice(formData, 'draft');
    onClose();
  };

  const handleSaveAndSend = () => {
    if (!validateForm()) return;

    if (isEditing && invoice) {
      updateInvoice(invoice.id, formData);
    } else {
      createInvoice(formData, 'pending');
    }
    onClose();
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;
    if (invoice) {
      updateInvoice(invoice.id, formData);
    }
    onClose();
  };

  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:left-24">
      <div
        ref={formRef}
        className="fixed inset-y-0 left-0 w-full sm:max-w-xl lg:max-w-2xl lg:left-24 bg-background overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="p-6 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <h2 id="form-title" className="text-2xl font-bold text-foreground">
              {isEditing ? `Edit #${invoice?.id}` : 'New Invoice'}
            </h2>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close form"
              className="hover:bg-muted"
            >
              <X className="size-5" />
            </Button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Bill From Section */}
            <section>
              <h3 className="text-sm font-bold text-primary mb-4">Bill From</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="senderStreet" className="text-muted-foreground text-xs">
                    Street Address
                  </Label>
                  <Input
                    id="senderStreet"
                    value={formData.senderStreet}
                    onChange={(e) => handleInputChange('senderStreet', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderCity" className="text-muted-foreground text-xs">
                      City
                    </Label>
                    <Input
                      id="senderCity"
                      value={formData.senderCity}
                      onChange={(e) => handleInputChange('senderCity', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="senderPostCode" className="text-muted-foreground text-xs">
                      Post Code
                    </Label>
                    <Input
                      id="senderPostCode"
                      value={formData.senderPostCode}
                      onChange={(e) => handleInputChange('senderPostCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="senderCountry" className="text-muted-foreground text-xs">
                    Country
                  </Label>
                  <Input
                    id="senderCountry"
                    value={formData.senderCountry}
                    onChange={(e) => handleInputChange('senderCountry', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Bill To Section */}
            <section>
              <h3 className="text-sm font-bold text-primary mb-4">Bill To</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="text-muted-foreground text-xs">
                    Client&apos;s Name
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className={cn(
                      'mt-1',
                      touched.clientName && errors.clientName && 'border-destructive'
                    )}
                    aria-invalid={touched.clientName && !!errors.clientName}
                    aria-describedby={errors.clientName ? 'clientName-error' : undefined}
                  />
                  {touched.clientName && errors.clientName && (
                    <p id="clientName-error" className="text-destructive text-xs mt-1">
                      {errors.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientEmail" className="text-muted-foreground text-xs">
                    Client&apos;s Email
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className={cn(
                      'mt-1',
                      touched.clientEmail && errors.clientEmail && 'border-destructive'
                    )}
                    aria-invalid={touched.clientEmail && !!errors.clientEmail}
                    aria-describedby={errors.clientEmail ? 'clientEmail-error' : undefined}
                  />
                  {touched.clientEmail && errors.clientEmail && (
                    <p id="clientEmail-error" className="text-destructive text-xs mt-1">
                      {errors.clientEmail}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientAddress" className="text-muted-foreground text-xs">
                    Client&apos;s Address
                  </Label>
                  <Input
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    className={cn(
                      'mt-1',
                      touched.clientAddress && errors.clientAddress && 'border-destructive'
                    )}
                    aria-invalid={touched.clientAddress && !!errors.clientAddress}
                    aria-describedby={errors.clientAddress ? 'clientAddress-error' : undefined}
                  />
                  {touched.clientAddress && errors.clientAddress && (
                    <p id="clientAddress-error" className="text-destructive text-xs mt-1">
                      {errors.clientAddress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientCity" className="text-muted-foreground text-xs">
                      City
                    </Label>
                    <Input
                      id="clientCity"
                      value={formData.clientCity}
                      onChange={(e) => handleInputChange('clientCity', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientPostCode" className="text-muted-foreground text-xs">
                      Post Code
                    </Label>
                    <Input
                      id="clientPostCode"
                      value={formData.clientPostCode}
                      onChange={(e) => handleInputChange('clientPostCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientCountry" className="text-muted-foreground text-xs">
                    Country
                  </Label>
                  <Input
                    id="clientCountry"
                    value={formData.clientCountry}
                    onChange={(e) => handleInputChange('clientCountry', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Invoice Details */}
            <section>
              <h3 className="text-sm font-bold text-primary mb-4">Invoice Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentDue" className="text-muted-foreground text-xs">
                    Payment Due
                  </Label>
                  <Input
                    id="paymentDue"
                    type="date"
                    value={formData.paymentDue}
                    onChange={(e) => handleInputChange('paymentDue', e.target.value)}
                    className={cn(
                      'mt-1',
                      touched.paymentDue && errors.paymentDue && 'border-destructive'
                    )}
                    aria-invalid={touched.paymentDue && !!errors.paymentDue}
                    aria-describedby={errors.paymentDue ? 'paymentDue-error' : undefined}
                  />
                  {touched.paymentDue && errors.paymentDue && (
                    <p id="paymentDue-error" className="text-destructive text-xs mt-1">
                      {errors.paymentDue}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="paymentTerms" className="text-muted-foreground text-xs">
                    Payment Terms
                  </Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 1 day">Net 1 day</SelectItem>
                      <SelectItem value="Net 7 days">Net 7 days</SelectItem>
                      <SelectItem value="Net 14 days">Net 14 days</SelectItem>
                      <SelectItem value="Net 30 days">Net 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-muted-foreground text-xs">
                    Project Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={cn(
                      'mt-1',
                      touched.description && errors.description && 'border-destructive'
                    )}
                    aria-invalid={touched.description && !!errors.description}
                    aria-describedby={errors.description ? 'description-error' : undefined}
                  />
                  {touched.description && errors.description && (
                    <p id="description-error" className="text-destructive text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Item List */}
            <section>
              <h3 className="text-lg font-bold text-muted-foreground mb-4">Item List</h3>
              {touched.items && errors.items && (
                <p className="text-destructive text-xs mb-4">{errors.items}</p>
              )}
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr] sm:grid-cols-[1fr_60px_100px_80px_auto] gap-3 items-end"
                  >
                    <div>
                      <Label
                        htmlFor={`item-name-${index}`}
                        className="text-muted-foreground text-xs sm:hidden"
                      >
                        Item Name
                      </Label>
                      {index === 0 && (
                        <Label className="text-muted-foreground text-xs hidden sm:block">
                          Item Name
                        </Label>
                      )}
                      <Input
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 sm:contents gap-3">
                      <div>
                        <Label
                          htmlFor={`item-qty-${index}`}
                          className="text-muted-foreground text-xs sm:hidden"
                        >
                          Qty.
                        </Label>
                        {index === 0 && (
                          <Label className="text-muted-foreground text-xs hidden sm:block">
                            Qty.
                          </Label>
                        )}
                        <Input
                          id={`item-qty-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`item-price-${index}`}
                          className="text-muted-foreground text-xs sm:hidden"
                        >
                          Price
                        </Label>
                        {index === 0 && (
                          <Label className="text-muted-foreground text-xs hidden sm:block">
                            Price
                          </Label>
                        )}
                        <Input
                          id={`item-price-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-xs sm:hidden">Total</Label>
                        {index === 0 && (
                          <Label className="text-muted-foreground text-xs hidden sm:block">
                            Total
                          </Label>
                        )}
                        <div className="h-9 mt-1 flex items-center text-sm font-medium text-muted-foreground">
                          {formatCurrency(calculateItemTotal(item.quantity, item.price))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end sm:pb-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={addItem}
                  className="w-full mt-4"
                >
                  <Plus className="size-4 mr-2" />
                  Add New Item
                </Button>
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-6 border-t">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="sm:mr-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="sm:mr-auto"
                  >
                    Discard
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="bg-slate-700 text-white border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    Save as Draft
                  </Button>
                  <Button type="button" onClick={handleSaveAndSend}>
                    Save & Send
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

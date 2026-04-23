export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;
  description: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
  paymentDue: string;
  paymentTerms: string;
}

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;
  description: string;
  paymentDue: string;
  paymentTerms: string;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface FormErrors {
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  description?: string;
  paymentDue?: string;
  items?: string;
  [key: string]: string | undefined;
}

export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = letters[Math.floor(Math.random() * letters.length)] + 
                        letters[Math.floor(Math.random() * letters.length)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetters}${randomNumbers}`;
}

export function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateInvoiceForm(data: InvoiceFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.clientName.trim()) {
    errors.clientName = 'Client name is required';
  }

  if (!data.clientEmail.trim()) {
    errors.clientEmail = 'Client email is required';
  } else if (!validateEmail(data.clientEmail)) {
    errors.clientEmail = 'Please enter a valid email address';
  }

  if (!data.clientAddress.trim()) {
    errors.clientAddress = 'Client address is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Project description is required';
  }

  if (!data.paymentDue) {
    errors.paymentDue = 'Payment due date is required';
  }

  if (data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    const hasInvalidItem = data.items.some(
      (item) => !item.name.trim() || item.quantity <= 0 || item.price <= 0
    );
    if (hasInvalidItem) {
      errors.items = 'All items must have a name, positive quantity, and positive price';
    }
  }

  return errors;
}

export const sampleInvoices: Invoice[] = [
  {
    id: 'RT3080',
    clientName: 'Jensen Huang',
    clientEmail: 'jensen@nvidia.com',
    clientAddress: '2788 Santa Clara, CA 95051',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'Re-branding Project',
    status: 'paid',
    items: [
      { id: '1', name: 'Brand Guidelines', quantity: 1, price: 1800.90 },
      { id: '2', name: 'Website Design', quantity: 1, price: 2500.00 },
    ],
    createdAt: '2024-08-18',
    updatedAt: '2024-08-18',
    paymentDue: '2024-09-20',
    paymentTerms: '',
  },
  {
    id: 'XM9141',
    clientName: 'Alex Grim',
    clientEmail: 'alex@grim.com',
    clientAddress: '84 Church Way, Bradford BD1 9PB',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'Graphic Design',
    status: 'pending',
    items: [
      { id: '1', name: 'Banner Design', quantity: 1, price: 156.00 },
      { id: '2', name: 'Email Design', quantity: 2, price: 200.00 },
    ],
    createdAt: '2024-08-21',
    updatedAt: '2024-08-21',
    paymentDue: '2024-09-20',
    paymentTerms: '',
  },
  {
    id: 'RG0314',
    clientName: 'John Morrison',
    clientEmail: 'john@morrison.com',
    clientAddress: '79 Dover Road, Westhall IP19 3PF',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'Website Redesign',
    status: 'paid',
    items: [
      { id: '1', name: 'Website Redesign', quantity: 1, price: 14002.33 },
    ],
    createdAt: '2024-09-24',
    updatedAt: '2024-09-24',
    paymentDue: '2024-10-01',
    paymentTerms: '',
  },
  {
    id: 'FV2353',
    clientName: 'Anita Wainwright',
    clientEmail: 'anita@design.com',
    clientAddress: 'The Lighthouse, 84 Harbour, Newcastle NE1 1AD',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'Logo Design',
    status: 'draft',
    items: [
      { id: '1', name: 'Logo Concepts', quantity: 3, price: 400.00 },
      { id: '2', name: 'Final Logo Files', quantity: 1, price: 800.00 },
    ],
    createdAt: '2024-11-05',
    updatedAt: '2024-11-05',
    paymentDue: '2024-11-12',
    paymentTerms: '',
  },
  {
    id: 'AA1449',
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisa@clarke.com',
    clientAddress: '19 Union Terrace, London E1 3EZ',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'Landing Page Design',
    status: 'pending',
    items: [
      { id: '1', name: 'Web Design', quantity: 1, price: 4032.33 },
    ],
    createdAt: '2024-10-07',
    updatedAt: '2024-10-07',
    paymentDue: '2024-10-14',
    paymentTerms: '',
  },
  {
    id: 'TY9141',
    clientName: 'Thomas Wayne',
    clientEmail: 'thomas@wayne.com',
    clientAddress: '3964 Queens Lane, Gotham 10001',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    description: 'App Development',
    status: 'pending',
    items: [
      { id: '1', name: 'iOS Development', quantity: 1, price: 8500.00 },
      { id: '2', name: 'Android Development', quantity: 1, price: 8500.00 },
    ],
    createdAt: '2024-10-11',
    updatedAt: '2024-10-11',
    paymentDue: '2024-11-11',
    paymentTerms: '',
  },
];

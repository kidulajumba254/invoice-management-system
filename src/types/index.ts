
export type Status = 'paid' | 'pending' | 'draft';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  date: string;
  dueDate: string;
  status: Status;
  items: InvoiceItem[];
  notes?: string;
  total: number;
  paid?: number;
}

export interface InvoiceStatistics {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalInvoices: number;
}


import { Client, Invoice, InvoiceItem, Status } from "@/types";

// Mock Clients
export const clients: Client[] = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    company: "ABC Corporation",
    address: "123 Main St, Cityville, State 12345"
  },
  {
    id: "client-2",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-765-4321",
    company: "XYZ Company",
    address: "456 Oak Ave, Townsville, State 67890"
  },
  {
    id: "client-3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-987-6543",
    company: "Johnson & Co",
    address: "789 Maple Dr, Villageton, State 54321"
  },
  {
    id: "client-4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "555-234-5678",
    company: "Williams Design",
    address: "101 Pine St, Hamletville, State 13579"
  },
  {
    id: "client-5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-876-5432",
    company: "Brown Consulting",
    address: "202 Cedar Ln, Boroughton, State 24680"
  }
];

// Invoice Item Generator
const createInvoiceItem = (id: string, desc: string, qty: number, price: number): InvoiceItem => ({
  id,
  description: desc,
  quantity: qty,
  price: price
});

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    client: clients[0],
    date: "2025-04-01",
    dueDate: "2025-05-01",
    status: "paid",
    items: [
      createInvoiceItem("item-1-1", "Web Design Services", 1, 1500),
      createInvoiceItem("item-1-2", "SEO Optimization", 1, 500)
    ],
    notes: "Thank you for your business!",
    total: 2000,
    paid: 2000
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    client: clients[1],
    date: "2025-04-10",
    dueDate: "2025-05-10",
    status: "pending",
    items: [
      createInvoiceItem("item-2-1", "Logo Design", 1, 800),
      createInvoiceItem("item-2-2", "Business Card Design", 1, 200)
    ],
    notes: "Please pay within 30 days.",
    total: 1000,
    paid: 0
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    client: clients[2],
    date: "2025-04-15",
    dueDate: "2025-04-29",
    status: "paid",
    items: [
      createInvoiceItem("item-3-1", "Consultation", 2, 250),
      createInvoiceItem("item-3-2", "Market Analysis Report", 1, 1500)
    ],
    notes: "",
    total: 2000,
    paid: 2000
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-004",
    client: clients[3],
    date: "2025-04-20",
    dueDate: "2025-05-20",
    status: "pending",
    items: [
      createInvoiceItem("item-4-1", "Website Maintenance (Monthly)", 1, 350)
    ],
    notes: "Recurring monthly invoice.",
    total: 350,
    paid: 0
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-005",
    client: clients[4],
    date: "2025-03-01",
    dueDate: "2025-03-31",
    status: "draft",
    items: [
      createInvoiceItem("item-5-1", "Marketing Strategy Development", 1, 2500),
      createInvoiceItem("item-5-2", "Content Creation", 5, 100)
    ],
    notes: "Draft - Not yet submitted to client.",
    total: 3000,
    paid: 0
  },
  {
    id: "inv-6",
    invoiceNumber: "INV-006",
    client: clients[0],
    date: "2025-02-15",
    dueDate: "2025-03-15",
    status: "paid",
    items: [
      createInvoiceItem("item-6-1", "Mobile App UI Design", 1, 3000)
    ],
    notes: "Paid on time. Thank you!",
    total: 3000,
    paid: 3000
  },
  {
    id: "inv-7",
    invoiceNumber: "INV-007",
    client: clients[2],
    date: "2025-04-25",
    dueDate: "2025-05-25",
    status: "pending",
    items: [
      createInvoiceItem("item-7-1", "Social Media Management (Monthly)", 1, 800)
    ],
    notes: "First month of six-month contract.",
    total: 800,
    paid: 0
  }
];

// Calculate statistics
export const calculateInvoiceStatistics = () => {
  const totalPaid = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalPending = invoices
    .filter(inv => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const today = new Date().toISOString().split('T')[0];
  const totalOverdue = invoices
    .filter(inv => inv.status === "pending" && inv.dueDate < today)
    .reduce((sum, inv) => sum + inv.total, 0);

  return {
    totalPaid,
    totalPending,
    totalOverdue,
    totalInvoices: invoices.length
  };
};

// Initial Statistics
export const invoiceStatistics = calculateInvoiceStatistics();

// Invoice service functions
export const getInvoiceById = (id: string): Invoice | undefined => {
  return invoices.find(invoice => invoice.id === id);
};

export const getClientById = (id: string): Client | undefined => {
  return clients.find(client => client.id === id);
};

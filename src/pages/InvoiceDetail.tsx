
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, File, Printer, MailOpen } from "lucide-react";
import { invoices } from "@/lib/mockData";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatusBadge from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/use-toast";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const invoice = invoices.find((invoice) => invoice.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleMarkAsPaid = () => {
    toast({
      title: "Invoice Marked as Paid",
      description: `Invoice ${invoice?.invoiceNumber} has been marked as paid.`,
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoice?.invoiceNumber} has been sent to ${invoice?.client.email}.`,
    });
  };

  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Invoice Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The invoice you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            Return to Invoices
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Invoice {invoice.invoiceNumber}</h2>
            <p className="text-muted-foreground">
              Created on {formatDate(invoice.date)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/invoices")}>
              Back to Invoices
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {invoice.status === "pending" && (
              <>
                <Button variant="outline" onClick={handleSendInvoice}>
                  <MailOpen className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button onClick={handleMarkAsPaid}>Mark as Paid</Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={invoice.status} className="text-sm px-3 py-1" />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-medium">{invoice.client.name}</p>
              {invoice.client.company && <p>{invoice.client.company}</p>}
              <p>{invoice.client.email}</p>
              {invoice.client.phone && <p>{invoice.client.phone}</p>}
              {invoice.client.address && <p className="text-sm">{invoice.client.address}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span>{formatCurrency(invoice.paid || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Balance</span>
                  <span className="font-medium">
                    {formatCurrency(invoice.total - (invoice.paid || 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.quantity * item.price)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {invoice.notes && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetail;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Plus, Trash } from "lucide-react";
import { clients } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { InvoiceItem } from "@/types";
import { Textarea } from "@/components/ui/textarea";

const generateInvoiceNumber = () => {
  const prefix = "INV";
  const randomNumbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${randomNumbers}`;
};

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [invoiceNumber] = useState(generateInvoiceNumber());
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10)
  );
  const [items, setItems] = useState<
    Array<InvoiceItem & { total: number }>
  >([
    {
      id: "item-1",
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ]);
  const [notes, setNotes] = useState("");

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${items.length + 1}`,
        description: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: "description" | "quantity" | "price",
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.total = updatedItem.quantity * updatedItem.price;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const handleCreateInvoice = () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    if (items.some((item) => !item.description)) {
      toast({
        title: "Error",
        description: "All items must have a description",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceNumber} has been created successfully.`,
    });
    navigate("/invoices");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Create New Invoice</h2>
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            Cancel
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company ? `(${client.company})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedClientId && (
            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
              </CardHeader>
              <CardContent>
                {clients
                  .filter((client) => client.id === selectedClientId)
                  .map((client) => (
                    <div key={client.id} className="space-y-2">
                      <p className="font-medium">{client.name}</p>
                      {client.company && <p>{client.company}</p>}
                      <p>{client.email}</p>
                      {client.phone && <p>{client.phone}</p>}
                      {client.address && <p className="text-sm">{client.address}</p>}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[150px]">Price</TableHead>
                  <TableHead className="w-[150px]">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(item.total)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(calculateTotal())}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-6">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes to your invoice"
                className="mt-1"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/invoices")}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={handleCreateInvoice}>Create Invoice</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateInvoice;

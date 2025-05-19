
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Calendar, FileText } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { invoices, invoiceStatistics } from "@/lib/mockData";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatusBadge from "@/components/ui/status-badge";
import StatCard from "@/components/ui/stat-card";

const Dashboard = () => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const chartData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 3200 },
    { name: "Apr", total: 4900 },
    { name: "May", total: 2800 },
  ];

  const recentInvoices = invoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Collected"
            value={formatCurrency(invoiceStatistics.totalPaid)}
            icon={<Calculator className="h-4 w-4" />}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Pending"
            value={formatCurrency(invoiceStatistics.totalPending)}
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 5, positive: false }}
          />
          <StatCard
            title="Total Invoices"
            value={invoiceStatistics.totalInvoices}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Overdue"
            value={formatCurrency(invoiceStatistics.totalOverdue)}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between border-b pb-2 last:border-none"
                  >
                    <div>
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="font-medium hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {invoice.client.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.total)}</p>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/invoices"
                  className="text-sm text-primary hover:underline"
                >
                  View all invoices
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

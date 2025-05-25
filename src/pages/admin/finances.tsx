"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { DatePickerWithRange } from "../../components/date-range-picker"
import { LineChart } from "../../components/charts"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useToast } from "../../hooks/use-toast"
import { DollarSign, CreditCard, FileText, Download, Filter, Search, ArrowUpDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

export default function AdminFinancesPage() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  //  const handleSetDate = (range: DateRange | undefined) => {
  //      setDateRange(range);
  //  };

  // Mock revenue data for chart
  const revenueData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
    { name: "Aug", value: 2490 },
    { name: "Sep", value: 4490 },
    { name: "Oct", value: 5490 },
    { name: "Nov", value: 3490 },
    { name: "Dec", value: 6490 },
  ]

  // Mock transactions data
  const transactions = [
    {
      id: "INV-001",
      tenant: "Abay Bus",
      amount: 1250.0,
      status: "paid",
      date: "2023-05-15",
      type: "Subscription",
    },
    {
      id: "INV-002",
      tenant: "Selam Bus",
      amount: 950.0,
      status: "paid",
      date: "2023-05-14",
      type: "Subscription",
    },
    {
      id: "INV-003",
      tenant: "Ethio Bus",
      amount: 1500.0,
      status: "pending",
      date: "2023-05-13",
      type: "Subscription",
    },
    {
      id: "INV-004",
      tenant: "Habesha Bus",
      amount: 750.0,
      status: "paid",
      date: "2023-05-12",
      type: "API Usage",
    },
    {
      id: "INV-005",
      tenant: "Golden Bus",
      amount: 2000.0,
      status: "overdue",
      date: "2023-05-10",
      type: "Subscription",
    },
    {
      id: "INV-006",
      tenant: "Sky Bus",
      amount: 1100.0,
      status: "paid",
      date: "2023-05-09",
      type: "API Usage",
    },
  ]

  // Mock invoices data
  const invoices = [
    {
      id: "INV-001",
      tenant: "Abay Bus",
      amount: 1250.0,
      status: "paid",
      date: "2023-05-15",
      dueDate: "2023-06-15",
    },
    {
      id: "INV-002",
      tenant: "Selam Bus",
      amount: 950.0,
      status: "paid",
      date: "2023-05-14",
      dueDate: "2023-06-14",
    },
    {
      id: "INV-003",
      tenant: "Ethio Bus",
      amount: 1500.0,
      status: "pending",
      date: "2023-05-13",
      dueDate: "2023-06-13",
    },
    {
      id: "INV-004",
      tenant: "Habesha Bus",
      amount: 750.0,
      status: "paid",
      date: "2023-05-12",
      dueDate: "2023-06-12",
    },
    {
      id: "INV-005",
      tenant: "Golden Bus",
      amount: 2000.0,
      status: "overdue",
      date: "2023-05-10",
      dueDate: "2023-06-10",
    },
    {
      id: "INV-006",
      tenant: "Sky Bus",
      amount: 1100.0,
      status: "paid",
      date: "2023-05-09",
      dueDate: "2023-06-09",
    },
  ]

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice ${id} has been downloaded.`,
    })
  }

  const handleSendReminder = (id: string) => {
    toast({
      title: "Reminder sent",
      description: `Payment reminder for invoice ${id} has been sent.`,
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Finances</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$6,500.00</div>
              <p className="text-xs text-muted-foreground">4 invoices pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,000.00</div>
              <p className="text-xs text-muted-foreground">1 invoice overdue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue across all tenants</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart data={revenueData} xAxisKey="name" yAxisKey="value" height={350} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Tenant</CardTitle>
                  <CardDescription>Top revenue generating tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Abay Bus</TableCell>
                        <TableCell className="text-right">$12,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Selam Bus</TableCell>
                        <TableCell className="text-right">$9,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ethio Bus</TableCell>
                        <TableCell className="text-right">$7,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Habesha Bus</TableCell>
                        <TableCell className="text-right">$6,750.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Golden Bus</TableCell>
                        <TableCell className="text-right">$5,000.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Type</CardTitle>
                  <CardDescription>Revenue breakdown by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Subscriptions</TableCell>
                        <TableCell className="text-right">$35,000.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>API Usage</TableCell>
                        <TableCell className="text-right">$7,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>One-time Fees</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Support Contracts</TableCell>
                        <TableCell className="text-right">$1,750.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other</TableCell>
                        <TableCell className="text-right">$500.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View and manage all financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search transactions..." className="max-w-sm" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.tenant}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "paid"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 6 of 42 transactions</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage and track all invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search invoices..." className="max-w-sm" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      New Invoice
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Invoice
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.tenant}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "default"
                                : invoice.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            {invoice.status !== "paid" && (
                              <Button variant="outline" size="sm" onClick={() => handleSendReminder(invoice.id)}>
                                Send Reminder
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 6 of 24 invoices</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

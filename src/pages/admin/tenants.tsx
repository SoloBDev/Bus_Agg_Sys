"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  CheckCircle,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";

// Mock data for tenants
const tenants = [
  {
    id: "1",
    name: "Abay Bus",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    routes: 12,
    buses: 24,
    revenue: "ETB 1,234,567",
    joinDate: "Jan 15, 2023",
    contact: "info@abaybus.com",
    admin: "John Doe",
  },
  {
    id: "2",
    name: "Selam Bus",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    routes: 8,
    buses: 16,
    revenue: "ETB 987,654",
    joinDate: "Mar 22, 2023",
    contact: "info@selambus.com",
    admin: "Jane Smith",
  },
  {
    id: "3",
    name: "Ethio Bus",
    logo: "/placeholder.svg?height=40&width=40",
    status: "pending",
    routes: 5,
    buses: 10,
    revenue: "ETB 543,210",
    joinDate: "May 10, 2023",
    contact: "info@ethiobus.com",
    admin: "Abebe Kebede",
  },
  {
    id: "4",
    name: "Habesha Bus",
    logo: "/placeholder.svg?height=40&width=40",
    status: "suspended",
    routes: 0,
    buses: 8,
    revenue: "ETB 321,098",
    joinDate: "Jul 5, 2023",
    contact: "info@habeshabus.com",
    admin: "Sara Tesfaye",
  },
  {
    id: "5",
    name: "Addis Bus",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    routes: 15,
    buses: 30,
    revenue: "ETB 1,876,543",
    joinDate: "Sep 18, 2023",
    contact: "info@addisbus.com",
    admin: "Daniel Alemu",
  },
];

// Pending approval requests
const pendingRequests = [
  {
    id: "101",
    name: "Gondar Express",
    logo: "/placeholder.svg?height=40&width=40",
    requestDate: "May 15, 2025",
    contact: "info@gondarexpress.com",
    admin: "Henok Girma",
    buses: 12,
  },
  {
    id: "102",
    name: "Bahir Dar Transit",
    logo: "/placeholder.svg?height=40&width=40",
    requestDate: "May 14, 2025",
    contact: "info@bahirdartransit.com",
    admin: "Tigist Haile",
    buses: 8,
  },
];

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<
    (typeof tenants)[0] | null
  >(null);
  const [isTenantDetailsOpen, setIsTenantDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Filter tenants based on search query and status
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.admin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant);
    setIsTenantDetailsOpen(true);
  };

  const handleStatusChange = (tenantId: string, newStatus: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Status updated",
      description: `Tenant status has been updated to ${newStatus}`,
    });
  };

  const handleApproveTenant = (requestId: string) => {
    toast({
      title: "Tenant approved",
      description: "The tenant has been approved and notified",
    });
  };

  const handleRejectTenant = (requestId: string) => {
    toast({
      title: "Tenant rejected",
      description: "The tenant has been rejected and notified",
    });
  };

  return (
    <>
      <div className='flex flex-col'>
        <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
          <div className='flex flex-1 items-center gap-4'>
            <h1 className='text-xl font-semibold'>Tenant Management</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Tenant
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Add New Tenant</DialogTitle>
                  <DialogDescription>
                    Create a new tenant account for a bus company.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='company-name'>Company Name</Label>
                    <Input id='company-name' placeholder='Enter company name' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='admin-name'>Admin Name</Label>
                    <Input id='admin-name' placeholder='Enter admin name' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter email address'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input id='phone' placeholder='Enter phone number' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='buses'>Number of Buses</Label>
                    <Input
                      id='buses'
                      type='number'
                      placeholder='Enter number of buses'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddTenantOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddTenantOpen(false);
                      toast({
                        title: "Tenant created",
                        description: "New tenant has been created successfully",
                      });
                    }}
                  >
                    Create Tenant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
          <Tabs defaultValue='all-tenants' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='all-tenants'>All Tenants</TabsTrigger>
              <TabsTrigger value='pending-approval'>
                Pending Approval
                {pendingRequests.length > 0 && (
                  <Badge
                    variant='outline'
                    className='ml-2 bg-yellow-500/10 text-yellow-500'
                  >
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='all-tenants' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Manage Tenants</CardTitle>
                  <CardDescription>
                    View and manage all tenant bus companies in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='relative w-full max-w-sm'>
                      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                      <Input
                        type='search'
                        placeholder='Search tenants...'
                        className='pl-8'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Filter by status' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Statuses</SelectItem>
                          <SelectItem value='active'>Active</SelectItem>
                          <SelectItem value='pending'>Pending</SelectItem>
                          <SelectItem value='suspended'>Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant='outline' size='icon'>
                        <SlidersHorizontal className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='icon'>
                        <Download className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Routes</TableHead>
                          <TableHead>Buses</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTenants.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='text-center py-8 text-muted-foreground'
                            >
                              No tenants found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTenants.map((tenant) => (
                            <TableRow key={tenant.id}>
                              <TableCell>
                                <div className='flex items-center gap-3'>
                                  <Avatar>
                                    <AvatarImage
                                      src={tenant.logo || "/placeholder.svg"}
                                      alt={tenant.name}
                                    />
                                    <AvatarFallback>
                                      {tenant.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className='font-medium'>
                                      {tenant.name}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                      {tenant.contact}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className={
                                    tenant.status === "active"
                                      ? "bg-green-500/10 text-green-500"
                                      : tenant.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : "bg-red-500/10 text-red-500"
                                  }
                                >
                                  {tenant.status.charAt(0).toUpperCase() +
                                    tenant.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{tenant.routes}</TableCell>
                              <TableCell>{tenant.buses}</TableCell>
                              <TableCell>{tenant.revenue}</TableCell>
                              <TableCell>{tenant.joinDate}</TableCell>
                              <TableCell className='text-right'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon'>
                                      <MoreHorizontal className='h-4 w-4' />
                                      <span className='sr-only'>Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>

                                    <DropdownMenuItem
                                      {...({
                                        onSelect: () =>
                                          handleViewDetails(tenant),
                                      } as React.ComponentProps<
                                        typeof DropdownMenuItem
                                      >)}
                                    >
                                      View details
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    {tenant.status !== "active" && (
                                      <DropdownMenuItem
                                        {...({
                                          onSelect: () =>
                                            handleStatusChange(
                                              tenant.id,
                                              "active"
                                            ),
                                        } as React.ComponentProps<
                                          typeof DropdownMenuItem
                                        >)}
                                      >
                                        Activate tenant
                                      </DropdownMenuItem>
                                    )}

                                    {tenant.status !== "suspended" && (
                                      <DropdownMenuItem
                                        {...({
                                          onSelect: () =>
                                            handleStatusChange(
                                              tenant.id,
                                              "suspended"
                                            ),
                                        } as React.ComponentProps<
                                          typeof DropdownMenuItem
                                        >)}
                                      >
                                        Suspend tenant
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      {...({
                                        className: "text-red-600",
                                        onSelect: () =>
                                          handleRejectTenant(tenant.id),
                                      } as React.ComponentProps<
                                        typeof DropdownMenuItem
                                      >)}
                                    >
                                      Delete tenant
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    Showing <strong>{filteredTenants.length}</strong> of{" "}
                    <strong>{tenants.length}</strong> tenants
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' disabled>
                      Previous
                    </Button>
                    <Button variant='outline' size='sm'>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='pending-approval' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Pending Approval Requests</CardTitle>
                  <CardDescription>
                    Review and approve new tenant registration requests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                      <CheckCircle className='h-12 w-12 text-green-500 mb-4' />
                      <h3 className='text-lg font-medium'>
                        No pending requests
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1'>
                        All tenant registration requests have been processed.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {pendingRequests.map((request) => (
                        <Card key={request.id}>
                          <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-4'>
                                <Avatar className='h-12 w-12'>
                                  <AvatarImage
                                    src={request.logo || "/placeholder.svg"}
                                    alt={request.name}
                                  />
                                  <AvatarFallback>
                                    {request.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className='font-medium'>
                                    {request.name}
                                  </h3>
                                  <p className='text-sm text-muted-foreground'>
                                    Requested on {request.requestDate}
                                  </p>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-red-600'
                                  onClick={() => handleRejectTenant(request.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    handleApproveTenant(request.id)
                                  }
                                >
                                  Approve
                                </Button>
                              </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                              <div>
                                <p className='text-sm font-medium'>Admin</p>
                                <p className='text-sm text-muted-foreground'>
                                  {request.admin}
                                </p>
                              </div>
                              <div>
                                <p className='text-sm font-medium'>Contact</p>
                                <p className='text-sm text-muted-foreground'>
                                  {request.contact}
                                </p>
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  Fleet Size
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {request.buses} buses
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Tenant Details Dialog */}
      <Dialog open={isTenantDetailsOpen} onOpenChange={setIsTenantDetailsOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage
                    src={selectedTenant.logo || "/placeholder.svg"}
                    alt={selectedTenant.name}
                  />
                  <AvatarFallback>
                    {selectedTenant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-xl font-bold'>{selectedTenant.name}</h2>
                  <p className='text-muted-foreground'>
                    {selectedTenant.contact}
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className={
                    selectedTenant.status === "active"
                      ? "bg-green-500/10 text-green-500 ml-auto"
                      : selectedTenant.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-500 ml-auto"
                      : "bg-red-500/10 text-red-500 ml-auto"
                  }
                >
                  {selectedTenant.status.charAt(0).toUpperCase() +
                    selectedTenant.status.slice(1)}
                </Badge>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Admin
                  </h3>
                  <p>{selectedTenant.admin}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Join Date
                  </h3>
                  <p>{selectedTenant.joinDate}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Routes
                  </h3>
                  <p>{selectedTenant.routes}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Buses
                  </h3>
                  <p>{selectedTenant.buses}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Revenue
                  </h3>
                  <p>{selectedTenant.revenue}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Status
                  </h3>
                  <Select
                    defaultValue={selectedTenant.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedTenant.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='border-t pt-4'>
                <h3 className='font-medium mb-2'>Actions</h3>
                <div className='flex gap-2'>
                  <Button variant='outline' className='flex-1'>
                    View Analytics
                  </Button>
                  <Button variant='outline' className='flex-1'>
                    Message Admin
                  </Button>
                  <Button variant='destructive' className='flex-1'>
                    Delete Tenant
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

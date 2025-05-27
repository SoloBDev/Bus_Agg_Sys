"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Download,
  MoreHorizontal,
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
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTenantStore, type Tenant } from "@/lib/tenant-store";
import { Skeleton } from "@/components/ui/skeleton";

interface TenantsPageProps {
  activeTab?: string;
}

const LoadingRow = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[30px] ml-auto" /></TableCell>
  </TableRow>
);

export default function TenantsPage({
  activeTab = "all-tenants",
}: TenantsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isTenantDetailsOpen, setIsTenantDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);
  const { toast } = useToast();

  const {
    isLoading,
    error,
    tenants,
    approveTenant,
    fetchTenants,
    rejectTenant,
    suspendTenant,
    deleteTenant,
    getPendingTenants,
    getActiveTenants,
    getSuspendedTenants,
  } = useTenantStore();

  const pendingTenants = getPendingTenants();
  const activeTenants = getActiveTenants();
  const suspendedTenants = getSuspendedTenants();

  // Filter tenants based on search query and status
  const getFilteredTenants = () => {
    let tenantsToFilter = tenants;

    if (currentTab === "approved") {
      tenantsToFilter = activeTenants;
    } else if (currentTab === "pending-approval") {
      tenantsToFilter = pendingTenants;
    } else if (currentTab === "suspended") {
      tenantsToFilter = suspendedTenants;
    }

    return tenantsToFilter.filter((tenant) => {
      const matchesSearch =
        tenant.busBrandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.operatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredTenants = getFilteredTenants();

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsTenantDetailsOpen(true);
  };

  const handleApproveTenant = (tenantId: string) => {
    approveTenant(tenantId);
    toast({
      title: "Tenant approved",
      description: "The tenant has been approved and activated",
    });
  };

  const handleRejectTenant = (tenantId: string) => {
    rejectTenant(tenantId);
    toast({
      title: "Tenant rejected",
      description: "The tenant has been rejected and suspended",
    });
  };

  const handleSuspendTenant = (tenantId: string) => {
    suspendTenant(tenantId);
    toast({
      title: "Tenant suspended",
      description: "The tenant has been suspended",
    });
  };

  const handleDeleteTenant = (tenantId: string) => {
    deleteTenant(tenantId);
    toast({
      title: "Tenant deleted",
      description: "The tenant has been permanently deleted",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);



  return (
    <>
      <div className='flex flex-col'>
        <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
          <div className='flex flex-1 items-center gap-4'>
            <h1 className='text-xl font-semibold'>Tenant Management</h1>
          </div>
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className='space-y-4'
          >
            <TabsList>
              <TabsTrigger value='all-tenants'>
                All Tenants
                <Badge variant='outline' className='ml-2'>
                  {tenants.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='approved'>
                Approved
                <Badge
                  variant='outline'
                  className='ml-2 bg-green-500/10 text-green-500'
                >
                  {activeTenants.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='pending-approval'>
                Pending Approval
                {pendingTenants.length > 0 && (
                  <Badge
                    variant='outline'
                    className='ml-2 bg-yellow-500/10 text-yellow-500'
                  >
                    {pendingTenants.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value='suspended'>
                Suspended
                {suspendedTenants.length > 0 && (
                  <Badge
                    variant='outline'
                    className='ml-2 bg-red-500/10 text-red-500'
                  >
                    {suspendedTenants.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='all-tenants' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>All Tenants</CardTitle>
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
                          <TableHead>Buses</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <>
                            <LoadingRow />
                            <LoadingRow />
                            <LoadingRow />
                            <LoadingRow />
                            <LoadingRow />
                          </>
                        ) : error ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className='text-center py-8 text-red-500'
                            >
                              Error loading tenants: {error}
                            </TableCell>
                          </TableRow>
                        ) : filteredTenants.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
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
                                      alt={tenant.busBrandName}
                                    />
                                    <AvatarFallback>
                                      {tenant.busBrandName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className='font-medium'>
                                      {tenant.busBrandName}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                      {tenant.contactEmail}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className={getStatusBadge(tenant.status)}
                                >
                                  {tenant.status.charAt(0).toUpperCase() +
                                    tenant.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{tenant.numBuses}</TableCell>
                              <TableCell>{tenant.totalRevenue}</TableCell>
                              <TableCell>{tenant.joinDate || "N/A"}</TableCell>
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
                                      onClick={() => handleViewDetails(tenant)}
                                    >
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {tenant.status === "pending" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleApproveTenant(tenant.id)
                                          }
                                        >
                                          Approve tenant
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRejectTenant(tenant.id)
                                          }
                                        >
                                          Reject tenant
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {tenant.status === "active" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleSuspendTenant(tenant.id)
                                        }
                                      >
                                        Suspend tenant
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className='text-red-600'
                                      onClick={() =>
                                        handleDeleteTenant(tenant.id)
                                      }
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
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='approved' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Approved Tenants</CardTitle>
                  <CardDescription>
                    Active tenant bus companies with full access.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Buses</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Operators</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeTenants.map((tenant) => (
                          <TableRow key={tenant.id}>
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                <Avatar>
                                  <AvatarImage
                                    src={tenant.logo || "/placeholder.svg"}
                                    alt={tenant.busBrandName}
                                  />
                                  <AvatarFallback>
                                    {tenant.busBrandName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-medium'>
                                    {tenant.busBrandName}
                                  </div>
                                  <div className='text-sm text-muted-foreground'>
                                    {tenant.operatorName}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{tenant.numBuses}</TableCell>
                            <TableCell>{tenant.totalRevenue}</TableCell>
                            <TableCell>{tenant.operators}</TableCell>
                            <TableCell className='text-right'>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='icon'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetails(tenant)}
                                  >
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSuspendTenant(tenant.id)
                                    }
                                  >
                                    Suspend tenant
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className='text-red-600'
                                    onClick={() =>
                                      handleDeleteTenant(tenant.id)
                                    }
                                  >
                                    Delete tenant
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='pending-approval' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>
                    {" "}
                    {pendingTenants.length} tenant(s) awaiting review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingTenants.length === 0 ? (
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
                      {pendingTenants.map((tenant) => (
                        <Card key={tenant.id}>
                          <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-4'>
                                <Avatar className='h-12 w-12'>
                                  <AvatarImage
                                    src={tenant.logo || "/placeholder.svg"}
                                    alt={tenant.busBrandName}
                                  />
                                  <AvatarFallback>
                                    {tenant.busBrandName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className='font-medium'>
                                    {tenant.busBrandName}
                                  </h3>
                                  <p className='text-sm text-muted-foreground'>
                                    Registered on {tenant.registrationDate}
                                  </p>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Button
                                  size='sm'
                                  onClick={() => handleApproveTenant(tenant.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-red-600'
                                  onClick={() => handleRejectTenant(tenant.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                              <div>
                                <p className='text-sm font-medium'>Admin</p>
                                <p className='text-sm text-muted-foreground'>
                                  {tenant.operatorName}
                                </p>
                              </div>
                              <div>
                                <p className='text-sm font-medium'>Contact</p>
                                <p className='text-sm text-muted-foreground'>
                                  {tenant.contactEmail}
                                </p>
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  TIN Number
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {tenant.tinNumber}
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

            <TabsContent value='suspended' className='space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Suspended Tenants</CardTitle>
                  <CardDescription>
                    Tenants that have been suspended or rejected.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {suspendedTenants.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                      <CheckCircle className='h-12 w-12 text-green-500 mb-4' />
                      <h3 className='text-lg font-medium'>
                        No suspended tenants
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1'>
                        All tenants are currently active or pending.
                      </p>
                    </div>
                  ) : (
                    <div className='rounded-md border'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Suspension Date</TableHead>
                            <TableHead className='text-right'>
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {suspendedTenants.map((tenant) => (
                            <TableRow key={tenant.id}>
                              <TableCell>
                                <div className='flex items-center gap-3'>
                                  <Avatar>
                                    <AvatarImage
                                      src={tenant.logo || "/placeholder.svg"}
                                      alt={tenant.busBrandName}
                                    />
                                    <AvatarFallback>
                                      {tenant.busBrandName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className='font-medium'>
                                      {tenant.busBrandName}
                                    </div>
                                    <Badge
                                      variant='outline'
                                      className='bg-red-500/10 text-red-500'
                                    >
                                      Suspended
                                    </Badge>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{tenant.operatorName}</TableCell>
                              <TableCell>{tenant.contactEmail}</TableCell>
                              <TableCell>{tenant.registrationDate}</TableCell>
                              <TableCell className='text-right'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon'>
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                      onClick={() => handleViewDetails(tenant)}
                                    >
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className='text-red-600'
                                      onClick={() =>
                                        handleDeleteTenant(tenant.id)
                                      }
                                    >
                                      Delete tenant
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Tenant Details Dialog */}
      {/* { isLoading &&(
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>Loading tenants...</p>
      </div>
    )
    }
      {error && (
        <div className='flex items-center justify-center h-full'>
          <p className='text-red-600'>{error}</p>
        </div>
      )} */}
      {
        <Dialog
          open={isTenantDetailsOpen}
          onOpenChange={setIsTenantDetailsOpen}
        >
          <DialogContent className='sm:max-w-[600px]'>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-8 w-[200px]' />
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-16 w-16 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-[180px]' />
                    <Skeleton className='h-4 w-[120px]' />
                  </div>
                  <Skeleton className='h-6 w-[80px] ml-auto' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <Skeleton className='h-4 w-[80px]' />
                      <Skeleton className='h-4 w-[120px]' />
                    </div>
                  ))}
                </div>
                <div className='flex gap-2 pt-4'>
                  <Skeleton className='h-10 flex-1' />
                  <Skeleton className='h-10 flex-1' />
                </div>
              </div>
            ) : error ? (
              <div className='text-red-500'>Error: {error}</div>
            ) : selectedTenant ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarImage
                      src={selectedTenant.logo || "/placeholder.svg"}
                      alt={selectedTenant.busBrandName}
                    />
                    <AvatarFallback>
                      {selectedTenant.busBrandName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className='text-xl font-bold'>
                      {selectedTenant.busBrandName}
                    </h2>
                    <p className='text-muted-foreground'>
                      {selectedTenant.contactEmail}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className={`${getStatusBadge(
                      selectedTenant.status
                    )} ml-auto`}
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
                    <p>{selectedTenant.operatorName}</p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Registration Date
                    </h3>
                    <p>{selectedTenant.registrationDate}</p>
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
                    <p>{selectedTenant.numBuses}</p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Revenue
                    </h3>
                    <p>{selectedTenant.totalRevenue}</p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Operators
                    </h3>
                    <p>{selectedTenant.operators}</p>
                  </div>
                </div>

                <div className='border-t pt-4'>
                  <h3 className='font-medium mb-2'>Actions</h3>
                  <div className='flex gap-2'>
                    {selectedTenant.status === "pending" && (
                      <>
                        <Button
                          variant='default'
                          className='flex-1'
                          onClick={() => {
                            handleApproveTenant(selectedTenant.id);
                            setIsTenantDetailsOpen(false);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant='outline'
                          className='flex-1'
                          onClick={() => {
                            handleRejectTenant(selectedTenant.id);
                            setIsTenantDetailsOpen(false);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {selectedTenant.status === "active" && (
                      <Button
                        variant='outline'
                        className='flex-1'
                        onClick={() => {
                          handleSuspendTenant(selectedTenant.id);
                          setIsTenantDetailsOpen(false);
                        }}
                      >
                        Suspend
                      </Button>
                    )}
                    <Button
                      variant='destructive'
                      className='flex-1'
                      onClick={() => {
                        handleDeleteTenant(selectedTenant.id);
                        setIsTenantDetailsOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      }
    </>
  );
}

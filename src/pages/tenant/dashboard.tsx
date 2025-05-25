"use client";

import { DashboardChart } from "@/components/dashboard-chart";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { UserPlusIcon, UsersIcon, UserXIcon, WalletIcon } from "lucide-react";
import { RecentTransactions } from "@/components/recent-transactions";

// Mock data structure
type DashboardData = {
  daily: {
    newUsers: number;
    totalUsers: number;
    transactions: number;
    nonUsers: number;
    changeFromYesterday: {
      newUsers: string;
      totalUsers: string;
      transactions: string;
      nonUsers: string;
    };
  };
  weekly: {
    newUsers: number;
    totalUsers: number;
    transactions: number;
    nonUsers: number;
    changeFromLastWeek: {
      newUsers: string;
      totalUsers: string;
      transactions: string;
      nonUsers: string;
    };
  };
  monthly: {
    newUsers: number;
    totalUsers: number;
    transactions: number;
    nonUsers: number;
    changeFromLastMonth: {
      newUsers: string;
      totalUsers: string;
      transactions: string;
      nonUsers: string;
    };
  };
  recentTransactions: {
    id: string;
    user: string;
    amount: number;
    status: "completed" | "pending" | "failed";
    date: string;
  }[];
  chartData: {
    day: string;
    transactions: number;
  }[];
};

// Mock data generator
const generateMockData = (): DashboardData => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  // Generate chart data for the current month
  const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: `${i + 1}/${now.getMonth() + 1}`,
    transactions: Math.floor(Math.random() * 1000) + 500,
  }));

  return {
    daily: {
      newUsers: Math.floor(Math.random() * 50) + 10,
      totalUsers: Math.floor(Math.random() * 1000) + 1200,
      transactions: Math.floor(Math.random() * 20000) + 10000,
      nonUsers: Math.floor(Math.random() * 100) + 300,
      changeFromYesterday: {
        newUsers: `${Math.floor(Math.random() * 20) + 5}%`,
        totalUsers: `${Math.floor(Math.random() * 5) + 1}%`,
        transactions: `${Math.floor(Math.random() * 30) + 10}%`,
        nonUsers: `-${Math.floor(Math.random() * 10) + 1}%`,
      },
    },
    weekly: {
      newUsers: Math.floor(Math.random() * 200) + 100,
      totalUsers: Math.floor(Math.random() * 1000) + 1200,
      transactions: Math.floor(Math.random() * 80000) + 50000,
      nonUsers: Math.floor(Math.random() * 100) + 300,
      changeFromLastWeek: {
        newUsers: `${Math.floor(Math.random() * 15) + 5}%`,
        totalUsers: `${Math.floor(Math.random() * 5) + 1}%`,
        transactions: `${Math.floor(Math.random() * 25) + 5}%`,
        nonUsers: `-${Math.floor(Math.random() * 10) + 1}%`,
      },
    },
    monthly: {
      newUsers: Math.floor(Math.random() * 700) + 500,
      totalUsers: Math.floor(Math.random() * 1000) + 1200,
      transactions: Math.floor(Math.random() * 300000) + 250000,
      nonUsers: Math.floor(Math.random() * 100) + 300,
      changeFromLastMonth: {
        newUsers: `${Math.floor(Math.random() * 20) + 10}%`,
        totalUsers: `${Math.floor(Math.random() * 5) + 1}%`,
        transactions: `${Math.floor(Math.random() * 30) + 15}%`,
        nonUsers: `-${Math.floor(Math.random() * 10) + 1}%`,
      },
    },
    recentTransactions: [
      {
        id: "1",
        user: "John Doe",
        amount: 1250,
        status: "completed",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        user: "Jane Smith",
        amount: 750,
        status: "completed",
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        user: "Robert Johnson",
        amount: 1500,
        status: "pending",
        date: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "4",
        user: "Emily Davis",
        amount: 500,
        status: "failed",
        date: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "5",
        user: "Michael Wilson",
        amount: 2000,
        status: "completed",
        date: new Date(Date.now() - 345600000).toISOString(),
      },
    ],
    chartData,
  };
};

export default function TenantDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = generateMockData();
      setData(mockData);
      setLoading(false);
    };

    fetchData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4 h-80 bg-gray-200 rounded animate-pulse" />
          <div className="lg:col-span-3 h-80 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className='w-[100%] flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
          Dashboard
        </h1>
        <p className='text-muted-foreground'>
          Overview of your platform statistics and performance.
        </p>
      </div>

      <Tabs defaultValue='daily' className='space-y-4' onValueChange={(value) => setActiveTab(value as "daily" | "weekly" | "monthly")}>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='daily' className="!bg-transparent">Daily</TabsTrigger>
            <TabsTrigger value='weekly' className="!bg-transparent">Weekly</TabsTrigger>
            <TabsTrigger value='monthly' className="!bg-transparent">Monthly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='daily' className='space-y-4'>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  New Users Today
                </CardTitle>
                <UserPlusIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.daily.newUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.daily.changeFromYesterday.newUsers} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Users
                </CardTitle>
                <UsersIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.daily.totalUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.daily.changeFromYesterday.totalUsers} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Transactions Today
                </CardTitle>
                <WalletIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>R {data.daily.transactions.toLocaleString()}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.daily.changeFromYesterday.transactions} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Non-Users</CardTitle>
                <UserXIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.daily.nonUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.daily.changeFromYesterday.nonUsers} from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='weekly' className='space-y-4'>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  New Users This Week
                </CardTitle>
                <UserPlusIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.weekly.newUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.weekly.changeFromLastWeek.newUsers} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Users
                </CardTitle>
                <UsersIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.weekly.totalUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.weekly.changeFromLastWeek.totalUsers} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Transactions This Week
                </CardTitle>
                <WalletIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>R {data.weekly.transactions.toLocaleString()}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.weekly.changeFromLastWeek.transactions} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Non-Users</CardTitle>
                <UserXIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.weekly.nonUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.weekly.changeFromLastWeek.nonUsers} from last week
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='monthly' className='space-y-4'>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  New Users This Month
                </CardTitle>
                <UserPlusIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.monthly.newUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.monthly.changeFromLastMonth.newUsers} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Users
                </CardTitle>
                <UsersIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.monthly.totalUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.monthly.changeFromLastMonth.totalUsers} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Transactions This Month
                </CardTitle>
                <WalletIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>R {data.monthly.transactions.toLocaleString()}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.monthly.changeFromLastMonth.transactions} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Non-Users</CardTitle>
                <UserXIcon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.monthly.nonUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  {data.monthly.changeFromLastMonth.nonUsers} from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className='grid gap-4 grid-cols-1 lg:grid-cols-7'>
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Transaction volume over time</CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <DashboardChart data={data.chartData} timeframe={activeTab} />
          </CardContent>
        </Card>

        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest transactions on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={data.recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
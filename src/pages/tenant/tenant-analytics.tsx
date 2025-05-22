"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DevicesChart } from "@/components/devices-chart";
import { MainChart } from "@/components/main-chart";
import { SourcesChart } from "@/components/sources-chart";
import { DatePickerWithRange } from "@/components/date-range-picker";
import type { DateRange } from "react-day-picker";

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  

  return (
    <div className='flex min-h-screen bg-background'>
        {/* Dashboard content */}
        <div className='p-6 space-y-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h1 className='text-2xl font-semibold'>Analytics</h1>
            <DatePickerWithRange 
              date={dateRange} setDate={setDateRange}
            />
          </div>

          {/* Stats cards */}
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <DollarSign className='h-4 w-4 text-primary-foreground  ' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>$45,231.89</div>
                <p className='text-xs text-muted-foreground'>
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Subscriptions
                </CardTitle>
                <Users className='h-4 w-4 text-primary-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+2350</div>
                <p className='text-xs text-muted-foreground'>
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                <CreditCard className='h-4 w-4 text-primary-foreground ' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+12,234</div>
                <p className='text-xs text-muted-foreground'>
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Now
                </CardTitle>
                <Users className='h-4 w-4 text-primary-foreground ' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+573</div>
                <p className='text-xs text-muted-foreground'>
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main chart */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your analytics data across all platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MainChart />
            </CardContent>
          </Card>

          {/* Bottom charts */}
          <div className='grid gap-6 md:grid-cols-2 !mt-4'>
            <Card className='!mt-14'> 
              <CardHeader>
                <CardTitle>Top Sources</CardTitle>
                <CardDescription>
                  Your top traffic sources for this period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SourcesChart />
              </CardContent>
            </Card>
            <Card className='!mt-14'>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>
                  Distribution of users by device type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DevicesChart />
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { BarChart, LineChart } from "../../components/charts"
import { DatePickerWithRange } from "../../components/date-range-picker"
import { Sidebar } from "../../components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Users, Activity, TrendingUp, Clock } from "lucide-react"
import type { DateRange } from "react-day-picker"

export default function AdminAnalyticsPage() {
   const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

   const handleSetDate = (range: DateRange | undefined) => {
       setDateRange(range);
   };

  // Mock data for charts
  const userActivityData = [
    { name: "Mon", value: 2400 },
    { name: "Tue", value: 1398 },
    { name: "Wed", value: 9800 },
    { name: "Thu", value: 3908 },
    { name: "Fri", value: 4800 },
    { name: "Sat", value: 3800 },
    { name: "Sun", value: 4300 },
  ]

  const tenantComparisonData = [
    { name: "Abay Bus", users: 4000, revenue: 2400 },
    { name: "Selam Bus", users: 3000, revenue: 1398 },
    { name: "Ethio Bus", users: 2000, revenue: 9800 },
    { name: "Habesha Bus", users: 2780, revenue: 3908 },
    { name: "Golden Bus", users: 1890, revenue: 4800 },
    { name: "Sky Bus", users: 2390, revenue: 3800 },
  ]

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar children={undefined} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <div className="flex items-center space-x-2">
          <DatePickerWithRange date={dateRange} setDate={handleSetDate} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+7% from last hour</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily active users across the platform</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart data={userActivityData} xAxisKey="name" yAxisKey="value" height={350} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tenant Comparison</CardTitle>
                  <CardDescription>Users and revenue by tenant</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart
                    data={tenantComparisonData.map(tenant => ({ name: tenant.name, value: tenant.users }))}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={350}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Analytics</CardTitle>
                <CardDescription>Performance metrics for all tenants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {tenantComparisonData.map((tenant) => (
                    <div key={tenant.name} className="flex items-center">
                      <div className="w-1/4 font-medium">{tenant.name}</div>
                      <div className="w-3/4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">Users: {tenant.users}</div>
                          <div className="text-sm font-medium">Revenue: ${tenant.revenue}</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(tenant.revenue / 10000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user acquisition and retention</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={revenueData} xAxisKey="name" yAxisKey="value" height={350} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue across all tenants</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={revenueData} xAxisKey="name" yAxisKey="value" height={350} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { DashboardChart } from "@/components/dashboard-chart"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlusIcon, UsersIcon, UserXIcon, WalletIcon } from "lucide-react"
import { RecentTransactions } from "@/components/recent-transactions"
import { fetchDashboardData, type DashboardData, type Transaction } from "@/lib/dashboard-data"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"

export default function TenantDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily")
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [modalTransactions, setModalTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Simulate different tenant types - in real app this would come from auth/context
  const tenantId = "established_tenant_123" // Change to "new_tenant_123" or "enterprise_tenant_123" to test

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const dashboardData = await fetchDashboardData(tenantId)
        setData(dashboardData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 300000)
    return () => clearInterval(interval)
  }, [tenantId])

  const handleBarClick = (period: string) => {
    if (!data) return

    let transactions: Transaction[] = []

    if (activeTab === "daily") {
      transactions = data.detailedTransactions[period] || []
    } else if (activeTab === "weekly") {
      // For weekly, aggregate transactions from multiple days
      const weekNumber = Number.parseInt(period.split(" ")[1])
      const startDay = (weekNumber - 1) * 7 + 1
      const endDay = Math.min(weekNumber * 7, Object.keys(data.detailedTransactions).length)

      transactions = []
      for (let day = startDay; day <= endDay; day++) {
        const dayKey = `${day}/${new Date().getMonth() + 1}`
        if (data.detailedTransactions[dayKey]) {
          transactions.push(...data.detailedTransactions[dayKey])
        }
      }
    } else {
      // For monthly, show all transactions for that day
      transactions = data.detailedTransactions[period] || []
    }

    setModalTransactions(transactions)
    setSelectedPeriod(period)
    setIsModalOpen(true)
  }

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
    )
  }

  // Show different messaging for new tenants
  const isNewTenant = data.tenantType === "new"

  return (
    <div className="w-[100%] flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {isNewTenant
            ? "Welcome! Your platform statistics will appear here as you start getting users and transactions."
            : "Overview of your platform statistics and performance."}
        </p>
      </div>

      {isNewTenant && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-sm text-blue-700">
                Getting started: Your dashboard will populate with data as users begin using your platform.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs
        defaultValue="daily"
        className="space-y-4"
        onValueChange={(value) => setActiveTab(value as "daily" | "weekly" | "monthly")}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="daily" className="!bg-transparent">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="!bg-transparent">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="!bg-transparent">
              Monthly
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.daily.newUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.daily.changeFromYesterday.newUsers} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.daily.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.daily.changeFromYesterday.totalUsers} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R {data.daily.transactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {data.daily.changeFromYesterday.transactions} from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
                <UserXIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.daily.nonUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.daily.changeFromYesterday.nonUsers} from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.weekly.newUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.weekly.changeFromLastWeek.newUsers} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.weekly.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.weekly.changeFromLastWeek.totalUsers} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions This Week</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R {data.weekly.transactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {data.weekly.changeFromLastWeek.transactions} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
                <UserXIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.weekly.nonUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.weekly.changeFromLastWeek.nonUsers} from last week
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.monthly.newUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.monthly.changeFromLastMonth.newUsers} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.monthly.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.monthly.changeFromLastMonth.totalUsers} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions This Month</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R {data.monthly.transactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {data.monthly.changeFromLastMonth.transactions} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Non-Users</CardTitle>
                <UserXIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.monthly.nonUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.monthly.changeFromLastMonth.nonUsers} from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Transaction volume over time {!isNewTenant && "(click bars for details)"}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart data={data.chartData} timeframe={activeTab} onBarClick={handleBarClick} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              {isNewTenant ? "Recent transactions will appear here" : "Latest transactions on the platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentTransactions.length > 0 ? (
              <RecentTransactions transactions={data.recentTransactions} />
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">No transactions yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactions={modalTransactions}
        period={selectedPeriod || ""}
        timeframe={activeTab}
      />
    </div>
  )
}

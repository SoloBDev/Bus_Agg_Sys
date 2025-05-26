/* eslint-disable @typescript-eslint/no-explicit-any */
// Simulate different tenant types and realistic data
export type TenantType = "new" | "established" | "enterprise"

export interface Transaction {
  id: string
  user: string
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  type: "credit" | "debit"
}

export interface DashboardData {
  tenantType: TenantType
  daily: {
    newUsers: number
    totalUsers: number
    transactions: number
    nonUsers: number
    changeFromYesterday: {
      newUsers: string
      totalUsers: string
      transactions: string
      nonUsers: string
    }
  }
  weekly: {
    newUsers: number
    totalUsers: number
    transactions: number
    nonUsers: number
    changeFromLastWeek: {
      newUsers: string
      totalUsers: string
      transactions: string
      nonUsers: string
    }
  }
  monthly: {
    newUsers: number
    totalUsers: number
    transactions: number
    nonUsers: number
    changeFromLastMonth: {
      newUsers: string
      totalUsers: string
      transactions: string
      nonUsers: string
    }
  }
  recentTransactions: Transaction[]
  chartData: {
    day: string
    transactions: number
  }[]
  detailedTransactions: Record<string, Transaction[]>
}

const generateTransactions = (count: number, dateRange: { start: Date; end: Date }): Transaction[] => {
  const users = [
    "John Doe",
    "Jane Smith",
    "Robert Johnson",
    "Emily Davis",
    "Michael Wilson",
    "Sarah Brown",
    "David Lee",
    "Lisa Garcia",
    "James Martinez",
    "Maria Rodriguez",
    "Christopher Taylor",
    "Jennifer Anderson",
    "Matthew Thomas",
    "Ashley Jackson",
    "Joshua White",
    "Amanda Harris",
    "Andrew Martin",
    "Stephanie Thompson",
  ]

  const descriptions = [
    "Bus ticket purchase",
    "Monthly pass renewal",
    "Route subscription",
    "Premium service upgrade",
    "Refund processed",
    "Payment adjustment",
    "Service fee",
    "Loyalty reward",
    "Group booking",
    "Express service",
  ]

  return Array.from({ length: count }, (_, i) => {
    const randomDate = new Date(
      dateRange.start.getTime() + Math.random() * (dateRange.end.getTime() - dateRange.start.getTime()),
    )

    return {
      id: `txn_${Date.now()}_${i}`,
      user: users[Math.floor(Math.random() * users.length)],
      amount: Math.floor(Math.random() * 2000) + 50,
      status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)] as any,
      date: randomDate.toISOString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      type: Math.random() > 0.2 ? "credit" : ("debit" as any),
    }
  })
}

export const fetchDashboardData = async (tenantId: string): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Determine tenant type based on ID (in real app, this would come from database)
  const tenantType: TenantType = tenantId.includes("new")
    ? "new"
    : tenantId.includes("enterprise")
      ? "enterprise"
      : "established"

  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  // Generate detailed transactions for each day
  const detailedTransactions: Record<string, Transaction[]> = {}
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = `${i + 1}/${now.getMonth() + 1}`
    const dayStart = new Date(now.getFullYear(), now.getMonth(), i + 1)
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), i + 2)

    let transactionCount = 0
    let dayTransactions: Transaction[] = []

    if (tenantType === "new") {
      // New tenants have minimal or no data
      transactionCount = i < 3 ? 0 : Math.floor(Math.random() * 5)
      dayTransactions = generateTransactions(transactionCount, { start: dayStart, end: dayEnd })
    } else if (tenantType === "established") {
      // Established tenants have moderate activity
      transactionCount = Math.floor(Math.random() * 50) + 20
      dayTransactions = generateTransactions(transactionCount, { start: dayStart, end: dayEnd })
    } else {
      // Enterprise tenants have high activity
      transactionCount = Math.floor(Math.random() * 200) + 100
      dayTransactions = generateTransactions(transactionCount, { start: dayStart, end: dayEnd })
    }

    detailedTransactions[day] = dayTransactions

    return {
      day,
      transactions: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
    }
  })

  // Generate recent transactions
  const recentTransactions = generateTransactions(5, {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: now,
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate stats based on tenant type
  const getStats = () => {
    if (tenantType === "new") {
      return {
        daily: {
          newUsers: 0,
          totalUsers: 0,
          transactions: 0,
          nonUsers: 0,
          changeFromYesterday: {
            newUsers: "0%",
            totalUsers: "0%",
            transactions: "0%",
            nonUsers: "0%",
          },
        },
        weekly: {
          newUsers: Math.floor(Math.random() * 5),
          totalUsers: Math.floor(Math.random() * 10),
          transactions: Math.floor(Math.random() * 1000),
          nonUsers: Math.floor(Math.random() * 20),
          changeFromLastWeek: {
            newUsers: "100%",
            totalUsers: "100%",
            transactions: "100%",
            nonUsers: "50%",
          },
        },
        monthly: {
          newUsers: Math.floor(Math.random() * 20),
          totalUsers: Math.floor(Math.random() * 50),
          transactions: Math.floor(Math.random() * 5000),
          nonUsers: Math.floor(Math.random() * 100),
          changeFromLastMonth: {
            newUsers: "100%",
            totalUsers: "100%",
            transactions: "100%",
            nonUsers: "100%",
          },
        },
      }
    } else if (tenantType === "established") {
      return {
        daily: {
          newUsers: Math.floor(Math.random() * 25) + 5,
          totalUsers: Math.floor(Math.random() * 500) + 200,
          transactions: Math.floor(Math.random() * 15000) + 5000,
          nonUsers: Math.floor(Math.random() * 50) + 20,
          changeFromYesterday: {
            newUsers: `${Math.floor(Math.random() * 15) + 2}%`,
            totalUsers: `${Math.floor(Math.random() * 3) + 1}%`,
            transactions: `${Math.floor(Math.random() * 20) + 5}%`,
            nonUsers: `-${Math.floor(Math.random() * 5) + 1}%`,
          },
        },
        weekly: {
          newUsers: Math.floor(Math.random() * 150) + 50,
          totalUsers: Math.floor(Math.random() * 500) + 200,
          transactions: Math.floor(Math.random() * 80000) + 30000,
          nonUsers: Math.floor(Math.random() * 50) + 20,
          changeFromLastWeek: {
            newUsers: `${Math.floor(Math.random() * 12) + 3}%`,
            totalUsers: `${Math.floor(Math.random() * 4) + 1}%`,
            transactions: `${Math.floor(Math.random() * 18) + 7}%`,
            nonUsers: `-${Math.floor(Math.random() * 8) + 2}%`,
          },
        },
        monthly: {
          newUsers: Math.floor(Math.random() * 400) + 200,
          totalUsers: Math.floor(Math.random() * 500) + 200,
          transactions: Math.floor(Math.random() * 250000) + 150000,
          nonUsers: Math.floor(Math.random() * 50) + 20,
          changeFromLastMonth: {
            newUsers: `${Math.floor(Math.random() * 15) + 8}%`,
            totalUsers: `${Math.floor(Math.random() * 5) + 2}%`,
            transactions: `${Math.floor(Math.random() * 25) + 12}%`,
            nonUsers: `-${Math.floor(Math.random() * 10) + 3}%`,
          },
        },
      }
    } else {
      // Enterprise
      return {
        daily: {
          newUsers: Math.floor(Math.random() * 100) + 50,
          totalUsers: Math.floor(Math.random() * 2000) + 1000,
          transactions: Math.floor(Math.random() * 50000) + 25000,
          nonUsers: Math.floor(Math.random() * 100) + 50,
          changeFromYesterday: {
            newUsers: `${Math.floor(Math.random() * 20) + 5}%`,
            totalUsers: `${Math.floor(Math.random() * 5) + 2}%`,
            transactions: `${Math.floor(Math.random() * 30) + 10}%`,
            nonUsers: `-${Math.floor(Math.random() * 8) + 2}%`,
          },
        },
        weekly: {
          newUsers: Math.floor(Math.random() * 500) + 300,
          totalUsers: Math.floor(Math.random() * 2000) + 1000,
          transactions: Math.floor(Math.random() * 300000) + 150000,
          nonUsers: Math.floor(Math.random() * 100) + 50,
          changeFromLastWeek: {
            newUsers: `${Math.floor(Math.random() * 18) + 8}%`,
            totalUsers: `${Math.floor(Math.random() * 6) + 3}%`,
            transactions: `${Math.floor(Math.random() * 35) + 15}%`,
            nonUsers: `-${Math.floor(Math.random() * 12) + 5}%`,
          },
        },
        monthly: {
          newUsers: Math.floor(Math.random() * 1500) + 1000,
          totalUsers: Math.floor(Math.random() * 2000) + 1000,
          transactions: Math.floor(Math.random() * 1000000) + 500000,
          nonUsers: Math.floor(Math.random() * 100) + 50,
          changeFromLastMonth: {
            newUsers: `${Math.floor(Math.random() * 25) + 15}%`,
            totalUsers: `${Math.floor(Math.random() * 8) + 5}%`,
            transactions: `${Math.floor(Math.random() * 40) + 20}%`,
            nonUsers: `-${Math.floor(Math.random() * 15) + 8}%`,
          },
        },
      }
    }
  }

  return {
    tenantType,
    ...getStats(),
    recentTransactions,
    chartData,
    detailedTransactions,
  }
}

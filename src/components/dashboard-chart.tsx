"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DashboardChartProps {
  data: {
    day: string;
    transactions: number;
  }[];
  timeframe: "daily" | "weekly" | "monthly";
}

export function DashboardChart({ data, timeframe }: DashboardChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Format data based on timeframe
  const formatChartData = () => {
    if (timeframe === 'daily') {
      // Show last 7 days for daily view
      return data.slice(0, 7).map(item => ({
        name: item.day.split('/')[0], // Just show day number
        total: item.transactions
      }));
    } else if (timeframe === 'weekly') {
      // Group by week (simplified - in real app you'd want proper week grouping)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.slice(0, 28).reduce((acc: any[], item, index) => {
        const weekNum = Math.floor(index / 7);
        if (!acc[weekNum]) {
          acc[weekNum] = { name: `Week ${weekNum + 1}`, total: 0 };
        }
        acc[weekNum].total += item.transactions;
        return acc;
      }, []).filter(Boolean);
    } else {
      // Monthly view - show all data points
      return data.map(item => ({
        name: item.day,
        total: item.transactions
      }));
    }
  };

  const chartData = formatChartData();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-muted/20 rounded-md">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
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
            tickFormatter={(value) => `R${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip
            formatter={(value) => [`R${value}`, "Amount"]}
            labelFormatter={(label) => timeframe === 'daily' ? `Day ${label}` : label}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar 
            dataKey="total" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
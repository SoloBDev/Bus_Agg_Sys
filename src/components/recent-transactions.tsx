"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react"

interface Transaction {
  id: string
  user: string
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  type: "credit" | "debit"
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
  period: string
  timeframe: "daily" | "weekly" | "monthly"
}

export function RecentTransactions({
  isOpen,
  onClose,
  transactions,
  period,
  timeframe,
}: TransactionDetailsModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    )
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Transactions for {timeframe === "daily" ? `Day ${period}` : period}</DialogTitle>
          <DialogDescription>
            {transactions.length} transactions totaling R{totalAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    {getTypeIcon(transaction.type)}
                    <AvatarFallback>{transaction.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.user}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "credit" ? "+" : "-"}R{transaction.amount.toFixed(2)}
                  </p>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

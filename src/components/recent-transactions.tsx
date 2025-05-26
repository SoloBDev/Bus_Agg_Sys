/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react"

export interface RecentTransactionsProps {
  transactions: {
    id: string
    user: string
    amount: number
    status: "completed" | "pending" | "failed"
    date: string
    description?: string
    type?: "credit" | "debit"
  }[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Determine transaction type and styling based on status and type
  const getTransactionDisplay = (transaction: any) => {
    const { status, type = "credit" } = transaction

    let statusIcon
    let statusColor

    switch (status) {
      case "completed":
        statusIcon = <CheckCircle className="h-4 w-4 text-green-500" />
        statusColor = "text-green-500"
        break
      case "pending":
        statusIcon = <Clock className="h-4 w-4 text-yellow-500" />
        statusColor = "text-yellow-500"
        break
      case "failed":
        statusIcon = <XCircle className="h-4 w-4 text-red-500" />
        statusColor = "text-red-500"
        break
      default:
        statusIcon = <CheckCircle className="h-4 w-4 text-green-500" />
        statusColor = "text-green-500"
    }

    const typeIcon =
      type === "credit" ? (
        <ArrowDownLeft className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowUpRight className="h-4 w-4 text-red-500" />
      )

    return { statusIcon, statusColor, typeIcon }
  }

  return (
    <div className="space-y-6">
      {transactions.map((transaction) => {
        const { statusIcon, statusColor, typeIcon } = getTransactionDisplay(transaction)

        return (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9 border">
              {typeIcon}
              <AvatarFallback>{transaction.user[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.user}</p>
              {transaction.description && <p className="text-xs text-muted-foreground">{transaction.description}</p>}
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
              <div className="flex items-center space-x-1">
                {statusIcon}
                <span className={`text-xs ${statusColor}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
            <div className={`ml-auto font-medium ${statusColor}`}>
              {transaction.type === "debit" ? "-" : "+"}R {transaction.amount.toFixed(2)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

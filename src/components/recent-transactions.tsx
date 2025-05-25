import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export interface RecentTransactionsProps {
  transactions: {
    id: string;
    user: string;
    amount: number;
    status: "completed" | "pending" | "failed";
    date: string;
  }[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determine transaction type and styling based on status
  const getTransactionType = (status: string) => {
    switch(status) {
      case 'completed':
        return { 
          type: 'credit',
          icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
          color: 'text-green-500'
        };
      case 'pending':
        return { 
          type: 'pending',
          icon: <ArrowDownLeft className="h-4 w-4 text-yellow-500" />,
          color: 'text-yellow-500'
        };
      case 'failed':
        return { 
          type: 'debit',
          icon: <ArrowUpRight className="h-4 w-4 text-red-500" />,
          color: 'text-red-500'
        };
      default:
        return { 
          type: 'credit',
          icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
          color: 'text-green-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {transactions.map((transaction) => {
        const { icon, color } = getTransactionType(transaction.status);
        
        return (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9 border">
              {icon}
              <AvatarFallback>{transaction.user[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.user}</p>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
              <span className={`text-xs ${color}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
            <div className={`ml-auto font-medium ${color}`}>
              R {transaction.amount.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  )
}
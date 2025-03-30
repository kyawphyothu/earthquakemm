import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPage() {
  const users = await prisma.user.findMany()
  
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{user.name || 'Anonymous User'}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {formatDate(user.createdAt)}
                </div>
              </div>
            ))}
          </div>
          <Link 
            href="/admin/users" 
            className="block mt-4 text-center py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            View All Users
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {transaction.id}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(transaction.dateTime)}
                </div>
              </div>
            ))}
          </div>
          <Link 
            href="/admin/transactions" 
            className="block mt-4 text-center py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  )
}

import { prisma } from '@/lib/db'
import { formatDate, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPage() {
  const users = await prisma.user.findMany()
  const adminUsers = await prisma.user.findMany()
  
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  // Get currency-specific totals
  const mmkTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      currency: "MMK"
    }
  })
  
  const vndTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      currency: "VND"
    }
  })
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Donation Totals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/20 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total MMK Donations</div>
              <div className="text-2xl font-bold">{mmkTotal._sum.amount?.toFixed(2) || '0.00'} Ks</div>
            </div>
            <div className="bg-secondary/20 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total VND Donations</div>
              <div className="text-2xl font-bold">{vndTotal._sum.amount?.toFixed(2) || '0.00'} ₫</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Users ({adminUsers.length})</h2>
          <div className="space-y-4">
            {adminUsers.map(user => (
              <div key={user.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{user.name || 'Admin User'}</p>
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
            Manage Admin Users
          </Link>
        </div>
        
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
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                  <p className="text-sm text-muted-foreground">
                    Donation ID: {transaction.id}
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
            View All Donations
          </Link>
        </div>
      </div>
    </div>
  )
}

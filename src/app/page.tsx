import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function Home() {
  const totalUsers = await prisma.user.count()
  const totalTransactions = await prisma.transaction.count()
  const totalAmount = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    }
  })
  
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Transaction Dashboard</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Track and analyze transaction data with our simple dashboard
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{totalUsers}</h2>
            <p className="text-muted-foreground">Total Users</p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{totalTransactions}</h2>
            <p className="text-muted-foreground">Total Transactions</p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              ${totalAmount._sum.amount?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-muted-foreground">Total Amount</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID: {transaction.id}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(transaction.dateTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/admin" 
            className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}

import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const totalUsers = await prisma.user.count()
  
  // Get all transactions for total amount
  const totalTransactions = await prisma.transaction.count()
  const totalAmount = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    }
  })
  
  // Get today's transactions
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      dateTime: {
        gte: today
      }
    }
  })
  
  // Get recent transactions - remove the include user since it doesn't exist
  const recentTransactions = await prisma.transaction.findMany({
    take: 10,
    orderBy: {
      dateTime: 'desc'
    }
  })
  
  // Helper function to generate anonymous identifiers
  const generateAnonymousName = (id: number) => {
    return `An****${id.toString().slice(-3)}`
  }

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
        <Tabs defaultValue="images" className="w-full mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-muted h-[300px] flex items-center justify-center text-muted-foreground">
                  Transaction Chart
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-medium">Transactions Overview</h3>
                  <p className="text-sm text-muted-foreground">Visual representation of transaction data</p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-muted h-[300px] flex items-center justify-center text-muted-foreground">
                  Financial Statistics
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-medium">Financial Analysis</h3>
                  <p className="text-sm text-muted-foreground">Detailed financial insights</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
                <CardDescription>Overview of all transaction activity</CardDescription>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">All-time Total</div>
                    <div className="text-2xl font-bold">${totalAmount._sum.amount?.toFixed(2) || '0.00'}</div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Today's Total</div>
                    <div className="text-2xl font-bold">${todayTotal._sum.amount?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {recentTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No transactions found</p>
                  ) : (
                    recentTransactions.map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{generateAnonymousName(transaction.id)}</p>
                          <p className="text-sm text-muted-foreground">
                            ${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.dateTime)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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

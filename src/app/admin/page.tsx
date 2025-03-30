import { prisma } from '@/lib/db'
import { formatDate, formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const adminUsers = await prisma.user.findMany()
  
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
  
  // Get today's donations
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayMMKTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      dateTime: {
        gte: today
      },
      currency: "MMK"
    }
  })
  
  const todayVNDTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      dateTime: {
        gte: today
      },
      currency: "VND"
    }
  })
  
  // Count donations by payment method
  const methodCounts = await prisma.transaction.groupBy({
    by: ['method'],
    _count: {
      id: true
    }
  })
  
  // Get recent donations
  const recentDonations = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      dateTime: 'desc'
    }
  })
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/donations/create">
          <Button className="bg-primary text-primary-foreground">
            Add Donation
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Summary</CardTitle>
            <CardDescription>Overview of donation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total MMK</div>
                <div className="text-2xl font-bold">{formatCurrency(mmkTotal._sum.amount || 0, "MMK")}</div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total VND</div>
                <div className="text-2xl font-bold">{formatCurrency(vndTotal._sum.amount || 0, "VND")}</div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Today's MMK</div>
                <div className="text-2xl font-bold">{formatCurrency(todayMMKTotal._sum.amount || 0, "MMK")}</div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Today's VND</div>
                <div className="text-2xl font-bold">{formatCurrency(todayVNDTotal._sum.amount || 0, "VND")}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Donations by Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {methodCounts.map(method => (
                  <div key={method.method} className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm font-medium">{method.method}</div>
                    <div className="text-xl">{method._count.id}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest donation entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No donations recorded yet</p>
              ) : (
                recentDonations.map(donation => (
                  <div key={donation.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">
                        {donation.donorName || `Donor-${donation.id.toString().slice(-3)}`}
                      </p>
                      <div className="flex text-sm text-muted-foreground gap-2">
                        <span>{formatCurrency(donation.amount, donation.currency)}</span>
                        <span>•</span>
                        <span>{donation.method}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(donation.dateTime)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/donations">
                <Button variant="outline" className="w-full">View All Donations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>System administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{user.name || user.username}</p>
                    <p className="text-sm text-muted-foreground">Admin</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full">Manage Admins</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

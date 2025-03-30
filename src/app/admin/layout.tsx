import { getServerSession } from "next-auth/next";
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  
  // Redirect if not authenticated
  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <Link href="/admin" className="font-bold text-lg">Myanmar Relief Admin</Link>
            <nav className="flex flex-wrap gap-2 items-center">
              {/* <Link href="/admin" className="px-3 py-1 rounded-md hover:bg-muted text-sm font-medium transition-colors">Dashboard</Link> */}
              <Link href="/admin/donations" className="px-3 py-1 rounded-md hover:bg-muted text-sm font-medium transition-colors">Donations</Link>
              <Link href="/admin/donations/create" className="px-3 py-1 rounded-md hover:bg-muted text-sm font-medium transition-colors">Add Donation</Link>
              <Link href="/" className="px-3 py-1 rounded-md hover:bg-muted text-sm font-medium transition-colors">Public Site</Link>
              <div className="ml-0 md:ml-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l md:pl-4 flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-muted-foreground">
                  {session?.user?.name || session?.user?.username}
                </span>
                <LogoutButton />
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-6">
        {children}
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Myanmar Earthquake Relief Fund - Admin Panel
        </div>
      </footer>
    </div>
  )
}

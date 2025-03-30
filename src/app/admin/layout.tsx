import { getServerSession } from "next-auth/next";
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/admin" className="font-bold text-lg">Admin Dashboard</Link>
          <nav className="flex gap-4 items-center">
            <Link href="/admin/users" className="hover:text-primary">Users</Link>
            <Link href="/admin/transactions" className="hover:text-primary">Transactions</Link>
            <Link href="/" className="hover:text-primary">Public Site</Link>
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session?.user?.name || session?.user?.username}
              </span>
              <LogoutButton />
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

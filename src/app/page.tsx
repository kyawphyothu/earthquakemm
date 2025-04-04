import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import newsData from "@/data/news.json";
import { NewsCollection } from "@/types/news";
import NewsTab from "@/components/NewsTab";

// Type assertion for the news data
const news = newsData as NewsCollection;

export const metadata: Metadata = {
  title: "Donate to Support Earthquake Victims",
  description:
    "Make a difference by donating to the Myanmar Earthquake Relief Fund. Your contribution helps provide emergency shelter, food, water, and medical supplies to those affected.",
  openGraph: {
    title: "Donate to Myanmar Earthquake Relief Fund",
    description:
      "Your donation can help save lives and rebuild communities affected by the recent earthquake in Myanmar.",
  },
};

export default async function Home() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  // Get total donations count (no longer using users table for this)
  const totalDonations = await prisma.transaction.count();

  // Get all-time totals by currency
  const mmkTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      currency: "MMK",
    },
  });

  const vndTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      currency: "VND",
    },
  });

  // Get today's donations by currency
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMMKTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      dateTime: {
        gte: today,
      },
      currency: "MMK",
    },
  });

  const todayVNDTotal = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      dateTime: {
        gte: today,
      },
      currency: "VND",
    },
  });

  // Get recent donations
  const recentDonations = await prisma.transaction.findMany({
    take: 10,
    orderBy: {
      dateTime: "desc",
    },
  });

  // Helper function to generate anonymous identifiers for donors
  const generateDonorName = (id: number) => {
    return `Donor-${id.toString().slice(-3)}`;
  };

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Myanmar Earthquake Relief Fund
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Support those affected by the earthquake in Myanmar. Every donation
            makes a difference.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="donate" className="w-full mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="donate">How to Donate</TabsTrigger>
            <TabsTrigger value="donors">Our Donors</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="mt-6">
            {/* Donate tab content - unchanged */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Scan to Donate</h2>
              <p className="text-muted-foreground mb-8">
                Your support will help provide immediate aid to those affected
                by the earthquake.
              </p>
            </div>

            {/* Rest of the donate tab content... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>KBZPay (MMK)</CardTitle>
                  <CardDescription>
                    Scan this QR code to donate via KBZPay app
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-white p-4 rounded-md border">
                    <Image
                      src="/qr/kpay.jpg"
                      alt="KBZPay QR Code"
                      width={200}
                      height={200}
                      className="w-[200px] h-[200px] object-cover"
                    />
                  </div>
                </CardContent>
                <div className="p-4 bg-muted/20 border-t text-center">
                  <p className="font-medium">KBZPay: Seng Jat Naw</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Account: ******6187 (MMK)
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>BIDV VietQR (VND)</CardTitle>
                  <CardDescription>For donors outside Myanmar</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-white p-4 rounded-md border">
                    <Image
                      src="/qr/bidv.jpg"
                      alt="BIDV VietQR Code"
                      width={200}
                      height={200}
                      className="w-[200px] h-[200px] object-cover"
                    />
                  </div>
                </CardContent>
                <div className="p-4 bg-muted/20 border-t text-center">
                  <p className="font-medium">BIDV: Seng Jat Naw</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Account: 8894044543 (VND)
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donors" className="mt-6">
            {/* Donors tab content - unchanged */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
                <CardDescription>
                  Together we can make a difference
                </CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-4">
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Total Donations (MMK)
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(mmkTotal._sum.amount || 0, "MMK")}
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Today's Donations (MMK)
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(todayMMKTotal._sum.amount || 0, "MMK")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Total Donations (VND)
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(vndTotal._sum.amount || 0, "VND")}
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Today's Donations (VND)
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(todayVNDTotal._sum.amount || 0, "VND")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <h3 className="text-lg font-medium mb-4">
                  Recent Anonymous Donations
                </h3>
                <div className="space-y-4">
                  {recentDonations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No donations received yet. Be the first to donate!
                    </p>
                  ) : (
                    recentDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div>
                          <p className="font-medium">
                            {generateDonorName(donation.id)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Donated{" "}
                            <span className="text-primary font-medium">
                              {formatCurrency(
                                donation.amount,
                                donation.currency
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(donation.dateTime)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            {/* Use the client component for News tab */}
            <NewsTab newsData={news} />
          </TabsContent>
        </Tabs>

        {/* Rest of the component remains unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{totalDonations}</h2>
            <p className="text-muted-foreground">Donations Received</p>
          </div>

          <div className="bg-card rounded-lg shadow p-6 text-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                {formatCurrency(mmkTotal._sum.amount || 0, "MMK")}
              </h2>
              <p className="text-muted-foreground">Total MMK Raised</p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 text-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                {formatCurrency(vndTotal._sum.amount || 0, "VND")}
              </h2>
              <p className="text-muted-foreground">Total VND Raised</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4 text-center">
            About This Fundraiser
          </h2>
          <p className="mb-4">
            The recent earthquake in Myanmar has devastated communities, leaving
            many without homes, access to clean water, and essential supplies.
            Your donations will directly support:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Emergency shelter and housing repair</li>
            <li>Food, water, and medical supplies</li>
            <li>Support for displaced families</li>
            <li>Long-term community rebuilding efforts</li>
          </ul>
          <p>
            Every contribution, no matter the size, helps us provide critical
            aid to those affected by this natural disaster. Thank you for your
            generosity and compassion.
          </p>
        </div>

        {/* Only show Admin Dashboard button to authenticated users */}
        {isAuthenticated && (
          <div className="mt-8 text-center">
            <Link
              href="/admin"
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

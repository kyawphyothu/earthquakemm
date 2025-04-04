"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const formSchema = z.object({
  donorName: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.enum(["MMK", "VND"]),
  method: z.enum(["KPay", "BIDV", "Cash", "Other"]),
  dateTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time"
  })
}).refine(data => {
  // KPay must use MMK
  if (data.method === "KPay" && data.currency !== "MMK") {
    return false;
  }
  // BIDV must use VND
  if (data.method === "BIDV" && data.currency !== "VND") {
    return false;
  }
  return true;
}, {
  message: "Currency must match payment method (KPay uses MMK, BIDV uses VND)",
  path: ["currency"]
});

export default function CreateDonationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: "",
      amount: undefined,
      currency: "MMK",
      method: "Cash",
      dateTime: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
    },
  });

  // Watch the payment method to auto-select the appropriate currency
  const watchMethod = form.watch("method");

  useEffect(() => {
    if (watchMethod === "KPay") {
      form.setValue("currency", "MMK");
    } else if (watchMethod === "BIDV") {
      form.setValue("currency", "VND");
    }
  }, [watchMethod, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          // Send the dateTime as an ISO string which the API will convert to a Date
          dateTime: values.dateTime
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add donation");
      }

      setSuccess(true);
      form.reset({
        donorName: "",
        amount: undefined,
        currency: "MMK",
        method: "Cash",
        dateTime: new Date().toISOString().slice(0, 16)
      });
      
      // Optionally redirect after success
      // router.push("/admin/donations");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-primary hover:underline mb-6 block">
          &larr; Back to Dashboard
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Donation</CardTitle>
            <CardDescription>Manually record a new donation</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 text-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-700">
                <AlertDescription>Donation added successfully!</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Anonymous" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Leave blank for anonymous donations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isLoading} />
                        </FormControl>
                        <div className="h-5"> {/* Empty container for consistent spacing */}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            disabled={isLoading || watchMethod === "KPay" || watchMethod === "BIDV"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MMK">MMK (Kyat)</SelectItem>
                              <SelectItem value="VND">VND (Vietnamese Dong)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="h-5 text-xs text-muted-foreground">
                          {watchMethod === "KPay" && "KPay only supports MMK"}
                          {watchMethod === "BIDV" && "BIDV only supports VND"}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KPay">KPay (MMK only)</SelectItem>
                              <SelectItem value="BIDV">BIDV (VND only)</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="h-5"> {/* Empty container for consistent spacing */}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} disabled={isLoading} />
                        </FormControl>
                        <div className="h-5"> {/* Empty container for consistent spacing */}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Donation"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

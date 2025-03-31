import type { Metadata } from 'next'
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in to access the Myanmar Earthquake Relief Fund administration',
  robots: {
    index: false,
    follow: false,
  }
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
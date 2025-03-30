import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Format currency based on the currency code
 */
export function formatCurrency(amount: number, currency: string): string {
  const formattedAmount = amount.toFixed(2);
  
  switch (currency) {
    case 'MMK':
      return `${formattedAmount} Ks`;
    case 'VND':
      return `${formattedAmount} ₫`;
    default:
      return `${formattedAmount}`;
  }
}

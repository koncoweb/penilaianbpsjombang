import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to 2 decimal places
 * @param value - Number or string to format
 * @returns Formatted string with 2 decimal places
 */
export function formatDecimal(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '0.00';
  }
  
  return num.toFixed(2);
}
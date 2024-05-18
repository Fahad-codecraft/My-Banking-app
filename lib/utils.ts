import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) => z.object({
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  address1: type === 'sign-in' ? z.string().optional() : z.string().max(60),
  city: type === 'sign-in' ? z.string().optional() : z.string().max(60),
  state: type === 'sign-in' ? z.string().optional() : z.string(),
  postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),

  email: z.string().email(),
  password: z.string().min(8),
})

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}


// export function formatAmount(amount: number): string {
//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   // Format the amount using the formatter
//   let formattedAmount = formatter.format(amount);

//   // Replace the decimal comma with a dot, if necessary
//   formattedAmount = formattedAmount.replace(',', '.');

//   return formattedAmount;
// }

// Example usage
// console.log(formatAmount(9999999999654544)); // "₹9,999,999,999,654,544.00"

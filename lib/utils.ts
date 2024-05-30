import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import qs from "query-string";

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

// utils.ts
export const formatDate = (dateString: string, format: string = 'dd/MM/yyyy HH:mm') => {
  const date = new Date(dateString);

  const options: { [key: string]: string } = {
    dd: ('0' + date.getDate()).slice(-2),
    MM: ('0' + (date.getMonth() + 1)).slice(-2),
    yyyy: date.getFullYear().toString(),
    HH: ('0' + date.getHours()).slice(-2),
    mm: ('0' + date.getMinutes()).slice(-2),
  };

  return format.replace(/dd|MM|yyyy|HH|mm/g, (matched) => options[matched]);
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}
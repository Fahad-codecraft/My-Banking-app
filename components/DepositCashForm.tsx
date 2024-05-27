"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { depositCash } from "@/lib/actions/money.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is too short")
});


const DepositCashForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: ""
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const loggedIn = await getLoggedInUser();

    try {
      // Call the createTransfer function with the form data
      await depositCash({
        email: loggedIn.email,
        amount: data.amount,
      });

      // Optional: redirect or show a success message
      router.push("/");
    } catch (error) {
      console.error("Depositing Cash failed failed: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 h-screen flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col rounded-lg p-3 z-50 w-full max-w-lg border bg-background shadow-lg">
          <div className="w-full flex justify-center items-center">
          <h1 className="text-2xl text-stone-600 font-semibold">Deposit Cash</h1> 
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="payment-transfer_form-item py-5 border-y-2 mt-3">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Amount
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="ex: 5.00"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Depositing...
                </>
              ) : (
                "Transfer Funds"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default DepositCashForm
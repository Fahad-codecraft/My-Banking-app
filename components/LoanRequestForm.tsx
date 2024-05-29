"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { checkReason, requestLoan } from "@/lib/actions/loan.actions";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  requestAmount: z.string().min(3, 'Amount is too short to borrow'),
  time: z.string().min(1, 'Time is too short to borrow'),
  reason: z.string().min(3, 'Reason is too short'),
});

const LoanRequestForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      requestAmount: "",
      time: ""
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuccessMessage('')
    const loggedIn = await getLoggedInUser();

    try {
      const res = checkReason(data.reason)

      if (!res) {
        await requestLoan({
          email: loggedIn.email,
          principalAmount: data.requestAmount,
          time: data.time,
          reason: data.reason
        });
        
        // Optional: redirect or show a success message
        setSuccessMessage('Loan request Approved!');
        router.push("/")
      } else {
        setErrorMessage("Reason already exists")
      }
      // Call the createTransfer function with the form data
    } catch (error) {
      console.error("Submitting loan request failed: ", error);
    }
    setIsLoading(false);
  };

  return (
    <section className="p-4  flex flex-col justify-center items-center">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Reason For Loan
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="Car Loan"
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

          <FormField
            control={form.control}
            name="requestAmount"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Amount to Borrow
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="ex: 1000"
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

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="border-y border-gray-200">
                <div className="payment-transfer_form-item py-5">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Time in Years
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="ex: 1"
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

          {errorMessage && (
            <FormDescription className="text-red-500">{errorMessage}</FormDescription>
          )}
          {successMessage && (
            <FormDescription className="text-green-500">{successMessage}</FormDescription>
          )}

          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                </>
              ) : (
                "Request Loan"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default LoanRequestForm;

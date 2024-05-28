"use client"
import { LoansDropdown } from './LoansDropdown'

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "./ui/textarea";


const formSchema = z.object({
  requestAmount: z.string().min(3, 'Amount is too short to borrow'),
  time: z.string().min(1, 'Time is too short to borrow'),
  reason: z.string().min(3, 'Reason is too short'),
});



const LoanRepaymentForm = ({ loans }: LoanDropdownProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
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

    try {

      //new func

    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  }; 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="reason"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Select Loan
                  </FormLabel>
                  {/* <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription> */}
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <LoansDropdown
                      loans={loans}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default LoanRepaymentForm
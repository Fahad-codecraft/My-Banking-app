"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { repayLoan, requestLoan } from "@/lib/actions/loan.actions";

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
import { LoansDropdown } from "./LoansDropdown";

const formSchema = z.object({
  repayAmount: z.string().min(1, 'Amount is too short to repay'),
  reason: z.string().min(3, 'Reason is too short'),
});



const LoanRepaymentForm = ({ loans }: LoanDropdownProps) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      repayAmount: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuccessMessage('')
    setErrorMessage('')
    const loggedIn = await getLoggedInUser();

    try {
      const selectedLoan = loans.find(loan => loan.reason === data.reason);

      if (!selectedLoan) {
        setErrorMessage("Selected loan not found")
        throw new Error("Selected loan not found");
      }

      if (parseFloat(data.repayAmount) > parseFloat(selectedLoan.remainingAmount)) {
        setErrorMessage("Repayment amount cannot be greater than remaining amount")
        throw new Error("Repayment amount cannot be greater than remaining amount");
      }

      // Call the createTransfer function with the form data
      await repayLoan({
        email: loggedIn.email,
        loanReason: data.reason,
        repayAmount: data.repayAmount
      });

      // Optional: redirect or show a success message
      setSuccessMessage('Loan repaid!');
      router.push("/")
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
            render={() => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">
                      Select Loan to repay
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

          <FormField
            control={form.control}
            name="repayAmount"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Amount to Repay
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
                "Repay Loan"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default LoanRepaymentForm
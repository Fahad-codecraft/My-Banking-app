"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatAmount } from "@/lib/utils";

export const LoansDropdown = ({
  loans = [],
  setValue,
  otherStyles,
}: LoanDropdownProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState(loans[0]);

  const handleChange = (value: string) => {
    const selectedLoan = loans.find((loan) => loan.reason === value);
    if (selectedLoan) {
      setSelected(selectedLoan);

      if (setValue) {
        setValue("reason", value);
      }

      console.log(value);
      console.log(selectedLoan);
    }
  };

  return (
    <Select
      defaultValue={selected.reason}
      onValueChange={(value) => handleChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
      >
        <p className="line-clamp-1 w-full text-left">{selected.reason}</p>
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a Loan to repay
          </SelectLabel>
          {loans
            .filter((loan) => parseFloat(loan.remainingAmount) > 0)
            .map((loan) => (
              <SelectItem
                key={loan.$id}
                value={loan.reason}
              >
                <div className="flex flex-col ">
                  <p className="text-16 font-medium">{loan.reason}</p>
                  <p className="text-14 font-medium text-blue-600">
                    {loan.remainingAmount}
                  </p>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
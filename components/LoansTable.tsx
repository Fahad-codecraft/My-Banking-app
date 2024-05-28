import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LoansTable = async ({ Loans }: LoansTableProps) => {
  // Ensure Loans is an array
  const loansArray = Array.isArray(Loans) ? Loans : [];
  const sortedLoans = loansArray.slice().sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Reason</TableHead>
          <TableHead className="px-2">Principal Amount</TableHead>
          <TableHead className="px-2">Remaining Amount</TableHead>
          <TableHead className="px-2">Interest Rate</TableHead>
          <TableHead className="px-2">Time in Years</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLoans.map((t: LoanProps) => {
          return (
            <TableRow key={t.$id}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.reason}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.principalAmount}
                  </h1>
                </div>
              </TableCell>
              <TableCell>{t.remainingAmount}</TableCell>
              <TableCell>{t.intrestRate}</TableCell>
              <TableCell>{t.time}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LoansTable
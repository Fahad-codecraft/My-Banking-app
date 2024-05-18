import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionsTable from './TransactionsTable'


const RecentTransactions = ({
  transactions = [],
  userId,
  // page = 1,
}: RecentTransactionsProps) => {

  // const rowsPerPage = 10;
  // const totalPages = Math.ceil(transactions.length / rowsPerPage)

  // const indexOfLastTransaction = page * rowsPerPage;
  // const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  // const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <section className='recent-transactions'>
      <header className='flex items-center justify-between'>
        <h2 className="recent-transactions-label">
          Recent Transactions
        </h2>
        <Link
          href={`/transaction-history/?id=${userId}`}
          className='view-all-btn'
        >
          View All
        </Link>
      </header>
      <TransactionsTable
        transactions={transactions}
      />

      {/* {totalPages > 1 &&(
              <div className='my-4 w-full'>
                <Pagination 
                  totalPages={totalPages}
                  page={page}
                />
              </div>
            )} */}


    </section>
  )
}

export default RecentTransactions
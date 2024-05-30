import Link from 'next/link'
import TransactionsTable from './TransactionsTable'


const RecentTransactions = ({
  transactions = [],
  userId,
}: RecentTransactionsProps) => {


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


    </section>
  )
}

export default RecentTransactions
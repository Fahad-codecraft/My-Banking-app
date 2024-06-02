import HeaderBox from '@/components/Headerbox';
import TransactionsTable from '@/components/TransactionsTable';
import { getBankAccountId, getTransactions } from '@/lib/actions/transactions.actions';
import { getLoggedInUser, getMoney } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';

const TransactionHistory = async () => {

  const loggedIn = await getLoggedInUser();
  const userid = loggedIn.$id

  const mon = await getMoney({ userId: userid })
  const balance = mon.balance
  const trans = await getTransactions({ userId: userid })

  const accountIddoc = await getBankAccountId({ userId: userid })
  const accountId = accountIddoc.accountId


  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className='transactions-account-balance'>
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">{formatAmount(balance)}</p>
          </div>
          <div className='transactions-account-balance'>
            <p className="text-14">Account Id</p>
            <p className="text-24 text-center font-bold">{accountId}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={trans}
          />
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory
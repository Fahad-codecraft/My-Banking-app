import HeaderBox from "@/components/Headerbox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getLoggedInUser} from "@/lib/actions/user.actions";

import { getMoney } from "@/lib/actions/user.actions";
import RecentTransactions from "@/components/RecentTransactions";
import { getTransactions } from "@/lib/actions/transactions.actions";

const Home = async () => {

  const loggedIn = await getLoggedInUser();

  const userid = loggedIn.$id

  const mon = await getMoney({ userId: userid })
  const balance = mon.balance
  const trans = await getTransactions({ userId: userid })


  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            totalCurrentBalance={balance}
          />
        </header>
        <RecentTransactions
          transactions={trans}
          userId={userid}
        />
      </div>
    </section>
  )
}

export default Home
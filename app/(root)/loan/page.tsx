import LoanRepaymentForm from "@/components/LoanRepaymentForm"
import LoanRequestForm from "@/components/LoanRequestForm"
import LoansTable from "@/components/LoansTable"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getLoans } from "@/lib/actions/loan.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"

const TabsDemo = async () => {
  const loggedIn = await getLoggedInUser()

  const loans = await getLoans(loggedIn.email)
  return (
    <section className="p-4 h-screen flex flex-col justify-center items-center w-full">

      <Tabs defaultValue="loan" className="no-scrollbar flex flex-col w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger className="data-[state=active]:border" value="loan">Loan</TabsTrigger>
          <TabsTrigger className="data-[state=active]:border" value="requestLoan">Request Loan</TabsTrigger>
          <TabsTrigger className="data-[state=active]:border" value="repayLoan">Repay Loan</TabsTrigger>
        </TabsList>
        <TabsContent value="loan">
          <Card>
            <CardHeader>
              <CardTitle>
                Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoansTable Loans={loans}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requestLoan">
          <Card>
            <CardHeader>
              <CardTitle>Request Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoanRequestForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="repayLoan">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoanRepaymentForm loans={loans}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default TabsDemo
import LoanRequestForm from "@/components/LoanRequestForm"
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
import { requestLoan } from "@/lib/actions/loan.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"

const TabsDemo = async () => {
  // const loggedIn = await getLoggedInUser()
  // requestLoan({email: loggedIn.email, principalAmount: "1000", time: "12"})
  return (
    <section className="h-screen flex flex-col justify-center items-center">

      <Tabs defaultValue="loan" className="no-scrollbar flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="data-[state=active]:border" value="loan">Request Loan</TabsTrigger>
          <TabsTrigger className="data-[state=active]:border" value="repayLoan">Repay Loan</TabsTrigger>
        </TabsList>
        <TabsContent value="loan">
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
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default TabsDemo
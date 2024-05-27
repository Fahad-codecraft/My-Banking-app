'use server'

import { createTransaction, getAccountBalance, updateAccountBalance } from "./transactions.actions"
import { getBankAccountId } from "./transactions.actions"
import { getuserByEmail } from "./user.actions"

interface DepositCashProps {
  amount: string;
  email: string;
}

export const depositCash = async ({ amount, email }: DepositCashProps) => {
  const user = await getuserByEmail({ email })
  const bankAccount = await getBankAccountId({ userId: user.$id })
  const balance = await getAccountBalance(bankAccount.$id)

  const newBalance = parseFloat(balance.balance) + parseFloat(amount)

  await updateAccountBalance({ accountId: bankAccount.$id, newBalance })
  const trans = {
    name: 'Deposit Cash',
    amount,
    senderAccount: bankAccount.accountId,
    senderEmail: email,
    type: 'credit',
    receiverAccount: bankAccount.accountId,
    receiverEmail: email,
    category: 'deposit',
    senderUserId: user.$id,
  }
  createTransaction(trans)
}
'use server'

import { createAdminClient } from "../appwrite"
import { createTransaction, getAccountBalance, getBankAccountId, updateAccountBalance } from "./transactions.actions"
import { getuserByEmail } from "./user.actions"
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";

interface loanProps {
  email: string,
  principalAmount: string
  time: string,
  reason: string
}

interface loanDoc {
  principalAmount: string,
  time: string,
  intrestRate: string,
  repayAmount: string,
  remainingAmount: string,
  reason: string,
  $id: string,
  $createdAt: string,
  accountId: string
}


const {
  APPWRITE_LOAN_COLLECTION_ID: LOAN_COLLECTION_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  MAIN_BANK: MAIN_BANK,
} = process.env

export const createLoan = async (loan: createLoanProps) => {
  try {
    const { database } = await createAdminClient();

    const newLoan = await database.createDocument(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      ID.unique(),
      {
        ...loan
      }
    )

    return parseStringify(newLoan);
  } catch (error) {
    console.log(error);
  }
}

export const requestLoan = async ({ email, principalAmount, time, reason }: loanProps) => {
  const user = await getuserByEmail({ email: email })
  const bankUser = await getuserByEmail({ email: MAIN_BANK! })
  const bankAccount = await getBankAccountId({ userId: user.$id })
  const bankUserAccount = await getBankAccountId({ userId: bankUser.$id })
  // console.log(bankAccount)
  const intrestRate = Math.random() * (9.1 - 6.7) + 6.7
  const iRate = intrestRate.toFixed(2)
  const repayAmountInitial = parseFloat(principalAmount) + (parseFloat(principalAmount) * parseFloat(iRate) * parseFloat(time)) / 100
  const repayAmount = repayAmountInitial.toFixed(2)
  const remainingAmount = repayAmount
  const data = {
    principalAmount,
    time,
    intrestRate: iRate.toString(),
    repayAmount: repayAmount.toString(),
    remainingAmount: remainingAmount.toString(),
    accountId: bankAccount.$id,
    reason: reason
  }
  const accId = bankAccount.$id
  createLoan(data)
  const money = await getAccountBalance(bankAccount.$id)
  const mainMoney = await getAccountBalance(bankUserAccount.$id)
  const newBalance = parseFloat(money.balance) + parseFloat(principalAmount)
  const mainBalance = parseFloat(mainMoney.balance) - parseFloat(principalAmount)
  updateAccountBalance({ accountId: accId, newBalance: newBalance })
  updateAccountBalance({ accountId: bankUserAccount.$id, newBalance: mainBalance })
  const tras = {
    name: "Loan",
    senderEmail: 'bank',
    type: 'credit',
    receiverEmail: email,
    senderAccount: 'bank',
    receiverAccount: bankAccount.accountId,
    amount: principalAmount,
    category: 'Loan',
    senderUserId: user.$id,
  }
  const dtras = {
    name: "Loan",
    senderEmail: 'bank',
    type: 'debit',
    receiverEmail: email,
    senderAccount: 'bank',
    receiverAccount: bankAccount.accountId,
    amount: principalAmount,
    category: 'Loan',
    receiverUserId: bankUser.$id
  }
  createTransaction(tras)
  createTransaction(dtras)
}

export const getLoans = async (email: string) => {
  try {
    const { database } = await createAdminClient();
    const user = await getuserByEmail({ email: email })
    const useraccountId = await getBankAccountId({ userId: user.$id })
    const accountId = useraccountId.$id

    const loans = await database.listDocuments(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    return parseStringify(loans.documents);
  } catch (error) {
    console.log(error);
  }
}

export const getActiveLoans = async (accountId: string) => {
  try {
    const { database } = await createAdminClient()

    const response = await database.listDocuments(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      [Query.equal('accountId', [accountId]), 
      Query.notEqual('remainingAmount', ['0.0'])]
    )

    return response.documents

  } catch (error) {
    console.log(error)
  }
}

export const repayLoan = async({email, loanReason, repayAmount}: LoanRepayProp) => {
  try {

    const { database } = await createAdminClient()

    const doc = await database.listDocuments(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      [Query.equal('reason', [loanReason])]
    )

    if (doc.documents.length === 0) {
      throw new Error("Loan not found");
    }

    const loan = doc.documents[0] as unknown as loanDoc
    const remainingAmount = parseFloat(loan.remainingAmount) - parseFloat(repayAmount)
    await database.updateDocument(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      loan.$id,
      {
        remainingAmount: remainingAmount.toFixed(2).toString()
      }
    );

    const user = await getuserByEmail({ email: email })
    const bankUser = await getuserByEmail({ email: MAIN_BANK! });
    const bankAccount = await getBankAccountId({ userId: user.$id });
    const bankUserAccount = await getBankAccountId({ userId: bankUser.$id });

    const money = await getAccountBalance(bankAccount.$id);
    const mainMoney = await getAccountBalance(bankUserAccount.$id);

    const newBalance = parseFloat(money.balance) - parseFloat(repayAmount);
    const mainBalance = parseFloat(mainMoney.balance) + parseFloat(repayAmount);
    await updateAccountBalance({ accountId: bankAccount.$id, newBalance: newBalance });
    await updateAccountBalance({ accountId: bankUserAccount.$id, newBalance: mainBalance });

    const repaymentTransaction = {
      name: "Loan Repayment",
      senderEmail: email,
      type: 'debit',
      receiverEmail: 'bank',
      senderAccount: bankAccount.accountId,
      receiverAccount: 'bank',
      amount: repayAmount,
      category: 'Loan Repayment',
      senderUserId: user.$id,
    };

    const repaymentTransactionBank = {
      name: "Loan Repayment",
      senderEmail: email,
      type: 'credit',
      receiverEmail: 'bank',
      senderAccount: bankAccount.accountId,
      receiverAccount: 'bank',
      amount: repayAmount,
      category: 'Loan Repayment',
      receiverUserId: bankUser.$id
    };

    await createTransaction(repaymentTransaction);
    await createTransaction(repaymentTransactionBank);


  } catch (error) {
    console.log(error)
  }
}

export const checkReason = async(reason:string) => {
  try {
    const { database } = await createAdminClient()

    const doc = await database.listDocuments(
      DATABASE_ID!,
      LOAN_COLLECTION_ID!,
      [Query.equal('reason', [reason])]
    )
    if (doc.documents.length === 0) {
      return false
    }

    return true

  } catch (error) {
    console.log(error)
  }
} 
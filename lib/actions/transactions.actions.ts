'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { getuserByEmail } from "./user.actions"; 

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
  APPWRITE_MONEY_COLLECTION_ID:MONEY_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        ...transaction
      }
    )

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const updateAccountBalance = async ({accountId, newBalance}: {accountId: string, newBalance: number}) => {
  try {
    const {database} = await createAdminClient()

    const res = await database.listDocuments(
      DATABASE_ID!,
      MONEY_COLLECTION_ID!,
      [Query.equal('accountId', accountId)]
    )

    database.updateDocument(
      DATABASE_ID!,
      MONEY_COLLECTION_ID!,
      res.documents[0].$id,
      {
        balance: (newBalance).toString()
      }
    )
  } catch (error) {
    console.log(error);
  }
}

export const getBankAccountId = async ({userId}:{userId:string} ) => {
  try {
    const {database} = await createAdminClient()
    const response = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    )

    return parseStringify(response.documents[0])
  } catch (error) {
    console.log(error)
  }
}

export const getAccountBalance= async (accountId:string)=> {
  try{
    const {database} = await createAdminClient()

    const res = await database.listDocuments(
      DATABASE_ID!,
      MONEY_COLLECTION_ID!,
      [Query.equal('accountId', accountId)]
    )

    return parseStringify(res.documents[0])
  } catch (error) {
    console.log(error);
  }
}

export const createTransfer = async ({ name, senderEmail, receiverEmail, amount }: TransferProps) => {
  try {
    const sender = await getuserByEmail({ email: senderEmail });
    const receiver = await getuserByEmail({ email: receiverEmail });
    const senderAccountId = await getBankAccountId({ userId: sender.$id });
    const senderAccount = senderAccountId.accountId;
    const receiverAccountId = await getBankAccountId({ userId: receiver.$id });
    const receiverAccount = receiverAccountId.accountId;
    const senderBalancedoc = await getAccountBalance(senderAccountId.$id);
    const senderBalance = parseFloat(senderBalancedoc.balance);
    const receiverBalancedoc = await getAccountBalance(receiverAccountId.$id);
    const receiverBalance = parseFloat(receiverBalancedoc.balance);

    updateAccountBalance({ accountId: senderAccountId.$id, newBalance: senderBalance - parseFloat(amount) });
    updateAccountBalance({ accountId: receiverAccountId.$id, newBalance: receiverBalance + parseFloat(amount) });

    const senderTransaction = {
      name,
      amount,
      senderAccount,
      senderEmail,
      receiverAccount,
      receiverEmail,
      senderUserId: sender.$id,
      category: 'transfer',
      type: 'debit'
    };

    const receiverTransaction = {
      name,
      amount,
      senderAccount,
      senderEmail,
      receiverAccount,
      receiverEmail,
      receiverUserId: receiver.$id,
      category: 'transfer',
      type: 'credit'
    };

    await createTransaction(senderTransaction);
    await createTransaction(receiverTransaction);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();

    // Fetch transactions where the user is the sender
    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('senderUserId', userId)]
    );

    // Fetch transactions where the user is the receiver
    const receiverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('receiverUserId', userId)]
    );

    // Combine both sets of transactions
    const combinedTransactions = [
      ...senderTransactions.documents,
      ...receiverTransactions.documents,
    ];

    return parseStringify(combinedTransactions);
  } catch (error) {
    console.log(error);
  }
};


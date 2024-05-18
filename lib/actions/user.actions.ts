'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { parseStringify } from "../utils"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  APPWRITE_MONEY_COLLECTION_ID: MONEY_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_COLLECTION_ID
} = process.env

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database} = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0])
  } catch (error) {
    console.log(error);
  }
}

async function generateAccountId() {
  while (true) {
      const accountId = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
      if (!await isAccountIdExists({ accountId })) {
          return accountId;
      }
  }
}

async function isAccountIdExists({accountId}: {accountId: string}) {
  try {

    const { database} = await createAdminClient();
      const response = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [
          Query.equal('accountId', accountId)
      ]);
      return response.documents.length > 0;
  } catch (error) {
      console.error('Error checking if account ID exists:', error);
      return false;
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({userId: session.userId})

    return parseStringify(user)
  } catch (error) {
    console.error('Error', error)
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error('Error creating user')

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id
      }
    )

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const accountId = await generateAccountId();

    await createBankAccount({
      userId: newUser.$id,
      accountId: accountId
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error', error);
  }
}
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id })

    return parseStringify(user)
  } catch (error) {
    return null;
  }
}

export const getuserByEmail = async ({email}: {email: string}) => {
  try {
    const {database} = await createAdminClient()
    const user = await database.listDocuments(
      DATABASE_ID!, 
      USER_COLLECTION_ID!, 
      [Query.equal('email', email)])
    
    // if (user.documents.length === 0) {
    //   return parseStringify(user.documents[0])
    // } else {
    //   return null
    // }

    return parseStringify(user.documents[0])
  } catch (error) {
    console.log(error)
  }
}
export const createBankAccount = async ({
  userId,
  accountId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        accountId,
      }
    )

    const money = await database.createDocument(
      DATABASE_ID!,
      MONEY_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        accountId,
        balance: '0',
      }
    )

    return parseStringify(bankAccount), parseStringify(money);
  } catch (error) {
    console.log(error);
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session')
    await account.deleteSession('current')
  } catch (error) {
    return null;
  }
}

export const getBank = async ({ userId }: getBankProps) => {
  try {
    const { database} = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(bank.documents[0])
  } catch (error) {
    console.log(error);
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getMoney = async ({ userId }: getMoneyProps) => {
  try {
    const { database } = await createAdminClient();

    const money = await database.listDocuments(
      DATABASE_ID!,
      MONEY_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(money.documents[0])
  } catch (error) {
    console.log(error);
  }
}




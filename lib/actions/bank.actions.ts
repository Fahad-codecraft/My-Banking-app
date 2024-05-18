import { parseStringify } from "../utils";
import { getBank } from "./user.actions";

export const getAccount = async ({userId} : getAccountProps) => {
  const bank = await getBank({ userId: userId });

  return parseStringify(bank)
}
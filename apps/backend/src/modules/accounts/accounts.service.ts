import { eq } from "drizzle-orm";
import { db } from "../../db";
import { accountsTable } from "../../db/schema";
import { ApiError } from "../../lib/errors";

const publicFields = {
  id: accountsTable.id,
  createdAt: accountsTable.createdAt,
};

export const getAccount = async (id: string) => {
  const [account] = await db
    .select(publicFields)
    .from(accountsTable)
    .where(eq(accountsTable.id, id));
  if (!account) throw new ApiError(404, "account_not_found", "Account not found");
  return account;
};

// Account data in other tables goes with it via onDelete: "cascade" (#93).
export const deleteAccount = (id: string) =>
  db.delete(accountsTable).where(eq(accountsTable.id, id));

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { accountsTable } from "../../db/schema";

const publicFields = {
  id: accountsTable.id,
  createdAt: accountsTable.createdAt,
};

// requireAccount has already created the account, so it always exists here.
export const getAccount = async (id: string) => {
  const [account] = await db
    .select(publicFields)
    .from(accountsTable)
    .where(eq(accountsTable.id, id));
  return account;
};

// Account data in other tables goes with it via onDelete: "cascade".
export const deleteAccount = (id: string) =>
  db.delete(accountsTable).where(eq(accountsTable.id, id));

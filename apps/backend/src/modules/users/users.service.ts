import { eq } from "drizzle-orm";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { ApiError } from "../../lib/errors";

const publicFields = {
  id: usersTable.id,
  name: usersTable.name,
  createdAt: usersTable.createdAt,
};

export const listUsers = () => db.select(publicFields).from(usersTable);

export const getUser = async (id: number) => {
  const [user] = await db.select(publicFields).from(usersTable).where(eq(usersTable.id, id));
  if (!user) throw new ApiError(404, "user_not_found", "User not found");
  return user;
};

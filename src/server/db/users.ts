import { db } from "@/db";
import { ProductTable, UserSubscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkUserId: string) {
  db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)),
  ]);
}

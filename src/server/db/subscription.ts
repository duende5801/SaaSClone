import { db } from "@/db";
import { UserSubscriptionTable } from "@/db/schema";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  return db.insert(UserSubscriptionTable).values(data).onConflictDoNothing({
    target: UserSubscriptionTable.clerkUserId,
  });
}

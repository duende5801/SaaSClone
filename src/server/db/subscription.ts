import { db } from "@/db";
import { UserSubscriptionTable } from "@/db/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscription !== null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscription.id,
      userId: newSubscription.userId,
    });
  }

  return newSubscription;
}

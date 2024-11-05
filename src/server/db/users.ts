import { db } from "@/db";
import { ProductTable, UserSubscriptionTable } from "@/db/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkUserId: string) {
  const [userSubcriptions, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    db
      .delete(ProductTable)
      .where(eq(ProductTable.clerkUserId, clerkUserId))
      .returning({
        id: ProductTable.id,
      }),
  ]);

  userSubcriptions.forEach((sub) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: sub.id,
      userId: clerkUserId,
    });
  });

  products.forEach((product) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      id: product.id,
      userId: clerkUserId,
    });
  });

  return [userSubcriptions, products];
}

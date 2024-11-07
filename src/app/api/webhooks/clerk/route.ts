import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "@/data/server";
import {
  createUserSubscription,
  getUserSubscription,
} from "@/server/db/subscription";
import { deleteUser } from "@/server/db/users";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created": {
      await createUserSubscription({
        clerkUserId: evt.data.id,
        tier: "Free",
      });
      break;
    }

    case "user.deleted": {
      if (evt.data.id != null) {
        const userSubcription = await getUserSubscription(evt.data.id);
        if (userSubcription?.stripeSubscriptionId != null)
          await stripe.subscriptions.cancel(
            userSubcription.stripeSubscriptionId
          );

        await deleteUser(evt.data.id);
      }
    }
  }

  return new Response("", { status: 200 });
}

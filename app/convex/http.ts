import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { auth } from './auth';

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: '/stripe/webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeKey || !webhookSecret) {
      return new Response('Stripe not configured', { status: 501 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    const signature = request.headers.get('stripe-signature');
    if (!signature) return new Response('Missing signature', { status: 400 });

    const body = await request.text();
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return new Response('Invalid signature', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id: string;
        payment_intent?: string | null;
        metadata?: { caseId?: string };
        amount_total?: number | null;
        currency?: string | null;
      };
      const caseId = session.metadata?.caseId;
      if (caseId) {
        await ctx.runMutation(internal.paymentMutations.markCasePaid, {
          caseId: caseId as Id<'cases'>,
          amount: (session.amount_total ?? 0) / 100,
          currency: session.currency ?? 'gbp',
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        });
      }
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;

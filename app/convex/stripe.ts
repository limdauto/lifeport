'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { getRouteByKey } from './lib/routeConfigs';

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export const createCheckout = action({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.runQuery(internal.cases.getCaseInternal, { caseId: args.caseId });
    if (!caseDoc) throw new Error('Case not found');
    if (caseDoc.paymentStatus === 'paid') {
      return { mode: 'already_paid' as const, caseId: args.caseId };
    }

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route not found');

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return { mode: 'dev' as const, caseId: args.caseId, priceGbp: route.livingPriceGbp };
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${appUrl()}/report/${args.caseId}?tab=inputs&paid=1`,
      cancel_url: `${appUrl()}/checkout?caseId=${args.caseId}`,
      customer_email: caseDoc.email,
      metadata: { caseId: args.caseId, routeKey: caseDoc.routeKey },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: route.livingPriceGbp * 100,
            product_data: {
              name: `Lifeport Living Report — ${route.title}`,
              description: 'Private, updatable relocation report',
            },
          },
        },
      ],
    });

    await ctx.runMutation(internal.paymentMutations.setCheckoutStarted, {
      caseId: args.caseId,
      stripeSessionId: session.id,
    });

    if (!session.url) throw new Error('Stripe session missing URL');
    return { mode: 'stripe' as const, url: session.url, caseId: args.caseId };
  },
});

/** Local dev checkout when STRIPE_SECRET_KEY is not set. */
export const completeDevCheckout = action({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args): Promise<{ alreadyPaid: boolean }> => {
    const caseDoc = await ctx.runQuery(internal.cases.getCaseInternal, { caseId: args.caseId });
    if (!caseDoc) throw new Error('Case not found');
    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route not found');

    const result = await ctx.runMutation(internal.paymentMutations.markCasePaid, {
      caseId: args.caseId,
      amount: route.livingPriceGbp,
      currency: 'gbp',
    });
    return { alreadyPaid: result.alreadyPaid };
  },
});

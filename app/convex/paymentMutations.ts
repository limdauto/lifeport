import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const markCasePaid = internalMutation({
  args: {
    caseId: v.id('cases'),
    amount: v.number(),
    currency: v.string(),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) throw new Error('Case not found');
    if (caseDoc.paymentStatus === 'paid') return { alreadyPaid: true as const };

    const now = Date.now();
    await ctx.db.patch(args.caseId, {
      paymentStatus: 'paid',
      status: 'living_intake_started',
      reportStatus: 'living_intake_started',
      updatedAt: now,
    });

    await ctx.db.insert('payments', {
      caseId: args.caseId,
      stripeSessionId: args.stripeSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      amount: args.amount,
      currency: args.currency,
      status: 'paid',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'payment_completed',
      payload: { amount: args.amount, currency: args.currency },
      createdAt: now,
    });

    return { alreadyPaid: false as const };
  },
});

export const setCheckoutStarted = internalMutation({
  args: { caseId: v.id('cases'), stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.caseId, {
      paymentStatus: 'checkout_started',
      status: 'upgrade_started',
      updatedAt: now,
    });
    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'checkout_started',
      payload: { stripeSessionId: args.stripeSessionId },
      createdAt: now,
    });
  },
});

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const caseStatus = v.union(
  v.literal('check_started'),
  v.literal('check_generating'),
  v.literal('check_ready'),
  v.literal('upgrade_started'),
  v.literal('paid'),
  v.literal('living_intake_started'),
  v.literal('living_generating'),
  v.literal('living_needs_review'),
  v.literal('living_published'),
  v.literal('living_ready'),
);

const paymentStatus = v.union(
  v.literal('unpaid'),
  v.literal('checkout_started'),
  v.literal('paid'),
  v.literal('failed'),
  v.literal('refunded'),
);

const reportType = v.union(v.literal('check'), v.literal('living'));

const reportStatus = v.union(
  v.literal('generating'),
  v.literal('ready'),
  v.literal('needs_review'),
  v.literal('published'),
  v.literal('failed'),
);

const riskLevel = v.union(
  v.literal('low'),
  v.literal('medium'),
  v.literal('high'),
  v.literal('critical'),
  v.literal('unknown'),
);

const sectionStatus = v.union(
  v.literal('generated'),
  v.literal('missing_info'),
  v.literal('needs_review'),
  v.literal('published'),
  v.literal('locked'),
);

const generationJobType = v.union(
  v.literal('check'),
  v.literal('living'),
  v.literal('section_regeneration'),
);

const generationJobStatus = v.union(
  v.literal('queued'),
  v.literal('running'),
  v.literal('succeeded'),
  v.literal('failed'),
);

const packageRecStatus = v.union(
  v.literal('recommended'),
  v.literal('requested'),
  v.literal('paid'),
  v.literal('in_progress'),
  v.literal('completed'),
);

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_email', ['email']),

  cases: defineTable({
    userId: v.optional(v.id('users')),
    email: v.string(),
    name: v.string(),
    routeKey: v.string(),
    originCountry: v.string(),
    destinationCountry: v.string(),
    moveDate: v.optional(v.string()),
    status: caseStatus,
    paymentStatus: paymentStatus,
    reportStatus: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_email', ['email'])
    .index('by_route', ['routeKey'])
    .index('by_status', ['status'])
    .index('by_payment_status', ['paymentStatus']),

  moveProfiles: defineTable({
    caseId: v.id('cases'),
    rawAnswers: v.any(),
    normalizedProfile: v.optional(v.any()),
    missingInfo: v.optional(v.array(v.string())),
    pendingAffectedSections: v.optional(v.array(v.string())),
    pendingChangeSummary: v.optional(v.string()),
    version: v.number(),
    updatedAt: v.number(),
  }).index('by_case', ['caseId']),

  reports: defineTable({
    caseId: v.id('cases'),
    type: reportType,
    status: reportStatus,
    version: v.number(),
    title: v.string(),
    summary: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_case', ['caseId'])
    .index('by_case_type', ['caseId', 'type']),

  reportSections: defineTable({
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    sectionKey: v.string(),
    title: v.string(),
    contentMarkdown: v.string(),
    riskLevel: v.optional(riskLevel),
    status: sectionStatus,
    missingInfo: v.optional(v.array(v.string())),
    expertReviewRecommended: v.optional(v.boolean()),
    sortOrder: v.number(),
    isPremiumLocked: v.optional(v.boolean()),
    updatedAt: v.number(),
  })
    .index('by_report', ['reportId'])
    .index('by_case', ['caseId'])
    .index('by_report_section', ['reportId', 'sectionKey']),

  reportVersions: defineTable({
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    version: v.number(),
    changeSummary: v.string(),
    sectionSnapshots: v.any(),
    createdAt: v.number(),
  }).index('by_report', ['reportId']),

  packageRecommendations: defineTable({
    caseId: v.id('cases'),
    packageKey: v.string(),
    title: v.string(),
    reason: v.string(),
    status: packageRecStatus,
    priceFrom: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_case', ['caseId']),

  payments: defineTable({
    caseId: v.id('cases'),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_case', ['caseId']),

  auditEvents: defineTable({
    caseId: v.optional(v.id('cases')),
    eventType: v.string(),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  }).index('by_case', ['caseId']),

  adminNotes: defineTable({
    caseId: v.id('cases'),
    reportId: v.optional(v.id('reports')),
    author: v.string(),
    body: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_case', ['caseId']),

  generationJobs: defineTable({
    caseId: v.id('cases'),
    reportId: v.optional(v.id('reports')),
    type: generationJobType,
    status: generationJobStatus,
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_case', ['caseId'])
    .index('by_status', ['status']),

  routeConfigs: defineTable({
    routeKey: v.string(),
    slug: v.string(),
    title: v.string(),
    heroHeadline: v.string(),
    heroSubhead: v.string(),
    painPoints: v.array(v.string()),
    checks: v.array(v.string()),
    livingPriceGbp: v.number(),
    checkFields: v.array(v.string()),
    livingReportFields: v.array(v.string()),
    reportSections: v.array(v.string()),
    packages: v.array(v.string()),
    isActive: v.boolean(),
  }).index('by_route_key', ['routeKey']).index('by_slug', ['slug']),

  packageCatalog: defineTable({
    packageKey: v.string(),
    title: v.string(),
    outcome: v.string(),
    priceFromGbp: v.number(),
    isActive: v.boolean(),
  }).index('by_key', ['packageKey']),
});

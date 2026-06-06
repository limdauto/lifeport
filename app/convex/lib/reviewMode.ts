/** When ADMIN_SECRET is set, living reports require founder review before delivery. */
export function founderReviewEnabled(): boolean {
  return Boolean(process.env.ADMIN_SECRET);
}

export function livingReportStatusAfterGeneration(): 'needs_review' | 'published' {
  return founderReviewEnabled() ? 'needs_review' : 'published';
}

export function caseStatusAfterLivingGeneration(): 'living_needs_review' | 'living_published' {
  return founderReviewEnabled() ? 'living_needs_review' : 'living_published';
}

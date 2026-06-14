// Case study data. Each entry drives both the /case-studies index card and its
// /case-studies/<slug> detail page (via src/components/CaseStudy.astro).
//
// HOW TO PUBLISH A REAL CASE STUDY:
//   1. Replace every `TODO:` field below with real, approved facts. Do NOT
//      invent metrics or quotes. Get client permission to name them (or keep
//      `client` anonymized, e.g. "B2B SaaS, Series A").
//   2. Set `published: true`.
//   3. Follow the go-live checklist in SITE_STATUS.md (drop noindex, remove the
//      /case-studies exclusion from the sitemap filter, add the detail URL to
//      deploy.yml IndexNow + link-check.yml).
//
// Only `published: true` entries generate a detail page. The placeholder below
// stays `published: false`, so it renders NO live page and the index shows the
// "first case study in progress" state until you fill it in.

export interface CaseStudyResult {
  /** The headline number, e.g. "+38%", "$1.2M", "3 weeks". */
  metric: string;
  /** What the number measures, e.g. "increase in win rate". */
  label: string;
}

export interface CaseStudy {
  slug: string;
  published: boolean;
  /** Client name, or an anonymized descriptor like "B2B SaaS, Series A". */
  client: string;
  industry: string;
  /** Which service(s) this engagement was, e.g. "Fractional RevOps + CRM Implementation". */
  engagement: string;
  /** One-line summary shown on the index card and hero. */
  summary: string;
  /** 2-4 sentences on the situation/problem. */
  challenge: string;
  /** 3-5 bullets describing what was done. */
  approach: string[];
  /** 3-4 headline outcomes. */
  results: CaseStudyResult[];
  /** Optional closing narrative paragraph on the results. */
  resultsNarrative?: string;
  /** A direct quote from the client. Leave empty to hide the quote block. */
  pullQuote?: string;
  quoteAttribution?: string;
  /** Service slugs to cross-link, e.g. ['fractional-revops', 'crm-implementation']. */
  servicesUsed: string[];
  /** Public hero image path, e.g. "/images/hero-strategy.jpg". */
  heroImage?: string;
}

// ---------------------------------------------------------------------------
// IAN, MINIMAL ASK (one study, shortest version): client (real name OR an
// anonymized descriptor like "B2B SaaS, Series A") + industry + which
// service(s) + what was broken before + what you did (3 to 5 actions) + 3 to 4
// result numbers + (optional) one client quote. No invented metrics.
// PASTE RAW NOTES HERE (bullet dump, any order, rough numbers fine) AND CLAUDE
// POLISHES INTO THE FIELDS BELOW AND SETS published: true:
//   -
// ---------------------------------------------------------------------------
export const caseStudies: CaseStudy[] = [
  {
    slug: 'sample-case-study',
    published: false, // <- set true ONLY after every TODO below is real + approved
    client: 'TODO: Client name (or "B2B SaaS, Series A" if anonymized)',
    industry: 'TODO: Industry (e.g. B2B SaaS, Home Services, Healthcare)',
    engagement: 'TODO: Engagement type (e.g. Fractional RevOps + CRM Implementation)',
    summary:
      'TODO: One sentence on the outcome (e.g. "Rebuilt the revenue stack and cut the sales cycle by a third in one quarter").',
    challenge:
      'TODO: 2-4 sentences describing the situation before the engagement. What was broken, leaking, or slow? Use real specifics, no invented numbers.',
    approach: [
      'TODO: What you did, step 1 (real action taken).',
      'TODO: What you did, step 2.',
      'TODO: What you did, step 3.',
      'TODO: (optional) step 4.',
    ],
    results: [
      { metric: 'TODO: +00%', label: 'TODO: what improved (e.g. increase in win rate)' },
      { metric: 'TODO: $000K', label: 'TODO: what was saved or added' },
      { metric: 'TODO: 00 days', label: 'TODO: time-to-result or cycle reduction' },
    ],
    resultsNarrative:
      'TODO: (optional) A short paragraph tying the numbers together. Delete this field if not needed.',
    pullQuote: 'TODO: A direct quote from the client about the work. Delete this field to hide the quote block.',
    quoteAttribution: 'TODO: Name, Title, Company',
    servicesUsed: ['fractional-revops', 'crm-implementation'],
    heroImage: '/images/hero-strategy.jpg',
  },
];

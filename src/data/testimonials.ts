// Testimonial data, consumed by src/components/Testimonials.astro.
//
// HOW TO PUBLISH REAL TESTIMONIALS:
//   1. Replace every `TODO:` field below with a real, word-for-word quote and
//      the person's real name/title/company. Do NOT invent or paraphrase.
//   2. Get EXPLICIT permission to publish their words + name (and headshot, if
//      used). Without permission, do not publish.
//   3. Drop <Testimonials /> onto index.astro (and optionally for-saas.astro /
//      for-local-businesses.astro). See the go-live checklist in SITE_STATUS.md.
//
// The Testimonials component auto-hides any entry whose quote still starts with
// "TODO:", and renders nothing if none are real, so these placeholders are NOT
// visible on the live /case-studies page. Replace a quote with a real one and
// the section appears automatically.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Optional public headshot path, e.g. "/images/jane-doe.jpg". */
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: 'TODO: Real, word-for-word client quote #1. Get permission before publishing.',
    name: 'TODO: Full name',
    role: 'TODO: Title',
    company: 'TODO: Company',
  },
  {
    quote: 'TODO: Real, word-for-word client quote #2. Get permission before publishing.',
    name: 'TODO: Full name',
    role: 'TODO: Title',
    company: 'TODO: Company',
  },
  {
    quote: 'TODO: Real, word-for-word client quote #3. Get permission before publishing.',
    name: 'TODO: Full name',
    role: 'TODO: Title',
    company: 'TODO: Company',
  },
];

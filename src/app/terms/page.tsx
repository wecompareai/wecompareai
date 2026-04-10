import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";
const LAST_UPDATED = "April 9, 2026";
const EFFECTIVE_DATE = "April 9, 2026";

export const metadata: Metadata = {
  title: "Terms of Use | We Compare AI",
  description:
    "Terms of Use for We Compare AI. Read our terms governing access to wecompareai.com, content use, affiliate disclosures, and user responsibilities.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Use | We Compare AI",
    description: "Terms and conditions governing use of wecompareai.com.",
    url: `${SITE_URL}/terms`,
    siteName: "We Compare AI",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using wecompareai.com (the "Site"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, please do not use the Site. We reserve the right to modify these Terms at any time. Continued use of the Site after changes are posted constitutes your acceptance of the updated Terms.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `We Compare AI provides independent comparisons, rankings, and editorial content about artificial intelligence tools and services. The Site is intended for informational and research purposes. We do not sell, operate, or directly provide any AI products or services reviewed on this Site.`,
  },
  {
    id: "affiliate",
    title: "3. Affiliate & Sponsorship Disclosure",
    content: `Some links on this Site are affiliate links. If you click on an affiliate link and make a purchase or sign up for a service, We Compare AI may receive a commission at no additional cost to you. Affiliate relationships do not influence our editorial rankings or scores — we maintain a strict separation between commercial relationships and editorial content. Where sponsored content or paid placements exist, they are clearly labelled. Our scoring methodology is documented at wecompareai.com/methodology.`,
  },
  {
    id: "accuracy",
    title: "4. Accuracy of Information",
    content: `We strive to keep all pricing, features, and comparison data accurate and up-to-date. However, AI tools change rapidly. Pricing, features, availability, and policies may change without notice. We Compare AI makes no warranty, express or implied, that any information on the Site is current, complete, or error-free. Always verify pricing and features directly with the relevant vendor before making purchasing decisions. We verify our data as of the date shown on each page.`,
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    content: `All content on this Site — including text, graphics, logos, comparison tables, scoring methodologies, and data — is the property of We Compare AI or its content licensors and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, modify, or republish any content from this Site without prior written permission. Short quotes with attribution and a link to the original page are permitted for non-commercial purposes.`,
  },
  {
    id: "user-content",
    title: "6. User-Submitted Content",
    content: `Certain areas of the Site allow users to submit ratings, reviews, or other content. By submitting content, you grant We Compare AI a non-exclusive, royalty-free, perpetual licence to use, display, and distribute that content in connection with the Site. You represent that you have the right to submit such content and that it does not violate any third-party rights. We reserve the right to remove any user-submitted content at our discretion.`,
  },
  {
    id: "prohibited",
    title: "7. Prohibited Uses",
    content: `You agree not to: (a) scrape, crawl, or use automated tools to extract data from the Site at scale without our written permission; (b) use the Site for any unlawful purpose; (c) attempt to gain unauthorised access to any portion of the Site; (d) interfere with or disrupt the integrity or performance of the Site; (e) reproduce or resell our comparison data or scoring methodology for commercial purposes without a written licence agreement.`,
  },
  {
    id: "third-party",
    title: "8. Third-Party Links",
    content: `The Site contains links to third-party websites, products, and services. These links are provided for convenience only. We Compare AI does not endorse, control, or take responsibility for the content, privacy practices, or availability of any third-party sites. Access to third-party sites is at your own risk and subject to their respective terms and conditions.`,
  },
  {
    id: "disclaimer",
    title: "9. Disclaimer of Warranties",
    content: `THE SITE AND ALL CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE COMPARE AI DOES NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.`,
  },
  {
    id: "limitation",
    title: "10. Limitation of Liability",
    content: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE COMPARE AI, ITS OWNERS, EMPLOYEES, AND CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM USE OF THE SITE SHALL NOT EXCEED £100 (GBP).`,
  },
  {
    id: "privacy",
    title: "11. Privacy",
    content: `Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Site, you consent to the collection and use of information as described in our Privacy Policy.`,
  },
  {
    id: "cookies",
    title: "12. Cookies",
    content: `We Compare AI uses cookies and similar tracking technologies to improve your experience, analyse Site traffic, and serve relevant content. By continuing to use the Site, you consent to our use of cookies in accordance with our Cookie Policy. You can manage your cookie preferences at any time via your browser settings or our cookie consent banner.`,
  },
  {
    id: "governing-law",
    title: "13. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    id: "changes",
    title: "14. Changes to These Terms",
    content: `We may update these Terms from time to time. The date of the most recent revision will always be shown at the top of this page. If we make material changes, we will notify users via a notice on the Site. Your continued use of the Site after any changes constitutes acceptance of the new Terms.`,
  },
  {
    id: "contact",
    title: "15. Contact Us",
    content: `If you have questions about these Terms, please contact us via our contact page at wecompareai.com/contact. We aim to respond to all enquiries within 5 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Terms of Use</span>
      </nav>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Terms of Use</h1>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span><strong className="text-foreground">Effective:</strong> {EFFECTIVE_DATE}</span>
          <span><strong className="text-foreground">Last updated:</strong> {LAST_UPDATED}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Please read these Terms carefully before using We Compare AI. By accessing this site you agree to be bound by these Terms.
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mb-10 rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contents</p>
        <ol className="space-y-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-primary hover:underline underline-offset-2"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-base font-semibold text-foreground mb-3">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </section>
        ))}
      </div>

      {/* Divider */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          &copy; {new Date().getFullYear()} We Compare AI. All rights reserved.{" "}
          <Link href="/contact" className="text-primary hover:underline underline-offset-2">Contact us</Link>{" "}
          with any questions about these Terms.
        </p>
      </div>
    </div>
  );
}

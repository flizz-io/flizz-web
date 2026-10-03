# Legal pages — Privacy Policy & Terms and Conditions

Two public routes in `apps/web`, drafted 2026-10-03 (task L1 in [progress-report.md](progress-report.md)):

- `/privacy-policy`
- `/terms-and-conditions`

## How they're built

- **All content lives in `apps/web/constants/legal.ts`.** That includes the company details, the list of services that handle visitor data, and both documents. Components (`components/features/legal/`) only render it. Every change below is an edit to that one file.
- **Written to the UK/EU GDPR standard**, the strictest of the target markets, so the same text covers Bangladesh, the Middle East, Africa and the US for a site like this.
- **No lawyer review**, decided 2026-10-03. Each factual claim was written from what the code actually does. If a lawyer is engaged for client contracts later, have them review these two pages at the same time.
- **Bump `updatedAt`** on a document whenever its substance changes. The page shows it as "Last updated".

## Open decisions — owner to answer

Each item gives the current draft value, so an answer is a small edit. Mark it **Decided** with the answer and the date.

| #   | Decision                                                                                                                                                                | Current draft value                                                                                                                                                                      | Where to change it                                                                          | Status                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1   | **Company details**: registered legal name, registration number, registered address. **Required before launch**: the privacy policy must say who the data controller is | Blank (`null`). Pages fall back to the trading name "Flizz" and show no address                                                                                                          | `legalEntity.legalName`, `.registration`, `.address`                                        | Pending: partnership not registered yet |
| 2   | **Governing law**: which country's law governs the terms and settles disputes                                                                                           | `Bangladesh` (assumed from where the partnership will be registered)                                                                                                                     | `legalEntity.jurisdiction`                                                                  | Pending                                 |
| 3   | **How long data is kept**                                                                                                                                               | Contact messages and bookings 24 months after last contact (clients: for the relationship plus legal/accounting duties); chats 12 months; analytics 14 months; hosting logs per provider | Privacy policy, section 7 "How long we keep it" (`id: 'how-long-we-keep-it'`)               | Pending                                 |
| 4   | **Services listed but not live yet**: keep only those that ship. Add the email provider once L8 picks one                                                               | Calendly (CM8), Cloudflare Turnstile (CM2), Google Analytics and Meta Pixel (L2) are listed                                                                                              | `legalProcessors`. Also the matching sentences in privacy sections 2–4 if a tool is dropped | Pending                                 |
| 5   | **"Cookie settings" link**: the policy promises it in the footer. It only becomes true when the consent banner ships                                                    | Sentence present in privacy section 4 "Cookies and similar storage"                                                                                                                      | Ship L2 before launch (preferred), or remove the sentence                                   | Pending                                 |
| 6   | **Brand name**: "Flizz" or "Flizzio". The pages say "Flizz" (`siteConfig.name`); the header logo shows "Flizzio"                                                        | "Flizz"                                                                                                                                                                                  | `siteConfig` in `apps/web/configs/site.ts`. Same decision as task SEO2                      | Pending                                 |

Once all six are decided: update the values, bump both `updatedAt` dates, and mark L1 done in the progress report.

## Keep in sync

- Adding or removing any third-party script, form field or storage key changes the privacy policy. Update `legalProcessors` and the relevant section in the same PR.
- Section numbers are visible and cross-referenced ("see section 9"). Check those references if sections are added or reordered.

# Bid-NYUAD Project Brief

## Status

Bid-NYUAD is a working MVP scaffold for a verified, peer-to-peer NYU Abu Dhabi
campus-balance market. This brief compares the product package supplied for the
project with the repository implementation reviewed on May 24, 2026.

The product vision centers on trust-first price discovery: verified students
post structured exchange intent, accept a counterpart, coordinate privately,
and record completed trades without the platform taking custody of money or
campus balances.

## Product Goal

Informal balance exchanges currently require students to discover rates and
trusted counterparties through messages or social posts. Bid-NYUAD aims to
reduce that friction by providing:

- verified student access through NetID and NYU email OTP;
- visible market rates and structured orders;
- private post-match coordination;
- trust and safety controls suitable for a small campus community.

The package proposes launching narrowly with Falcon Dirham/AED. The current
code instead exposes multiple currency combinations and seeds several market
pairs, which is useful for demonstration but is a launch-scope decision to
revisit.

## Users And Core Loop

| User | Need |
| --- | --- |
| Buyer | Offer real/campus value for a chosen campus balance at a clear rate. |
| Seller | Find and accept an attractive offer quickly. |
| Moderator | Eventually review safety incidents and disputes. |

The implemented flow is:

1. A user browses available market pairs.
2. A student creates or logs into a verified account using a NetID OTP.
3. A buyer submits a bid for a market pair.
4. Another user accepts the active bid as seller, creating a trade.
5. Buyer and seller use anonymous in-app chat.
6. The buyer may reveal a saved WhatsApp number.
7. The seller alone marks the trade completed or failed.

The intended mature MVP extends this with ask orders, matching locks, both
parties confirming results, and safety/reputation workflows.

## Implementation Assessment

| Capability | Current implementation | Product-package target |
| --- | --- | --- |
| Market discovery | Multi-pair mobile market UI with active bid trends and sample data. | Launch primarily with Falcon/AED and distinguish completed trades clearly. |
| Verification | ID text/file intake, mock OCR adapter, hashed OTP, NYU email construction, 30-day session cookie. | Verified student-only onboarding with production OCR and email delivery. |
| ID storage | Optional private Supabase Storage upload when configured. | Secure identity verification handling. |
| Orders | Buyers create bids with base/quote amounts and optional API expiry; highest bid identified. | Both bid and ask order entry with expiry and trust snapshot. |
| Matching | A seller manually accepts an active bid transactionally and a trade is created. | Manual acceptance plus a short lock timeout and expiry/dispute handling. |
| Messaging | Buyer/seller-only chat API; UI polls every five seconds. | Anonymous post-match chat with safety actions. |
| Contact reveal | Buyer can reveal a saved WhatsApp number after acceptance. | Optional consensual contact reveal after match. |
| Resolution | Seller marks a trade `COMPLETED` or `FAILED`. | Both parties confirm, with dispute/no-show outcomes. |
| Notifications | Highest bid is broadcast to all other verified users; bid acceptance, message, and result events are stored. | Targeted subscriptions, outbid alerts, acceptance, and expiring-match alerts. |
| Safety and reputation | Not represented in the database or UI. | Blocks, reports, moderation queue, completion/no-show metrics, rate limits. |

## Current Architecture

| Area | Responsibility |
| --- | --- |
| Next.js pages and components | Landing, onboarding, markets, account, notifications, and trade-chat interfaces. |
| Route handlers | JSON/form endpoints for verification, bids, market resolution, messaging, contact reveal, and resolution. |
| Domain modules | Currency validation, bid rules, OTP timing/limits, trade-access rules, and notification decisions. |
| Server modules | Session lookup, Prisma queries, SMTP delivery, mock OCR, Supabase uploads, and notification creation. |
| Prisma/PostgreSQL | Persistent users, verification attempts, markets, bids, trades, chat messages, sessions, and notifications. |

### Implemented Data Model

| Entity | Role in the current app |
| --- | --- |
| `User` | NetID-identified verified account and optional WhatsApp number. |
| `Session` | Hashed cookie token with expiry. |
| `VerificationAttempt` | OCR-derived NetID, OTP hash, attempts, and upload reference. |
| `Currency` and `Market` | Supported units and exchange pairs. |
| `Bid` | Buyer offer with amounts, calculated rate, state, and expiry field. |
| `Trade` | Accepted bid with buyer, seller, WhatsApp reveal state, and seller outcome. |
| `ChatMessage` | System or participant communication attached to a trade. |
| `Notification` | Stored event notification with JSON payload. |

## Known Product Gaps

### Must Address Before A Campus Beta

- Remove the `x-user-id` request-header fallback from user-facing
  authentication paths and require real sessions for every private action.
- Implement production-grade OCR or a reviewed manual verification process;
  the current image path uses `MOCK_OCR_NET_ID` unless input text contains a
  recognizable NetID.
- Define identity-document retention, access, deletion, and incident-response
  policy before storing student ID images.
- Add block/report workflows, moderation visibility, basic rate limiting, and
  abuse monitoring.
- Make trade resolution bilateral or provide a dispute path; seller-only
  completion is insufficient for reputation or trusted price history.

### Needed For The Stated MVP Experience

- Represent sellers' asks as well as buyers' bids.
- Enforce order expiration and an accepted-trade lock timer.
- Build market charts from completed trades separately from open intent.
- Add notification subscriptions rather than notifying every verified user of
  a new highest bid.
- Surface trustworthy completion statistics once outcomes are reliable.

## Delivery Roadmap

| Phase | Outcome | Principal work |
| --- | --- | --- |
| 1. Secure closed beta foundation | Testable flow with controlled users. | Session-only authorization, SMTP, verification review, ID privacy rules, rate limiting, audit logging. |
| 2. Trust-safe trade loop | Matches can be completed or escalated credibly. | Lock expiry, bilateral confirmation, failure reasons, report/block, moderator queue. |
| 3. Accurate price discovery | Market views represent real transaction signals. | Ask-side orders, completed-trade tape, separated open-order indicators, expiry processing. |
| 4. Useful liquidity tooling | Students return when a relevant opportunity appears. | Pair watches, outbid alerts, expiry alerts, notification preferences. |
| 5. Controlled evaluation | Evidence for expansion beyond one pair. | Falcon/AED beta, analytics, cohort feedback, launch review. |

## Metrics

The initial evaluation should record:

| Metric | Why It Matters |
| --- | --- |
| Verification completion rate | Whether onboarding enables or blocks liquidity. |
| Active verified traders and bids per trader | Whether the marketplace is actually used. |
| Bid-to-acceptance rate and median time to acceptance | Whether structured discovery is faster than informal coordination. |
| Accepted-to-completed rate | Whether matches are credible. |
| Report/no-show rate per 100 accepted trades | Whether trust controls are sufficient. |
| Repeat trader rate | Whether the product is valuable after first use. |
| Completed-trade spread/rate trend | Whether market information becomes clearer. |

Metrics involving completed trades should not be treated as reliable until
bilateral confirmation or moderation-backed dispute handling is implemented.

## Product Decisions To Resolve

| Decision | Current condition | Recommendation |
| --- | --- | --- |
| Launch market scope | Code supports multiple pair combinations. | Limit the beta UI and analytics to Falcon Dirham/Real Dirham unless testing requires more. |
| Order-book depth | Only buyer bids exist. | Add asks before describing the experience as an order book. |
| Trade truth source | Seller unilaterally closes a trade. | Require buyer acknowledgement or route disagreement to moderation. |
| Notifications | Highest bids notify every verified user. | Use explicit pair watches and user preferences. |
| Identity assurance | OCR adapter is a local scaffold. | Choose a compliant verification workflow before live use. |

## Non-Goals For The MVP

- Payment processing, wallet custody, or escrow.
- Automatic settlement of campus balances.
- Complex multi-leg exchange execution.
- Public social posting or comment feeds.
- Full WhatsApp API integration.

## Reference Documents

- Product source: `bid-nyuad-product-package.md` supplied outside the
  repository.
- Developer setup and implementation overview: [readme.md](./readme.md).
- Deployment and Supabase setup: [DEPLOYMENT.md](./DEPLOYMENT.md).

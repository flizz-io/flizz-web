# Home Page

**Source:** `Home` tab (+ `Home Ref` tab for section-list/structure notes) in the requirements Google Sheet provided by the PM.

Public marketing homepage for `apps/web`. Sections below are in page order.

## Hero

> Hero v3 ("cinematic" — intro loader, reveal, scroll hand-off) is specified in [home-hero-cinematic.md](home-hero-cinematic.md). The copy below applies to every variation.

- **Heading:** Your Technology Partner for What's Next
- **Subheading:** We build transparent, maintainable systems that give you freedom to pivot, scale, or switch vendors without starting over.
- **Text:** Technology decisions have long-term consequences. We bring both technical expertise and business perspective to every project, building solutions that align with where you're going, not just where you are.
- **3 Key USPs:**
    - 30-90 day warranty on all work - we stand behind what we build
    - Realistic timelines with weekly progress - see works, not words
    - Built to evolve - add features and scale without expensive rebuilds
- **CTA:** Schedule a Discovery Call →

## Social Proof

- **Heading:** Trusted by businesses building what's next
- **Content:** `[Company Logos]` — placeholder only, actual logo set not provided yet. **Open question for PM.**

## Problem Section

- **Headline:** Is This How You're Building Your Digital Solutions?
- **Text:** Most businesses face the same frustrating choices when building software.
- **Problem 1 — Generic off-the-shelf tools that don't fit:** You're forcing your unique processes into rigid templates. Manual workarounds everywhere. Features you pay for but never use. Missing the exact capabilities you actually need.
- **Problem 2 — Unreliable freelancers and scattered contractors:** No one owns the full picture. Communication breaks down between specialists. Code quality is inconsistent. You're spending more time managing than building.
- **Problem 3 — Slow-moving agencies or internal teams:** Months of meetings. Endless scope discussions. By the time something ships, requirements have changed. Technical debt piles up because "we'll fix it later."
- **The Real Cost:** Technology that holds you back instead of moving you forward. Competitive advantages you can't capture. Growth opportunities you can't pursue. Teams frustrated by tools that make work harder, not easier.

## Solution Section

> **Content issue:** the sheet reuses the Problem section's headline ("Is This How You're Building Your Digital Solutions?") here too — almost certainly a copy/paste leftover. **Needs a real headline from the PM before build.**

5-step process, each with a "What You Get" line:

1. **Discovery & Strategic Planning** — We don't start coding on day one. We start by understanding your business—current operations, pain points, growth goals, technical constraints. Then we map solutions that actually fit.
   _What You Get:_ Clear technical roadmap, realistic timeline, transparent pricing
2. **Architecture & Design** — Smart architecture decisions now prevent expensive problems later. We design systems for your current needs and future growth—database schema, integrations, security, scalability built in from the start.
   _What You Get:_ Technical blueprint, user flow designs, integration plan
3. **Development with Regular Progress** — Agile development with weekly check-ins. You see working software regularly, provide feedback, and stay involved. No surprises. No black box development.
   _What You Get:_ Working software every 2 weeks, continuous feedback loop
4. **Testing, Security & Launch** — Rigorous testing across scenarios. Security audits. Performance optimization. We launch when it's actually ready—stable, secure, and reliable.
   _What You Get:_ Production-ready software that works under real-world conditions
5. **Training, Documentation & Support** — Complete handoff with documentation, team training, and optional ongoing support. You're never dependent on us, but we're here when you need us.
   _What You Get:_ Knowledge transfer, technical documentation, support options

**Variations** (`<Solution variation>`; words in `processSectionCopy`, shared parts in `solution-parts.tsx`):

- `carousel` (default) — the stages advance on a timer (paused on hover) and can be picked from the rail.
- `scroll` (the home page) — pinned like the Problem section: the page's scroll walks the five stages (70vh each), the rail and console changing together, with a progress line filling beside the rail. The rail moves on one continuous position (`stepPosition`): each step rests fully open for most of its stretch and eases into the next across the boundary, with neighbouring rows always sharing exactly one detail slot, so the rail's height — and everything around it — never shifts. A scroll that stops mid-hand-over settles onto the nearest resting step (`restingProgress`); the console cross-fades between stages rather than emptying between them. Clicking a step glides the page to that step's stretch of scroll, so scroll stays the one thing deciding what's active; "Skip the process" jumps to the end (hidden on the last step). A held section in the curtain. Short screens (≤ 50rem tall) drop the description and tighten the rail so it fits one screen. Large screens only — the carousel stands in below `lg` and under reduced motion, chosen in CSS so nothing swaps after hydration.

## Services

> **Superseded by the Services CRUD feature** (see [progress-report.md](progress-report.md)) — Services are no longer static content. This section shows the home page's "Services" teaser section (a curated subset of cards, each linking to its Single Service detail page), which will pull from the Services list once the feature is built.
>
> The original sheet content that used to be transcribed per-service in `landing-pages/` has been removed — the PM has the source backup and will (re)author each service's content through the admin CRUD, or write it fresh. For the static Stage 2 build, use placeholder/dummy service cards here; do not hand-transcribe the old sheet copy.

**Rail behaviour (large screens):** the teaser's horizontal rail pins mid-viewport and the page's own vertical scroll walks it **one service at a time**. Each service owns `itemScrollVh` of page scroll (a `ServicesTeaser` prop, default `60`vh), and holds the rail still for most of it before easing on to the next across the boundary — each service reads as a stop. A scroll that stops mid-hand-over settles onto the nearer service, so the reader always comes to rest on one. Scrolling up walks back the same way. `stepOnScroll` (prop, default on) turns the stops and scroll-opened popovers off — the rail then pans 1:1 with the scroll and popovers open on hover only. Dragging and horizontal wheel input move the _page_ scroll to the matching position; each edge-arrow click glides to the next or previous service (`hooks/use-pinned-rail.ts`, step maths shared with Our Process in `utils/scroll-steps.ts`). Small screens keep the stacked list; reduced motion keeps the free-scrolling strip.

**Popovers (large screens):** hovering (or keyboard-focusing) a service opens its detail popover across the spine and dims the others. While the rail is pinned, the scroll opens them too: the service the rail is resting on has its popover open, and it hands over halfway through the move to the next — so scrolling through opens every popover in turn, first to last, and back scrolling up unless `stepOnReverse` (prop, default on) is off — then scrolling up opens none, though the rail still stops on each service (its position follows the page's, so it can't differ by direction without jumping). None is open before the pin starts or after it ends. **While the page is scrolling, the scroll's service wins**: hover is set aside, and a pointer parked on the rail doesn't take over as services slide under it. At rest, a hovered service wins again — once the pointer actually moves. Popovers open slow and soft (fade, slight rise, scale and blur, a beat after the connector starts) and close quicker, so a hand-over overlaps into a cross-fade rather than a punch.

**"Click to view details" prompt:** the pointer badge over a service appears only after the pointer has rested on it for 3 seconds. Any pointer movement or wheel scroll hides it and starts the 3 seconds again — on every hover, not just the first.

The sheet grouped candidate services into four categories, kept here only as a naming/scope reference for what the Services CRUD will eventually contain — not as content to build against:

- **Custom Software Development** — MVP Development, SaaS Application Development, Custom Software Development, API development, legacy modernization, Progressive Web Apps, interactive prototyping
- **AI & Automation Solutions** — AI Integration, Intelligent Automation, ML/personalization, Chatbots & Conversational AI, AI-powered search
- **E-commerce Solutions** — Online Store Development, Shopify App Development, Payment Integration, order management, PIM, e-commerce analytics
- **Mobile Solutions** — Native Mobile App Development, clickable prototyping, app modernization

WordPress Plugin Development was also in the sheet but wasn't listed under any category — file under Custom Software Development unless the PM says otherwise.

## Portfolio

- **Heading:** Real Projects, Real Impact
- **Content:** teaser section pulling from the Portfolio/Projects CRUD feature (see [progress-report.md](progress-report.md)), linking through to the Portfolio list/detail pages. No project entries provided yet — use placeholder cards for the static build.

## We Create Solutions That

- **Generate ROI, not just features** — every function built with business impact in mind — revenue, efficiency, or competitive advantage
- **Turn data into decisions** — dashboards and analytics that show what's working and what needs attention
- **Reduce risk through transparency** — clear ownership, documented code, industry-standard tools—never held hostage by complexity
- **Build competitive moats** — custom capabilities and experiences competitors can't replicate with off-the-shelf tools
- **Support your entire growth journey** — from validating concepts to scaling operations, technology that grows with you
- **Win customers through experience** — interfaces that delight, workflows that convert, interactions that build loyalty

## Testimonials

Backed by the Testimonial CRUD feature (see [progress-report.md](progress-report.md)) — testimonials only ever render here, there's no dedicated Testimonials page. No content provided yet — use placeholder quotes for the static build.

## FAQs

- **What's your development process?** We start with discovery to understand your goals and requirements. Then we move to design and architecture planning, followed by iterative development with regular check-ins. You see progress weekly, provide feedback continuously, and we adjust as needed. Post-launch, we offer support and maintenance to ensure everything runs smoothly.
- **Do you only build new software or can you work with existing systems?** Both. We build new applications from scratch, modernize legacy systems, integrate with existing tools, add features to current platforms, and optimize performance. Whether you're starting fresh or improving what you have, we adapt to your situation.
- **Can you integrate with our existing systems?** Absolutely. We specialize in connecting disparate systems through APIs, databases, and middleware. Whether it's your CRM, accounting software, inventory system, or legacy applications - we make them work together seamlessly.
- **What if my needs change during development?** Flexibility is core to our process. We use agile methodology with regular checkpoints to accommodate changes. Major scope changes may adjust timeline or budget, but we handle minor pivots and refinements naturally. You're never locked into the wrong direction.
- **What if something breaks after launch?** All projects include a warranty period (typically 30-90 days) covering bugs and issues related to our work. After that, support agreements cover fixes, updates, and improvements.
- **How do you ensure the software is secure?** Security is built into every phase. We follow industry best practices: secure authentication, encrypted data transmission, regular security audits, vulnerability scanning, and compliance with relevant standards.
- **How do we begin working together?** Schedule a discovery call to discuss your project. We'll explore goals, requirements, and feasibility. If it's a good fit, we provide a detailed proposal with scope, timeline, and cost. After agreement, we kick off with planning and design.

## Final CTA / Contact

- **Headline:** Ready to Build Technology That Actually Works for Your Business?
- **Text:** Whether you're launching something new, scaling what's working, or fixing what's broken - let's talk about how we can help you get there.
- **3 Risk Reversals:**
    - Free discovery call to explore your needs
    - Clear proposal with realistic timeline and transparent pricing
    - You own all code and IP from day one
- **Content:** `[Contact Form]` — fields not specified in the sheet. **Open question for PM.**

## Scroll motion

Modelled on forgeautomotive.co.uk: nothing plays on a clock — every entrance, exit and fill is scrubbed to the scroll, so it moves exactly as fast as the reader, stops when they stop, and runs backwards when they scroll up. All tuning lives in `scrollReveal` (`constants/animation.ts`); all of it is off under reduced motion, and phones get shorter travel.

- **Smoothing** — ScrollSmoother at `1.2s` expo.out, matched to Lenis `lerp: 0.09` (`constants/scroll.ts`).
- **Hero exit** (large screens) — the copy swells, blurs and fades while the scene dims (`heroParallax.exit`).
- **Section entrance** — every `data-section-reveal` section's direct children rise and fade in over their own stretch of scroll; `<Reveal>` items inside do the same (`SectionReveals`, `Reveal`).
- **Curtain** — each section slides up over the one before, which dims toward the page colour. The key sections — the hero, Services, Our Work and Problem (`data-section-hold`) — hold perfectly still while covered; the rest sink at half the scroll speed. Pins (`data-pinned`) and anything wrapping one only dim, never move, so pins measure true; section triggers refresh after every pin (`refreshPriority: -1`) so a section's exit accounts for its own pin spacing. Every section is opaque (a tinted section mixes its tint into the page colour) so nothing ever shows through the one covering it.
- **Full height** (large screens) — every section is at least one screen tall, so each has a moment entirely in view; short content is centred. Held sections keep block layout — a pin with spacing inside a flex column loses its reserved scroll.
- **Headings** — `SectionHeader` titles fill letter by letter (`FillHeading`, GSAP SplitText, screen readers get the whole phrase).
- **Media** — `[data-reveal-media]` plates wipe open from an inset while a `[data-media-zoom]` layer inside settles from a zoom (project cards, the Solution console).

## Design reference notes (from `Home Ref` tab)

- Hero copy variations considered: "Partner", "Startup", "Growth", "grow" — final copy above supersedes these.
- "We Create Solutions That" section and the Contact section both cite [designmonks.co](https://www.designmonks.co/) as visual inspiration.

# About Us Page

**Source:** `About Us` tab in the requirements Google Sheet provided by the PM, extended with scope agreed on 2026-08-31 and PM answers recorded the same day.

Public "About" page for `apps/web`, route `/about`. Stage 3.

> **Built and shipped 2026-08-31** at `/about` — the nav and footer links (`configs/nav.ts:6`, `configs/footer.ts:7`) no longer 404.

## Page purpose

The Home page sells the offer. About's job is the one thing Home can't do: make Flizz feel like a real, accountable counterparty — who is behind this, what they guarantee, how they actually operate. Values alone are claims; this page has to pair them with proof.

## Agreed scope

Full 8-section page, built in a single pass. The two previously blocked sections (origin story and team) were unblocked by the PM on 2026-08-31 with demo content — the PM will replace copy, dates, names, and figures later.

| #   | Section                 | Status                                        |
| --- | ----------------------- | --------------------------------------------- |
| 1   | Hero                    | Ready                                         |
| 2   | Mission                 | Ready                                         |
| 3   | Origin story / timeline | Ready — real founding facts, dummy dates      |
| 4   | Values — 5 cards        | Ready — reframed copy approved                |
| 5   | How we operate          | Ready                                         |
| 6   | Team / founders         | Ready — demo people, behind a visibility prop |
| 7   | Guarantees & numbers    | Ready — dummy figures                         |
| 8   | Final CTA → /contact    | Ready                                         |

**Placeholder policy for this page:** unlike Contact's calendar (which ships an honest empty state), every placeholder here is content the PM will swap 1:1. All of it lives in `constants/about.ts` so replacement never touches a component.

---

## 1. Hero

- **Heading:** Accelerate Growth, Not Complexity

## 2. Our Mission

- **Statement:** To Solve the Technology Problems that Hold Businesses Back

Given full-section room rather than a single line of body copy — this is the page's thesis.

## 3. Origin story / timeline

### Facts confirmed by the PM (real — do not treat as placeholder)

- Founded **March 2024** by **two** people.
- **Two more co-founders joined later** — four co-founders in total.
- Started by building around **their own core product ideas**; **later expanded into services**, solving problems for other companies, startups, businesses, and individuals.

That arc — builders first, service company second — is the page's most distinctive credibility asset. Flizz sells product thinking because it started as a product company, not an agency looking for work. The section should lead with that, not bury it in a date list.

### Milestones — DUMMY DATES, PM to correct

Only March 2024 and the four-co-founder fact are real. Everything else is invented to make the timeline read; the PM will revise.

| Date     | Milestone                                                         | Real?      |
| -------- | ----------------------------------------------------------------- | ---------- |
| Mar 2024 | Founded by two engineers, building their own product ideas        | **Real**   |
| Sep 2024 | Two more co-founders join — the founding team of four is complete | Date dummy |
| Feb 2025 | First external client engagement; the services practice begins    | Dummy      |
| Jul 2025 | Team reaches seven                                                | Dummy      |
| Mar 2026 | AI integration becomes a dedicated practice                       | Dummy      |
| Aug 2026 | 20+ projects shipped                                              | Dummy      |

## 4. Values That Drive Results

Five value cards, each with a title, body copy, and a "Business impact" line.

### Overlap with Home — resolved

As written in the sheet, three of five values restated Home's "We Create Solutions That" section:

| Sheet value                  | Home equivalent                      |
| ---------------------------- | ------------------------------------ |
| ROI Over Features            | "Generate ROI, not just features"    |
| Competitive Moats            | "Build competitive moats" — verbatim |
| Systems That Scale Economics | "Support your entire growth journey" |
| Strategic Partnership        | ≈ "Reduce risk through transparency" |
| Speed as Strategy            | _(genuinely new)_                    |

**Resolution — PM approved the reframe on 2026-08-31.** Home states _outcomes the client gets_; About states _the decision rules that produce them_. Same five values, different angle, no redundancy.

### Approved copy — build against this

1. **We argue features out of scope** — the "no" that protects the budget. Every feature justifies itself by revenue, cost, or competitive position, or it doesn't get built.
   _Business impact:_ Technology spending with measurable returns.
2. **We design for 10x the work, not 10x the headcount** — architecture judged against unit economics, so scaling stays profitable.
   _Business impact:_ Profitable scaling, not just growth.
3. **We build what can't be bought** — where an off-the-shelf tool would do, we say so; custom is reserved for the capabilities that become a moat.
   _Business impact:_ Defensible advantages in your market.
4. **We ship in weeks and decide in hours** — cadence as a commitment, not an aspiration.
   _Business impact:_ Capture opportunities before competitors do.
5. **We push back** — we challenge the brief rather than execute it silently. Often the result costs less than what was originally asked for.
   _Business impact:_ Better solutions, often at lower cost than originally planned.

<details>
<summary>Original sheet wording (superseded — kept for reference)</summary>

1. **ROI Over Features** — We don't build to impress - we build to deliver business results. Every feature justified by impact on revenue, costs, or competitive position.
2. **Systems That Scale Economics** — Handle 10x more work without 10x more people. Technology that improves unit economics as you grow.
3. **Competitive Moats** — Custom capabilities competitors can't copy with off-the-shelf tools. Unique workflows. Proprietary integrations.
4. **Speed as Strategy** — Markets move fast. We help you move faster. MVP in weeks. Features in days. Decisions in hours.
5. **Strategic Partnership** — We challenge assumptions. Suggest alternatives. Optimize for outcomes, not outputs.

</details>

## 5. How we operate

The working relationship, expanded from commitments already made on Home but never justified there:

- Weekly check-ins and working software every two weeks — progress you can see, not status you're told about.
- No black-box development.
- Complete handoff: documentation, team training, optional ongoing support.
- You're never dependent on us — the handoff is designed so you could leave.

Source: Home page process steps 3 and 5, and the hero USPs.

## 6. Team / founders

### Layout — "one frame"

Not a grid of cards. The seven sit edge to edge inside a single bordered frame as vertical slats, on the idea the section states: the company is small enough to fit in one shot. Hovering a slat — or reaching it with the keyboard — opens it and compresses the rest, revealing role and links; a closed slat carries the photograph and the name only.

Deliberately unlike anything else on the site: not the card grid (services, values), the drag carousel (portfolio), the numbered index (process), the timeline rail (§3, contact), the accordion (FAQ), or the marquee (social proof, audiences).

Implementation notes:

- Opening is pure CSS — `flex-grow` under `:hover` and `:focus-within`. No client JavaScript; the section stays server-rendered.
- Use the arbitrary-property form `[flex-grow:2.6]`. Tailwind emits no rule for `flex-[2.6]`.
- The role/links block collapses to zero height (`[grid-template-rows:0fr]`) rather than merely hiding, and the name sits in a fixed two-line box — together these keep all seven names on one baseline regardless of how long a role runs.
- Below `lg` the frame becomes a full-width stack with every detail already visible, since there is no hover on touch.

### Photographs

`TeamPortrait` renders a real photograph via `next/image` when `photo` is set on the member. Until then it shows an initials plate on a dotted ground — honest about being unfilled without looking broken, and no stock faces on a page whose job is earning trust. Supplying `photo` needs no component change.

### Portrait generation prompt (AI)

Portraits come from each member's own photograph. The treatment — flat backdrop, violet rim light, dark wardrobe, consistent crop — is applied to that photograph.

> **Full-frame AI regeneration was tried first and rejected (2026-08-31).** Nano Banana was given the reference photo and the full prompt below. Across repeated attempts on two different people it altered facial geometry slightly every time — enough that the result read as a different person. This is inherent to the method: the model redraws the face from a learned representation rather than preserving the original pixels, and no prompt wording removes that. Do not spend more time tuning the prompt for full-frame generation.

**The face must never be regenerated.** Everything the treatment needs happens around it, so the working method keeps the original face pixels and changes only the surroundings. Two routes, in order of preference:

#### Route A — composite (recommended)

Deterministic, free, no identity risk whatsoever, and about two minutes per person once set up.

1. Cut the subject out of their photo. Photopea (free, browser-based), Photoshop's Select Subject, or remove.bg all do this in one click.
2. Place the cutout on a flat `#181322` canvas at 1200x2000, positioned per the framing spec above — eyes one third down, subject centred, generous margin either side.
3. Add the violet rim: a soft `#8b5cf6` glow on one edge of hair and shoulder, low opacity, same side for every person.
4. Grade all seven identically — slightly desaturated, blacks lifted a touch so hair does not crush into the ground.

Dark wardrobe cannot be faked this way, so ask members to send a photo already wearing something dark, plain and matte.

#### Route B — masked AI edit

Only if the rim light and relighting need to be automated. Mask the face and generate **only** the region outside it, so face pixels pass through untouched: Photoshop Generative Fill with an inverted face selection, or any inpainting tool that takes a mask.

If instead you stay in Nano Banana without a mask, run it as a **staged conversation** rather than one instruction. Each step is a small delta, and small deltas drift less than large ones. Two rules that matter more than the wording:

- **Never ask for an aspect-ratio or crop change during an edit step.** Recomposing forces the model to redraw the whole frame, which is exactly the failure being avoided. Keep the original framing throughout and crop to 3:5 by hand at the end.
- **One change per turn.** Background, then rim light, then wardrobe — checking the face after each.

**Step 1 — background only**

```text
Photo retouching task. Do not redraw or regenerate the person.

The person — face, hair, body, pose, expression, and their existing lighting — must
pass through completely unchanged, pixel for pixel identical to the input. Treat
them as a locked layer.

Make exactly one change: replace the background behind them with a single flat
colour, hex #181322, edge to edge. No gradient, no texture, no vignette, no floor
line, no wall edge, no props.

Keep the original framing, crop and dimensions. Do not recompose, resize, or change
the aspect ratio.
```

**Step 2 — rim light only**

```text
Keep everything from the previous image unchanged, including the face, pixel for
pixel.

Make exactly one addition: a thin violet rim light, hex #8b5cf6, along the right
edge of the hair, cheek and shoulder — a narrow accent following the contour only.

Do not relight the face. Do not brighten or wash the background. Do not change the
person's existing lighting anywhere else.
```

**Step 3 — wardrobe, only if the clothing is light, bright, patterned or logoed**

```text
Keep everything unchanged, including the face and the background.

Change only the colour of the clothing to a plain dark matte charcoal. Preserve its
exact shape, fit, drape, folds and shadows. Do not restyle the garment, do not
change the neckline, and do not alter the body underneath.
```

**If the face shifts at any step**, say so in the same conversation rather than starting over:

```text
The face changed. Restore the face exactly as it was in the original input photo —
same bone structure, same eye spacing, same jawline, same expression. Keep the
background change and discard every alteration to the person.
```

Then crop the finished image to 1200x2000 by hand, per the framing spec above.

#### Route C — graded photographs, no AI at all

If both routes above prove fiddly, the design does not actually require relit portraits. Take the members' own photographs, crop them to 3:5, and apply one consistent grade across all seven — a deep violet-charcoal duotone keyed to `#181322` and `#8b5cf6` works with the page and reads as a deliberate set. Real faces, total consistency, no identity risk, and closest to what the section was designed for.

**How to run it:** whichever route is used, apply it identically to every member. The full generation prompt is kept below for reference and for any future model that handles identity better, but it is **not** the current method — see the routes above.

Ask each person's permission before publishing an AI-restyled portrait of them, and let them see it first.

#### The prompt — use verbatim, do not personalise

```text
Using the supplied photograph as the identity reference, produce a studio portrait
of the same person.

IDENTITY — HIGHEST PRIORITY. Preserve the face exactly as it appears in the
reference: bone structure, eye shape and spacing, nose, mouth, jawline, skin tone
and texture, freckles, moles and other skin marks, hairline, hair texture, facial
hair, apparent age, and the facial expression exactly as given — do not add,
remove, widen or soften a smile. Do not beautify, slim, smooth, de-age, or idealise the
face in any way. The result must be immediately recognisable as the same person to
someone who knows them.

BUILD. Preserve the person's actual body shape exactly as the reference shows it —
the fullness of the face and jaw, the neck, the shoulder width, and the chest. Do
not slim, broaden, straighten, lengthen or otherwise reshape the body. Do not
normalise the build toward an average or idealised physique. If the person is
heavier, slighter, broader or narrower than average, that must remain plainly
visible in the result.

FRAMING. Medium close-up, from just above the top of the head down to mid-chest.
The person is centred horizontally, facing the camera straight on, shoulders square
or turned very slightly. Place the eyes about one third of the way down from the
top edge, with a small margin of empty background above the head. Leave generous
empty background to the left and right of the shoulders, so the person occupies
only the central portion of the frame width. Set the framing from the eye line and
head size alone — never resize or reshape the person to make their shoulders fit a
particular width. A broader person simply fills more of the frame, and that is
correct. Vertical portrait, 3:5 aspect ratio.
Shot on an 85mm lens at portrait distance, no wide-angle facial distortion.

BACKGROUND. A completely flat, seamless studio backdrop in dark violet-charcoal,
hex #181322. One solid colour edge to edge. No gradient, no texture, no vignette,
no props, no floor line, no wall edge, no horizon.

LIGHTING. A single large soft key light from the front left, about 45 degrees off
axis and slightly above eye level, giving soft directional modelling and a gentle
shadow down the right side of the face. Keep fill low so the shadows stay deep.
Add a restrained rim light from behind and to the right, tinted violet (#8b5cf6),
catching the edge of the hair, cheekbone and shoulder to separate the person from
the dark background. The violet rim must read as a thin accent along the edge only,
never a colour wash across the face or background.

WARDROBE. Plain, dark, matte, desaturated clothing — charcoal, deep navy, or dark
forest green. Simple neckline: crew neck, plain collared shirt, or fine knit.
No logos, no text, no patterns, no stripes or checks, no bright or saturated
colour, and not pure black. Replace the clothing from the reference photo if it
does not match this.

FINISH. Cinematic and restrained. Retain natural skin texture with visible pores —
no plastic smoothing or heavy retouching. Slightly desaturated overall. Lift the
blacks very slightly so hair and clothing do not crush into the background. Sharp
focus on the eyes with shallow falloff. A photograph, not an illustration, not a
painting, not a 3D render.

DO NOT INCLUDE. Text, watermarks, signatures, logos, borders, frames, additional
people, hands, props, added jewellery, colour gels other than the violet rim,
background patterns, heavy vignetting, body slimming or reshaping, or idealised
physical proportions of any kind.
```

#### What to ask team members for

Expression is standardised at the reference-photo stage, not in the prompt — forcing a
different expression would mean altering the face, which fights the identity constraint.
So the request to each member has to be the same:

- **Relaxed and direct to camera.** Mouth closed, or the faintest hint of a smile. Not a
  broad grin, not deadpan.
- **Eyes engaged with the lens.** At 183px wide this is the only thing that reliably
  survives the crop — a warm gaze carries the portrait, a mouth does not.
- **Head straight on**, no chin tilt up or down, shoulders square.
- **Glasses on** if that is how they normally appear; consistency with real life beats
  consistency with each other here.

People cannot perform "slight smile" on request — they either grin or freeze. Give them
the behaviour instead: _smile fully, then let it fall about seventy percent, and shoot
there._ Or have them exhale first and look straight down the lens.

#### Keep identical across all seven runs

What has to match across the seven is the **treatment**, never the people. Identical camera, lens, distance, lighting, background and eye line; genuinely different faces, builds and colouring. A set where everyone has been quietly reshaped to the same physique is the clearest signal that the images were machine-made, and it would sit badly on a page that sells straight dealing.

Generating one at a time makes drift the main risk — the slats sit shoulder to shoulder, so any variance is obvious. Do not vary: the prompt text, the background hex, the key-light direction, the eye-line placement, the crop, or the lens description. When all seven are done, view them side by side and check the eye lines land at the same height before committing.

#### Fixing a bad result

| What went wrong                            | What to change                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Doesn't look like the person               | Use a sharper, front-facing, well-lit reference. Repeat the IDENTITY block twice.            |
| Skin looks plastic or over-retouched       | Add "unretouched, natural skin, visible pores and fine lines, documentary realism".          |
| Violet is washing over the face            | Change "restrained rim light" to "barely perceptible rim light on the edge only".            |
| Background not flat, or has a gradient     | Add "solid uniform #181322 fill, zero variation in tone across the entire frame".            |
| Head too large or cropped                  | Add "full head visible with clear space above it; head height about half the frame".         |
| Wrong aspect ratio                         | Set 3:5 in the tool, then crop manually to 1200x2000 — see the size spec above.              |
| Faces sit at different heights             | Regenerate the outlier with "eyes exactly one third down from the top edge".                 |
| Someone looks slimmer than they really are | Repeat the BUILD block verbatim at the end of the prompt, naming the specific trait to keep. |

### Links

Each member carries up to three: LinkedIn, X, and a personal portfolio site. Rendered as mono text labels, matching the footer's social-link treatment rather than introducing an icon set. Any of the three may be omitted per person and the row adapts.

> This reverses the PM's earlier answer that team cards should carry no outbound links; links were requested on 2026-08-31 when the section was redesigned. Bios were dropped in the same pass.

### Roster

Seven demo people, four marked founder to match the real founding story. Names, roles, and profile URLs are placeholder — **the URLs currently resolve to nothing**, so they must be replaced or removed before launch.

### Visibility prop

The PM asked for the section to be toggleable from the page:

```tsx
<AboutTeam isVisible={showTeamSection} />
```

The default lives in `constants/about.ts`. The component returns `null` when false, so the section can be pulled without editing markup or leaving dead code.

## 7. Guarantees & numbers

The page's proof block — the commitments Flizz will be held to, gathered in one place:

- 30–90 day warranty on all work.
- You own all code and IP from day one.
- Realistic timelines with weekly progress.
- Clear proposal with transparent pricing, after a free discovery call.
- Built to evolve — add features and scale without expensive rebuilds.

Source: Home hero USPs and Final CTA risk reversals.

### Figures — DUMMY, PM to correct

| Figure           | Value | Note                                               |
| ---------------- | ----- | -------------------------------------------------- |
| Founded          | 2024  | **Real** — March 2024                              |
| Projects shipped | 20+   | Matches Home's `stats` band — keep the two in sync |
| Team size        | 7     | Matches the demo roster length                     |
| Clients served   | 18    | Dummy — plausible against 20+ projects             |

**Consistency rule:** Home's `stats` array already publishes "20+ Projects shipped", "30 days warranty", "2 wks cadence", "100% code and IP yours". About must not contradict those. If the PM revises a figure, both pages change together.

## 8. Final CTA

Routes to `/contact`. Should not clone the Home final CTA's copy — this one lands after the trust argument, so it can be shorter and more direct.

---

## PM answers — recorded 2026-08-31

All nine outstanding questions are answered; nothing on this page is blocked.

| #   | Question              | Answer                                                                                          |
| --- | --------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Team section wanted?  | Yes — with a prop to show/hide the section from the page                                        |
| 2   | How many people?      | 6–7 → building 7                                                                                |
| 3   | Names, roles, bios    | Use demo content; PM will replace                                                               |
| 4   | Photo treatment       | Be creative, match the site's vibe → generative constellation portraits                         |
| 5   | Link out to LinkedIn? | No links                                                                                        |
| 6   | Founding year and why | March 2024, two founders → two more co-founders joined; own product ideas first, services later |
| 7   | Milestones            | Guess / dummy dates; PM will update                                                             |
| 8   | Publishable numbers   | Use dummy data                                                                                  |
| 9   | Values copy           | Reframed version approved                                                                       |

### Still to come from the PM (non-blocking)

- Real team names, roles, bios — and a decision on whether to keep generated portraits or supply photos.
- Correct milestone dates for everything after March 2024.
- Real figures for projects shipped, team size, and clients served — kept in sync with Home's `stats`.

# NOVA — Instagram Reel Strategy

> Ready-to-execute Reel concept for **NOVA**, the deep-tech brand whose marketing
> site lives in this repo. The site's own WebGL particle scenes (Hero ribbon,
> Orb, Performance vortex, Terrain dune-grid, Hourglass CTA) double as your
> highest-production-value b-roll — screen-record them and you have a cinematic
> Reel for the price of a phone shoot.

---

## Context (assumptions — swap freely)

| Field | Locked-in value |
|---|---|
| **Brand** | NOVA — deep-tech infrastructure |
| **Tone** | Bold + clean + cinematic-futuristic (premium, never busy) |
| **Audience** | Founders, ML/infra engineers, technical early adopters 25–40; plus future-curious builders. Pain: shipping fast AI/compute workloads is slow, expensive, and ops-heavy. |
| **Featured offer** | NOVA early-access **waitlist** (the site's email capture) |
| **Goal priority** | Views → Followers → Website Visits → Sales (waitlist signups) |
| **Production budget** | DIY phone shoot + free screen-recording of the live WebGL site (small crew optional for Version A) |
| **Brand palette** | `#050505` black · cyan `#22D3EE` → blue `#3B82F6` → orange `#FF5E3A` → red `#FF3B00` gradient |
| **Type** | Inter. Eyebrow = ALL CAPS, 0.35em tracking. Headlines = tight, heavy. |

The **ONE secret benefit** woven through everything below:
> *"NOVA spins up in the time it takes your coffee to cool — first workload live in under 60 seconds, no cluster to babysit."* (Specific, surprising, screenshot-able.)

---

## 1. HOOK (first 1–3s) — 3 variations

No logo in the first 2 seconds. Each hook is a pattern interrupt over the dark
particle field.

**Hook A — Bold claim (aspirational)**
- *Visual:* Black screen. The cyan→red particle ribbon snaps into frame from a single point of light.
- *Text overlay:* "Your infra shouldn't take longer than your coffee. ☕"

**Hook B — Pain point (relatable)**
- *Visual:* Hard cut between a frozen loading spinner / red CI-fail log and the glowing NOVA orb igniting.
- *Text overlay:* "POV: it's 2am and the cluster is *still* not up."

**Hook C — Pattern interrupt (visual shock)**
- *Visual:* Extreme slow-mo of the Hourglass scene — particles converging — played in REVERSE so they explode outward. Looks like nothing else in the feed.
- *Text overlay:* "This isn't a screensaver. It's compute."

---

## 2. SCRIPT (22s) — two-column

Problem → Agitation → Solution. Soft CTA. Voiceover OR text-only (see §4).

| TIME | LEFT — VISUAL | RIGHT — AUDIO / TEXT OVERLAY |
|---|---|---|
| [0:00–0:03] | Black → cyan particle ribbon ignites from one point (Hero scene) | **VO:** "You had the idea months ago." · *Overlay:* "Your infra shouldn't take longer than your coffee." |
| [0:03–0:06] | Red CI-fail logs, spinning loader, Slack pings stacking | **VO:** "But standing up the infra? That's where it died." · *Overlay:* "setup. configs. waiting." |
| [0:06–0:09] | Loader freezes → screen cracks to black (SFX riser) | **VO:** "Provisioning. YAML. A cluster you have to babysit." |
| [0:09–0:12] | The NOVA Orb ignites — bloom flares, filament rings spin up | **VO:** "NOVA flips that." · *Overlay:* "one command." |
| [0:12–0:16] | Performance scene: particle vortex + stat cards counting up | **VO (the secret):** "First workload live in under 60 seconds. No cluster to babysit." · *Overlay:* "< 60s. live." |
| [0:16–0:19] | Terrain dune-grid ripples; camera drifts forward, calm | **VO:** "It just runs. While you go build the actual thing." |
| [0:19–0:22] | Hourglass particles converge into the NOVA wordmark + email field | **VO (soft CTA):** "Early access is open. We're letting people in in waves." · *Overlay:* "join the waitlist → link in bio" |

---

## 3. VISUAL DIRECTION — shot-by-shot

| # | Shot | Movement | Notes |
|---|---|---|---|
| 1 | Particle ribbon ignites from a single point | Slow push-in | Screen-record Hero scene; start on pure black |
| 2 | Failure montage: red logs, loader, Slack | Fast handheld jump-cuts | Phone-shot of a laptop, slightly off-axis, raw |
| 3 | Glitch/crack transition to black | Whip + shake | Sell the "old way breaking" |
| 4 | NOVA Orb ignites, bloom flare | Locked-off, let bloom breathe | The "hero reveal" beat |
| 5 | Performance vortex + stat cards counting | Slow orbit | This is the screenshot moment — hold it |
| 6 | Terrain dune-grid ripple | Slow forward drift | The "calm after" — exhale |
| 7 | Hourglass converge → wordmark + email | Particles pull to center | Logo lands HERE (≈19s), never earlier |
| 8 | (optional) Talent close-up reaction | Handheld, eye-level | UGC trust beat for Version B |

- **Lighting:** Site scenes = self-lit WebGL bloom on `#050505`. Live talent = single soft key, dark moody background, screen-glow on the face (cyan/orange spill). UGC version = window light, raw.
- **Color & mood:** Near-black base, cyan→blue→orange→red gradient as the ONLY color. Premium, weightless, a little sci-fi. No clutter.
- **Props/set:** Laptop, dark desk, coffee cup (callback to the hook), maybe a single warm practical light off-frame for spill.
- **Talent:** One technical founder type, 28–38, calm confidence — *not* hype-bro. Energy: low-key certain. The product does the shouting; the person is the reassurance.

---

## 4. AUDIO STRATEGY

- **Layering:** Use **both** — a trending sound at low bed volume + a tight VO on top. If you want max reach, ship a **text-only / VO-light** cut so it works muted (most infra/tech viewers scroll on mute at work).
- **3 trending audio directions:**
  1. **Satisfying / tech-minimal** — clean pulsing synth with a "drop" on the Orb reveal (best for retention; sync the ignition to the beat).
  2. **Cinematic / emotional build** — slow swelling pad that crescendos at the <60s stat. Great for the aspirational Version A.
  3. **Upbeat / momentum** — driving electronic loop for the UGC Version B; feels fast, modern, shareable.
- **SFX retention moments:**
  - Riser + hard *thump* on the crack-to-black (0:06–0:09).
  - "Power-on" whoosh on the Orb ignition (0:09).
  - Satisfying tick/UI-blip on each stat card landing (0:12–0:16).
  - Soft chime as particles snap into the wordmark (0:19).

---

## 5. TEXT OVERLAYS & CAPTIONS

**On-screen text (placement / timing):**
- All caps, Inter, heavy weight, 0.35em tracking on eyebrows — match the site.
- Center-lower third, away from the UI safe zones.

| Timing | Text | Style |
|---|---|---|
| 0:00 | "Your infra shouldn't take longer than your coffee" | Bold, fades in word-by-word |
| 0:03 | "setup. configs. waiting." | Minimal, lowercase, dims |
| 0:09 | "one command" | Bold, snaps in on beat |
| 0:12 | "< 60s. live." | Heaviest weight, gradient fill |
| 0:19 | "join the waitlist → link in bio" | Bold + small arrow, persistent to end |

**Caption copy:**
> Standing up infra used to kill the idea before you built it. ⏳
> NOVA: first workload live in under 60 seconds. No cluster to babysit.
> We're letting builders in in waves.
> 👉 Waitlist in bio.
> Comment **"NOVA"** and I'll send you the early-access link.

---

## 6. HASHTAG STRATEGY

- **Niche (<500K):** #devtools #mlinfra #aiinfrastructure #buildinpublic #infraascode
- **Mid (500K–5M):** #devops #machinelearning #cloudcomputing #saas #aitools
- **Broad (5M+):** #tech #ai #coding
- **Branded / community:** #BuiltOnNova #NovaWaitlist

---

## 7. POSTING STRATEGY

- **Best time:** **Tuesday or Wednesday, 8:30–10:00am** (your audience's timezone) — technical audiences scroll over morning coffee and at standup. Backup: Thursday ~12:30pm.
- **First-30-min engagement bait:**
  - Pin a comment: *"How long does your infra take to stand up — be honest 👇"* (invites confession + replies).
  - Reply to every comment within 30 min with a follow-up question; auto-DM the early-access link to anyone who comments "NOVA."
- **Story funnel (3 frames) alongside the Reel:**
  1. **Frame 1 (tease):** Reel teaser clip + "we built the thing 👀" + poll: "infra setup: minutes or hours?"
  2. **Frame 2 (proof):** The <60s stat card + "this is the part nobody believes" + "Watch the Reel" sticker → the Reel.
  3. **Frame 3 (convert):** Wordmark + "Waitlist is open — link below" + Link sticker to the site.
- **Paid boost (if budget):** $50–100 over 4 days. Objective: **Profile visits / Link clicks**. Audience: lookalike of site visitors + interests (AWS, Kubernetes, Vercel, ML, startups), 25–40. Boost ONLY after it clears ~55% 3s-retention organically — don't pay to amplify a weak hook.

---

## 8. CONVERSION OPTIMIZATION

- **Link-in-bio / landing page (match the Reel's energy):** Send straight to the live NOVA site — same particle Orb, same gradient, same dark mode. Continuity = trust. Headline above the fold should echo the hook verbatim: *"First workload live in under 60 seconds."* Email field in view without scrolling (the site's CTA scene).
- **Offer / incentive:** Early-access waitlist with a **"first 500 get founding pricing + priority onboarding"** scarcity hook. Optional: a 60-second interactive demo or a "how fast is your stack?" quiz that ends at the email capture.
- **Viewers → followers AND buyers in one Reel:** The Reel earns the **follow** (cinematic, repeat-watchable, identity-signaling — "I'm the kind of builder who's early to this"). The pinned comment + caption "comment NOVA" earns the **DM/click**. The Story funnel closes the **waitlist signup** same-session. Three capture points, one asset.

---

## 9. PERFORMANCE BENCHMARKS TO TARGET

- **3-second retention:** **60%+** (hook does this — the ribbon ignition + bold claim).
- **Full watch / avg watch:** **40%+** (keep it ≤22s; the Orb reveal at 9s is the mid-retention save).
- **Save rate:** **5%+** — the <60s stat card is the save-bait ("I'll send this to my CTO later").
- **Share trigger:** The **<60s claim + the reverse-hourglass visual**. People send it with *"is this real?"* / *"we need this."* Build the share around disbelief, not features.

---

## 10. A/B VARIATIONS TO TEST

- **Version A — Aesthetic / aspirational:** Pure WebGL scenes, cinematic emotional audio, VO-led, no face. Sells the *feeling* of effortless infra. Best for cold reach + follows.
- **Version B — Raw UGC / relatable:** Founder talking-head, phone-shot, "I almost killed this project waiting on infra — then this happened," cut with the site b-roll. Best for trust + DMs.
- **Version C — Educational / surprising fact:** Lead with "Most teams burn 3 days standing up infra. Here's the 60-second version." Screen-record an actual one-command spin-up + the counting stats. Best for saves + shares (the "secret" angle).

Ship A and C first (no talent needed). Add B once you have a founder on camera.

---

### Production shortcut (this repo)
Run `npm run dev`, screen-record each scene in full-screen at 1080×1920 (or
record desktop and reframe vertical), then cut to the timestamps above. The
Hero ribbon, Orb, Performance vortex, Terrain, and Hourglass map 1:1 to shots
1, 4, 5, 6, 7. That's the entire visual track — no render budget required.

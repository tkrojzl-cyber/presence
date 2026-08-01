# presence.js

Zero-dependency visitor intelligence. No cookies. No backend. No network calls. One 12KB script.

Drop it in. Your page knows who is visiting and what they need in under 2ms, before your first component renders.

## What it does

Large companies have spent billions building systems that figure out who a visitor is before they speak. That capability was locked behind enterprise contracts, CDPs, ML teams, and cookie consent banners.

Presence changes that. It reads fourteen browser signals that were always there, classifies every visitor into one of nine intent states across three axes, and tells your page exactly what to show and what to suppress.

This is what democratising the internet looks like. Not another SaaS dashboard at $500/month. A file. That anyone can drop into any page.

## Install

CDN (fastest):

```html
<script src="https://cdn.jsdelivr.net/gh/tkrojzl-cyber/presence@main/presence.js"></script>
```

Self-hosted:

```html
<script src="presence.js"></script>
```

npm: coming in v2.2.0

## The 3-Axis Intent Model (v2.1.0)

Every visitor is classified across three axes simultaneously.

### Axis 1 - Arrival Energy

How intentional was this visit?

| Value | Meaning | How detected |
|---|---|---|
| passive | Arrived via link, social, referral | referrer present |
| active | Came directly, typed URL, bookmarked | no referrer, returning |
| committed | High-intensity returning visitor | high totalVisits + isReturning |

### Axis 2 - Cognitive Mode

What are they trying to do right now?

| Value | Meaning | How detected |
|---|---|---|
| exploring | Scanning, deciding if this is worth attention | first session, low scroll depth |
| evaluating | Reading properly, comparing, thinking | scroll depth >30%, time >30s, UTM signals |
| executing | Ready to act, needs the trigger | 3+ page views this session |

### Axis 3 - Trust Level

Do they know you yet?

| Value | Meaning | How detected |
|---|---|---|
| stranger | First visit or very few visits | totalVisits < 3 |
| acquaintance | Has been here, not yet invested | 3-9 visits |
| insider | Long tenure, high intensity | 7+ days since first visit, HIGH intensity |

## The 9 Intent States

The three axes combine into a single `intentState` string and a `recommendedExperience`:

| Intent State | Who they are | What they need |
|---|---|---|
| passive_exploring_stranger | Random discovery | Hook fast. One sentence. One CTA. |
| passive_evaluating_stranger | Arrived via link, reading carefully | Social proof first. No noise. |
| passive_evaluating_acquaintance | Drifted back, still deciding | The one thing that removes doubt. |
| active_exploring_stranger | Came looking, first time | Lead with the thesis, not features. |
| active_evaluating_stranger | Researching you specifically | Evidence. Depth. Code over copy. |
| active_evaluating_acquaintance | Coming back to decide | Remove the last objection. |
| committed_executing_acquaintance | Ready to act, nearly there | Kill friction. Just the button. |
| committed_executing_insider | Power user, already sold | Give them the next level. |
| committed_evaluating_insider | Deep engagement, invested | Reward them. Depth, community. |

## All Signals (v2.1.0)

**v1 signals:**

1. Referral source - document.referrer + URL params
2. Time of day - hour bucketed into EARLY / DEEP_WORK / AFTERNOON / EVENING / LATE
3. Day of week - WEEKDAY vs WEEKEND
4. Device - screen width + touch points (MOBILE / DESKTOP / WIDE / NARROW)
5. Hardware - multi-signal composite (cores, deviceMemory, pixelRatio, dark mode, pointer, screen area, color depth, connection quality, reduced motion, hover capability). Scored 0-100 across 10 weighted signals.
6. Locale / Language - navigator.language
7. Timezone / Market - Intl.DateTimeFormat (NA / EU / APAC / OTHER)
8. Session history - sessionStorage page view count
9. Visit intensity - localStorage total visit count (LOW / MEDIUM / HIGH)
10. Returning visitor + recency - localStorage first seen + last seen timestamps

**v2 signals (new in 2.0.0):**

11. scrollDepthLastVisit - How far the visitor scrolled on their last visit (%). Written to localStorage on beforeunload. Reveals scanner vs reader.
12. timeOnPageLastVisit - How long they spent on their last visit (seconds). Written to localStorage on beforeunload. Reveals passive drift vs intentional read.
13. utmContent - utm_content parameter. Carries creative or audience variant intent.
14. utmTerm - utm_term parameter. Carries explicit search keyword intent.

## Quick start

```html
<script src="presence.js"></script>
<script>
  var s = Presence.signals;

  // Adapt by profile
  if (s.profile === 'developer') {
    document.getElementById('hero').textContent = 'Zero-dependency. Drop one script tag.';
  }

  // Adapt by intent state
  if (s.recommendedExperience === 'hook_fast') {
    document.getElementById('nav').style.display = 'none';
    document.getElementById('cta').style.display = 'block';
  }

  if (s.recommendedExperience === 'reduce_friction') {
    document.getElementById('intro').style.display = 'none';
  }
</script>
```

## API

```javascript
// Core signals object - all data in one place
Presence.signals

// Get current profile
Presence.getProfile()  // 'developer' | 'founder' | 'researcher' | 'deep_work' | 'default'

// Get intent state
Presence.getIntentState()  // e.g. 'active_evaluating_stranger'

// Get recommended experience
Presence.getExperience()  // e.g. 'proof_first'

// Get any signal by key
Presence.get('bootMs')  // e.g. 1

// Run code for specific profiles
Presence.when('developer', function(s) {
  showCodeExample();
});

// Run code for specific intent states
Presence.whenState('committed_executing_insider', function(s) {
  showAdvancedDocs();
});

// Run code for recommended experience type
Presence.whenExperience('reduce_friction', function(s) {
  hideIntro();
  highlightCTA();
});

// Swap text content by profile
Presence.adapt('#headline', {
  developer: 'Drop one script. Know everything.',
  founder: 'Your page. Personalised. No backend.',
  default: 'Visitor intelligence for every site.'
});

// Show element only for certain profiles
Presence.showFor('#github-link', ['developer', 'researcher']);

// Debug - prints all signals to console
Presence.debug()
```

## CSS targeting

Presence sets data attributes on `<body>` automatically:

```css
/* Different hero for different profiles */
[data-presence="developer"] .hero-copy::after {
  content: 'Zero-dependency. 12KB. No build step.';
}

/* Show CTA only when visitor is ready to execute */
[data-presence-mode="executing"] .cta-block {
  display: block;
}

/* Trust-level based social proof */
[data-presence-trust="stranger"] .testimonials { display: block; }
[data-presence-trust="insider"] .testimonials { display: none; }

/* Suppress intro for committed visitors */
[data-presence-energy="committed"] .intro-section { display: none; }
```

Available attributes:

- `data-presence` - profile
- `data-presence-source` - referral source
- `data-presence-device` - device type
- `data-presence-market` - NA / EU / APAC / OTHER
- `data-presence-intensity` - LOW / MEDIUM / HIGH
- `data-presence-returning` - true / false
- `data-presence-lang` - language code
- `data-presence-hardware` - hardware tier
- `data-presence-dayctx` - WEEKDAY / WEEKEND
- `data-presence-intent` - full intent state
- `data-presence-mode` - cognitive mode
- `data-presence-energy` - arrival energy
- `data-presence-trust` - trust level

## Verify it yourself

One claim: no network calls. Verify in 30 seconds.

```bash
grep -n "fetch\|XMLHttpRequest\|WebSocket\|navigator.sendBeacon\|new Image" presence.js
```

You will find nothing. The script runs entirely in the browser. No data leaves the device.

## License

MIT. Use it, fork it, modify it, ship it.

Built by Brainiac Ltd.


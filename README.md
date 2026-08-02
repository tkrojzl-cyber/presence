 presence.js

Zero-dependency visitor intelligence. No cookies. No backend. No network calls. One file, no build step.

It reads browser signals that are already available client-side, classifies each visitor into one of nine intent states across three axes, and exposes the result as a single object your page can read before the first component renders.

## Install

CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/tkrojzl-cyber/presence@main/presence.js"></script>
```

Self-hosted:

```html
<script src="presence.js"></script>
```

npm: planned for v2.2.0.

## The 3-Axis Intent Model (v2.1.0)

Each visitor is classified across three axes. The combination produces a single `intentState` string.

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

Each state maps to a `recommendedExperience` value, plus arrays of elements to suppress and emphasise.

| Intent State | recommendedExperience | Suppress | Emphasise |
|---|---|---|---|
| passive_exploring_stranger | hook_fast | long_copy, pricing_detail, faq | headline, single_cta |
| passive_evaluating_stranger | proof_first | hero_video, feature_list | social_proof, code_example, github_link |
| passive_evaluating_acquaintance | remove_doubt | hero, intro_copy | objection_handler, comparison, guarantee |
| active_exploring_stranger | thesis_first | pricing_cta, sign_up_prompt | core_idea, founder_voice |
| active_evaluating_stranger | proof_first | hero_video, feature_list | social_proof, code_example, github_link |
| active_evaluating_acquaintance | remove_doubt | hero, intro_copy | objection_handler, comparison, guarantee |
| committed_executing_acquaintance | reduce_friction | hero, intro_copy, social_proof | primary_cta, one_click_action |
| committed_executing_insider | next_level | intro_copy, basic_features | advanced_docs, api_reference, changelog |
| committed_evaluating_insider | deepen_value | cta_primary | case_study, advanced_config, community |

## All Signals (52 in v2.1.0)

**Profile and Intent (8):**

1. `profile` - Visitor archetype (developer, founder, researcher, deep_work, default)
2. `intentState` - Full 3-axis classification string
3. `arrivalEnergy` - Axis 1: passive / active / committed
4. `cognitiveMode` - Axis 2: exploring / evaluating / executing
5. `trustLevel` - Axis 3: stranger / acquaintance / insider
6. `recommendedExperience` - What to show this visitor
7. `suppressElements` - Array of UI elements to hide
8. `emphasiseElements` - Array of UI elements to highlight

**Source and Referral (7):**

9. `source` - Traffic source (DIRECT / SEARCH / SOCIAL / REFERRAL / UTM / OTHER)
10. `referrer` - Raw document.referrer
11. `utmSource` - utm_source parameter
12. `utmMedium` - utm_medium parameter
13. `utmCampaign` - utm_campaign parameter
14. `utmContent` - utm_content parameter
15. `utmTerm` - utm_term parameter

**Time Context (4):**

16. `timeWindow` - EARLY / DEEP_WORK / AFTERNOON / EVENING / LATE
17. `dayContext` - WEEKDAY / WEEKEND
18. `hour` - 0-23
19. `isWeekend` - boolean

**Device and Touch (4):**

20. `device` - MOBILE / DESKTOP / WIDE / NARROW
21. `width` - window.innerWidth
22. `isTouch` - boolean
23. `touchPoints` - navigator.maxTouchPoints

**Hardware and Capability (11):**

24. `capabilityScore` - 0-100 composite across 10 hardware signals
25. `capabilityTier` - LIMITED / CAPABLE / POWERFUL
26. `hardwareProfile` - LOW / MID / HIGH
27. `cores` - navigator.hardwareConcurrency
28. `deviceMemory` - navigator.deviceMemory (GB)
29. `pixelRatio` - window.devicePixelRatio
30. `screenArea` - screen.width x screen.height
31. `colorDepth` - screen.colorDepth
32. `connectionQuality` - navigator.connection.effectiveType
33. `downlink` - navigator.connection.downlink
34. `rtt` - navigator.connection.rtt

**Browser Preferences (4):**

35. `prefersDark` - prefers-color-scheme: dark
36. `pointerPrecision` - fine / coarse / unknown
37. `prefersReducedMotion` - boolean
38. `canHover` - boolean

**Locale and Market (5):**

39. `lang` - navigator.language (lowercase)
40. `langPrimary` - primary code (e.g. en, cs)
41. `langRegion` - region code (e.g. US, CZ)
42. `timezone` - IANA timezone string
43. `market` - NA / EU / APAC / OTHER

**Visit History (8):**

44. `intensity` - LOW / MEDIUM / HIGH
45. `isReturning` - boolean
46. `sessionVisits` - page views this session (sessionStorage)
47. `totalVisits` - lifetime visits (localStorage)
48. `daysSinceFirst` - days since first visit
49. `daysSinceLast` - days since last visit
50. `scrollDepthLastVisit` - scroll % from last visit (localStorage, written on beforeunload)
51. `timeOnPageLastVisit` - seconds on last visit (localStorage, written on beforeunload)

**Performance (1):**

52. `bootMs` - time from page load to Presence.ready via performance.now()

## Quick start

```html
<script src="presence.js"></script>
<script>
  var s = Presence.signals;

  if (s.profile === 'developer') {
    document.getElementById('hero').textContent = 'Zero-dependency. One script tag.';
  }

  if (s.recommendedExperience === 'hook_fast') {
    document.getElementById('nav').style.display = 'none';
    document.getElementById('cta').style.display = 'block';
  }
</script>
```

## API

```javascript
// All 52 signals in one object
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
  developer: 'Drop one script. Read 52 signals.',
  founder: 'Your page knows who is visiting.',
  default: 'Visitor intelligence for every site.'
});

// Show element only for certain profiles
Presence.showFor('#github-link', ['developer', 'researcher']);

// Print all signals to console
Presence.debug()
```

## CSS targeting

Presence sets 18 data attributes on `<body>` automatically:

```css
/* Adapt layout by profile */
[data-presence="developer"] .hero-copy::after {
  content: 'Zero-dependency. No build step.';
}

/* Show CTA only when visitor is ready to execute */
[data-presence-mode="executing"] .cta-block {
  display: block;
}

/* Social proof for strangers, not insiders */
[data-presence-trust="stranger"] .testimonials { display: block; }
[data-presence-trust="insider"] .testimonials { display: none; }
```

Available attributes:

- `data-presence` - profile
- `data-presence-source` - referral source
- `data-presence-device` - device type
- `data-presence-market` - NA / EU / APAC / OTHER
- `data-presence-intensity` - LOW / MEDIUM / HIGH
- `data-presence-returning` - true / false
- `data-presence-lang` - language code
- `data-presence-hardware` - LOW / MID / HIGH
- `data-presence-capability` - LIMITED / CAPABLE / POWERFUL
- `data-presence-cap-score` - 0-100
- `data-presence-dark` - true / false
- `data-presence-pointer` - fine / coarse / unknown
- `data-presence-dayctx` - WEEKDAY / WEEKEND
- `data-presence-intent` - full intent state
- `data-presence-experience` - recommended experience
- `data-presence-energy` - arrival energy
- `data-presence-mode` - cognitive mode
- `data-presence-trust` - trust level

## Verify it yourself

No network calls. Verify in 30 seconds:

```bash
grep -n "fetch\|XMLHttpRequest\|WebSocket\|navigator.sendBeacon\|new Image" presence.js
```

Returns nothing. The script runs entirely in the browser. No data leaves the device.

## License

MIT. Built by Brainiac Ltd.

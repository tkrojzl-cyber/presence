# presence.js

![Version](https://img.shields.io/badge/version-1.2.0-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Size](https://img.shields.io/badge/size-10.9KB-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Network](https://img.shields.io/badge/network-zero%20calls-brightgreen?style=flat-square&color=00AA00&labelColor=000000)

**Zero-dependency visitor intelligence layer. No cookies. No backend. No network calls.**

Drop one script tag into your page. Presence reads ten browser-native signals and classifies every visitor into a profile, synchronously, before your first component renders.

Responsive design for humans, not devices.

---

## Install

```html
<script src="presence.js"></script>
```

No npm. No build step. No account. No server.

---

## The ten signals

Presence reads only browser-native APIs. Nothing is sent anywhere. Ever.

| # | Signal | API | What it infers |
|---|---|---|---|
| 1 | Referral source | `document.referrer` | Where the visitor came from |
| 2 | UTM / ref params | `URLSearchParams` | Campaign or share link context |
| 3 | Time of day | `new Date().getHours()` | Work mode vs browse mode |
| 4 | Day of week | `new Date().getDay()` | Weekday vs weekend context |
| 5 | Device + touch | `window.innerWidth` + `navigator.maxTouchPoints` | Mobile / desktop / touch precision |
| 6 | Hardware concurrency | `navigator.hardwareConcurrency` | Technical sophistication proxy (CPU cores) |
| 7 | Locale / language | `navigator.language` | Market and language region |
| 8 | Timezone / market | `Intl.DateTimeFormat().resolvedOptions()` | Geographic market (NA / EU / APAC) |
| 9 | Session history | `sessionStorage` | Page views this session |
| 10 | Visit intensity + recency | `localStorage` | Total visits, returning status, days since first/last visit |

---

## Profiles

Every visitor resolves to one of five profiles:

| Profile | Triggered by |
|---|---|
| `researcher` | LinkedIn, .edu domains, Academia.edu, ResearchGate, Google Scholar |
| `founder` | Product Hunt, Hacker News, Twitter/X, IndieHackers |
| `developer` | GitHub, Stack Overflow, GitLab, dev.to, npmjs.com, programming subreddits |
| `deep_work` | Direct traffic 05:00-08:00, or high-intensity returning visitor |
| `default` | Everything else |

---

## Usage

### Get the current profile

```js
Presence.getProfile();
// → 'founder'
```

### Read any signal directly

```js
Presence.get('market');      // → 'EU'
Presence.get('intensity');   // → 'HIGH'
Presence.get('isReturning'); // → true
Presence.get('cores');       // → 12
Presence.get('dayContext');  // → 'WEEKEND'
Presence.get('bootMs');      // → 1
```

### Full signals object

```js
Presence.signals;
// {
//   profile:         'founder',
//   source:          'PRODUCTHUNT',
//   timeWindow:      'DEEP_WORK',
//   dayContext:      'WEEKDAY',
//   hour:            9,
//   isWeekend:       false,
//   device:          'DESKTOP',
//   width:           1440,
//   isTouch:         false,
//   touchPoints:     0,
//   cores:           12,
//   hardwareProfile: 'HIGH_END',
//   lang:            'en-gb',
//   langPrimary:     'en',
//   langRegion:      'GB',
//   timezone:        'Europe/London',
//   market:          'EU',
//   intensity:       'LOW',
//   isReturning:     false,
//   sessionVisits:   1,
//   totalVisits:     1,
//   daysSinceFirst:  0,
//   daysSinceLast:   0,
//   referrer:        'https://producthunt.com',
//   bootMs:          1,
// }
```

### Adapt copy per profile

```js
Presence.adapt('#hero', {
  founder:    'Ship in days, not months.',
  developer:  'Drop it in. Done.',
  researcher: 'Deterministic visitor classification. No tracking.',
  default:    'Your website, personalised per visitor.',
});
```

### Show elements only for certain profiles

```js
Presence.showFor('#cta-github',   'developer');
Presence.showFor('#cta-calendly', ['founder', 'researcher']);
```

### Run a callback for specific profiles

```js
Presence.when('developer', function (signals) {
  console.log('Dev from', signals.source, '- cores:', signals.cores);
});

Presence.when(['founder', 'researcher'], function () {
  showBookingWidget();
});
```

### Target returning high-intensity visitors

```js
if (Presence.get('isReturning') && Presence.get('intensity') === 'HIGH') {
  showLoyalVisitorOffer();
}
```

### Geographic targeting

```js
Presence.when('default', function (signals) {
  if (signals.market === 'EU') showGDPRBanner();
  if (signals.langPrimary === 'de') loadGermanContent();
});
```

### CSS targeting (set automatically on DOMContentLoaded)

```html
<body
  data-presence="founder"
  data-presence-source="PRODUCTHUNT"
  data-presence-device="DESKTOP"
  data-presence-market="EU"
  data-presence-intensity="LOW"
  data-presence-returning="false"
  data-presence-lang="en"
  data-presence-hardware="HIGH_END"
  data-presence-dayctx="WEEKDAY"
>
```

```css
[data-presence="developer"] .cta-github        { display: block; }
[data-presence="founder"]   .cta-calendly      { display: block; }
[data-presence-returning="true"] .welcome-back { display: block; }
[data-presence-market="EU"] .gdpr-notice       { display: block; }
```

### Force a profile (testing or sharing)

```
https://yoursite.com?profile=founder
https://yoursite.com?profile=developer
```

Path shortcuts: `/f` forces founder, `/r` researcher, `/d` developer.

### Debug mode

```js
Presence.debug();
// Prints full signal table to console - remove before production
```

---

## Verify it yourself

### No network calls

```bash
grep -n "fetch\|XMLHttpRequest\|sendBeacon\|Image(\|http" presence.js
```

You will find nothing. Every API used is listed in the signals table above.

### Boot time

Presence measures its own execution time and exposes it as `bootMs`.
Check it in your browser console after loading any page with presence.js:

```js
Presence.get('bootMs');
```

On any modern machine this returns 0 or 1. The detection runs synchronously
in a single pass. One loop through the signals, no async, no I/O.

To watch it yourself:

1. Open any page with presence.js installed
2. Open DevTools → Console
3. Type: `Presence.get('bootMs')`
4. Type: `Presence.debug()` to see the full signal table

To confirm it yourself: open any page with presence.js and run in console:

```js
console.log('Boot time:', Presence.get('bootMs'), 'ms');
```

`bootMs` is stamped at script execution time, before your console opens.
It is a measurement, not a promise. On any modern machine it will be 0 or 1.

### No cookies written

```js
// Before loading presence.js:
document.cookie; // note the value

// After loading presence.js:
document.cookie; // identical - presence.js never touches document.cookie
```

### What localStorage keys presence.js writes

Presence uses three keys, all prefixed `_p`:

| Key | Value | Purpose |
|---|---|---|
| `_ptv` | integer | Total visit count across sessions |
| `_pfs` | unix timestamp (ms) | First ever visit |
| `_pls` | unix timestamp (ms) | Last visit |

Check them yourself:

```js
localStorage.getItem('_ptv'); // → '3'
localStorage.getItem('_pfs'); // → '1748123456789'
localStorage.getItem('_pls'); // → '1748234567890'
```

To reset (simulate a new visitor):

```js
localStorage.removeItem('_ptv');
localStorage.removeItem('_pfs');
localStorage.removeItem('_pls');
sessionStorage.removeItem('_pv');
```

---

## What presence.js does not do

- Does not write cookies
- Does not make network requests
- Does not fingerprint canvas, WebGL, or audio
- Does not read other localStorage keys
- Does not track mouse movement, scroll depth, or click events
- Does not require a server, account, or API key

---

## License

MIT.

---

*Built by [Brainiac Ltd](https://superchargebuilds.pro).*

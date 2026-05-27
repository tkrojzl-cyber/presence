# presence.js

![Size](https://img.shields.io/badge/size-5.8KB-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Network](https://img.shields.io/badge/network-zero%20calls-brightgreen?style=flat-square&color=00AA00&labelColor=000000)

**Zero-dependency visitor intelligence layer. No cookies. No backend. No infrastructure.**

Drop one script tag into your page. Presence reads five browser-native signals and classifies every visitor into a profile — before your first React component renders.

Responsive design for humans, not devices.

---

## Install

```html
<script src="presence.js"></script>
```

That is it. No npm. No build step. No account.

---

## What it detects

Presence reads only browser-native signals. Nothing is sent anywhere.

| Signal | API used | What it infers |
|---|---|---|
| Referral source | `document.referrer` | Where the visitor came from |
| UTM / ref params | `URLSearchParams` | Campaign or share context |
| Time of day | `new Date().getHours()` | Work mode vs browse mode |
| Device width | `window.innerWidth` | Mobile vs desktop context |
| Path override | `window.location.pathname` | Forced profile via URL |

---

## Profiles

Every visitor resolves to one of five profiles:

| Profile | Triggered by |
|---|---|
| `researcher` | LinkedIn, .edu domains, academia.edu, ResearchGate |
| `founder` | Product Hunt, Hacker News, Twitter/X, IndieHackers |
| `developer` | GitHub, Stack Overflow, GitLab, dev.to, npmjs.com |
| `deep_work` | Direct traffic between 05:00 and 08:00 |
| `default` | Everything else |

---

## Usage

### Get the current profile

```js
Presence.getProfile();
// → 'founder'
```

### Adapt copy per profile

```js
Presence.adapt('#hero', {
  founder:    'Ship in days, not months.',
  developer:  'Drop it in. Done.',
  researcher: 'Deterministic visitor classification without tracking.',
  default:    'Your website, personalised.',
});
```

### Show elements only to certain profiles

```js
Presence.showFor('#cta-github', 'developer');
Presence.showFor('#cta-calendly', ['founder', 'researcher']);
```

### Run a callback for specific profiles

```js
Presence.when('developer', function (signals) {
  console.log('Dev visitor from', signals.source);
});
```

### CSS targeting (automatic)

Presence sets `data-presence` on `<body>` automatically:

```html
<body data-presence="founder" data-presence-source="PRODUCTHUNT" data-presence-device="DESKTOP">
```

Target it in CSS:

```css
[data-presence="developer"] .cta-github { display: block; }
[data-presence="founder"]   .cta-book-call { display: block; }
```

### Force a profile (testing / sharing)

```
https://yoursite.com?profile=founder
https://yoursite.com?profile=developer
```

Also works via path: `/f` forces founder, `/r` forces researcher, `/d` forces developer.

### Debug mode

```js
Presence.debug();
// Logs full signal table to console
```

### Full signals object

```js
Presence.signals;
// {
//   profile:    'founder',
//   source:     'PRODUCTHUNT',
//   timeWindow: 'DEEP_WORK',
//   device:     'DESKTOP',
//   referrer:   'https://producthunt.com',
//   hour:       9,
//   width:      1440,
//   bootMs:     1,
// }
```

---

## Verify it yourself

Presence makes one claim: it does not phone home.

```bash
grep -n "fetch\|XMLHttpRequest\|navigator.sendBeacon\|Image()" presence.js
```

You will find nothing. The source is 200 lines. Read it before you use it.

---

## Size

5.8KB unminified. No dependencies. No build toolchain required.

---

## License

MIT.

---

*Built by [Brainiac Ltd](https://superchargebuilds.pro).*

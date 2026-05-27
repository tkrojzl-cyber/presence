# presence

![Size](https://img.shields.io/badge/size-9.9KB-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square&color=00AA00&labelColor=000000)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square&color=00AA00&labelColor=000000)

**Zero-dependency visitor intelligence layer. No cookies. No backend. No infrastructure.**

Responsive design for humans — adapts your website per visitor, not per device.

---

## What it does

Classifies every visitor into a tier using five browser-native signals:

1. Referral source / UTM parameters
2. Session history
3. Post / launch recency
4. Visit intensity
5. Device and contextual signals

No external requests. No cookies. No GDPR headaches. 9.9KB dropped into your `<head>`.

---

## Install

```html
<script src="presence.js"></script>
```

That's it.

---

## How it works

Presence reads browser-native signals only — `document.referrer`, `sessionStorage`, `localStorage`, `navigator`, `screen`. Nothing is sent anywhere. Everything stays on the client.

---

## License

MIT.

---

*Built by [Brainiac Ltd](https://superchargebuilds.pro).*

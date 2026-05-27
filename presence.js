/**
 * presence.js v1.2.0
 * Zero-dependency visitor intelligence layer.
 * No cookies. No backend. No network calls.
 *
 * Built by Brainiac Ltd — https://superchargebuilds.pro
 * MIT License
 */

(function (global) {
  'use strict';

  var _BOOT = typeof performance !== 'undefined' ? performance.now() : 0;

  function detect() {
    var now      = new Date();
    var referrer = document.referrer || '';
    var params   = new URLSearchParams(window.location.search);
    var ref      = (params.get('ref') || '').toLowerCase();
    var path     = window.location.pathname;
    var src      = (referrer + ' ' + ref).toLowerCase();

    // ── SIGNAL 1 — REFERRAL SOURCE ─────────────────────────────────────────
    // document.referrer + URLSearchParams ref/utm

    // ── SIGNAL 2 — TIME OF DAY ─────────────────────────────────────────────
    var hour = now.getHours();
    var timeWindow =
      (hour >= 5  && hour < 8)  ? 'EARLY'     :
      (hour >= 8  && hour < 12) ? 'DEEP_WORK' :
      (hour >= 12 && hour < 17) ? 'AFTERNOON' :
      (hour >= 17 && hour < 22) ? 'EVENING'   : 'LATE';

    // ── SIGNAL 3 — DAY OF WEEK ─────────────────────────────────────────────
    // 0 = Sunday, 6 = Saturday
    var dayOfWeek  = now.getDay();
    var isWeekend  = dayOfWeek === 0 || dayOfWeek === 6;
    var dayContext = isWeekend ? 'WEEKEND' : 'WEEKDAY';

    // ── SIGNAL 4 — DEVICE (width + touch points) ───────────────────────────
    var width      = window.innerWidth;
    var touchPoints = navigator.maxTouchPoints || 0;
    var isTouch    = touchPoints > 0;
    var device     =
      (width < 768 && isTouch)   ? 'MOBILE'  :
      (width < 768 && !isTouch)  ? 'NARROW'  :
      (width >= 1440)            ? 'WIDE'    : 'DESKTOP';

    // ── SIGNAL 5 — HARDWARE CONCURRENCY ───────────────────────────────────
    // CPU cores — proxy for technical sophistication
    var cores = navigator.hardwareConcurrency || 0;
    var hardwareProfile =
      cores >= 16 ? 'HIGH_END' :
      cores >= 8  ? 'MID'      :
      cores >= 4  ? 'STANDARD' : 'LOW';

    // ── SIGNAL 6 — LOCALE / LANGUAGE ──────────────────────────────────────
    var lang        = (navigator.language || 'en').toLowerCase();
    var langPrimary = lang.split('-')[0]; // 'en', 'de', 'cs', 'fr' etc.
    var langRegion  = lang.includes('-') ? lang.split('-')[1].toUpperCase() : ''; // 'GB', 'US'

    // ── SIGNAL 7 — TIMEZONE / MARKET ──────────────────────────────────────
    var timezone = '';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {}
    var market =
      timezone.includes('America')  ? 'NA'  :
      timezone.includes('Europe')   ? 'EU'  :
      timezone.includes('Asia')     ? 'APAC':
      timezone.includes('Pacific')  ? 'APAC':
      timezone.includes('Australia')? 'APAC': 'OTHER';

    // ── SIGNAL 8 — SESSION HISTORY ─────────────────────────────────────────
    // sessionStorage — page views this session
    var sessionVisits = 1;
    try {
      sessionVisits = parseInt(sessionStorage.getItem('_pv') || '0', 10) + 1;
      sessionStorage.setItem('_pv', sessionVisits);
    } catch (e) {}

    // ── SIGNAL 9 — VISIT INTENSITY ─────────────────────────────────────────
    // localStorage — total visits across all sessions
    var totalVisits = 1;
    try {
      totalVisits = parseInt(localStorage.getItem('_ptv') || '0', 10) + 1;
      localStorage.setItem('_ptv', totalVisits);
    } catch (e) {}

    // ── SIGNAL 10 — RETURNING VISITOR + RECENCY ────────────────────────────
    // localStorage — first seen timestamp + last seen
    var firstSeen   = null;
    var lastSeen    = null;
    var isReturning = false;
    var daysSinceFirst = 0;
    var daysSinceLast  = 0;
    try {
      firstSeen = localStorage.getItem('_pfs');
      lastSeen  = localStorage.getItem('_pls');
      var nowTs = Date.now().toString();
      if (!firstSeen) {
        localStorage.setItem('_pfs', nowTs);
        firstSeen = nowTs;
      } else {
        isReturning    = true;
        daysSinceFirst = Math.floor((Date.now() - parseInt(firstSeen, 10)) / 86400000);
      }
      if (lastSeen) {
        daysSinceLast = Math.floor((Date.now() - parseInt(lastSeen, 10)) / 86400000);
      }
      localStorage.setItem('_pls', nowTs);
    } catch (e) {}

    var intensity =
      totalVisits >= 10 ? 'HIGH'   :
      totalVisits >= 3  ? 'MEDIUM' : 'LOW';

    // ── PROFILE RESOLUTION ─────────────────────────────────────────────────
    var source  = 'DIRECT';
    var profile = 'default';

    if (
      src.includes('linkedin')       ||
      src.includes('academia.edu')   ||
      src.includes('researchgate')   ||
      src.includes('scholar.google') ||
      referrer.includes('.edu')
    ) {
      source  = referrer.includes('linkedin') ? 'LINKEDIN' : 'ACADEMIC';
      profile = 'researcher';
    } else if (
      src.includes('producthunt')  ||
      src.includes('indiehackers') ||
      src.includes('ycombinator')  ||
      src.includes('news.yc')      ||
      src.includes('twitter.com')  ||
      src.includes('x.com')        ||
      ref === 'ph'
    ) {
      source  =
        src.includes('producthunt')                       ? 'PRODUCTHUNT' :
        (src.includes('twitter') || src.includes('x.com'))? 'TWITTER/X'   : 'INDIEHACKERS';
      profile = 'founder';
    } else if (
      src.includes('github.com')     ||
      src.includes('dev.to')         ||
      src.includes('stackoverflow')  ||
      src.includes('gitlab.com')     ||
      src.includes('npmjs.com')      ||
      src.includes('reddit.com/r/programming') ||
      src.includes('reddit.com/r/webdev')      ||
      src.includes('reddit.com/r/netsec')      ||
      ref === 'dev' || ref === 'gh'
    ) {
      source  =
        src.includes('github')        ? 'GITHUB'        :
        src.includes('stackoverflow') ? 'STACKOVERFLOW' :
        src.includes('reddit')        ? 'REDDIT'        : 'DEV.TO';
      profile = 'developer';
    } else if (!referrer && hour >= 5 && hour < 8) {
      profile = 'deep_work';
    }

    // High-end hardware + no referrer → likely a developer
    if (profile === 'default' && cores >= 8 && !referrer) {
      profile = 'developer';
      source  = 'DIRECT';
    }

    // Returning high-intensity visitor with no referrer → deep work
    if (isReturning && intensity === 'HIGH' && profile === 'default') {
      profile = 'deep_work';
    }

    // PATH OVERRIDES
    if (path === '/r') profile = 'researcher';
    if (path === '/f') profile = 'founder';
    if (path === '/d') profile = 'developer';

    // URL PARAM OVERRIDE (testing / sharing)
    var fp = params.get('profile');
    var allowed = ['researcher', 'founder', 'developer', 'deep_work', 'default'];
    if (fp && allowed.indexOf(fp) !== -1) profile = fp;

    return {
      // Core
      profile:        profile,
      source:         source,
      // Time signals
      timeWindow:     timeWindow,
      dayContext:     dayContext,
      hour:           hour,
      isWeekend:      isWeekend,
      // Device signals
      device:         device,
      width:          width,
      isTouch:        isTouch,
      touchPoints:    touchPoints,
      // Hardware signal
      cores:          cores,
      hardwareProfile:hardwareProfile,
      // Locale signals
      lang:           lang,
      langPrimary:    langPrimary,
      langRegion:     langRegion,
      timezone:       timezone,
      market:         market,
      // Visit signals
      intensity:      intensity,
      isReturning:    isReturning,
      sessionVisits:  sessionVisits,
      totalVisits:    totalVisits,
      daysSinceFirst: daysSinceFirst,
      daysSinceLast:  daysSinceLast,
      // Raw
      referrer:       referrer,
      bootMs:         Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - _BOOT),
    };
  }

  // ── PUBLIC API ─────────────────────────────────────────────────────────────
  var signals = detect();

  var Presence = {
    version: '1.2.0',
    signals: signals,

    /** Returns current profile string */
    getProfile: function () { return signals.profile; },

    /** Get any signal value by key */
    get: function (key) { return signals[key]; },

    /** Run fn only if profile matches */
    when: function (profiles, fn) {
      var list = Array.isArray(profiles) ? profiles : [profiles];
      if (list.indexOf(signals.profile) !== -1) fn(signals);
      return this;
    },

    /** Swap element text content per profile */
    adapt: function (selector, map) {
      var el = document.querySelector(selector);
      if (!el) return this;
      var text = map[signals.profile] || map['default'];
      if (text !== undefined) el.textContent = text;
      return this;
    },

    /** Show element only for listed profiles, hide for all others */
    showFor: function (selector, profiles) {
      var el = document.querySelector(selector);
      if (!el) return this;
      var list = Array.isArray(profiles) ? profiles : [profiles];
      el.style.display = list.indexOf(signals.profile) !== -1 ? '' : 'none';
      return this;
    },

    /** Log all signals to console */
    debug: function () {
      console.group('[presence.js v' + this.version + ']');
      console.table(signals);
      console.groupEnd();
      return this;
    },
  };

  global.Presence = Presence;

  // Set data attributes on <body> for CSS targeting
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.body;
    b.setAttribute('data-presence',           signals.profile);
    b.setAttribute('data-presence-source',    signals.source);
    b.setAttribute('data-presence-device',    signals.device);
    b.setAttribute('data-presence-market',    signals.market);
    b.setAttribute('data-presence-intensity', signals.intensity);
    b.setAttribute('data-presence-returning', signals.isReturning ? 'true' : 'false');
    b.setAttribute('data-presence-lang',      signals.langPrimary);
    b.setAttribute('data-presence-hardware',  signals.hardwareProfile);
    b.setAttribute('data-presence-dayctx',    signals.dayContext);
  });

})(window);

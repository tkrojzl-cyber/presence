/**
 * presence.js v1.0.0
 * Zero-dependency visitor intelligence layer.
 * No cookies. No backend. No network calls. 9.9KB.
 *
 * Built by Brainiac Ltd — https://superchargebuilds.pro
 * MIT License
 */

(function (global) {
  'use strict';

  var _BOOT = typeof performance !== 'undefined' ? performance.now() : 0;

  // ── SIGNAL DETECTION ─────────────────────────────────────────────────────
  function detect() {
    var referrer = document.referrer || '';
    var params   = new URLSearchParams(window.location.search);
    var ref      = (params.get('ref') || '').toLowerCase();
    var path     = window.location.pathname;
    var hour     = new Date().getHours();
    var width    = window.innerWidth;
    var src      = (referrer + ' ' + ref).toLowerCase();

    // TIME WINDOW
    var timeWindow =
      (hour >= 5  && hour < 8)  ? 'EARLY'     :
      (hour >= 8  && hour < 12) ? 'DEEP_WORK' :
      (hour >= 12 && hour < 17) ? 'AFTERNOON' :
      (hour >= 17 && hour < 22) ? 'EVENING'   : 'LATE';

    // DEVICE
    var device = width < 768 ? 'MOBILE' : 'DESKTOP';

    // SOURCE + PROFILE
    var source  = 'DIRECT';
    var profile = 'default';

    if (
      src.includes('linkedin') ||
      src.includes('academia.edu') ||
      src.includes('researchgate') ||
      src.includes('scholar.google') ||
      referrer.includes('.edu')
    ) {
      source  = referrer.includes('linkedin') ? 'LINKEDIN' : 'ACADEMIC';
      profile = 'researcher';
    } else if (
      src.includes('producthunt') ||
      src.includes('indiehackers')  ||
      src.includes('ycombinator')   ||
      src.includes('news.yc')       ||
      src.includes('twitter.com')   ||
      src.includes('x.com')         ||
      ref === 'ph'
    ) {
      source  = src.includes('producthunt') ? 'PRODUCTHUNT' :
                (src.includes('twitter') || src.includes('x.com')) ? 'TWITTER/X' : 'INDIEHACKERS';
      profile = 'founder';
    } else if (
      src.includes('github.com')     ||
      src.includes('dev.to')         ||
      src.includes('stackoverflow')  ||
      src.includes('gitlab.com')     ||
      src.includes('npmjs.com')      ||
      ref === 'dev' || ref === 'gh'
    ) {
      source  = src.includes('github')      ? 'GITHUB'       :
                src.includes('stackoverflow') ? 'STACKOVERFLOW' : 'DEV.TO';
      profile = 'developer';
    } else if (!referrer && hour >= 5 && hour < 8) {
      source  = 'DIRECT';
      profile = 'deep_work';
    }

    // PATH OVERRIDES
    if (path === '/r')        profile = 'researcher';
    if (path === '/f')        profile = 'founder';
    if (path === '/d')        profile = 'developer';

    // URL PARAM OVERRIDE (testing / sharing)
    var fp = params.get('profile');
    var allowed = ['researcher', 'founder', 'developer', 'deep_work', 'default'];
    if (fp && allowed.indexOf(fp) !== -1) profile = fp;

    return {
      profile:    profile,
      source:     source,
      timeWindow: timeWindow,
      device:     device,
      referrer:   referrer,
      hour:       hour,
      width:      width,
      bootMs:     Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - _BOOT),
    };
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  var signals = detect();

  var Presence = {
    version:  '1.0.0',
    signals:  signals,

    /**
     * Get the current visitor profile.
     * Returns one of: 'researcher' | 'founder' | 'developer' | 'deep_work' | 'default'
     */
    getProfile: function () {
      return signals.profile;
    },

    /**
     * Get a single signal value by key.
     * Keys: profile, source, timeWindow, device, referrer, hour, width, bootMs
     */
    get: function (key) {
      return signals[key];
    },

    /**
     * Run a callback only if the current profile matches.
     * @param {string|string[]} profiles
     * @param {function} fn
     */
    when: function (profiles, fn) {
      var list = Array.isArray(profiles) ? profiles : [profiles];
      if (list.indexOf(signals.profile) !== -1) fn(signals);
      return this;
    },

    /**
     * Adapt a DOM element's text content based on profile.
     * Usage: Presence.adapt('#hero-headline', { founder: 'Ship faster.', developer: 'Drop it in. Done.' })
     * @param {string} selector
     * @param {object} map — { profileName: 'text content' }
     */
    adapt: function (selector, map) {
      var el = document.querySelector(selector);
      if (!el) return this;
      var text = map[signals.profile] || map['default'];
      if (text) el.textContent = text;
      return this;
    },

    /**
     * Show an element only for certain profiles. Hides it for all others.
     * @param {string} selector
     * @param {string|string[]} profiles
     */
    showFor: function (selector, profiles) {
      var el = document.querySelector(selector);
      if (!el) return this;
      var list = Array.isArray(profiles) ? profiles : [profiles];
      el.style.display = list.indexOf(signals.profile) !== -1 ? '' : 'none';
      return this;
    },

    /**
     * Log detected signals to console (debug mode).
     */
    debug: function () {
      console.group('[presence.js v' + this.version + ']');
      console.table(signals);
      console.groupEnd();
      return this;
    },
  };

  // Expose globally
  global.Presence = Presence;

  // Auto-set data attribute on <body> for CSS targeting
  document.addEventListener('DOMContentLoaded', function () {
    document.body.setAttribute('data-presence', signals.profile);
    document.body.setAttribute('data-presence-source', signals.source);
    document.body.setAttribute('data-presence-device', signals.device);
  });

})(window);

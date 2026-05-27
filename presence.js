/**
 * presence.js v2.0.0
 * Zero-dependency visitor intelligence layer.
 * No cookies. No backend. No network calls.
 *
 * Classifies every visitor into one of 9 intent states across three axes:
 *   Axis 1 - Arrival Energy:   passive / active / committed
 *   Axis 2 - Cognitive Mode:   exploring / evaluating / executing
 *   Axis 3 - Trust Level:      stranger / acquaintance / insider
 *
 * Built by Brainiac Ltd - https://superchargebuilds.pro
 * MIT License
 */

(function (global) {
  'use strict';

  var _BOOT = typeof performance !== 'undefined' ? performance.now() : 0;

  // ── PERSIST SCROLL DEPTH + TIME ON PAGE ────────────────────────────────────
  // Written to localStorage on beforeunload so next visit can read them
  var _pageStart = Date.now();
  try {
    window.addEventListener('beforeunload', function () {
      var scrollDepth = 0;
      try {
        var scrolled   = window.scrollY || document.documentElement.scrollTop || 0;
        var docHeight  = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight
        ) - window.innerHeight;
        scrollDepth = docHeight > 0 ? Math.round((scrolled / docHeight) * 100) : 100;
      } catch (e) {}
      var timeOnPage = Math.round((Date.now() - _pageStart) / 1000); // seconds
      try {
        localStorage.setItem('_psd', scrollDepth);     // scroll depth last visit (%)
        localStorage.setItem('_ptop', timeOnPage);     // time on page last visit (seconds)
      } catch (e) {}
    });
  } catch (e) {}

  function detect() {
    var now      = new Date();
    var referrer = document.referrer || '';
    var params   = new URLSearchParams(window.location.search);
    var ref      = (params.get('ref') || '').toLowerCase();
    var path     = window.location.pathname;
    var src      = (referrer + ' ' + ref).toLowerCase();

    // ── SIGNAL 1 — REFERRAL SOURCE ─────────────────────────────────────────
    // document.referrer + URLSearchParams ref/utm_source

    // ── SIGNAL 2 — TIME OF DAY ─────────────────────────────────────────────
    var hour = now.getHours();
    var timeWindow =
      (hour >= 5  && hour < 8)  ? 'EARLY'     :
      (hour >= 8  && hour < 12) ? 'DEEP_WORK' :
      (hour >= 12 && hour < 17) ? 'AFTERNOON' :
      (hour >= 17 && hour < 22) ? 'EVENING'   : 'LATE';

    // ── SIGNAL 3 — DAY OF WEEK ─────────────────────────────────────────────
    var dayOfWeek  = now.getDay();
    var isWeekend  = dayOfWeek === 0 || dayOfWeek === 6;
    var dayContext = isWeekend ? 'WEEKEND' : 'WEEKDAY';

    // ── SIGNAL 4 — DEVICE ──────────────────────────────────────────────────
    var width       = window.innerWidth;
    var touchPoints = navigator.maxTouchPoints || 0;
    var isTouch     = touchPoints > 0;
    var device      =
      (width < 768 && isTouch)  ? 'MOBILE'  :
      (width < 768 && !isTouch) ? 'NARROW'  :
      (width >= 1440)           ? 'WIDE'    : 'DESKTOP';

    // ── SIGNAL 5 — HARDWARE ────────────────────────────────────────────────
    var cores = navigator.hardwareConcurrency || 0;
    var hardwareProfile =
      cores >= 16 ? 'HIGH_END' :
      cores >= 8  ? 'MID'      :
      cores >= 4  ? 'STANDARD' : 'LOW';

    // ── SIGNAL 6 — LOCALE ──────────────────────────────────────────────────
    var lang        = (navigator.language || 'en').toLowerCase();
    var langPrimary = lang.split('-')[0];
    var langRegion  = lang.includes('-') ? lang.split('-')[1].toUpperCase() : '';

    // ── SIGNAL 7 — TIMEZONE / MARKET ──────────────────────────────────────
    var timezone = '';
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var market =
      timezone.includes('America')   ? 'NA'   :
      timezone.includes('Europe')    ? 'EU'   :
      timezone.includes('Asia')      ? 'APAC' :
      timezone.includes('Pacific')   ? 'APAC' :
      timezone.includes('Australia') ? 'APAC' : 'OTHER';

    // ── SIGNAL 8 — SESSION HISTORY ────────────────────────────────────────
    var sessionVisits = 1;
    try {
      sessionVisits = parseInt(sessionStorage.getItem('_pv') || '0', 10) + 1;
      sessionStorage.setItem('_pv', sessionVisits);
    } catch (e) {}

    // ── SIGNAL 9 — VISIT INTENSITY ────────────────────────────────────────
    var totalVisits = 1;
    try {
      totalVisits = parseInt(localStorage.getItem('_ptv') || '0', 10) + 1;
      localStorage.setItem('_ptv', totalVisits);
    } catch (e) {}

    // ── SIGNAL 10 — RETURNING VISITOR + RECENCY ───────────────────────────
    var firstSeen      = null;
    var lastSeen       = null;
    var isReturning    = false;
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

    // ── SIGNAL 11 — SCROLL DEPTH (last visit) ─────────────────────────────
    // Persisted on beforeunload. Reveals scanner vs reader.
    var scrollDepthLastVisit = 0;
    try {
      scrollDepthLastVisit = parseInt(localStorage.getItem('_psd') || '0', 10);
    } catch (e) {}

    // ── SIGNAL 12 — TIME ON PAGE (last visit) ─────────────────────────────
    // Persisted on beforeunload. Reveals passive drift vs intentional read.
    var timeOnPageLastVisit = 0;
    try {
      timeOnPageLastVisit = parseInt(localStorage.getItem('_ptop') || '0', 10);
    } catch (e) {}

    // ── SIGNAL 13 — UTM CONTENT + TERM ────────────────────────────────────
    // utm_content = creative/audience variant. utm_term = keyword/search intent.
    var utmSource   = (params.get('utm_source')   || '').toLowerCase();
    var utmMedium   = (params.get('utm_medium')   || '').toLowerCase();
    var utmCampaign = (params.get('utm_campaign') || '').toLowerCase();
    var utmContent  = (params.get('utm_content')  || '').toLowerCase();
    var utmTerm     = (params.get('utm_term')     || '').toLowerCase();

    // Fold utm_source into the src string for profile resolution
    if (utmSource) src = src + ' ' + utmSource;

    // Derive intensity from all signals
    var intensity =
      totalVisits >= 10 ? 'HIGH'   :
      totalVisits >= 3  ? 'MEDIUM' : 'LOW';

    // ── PROFILE RESOLUTION ────────────────────────────────────────────────
    var source  = 'DIRECT';
    var profile = 'default';

    if (
      src.includes('linkedin')       ||
      src.includes('academia.edu')   ||
      src.includes('researchgate')   ||
      src.includes('scholar.google') ||
      referrer.includes('.edu')
    ) {
      source  = src.includes('linkedin') ? 'LINKEDIN' : 'ACADEMIC';
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
      source =
        src.includes('producthunt')                        ? 'PRODUCTHUNT' :
        (src.includes('twitter') || src.includes('x.com')) ? 'TWITTER/X'   : 'INDIEHACKERS';
      profile = 'founder';
    } else if (
      src.includes('github.com')              ||
      src.includes('dev.to')                  ||
      src.includes('stackoverflow')           ||
      src.includes('gitlab.com')              ||
      src.includes('npmjs.com')               ||
      src.includes('reddit.com/r/programming')||
      src.includes('reddit.com/r/webdev')     ||
      src.includes('reddit.com/r/netsec')     ||
      ref === 'dev' || ref === 'gh'
    ) {
      source =
        src.includes('github')        ? 'GITHUB'        :
        src.includes('stackoverflow') ? 'STACKOVERFLOW' :
        src.includes('reddit')        ? 'REDDIT'        : 'DEV.TO';
      profile = 'developer';
    } else if (!referrer && hour >= 5 && hour < 8) {
      profile = 'deep_work';
    }

    if (profile === 'default' && cores >= 8 && !referrer) {
      profile = 'developer';
      source  = 'DIRECT';
    }
    if (isReturning && intensity === 'HIGH' && profile === 'default') {
      profile = 'deep_work';
    }

    // Path and param overrides
    if (path === '/r') profile = 'researcher';
    if (path === '/f') profile = 'founder';
    if (path === '/d') profile = 'developer';
    var fp = params.get('profile');
    var allowed = ['researcher', 'founder', 'developer', 'deep_work', 'default'];
    if (fp && allowed.indexOf(fp) !== -1) profile = fp;

    // ── INTENT STATE ENGINE — 3 AXES, 9 STATES ────────────────────────────

    // AXIS 1 — ARRIVAL ENERGY
    // How intentional was this visit?
    var arrivalEnergy =
      (isReturning && intensity === 'HIGH')                      ? 'committed' :
      (!referrer && !utmSource && totalVisits > 1)               ? 'active'    :
      (referrer || utmSource)                                    ? 'passive'   : 'active';

    // AXIS 2 — COGNITIVE MODE
    // What are they trying to do right now?
    // Reader behaviour: >60% scroll depth, >90s on page last visit = evaluating
    // High session visits this session = executing (deep in the product)
    var cognitiveMode =
      (sessionVisits >= 3)                                                          ? 'executing'  :
      (isReturning && scrollDepthLastVisit >= 60 && timeOnPageLastVisit >= 90)      ? 'evaluating' :
      (isReturning && (scrollDepthLastVisit >= 30 || timeOnPageLastVisit >= 30))    ? 'evaluating' :
      (utmTerm || utmContent)                                                       ? 'evaluating' :
      'exploring';

    // AXIS 3 — TRUST LEVEL
    // Do they know you yet?
    var trustLevel =
      (isReturning && daysSinceFirst >= 7  && intensity === 'HIGH')   ? 'insider'      :
      (isReturning && totalVisits >= 3)                                ? 'acquaintance' :
      'stranger';

    // INTENT STATE — one of 9 canonical states
    // Maps axes to a recommended experience strategy
    var intentState = arrivalEnergy + '_' + cognitiveMode + '_' + trustLevel;

    // RECOMMENDED EXPERIENCE
    // What should the page emphasise for this visitor?
    var experienceMap = {
      'passive_exploring_stranger':      'hook_fast',         // 3 seconds or gone
      'passive_evaluating_stranger':     'proof_first',       // social proof, specifics
      'passive_evaluating_acquaintance': 'remove_doubt',      // the one thing blocking conversion
      'active_exploring_stranger':       'thesis_first',      // lead with the idea, not features
      'active_evaluating_stranger':      'proof_first',       // came looking - show evidence
      'active_evaluating_acquaintance':  'remove_doubt',      // coming back to decide
      'committed_executing_acquaintance':'reduce_friction',   // nearly there - just the action
      'committed_executing_insider':     'next_level',        // already sold - give them depth
      'committed_evaluating_insider':    'deepen_value',      // power user - reward engagement
    };

    var recommendedExperience = experienceMap[intentState] || 'proof_first';

    // SUPPRESS / EMPHASISE HINTS
    var suppressMap = {
      'hook_fast':        ['long_copy', 'pricing_detail', 'faq'],
      'proof_first':      ['hero_video', 'feature_list'],
      'remove_doubt':     ['hero', 'intro_copy'],
      'thesis_first':     ['pricing_cta', 'sign_up_prompt'],
      'reduce_friction':  ['hero', 'intro_copy', 'social_proof'],
      'next_level':       ['intro_copy', 'basic_features'],
      'deepen_value':     ['cta_primary'],
    };
    var emphasiseMap = {
      'hook_fast':        ['headline', 'single_cta'],
      'proof_first':      ['social_proof', 'code_example', 'github_link'],
      'remove_doubt':     ['objection_handler', 'comparison', 'guarantee'],
      'thesis_first':     ['core_idea', 'founder_voice'],
      'reduce_friction':  ['primary_cta', 'one_click_action'],
      'next_level':       ['advanced_docs', 'api_reference', 'changelog'],
      'deepen_value':     ['case_study', 'advanced_config', 'community'],
    };

    return {
      // Core profile
      profile:               profile,
      source:                source,

      // Intent state (v2 - the 3-axis model)
      intentState:           intentState,
      arrivalEnergy:         arrivalEnergy,
      cognitiveMode:         cognitiveMode,
      trustLevel:            trustLevel,
      recommendedExperience: recommendedExperience,
      suppressElements:      suppressMap[recommendedExperience] || [],
      emphasiseElements:     emphasiseMap[recommendedExperience] || [],

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
      intensity:           intensity,
      isReturning:         isReturning,
      sessionVisits:       sessionVisits,
      totalVisits:         totalVisits,
      daysSinceFirst:      daysSinceFirst,
      daysSinceLast:       daysSinceLast,

      // New v2 signals
      scrollDepthLastVisit: scrollDepthLastVisit,
      timeOnPageLastVisit:  timeOnPageLastVisit,
      utmSource:            utmSource,
      utmMedium:            utmMedium,
      utmCampaign:          utmCampaign,
      utmContent:           utmContent,
      utmTerm:              utmTerm,

      // Raw
      referrer: referrer,
      bootMs:   Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - _BOOT),
    };
  }

  // ── PUBLIC API ─────────────────────────────────────────────────────────────
  var signals = detect();

  var Presence = {
    version: '2.0.0',
    signals: signals,

    /** Returns current profile string */
    getProfile: function () { return signals.profile; },

    /** Returns current intent state string */
    getIntentState: function () { return signals.intentState; },

    /** Returns recommended experience key */
    getExperience: function () { return signals.recommendedExperience; },

    /** Get any signal value by key */
    get: function (key) { return signals[key]; },

    /** Run fn only if profile matches */
    when: function (profiles, fn) {
      var list = Array.isArray(profiles) ? profiles : [profiles];
      if (list.indexOf(signals.profile) !== -1) fn(signals);
      return this;
    },

    /** Run fn if intent state matches */
    whenState: function (states, fn) {
      var list = Array.isArray(states) ? states : [states];
      if (list.indexOf(signals.intentState) !== -1) fn(signals);
      return this;
    },

    /** Run fn based on recommended experience */
    whenExperience: function (experiences, fn) {
      var list = Array.isArray(experiences) ? experiences : [experiences];
      if (list.indexOf(signals.recommendedExperience) !== -1) fn(signals);
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

    /** Show element only for listed profiles */
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
      console.log('Intent State:', signals.intentState);
      console.log('Experience:  ', signals.recommendedExperience);
      console.log('Axes:', {
        arrivalEnergy: signals.arrivalEnergy,
        cognitiveMode: signals.cognitiveMode,
        trustLevel:    signals.trustLevel
      });
      console.log('Suppress:', signals.suppressElements);
      console.log('Emphasise:', signals.emphasiseElements);
      console.table(signals);
      console.groupEnd();
      return this;
    },
  };

  global.Presence = Presence;

  // Set data attributes on body for CSS targeting
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.body;
    b.setAttribute('data-presence',            signals.profile);
    b.setAttribute('data-presence-source',     signals.source);
    b.setAttribute('data-presence-device',     signals.device);
    b.setAttribute('data-presence-market',     signals.market);
    b.setAttribute('data-presence-intensity',  signals.intensity);
    b.setAttribute('data-presence-returning',  signals.isReturning ? 'true' : 'false');
    b.setAttribute('data-presence-lang',       signals.langPrimary);
    b.setAttribute('data-presence-hardware',   signals.hardwareProfile);
    b.setAttribute('data-presence-dayctx',     signals.dayContext);
    b.setAttribute('data-presence-intent',     signals.intentState);
    b.setAttribute('data-presence-experience', signals.recommendedExperience);
    b.setAttribute('data-presence-energy',     signals.arrivalEnergy);
    b.setAttribute('data-presence-mode',       signals.cognitiveMode);
    b.setAttribute('data-presence-trust',      signals.trustLevel);
  });

})(window);

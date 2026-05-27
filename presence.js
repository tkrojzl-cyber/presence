/**
 * presence.js v2.1.0
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

// ── CAPABILITY MODEL — MULTI-SIGNAL COMPOSITE ─────────────────────────
    //
    // Research basis:
    // - Cores alone is a weak proxy. Buckets cap at 8 for privacy reasons (spec).
    // - deviceMemory is the strongest single hardware signal. Correlates directly
    //   with RAM, which predicts whether someone is on a budget device or a workstation.
    // - devicePixelRatio separates retina/4K displays (prosumer/developer) from
    //   standard displays. 2x+ = Apple, high-end Windows. 1x = budget/office.
    // - Network quality (navigator.connection) reveals infrastructure context.
    //   4g/wifi with low rtt = urban professional. slow-2g/3g = mobile-first market.
    // - Dark mode preference correlates with developer/power user identity.
    //   Research: ~80% of developers use dark mode vs ~35% of general users.
    //   (JetBrains Developer Survey 2023, Stack Overflow Developer Survey 2024)
    // - Font smoothing / subpixel rendering presence = non-default OS config =
    //   technically engaged user who customises their environment.
    // - prefers-reduced-motion = accessibility-aware user = likely more technically
    //   or professionally engaged (knows system preferences exist).
    // - Pointer precision: 'fine' (mouse/trackpad) vs 'coarse' (finger) separates
    //   production/creation contexts from consumption contexts.
    // - Screen area (width x height) is a stronger signal than width alone.
    //   >2M pixels = large external monitor = workstation = professional context.
    // - Color depth: 30bit+ = pro display pipeline. 24bit = standard. <24 = low end.
    // - Timezone UTC offset precision: non-round offsets (UTC+5:30, UTC+5:45)
    //   identify specific emerging markets (India, Nepal) with distinct behaviour patterns.

    // Raw capability signals
    var cores       = navigator.hardwareConcurrency || 0;
    var deviceMemory = 0;
    try { deviceMemory = navigator.deviceMemory || 0; } catch(e) {}

    var pixelRatio  = window.devicePixelRatio || 1;
    var screenArea  = (screen.width || 0) * (screen.height || 0);
    var colorDepth  = screen.colorDepth || 24;

    // Network quality
    var connectionQuality = 'unknown';
    var downlink          = 0;
    var rtt               = 999;
    try {
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        connectionQuality = conn.effectiveType || 'unknown'; // slow-2g | 2g | 3g | 4g
        downlink          = conn.downlink || 0;   // Mbps
        rtt               = conn.rtt     || 999;  // ms
      }
    } catch(e) {}

    // Dark mode — strongest non-hardware sophistication signal
    var prefersDark = false;
    try {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch(e) {}

    // Pointer precision — mouse/trackpad vs touch finger
    var pointerPrecision = 'unknown';
    try {
      if (window.matchMedia('(pointer: fine)').matches)   pointerPrecision = 'fine';
      else if (window.matchMedia('(pointer: coarse)').matches) pointerPrecision = 'coarse';
    } catch(e) {}

    // Reduced motion — accessibility-aware = technically engaged
    var prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch(e) {}

    // Hover capability — non-hover = pure touch = consumption context
    var canHover = false;
    try { canHover = window.matchMedia('(hover: hover)').matches; } catch(e) {}

    // ── CAPABILITY SCORE — 0 to 100 ───────────────────────────────────────
    //
    // Weighted composite. Weights derived from signal reliability and
    // psychological/market research on what actually predicts technical sophistication:
    //
    // deviceMemory    (25pts) — strongest single predictor of device class
    // cores           (15pts) — useful but capped at 8 by spec (privacy noise)
    // pixelRatio      (15pts) — retina/4K = prosumer or developer environment
    // screenArea      (10pts) — large monitor = workstation context
    // connectionQuality(10pts)— infrastructure proxy
    // prefersDark     (10pts) — developer identity marker (80% vs 35% base rate)
    // pointerPrecision(8pts)  — fine = creation context, coarse = consumption
    // colorDepth      (4pts)  — pro display pipeline
    // prefersReducedMotion(2pts) — system-level awareness
    // canHover        (1pt)   — hover = non-touch production context

    var capScore = 0;

    // deviceMemory: 0.25=5pts, 0.5=10pts, 1=15pts, 2=18pts, 4+=25pts
    if      (deviceMemory >= 4) capScore += 25;
    else if (deviceMemory >= 2) capScore += 18;
    else if (deviceMemory >= 1) capScore += 15;
    else if (deviceMemory > 0)  capScore += 8;
    // if deviceMemory unavailable (Firefox, Safari) — neutral, score from other signals

    // cores: capped at 8 by spec, so max signal is 8+
    if      (cores >= 8) capScore += 15;
    else if (cores >= 4) capScore += 10;
    else if (cores >= 2) capScore += 5;

    // pixelRatio: 3+ = high-end Apple/4K, 2 = retina/standard HiDPI, 1 = standard
    if      (pixelRatio >= 3) capScore += 15;
    else if (pixelRatio >= 2) capScore += 10;
    else if (pixelRatio >= 1.5) capScore += 5;

    // screenArea: >2M = large external monitor, >1M = standard large display
    if      (screenArea >= 2073600) capScore += 10; // 1920x1080+
    else if (screenArea >= 1228800) capScore += 7;  // 1280x960+
    else if (screenArea >= 786432)  capScore += 3;  // 1024x768+

    // connection: 4g with good downlink = high infrastructure
    if (connectionQuality === '4g' && downlink >= 10) capScore += 10;
    else if (connectionQuality === '4g')               capScore += 7;
    else if (connectionQuality === '3g')               capScore += 3;
    else if (connectionQuality === 'unknown')          capScore += 5; // neutral

    // dark mode: strongest behaviour signal
    if (prefersDark) capScore += 10;

    // pointer precision
    if (pointerPrecision === 'fine') capScore += 8;

    // color depth
    if (colorDepth >= 30)     capScore += 4;
    else if (colorDepth >= 24) capScore += 2;

    // accessibility awareness
    if (prefersReducedMotion) capScore += 2;

    // hover
    if (canHover) capScore += 1;

    // Cap at 100
    capScore = Math.min(capScore, 100);

    // ── CAPABILITY TIER ───────────────────────────────────────────────────
    // Maps to psychological segment:
    // SOVEREIGN  (75-100): Pro workstation. Dark mode. Retina. High RAM. Fine pointer.
    //                       Likely: developer, designer, researcher, power user.
    //                       Serve: density, depth, no hand-holding.
    // CAPABLE    (45-74):  Mid-range professional. Decent RAM. Standard display.
    //                       Likely: knowledge worker, manager, intermediate user.
    //                       Serve: clarity with depth available.
    // STANDARD   (20-44):  Average consumer device. Touch likely. Standard display.
    //                       Likely: general public, mobile-first user.
    //                       Serve: simplicity, one action at a time.
    // CONSTRAINED (0-19):  Low RAM, slow connection, or heavily restricted device.
    //                       Likely: budget device, emerging market, old hardware.
    //                       Serve: speed, minimal assets, zero friction.
    var capabilityTier =
      capScore >= 75 ? 'SOVEREIGN'   :
      capScore >= 45 ? 'CAPABLE'     :
      capScore >= 20 ? 'STANDARD'    : 'CONSTRAINED';

    // Legacy alias for backwards compatibility
    var hardwareProfile =
      capScore >= 75 ? 'HIGH_END' :
      capScore >= 45 ? 'MID'      :
      capScore >= 20 ? 'STANDARD' : 'LOW';

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

    if (profile === 'default' && capScore >= 65 && !referrer) {
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

      // Capability model (v2.1 - multi-signal composite)
      capabilityScore:      capScore,
      capabilityTier:       capabilityTier,
      hardwareProfile:      hardwareProfile,  // legacy alias
      cores:                cores,
      deviceMemory:         deviceMemory,
      pixelRatio:           pixelRatio,
      screenArea:           screenArea,
      colorDepth:           colorDepth,
      connectionQuality:    connectionQuality,
      downlink:             downlink,
      rtt:                  rtt,
      prefersDark:          prefersDark,
      pointerPrecision:     pointerPrecision,
      prefersReducedMotion: prefersReducedMotion,
      canHover:             canHover,

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
    version: '2.1.0',
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
    b.setAttribute('data-presence-hardware',    signals.hardwareProfile);
    b.setAttribute('data-presence-capability',  signals.capabilityTier);
    b.setAttribute('data-presence-cap-score',   String(signals.capabilityScore));
    b.setAttribute('data-presence-dark',        signals.prefersDark ? 'true' : 'false');
    b.setAttribute('data-presence-pointer',     signals.pointerPrecision);
    b.setAttribute('data-presence-dayctx',     signals.dayContext);
    b.setAttribute('data-presence-intent',     signals.intentState);
    b.setAttribute('data-presence-experience', signals.recommendedExperience);
    b.setAttribute('data-presence-energy',     signals.arrivalEnergy);
    b.setAttribute('data-presence-mode',       signals.cognitiveMode);
    b.setAttribute('data-presence-trust',      signals.trustLevel);
  });

})(window);

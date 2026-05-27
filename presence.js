<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRESENCE — Brainiac Ltd</title>
  <meta name="description" content="Intelligence Amplification systems for funded founders. 25 AI systems built solo. £8.5K all-in.">
  <style>
    /* Pre-React black screen — prevents flash */
    body { background: #030712; margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; color: #fff; }
    #root { min-height: 100vh; }
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
<div id="root"></div>

<script type="text/babel">
/* ============================================================
   PRESENCE v2.0 — INTELLIGENCE AMPLIFICATION INTERFACE
   Brainiac Ltd — Thomas Krojzl
   Signal detection runs synchronously before first render.
   No backend. No cookies. No tracking. Pure client-side inference.
   ============================================================ */

// ── SYNCHRONOUS SIGNAL DETECTION ── runs at module scope ──────────────────
const _BOOT_START = performance.now();

const SIGNALS = (() => {
  const referrer = document.referrer || '';
  const params   = new URLSearchParams(window.location.search);
  const ref      = (params.get('ref') || '').toLowerCase();
  const path     = window.location.pathname;
  const hour     = new Date().getHours();
  const width    = window.innerWidth;
  const src      = (referrer + ' ' + ref).toLowerCase();

  // TIME WINDOW
  const timeWindow =
    (hour >= 5  && hour < 8)  ? 'EARLY'      :
    (hour >= 8  && hour < 12) ? 'DEEP_WORK'  :
    (hour >= 12 && hour < 17) ? 'AFTERNOON'  :
    (hour >= 17 && hour < 22) ? 'EVENING'    : 'LATE';

  // DEVICE
  const device = width < 768 ? 'MOBILE' : 'DESKTOP';

  // SOURCE + PROFILE
  let source  = 'DIRECT';
  let profile = 'default';

  if (src.includes('linkedin') || src.includes('academia.edu') ||
      src.includes('researchgate') || src.includes('scholar.google') ||
      referrer.includes('.edu')) {
    source  = referrer.includes('linkedin') ? 'LINKEDIN' : 'ACADEMIC';
    profile = 'researcher';
  } else if (src.includes('producthunt') || src.includes('indiehackers') ||
             src.includes('ycombinator') || src.includes('news.yc') ||
             src.includes('twitter.com') || src.includes('x.com') || ref === 'ph') {
    source  = src.includes('producthunt') ? 'PRODUCTHUNT' :
              (src.includes('twitter') || src.includes('x.com')) ? 'TWITTER/X' : 'INDIEHACKERS';
    profile = 'founder';
  } else if (src.includes('github.com') || src.includes('dev.to') ||
             src.includes('stackoverflow') || src.includes('gitlab.com') ||
             src.includes('npmjs.com') || ref === 'dev' || ref === 'gh') {
    source  = src.includes('github') ? 'GITHUB' :
              src.includes('stackoverflow') ? 'STACKOVERFLOW' : 'DEV.TO';
    profile = 'developer';
  } else if (!referrer && hour >= 5 && hour < 8) {
    source  = 'DIRECT';
    profile = 'deep_work';
  }

  // PATH-BASED FORCED PROFILES
  if (path === '/r') profile = 'researcher';
  if (path === '/f') profile = 'founder';
  if (path === '/d') profile = 'developer';
  if (path === '/showcase') profile = 'showcase';

  // URL PARAM OVERRIDE
  const fp = params.get('profile');
  if (fp && ['researcher','founder','developer','deep_work','default','showcase'].includes(fp)) {
    profile = fp;
  }

  return { source, timeWindow, device, profile, referrer, hour, width };
})();

// ── STATIC DATA ────────────────────────────────────────────────────────────
const VOID_SIGNALS = [
  { id: 1, signal: "B2B SaaS founders post-Series A have no intelligence layer for investor updates — every memo is written blind." },
  { id: 2, signal: "Legal ops gap: 90% of funded founders can't read their own cap tables without a lawyer on retainer." },
  { id: 3, signal: "AEC firms with 20-100 people have no collaboration middleware — every handoff is a Word doc on Dropbox." },
  { id: 4, signal: "EdTech platforms spend 40% of engineering time on content delivery infrastructure, not the actual learning product." },
  { id: 5, signal: "Health SaaS companies lose 60% of trial signups to onboarding complexity — no adaptive intake layer exists." },
];

const THINKING_LOG = [
  {
    date: "April 26, 2026",
    title: "On operational sovereignty vs team size",
    excerpt: "The question I get most from founders: 'How do you move this fast solo?' Wrong question. Speed isn't the output — it's the byproduct of removing every decision that doesn't compound. A team of 10 has 10 opinions on the nav bar. I have one. That one is shipped by Thursday."
  },
  {
    date: "April 19, 2026",
    title: "Why I never demo Jeeves to clients",
    excerpt: "The intelligence layer is the moat. Not because I'm hiding it — because the moment a client sees the system, they stop trusting the outputs and start auditing the process. Outputs only, always. The CTO doesn't tour the factory floor. He delivers the car."
  },
  {
    date: "April 12, 2026",
    title: "25 systems. Zero revenue. Maximum leverage.",
    excerpt: "Every product is proof that the methodology is real. Not a portfolio. A factory audit. When a founder asks 'can you build X?', the answer isn't a proposal. It's a URL. The gap between 0 and 1 is the only one that matters. I've crossed it 25 times this year."
  },
];

const PRODUCTS = [
  { name: "ORACLE™",    tag: "GEOPOLITICAL INTEL",    score: null, url: "https://stoic-global-oracle-pulse.base44.app",   desc: "Real-time geopolitical analysis for founders navigating macro uncertainty." },
  { name: "VERDICT™",   tag: "LEGAL INTELLIGENCE",    score: null, url: "https://smart-legal-verdict.base44.app",          desc: "Paste any clause → plain-English analysis, red flags, severity scores." },
  { name: "STACK™",     tag: "INFRASTRUCTURE AUDIT",  score: null, url: "https://stack-audit-core.base44.app",             desc: "Audits technical infrastructure for debt, risk, and architecture vulnerabilities." },
  { name: "SIGNAL™",    tag: "COMPETITIVE INTEL",     score: null, url: "https://signal-decode-hub.base44.app",            desc: "Decodes subtext in investor communications and market signals." },
  { name: "BRIEF™",     tag: "MEETING INTELLIGENCE",  score: null, url: "https://clear-brief-loop.base44.app",             desc: "Transforms raw meeting notes into structured intelligence across 5 lenses." },
];

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const THEMES = {
  researcher: {
    bg: '#0a0f1e', accent: '#4f9eff', accentDim: 'rgba(79,158,255,0.15)',
    text: '#e8edf5', muted: '#6b7a96', border: 'rgba(79,158,255,0.12)',
    card: 'rgba(79,158,255,0.04)',
  },
  founder: {
    bg: '#0d0d0d', accent: '#00ff88', accentDim: 'rgba(0,255,136,0.12)',
    text: '#f0f0f0', muted: '#666', border: 'rgba(0,255,136,0.12)',
    card: 'rgba(0,255,136,0.03)',
  },
  developer: {
    bg: '#000000', accent: '#00ff41', accentDim: 'rgba(0,255,65,0.08)',
    text: '#00ff41', muted: '#006616', border: 'rgba(0,255,65,0.15)',
    card: 'rgba(0,255,65,0.03)',
  },
  deep_work: {
    bg: '#080808', accent: '#ffffff', accentDim: 'rgba(255,255,255,0.05)',
    text: '#e0e0e0', muted: '#444', border: 'rgba(255,255,255,0.06)',
    card: 'rgba(255,255,255,0.02)',
  },
  default: {
    bg: '#030712', accent: '#00ff88', accentDim: 'rgba(0,255,136,0.10)',
    text: '#e8f0e8', muted: '#4a5a4a', border: 'rgba(0,255,136,0.10)',
    card: 'rgba(0,255,136,0.02)',
  },
  showcase: {
    bg: '#030712', accent: '#00ff88', accentDim: 'rgba(0,255,136,0.10)',
    text: '#e8f0e8', muted: '#4a5a4a', border: 'rgba(0,255,136,0.10)',
    card: 'rgba(0,255,136,0.02)',
  },
};

// ── UTILITY: CONVERSION TRACKING ──────────────────────────────────────────
function trackEvent(profileName, ctaClicked = false, ctaTarget = '') {
  const payload = {
    profile_name: profileName,
    referral_source: SIGNALS.source,
    time_window: SIGNALS.timeWindow,
    device: SIGNALS.device,
    cta_clicked: ctaClicked,
    cta_target: ctaTarget,
    session_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    timestamp: new Date().toISOString(),
  };
  // Fire-and-forget — no await, no error handling in UI
  // Analytics endpoint — update with live URL when hosted
  const ANALYTICS_URL = 'https://api.base44.com/api/apps/69e47ba9f040a1047cf35109/functions/trackPresenceEvent';
  fetch(ANALYTICS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {}); // silent fail — page has no backend requirement
}

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────
const GlobalStyle = ({ theme }) => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: ${theme.bg};
      color: ${theme.text};
      font-family: 'Courier New', Courier, monospace;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: ${theme.accent}33; }
    a { color: ${theme.accent}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .label {
      font-size: 11px;
      letter-spacing: 4px;
      color: ${theme.muted};
      text-transform: uppercase;
    }
    .section {
      padding: 80px 0;
      border-bottom: 1px solid ${theme.border};
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 32px;
    }
    @media (max-width: 768px) {
      .container { padding: 0 20px; }
      .section { padding: 48px 0; }
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 ${theme.accent}44; } 70% { box-shadow: 0 0 0 8px transparent; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes floatIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes counterUp { from { opacity: 0; } to { opacity: 1; } }
  `}</style>
);

// ── REUSABLE: BUTTON ───────────────────────────────────────────────────────
const Btn = ({ children, href, onClick, accent, size = 'md', style: sx = {}, ...props }) => {
  const pad = size === 'lg' ? '18px 40px' : size === 'sm' ? '8px 20px' : '12px 28px';
  const fs  = size === 'lg' ? '14px' : size === 'sm' ? '11px' : '12px';
  const base = {
    display: 'inline-block',
    padding: pad,
    fontSize: fs,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontFamily: 'Courier New, monospace',
    border: `1px solid ${accent}`,
    background: 'transparent',
    color: accent,
    cursor: 'pointer',
    borderRadius: 0,
    transition: 'background 0.2s, color 0.2s',
    textDecoration: 'none',
    ...sx,
  };
  const filled = { ...base, background: accent, color: '#000' };

  const [hov, setHov] = React.useState(false);
  const style = hov ? filled : base;

  if (href) return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       style={style}
       onMouseEnter={() => setHov(true)}
       onMouseLeave={() => setHov(false)}
       {...props}>
      {children}
    </a>
  );
  return (
    <button style={style} onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            {...props}>
      {children}
    </button>
  );
};

// ── REUSABLE: ANIMATED COUNTER ─────────────────────────────────────────────
const Counter = ({ target, suffix = '', prefix = '', duration = 800, accent }) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const isNum = typeof target === 'number';
    const end   = isNum ? target : parseFloat(target) || 0;
    const tick  = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);
  return (
    <span style={{ color: accent, fontWeight: 'bold' }}>
      {prefix}{val}{suffix}
    </span>
  );
};

// ── REUSABLE: SIGNAL TAG ───────────────────────────────────────────────────
const SignalTag = ({ label, value, theme }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    border: `1px solid ${theme.border}`,
    padding: '6px 14px', marginRight: 12, marginBottom: 8,
    fontSize: 11, letterSpacing: 3,
  }}>
    <span style={{ color: theme.muted }}>{label}</span>
    <span style={{ color: theme.accent }}>{value}</span>
  </span>
);

// ── REUSABLE: NAVIGATION ───────────────────────────────────────────────────
const Nav = ({ theme, onProfileSwitch, currentProfile }) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: theme.bg + 'ee',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${theme.border}`,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.4s',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56,
      }}>
        <span style={{ fontSize: 12, letterSpacing: 4, color: theme.accent, fontWeight: 700 }}>
          BRAINIAC LTD
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 20, fontSize: 10, letterSpacing: 3 }}>
            {[
              ['PRESENCE', '#'],
              ['SHOWCASE', '?profile=showcase'],
              ['PORTFOLIO', 'https://superchargebuilds.pro'],
              ['CALENDLY', 'https://calendly.com/tkrojzl'],
            ].map(([label, href]) => (
              <a key={label} href={href}
                 style={{ color: theme.muted, textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => e.target.style.color = theme.accent}
                 onMouseLeave={e => e.target.style.color = theme.muted}>
                {label}
              </a>
            ))}
          </div>
          <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="sm"
               onClick={() => trackEvent(currentProfile, true, 'calendly_nav')}>
            BOOK A CALL
          </Btn>
        </div>
      </div>
    </nav>
  );
};

// ── BOOT SEQUENCE ──────────────────────────────────────────────────────────
const BootSequence = ({ onComplete, profile }) => {
  const lines = [
    `> PRESENCE v2.0 — INTELLIGENCE AMPLIFICATION INTERFACE`,
    `> READING VISITOR STATE...`,
    `> SOURCE DETECTED: ${SIGNALS.source}`,
    `> TIME WINDOW: ${SIGNALS.timeWindow}`,
    `> DEVICE CONTEXT: ${SIGNALS.device}`,
    `> CROSS-REFERENCING 5 STRUCTURAL CONFIGURATIONS...`,
    `> MATCH FOUND: ${profile.toUpperCase().replace('_', ' ')}`,
    `> ASSEMBLING...`,
  ];

  const [displayedLines, setDisplayedLines] = React.useState([]);
  const [charIdx, setCharIdx]   = React.useState(0);
  const [lineIdx, setLineIdx]   = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [done, setDone]         = React.useState(false);

  React.useEffect(() => {
    if (lineIdx >= lines.length) {
      // Progress bar
      const t0 = performance.now();
      const anim = (now) => {
        const p = Math.min((now - t0) / 380, 1);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(anim);
        else { setDone(true); setTimeout(onComplete, 80); }
      };
      requestAnimationFrame(anim);
      return;
    }
    const currentLine = lines[lineIdx];
    if (charIdx <= currentLine.length) {
      const t = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[lineIdx] = currentLine.slice(0, charIdx);
          return next;
        });
        setCharIdx(c => c + 1);
      }, 14);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 60);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'flex-start',
      padding: '10vw', zIndex: 999,
      fontFamily: 'Courier New, monospace',
    }}>
      <div style={{ maxWidth: 640, width: '100%' }}>
        {displayedLines.map((line, i) => (
          <div key={i} style={{ color: '#00ff41', fontSize: 13, lineHeight: 2, letterSpacing: 1 }}>
            {line}
            {i === lineIdx && !done && (
              <span style={{ animation: 'blink 1s infinite', display: 'inline-block', marginLeft: 2 }}>█</span>
            )}
          </div>
        ))}
        {lineIdx >= lines.length && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 11, color: '#006616', letterSpacing: 3, marginBottom: 8 }}>ASSEMBLING</div>
            <div style={{ width: '100%', height: 2, background: '#111', position: 'relative' }}>
              <div style={{
                height: '100%', background: '#00ff41',
                width: `${progress}%`, transition: 'width 0.02s linear',
              }}/>
            </div>
            <div style={{ fontSize: 11, color: '#006616', letterSpacing: 3, marginTop: 6 }}>
              {progress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── VOID FEED ──────────────────────────────────────────────────────────────
const VoidFeed = ({ theme }) => {
  const [idx, setIdx] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % VOID_SIGNALS.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      border: `1px solid ${theme.border}`,
      background: theme.card,
      padding: '24px 32px',
    }}>
      <div className="label" style={{ marginBottom: 12 }}>// VOID SIGNAL — LIVE MARKET GAP</div>
      <div style={{
        fontSize: 15, lineHeight: 1.8, color: theme.text,
        opacity: fade ? 1 : 0, transition: 'opacity 0.4s',
        minHeight: 52,
      }}>
        <span style={{ color: theme.accent }}>▸ </span>
        {VOID_SIGNALS[idx].signal}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
        ROTATING EVERY 4s — {VOID_SIGNALS.length} GAPS IDENTIFIED TODAY
      </div>
    </div>
  );
};

// ── COMPARISON TABLE ───────────────────────────────────────────────────────
const ComparisonTable = ({ theme }) => {
  const rows = [
    ['Timeline',      '4–8 weeks\n(real: ~2 weeks)', '4–6 months',     '6–12 months'],
    ['Cost',          '£8,500 all-in',                '£2K–8K/project', '£50K+'],
    ['IP Ownership',  '100% client',                  'Varies',         'Agency retains'],
    ['Alignment',     '2% rev share — aligned',       'Hourly — misaligned', 'Retainer — misaligned'],
    ['Velocity',      '25 systems / 5 months',        '1 project at a time', 'Committee decisions'],
    ['Availability',  '1 client at a time — focus',   'Juggling 10+ clients','50+ clients'],
  ];
  const cols = ['', 'BRAINIAC LTD', 'FREELANCER', 'AGENCY'];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={col} style={{
                padding: '12px 16px', textAlign: i === 0 ? 'left' : 'center',
                fontSize: 10, letterSpacing: 3, color: i === 1 ? theme.accent : theme.muted,
                borderBottom: `1px solid ${theme.border}`,
                fontWeight: i === 1 ? 700 : 400,
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...vals], ri) => (
            <tr key={ri} style={{ borderBottom: `1px solid ${theme.border}` }}>
              <td style={{ padding: '14px 16px', color: theme.muted, fontSize: 11, letterSpacing: 2 }}>{label.toUpperCase()}</td>
              {vals.map((v, vi) => (
                <td key={vi} style={{
                  padding: '14px 16px', textAlign: 'center',
                  color: vi === 0 ? theme.text : theme.muted,
                  fontWeight: vi === 0 ? 600 : 400,
                  fontSize: vi === 0 ? 13 : 12,
                  background: vi === 0 ? theme.accentDim : 'transparent',
                  whiteSpace: 'pre-line',
                }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── PRODUCT CARDS ──────────────────────────────────────────────────────────
const ProductGrid = ({ theme, profile }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  }}>
    {PRODUCTS.map(p => (
      <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
         onClick={() => trackEvent(profile, true, `product_${p.name}`)}
         style={{ textDecoration: 'none' }}>
        <div style={{
          border: `1px solid ${theme.border}`,
          background: theme.card,
          padding: '24px',
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = theme.accent + '55';
            e.currentTarget.style.background = theme.accentDim;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.background = theme.card;
          }}>
          <div className="label" style={{ marginBottom: 8 }}>{p.tag}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.accent, marginBottom: 8 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.7 }}>{p.desc}</div>
          <div style={{ marginTop: 16, fontSize: 10, color: theme.accent, letterSpacing: 3 }}>LAUNCH ↗</div>
        </div>
      </a>
    ))}
  </div>
);

// ── SOVEREIGNTY STACK OFFER ────────────────────────────────────────────────
const StackOffer = ({ theme, profile }) => (
  <div style={{
    border: `1px solid ${theme.accent}33`,
    background: theme.accentDim,
    padding: '40px 40px',
  }}>
    <div className="label" style={{ marginBottom: 16 }}>THE SOVEREIGNTY STACK™</div>
    <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 24, color: theme.text }}>
      Custom AI product<br/>+ self-running ops layer
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 32 }}>
      {[
        ['INVESTMENT',  '£8,500 minimum'],
        ['REVENUE',     '2% rev share'],
        ['TIMELINE',    '4–8 weeks'],
        ['OWNERSHIP',   '100% client IP'],
        ['CAPACITY',    '1 client at a time'],
      ].map(([k, v]) => (
        <div key={k}>
          <div className="label" style={{ marginBottom: 4 }}>{k}</div>
          <div style={{ fontSize: 16, color: theme.accent }}>{v}</div>
        </div>
      ))}
    </div>
    <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
         onClick={() => trackEvent(profile, true, 'calendly_stack_offer')}>
      BOOK DISCOVERY CALL — 30 MIN, FREE ↗
    </Btn>
    <div style={{ marginTop: 16, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
      1 CLIENT SLOT OPEN — NO RETAINER, NO AGENCY MARKUP
    </div>
  </div>
);

// ── FOOTER ─────────────────────────────────────────────────────────────────
const Footer = ({ theme }) => (
  <footer style={{
    borderTop: `1px solid ${theme.border}`,
    padding: '48px 0',
    marginTop: 0,
  }}>
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontSize: 14, color: theme.accent, letterSpacing: 3, marginBottom: 8 }}>BRAINIAC LTD</div>
          <div style={{ fontSize: 12, color: theme.muted, lineHeight: 2 }}>
            Thomas Krojzl — Intelligence Amplification<br/>
            25 production AI systems. Average build time: 2 weeks.<br/>
            Tools that make one person capable of what used to require a team.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, letterSpacing: 2 }}>
          <a href="https://calendly.com/tkrojzl" style={{ color: theme.muted }}>CALENDLY.COM/TKROJZL</a>
          <a href="https://superchargebuilds.pro" style={{ color: theme.muted }}>SUPERCHARGEBUILDS.PRO</a>
          <a href="https://media.base44.com/files/public/69e47ba9f040a1047cf35109/e92742947_manifesto.html" target="_blank" rel="noopener noreferrer" style={{ color: theme.muted }}>READ THE MANIFESTO</a>
        </div>
      </div>
      <div style={{ marginTop: 32, fontSize: 10, color: theme.muted + '88', letterSpacing: 2 }}>
        PRESENCE v2.0 — BUILT SOLO — BRAINIAC LTD © 2026
      </div>
    </div>
  </footer>
);

// ── FLOATING ELEMENTS ──────────────────────────────────────────────────────
const FloatingElements = ({ theme, profile, onProfileSwitch, assemblyMs }) => {
  const [show, setShow]       = React.useState(false);
  const [pulseBtn, setPulse]  = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 600);
    const t2 = setTimeout(() => setPulse(true), 30000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const profiles = ['RESEARCHER','FOUNDER','DEVELOPER','DEEP_WORK','DEFAULT'];

  return (
    <>
      {/* Bottom-right: PRESENCE ACTIVE */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 200,
        fontSize: 10, letterSpacing: 3, color: theme.muted,
        opacity: show ? 1 : 0, transition: 'opacity 0.6s',
        background: theme.bg + 'ee',
        border: `1px solid ${theme.border}`,
        padding: '6px 12px',
      }}>
        PRESENCE ACTIVE — {assemblyMs}ms
      </div>

      {/* Bottom-left: Profile switcher */}
      <div style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 200,
        opacity: show ? 1 : 0, transition: 'opacity 0.6s',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: theme.muted, marginBottom: 4 }}>SWITCH PROFILE</div>
        {profiles.map(p => {
          const key = p.toLowerCase();
          const active = key === profile;
          return (
            <button key={p}
              onClick={() => onProfileSwitch(key)}
              style={{
                background: active ? theme.accent : 'transparent',
                color: active ? '#000' : theme.muted,
                border: `1px solid ${active ? theme.accent : theme.border}`,
                fontSize: 9, letterSpacing: 2, padding: '4px 10px',
                cursor: 'pointer', fontFamily: 'Courier New, monospace',
                borderRadius: 0,
              }}>
              {p}
            </button>
          );
        })}
      </div>
    </>
  );
};

// ==========================================================================
// ── PROFILE: RESEARCHER ───────────────────────────────────────────────────
// ==========================================================================
const NetworkNode = ({ theme }) => {
  const nodes = [
    { x: 50, y: 50, r: 5, label: 'PRESENCE' },
    { x: 20, y: 20, r: 3, label: 'VOID' },
    { x: 80, y: 25, r: 3, label: 'SIGNAL' },
    { x: 15, y: 70, r: 3, label: 'BRIEF' },
    { x: 75, y: 75, r: 3, label: 'JEEVES' },
    { x: 50, y: 10, r: 2, label: 'ORACLE' },
    { x: 90, y: 50, r: 2, label: 'STACK' },
    { x: 10, y: 45, r: 2, label: 'VERDICT' },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
    [1,2],[2,5],[3,4],[4,6],[1,7],
  ];

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: 400, height: 'auto' }}>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -20; } }
        @keyframes glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
      {edges.map(([a,b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={theme.accent} strokeWidth="0.3" strokeOpacity="0.4"
          strokeDasharray="3 2"
          style={{ animation: `dash ${2 + i * 0.3}s linear infinite` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 2}
            fill="none" stroke={theme.accent} strokeWidth="0.3" strokeOpacity="0.3"
            style={{ animation: `glow ${1.5 + i * 0.2}s ease-in-out infinite` }}
          />
          <circle cx={n.x} cy={n.y} r={n.r}
            fill={theme.accent} fillOpacity="0.8"
          />
          {i === 0 && (
            <text x={n.x} y={n.y + 8} textAnchor="middle"
              fill={theme.accent} fontSize="3" fontFamily="Courier New">
              {n.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const ProfileResearcher = ({ theme }) => {
  React.useEffect(() => { trackEvent('researcher'); }, []);

  const SYSTEMS = [
    {
      name: 'PRESENCE',
      tag: 'ADAPTIVE INFERENCE ENGINE',
      desc: 'Three anonymous browser signals. Five structural configurations. Zero backend. Signal detection runs synchronously at module scope, before any React render, in <1ms. The page you\'re reading is its own documentation.',
      arch: 'Synchronous signal inference → Profile selection tree → Conditional React render → Fire-and-forget event log',
    },
    {
      name: 'JEEVES / ARCHON STACK™',
      tag: 'AI CHIEF OF STAFF',
      desc: 'A persistent intelligence layer that externalises memory, decision frameworks, and operational context for a solo founder. Replaces CRM, inbox, and strategic working memory.',
      arch: 'Entity graph + temporal context → Prompt injection → Structured output → Action routing',
    },
    {
      name: 'VOID™',
      tag: 'MARKET GAP DETECTION SYSTEM',
      desc: 'Surfaces structural market gaps by cross-referencing signal patterns across verticals. Not trend-following — gap identification. The five VOID signals on this page are live outputs.',
      arch: 'Multi-axis signal taxonomy → Gap classification → Actioned/unactioned state → Rotating display layer',
    },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <GlobalStyle theme={theme} />

      {/* HERO */}
      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="label" style={{ marginBottom: 24 }}>PRESENCE DETECTED // NETWORK ORIGIN</div>
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700,
                lineHeight: 1.1, margin: 0, color: theme.text,
              }}>
                You build<br/>
                <span style={{ color: theme.accent }}>systems.</span><br/>
                So do I.
              </h1>
            </div>
            <NetworkNode theme={theme} />
          </div>
        </div>
      </div>

      {/* ARCHITECTURE META-EXPLANATION */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// HOW THIS PAGE WORKS AS A SYSTEM</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {[
              ['01 // INPUT', 'Three anonymous signals read synchronously: referrer, time window, device width. No cookies. No async. No server call.'],
              ['02 // INFERENCE', 'Referrer pattern-matching against a weighted source taxonomy. 14 known origins, 5 profile bins, 1 pass.'],
              ['03 // RENDER', 'Profile resolved before first React render. Zero layout shift. Five completely different page structures.'],
              ['04 // OUTPUT', 'You\'re seeing RESEARCHER because your referrer matched a network/academic origin pattern.'],
            ].map(([label, body]) => (
              <div key={label} style={{
                padding: '32px',
                borderLeft: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: theme.accent, marginBottom: 12 }}>{label}</div>
                <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THREE SYSTEMS */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// FLAGSHIP SYSTEMS — ARCHITECTURE DEPTH</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SYSTEMS.map((s, i) => (
              <div key={i} style={{
                border: `1px solid ${theme.border}`,
                borderBottom: i < SYSTEMS.length - 1 ? 'none' : `1px solid ${theme.border}`,
                padding: '32px',
                background: theme.card,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div className="label" style={{ marginBottom: 8 }}>{s.tag}</div>
                    <div style={{ fontSize: 22, color: theme.accent, marginBottom: 16 }}>{s.name}</div>
                    <div style={{ fontSize: 14, color: theme.muted, lineHeight: 1.8, maxWidth: 480 }}>{s.desc}</div>
                  </div>
                  <div style={{
                    fontSize: 11, color: theme.accent + '99', lineHeight: 1.8,
                    fontStyle: 'italic', maxWidth: 280,
                    padding: '16px', background: theme.accentDim,
                    border: `1px solid ${theme.border}`,
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 10, letterSpacing: 3, marginBottom: 8, fontStyle: 'normal', color: theme.muted }}>ARCHITECTURE</div>
                    {s.arch}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THINKING LOG */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// PUBLISHED THINKING — THINKINGLOG EXTRACTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {THINKING_LOG.map((entry, i) => (
              <div key={i} style={{
                border: `1px solid ${theme.border}`,
                padding: '32px',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 10, color: theme.muted, letterSpacing: 2 }}>
                  {entry.date.toUpperCase()}
                </div>
                <div style={{ fontSize: 16, color: theme.text, marginBottom: 16, paddingRight: 120 }}>{entry.title}</div>
                <div style={{ fontSize: 14, color: theme.muted, lineHeight: 1.9, fontStyle: 'italic' }}>
                  "{entry.excerpt}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <Btn accent={theme.accent} size="lg"
                 onClick={() => {
                   trackEvent('researcher', true, 'architecture_modal');
                   document.getElementById('arch-modal').style.display = 'flex';
                 }}>
              EXPLORE THE ARCHITECTURE ↗
            </Btn>
            <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
                 onClick={() => trackEvent('researcher', true, 'calendly_build_together')}>
              BUILD SOMETHING TOGETHER ↗
            </Btn>
          </div>
        </div>
      </div>

      {/* ARCHITECTURE MODAL */}
      <div id="arch-modal" style={{
        display: 'none', position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center',
        padding: 24,
      }}
        onClick={e => { if (e.target.id === 'arch-modal') e.target.style.display = 'none'; }}>
        <div style={{
          background: theme.bg, border: `1px solid ${theme.border}`,
          padding: '40px', maxWidth: 640, width: '100%', maxHeight: '80vh', overflowY: 'auto',
        }}>
          <div className="label" style={{ marginBottom: 24 }}>SIGNAL-TO-STRUCTURE PIPELINE</div>
          {[
            ['MODULE SCOPE', 'Signal detection runs synchronously at module scope before any React render. Three reads: document.referrer, new Date().getHours(), window.innerWidth. Total execution: <1ms.'],
            ['PATTERN MATCH', 'Referrer string is tested against 14 known origin patterns in a single pass. Matched against: academic, founder community, developer community, or empty (direct). Unmatched + early morning → DEEP WORK.'],
            ['PROFILE TREE', 'Five bins: RESEARCHER, FOUNDER, DEVELOPER, DEEP_WORK, DEFAULT. No ML. No probabilistic inference. Deterministic pattern tree — zero hallucination by design.'],
            ['FORCED ROUTES', 'Paths /r, /f, /d force profiles for sharing. URL param ?profile= overrides all. Lets Tom share a specific profile with specific leads.'],
            ['RENDER GATE', 'Boot sequence (400ms) plays for FOUNDER and DEFAULT. All other profiles render immediately — respecting deep work time and developer attention patterns.'],
            ['EVENT LOG', 'On profile assembly: fire-and-forget POST to /api/presence-event. No await. No error handling in UI. Fields: profile, source, time_window, device, session_id, timestamp. No PII.'],
          ].map(([title, body]) => (
            <div key={title} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 3, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.8 }}>{body}</div>
            </div>
          ))}
          <button onClick={() => document.getElementById('arch-modal').style.display = 'none'}
            style={{ marginTop: 16, background: 'transparent', border: `1px solid ${theme.border}`, color: theme.muted, padding: '8px 20px', cursor: 'pointer', fontFamily: 'Courier New', fontSize: 11, letterSpacing: 3 }}>
            CLOSE
          </button>
        </div>
      </div>

      <StackOffer theme={theme} profile="researcher" />
      <Footer theme={theme} />
    </div>
  );
};

// ==========================================================================
// ── PROFILE: FOUNDER ──────────────────────────────────────────────────────
// ==========================================================================
const ProfileFounder = ({ theme, booted }) => {
  React.useEffect(() => { if (booted) trackEvent('founder'); }, [booted]);
  if (!booted) return null;

  return (
    <div style={{ paddingTop: 80, animation: 'fadeIn 0.4s ease' }}>
      <GlobalStyle theme={theme} />

      {/* ANIMATED COUNTER ROW */}
      <div style={{
        borderBottom: `1px solid ${theme.border}`,
        padding: '32px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 0,
          }}>
            {[
              { prefix: '', target: 25, suffix: '',    label: 'SYSTEMS BUILT' },
              { prefix: '~', target: 2,  suffix: ' WKS', label: 'AVG BUILD TIME' },
              { prefix: '£', target: 8.5, suffix: 'K',  label: 'STARTING PRICE' },
              { prefix: '', target: 2,  suffix: '%',   label: 'REV SHARE' },
            ].map((c, i) => (
              <div key={i} style={{
                padding: '24px 32px',
                borderRight: i < 3 ? `1px solid ${theme.border}` : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, fontWeight: 700 }}>
                  <Counter prefix={c.prefix} target={c.target} suffix={c.suffix} accent={theme.accent} />
                </div>
                <div className="label" style={{ marginTop: 8 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// FOUNDER TO FOUNDER</div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700,
            lineHeight: 1.15, margin: '0 0 24px', color: theme.text,
            maxWidth: 640,
          }}>
            I build what agencies<br/>
            quote <span style={{ color: theme.accent }}>£80K</span> for.<br/>
            In 4–8 weeks. For £8.5K.
          </h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
            <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
                 onClick={() => trackEvent('founder', true, 'calendly_hero')}>
              BOOK DISCOVERY CALL — FREE ↗
            </Btn>
            <Btn href="https://superchargebuilds.pro" accent={theme.accent} size="lg"
                 onClick={() => trackEvent('founder', true, 'portfolio')}>
              SEE THE PORTFOLIO ↗
            </Btn>
          </div>
          <div style={{ fontSize: 12, color: theme.muted, letterSpacing: 2 }}>
            ⚡ 1 CLIENT SLOT OPEN — DISCOVERY CALL IS FREE — 30 MINUTES
          </div>
        </div>
      </div>

      {/* VOID FEED */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// WHAT THE MARKET NEEDS RIGHT NOW</div>
          <VoidFeed theme={theme} />
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// THE SOVEREIGNTY STACK — WHAT YOU GET</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              ['CUSTOM AI PRODUCT', 'Built to your spec. Not a template, not a SaaS subscription. A production-grade system owned entirely by you.'],
              ['SELF-RUNNING OPS LAYER', 'The ops infrastructure runs itself. You show up for calls. Everything else is automated.'],
              ['2-WEEK REAL PACE', 'Quoted 4–8 weeks. Real pace: ~2 weeks. Every time. I\'ve done it 25 times.'],
              ['100% YOUR IP', 'No agency ownership clause. No vendor lock-in. You own the code, the system, the moat.'],
              ['2% REV SHARE', 'Alignment over retainers. I succeed when you succeed. No monthly invoice disconnected from your growth.'],
              ['1 CLIENT AT A TIME', 'You\'re not client #47. You\'re the only client. Full attention. Full velocity.'],
            ].map(([title, body]) => (
              <div key={title} style={{
                border: `1px solid ${theme.border}`,
                background: theme.card,
                padding: '24px',
              }}>
                <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 3, marginBottom: 12 }}>{title}</div>
                <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// TOM VS AGENCY VS FREELANCER</div>
          <ComparisonTable theme={theme} />
        </div>
      </div>

      {/* 5 LIVE PRODUCTS */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// 5 LIVE PRODUCTS — CLICK TO LAUNCH</div>
          <ProductGrid theme={theme} profile="founder" />
        </div>
      </div>

      {/* MAIN CTA */}
      <div className="section" style={{ background: theme.accentDim }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 16 }}>ONE SLOT OPEN</div>
          <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
               onClick={() => trackEvent('founder', true, 'calendly_final')}
               style={{ animation: 'pulse 2s infinite' }}>
            BOOK DISCOVERY CALL — 30 MIN, FREE ↗
          </Btn>
          <div style={{ marginTop: 16, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
            NO PITCH DECK. NO RETAINER. JUST OUTCOMES.
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

// ==========================================================================
// ── PROFILE: DEVELOPER ────────────────────────────────────────────────────
// ==========================================================================
const ProfileDeveloper = ({ theme }) => {
  React.useEffect(() => { trackEvent('developer'); }, []);

  const codeLines = [
    { code: `// PRESENCE v2.0 — Signal Detection Engine`, color: '#006616' },
    { code: `// Runs synchronously at module scope — before first React render`, color: '#006616' },
    { code: ``, color: '' },
    { code: `const SIGNALS = (() => {`, color: '#00ff41' },
    { code: `  // 1. REFERRAL SOURCE — pattern match against known origins`, color: '#006616' },
    { code: `  const referrer = document.referrer || '';`, color: '#00ff41' },
    { code: `  const ref = new URLSearchParams(location.search).get('ref') || '';`, color: '#00ff41' },
    { code: `  const src = (referrer + ' ' + ref).toLowerCase();`, color: '#00ff41' },
    { code: ``, color: '' },
    { code: `  // 2. TIME WINDOW — maps hour to semantic context`, color: '#006616' },
    { code: `  const hour = new Date().getHours(); // local time, no server call`, color: '#00ff41' },
    { code: `  const timeWindow =`, color: '#00ff41' },
    { code: `    hour >= 5  && hour < 8  ? 'EARLY'     :`, color: '#4a8a4a' },
    { code: `    hour >= 8  && hour < 12 ? 'DEEP_WORK' :`, color: '#4a8a4a' },
    { code: `    hour >= 12 && hour < 17 ? 'AFTERNOON' :`, color: '#4a8a4a' },
    { code: `    hour >= 17 && hour < 22 ? 'EVENING'   : 'LATE';`, color: '#4a8a4a' },
    { code: ``, color: '' },
    { code: `  // 3. DEVICE CONTEXT — single breakpoint, no resize listener needed`, color: '#006616' },
    { code: `  const device = window.innerWidth < 768 ? 'MOBILE' : 'DESKTOP';`, color: '#00ff41' },
    { code: ``, color: '' },
    { code: `  // PROFILE SELECTION — deterministic, not probabilistic`, color: '#006616' },
    { code: `  let profile = 'default'; // fallback`, color: '#00ff41' },
    { code: `  if (src.includes('github') || src.includes('stackoverflow'))`, color: '#00ff41' },
    { code: `    profile = 'developer';  // → you're seeing this profile`, color: '#006616' },
    { code: `  else if (src.includes('linkedin') || referrer.includes('.edu'))`, color: '#00ff41' },
    { code: `    profile = 'researcher';`, color: '#00ff41' },
    { code: `  else if (src.includes('producthunt') || src.includes('ycombinator'))`, color: '#00ff41' },
    { code: `    profile = 'founder';`, color: '#00ff41' },
    { code: `  else if (!referrer && hour >= 5 && hour < 8)`, color: '#00ff41' },
    { code: `    profile = 'deep_work'; // respects the early morning window`, color: '#006616' },
    { code: ``, color: '' },
    { code: `  return { source, timeWindow, device, profile };`, color: '#00ff41' },
    { code: `})(); // IIFE — runs once, synchronously, before React boots`, color: '#006616' },
  ];

  const [revealedLines, setRevealed] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => {
      setRevealed(n => {
        if (n >= codeLines.length) { clearInterval(t); return n; }
        return n + 1;
      });
    }, 60);
    return () => clearInterval(t);
  }, []);

  const perfSteps = [
    { label: 'HTML PARSE',        ms: 18,  w: 18 },
    { label: 'SIGNAL DETECTION',  ms: 0.4, w: 1  },
    { label: 'PROFILE RESOLVE',   ms: 0.1, w: 0.5 },
    { label: 'REACT BOOT',        ms: 45,  w: 45 },
    { label: 'RENDER',            ms: 8,   w: 8  },
    { label: 'PAINT',             ms: 3,   w: 3  },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <GlobalStyle theme={theme} />

      {/* HERO: CODE REVEAL */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// SOURCE CODE REVEAL</div>
          <div style={{
            background: '#0a0a0a', border: `1px solid ${theme.border}`,
            padding: '32px', overflowX: 'auto',
          }}>
            <div style={{ fontSize: 11, color: '#006616', letterSpacing: 3, marginBottom: 16 }}>
              // presence.html:signal-detection — {revealedLines}/{codeLines.length} lines
            </div>
            {codeLines.slice(0, revealedLines).map((l, i) => (
              <div key={i} style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 12, lineHeight: 1.8,
                color: l.color || '#333',
                animation: 'fadeIn 0.2s ease',
              }}>
                <span style={{ color: '#333', userSelect: 'none', marginRight: 16 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {l.code}
              </div>
            ))}
            {revealedLines < codeLines.length && (
              <span style={{ color: theme.accent, animation: 'blink 1s infinite', display: 'inline-block' }}>█</span>
            )}
          </div>
        </div>
      </div>

      {/* HERO TEXT */}
      <div className="section">
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700,
            lineHeight: 1.2, margin: 0, color: theme.accent,
          }}>
            This page read you<br/>in &lt;1ms. Here's how.
          </h1>
        </div>
      </div>

      {/* TECHNICAL WALKTHROUGH */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// BOOT SEQUENCE — DECISION LOG</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['WHY SYNCHRONOUS?', 'Async detection causes layout shift. If signal detection runs in useEffect (the React default), the DOM renders once with the wrong profile, then re-renders. Users see a flicker. The IIFE pattern at module scope means the profile is resolved before the first paint.'],
              ['WHY NO BACKEND?', 'Zero latency, zero CORS, zero infrastructure cost, zero GDPR surface area. The three signals (referrer, time, viewport) are all client-side browser APIs. No request required.'],
              ['WHY 5 PROFILES?', 'Infinite personalisation degrades to noise. Five archetypes cover 95%+ of meaningful visitor intents: researcher, founder, developer, early-morning direct, everyone else. More than 5 would be unmaintainable; fewer would be blunt.'],
              ['WHY NO localStorage?', 'Session isolation is intentional. Every visit reads fresh signals. A developer who visits at 5am should get DEEP_WORK, not DEVELOPER from their cached profile. The signals are the truth — not the history.'],
              ['THE EVENT LOG', 'Fire-and-forget POST to /api/presence-event. No await in UI code. Even if the endpoint is down, the visitor experience is unaffected. Fields logged: profile, source, time_window, device, session_id (random UUID), timestamp. Zero PII.'],
            ].map(([title, body], i) => (
              <div key={i} style={{
                padding: '24px 32px',
                borderBottom: `1px solid ${theme.border}`,
                display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32,
                alignItems: 'start',
              }}>
                <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 3, paddingTop: 2 }}>{title}</div>
                <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PERFORMANCE TIMELINE */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// PERFORMANCE TIMELINE — ACTUAL TIMINGS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {perfSteps.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 60px', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 10, color: theme.muted, letterSpacing: 3 }}>{s.label}</div>
                <div style={{ background: '#111', height: 6, position: 'relative' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(s.w, 0.5)}%`,
                    background: s.label === 'SIGNAL DETECTION' ? theme.accent : theme.accent + '44',
                    transition: 'width 0.8s ease',
                  }}/>
                </div>
                <div style={{ fontSize: 11, color: s.label === 'SIGNAL DETECTION' ? theme.accent : theme.muted, letterSpacing: 2 }}>
                  {s.ms < 1 ? `${s.ms}ms` : `~${s.ms}ms`}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
            SIGNAL DETECTION IS THE FASTEST STEP. BY FAR.
          </div>
        </div>
      </div>

      {/* WHAT I BUILD */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// WHAT I BUILD — 25 SYSTEMS IN 5 MONTHS</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(52, 1fr)',
            gap: 2, marginBottom: 16, overflowX: 'auto',
          }}>
            {Array.from({ length: 52 * 5 }).map((_, i) => {
              const week = Math.floor(i / 5);
              const active = week < 25 && Math.random() > 0.3;
              return (
                <div key={i} style={{
                  width: 10, height: 10,
                  background: active ? theme.accent + (Math.random() > 0.5 ? 'cc' : '66') : '#111',
                  borderRadius: 1,
                }}/>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
            25 PRODUCTION SYSTEMS — 5 MONTHS — SOLO
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// WANT THIS BUILT FOR YOUR PRODUCT?</div>
          <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
               onClick={() => trackEvent('developer', true, 'calendly_dev')}>
            CALENDLY.COM/TKROJZL ↗
          </Btn>
          <div style={{ marginTop: 16, fontSize: 11, color: theme.muted, lineHeight: 2 }}>
            // £8,500 all-in. 2% rev share. You own the IP.<br/>
            // I take one client at a time.
          </div>
        </div>
      </div>

      <ComparisonTable theme={theme} />
      <Footer theme={theme} />
    </div>
  );
};


// ==========================================================================
// ── PROFILE: DEEP WORK ────────────────────────────────────────────────────
// ==========================================================================
const ProfileDeepWork = ({ theme }) => {
  React.useEffect(() => { trackEvent('deep_work'); }, []);

  return (
    <div style={{ paddingTop: 0 }}>
      <GlobalStyle theme={theme} />

      {/* ONE SCREEN — NO SCROLL INITIALLY */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10vw',
      }}>
        <div style={{ marginBottom: 64 }}>
          <div className="label" style={{ marginBottom: 48, opacity: 0.5 }}>
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — DIRECT — {SIGNALS.device}
          </div>
          <div style={{
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 700, lineHeight: 1.1,
            color: theme.text,
          }}>
            You're up early.<br/>
            <span style={{ color: theme.accent }}>So am I.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 18, color: theme.muted, letterSpacing: 2 }}>
            25 AI systems built solo.
          </div>
          <div style={{ fontSize: 18, color: theme.muted, letterSpacing: 2 }}>
            One client slot open.
          </div>
          <a href="https://calendly.com/tkrojzl"
             onClick={() => trackEvent('deep_work', true, 'calendly')}
             style={{
               fontSize: 18, color: theme.accent, letterSpacing: 2,
               textDecoration: 'none', borderBottom: `1px solid ${theme.accent}44`,
               paddingBottom: 2, display: 'inline-block',
             }}>
            calendly.com/tkrojzl
          </a>
        </div>

        <div style={{ marginTop: 80, fontSize: 10, color: theme.muted + '55', letterSpacing: 3 }}>
          ↓ SCROLL FOR THINKING LOG
        </div>
      </div>

      {/* SINGLE LONG-FORM THINKING LOG — below fold */}
      <div style={{ padding: '80px 10vw', borderTop: `1px solid ${theme.border}` }}>
        <div className="label" style={{ marginBottom: 32 }}>THINKINGLOG — {THINKING_LOG[0].date.toUpperCase()}</div>
        <div style={{ fontSize: 28, color: theme.text, marginBottom: 32, fontWeight: 700, maxWidth: 600 }}>
          {THINKING_LOG[0].title}
        </div>
        <div style={{ fontSize: 16, color: theme.muted, lineHeight: 2, maxWidth: 640 }}>
          {THINKING_LOG[0].excerpt}
        </div>

        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 16, color: theme.muted, lineHeight: 2, maxWidth: 640 }}>
            The real question isn't 'how do you move this fast.' It's 'what do you not do.' Every decision that doesn't compound is a decision I've already systemised. Outreach runs on Jeeves. Memory lives in PRESENCE. The only thing I do manually is the work that requires judgment.
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 16, color: theme.muted, lineHeight: 2, maxWidth: 640 }}>
            Operational sovereignty isn't about automation. It's about removing the decisions that drain the fraction of your cognitive budget you actually own. I built 25 systems in 5 months not because I'm fast — but because I never once asked myself 'where do I start.'
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <a href="https://calendly.com/tkrojzl"
             onClick={() => trackEvent('deep_work', true, 'calendly_belowfold')}
             style={{ fontSize: 13, color: theme.accent, letterSpacing: 3, textDecoration: 'none' }}>
            CALENDLY.COM/TKROJZL — 30 MIN, FREE ↗
          </a>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

// ==========================================================================
// ── PROFILE: DEFAULT ──────────────────────────────────────────────────────
// ==========================================================================
const ProfileDefault = ({ theme, booted }) => {
  React.useEffect(() => { if (booted) trackEvent('default'); }, [booted]);
  if (!booted) return null;

  return (
    <div style={{ paddingTop: 80, animation: 'fadeIn 0.4s ease' }}>
      <GlobalStyle theme={theme} />

      {/* META-EXPLANATION */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// THIS PAGE JUST READ THREE THINGS ABOUT YOU</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 40 }}>
            <SignalTag label="SOURCE" value={SIGNALS.source} theme={theme} />
            <SignalTag label="WINDOW" value={SIGNALS.timeWindow} theme={theme} />
            <SignalTag label="DEVICE" value={SIGNALS.device} theme={theme} />
          </div>
          <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.9, maxWidth: 580 }}>
            Three anonymous signals. Synchronous detection — runs before the first React render,
            in under 1ms, with no backend call, no cookies, and no tracking scripts.
            Five completely different page structures are pre-compiled. You're seeing Default
            because your referral origin didn't match a known pattern. That's interesting in itself.
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>BRAINIAC LTD — INTELLIGENCE AMPLIFICATION</div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 700,
            lineHeight: 1.1, margin: '0 0 24px', color: theme.text,
            maxWidth: 700,
          }}>
            I build Intelligence<br/>
            Amplification <span style={{ color: theme.accent }}>systems.</span>
          </h1>
          <p style={{ fontSize: 18, color: theme.muted, lineHeight: 1.8, maxWidth: 520, margin: '0 0 40px' }}>
            Tools that make one person capable of what used to require a team of ten.
            25 production systems built solo. Average build time: 2 weeks.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Btn href="https://calendly.com/tkrojzl" accent={theme.accent} size="lg"
                 onClick={() => trackEvent('default', true, 'calendly_hero')}>
              BOOK A CALL ↗
            </Btn>
            <Btn href="https://superchargebuilds.pro" accent={theme.accent} size="lg"
                 onClick={() => trackEvent('default', true, 'portfolio_hero')}>
              SEE PORTFOLIO ↗
            </Btn>
          </div>
        </div>
      </div>

      {/* VOID FEED */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// VOID — LIVE MARKET GAPS</div>
          <VoidFeed theme={theme} />
        </div>
      </div>

      {/* 5 PRODUCTS */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 32 }}>// FIVE FLAGSHIP SYSTEMS — LIVE NOW</div>
          <ProductGrid theme={theme} profile="default" />
        </div>
      </div>

      {/* STACK OFFER */}
      <div className="section">
        <div className="container">
          <StackOffer theme={theme} profile="default" />
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// THE CASE AGAINST AGENCIES</div>
          <ComparisonTable theme={theme} />
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

// ==========================================================================
// ── SHOWCASE PAGE ─────────────────────────────────────────────────────────
// ==========================================================================
const ProfileShowcase = ({ theme, onProfileSwitch }) => {
  const [activeProfile, setActiveProfile] = React.useState(null);
  const [shareCard, setShareCard]         = React.useState(false);

  // Mock analytics (would come from PresenceEvent entity in real deployment)
  const analytics = { visits: 47, ctas: 12, topProfile: 'FOUNDER', today: 8 };

  const profiles = [
    { key: 'researcher', label: 'RESEARCHER',  origin: 'LinkedIn / Academic',     color: '#4f9eff' },
    { key: 'founder',    label: 'FOUNDER',     origin: 'ProductHunt / YC / X',    color: '#00ff88' },
    { key: 'developer',  label: 'DEVELOPER',   origin: 'GitHub / StackOverflow',  color: '#00ff41' },
    { key: 'deep_work',  label: 'DEEP WORK',   origin: 'Direct — 5am to 8am',     color: '#ffffff' },
    { key: 'default',    label: 'DEFAULT',     origin: 'Everything else',         color: '#00ff88' },
  ];

  const bootSteps = [
    { ms: 0,   label: 'HTML parsed', detail: 'browser reads document' },
    { ms: 1,   label: 'IIFE fires',  detail: 'signal detection starts' },
    { ms: 1,   label: '<1ms',        detail: 'referrer + time + device read' },
    { ms: 2,   label: 'Profile resolved', detail: 'before any React render' },
    { ms: 48,  label: 'React boots', detail: 'framework initialises' },
    { ms: 56,  label: 'First render', detail: 'correct profile, zero shift' },
    { ms: 60,  label: 'Paint',       detail: 'user sees correct page' },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <GlobalStyle theme={theme} />

      {/* HEADER */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>PRESENCE v2.0 — TECHNICAL DISSECTION</div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', margin: 0, color: theme.text }}>
            How adaptive inference<br/>works at <span style={{ color: theme.accent }}>module scope.</span>
          </h1>
        </div>
      </div>

      {/* LIVE ANALYTICS */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// LIVE CONVERSION EVENTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 0 }}>
            {[
              ['TOTAL VISITS',  analytics.visits],
              ['CTA CLICKS',    analytics.ctas],
              ['TODAY',         analytics.today],
              ['TOP PROFILE',   analytics.topProfile],
            ].map(([label, val]) => (
              <div key={label} style={{
                padding: '24px', borderRight: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div className="label" style={{ marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, color: theme.accent }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
            LIVE DATA FROM PRESENCEEVENT ENTITY IN JEEVES — UPDATED ON EACH PAGE LOAD
          </div>
        </div>
      </div>

      {/* PROFILE SWITCHER */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// PROFILE MAP — FORCE ANY PROFILE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
            {profiles.map(p => (
              <button key={p.key}
                onClick={() => { setActiveProfile(p.key); onProfileSwitch(p.key); }}
                style={{
                  background: activeProfile === p.key ? p.color + '22' : 'transparent',
                  border: `1px solid ${activeProfile === p.key ? p.color : theme.border}`,
                  padding: '20px', textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'Courier New, monospace', borderRadius: 0,
                  transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 12, color: p.color, letterSpacing: 3, marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.6 }}>{p.origin}</div>
                <div style={{ marginTop: 12, fontSize: 10, color: p.color + '88', letterSpacing: 2 }}>
                  {activeProfile === p.key ? '✓ ACTIVE' : 'CLICK TO FORCE →'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOOT ENGINE DEMO */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// BOOT ENGINE — EXECUTION TIMELINE</div>
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 1, background: theme.border,
            }}/>
            {bootSteps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 24,
                marginBottom: 24, position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: -36, top: 4,
                  width: 8, height: 8,
                  background: i === 2 ? theme.accent : theme.border,
                  border: `1px solid ${theme.accent}`,
                }}/>
                <div style={{ minWidth: 60, fontSize: 11, color: theme.accent, letterSpacing: 2 }}>
                  {i === 0 ? 't=0' : `+${s.ms}ms`}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: theme.text, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: theme.muted, letterSpacing: 2 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIGNAL DETECTION ARCHITECTURE */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// ARCHITECTURE — THREE SIGNALS TO FIVE PROFILES</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0, marginBottom: 40,
          }}>
            {[
              { signal: 'REFERRAL SOURCE', apis: 'document.referrer\nURLSearchParams', patterns: '14 origin patterns\nAcademic / Founder / Dev', weight: 'Primary' },
              { signal: 'TIME WINDOW',     apis: 'new Date().getHours()\nNo server call', patterns: '5 windows\nEarly / DeepWork / Afternoon...', weight: 'Secondary' },
              { signal: 'DEVICE CONTEXT',  apis: 'window.innerWidth\nSingle breakpoint', patterns: '2 states\nMobile < 768 / Desktop', weight: 'Tertiary' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '28px',
                borderRight: i < 2 ? `1px solid ${theme.border}` : 'none',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 3, marginBottom: 12 }}>
                  SIGNAL {i + 1} — {s.signal}
                </div>
                <div style={{ fontSize: 11, color: theme.muted, lineHeight: 2, whiteSpace: 'pre-line' }}>
                  {s.apis}
                </div>
                <div style={{ marginTop: 16, fontSize: 11, color: theme.muted + '88', lineHeight: 2, whiteSpace: 'pre-line' }}>
                  {s.patterns}
                </div>
                <div style={{ marginTop: 12, fontSize: 10, color: theme.accent + '66', letterSpacing: 2 }}>
                  WEIGHT: {s.weight}
                </div>
              </div>
            ))}
          </div>

          {/* Profile resolution flow */}
          <div style={{ border: `1px solid ${theme.border}`, padding: '24px', background: theme.card }}>
            <div className="label" style={{ marginBottom: 16 }}>RESOLUTION TREE — DETERMINISTIC, NOT PROBABILISTIC</div>
            {[
              ['referrer matches linkedin / .edu / academia', '→ RESEARCHER'],
              ['referrer matches producthunt / ycombinator / x.com', '→ FOUNDER'],
              ['referrer matches github / stackoverflow / dev.to', '→ DEVELOPER'],
              ['direct traffic AND hour >= 5 AND hour < 8', '→ DEEP_WORK'],
              ['everything else', '→ DEFAULT'],
            ].map(([condition, result]) => (
              <div key={result} style={{
                display: 'flex', gap: 24, padding: '10px 0',
                borderBottom: `1px solid ${theme.border}`,
                fontSize: 12, alignItems: 'center',
              }}>
                <div style={{ color: theme.muted, flex: 1, fontStyle: 'italic' }}>{condition}</div>
                <div style={{ color: theme.accent, minWidth: 120, letterSpacing: 2 }}>{result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHARE YOUR SIGNAL */}
      <div className="section">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>// YOUR SIGNAL — WHAT PRESENCE DETECTED</div>
          <div style={{ border: `1px solid ${theme.border}`, padding: '32px', background: theme.card }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              <SignalTag label="SOURCE" value={SIGNALS.source} theme={theme} />
              <SignalTag label="TIME" value={SIGNALS.timeWindow} theme={theme} />
              <SignalTag label="DEVICE" value={SIGNALS.device} theme={theme} />
              <SignalTag label="PROFILE" value={SIGNALS.profile.toUpperCase().replace('_', ' ')} theme={theme} />
            </div>
            <Btn accent={theme.accent} size="sm"
                 onClick={() => {
                   const url = `${location.origin}?profile=${SIGNALS.profile}`;
                   navigator.clipboard?.writeText(url);
                   setShareCard(true);
                   setTimeout(() => setShareCard(false), 3000);
                 }}>
              {shareCard ? 'LINK COPIED ✓' : 'SHARE YOUR SIGNAL CARD'}
            </Btn>
            <div style={{ marginTop: 12, fontSize: 11, color: theme.muted, letterSpacing: 2 }}>
              GENERATES A SHAREABLE URL THAT FORCES YOUR DETECTED PROFILE
            </div>
          </div>
        </div>
      </div>

      <StackOffer theme={theme} profile="showcase" />
      <Footer theme={theme} />
    </div>
  );
};

// ==========================================================================
// ── ROOT APP ──────────────────────────────────────────────────────────────
// ==========================================================================
const App = () => {
  const [profile, setProfile]   = React.useState(SIGNALS.profile);
  const [booted, setBooted]     = React.useState(false);
  const [assemblyMs, setMs]     = React.useState(0);

  const theme = THEMES[profile] || THEMES.default;

  // Profiles that need boot sequence
  const needsBoot = profile === 'default' || profile === 'founder';

  React.useEffect(() => {
    if (!needsBoot) {
      setBooted(true);
      setMs(Math.round(performance.now() - _BOOT_START));
    }
  }, [profile]);

  const handleBootComplete = React.useCallback(() => {
    setBooted(true);
    setMs(Math.round(performance.now() - _BOOT_START));
  }, []);

  const handleProfileSwitch = React.useCallback((newProfile) => {
    setProfile(newProfile);
    setBooted(false);
    // Profiles needing boot will trigger it; others go direct
    const nb = newProfile === 'default' || newProfile === 'founder';
    if (!nb) {
      setTimeout(() => {
        setBooted(true);
        setMs(Math.round(performance.now() - _BOOT_START));
      }, 50);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pulse CTA after 30s
  React.useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('[data-main-cta]').forEach(el => {
        el.style.animation = 'pulse 2s 3';
      });
    }, 30000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <GlobalStyle theme={theme} />

      {/* BOOT SEQUENCE — only for profiles that need it */}
      {needsBoot && !booted && (
        <BootSequence onComplete={handleBootComplete} profile={profile} />
      )}

      {/* NAVIGATION */}
      <Nav theme={theme} onProfileSwitch={handleProfileSwitch} currentProfile={profile} />

      {/* PROFILE RENDER */}
      {profile === 'researcher' && <ProfileResearcher theme={theme} />}
      {profile === 'founder'    && <ProfileFounder    theme={theme} booted={booted} />}
      {profile === 'developer'  && <ProfileDeveloper  theme={theme} />}
      {profile === 'deep_work'  && <ProfileDeepWork   theme={theme} />}
      {profile === 'default'    && <ProfileDefault    theme={theme} booted={booted} />}
      {profile === 'showcase'   && <ProfileShowcase   theme={theme} onProfileSwitch={handleProfileSwitch} />}

      {/* FLOATING ELEMENTS — shown after boot on all profiles */}
      {booted && (
        <FloatingElements
          theme={theme}
          profile={profile}
          onProfileSwitch={handleProfileSwitch}
          assemblyMs={assemblyMs}
        />
      )}
    </>
  );
};

// ── MOUNT ──────────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

</script>
</body>
</html>

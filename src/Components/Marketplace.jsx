import React, { useState } from 'react';

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={d} /></svg>
);
const ICONS = {
  arrow:    'M7 17L17 7M17 7H7M17 7v10',
  check:    'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  star:     'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  lock:     'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  flash:    'M7 2v11h3v9l7-12h-4l4-8z',
  shield:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
  grid:     'M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z',
  filter:   'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  search:   'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  cart:     'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
};

// ── Arrow icon for cards ─────────────────────────────────────────────────────
const ArrowSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const ALL_PERKS = [
  // --- Partner Perks ---
  {
    category: 'partner',
    badge: { letter: 'C', bg: '#1a1a2e', color: '#fff' },
    company: 'Carta Inc.',
    tag: 'Equity & Cap Table',
    description: 'Maintain an accurate cap table, access fundraising tools and benchmarks, and generate SAFEs — all in one place.',
    highlight: 'Free for first year',
    rating: 4.8,
    reviews: 412,
    featured: true,
  },
  {
    category: 'partner',
    badge: { letter: 'B', bg: '#FF6B35', color: '#fff' },
    company: 'Brex',
    tag: 'Banking & Spend',
    description: 'Corporate cards, business accounts, and expense management built for startups from day one.',
    highlight: '$500 credits on sign-up',
    rating: 4.7,
    reviews: 839,
  },
  {
    category: 'partner',
    badge: { letter: 'S', bg: '#4A154B', color: '#fff' },
    company: 'Slack',
    tag: 'Team Communication',
    description: 'Transform the way you work with one place for everyone and everything you need to get stuff done.',
    highlight: '25% off Pro plan',
    rating: 4.9,
    reviews: 2100,
  },
  {
    category: 'partner',
    badge: { letter: 'N', bg: '#0EA5E9', color: '#fff' },
    company: 'Notion',
    tag: 'Productivity',
    description: 'The connected workspace for modern teams. Docs, wikis, project tracking, and databases — all in one.',
    highlight: '6 months free',
    rating: 4.6,
    reviews: 1540,
  },
  // --- HR Perks ---
  {
    category: 'hr',
    badge: { letter: 'L', bg: '#F59E0B', color: '#fff' },
    company: 'Lemon.io',
    tag: 'Tech Talent',
    description: 'The exclusive community of startup sidekicks. Hire engineers internally and for contract work at scale.',
    highlight: '$200 recruiting credit',
    rating: 4.5,
    reviews: 283,
  },
  {
    category: 'hr',
    badge: { letter: 'V', bg: '#2563EB', color: '#fff' },
    company: 'VanHack',
    tag: 'Global Talent',
    description: "250,000+ tech candidates ready to relocate or work remotely. Smart matching built in.",
    highlight: 'First hire 20% off',
    rating: 4.6,
    reviews: 318,
  },
  {
    category: 'hr',
    badge: { letter: 'H', bg: '#DC2626', color: '#fff' },
    company: 'hackajob',
    tag: 'Developer Jobs',
    description: 'Private tech job marketplace connecting top developers fast. Used by 2,000+ companies.',
    highlight: '30-day free trial',
    rating: 4.7,
    reviews: 509,
  },
  // --- Finance Perks ---
  {
    category: 'finance',
    badge: { letter: 'R', bg: '#10B981', color: '#fff' },
    company: 'Ramp',
    tag: 'Corporate Cards',
    description: 'The finance platform that helps businesses spend less. Automated savings, real-time visibility.',
    highlight: '$250 bonus after first spend',
    rating: 4.8,
    reviews: 764,
  },
  {
    category: 'finance',
    badge: { letter: 'M', bg: '#6366F1', color: '#fff' },
    company: 'Mercury',
    tag: 'Business Banking',
    description: 'Banking built for startups and e-commerce. No fees, no minimums, powerful API.',
    highlight: 'No fees banking',
    rating: 4.9,
    reviews: 1233,
  },
];

const CATEGORIES = [
  { key: 'all',     label: 'All Apps'  },
  { key: 'partner', label: 'Partner Perks' },
  { key: 'hr',      label: 'HR & Talent'   },
  { key: 'finance', label: 'Finance'        },
];

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ letter, bg, color = '#fff', size = 42 }) => (
  <div style={{ width: size, height: size, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 800, fontSize: size * 0.4, flexShrink: 0 }}>
    {letter}
  </div>
);

// ── Star rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full = Math.floor(rating), half = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {Array(5).fill(0).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < full ? '#F59E0B' : i === full && half ? '#FCD34D' : '#E2E8F0'}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      <span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>{rating.toFixed(1)} ({(reviews => reviews >= 1000 ? `${(reviews/1000).toFixed(1)}k` : reviews)(0)})</span>
    </div>
  );
};

// ── Perk Card ────────────────────────────────────────────────────────────────
const PerkCard = ({ item, onActivate, isInstalled }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${hov ? '#2563EB' : '#E8EDF5'}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', boxShadow: hov ? '0 8px 28px rgba(37,99,235,0.12)' : '0 2px 8px rgba(37,99,235,0.04)', transform: hov ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
      {item.featured && (
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em' }}>FEATURED</div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <Badge letter={item.badge.letter} bg={item.badge.bg} />
        <div>
          <p style={{ fontWeight: 800, fontSize: 14.5, color: '#0F172A', margin: 0 }}>{item.company}</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '1px 8px', borderRadius: 20 }}>{item.tag}</span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, flex: 1, margin: '0 0 12px' }}>{item.description}</p>

      {/* Highlight badge */}
      {item.highlight && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '4px 10px', marginBottom: 12, alignSelf: 'flex-start' }}>
          <Ic d={ICONS.flash} size={13} color="#16A34A" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#15803D' }}>{item.highlight}</span>
        </div>
      )}

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
        {Array(5).fill(0).map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.floor(item.rating) ? '#F59E0B' : '#E2E8F0'}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
        <span style={{ fontSize: 11, color: '#64748B' }}>{item.rating} ({item.reviews.toLocaleString()})</span>
      </div>

      {/* CTA */}
      <button onClick={() => onActivate(item.company)}
        style={{ width: '100%', padding: '9px 0', borderRadius: 10, border: isInstalled ? '1.5px solid #BBF7D0' : '1.5px solid #2563EB', background: isInstalled ? '#F0FDF4' : (hov ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : '#fff'), color: isInstalled ? '#16A34A' : (hov ? '#fff' : '#2563EB'), fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {isInstalled ? <><Ic d={ICONS.check} size={15} color="#16A34A" /> Installed</> : <><ArrowSvg /> Connect</>}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Marketplace = () => {
  const [cat, setCat]           = useState('all');
  const [search, setSearch]     = useState('');
  const [installed, setInstalled] = useState(new Set(['Slack', 'Ramp']));
  const [toast, setToast]       = useState(null);

  const handleActivate = (name) => {
    setInstalled(prev => {
      const s = new Set(prev);
      if (s.has(name)) { s.delete(name); setToast(`${name} disconnected`); }
      else             { s.add(name);    setToast(`${name} connected!`);   }
      setTimeout(() => setToast(null), 2400);
      return s;
    });
  };

  const filtered = ALL_PERKS.filter(p =>
    (cat === 'all' || p.category === cat) &&
    (!search || p.company.toLowerCase().includes(search.toLowerCase()) || p.tag.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const STATS = [
    { label: 'Integrations Available', value: ALL_PERKS.length, color: '#2563EB', bg: '#EEF2FF' },
    { label: 'Connected',              value: installed.size,   color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Categories',             value: CATEGORIES.length - 1, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div style={{ fontFamily: 'inherit', maxWidth: 1100 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 28px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeInDown 0.25s' }}>
          <Ic d={ICONS.check} size={16} color="#4ADE80" /> {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>Marketplace</h1>
        <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 6 }}>Connect SmartPayroll with your favourite tools and unlock exclusive partner perks.</p>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E8EDF5', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 6px rgba(37,99,235,0.04)', flex: 1, minWidth: 140 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', margin: 0 }}>{s.label}</p>
          </div>
        ))}

        {/* Hero perk banner */}
        <div style={{ flex: 2, minWidth: 300, background: 'linear-gradient(135deg,#1E3A8A,#2563EB,#06B6D4)', borderRadius: 14, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, boxShadow: '0 4px 18px rgba(37,99,235,0.30)' }}>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', margin: '0 0 4px' }}>PARTNER SPOTLIGHT</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Unlock $1,000+ in exclusive perks</p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Discounts, credits, and free trials for SmartPayroll users.</p>
          </div>
          <div style={{ display: 'flex', gap: -8, flexShrink: 0 }}>
            {['C','B','S','N'].map((l, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', background: ['#1a1a2e','#FF6B35','#4A154B','#0EA5E9'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', marginLeft: i > 0 ? -10 : 0 }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFF', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 200 }}>
          <Ic d={ICONS.search} size={16} color="#94A3B8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search integrations…"
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, color: '#1E293B', width: '100%', fontFamily: 'inherit' }} />
        </div>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{ padding: '7px 16px', borderRadius: 9, border: `1.5px solid ${cat===c.key?'#2563EB':'#E2E8F0'}`, background: cat===c.key?'#EEF2FF':'#fff', color: cat===c.key?'#2563EB':'#64748B', fontWeight: cat===c.key?700:500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: 48, textAlign: 'center', color: '#94A3B8' }}>
          No apps match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
          {filtered.map((item, i) => (
            <PerkCard key={i} item={item} onActivate={handleActivate} isInstalled={installed.has(item.company)} />
          ))}
        </div>
      )}

      {/* ── Footer CTA ── */}
      <div style={{ marginTop: 36, background: 'linear-gradient(135deg,#F8FAFF,#EEF2FF)', borderRadius: 16, border: '1.5px solid #C7D2FE', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#1E3A8A', margin: '0 0 4px' }}>Want to list your app on SmartPayroll?</p>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Reach thousands of companies and HR teams by partnering with us.</p>
        </div>
        <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(37,99,235,0.30)' }}>
          Become a Partner →
        </button>
      </div>
    </div>
  );
};

export default Marketplace;

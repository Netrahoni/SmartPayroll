import React, { useState, useEffect } from 'react';

// Design Tokens
const BLUE = '#2563eb';
const DARK = '#0f172a';
const LIGHT_BG = '#eef2ff';
const GRAY_TXT = '#475569';
const BORDER = '#e2e8f0';

// SVGs and Icons
const BlueArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const LogoMark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: BLUE }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

/* ─────────────────────────────────────────────
   1. NAVBAR
───────────────────────────────────────────── */
const Navbar = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
      transition: 'all .25s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoMark />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: DARK }}>SmartPayroll</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['Home', 'About', 'Features', 'Pricing'].map((item) => (
            <button key={item} 
              onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: 600, color: DARK
            }}>{item}</button>
          ))}
        </div>

        {/* Action */}
        <button onClick={onLoginClick} style={{
          padding: '10px 24px', borderRadius: 6, background: BLUE, color: '#fff',
          fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
        }}>Login</button>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   2. HERO
───────────────────────────────────────────── */
const Hero = ({ onLoginClick }) => (
  <section id="home" style={{ background: '#fff', paddingTop: 160, paddingBottom: 80 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      
      {/* Left Content */}
      <div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: DARK, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Smart Payroll,<br />Simplified
        </h1>
        <p style={{ fontSize: '1.25rem', color: GRAY_TXT, lineHeight: 1.5, marginBottom: 40, maxWidth: 480 }}>
          Automate your entire payroll process in minutes. Accurate, compliant, and stress-free.
        </p>
        <button onClick={onLoginClick} style={{
          padding: '16px 32px', borderRadius: 32, background: BLUE, color: '#fff',
          fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          Get Started Free <BlueArrow />
        </button>
      </div>

      {/* Right Dashboard Mock */}
      <div style={{
        background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: 24, paddingBottom: 0, overflow: 'hidden'
      }}>
        {/* Mock Top bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2e8f0' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2e8f0' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2e8f0' }}></div>
        </div>
        {/* Mock Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: GRAY_TXT, marginBottom: 16 }}>Payroll Summary - Last 30 Days</div>
            <div style={{ height: 100, borderBottom: `1px solid ${BORDER}`, position: 'relative' }}>
               <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                 <path d="M0 80 Q 50 20 100 50 T 200 30" fill="none" stroke={BLUE} strokeWidth="3" />
               </svg>
            </div>
          </div>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: GRAY_TXT, marginBottom: 16 }}>Employee Status</div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: `16px solid ${BLUE}`, margin: '0 auto', borderRightColor: '#93c5fd' }}></div>
          </div>
        </div>
        <div style={{ border: `1px solid ${BORDER}`, borderBottom: 'none', borderRadius: '8px 8px 0 0', padding: 16 }}>
           <div style={{ fontSize: '0.7rem', fontWeight: 600, color: GRAY_TXT, marginBottom: 16 }}>Recent Payouts</div>
           {[
             { n: 'John Doe', d: 'Jan 11, 2024', a: '$3,200' },
             { n: 'Jane Smith', d: 'Jan 11, 2024', a: '$2,800' },
             { n: 'Mike Brown', d: 'Jan 11, 2024', a: '$3,500' }
           ].map((p, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: `1px solid ${BORDER}` }}>
               <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                 <div style={{ width: 24, height: 24, borderRadius: '50%', background: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: BLUE }}>👤</div>
                 <div>
                   <div style={{ fontSize: '0.8rem', fontWeight: 600, color: DARK }}>{p.n}</div>
                   <div style={{ fontSize: '0.65rem', color: GRAY_TXT }}>{p.d}</div>
                 </div>
               </div>
               <div style={{ fontSize: '0.85rem', fontWeight: 600, color: DARK }}>{p.a}</div>
               <div style={{ fontSize: '0.65rem', color: BLUE, background: LIGHT_BG, padding: '2px 8px', borderRadius: 999 }}>Paid</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   3. TRUST SECTION
───────────────────────────────────────────── */
const TrustSection = () => (
  <section style={{ padding: '40px 0', borderBottom: `1px solid ${BORDER}` }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: GRAY_TXT, letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
        Trust Section
      </p>
      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: DARK, marginBottom: 40 }}>
        Trusted by 10,000+ companies worldwide
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', color: '#94a3b8' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 22-7-4-4-28 7 4-12 12 7 4Z"/><path d="m9 12 2 2 4-4"/></svg>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3A1 1 0 0 1 12 15l-4-4"/></svg>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   4. FEATURE HIGHLIGHTS
───────────────────────────────────────────── */
const FeatureHighlights = () => (
  <section style={{ background: LIGHT_BG, padding: '80px 0' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: GRAY_TXT, letterSpacing: '0.05em', marginBottom: 40, textTransform: 'uppercase' }}>
        Feature Highlights Section
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        {[
          { icon: '⏱️', title: 'Automated Payroll', desc: 'Run payroll in just a few clicks with automatic calculations and deductions.' },
          { icon: '📝', title: 'Tax Compliance', desc: 'Stay compliant with federal, state, and local tax regulations automatically.' },
          { icon: '📊', title: 'Real-time Reports', desc: 'Access instant insights into your payroll data with customizable reporting tools.' }
        ].map((feat, i) => (
          <div key={i} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: LIGHT_BG, fontSize: '1.5rem', marginBottom: 24, color: BLUE }}>
              {feat.icon}
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: DARK, marginBottom: 12 }}>{feat.title}</h4>
            <p style={{ fontSize: '0.95rem', color: GRAY_TXT, lineHeight: 1.6 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   5. FEATURES GRID
───────────────────────────────────────────── */
const FeaturesGrid = ({ onLoginClick }) => {
  const features = [
    { icon: '⚙️', title: 'Payroll Processing', desc: 'Automate calculations, tax filings, and direct deposits with ease.' },
    { icon: '👥', title: 'Team Management', desc: 'Organize employee data, roles, and permissions in one central hub.' },
    { icon: '📋', title: 'Employee Onboarding', desc: 'Simplify the hiring process with digital forms and self-service portals.' },
    { icon: '📅', title: 'Time Off Management', desc: 'Track leave requests, approvals, and balances efficiently.' },
    { icon: '🧾', title: 'Expense Tracking', desc: 'Capture and reimburse business expenses quickly and accurately.' },
    { icon: '📈', title: 'Reports & Analytics', desc: 'Gain actionable insights with customizable reports and dashboards.' },
    { icon: '🛒', title: 'Marketplace', desc: 'Integrate with your favorite apps and services seamlessly.' },
    { icon: '🔒', title: 'Activity Logs', desc: 'Monitor system usage and changes for enhanced security and compliance.' },
  ];

  return (
    <section id="features" style={{ background: LIGHT_BG, padding: '80px 0', borderTop: '2px solid #fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: GRAY_TXT, letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
            Features Hero
          </p>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: DARK, lineHeight: 1.1, marginBottom: 24 }}>
            Everything You Need<br />to Run Payroll
          </h2>
          <p style={{ fontSize: '1.1rem', color: GRAY_TXT, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Streamline your processes with our comprehensive suite of powerful, easy-to-use tools designed for modern businesses.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: GRAY_TXT, letterSpacing: '0.05em', marginBottom: 32, textTransform: 'uppercase' }}>
          Features Grid Section
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ 
              background: '#fff', padding: 32, borderRadius: 16, 
              display: 'flex', gap: 24, alignItems: 'flex-start',
              borderLeft: `6px solid ${BLUE}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, background: BLUE, color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: DARK, marginBottom: 8 }}>{f.title}</h4>
                <p style={{ fontSize: '0.95rem', color: GRAY_TXT, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 80 }}>
           <p style={{ fontSize: '0.75rem', fontWeight: 700, color: GRAY_TXT, letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
            Bottom CTA Section
          </p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: DARK, marginBottom: 32 }}>Ready to transform your payroll?</h3>
          <button onClick={onLoginClick} style={{ padding: '16px 40px', background: BLUE, color: '#fff', borderRadius: 8, fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   6. ABOUT / MISSION
───────────────────────────────────────────── */
const AboutSection = () => (
  <section id="about" style={{ background: LIGHT_BG, paddingTop: 100, paddingBottom: 0 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: DARK, lineHeight: 1.1, marginBottom: 24 }}>
          Built for the<br />Modern Workforce
        </h2>
        <div style={{ width: 64, height: 4, background: BLUE, margin: '0 auto 24px', borderRadius: 2 }} />
        <p style={{ fontSize: '1.1rem', color: GRAY_TXT, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
          Our mission is to simplify payroll and HR for businesses worldwide, empowering them with intuitive, secure, and automated solutions that save time and ensure compliance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, paddingBottom: 80 }}>
        {[
          { title: 'Our Mission', desc: 'To empower businesses with seamless, automated payroll solutions, fostering growth and efficiency globally.', icon: '🎯' },
          { title: 'Our Vision', desc: 'To be the world\'s most trusted and innovative payroll platform, redefining the future of work.', icon: '👁️' },
          { title: 'Our Values', desc: 'Integrity, innovation, and customer success guide every decision we make.', icon: '❤️' }
        ].map((card, i) => (
          <div key={i} style={{ background: '#f8fafc', padding: 40, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'left' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 24 }}>
              {card.icon}
            </div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: DARK, marginBottom: 12 }}>{card.title}</h4>
            <p style={{ fontSize: '1rem', color: GRAY_TXT, lineHeight: 1.6 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   7. STATS
───────────────────────────────────────────── */
const StatsSection = () => (
  <section style={{ background: BLUE, padding: '80px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
      {[
        { val: '10,000+', lbl: 'Companies' },
        { val: '99.9%', lbl: 'Uptime' },
        { val: '$2B+', lbl: 'Processed' }
      ].map((s, i) => (
         <div key={i}>
           <div style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1 }}>{s.val}</div>
           <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#e0e7ff' }}>{s.lbl}</div>
         </div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   8. LEADERSHIP
───────────────────────────────────────────── */
const LeadershipSection = () => (
   <section style={{ background: '#fff', padding: '100px 0' }}>
     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px' }}>
       <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: DARK, textAlign: 'center', marginBottom: 64 }}>
         Meet Our Leadership
       </h2>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
         {[
           { n: 'Sarah Jenkins', r: 'CEO & Co-Founder' },
           { n: 'David Chen', r: 'CTO & Co-Founder' },
           { n: 'Maria Rodriguez', r: 'Head of Product' },
           { n: 'James Thompson', r: 'VP of Sales' }
         ].map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: `1px solid ${BORDER}` }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#cbd5e1', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', overflow: 'hidden' }}>
                👤
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: DARK, marginBottom: 8 }}>{p.n}</h4>
              <p style={{ fontSize: '0.95rem', color: GRAY_TXT, margin: 0 }}>{p.r}</p>
            </div>
         ))}
       </div>
     </div>
   </section>
);

/* ─────────────────────────────────────────────
   9. PRICING
───────────────────────────────────────────── */
const PricingSection = ({ onLoginClick }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    {
      name: 'Starter', price: isAnnual ? '$24' : '$29', per: '/mo',
      features: ['Up to 10 employees', 'Basic payroll processing', 'Direct deposit', 'Tax filing support', 'Email support'],
      cta: 'Get Started', isPopular: false
    },
    {
      name: 'Professional', price: isAnnual ? '$64' : '$79', per: '/mo',
      features: ['Up to 50 employees', 'Advanced payroll & HR', 'Direct deposit & printed checks', 'Automated tax filing', 'Time & attendance tracking', 'Benefits administration', 'Priority email & chat support', 'Dedicated account manager'],
      cta: 'Start Free Trial', isPopular: true
    },
    {
      name: 'Enterprise', price: 'Custom', per: 'Contact us for pricing',
      features: ['Unlimited employees', 'Full-service payroll & HR', 'Global payroll capabilities', 'Custom integrations & API access', 'Advanced reporting & analytics', 'Dedicated support team', 'SLA guarantees', 'Onboarding & training', 'Single Sign-On (SSO)', 'Audit trails & compliance tools', 'and more'],
      cta: 'Contact Sales', isPopular: false
    }
  ];

  return (
    <section id="pricing" style={{ background: '#fff', paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: DARK, marginBottom: 16 }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: '1.2rem', color: GRAY_TXT, marginBottom: 32 }}>Choose the plan that fits your business needs.<br/>No hidden fees, cancel anytime.</p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: DARK }}>Monthly</span>
            <div onClick={() => setIsAnnual(!isAnnual)} style={{ width: 56, height: 32, borderRadius: 16, background: BLUE, position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ position: 'absolute', top: 4, left: isAnnual ? 28 : 4, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'all 0.3s' }}></div>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: GRAY_TXT }}>Annual <span style={{ fontWeight: 400 }}>(Save 20%)</span></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
             <div key={i} style={{
               background: plan.isPopular ? BLUE : '#fff',
               color: plan.isPopular ? '#fff' : DARK,
               borderRadius: 16, border: plan.isPopular ? 'none' : `1px solid ${BLUE}`,
               padding: 40, display: 'flex', flexDirection: 'column', position: 'relative',
               boxShadow: plan.isPopular ? '0 20px 25px -5px rgba(37, 99, 235, 0.3)' : 'none',
               marginTop: plan.isPopular ? -20 : 0, marginBottom: plan.isPopular ? -20 : 0
             }}>
               {plan.isPopular && (
                 <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#e0e7ff', color: BLUE, padding: '8px 24px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700 }}>
                   Most Popular
                 </div>
               )}
               <h4 style={{ fontSize: '1.4rem', fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>{plan.name}</h4>
               {plan.price === 'Custom' ? (
                 <div style={{ textAlign: 'center', marginBottom: 32 }}>
                   <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>Custom</div>
                   <div style={{ fontSize: '0.9rem', color: GRAY_TXT, marginTop: 8 }}>{plan.per}</div>
                 </div>
               ) : (
                 <div style={{ textAlign: 'center', marginBottom: 32 }}>
                   <span style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{plan.price}</span>
                   <span style={{ fontSize: '1.2rem', fontWeight: 500, color: plan.isPopular ? '#e0e7ff' : GRAY_TXT }}>{plan.per}</span>
                 </div>
               )}

               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', flex: 1 }}>
                 {plan.features.map((f, j) => (
                   <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: '0.95rem' }}>
                     <div style={{ width: 20, height: 20, borderRadius: '50%', background: plan.isPopular ? '#fff' : BLUE, color: plan.isPopular ? BLUE : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>✓</div>
                     <span>{f}</span>
                   </li>
                 ))}
               </ul>

               <button onClick={onLoginClick} style={{
                 padding: '14px 0', width: '100%', borderRadius: 999, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                 background: plan.isPopular ? '#fff' : 'transparent', color: plan.isPopular ? BLUE : BLUE,
                 border: plan.isPopular ? 'none' : `1.5px solid ${BLUE}`
               }}>
                 {plan.cta}
               </button>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   10. FAQ
───────────────────────────────────────────── */
const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.' },
    { q: 'Is there a free trial available?', a: 'Yes, we offer a 14-day free trial on all our plans so you can test out our features before committing.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH transfers, and wire transfers for annual billing.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use bank-level 256-bit encryption and comply with all major data protection regulations including GDPR and SOC2.' }
  ];

  return (
    <section style={{ background: LIGHT_BG, padding: '80px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: DARK, textAlign: 'center', marginBottom: 48 }}>
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, padding: '24px 0' }}>
              <div onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: DARK, margin: 0 }}>{faq.q}</h4>
                <div style={{ color: GRAY_TXT }}>
                  {openIdx === i ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
                           : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>}
                </div>
              </div>
              {openIdx === i && faq.a && (
                <p style={{ marginTop: 16, fontSize: '1rem', color: GRAY_TXT, lineHeight: 1.6, marginBottom: 0 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   11. FOOTER
───────────────────────────────────────────── */
const Footer = ({ onLoginClick, setPublicPage }) => (
  <footer style={{ background: '#1e293b', paddingTop: 80, paddingBottom: 40 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 64 }}>
        
        {/* Brand */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: 32 }}>SmartPayroll</h2>
          <div style={{ display: 'flex', gap: 16 }}>
             {[1,2,3,4].map(i => <div key={i} style={{ width: 24, height: 24, background: '#cbd5e1', borderRadius: 4 }}></div>)}
          </div>
        </div>

        {/* Links */}
        {[
          { t: 'Product', l: ['Features','Solutions','Integrations','Updates'] },
          { t: 'Company', l: ['About Us','Careers','Press','Contact'] },
          { t: 'Resources', l: ['Blog','Help Center','Guides','API Docs'] },
          { t: 'Legal', l: ['Terms of Service','Privacy Policy','Security','GDPR'] },
        ].map(col => (
          <div key={col.t}>
            <h4 onClick={() => setPublicPage(col.t)} style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: 24, cursor: 'pointer' }}>{col.t}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.l.map(link => (
                <li key={link} style={{ marginBottom: 16 }}>
                  <span onClick={() => setPublicPage(link)} style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }}>{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #334155', paddingTop: 32 }}>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
          © 2024 SmartPayroll Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────── */
export default function HomePage({ onLoginClick, setPublicPage }) {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", WebkitFontSmoothing: 'antialiased', background: '#fff' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <Navbar onLoginClick={onLoginClick} />
      <Hero onLoginClick={onLoginClick} />
      <TrustSection />
      <FeatureHighlights />
      <FeaturesGrid onLoginClick={onLoginClick} />
      <AboutSection />
      <StatsSection />
      <LeadershipSection />
      <PricingSection onLoginClick={onLoginClick} />
      <FAQSection />
      <Footer onLoginClick={onLoginClick} setPublicPage={setPublicPage} />
    </div>
  );
}

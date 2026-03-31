import React from 'react';

export default function PrivacyPolicyPage({ onBack, onLoginClick }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>
      <header style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2563eb' }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          SmartPayroll
        </div>
        <button onClick={onLoginClick} style={{ padding: '10px 24px', borderRadius: 6, background: '#2563eb', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
          Login
        </button>
      </header>

      <main style={{ flex: 1, padding: '80px 32px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: 24, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <div style={{ width: 64, height: 4, background: '#2563eb', marginBottom: 32, borderRadius: 2 }}></div>
          
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data when you use SmartPayroll.
          </p>
          
          <div style={{ padding: '24px', background: '#eef2ff', borderRadius: '8px', borderLeft: '4px solid #2563eb', marginTop: 40 }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', margin: '0 0 8px 0' }}>Why SmartPayroll?</h4>
            <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.95rem', lineHeight: 1.5 }}>Trusted by over 10,000 global companies to accurately process billions in payroll safely, securely, and completely stress-free.</p>
          </div>

          <button onClick={onBack} style={{ marginTop: 48, padding: '12px 24px', background: 'transparent', color: '#0f172a', borderRadius: 6, fontWeight: 600, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </button>
        </div>
      </main>

      <footer style={{ padding: '32px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        &copy; 2024 SmartPayroll Inc. All rights reserved. Let's simplify global employment together.
      </footer>
    </div>
  );
}

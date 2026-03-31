const fs = require('fs');
const path = require('path');

const pages = [
  'Product', 'Features', 'Solutions', 'Integrations', 'Updates',
  'Company', 'AboutUs', 'Careers', 'Press', 'Contact',
  'Resources', 'Blog', 'HelpCenter', 'Guides', 'ApiDocs',
  'Legal', 'TermsOfService', 'PrivacyPolicy', 'Security', 'Gdpr'
];

const template = (name) => `import React from 'react';

export default function ${name}Page({ onBack, onLoginClick }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#fff' }}>
      <header style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2563eb' }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          SmartPayroll
        </div>
        <button onClick={onLoginClick} style={{ padding: '10px 24px', borderRadius: 6, background: '#2563eb', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </header>
      <main style={{ flex: 1, padding: '80px 32px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>${name.replace(/([A-Z])/g, ' $1').trim()}</h1>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6 }}>
          Welcome to the ${name.replace(/([A-Z])/g, ' $1').trim()} page. This page is currently being updated with the latest information.
        </p>
        <button onClick={onBack} style={{ marginTop: 40, padding: '12px 24px', background: '#e2e8f0', color: '#0f172a', borderRadius: 6, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          &larr; Back to Home
        </button>
      </main>
    </div>
  );
}
`;

pages.forEach(p => {
  fs.writeFileSync(path.join('c:/Users/Unknown Person/Desktop/smartpayroll/src/Components', `${p}Page.jsx`), template(p));
});
console.log('Pages generated successfully.');

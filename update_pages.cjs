const fs = require('fs');
const path = require('path');

const pageData = {
  Product: {
    title: 'Our Product',
    content: 'SmartPayroll is an all-in-one payroll, HR, and compliance platform designed for modern global teams. Automate your calculations, tax filings, and direct deposits seamlessly while maintaining full compliance across jurisdictions.'
  },
  Features: {
    title: 'Features',
    content: 'Explore powerful features including automated payroll processing, employee self-service onboarding, time-off management, expense tracking, and comprehensive reporting analytics—all from a single intuitive dashboard.'
  },
  Solutions: {
    title: 'Solutions',
    content: 'Whether you are a small startup or a global enterprise, SmartPayroll scales with your business. We offer tailored solutions for employing contractors, full-time EOR employees, and managing direct employees internationally.'
  },
  Integrations: {
    title: 'Integrations',
    content: 'Connect SmartPayroll with your existing tech stack. We offer seamless integrations with popular accounting software (QuickBooks, Xero), HRIS platforms (Workday, BambooHR), and productivity tools (Slack, Microsoft Teams).'
  },
  Updates: {
    title: 'Product Updates',
    content: 'We are constantly improving SmartPayroll. Check out our latest releases, feature enhancements, and compliance updates to see how we are building the future of work.'
  },
  Company: {
    title: 'Company',
    content: 'SmartPayroll is on a mission to simplify the complexities of global employment. We believe that hiring and paying people anywhere in the world should be as easy as hiring locally.'
  },
  AboutUs: {
    title: 'About Us',
    content: 'Founded by industry experts, SmartPayroll is built for the modern workforce. Our team is dedicated to empowering businesses with seamless, automated payroll solutions, fostering growth and efficiency globally.'
  },
  Careers: {
    title: 'Careers',
    content: 'Join the SmartPayroll team! We are always looking for passionate engineers, designers, and payroll specialists who want to redefine the future of work. Check out our open roles.'
  },
  Press: {
    title: 'Press & Media',
    content: 'Get the latest news, press releases, and media resources about SmartPayroll. Discover how we are making headlines in the HR tech and fintech industries.'
  },
  Contact: {
    title: 'Contact Us',
    content: 'Have questions about our platform or pricing? Our dedicated support team is here to help. Reach out to us via email, phone, or live chat, and we will get back to you promptly.'
  },
  Resources: {
    title: 'Resources',
    content: 'Explore our comprehensive library of resources designed to help you navigate global payroll, compliance laws, and HR best practices. Empower your team with the knowledge they need.'
  },
  Blog: {
    title: 'Blog',
    content: 'Read the latest insights, tips, and industry trends on the SmartPayroll blog. Discover expert advice on managing international teams, understanding tax laws, and optimizing your HR workflows.'
  },
  HelpCenter: {
    title: 'Help Center',
    content: 'Find answers quickly in our Help Center. Browse through detailed articles, step-by-step tutorials, and FAQs covering everything from account setup to running your first payroll.'
  },
  Guides: {
    title: 'Guides & E-books',
    content: 'Download our in-depth guides and e-books. Learn the intricacies of hiring in different countries, managing remote work cultures, and staying compliant with local labor laws.'
  },
  ApiDocs: {
    title: 'API Documentation',
    content: 'Build custom integrations with the SmartPayroll API. Our robust RESTful API allows developers to programmatically manage employees, run payroll, and sync data across platforms.'
  },
  Legal: {
    title: 'Legal',
    content: 'We take compliance and legal obligations seriously. Access our legal documents, including our terms of service, privacy policy, and data processing agreements.'
  },
  TermsOfService: {
    title: 'Terms of Service',
    content: 'Read our Terms of Service to understand the rules and guidelines for using the SmartPayroll platform. These terms govern your access to and use of our services.'
  },
  PrivacyPolicy: {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data when you use SmartPayroll.'
  },
  Security: {
    title: 'Security',
    content: 'Security is at the core of SmartPayroll. We employ bank-level 256-bit encryption, routine security audits, and strict access controls to ensure your sensitive payroll data is always protected.'
  },
  Gdpr: {
    title: 'GDPR Compliance',
    content: 'SmartPayroll is fully compliant with the General Data Protection Regulation (GDPR). We are committed to protecting the privacy rights of individuals in the EU and worldwide.'
  }
};

const template = (id, data) => `import React from 'react';

export default function ${id}Page({ onBack, onLoginClick }) {
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
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: 24, letterSpacing: '-0.02em' }}>${data.title}</h1>
          <div style={{ width: 64, height: 4, background: '#2563eb', marginBottom: 32, borderRadius: 2 }}></div>
          
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
            ${data.content}
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
`;

Object.keys(pageData).forEach(id => {
  fs.writeFileSync(path.join('c:/Users/Unknown Person/Desktop/smartpayroll/src/Components', `${id}Page.jsx`), template(id, pageData[id]));
});
console.log('Marketing pages successfully populated with contextual copy.');

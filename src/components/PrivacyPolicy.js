import React from 'react';
import '../styles/Legal.css';

function PrivacyPolicy() {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Privacy Policy</h1>
        <div className="legal-content">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, participate in competitions, or contact us for support.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to operate, maintain, and improve our services, to communicate with you, and to protect our users.</p>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We do not share personal information with companies, organizations, or individuals outside of our organization except in the following cases: with your consent, for legal reasons, or to protect rights, property, or safety.</p>

          <h2>4. Data Security</h2>
          <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>

          <h2>5. Changes to This Policy</h2>
          <p>We may revise this Privacy Policy from time to time. The most current version will always be posted on our website.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
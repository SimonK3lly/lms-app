import React from 'react';
import '../styles/Legal.css';

function TermsOfService() {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Terms of Service</h1>
        <div className="legal-content">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>2. Use of the Service</h2>
          <p>You agree to use the service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>

          <h2>3. Modifications to the Service</h2>
          <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>

          <h2>4. Termination</h2>
          <p>We may terminate your access to the service, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.</p>

          <h2>5. Governing Law</h2>
          <p>This agreement shall be governed in accordance with the laws of the Republic of Ireland.</p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
import React, { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import OptimizedParticles from '../OptimizedParticles';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import './TermsOfService.css';

const TermsOfService = () => {
  const { particleConfig, blurConfig, networkOptimizations } = useMobileOptimizations('terms');

  useEffect(() => {
    document.title = 'Terms of Service - Kalakritam';

    // Add noindex meta tag - Terms page should not be indexed by search engines
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      // Restore default robots meta on unmount
      if (robotsMeta) {
        robotsMeta.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  return (
    <div className="terms-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      <OptimizedParticles
        particleConfig={particleConfig}
        networkOptimizations={networkOptimizations}
        className="terms-particles-background"
      />

      <div
        className="terms-blur-overlay"
        style={{ backdropFilter: blurConfig.backdropFilter, background: blurConfig.background }}
      />

      <VideoLogo />
      <Header currentPage="terms" />

      <main className="terms-content" role="main">
        <section className="terms-hero">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-updated">Last updated: October 13, 2025</p>
        </section>

        <section className="terms-body">
          <h2>Agreement to Our Legal Terms</h2>
          <p>
            We are Kalakritam ("Company", "we", "us", or "our"). We operate the website <a href="https://www.kalakritam.in" target="_blank" rel="noopener noreferrer">https://www.kalakritam.in</a> (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </p>
          <p>
            Kalakritam, derived from the Sanskrit words <em>kala</em> (art/skill) and <em>kritam</em> (creation/work), embodies our philosophy of manifesting through art. Established as Hyderabad's premier destination for art workshops and cultural learning, we bridge traditional Indian artistry with contemporary expressions, serving as a vibrant cultural hub for art lovers, collectors, and creators across Telangana and beyond. Our unique art workshops in Hyderabad mainly happen on weekends in cozy cafes and restaurants, creating an inspiring atmosphere for creativity. We feature expert instructors and comprehensive workshop experiences spanning various Indian art forms, regional styles, and contemporary techniques. From ancient temple art methods to modern creative workshops, Kalakritam offers an immersive weekend experience in India's artistic journey through hands-on learning, cultural appreciation, and creative expression. We believe in manifesting through art as a pathway to personal growth and cultural understanding.
          </p>
          <p>
            You can contact us by phone at <a href="tel:+917032201999">7032201999</a>, email at <a href="mailto:contact@kalakritam.in">contact@kalakritam.in</a>, or by mail to Karmanghat, Hyderabad, Hyderabad, Telangana 500079, India.
          </p>
          <p>
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Kalakritam, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p>
            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms. It is your responsibility to periodically review these Legal Terms to stay informed of updates. Your continued use of the Services constitutes acceptance of the revised Legal Terms.
          </p>
          <p>
            All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.
          </p>
          <p>We recommend that you print a copy of these Legal Terms for your records.</p>

          <h2>Table of Contents</h2>
          <ol>
            <li>Our Services</li>
            <li>Intellectual Property Rights</li>
            <li>User Representations</li>
            <li>User Registration</li>
            <li>Purchases and Payment</li>
            <li>Prohibited Activities</li>
            <li>User Generated Contributions</li>
            <li>Contribution Licence</li>
            <li>Services Management</li>
            <li>Privacy Policy</li>
            <li>Term and Termination</li>
            <li>Modifications and Interruptions</li>
            <li>Governing Law</li>
            <li>Dispute Resolution</li>
            <li>Corrections</li>
            <li>Disclaimer</li>
            <li>Limitations of Liability</li>
            <li>Indemnification</li>
            <li>User Data</li>
            <li>Electronic Communications, Transactions, and Signatures</li>
            <li>Miscellaneous</li>
            <li>Contact Us</li>
          </ol>

          <h2>1. Our Services</h2>
          <p>
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Those who access the Services from other locations do so on their own initiative and are responsible for compliance with local laws.
          </p>

          <h2>2. Intellectual Property Rights</h2>
          <h3>Our Intellectual Property</h3>
          <p>
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (collectively, the "Content"), as well as the trademarks, service marks, and logos (the "Marks"). Our Content and Marks are protected by copyright and trademark laws, and treaties around the world.
          </p>
          <p>The Content and Marks are provided on an "AS IS" basis for your internal business purpose only.</p>
          <h3>Your Use of Our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable licence to access the Services and download or print a copy of any portion of the Content to which you have properly gained access, solely for your internal business purpose.
          </p>
          <p>
            Except as expressly set out herein, no part of the Services, Content, or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose without our prior written permission.
          </p>

          <h2>3. User Representations</h2>
          <p>
            By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in your jurisdiction, or if a minor, you have parental permission; (5) you will not access the Services through automated or non-human means; (6) you will not use the Services for any illegal or unauthorised purpose; and (7) your use of the Services will not violate any applicable law or regulation.
          </p>

          <h2>4. User Registration</h2>
          <p>
            You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove or change a username if we determine it is inappropriate.
          </p>

          <h2>5. Purchases and Payment</h2>
          <p>
            You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services, and promptly update account and payment information as needed. We reserve the right to correct pricing errors and to limit or cancel orders at our sole discretion.
          </p>

          <h2>6. Prohibited Activities</h2>
          <p>
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us. Prohibited activities include, without limitation, unauthorised scraping, security circumvention, impersonation, uploading harmful code, automated use, and any use that violates applicable law.
          </p>

          <h2>7. User Generated Contributions</h2>
          <p>The Services does not offer users to submit or post content.</p>

          <h2>8. Contribution Licence</h2>
          <p>
            You agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices. By submitting suggestions or other feedback, you agree we can use and share such feedback for any purpose without compensation to you.
          </p>

          <h2>9. Services Management</h2>
          <p>
            We reserve the right to monitor the Services for violations; take legal action for violations; refuse, restrict, or disable content; remove files that are excessive in size or burdensome; and otherwise manage the Services to protect our rights and facilitate proper functioning.
          </p>

          <h2>10. Privacy Policy</h2>
          <p>
            We care about data privacy and security. Please review our Privacy Policy: <a href="https://kalakritam.in/privacy" target="_blank" rel="noopener noreferrer">https://kalakritam.in/privacy</a>. By using the Services, you agree to be bound by our Privacy Policy.
          </p>

          <h2>11. Term and Termination</h2>
          <p>
            These Legal Terms remain in effect while you use the Services. We may, in our sole discretion, deny access to and use of the Services to any person for any reason, including for breach of these Legal Terms or applicable law.
          </p>

          <h2>12. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We cannot guarantee the Services will be available at all times, and are not liable for any downtime or discontinuance.
          </p>

          <h2>13. Governing Law</h2>
          <p>These Legal Terms shall be governed by the laws of India. The courts of India shall have exclusive jurisdiction.</p>

          <h2>14. Dispute Resolution</h2>
          <p>
            The Parties agree to first attempt to negotiate any Dispute informally before initiating arbitration or litigation, where applicable. Certain claims (e.g., intellectual property, privacy, unauthorised use, injunctive relief) may be exempt from informal processes.
          </p>

          <h2>15. Corrections</h2>
          <p>There may be information on the Services containing errors or omissions. We reserve the right to correct and update without prior notice.</p>

          <h2>16. Disclaimer</h2>
          <p>
            THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2>17. Limitations of Liability</h2>
          <p>
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, OR LOSS OF DATA.
          </p>

          <h2>18. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold us harmless from any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, arising out of your use of the Services, your breach of these Legal Terms, or your violation of a third party's rights.
          </p>

          <h2>19. User Data</h2>
          <p>
            We will maintain certain data you transmit to the Services for performance management. You are responsible for all data you transmit or that relates to activities undertaken using the Services.
          </p>

          <h2>20. Electronic Communications, Transactions, and Signatures</h2>
          <p>
            Visiting the Services, sending emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and agree that they satisfy legal requirements for written communications.
          </p>

          <h2>21. Miscellaneous</h2>
          <p>
            These Legal Terms and any policies or operating rules posted by us constitute the entire agreement between you and us. If any provision is unlawful or unenforceable, the remaining provisions remain in effect.
          </p>

          <h2>22. Contact Us</h2>
          <address>
            Kalakritam<br />
            Karmanghat, Hyderabad, Telangana 500079, India<br />
            Phone: <a href="tel:+917032201999">7032201999</a><br />
            Email: <a href="mailto:contact@kalakritam.in">contact@kalakritam.in</a>
          </address>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

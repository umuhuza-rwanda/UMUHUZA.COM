import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Legal.css";

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <header className="legal-header">
        <button className="legal-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <img src={umurangaLogo} alt="UMUHUZA" className="legal-logo" />
      </header>

      <main className="legal-content">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: October 3, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using UMUHUZA, you agree to these Terms of Service
            and our Privacy Policy. If you do not agree, do not use the app.
          </p>
        </section>

        <section>
          <h2>2. Eligibility (18+)</h2>
          <p>
            You must be at least <strong>18 years old</strong> to use UMUHUZA.
            By registering, you confirm that you are 18 or older.
            Accounts belonging to users under 18 will be removed.
          </p>
        </section>

        <section>
          <h2>3. Your Account</h2>
          <ul>
            <li>You are responsible for keeping your login details safe</li>
            <li>You must provide accurate profile information</li>
            <li>You may not create an account for someone else without permission</li>
            <li>We may suspend or delete accounts that break these terms</li>
          </ul>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Harass, threaten, or harm other users</li>
            <li>Post illegal, abusive, or sexual content involving minors</li>
            <li>Use fake profiles or impersonate others</li>
            <li>Spam, scam, or solicit money from users</li>
            <li>Upload malware or attempt to hack the service</li>
          </ul>
        </section>

        <section>
          <h2>5. Safety</h2>
          <p>
            UMUHUZA helps people connect, but you are responsible for your own safety.
            Never send money to strangers and always meet in public places if you meet offline.
          </p>
        </section>

        <section>
          <h2>6. Premium and Payments</h2>
          <p>
            Some features may require payment. Payment requests may stay pending until confirmed.
            Fees are generally non-refundable except where required by law.
          </p>
        </section>

        <section>
          <h2>7. Content</h2>
          <p>
            You keep ownership of content you post, but you give UMUHUZA permission to
            display it inside the app for the purpose of providing the service.
          </p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>
            You may stop using UMUHUZA at any time. We may suspend or terminate accounts
            that violate these terms or create safety risks.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            UMUHUZA is provided “as is”. We are not responsible for the conduct of users
            or for offline meetings arranged through the app.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            For questions about these Terms, contact:{" "}
            <strong>support@umuhuza.online</strong>
          </p>
        </section>
      </main>
    </div>
  );
}

export default TermsOfService;
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Legal.css";

function PrivacyPolicy() {
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
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: October 3, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to UMUHUZA (“we”, “our”, or “us”). This Privacy Policy
            explains how we collect, use, store, and protect your personal
            information when you use the UMUHUZA website and mobile application.
          </p>
          <p>
            By creating an account or using UMUHUZA, you agree to this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>2. Age Requirement</h2>
          <p>
            UMUHUZA is intended only for users who are <strong>18 years of age or older</strong>.
            We do not knowingly collect personal information from anyone under 18.
            If we discover that a user is under 18, we will delete that account and related data.
          </p>
        </section>

        <section>
          <h2>3. Information We Collect</h2>
          <p>We may collect the following information:</p>
          <ul>
            <li>Name, email address, and password</li>
            <li>Profile information (photo, age, city, country, about, interests)</li>
            <li>Location data (if you allow it) to show approximate distance</li>
            <li>Messages, likes, interests, and other in-app activity</li>
            <li>Device and usage information (for security and app performance)</li>
            <li>Payment-related information when you buy Premium or chat packs</li>
          </ul>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To show your profile to other adult members</li>
            <li>To enable likes, interests, matches, and chat</li>
            <li>To improve safety, security, and user experience</li>
            <li>To process Premium and payment requests</li>
            <li>To send important service notifications</li>
          </ul>
        </section>

        <section>
          <h2>5. How We Store and Protect Data</h2>
          <p>
            Your data is stored securely using Supabase and related cloud services.
            We use reasonable technical and organizational measures to protect your information.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>6. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share limited data only when necessary:
          </p>
          <ul>
            <li>With service providers that help us operate the app (hosting, payments, analytics)</li>
            <li>When required by law or to protect safety and legal rights</li>
            <li>With other members, only as needed for the dating features you use (profile, chat, etc.)</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You may:</p>
          <ul>
            <li>View and update your profile information</li>
            <li>Request deletion of your account and personal data</li>
            <li>Contact us about privacy questions or concerns</li>
          </ul>
        </section>

        <section>
          <h2>8. Account Deletion</h2>
          <p>
            You can request account deletion from the app settings or by contacting us.
            When an account is deleted, we remove or anonymize personal data as required,
            except where we must keep limited information for legal or security reasons.
          </p>
        </section>

        <section>
          <h2>9. Children’s Privacy</h2>
          <p>
            UMUHUZA is not directed to children under 18. We do not knowingly collect
            personal information from children. Please see our{" "}
            <a href="/child-safety">Child Safety &amp; Age Policy</a> for more details.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            For privacy questions, data requests, or safety reports, contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@umuhuza.online
          </p>
          <p>
            (Replace with your real support email if different.)
          </p>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
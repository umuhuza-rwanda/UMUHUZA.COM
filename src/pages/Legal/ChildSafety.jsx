import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Legal.css";

function ChildSafety() {
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
        <h1>Child Safety &amp; Age Policy</h1>
        <p className="legal-updated">Last updated: October 3, 2026</p>

        <section>
          <h2>1. 18+ Only Platform</h2>
          <p>
            UMUHUZA is a dating and social connection platform for adults only.
            You must be at least <strong>18 years old</strong> to create an account
            or use any feature of UMUHUZA.
          </p>
        </section>

        <section>
          <h2>2. No Children Allowed</h2>
          <p>
            We do not knowingly allow users under 18 to register or use the app.
            We do not knowingly collect personal information from children under 18.
          </p>
        </section>

        <section>
          <h2>3. If an Underage Account Is Found</h2>
          <p>If we learn that a user is under 18, we will:</p>
          <ul>
            <li>Disable or delete the account</li>
            <li>Remove related profile content where appropriate</li>
            <li>Take additional action if required by law or safety standards</li>
          </ul>
        </section>

        <section>
          <h2>4. Zero Tolerance for Child Exploitation</h2>
          <p>
            UMUHUZA has zero tolerance for child sexual abuse and exploitation material
            or any attempt to involve minors in the platform.
            Such content or behavior will result in immediate account action and may be
            reported to relevant authorities.
          </p>
        </section>

        <section>
          <h2>5. How to Report Underage Users or Safety Issues</h2>
          <p>If you believe a user is under 18, or you see unsafe or illegal behavior:</p>
          <ul>
            <li>Use the in-app Report option where available</li>
            <li>Or email us at <strong>support@umuhuza.online</strong></li>
          </ul>
          <p>
            Please include the profile name/link and a short description of the issue.
          </p>
        </section>

        <section>
          <h2>6. Parental / Guardian Notice</h2>
          <p>
            If you are a parent or guardian and believe your child has created an account
            on UMUHUZA, contact us immediately so we can remove the account.
          </p>
        </section>

        <section>
          <h2>7. Related Policies</h2>
          <p>
            Please also read our{" "}
            <a href="/privacy-policy">Privacy Policy</a> for details about how we
            handle personal data.
          </p>
        </section>
      </main>
    </div>
  );
}

export default ChildSafety;
import "./Footer.css";

import {
  FiHeart,
  FiShield,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="kundwa-footer">

      <section
        id="contact"
        className="footer-contact"
      ></section>

      {/* =========================
          FOOTER MAIN
      ========================= */}

      <div className="footer-main">

        {/* BRAND */}

        <div className="footer-brand">

          <div className="footer-logo">
            <FiHeart />
            <span>UMUHUZA.COM</span>
          </div>

          <p>
            Helping people in Rwanda and Burundi
            meet, date, and find love.
          </p>

          <div className="footer-trust">
            <FiShield />
            <span>
              Safe • Secure • Dating
            </span>
          </div>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-column">

          <h3>
            UMUHUZA
          </h3>

          <a href="/">
            Home
          </a>

          <a href="/signup">
            Create Your Account
          </a>

          <a href="/login">
            Login
          </a>

<a href="/about-us">
  About Us
</a>

<a href="/download">
  UMUHUZA for Android
</a>

        </div>


        {/* FEATURES */}

        <div className="footer-column">

          <h3>
            Discover
          </h3>

          <a href="#">
            ❤️ Dating
          </a>

          <a href="#">
            💬 Chat
          </a>

          <a href="#">
            📞 Voice Calls
          </a>

          <a href="#">
            🎥 Love Stories & Reels
          </a>

          <a href="#">
            💕 Relationship Counselling
          </a>

        </div>


        {/* CONTACT */}

        <div className="footer-column">

          <h3>
            Contact Us
          </h3>

          <div className="footer-contact">
            <FiMail />
            <span>
              umuhuza.support.com
            </span>
          </div>

          <div className="footer-contact">
            <FiPhone />
            <span>
              +250 733777744
            </span>
          </div>

          <div className="footer-contact">
            <FiMapPin />
            <span>
              Rwanda & Burundi
            </span>
          </div>


          {/* SOCIAL */}

          <div className="footer-social">

            <a href="#" aria-label="Facebook">
              <FiFacebook />
            </a>

            <a href="#" aria-label="Instagram">
              <FiInstagram />
            </a>

            <a href="#" aria-label="Twitter">
              <FiTwitter />
            </a>

          </div>

        </div>

      </div>

```
  {/* =========================
      APP DOWNLOAD
  ========================= */}

  <div className="footer-app">

    <div>
      <h3>
        ❤️ TUNGA APP YA UMUHUZA
      </h3>

      <p>
        Connect with people you care about,
        wherever you go.
      </p>
    </div>

    <div className="footer-store-buttons">

      <a
        href="/download"
        className="footer-store-btn"
        aria-label="Download UMUHUZA for Android"
      >
        <span className="footer-store-icon">
          ▶
        </span>

        <span>
          <small>
            DOWNLOAD FOR
          </small>

          Android
        </span>
      </a>

    </div>

  </div>
```



      {/* =========================
          BOTTOM
      ========================= */}

      <div className="footer-bottom">

        <p>
          © 2026 UMUHUZA.COM All rights reserved.
        </p>

        <div>

<a href="/privacy-policy">
  Privacy Policy
</a>

<a href="/terms">
  Terms & Conditions
</a>

          <a href="#">
            Safety
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
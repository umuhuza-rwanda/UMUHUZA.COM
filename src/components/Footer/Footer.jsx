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
            <span>UMURANGA.COM</span>
          </div>

          <p>
            Connecting hearts across Rwanda and Burundi
            and helping people build genuine,
            meaningful relationships.
          </p>

          <div className="footer-trust">
            <FiShield />
            <span>
              Safe • Secure • Genuine Connections
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
            Create Account
          </a>

          <a href="/login">
            Login
          </a>

          <a href="#">
            How UMUHUZA Works
          </a>

          <a href="#">
            Success Stories
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

          <button className="footer-store-btn">

            <span className="footer-store-icon">
              
            </span>

            <span>
              <small>
                Download on the
              </small>

              App Store
            </span>

          </button>


          <button className="footer-store-btn">

            <span className="footer-store-icon">
              ▶
            </span>

            <span>
              <small>
                GET IT ON
              </small>

              Google Play
            </span>

          </button>

        </div>

      </div>


      {/* =========================
          BOTTOM
      ========================= */}

      <div className="footer-bottom">

        <p>
          © 2026 UMUHUZA.COM All rights reserved.
        </p>

        <div>

          <a href="#">
            Privacy Policy
          </a>

          <a href="#">
            Terms of Service
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
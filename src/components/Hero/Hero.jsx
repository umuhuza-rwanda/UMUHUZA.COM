import "./Hero.css";

import { Link } from "react-router-dom";

import heroImage from "../../assets/images/hero/hero.jpg";
import alineImage from "../../assets/images/members/aline.jpg";

import { FiSearch } from "react-icons/fi";

function Hero() {
  return (
    <section className="hero">

      {/* =========================
          HERO LEFT
      ========================= */}

      <div className="hero-left">

        <h1>
          Murakaza neza kurubuga,
          <br />
          ruhuza abashaka abakunzi mu Rwanda
        </h1>

        <p>
          Join thousands of people from Rwanda and Burundi
          who are looking for meaningful relationships,
          friendship and Marriage.
        </p>


        {/* =========================
            SEARCH
        ========================= */}

        <div className="hero-search">

          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Shaka umukunzi,..."
          />

        </div>


        {/* =========================
            HERO BUTTONS
        ========================= */}

        <div className="hero-buttons">

          {/* CREATE ACCOUNT */}

          <Link
            to="/signup"
            className="join-btn"
          >
            Sign up/ iyandikishe
          </Link>


          {/* LOGIN */}

          <Link
            to="/login"
            className="discover-btn"
          >
            Login/ Injira
          </Link>

        </div>


        {/* =========================
            HERO STATS
        ========================= */}

        <div className="hero-stats">

          <div>
            <h2>35K+</h2>
            <span>Members</span>
          </div>

          <div>
            <h2>850K+</h2>
            <span>Messages</span>
          </div>

          <div>
            <h2>5500+</h2>
            <span>Matches</span>
          </div>

          <div>
            <h2>4000+</h2>
            <span>Online</span>
          </div>

        </div>

      </div>


      {/* =========================
          HERO RIGHT
      ========================= */}

      <div className="hero-right">

        <div className="hero-image">

          <img
            src={heroImage}
            alt="KUNDWA couple"
          />

        </div>


        {/* =========================
            MEMBER CARD
        ========================= */}

        <div className="hero-member-card">

          <img
            src={alineImage}
            alt="Aline Uwase"
          />

          <div className="hero-member-info">

            <h3>
              Aline Uwase
            </h3>

            <p>
              📍 Kigali
            </p>

            <span>
              ONLINE NOW
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;
import "./AboutUs.css";

import {
  FiHeart,
  FiUsers,
  FiShield,
  FiGlobe,
  FiMessageCircle,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

function AboutUs() {

  const navigate = useNavigate();

  // =====================================================
  // COMMUNITY STATISTICS
  // =====================================================

  const statistics = [
    {
      number: "35K+",
      label: "People Joined",
      icon: <FiUsers />,
    },
    {
      number: "5,500+",
      label: "Connections Made",
      icon: <FiHeart />,
    },
    {
      number: "2,500+",
      label: "Successful Matches",
      icon: <FiCheckCircle />,
    },
    {
      number: "2",
      label: "Countries Connected",
      icon: <FiGlobe />,
    },
  ];


  // =====================================================
  // GO TO HOMEPAGE SECTION
  // =====================================================

  const goToSection = (sectionId) => {

    window.location.href =
      `/#${sectionId}`;

  };


  return (

    <div className="about-page">


      {/* =================================================
          HERO
      ================================================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-eyebrow">
            ❤️ ABOUT UMUHUZA.COM
          </span>

          <h1>
            Connecting Hearts,
            <br />
            Creating Real
            <span> Connections.</span>
          </h1>

          <p>
            UMUHUZA.COM is a community created to help
            people discover genuine relationships, friendship,
            companionship and meaningful love.
          </p>

          <div className="about-hero-buttons">

            <button
              type="button"
              className="about-primary-btn"
              onClick={() =>
                navigate("/signup")
              }
            >
              Join UMUHUZA
              <FiArrowRight />
            </button>

            <button
              type="button"
              className="about-secondary-btn"
              onClick={() =>
                goToSection("successful-stories")
              }
            >
              ❤️ Our Love Stories
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          OUR STORY
      ================================================= */}

      <section className="about-story">

        <div className="about-section-container">

          <div className="about-section-heading">

            <span>
              OUR STORY
            </span>

            <h2>
              Why UMUHUZA.COM Exists
            </h2>

          </div>


          <div className="about-story-grid">

            <div className="about-story-card">

              <div className="about-story-icon">
                ❤️
              </div>

              <h3>
                It Started With Love
              </h3>

              <p>
                UMUHUZA.COM was created from a simple
                idea: people should have a trusted place
                where they can meet others who are looking
                for genuine and meaningful relationships.
              </p>

            </div>


            <div className="about-story-card">

              <div className="about-story-icon">
                🌍
              </div>

              <h3>
                Bringing People Together
              </h3>

              <p>
                We connect people from Rwanda, Burundi
                and the wider community, including people
                living abroad who want to build meaningful
                relationships with people who share their
                culture and values.
              </p>

            </div>


            <div className="about-story-card">

              <div className="about-story-icon">
                🤝
              </div>

              <h3>
                More Than Dating
              </h3>

              <p>
                UMUHUZA is about more than finding a
                partner. It is also about friendship,
                community, conversations, shared experiences
                and creating relationships that can last.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          MISSION
      ================================================= */}

      <section className="about-mission">

        <div className="about-mission-container">

          <div className="about-mission-icon">
            💕
          </div>

          <span>
            OUR MISSION
          </span>

          <h2>
            Helping People Find
            <br />
            Meaningful Connections
          </h2>

          <p>
            Our mission is to create a safe, welcoming and
            authentic community where people can meet,
            communicate and build relationships based on
            honesty, respect and genuine interest.
          </p>

        </div>

      </section>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="about-statistics">

        <div className="about-section-container">

          <div className="about-section-heading centered">

            <span>
              OUR COMMUNITY
            </span>

            <h2>
              Growing Together
            </h2>

            <p>
              Every member is part of the UMUHUZA story.
            </p>

          </div>


          <div className="about-statistics-grid">

            {statistics.map(
              (stat) => (

                <div
                  className="about-stat-card"
                  key={stat.label}
                >

                  <div className="about-stat-icon">
                    {stat.icon}
                  </div>

                  <strong>
                    {stat.number}
                  </strong>

                  <span>
                    {stat.label}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          WHAT MAKES US DIFFERENT
      ================================================= */}

      <section className="about-different">

        <div className="about-section-container">

          <div className="about-section-heading centered">

            <span>
              WHY UMUHUZA
            </span>

            <h2>
              Built Around Genuine Connections
            </h2>

          </div>


          <div className="about-features-grid">


            <div className="about-feature">

              <div className="about-feature-icon">
                <FiHeart />
              </div>

              <h3>
                Genuine Relationships
              </h3>

              <p>
                Meet people who are looking for meaningful
                relationships rather than superficial
                interactions.
              </p>

            </div>


            <div className="about-feature">

              <div className="about-feature-icon">
                <FiShield />
              </div>

              <h3>
                Safety Matters
              </h3>

              <p>
                We are building UMUHUZA with privacy,
                safety and respectful communication at
                the heart of the platform.
              </p>

            </div>


            <div className="about-feature">

              <div className="about-feature-icon">
                <FiGlobe />
              </div>

              <h3>
                Rwanda, Burundi & Beyond
              </h3>

              <p>
                Connect with people locally or discover
                members from the diaspora.
              </p>

            </div>


            <div className="about-feature">

              <div className="about-feature-icon">
                <FiMessageCircle />
              </div>

              <h3>
                Real Conversations
              </h3>

              <p>
                Once people connect, UMUHUZA gives them
                a place to start meaningful conversations.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          LOVE STORIES CTA
      ================================================= */}

      <section className="about-love-cta">

        <div>

          <span>
            ❤️ UMUHUZA LOVE STORIES
          </span>

          <h2>
            Every Connection Has
            <br />
            a Story.
          </h2>

          <p>
            Discover stories from people whose journey
            started with a simple connection.
          </p>

          <button
            type="button"
            onClick={() =>
              goToSection("successful-stories")
            }
          >
            Discover Successful Stories
            <FiArrowRight />
          </button>

        </div>

      </section>


      {/* =================================================
          CONTACT CTA
      ================================================= */}

      <section className="about-contact-cta">

        <div>

          <h2>
            Have a Question?
          </h2>

          <p>
            We would love to hear from you.
          </p>

          <button
            type="button"
            onClick={() =>
              goToSection("contact")
            }
          >
            Contact UMUHUZA
            <FiArrowRight />
          </button>

        </div>

      </section>


    </div>

  );

}

export default AboutUs;
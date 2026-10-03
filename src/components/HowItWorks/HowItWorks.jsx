import "./HowItWorks.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserPlus,
  FaUserEdit,
  FaHeart,
  FaRing
} from "react-icons/fa";

function HowItWorks() {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO title
    document.title = "How UMUHUZA Works | Meet People in Rwanda";

    // SEO description
    const description =
      "Learn how UMUHUZA works. Create your profile, discover people in Rwanda and beyond, start meaningful conversations, and build genuine connections.";

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);

    // Canonical URL
    const canonicalUrl =
      "https://umuhuza.online/how-it-works";

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    // Open Graph
    const setMetaProperty = (property, content) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    setMetaProperty(
      "og:title",
      "How UMUHUZA Works | Meet People in Rwanda"
    );

    setMetaProperty(
      "og:description",
      description
    );

    setMetaProperty(
      "og:url",
      canonicalUrl
    );

    setMetaProperty(
      "og:type",
      "website"
    );
  }, []);

  const steps = [
    {
      number: "①",
      icon: <FaUserPlus />,
      title: "Create Your Account",
      text:
        "Sign up for UMUHUZA and create your account so you can begin discovering meaningful connections."
    },

    {
      number: "②",
      icon: <FaUserEdit />,
      title: "Complete Your Profile",
      text:
        "Tell people about yourself, add your photos and share information that helps others understand who you are."
    },

    {
      number: "③",
      icon: <FaHeart />,
      title: "Discover & Connect",
      text:
        "Explore people on UMUHUZA, discover profiles that interest you, and start meaningful conversations."
    },

    {
      number: "④",
      icon: <FaRing />,
      title: "Build Your Connection",
      text:
        "Take time to communicate, get to know one another and build a genuine relationship that can grow naturally."
    }
  ];

  return (
    <section className="how">

      <section
        id="how-it-works"
        className="how-it-works"
      ></section>

      {/* =========================================
          PAGE INTRODUCTION
      ========================================= */}

      <h1>
        ❤️ How UMUHUZA Works
      </h1>

      <p>
        UMUHUZA makes it easier to meet people, discover
        meaningful connections and build genuine relationships
        in Rwanda and beyond.
      </p>

      <div className="progress-line">

        <div>①</div>

        <span></span>

        <div>②</div>

        <span></span>

        <div>③</div>

        <span></span>

        <div>④</div>

      </div>

      {/* =========================================
          FOUR STEPS
      ========================================= */}

      <div className="how-grid">

        {steps.map((step, index) => (

          <div
            className="how-card"
            key={index}
          >

            <div className="step-number">
              {step.number}
            </div>

            <div className="step-icon">
              {step.icon}
            </div>

            <h2>
              {step.title}
            </h2>

            <p>
              {step.text}
            </p>

          </div>

        ))}

      </div>

      {/* =========================================
          MORE INFORMATION
      ========================================= */}

      <div className="how-description">

        <h2>
          Meet People and Build Meaningful Connections
        </h2>

        <p>
          UMUHUZA is designed for people who want to meet
          genuine people and develop meaningful relationships.
          Whether you are looking for companionship, friendship
          or a potential partner, the platform gives you a place
          to introduce yourself and connect with others.
        </p>

        <p>
          Start by creating your profile and sharing information
          about yourself. As you discover other people on UMUHUZA,
          take time to communicate respectfully and learn more
          about each other.
        </p>

      </div>

      {/* =========================================
          INTERNAL LINKS
      ========================================= */}

      <div className="how-links">

        <button
          type="button"
          onClick={() => navigate("/about")}
        >
          Learn More About UMUHUZA
        </button>

        <button
          type="button"
          onClick={() => navigate("/success-stories")}
        >
          Explore UMUHUZA Stories
        </button>

        <button
          type="button"
          onClick={() => navigate("/contact")}
        >
          Contact UMUHUZA
        </button>

      </div>

      {/* =========================================
          START LOVE JOURNEY
      ========================================= */}

      <button
        type="button"
        className="journey-btn"
        onClick={() => navigate("/signup")}
      >
        ❤️ Start Your UMUHUZA Journey
      </button>

    </section>
  );
}

export default HowItWorks;
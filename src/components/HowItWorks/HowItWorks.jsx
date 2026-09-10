import "./HowItWorks.css";

import { useNavigate } from "react-router-dom";

import {
  FaUserPlus,
  FaUserEdit,
  FaHeart,
  FaRing
} from "react-icons/fa";

function HowItWorks() {

  const navigate = useNavigate();

  const steps = [

    {
      number: "①",
      icon: <FaUserPlus />,
      title: "Create Account",
      text: "Sign up for free using your email or phone number in less than one minute."
    },

    {
      number: "②",
      icon: <FaUserEdit />,
      title: "Complete Profile",
      text: "Upload photos, verify your profile and tell people about yourself."
    },

    {
      number: "③",
      icon: <FaHeart />,
      title: "Discover & Chat",
      text: "Browse verified members, send likes and start meaningful conversations."
    },

    {
      number: "④",
      icon: <FaRing />,
      title: "Meet Your Match",
      text: "Build genuine relationships and create your own success story."
    }

  ];

  return (
<section className="how">

  <section
  id="how-it-works"
  className="how-it-works"
></section>

      <h2>❤️ How UMUHUZA Works</h2>

      <p>
        Finding genuine love has never been easier.
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

            <h3>
              {step.title}
            </h3>

            <p>
              {step.text}
            </p>

          </div>

        ))}

      </div>


      {/* =========================================
          START LOVE JOURNEY
      ========================================= */}

      <button
        type="button"
        className="journey-btn"
        onClick={() => navigate("/signup")}
      >

        ❤️ Start Your Love Journey Today

      </button>

    </section>

  );

}

export default HowItWorks;
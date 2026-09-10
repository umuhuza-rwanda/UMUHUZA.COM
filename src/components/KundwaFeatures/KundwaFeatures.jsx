import "./KundwaFeatures.css";

import datingImage from "../../assets/images/features/dating.jpg";
import chatImage from "../../assets/images/features/chat.jpg";
import voiceImage from "../../assets/images/features/voice.jpg";
import whatsappImage from "../../assets/images/features/whatsapp.jpg";
import photosImage from "../../assets/images/features/photos.jpg";
import reelsImage from "../../assets/images/features/reels.jpg";
import counsellingImage from "../../assets/images/features/counselling.jpg";

function KundwaFeatures() {
  return (
    <section className="kundwa-features">

      <section
  id="umuhuza-experiences"
  className="umuhuza-experiences"
></section>

      {/* HEADER */}

      <div className="features-header">

        <span className="features-label">
          ❤️ IBIGIZE UMUHUZA.COM
        </span>

        <h2>
          Everything You Need to Connect
        </h2>

        <p>
          More than dating. UMUHUZA gives you the tools
          to discover, connect and build meaningful relationships.
        </p>

      </div>


      {/* FEATURES */}

      <div className="features-orbit">


        {/* DATING */}

        <div className="feature-circle feature-dating">

          <div className="feature-image">
            <img
              src={datingImage}
              alt="UMURANGA Dating"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Dating
          </h3>

          <p>
            Find genuine connections
          </p>

        </div>


        {/* CHAT */}

        <div className="feature-circle feature-chat">

          <div className="feature-image">
            <img
              src={chatImage}
              alt="UMURANGA Chat"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Chat
          </h3>

          <p>
            Get to know each other
          </p>

        </div>


        {/* VOICE CALL */}

        <div className="feature-circle feature-call">

          <div className="feature-image">
            <img
              src={voiceImage}
              alt="KUNDWA Voice Call"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Voice Call
          </h3>

          <p>
            Talk beyond messages
          </p>

        </div>


        {/* WHATSAPP */}

        <div className="feature-circle feature-whatsapp">

          <div className="feature-image">
            <img
              src={whatsappImage}
              alt="WhatsApp Connection"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            WhatsApp
          </h3>

          <p>
            Connect when comfortable
          </p>

        </div>


        {/* PHOTOS */}

        <div className="feature-circle feature-photos">

          <div className="feature-image">
            <img
              src={photosImage}
              alt="Share Photos"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Photos
          </h3>

          <p>
            Share special moments
          </p>

        </div>


        {/* LOVE STORIES & REELS */}

        <div className="feature-circle feature-reels">

          <div className="feature-image">
            <img
              src={reelsImage}
              alt="Love Stories and Reels"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Love Stories & Reels
          </h3>

          <p>
            Discover inspiring stories
          </p>

        </div>


        {/* RELATIONSHIP COUNSELLING */}

        <div className="feature-circle feature-counselling">

          <div className="feature-image">
            <img
              src={counsellingImage}
              alt="Relationship Counselling"
            />
          </div>

          <div className="feature-heart">
            ❤️
          </div>

          <h3>
            Relationship Counselling
          </h3>

          <p>
            Guidance from a relationship expert
          </p>

        </div>


        {/* CENTER */}

        <div className="kundwa-center">

          <div className="center-heart">
            ❤️
          </div>

          <h3>
            UMUHUZA
          </h3>

          <span>
            Connect With Love
          </span>

        </div>

      </div>


      {/* APP DOWNLOAD */}

      <div className="app-download">

        <div>

          <h2>
            ❤️ Take UMUHUZA With You
          </h2>

          <p>
            Your connections, wherever you go.
          </p>

        </div>


        <div className="store-buttons">

          <button className="store-btn">

            <span className="store-icon">
              
            </span>

            <span>
              <small>
                Download on the
              </small>

              App Store
            </span>

          </button>


          <button className="store-btn">

            <span className="store-icon">
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

    </section>
  );
}

export default KundwaFeatures;
import React from "react";
import "./Download.css";

function Download() {
  return (
    <div className="download-page">
      <div className="download-card">
        <div className="download-icon">
          ❤️
        </div>

        <h1>UMUHUZA for Android</h1>

        <p className="download-tagline">
          Real Love, Real People.
        </p>

        <p className="download-description">
          Take UMUHUZA with you wherever you go. Connect with genuine
          people, discover meaningful connections, and stay connected
          from your Android phone.
        </p>

        <a
          href="#"
          className="download-button"
          onClick={(e) => e.preventDefault()}
        >
          📱 Download UMUHUZA for Android
        </a>

        <p className="download-note">
          Android app download will be available here soon.
        </p>
      </div>
    </div>
  );
}

export default Download;
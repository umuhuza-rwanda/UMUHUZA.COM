import React from "react";
import "./Download.css";

import SEO from "../../components/SEO/SEO";


function Download() {


return ( <main className="download-page">
  <SEO
  title="UMUHUZA Dating App for Android | Rwanda"
  description="Download the UMUHUZA dating app for Android. Meet singles in Rwanda, explore dating profiles, and find potential romantic partners on your phone."
  path="/download"
/>
   <div className="download-glow download-glow-one" aria-hidden="true" /> <div className="download-glow download-glow-two" aria-hidden="true" />

```
  <section className="download-card">
    <div className="download-brand">
      <div className="download-icon" aria-label="UMUHUZA heart logo">
        ❤️
      </div>

      <span className="download-eyebrow">
        koresha umuhuza aho waba uri hose
      </span>

      <h1>
        UMUHUZA <span>for Android</span>
      </h1>

      <p className="download-tagline">
        Real Love, Real People.
      </p>

      <p className="download-description">
        Take UMUHUZA with you wherever you go. Discover meaningful
        connections, stay in touch, and enjoy your UMUHUZA experience
        right from your Android phone.
      </p>
    </div>

    <div className="download-features">
      <div className="download-feature">
        <span className="download-feature-icon">💜</span>
        <span>Meaningful connections</span>
      </div>

      <div className="download-feature">
        <span className="download-feature-icon">💬</span>
        <span>Stay connected</span>
      </div>

      <div className="download-feature">
        <span className="download-feature-icon">📱</span>
        <span>Made for Android</span>
      </div>
    </div>

    <div className="download-actions">
      <a
        href="/downloads/umuhuza-android.apk"
        className="android-download-btn"
        download
      >
        <span className="download-button-icon" aria-hidden="true">
          ⬇
        </span>
        <span>Download UMUHUZA for Android</span>
      </a>

      <p className="download-note">
        <span className="download-note-check" aria-hidden="true">✓</span>
        Official UMUHUZA Android app
      </p>
    </div>

    <div className="download-footer">
      <span>❤️</span>
      <span>UMUHUZA.ONLINE</span>
      <span className="download-footer-divider">•</span>
      <span>Real Love, Real People.</span>
    </div>
  </section>
</main>

);
}

export default Download;
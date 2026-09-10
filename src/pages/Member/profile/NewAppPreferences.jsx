import "./NewAppPreferences.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiSettings,
  FiGlobe,
  FiSun,
  FiMoon,
  FiMonitor,
  FiVolume2,
  FiPlay,
  FiCheck,
  FiSave,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";

function NewAppPreferences() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD AUTHENTICATED USER
  // =====================================================

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (userError) {
          console.error("Unable to get current user:", userError);
          setError("Unable to load your account.");
          setLoading(false);
          return;
        }

        if (!user) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        setCurrentUser(user);
      } catch (err) {
        console.error("Authentication error:", err);

        if (active) {
          setError("Unable to load your account.");
          setLoading(false);
        }
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;

        const user = session?.user || null;

        setCurrentUser(user);

        if (!user) {
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // LOAD PREFERENCES
  // =====================================================

  useEffect(() => {
    if (!currentUser?.id) return;

    let active = true;

    const loadPreferences = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data,
          error: preferencesError,
        } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (!active) return;

        if (preferencesError) {
          console.error(
            "Preferences loading error:",
            preferencesError
          );

          setError("Unable to load your preferences.");
          setLoading(false);
          return;
        }

        const preferences = data?.preferences || {};

        setLanguage(
          typeof preferences.language === "string"
            ? preferences.language
            : "en"
        );

        setTheme(
          ["light", "dark", "system"].includes(
            preferences.theme
          )
            ? preferences.theme
            : "light"
        );

        setSoundEnabled(
          typeof preferences.soundEnabled === "boolean"
            ? preferences.soundEnabled
            : true
        );

        setAutoplay(
          typeof preferences.autoplay === "boolean"
            ? preferences.autoplay
            : true
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Unable to load preferences:",
          err
        );

        if (active) {
          setError("Unable to load your preferences.");
          setLoading(false);
        }
      }
    };

    loadPreferences();

    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  // =====================================================
  // SAVE PREFERENCES
  // =====================================================

  const handleSave = async () => {
    if (!currentUser?.id) {
      setError("Please log in to save your preferences.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const preferences = {
        language,
        theme,
        soundEnabled,
        autoplay,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          preferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (updateError) {
        console.error(
          "Preferences save error:",
          updateError
        );

        throw updateError;
      }

      setMessage("Your preferences have been saved.");

      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Unable to save preferences:",
        err
      );

      setError(
        err?.message ||
          "Unable to save your preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser && !loading) {
    return (
      <div className="new-preferences-page">
        <header className="new-preferences-header">
          <button
            type="button"
            className="new-preferences-back"
            onClick={() => navigate("/profile")}
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>

          <div className="new-preferences-brand">
            ❤️ UMUHUZA
          </div>

          <div className="new-preferences-header-title">
            <FiSettings />
            <span>App Preferences</span>
          </div>
        </header>

        <main className="new-preferences-main">
          <div className="new-preferences-empty">
            <div className="new-preferences-empty-icon">
              ❤️
            </div>

            <h2>Please log in</h2>

            <p>
              You need to be logged in to manage your
              UMUHUZA preferences.
            </p>

            <button
              type="button"
              className="new-preferences-primary-btn"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="new-preferences-page">
        <header className="new-preferences-header">
          <button
            type="button"
            className="new-preferences-back"
            onClick={() => navigate("/profile")}
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>

          <div className="new-preferences-brand">
            ❤️ UMUHUZA
          </div>

          <div className="new-preferences-header-title">
            <FiSettings />
            <span>App Preferences</span>
          </div>
        </header>

        <main className="new-preferences-main">
          <div className="new-preferences-loading">
            <div className="new-preferences-loading-icon">
              ⚙️
            </div>

            <h2>Loading Preferences...</h2>

            <p>
              We're preparing your UMUHUZA settings.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="new-preferences-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="new-preferences-header">

        <button
          type="button"
          className="new-preferences-back"
          onClick={() => navigate("/profile")}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div className="new-preferences-brand">
          ❤️ UMUHUZA
        </div>

        <div className="new-preferences-header-title">
          <FiSettings />
          <span>App Preferences</span>
        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="new-preferences-main">

        <section className="new-preferences-card">

          {/* =================================================
              INTRO
          ================================================= */}

          <div className="new-preferences-intro">

            <div className="new-preferences-intro-icon">
              <FiSettings />
            </div>

            <div>
              <span className="new-preferences-eyebrow">
                UMUHUZA SETTINGS
              </span>

              <h1>App Preferences</h1>

              <p>
                Customize your UMUHUZA experience the way
                you like it.
              </p>
            </div>

          </div>

          {/* =================================================
              LANGUAGE
          ================================================= */}

          <section className="new-preferences-section">

            <div className="new-preferences-section-heading">

              <div className="new-preferences-section-icon language">
                <FiGlobe />
              </div>

              <div>
                <h2>Language</h2>
                <p>
                  Choose the language you want to use
                  throughout UMUHUZA.
                </p>
              </div>

            </div>

            <div className="new-preferences-options">

              <button
                type="button"
                className={`preference-option ${
                  language === "en" ? "selected" : ""
                }`}
                onClick={() => setLanguage("en")}
              >
                <div className="preference-option-left">
                  <span className="language-flag">
                    🇬🇧
                  </span>

                  <div>
                    <strong>English</strong>
                    <small>English</small>
                  </div>
                </div>

                {language === "en" && (
                  <span className="preference-check">
                    <FiCheck />
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`preference-option ${
                  language === "rw" ? "selected" : ""
                }`}
                onClick={() => setLanguage("rw")}
              >
                <div className="preference-option-left">
                  <span className="language-flag">
                    🇷🇼
                  </span>

                  <div>
                    <strong>Kinyarwanda</strong>
                    <small>
                      Ururimi rw'Ikinyarwanda
                    </small>
                  </div>
                </div>

                {language === "rw" && (
                  <span className="preference-check">
                    <FiCheck />
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`preference-option ${
                  language === "fr" ? "selected" : ""
                }`}
                onClick={() => setLanguage("fr")}
              >
                <div className="preference-option-left">
                  <span className="language-flag">
                    🇫🇷
                  </span>

                  <div>
                    <strong>Français</strong>
                    <small>French</small>
                  </div>
                </div>

                {language === "fr" && (
                  <span className="preference-check">
                    <FiCheck />
                  </span>
                )}
              </button>

            </div>

          </section>

          {/* =================================================
              APPEARANCE
          ================================================= */}

          <section className="new-preferences-section">

            <div className="new-preferences-section-heading">

              <div className="new-preferences-section-icon appearance">
                <FiSun />
              </div>

              <div>
                <h2>Appearance</h2>
                <p>
                  Choose how UMUHUZA looks on your device.
                </p>
              </div>

            </div>

            <div className="appearance-options">

              <button
                type="button"
                className={`appearance-option ${
                  theme === "light" ? "selected" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                <FiSun />

                <strong>Light</strong>

                <span>
                  Bright and clean
                </span>

                {theme === "light" && (
                  <span className="appearance-check">
                    <FiCheck />
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`appearance-option ${
                  theme === "dark" ? "selected" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                <FiMoon />

                <strong>Dark</strong>

                <span>
                  Easier on the eyes
                </span>

                {theme === "dark" && (
                  <span className="appearance-check">
                    <FiCheck />
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`appearance-option ${
                  theme === "system" ? "selected" : ""
                }`}
                onClick={() => setTheme("system")}
              >
                <FiMonitor />

                <strong>System</strong>

                <span>
                  Follow device settings
                </span>

                {theme === "system" && (
                  <span className="appearance-check">
                    <FiCheck />
                  </span>
                )}
              </button>

            </div>

          </section>

          {/* =================================================
              SOUND
          ================================================= */}

          <section className="new-preferences-section">

            <div className="new-preferences-setting-row">

              <div className="new-preferences-setting-info">

                <div className="new-preferences-section-icon sound">
                  <FiVolume2 />
                </div>

                <div>
                  <h2>Sound Effects</h2>

                  <p>
                    Play sounds for important interactions
                    and notifications.
                  </p>
                </div>

              </div>

              <button
                type="button"
                className={`preference-toggle ${
                  soundEnabled ? "on" : ""
                }`}
                onClick={() =>
                  setSoundEnabled((value) => !value)
                }
                aria-label="Toggle sound effects"
              >
                <span />
              </button>

            </div>

          </section>

          {/* =================================================
              AUTOPLAY
          ================================================= */}

          <section className="new-preferences-section">

            <div className="new-preferences-setting-row">

              <div className="new-preferences-setting-info">

                <div className="new-preferences-section-icon autoplay">
                  <FiPlay />
                </div>

                <div>
                  <h2>Autoplay</h2>

                  <p>
                    Automatically play supported media when
                    available.
                  </p>
                </div>

              </div>

              <button
                type="button"
                className={`preference-toggle ${
                  autoplay ? "on" : ""
                }`}
                onClick={() =>
                  setAutoplay((value) => !value)
                }
                aria-label="Toggle autoplay"
              >
                <span />
              </button>

            </div>

          </section>

          {/* =================================================
              STATUS
          ================================================= */}

          {message && (
            <div className="new-preferences-success">
              <FiCheck />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="new-preferences-error">
              {error}
            </div>
          )}

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="new-preferences-save">

            <button
              type="button"
              className="new-preferences-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="save-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="new-preferences-footer">

          <div>❤️</div>

          <strong>UMUHUZA</strong>

          <p>
            Meaningful connections. Genuine people.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default NewAppPreferences;
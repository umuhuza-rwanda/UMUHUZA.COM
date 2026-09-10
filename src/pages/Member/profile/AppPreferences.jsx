import "./AppPreferences.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiSettings,
  FiGlobe,
  FiMoon,
  FiSun,
  FiVolume2,
  FiPlay,
  FiCheck,
  FiSave,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";

// =====================================================
// APP PREFERENCES CONTEXT
// =====================================================

import {
  useAppPreferences,
} from "../../../context/AppPreferencesContext";


function AppPreferences() {

  const navigate = useNavigate();


  // =====================================================
  // GLOBAL APP PREFERENCES
  // =====================================================
  //
  // These values come from AppPreferencesContext.
  //
  // language
  // theme
  // changeLanguage()
  // changeTheme()
  // t()
  // supportedLanguages
  //
  // Because the context is placed around the whole app
  // in App.jsx, these preferences are available everywhere.
  // =====================================================

  const {
    language,
    theme,
    changeLanguage,
    changeTheme,
    t,
    supportedLanguages,
  } = useAppPreferences();


  // =====================================================
  // AUTH STATE
  // =====================================================

  const [currentUser, setCurrentUser] =
    useState(null);


  // =====================================================
  // OTHER PREFERENCES
  // =====================================================

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [autoplay, setAutoplay] =
    useState(true);


  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {

    let active = true;


    const initializeAuth = async () => {

      try {

        const {
          data: {
            user,
          },
          error: authError,
        } = await supabase.auth.getUser();


        if (!active) {
          return;
        }


        if (authError) {

          console.error(
            "Unable to get current user:",
            authError
          );

          setCurrentUser(null);
          setLoading(false);

          return;

        }


        setCurrentUser(user || null);


        if (!user) {

          setLoading(false);

        }

      } catch (authError) {

        console.error(
          "Authentication error:",
          authError
        );


        if (active) {

          setCurrentUser(null);
          setLoading(false);

        }

      }

    };


    initializeAuth();


    // ===================================================
    // LISTEN FOR AUTH CHANGES
    // ===================================================

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (!active) {
            return;
          }


          const user =
            session?.user || null;


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
  // LOAD NON-GLOBAL PREFERENCES
  // =====================================================
  //
  // Language and theme are intentionally NOT loaded into
  // local state here.
  //
  // AppPreferencesContext controls:
  //
  // language
  // theme
  //
  // We only load:
  //
  // soundEnabled
  // autoplay
  //
  // The context should already be responsible for loading
  // language/theme from the user's preferences.
  // =====================================================

  useEffect(() => {

    if (!currentUser) {
      return;
    }


    let active = true;


    const loadPreferences = async () => {

      try {

        setLoading(true);
        setError("");


        // =================================================
        // LOAD USER PROFILE FROM SUPABASE
        // =================================================

        const {
          data,
          error: profileError,
        } =
          await supabase
            .from("profiles")
            .select(
              "soundEnabled, autoplay"
            )
            .eq(
              "id",
              currentUser.id
            )
            .maybeSingle();


        if (!active) {
          return;
        }


        if (profileError) {

          console.error(
            "Error loading app preferences:",
            profileError
          );


          setError(
            "Unable to load your app preferences."
          );


          return;

        }


        if (!data) {
          return;
        }


        // =================================================
        // SOUND
        // =================================================

        if (
          typeof data.soundEnabled ===
          "boolean"
        ) {

          setSoundEnabled(
            data.soundEnabled
          );

        }


        // =================================================
        // AUTOPLAY
        // =================================================

        if (
          typeof data.autoplay ===
          "boolean"
        ) {

          setAutoplay(
            data.autoplay
          );

        }

      } catch (supabaseError) {

        console.error(
          "Error loading app preferences:",
          supabaseError
        );


        if (active) {

          setError(
            "Unable to load your app preferences."
          );

        }

      } finally {

        if (active) {

          setLoading(false);

        }

      }

    };


    loadPreferences();


    return () => {

      active = false;

    };

  }, [currentUser]);


  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const handleLanguageChange = (event) => {

    const newLanguage =
      event.target.value;


    try {

      /*
       * The global context handles the language.
       *
       * This means changing language here can update
       * other UMUHUZA pages as well.
       */

      changeLanguage(
        newLanguage
      );

    } catch (languageError) {

      console.error(
        "Error changing language:",
        languageError
      );

      setError(
        "Unable to change the language. Please try again."
      );

    }

  };


  // =====================================================
  // THEME CHANGE
  // =====================================================

  const handleThemeChange = (value) => {

    try {

      /*
       * The global context controls the theme.
       *
       * Do NOT manually add/remove dark-mode here.
       *
       * AppPreferencesContext should handle:
       *
       * light
       * dark
       * system
       *
       * for the entire application.
       */

      changeTheme(value);

    } catch (themeError) {

      console.error(
        "Error changing theme:",
        themeError
      );

      setError(
        "Unable to change the appearance. Please try again."
      );

    }

  };


  // =====================================================
  // SAVE PREFERENCES
  // =====================================================

  const handleSave = async () => {

    if (!currentUser) {

      setError(
        "Your session has expired. Please log in again."
      );

      return;

    }


    try {

      setSaving(true);

      setError("");
      setSuccess("");


      // =================================================
      // SAVE TO SUPABASE PROFILES
      // =================================================

      const {
        error: updateError,
      } =
        await supabase
          .from("profiles")
          .update({

            language:
              language,

            appearance:
              theme,

            soundEnabled:
              soundEnabled,

            autoplay:
              autoplay,

            preferencesUpdatedAt:
              new Date().toISOString(),

          })
          .eq(
            "id",
            currentUser.id
          );


      if (updateError) {

        console.error(
          "Error saving app preferences:",
          updateError
        );


        setError(
          "We couldn't save your preferences. Please try again."
        );


        return;

      }


      setSuccess(
        "Your app preferences have been saved successfully."
      );


      // ===================================================
      // REMOVE SUCCESS MESSAGE
      // ===================================================

      setTimeout(() => {

        setSuccess("");

      }, 4000);

    } catch (supabaseError) {

      console.error(
        "Error saving app preferences:",
        supabaseError
      );


      setError(
        "We couldn't save your preferences. Please try again."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LANGUAGE LABEL HELPER
  // =====================================================
  //
  // This supports different possible structures in
  // supportedLanguages.
  // =====================================================

  const getLanguageLabel = (item) => {

    if (typeof item === "string") {

      if (item === "english") {
        return "🇬🇧 English";
      }

      if (item === "kinyarwanda") {
        return "🇷🇼 Kinyarwanda";
      }

      if (item === "french") {
        return "🇫🇷 Français";
      }

      if (item === "swahili") {
        return "🌍 Kiswahili";
      }

      return item;

    }


    if (item?.label) {
      return item.label;
    }


    if (item?.name) {
      return item.name;
    }


    return item?.value ||
      item?.code ||
      "";

  };


  // =====================================================
  // LANGUAGE VALUE HELPER
  // =====================================================

  const getLanguageValue = (item) => {

    if (typeof item === "string") {

      return item;

    }


    return (
      item?.value ||
      item?.code ||
      item?.id ||
      ""
    );

  };


  // =====================================================
  // DEFAULT LANGUAGE OPTIONS
  // =====================================================
  //
  // If the context doesn't provide supportedLanguages,
  // we still show the four KUNDWA languages.
  // =====================================================

  const languageOptions =
    Array.isArray(supportedLanguages) &&
    supportedLanguages.length > 0

      ? supportedLanguages

      : [
          "english",
          "kinyarwanda",
          "french",
          "swahili",
        ];


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser && !loading) {

    return (

      <div className="app-preferences-page">

        <div className="app-preferences-empty">

          <div className="app-preferences-empty-icon">
            ⚙️
          </div>

          <h2>
            Please log in
          </h2>

          <p>
            You need to be logged in to manage
            your app preferences.
          </p>

          <button
            type="button"
            className="app-preferences-primary-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="app-preferences-page">

        <div className="app-preferences-loading">

          <div className="app-preferences-loading-icon">
            ⚙️
          </div>

          <h2>
            Loading Preferences...
          </h2>

          <p>
            We're getting your UMUHUZA preferences ready.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="app-preferences-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="app-preferences-header">

        <button
          type="button"
          className="app-preferences-back-btn"
          onClick={() =>
            navigate("/profile")
          }
        >

          <FiArrowLeft />

          <span>
            {t("common.backToProfile") ||
              "Back to Profile"}
          </span>

        </button>


        <div className="app-preferences-brand">

          ❤️ UMUHUZA

        </div>


        <div className="app-preferences-header-icon">

          <FiSettings />

        </div>

      </header>


      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="app-preferences-main">


        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <div className="app-preferences-intro">

          <div className="app-preferences-intro-icon">

            <FiSettings />

          </div>


          <span className="app-preferences-eyebrow">

            {t("appPreferences.eyebrow") ||
              "APP PREFERENCES"}

          </span>


          <h1>

            {t("appPreferences.title") ||
              "App Preferences"}

          </h1>


          <p>

            {t("appPreferences.description") ||
              "Customize your UMUHUZA experience to make the app feel right for you."}

          </p>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="app-preferences-message error">

            <span>
              ⚠️
            </span>

            {error}

          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div className="app-preferences-message success">

            <FiCheck />

            {success}

          </div>

        )}


        {/* =================================================
            LANGUAGE
        ================================================= */}

        <section className="preference-card">

          <div className="preference-card-header">

            <div className="preference-icon language">

              <FiGlobe />

            </div>


            <div>

              <h2>

                {t("appPreferences.language.title") ||
                  "Language"}

              </h2>


              <p>

                {t("appPreferences.language.description") ||
                  "Choose the language you prefer to use on UMUHUZA."}

              </p>

            </div>

          </div>


          <div className="preference-control">

            <label htmlFor="language">

              {t("appPreferences.language.label") ||
                "App Language"}

            </label>


            <select
              id="language"
              value={language}
              onChange={
                handleLanguageChange
              }
              disabled={saving}
            >

              {languageOptions.map(
                (item) => {

                  const value =
                    getLanguageValue(item);

                  const label =
                    getLanguageLabel(item);

                  return (

                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>

                  );

                }
              )}

            </select>

          </div>

        </section>


        {/* =================================================
            APPEARANCE
        ================================================= */}

        <section className="preference-card">

          <div className="preference-card-header">

            <div className="preference-icon appearance">

              {theme === "dark"
                ? <FiMoon />
                : <FiSun />
              }

            </div>


            <div>

              <h2>

                {t("appPreferences.appearance.title") ||
                  "Appearance"}

              </h2>


              <p>

                {t("appPreferences.appearance.description") ||
                  "Choose how UMUHUZA looks on your device."}

              </p>

            </div>

          </div>


          <div className="appearance-options">


            {/* =================================================
                LIGHT
            ================================================= */}

            <button
              type="button"
              className={
                `appearance-option ${
                  theme === "light"
                    ? "selected"
                    : ""
                }`
              }
              onClick={() =>
                handleThemeChange("light")
              }
              disabled={saving}
            >

              <div className="appearance-option-icon">

                <FiSun />

              </div>


              <div>

                <strong>

                  {t("appPreferences.appearance.light") ||
                    "Light"}

                </strong>


                <span>

                  {t("appPreferences.appearance.lightDescription") ||
                    "Bright and clean"}

                </span>

              </div>


              {theme === "light" && (

                <FiCheck
                  className="appearance-check"
                />

              )}

            </button>


            {/* =================================================
                DARK
            ================================================= */}

            <button
              type="button"
              className={
                `appearance-option ${
                  theme === "dark"
                    ? "selected"
                    : ""
                }`
              }
              onClick={() =>
                handleThemeChange("dark")
              }
              disabled={saving}
            >

              <div className="appearance-option-icon">

                <FiMoon />

              </div>


              <div>

                <strong>

                  {t("appPreferences.appearance.dark") ||
                    "Dark"}

                </strong>


                <span>

                  {t("appPreferences.appearance.darkDescription") ||
                    "Easier on the eyes"}

                </span>

              </div>


              {theme === "dark" && (

                <FiCheck
                  className="appearance-check"
                />

              )}

            </button>


            {/* =================================================
                SYSTEM
            ================================================= */}

            <button
              type="button"
              className={
                `appearance-option ${
                  theme === "system"
                    ? "selected"
                    : ""
                }`
              }
              onClick={() =>
                handleThemeChange("system")
              }
              disabled={saving}
            >

              <div className="appearance-option-icon">

                ⚙️

              </div>


              <div>

                <strong>

                  {t("appPreferences.appearance.system") ||
                    "System"}

                </strong>


                <span>

                  {t("appPreferences.appearance.systemDescription") ||
                    "Follow your device"}

                </span>

              </div>


              {theme === "system" && (

                <FiCheck
                  className="appearance-check"
                />

              )}

            </button>

          </div>

        </section>


        {/* =================================================
            SOUND
        ================================================= */}

        <section className="preference-card">

          <div className="preference-card-header">

            <div className="preference-icon sound">

              <FiVolume2 />

            </div>


            <div>

              <h2>

                {t("appPreferences.sound.title") ||
                  "Sound"}

              </h2>


              <p>

                {t("appPreferences.sound.description") ||
                  "Control sounds while using UMUHUZA."}

              </p>

            </div>

          </div>


          <div className="preference-toggle-row">

            <div>

              <strong>

                {t("appPreferences.sound.effects") ||
                  "Sound Effects"}

              </strong>


              <span>

                {t("appPreferences.sound.effectsDescription") ||
                  "Play sounds for important actions and interactions."}

              </span>

            </div>


            <button
              type="button"
              className={
                `preference-toggle ${
                  soundEnabled
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                setSoundEnabled(
                  !soundEnabled
                )
              }
              disabled={saving}
              aria-label="Toggle sound effects"
              aria-pressed={soundEnabled}
            >

              <span></span>

            </button>

          </div>

        </section>


        {/* =================================================
            AUTOPLAY
        ================================================= */}

        <section className="preference-card">

          <div className="preference-card-header">

            <div className="preference-icon autoplay">

              <FiPlay />

            </div>


            <div>

              <h2>

                {t("appPreferences.media.title") ||
                  "Media"}

              </h2>


              <p>

                {t("appPreferences.media.description") ||
                  "Control how media behaves while browsing UMUHUZA."}

              </p>

            </div>

          </div>


          <div className="preference-toggle-row">

            <div>

              <strong>

                {t("appPreferences.media.autoplay") ||
                  "Autoplay Media"}

              </strong>


              <span>

                {t("appPreferences.media.autoplayDescription") ||
                  "Automatically play supported videos and media when available."}

              </span>

            </div>


            <button
              type="button"
              className={
                `preference-toggle ${
                  autoplay
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                setAutoplay(
                  !autoplay
                )
              }
              disabled={saving}
              aria-label="Toggle autoplay"
              aria-pressed={autoplay}
            >

              <span></span>

            </button>

          </div>

        </section>


        {/* =================================================
            SAVE
        ================================================= */}

        <div className="app-preferences-save-area">

          <button
            type="button"
            className="app-preferences-save-btn"
            onClick={handleSave}
            disabled={saving}
          >

            {saving ? (

              <>

                <span className="save-spinner"></span>

                {t("appPreferences.saving") ||
                  "Saving Preferences..."}

              </>

            ) : (

              <>

                <FiSave />

                {t("appPreferences.save") ||
                  "Save Preferences"}

              </>

            )}

          </button>


          <p>

            {t("appPreferences.savedSecurely") ||
              "Your preferences are securely saved to your UMUHUZA account."}

          </p>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="app-preferences-footer">

          <div>
            ❤️
          </div>


          <strong>
            UMUHUZA
          </strong>


          <p>

            {t("common.meaningfulConnections") ||
              "Meaningful connections. Genuine people."}

          </p>


          <small>

            {t("appPreferences.footer") ||
              "Your preferences help us create a better experience for you."}

          </small>

        </footer>


      </main>

    </div>

  );

}


export default AppPreferences;
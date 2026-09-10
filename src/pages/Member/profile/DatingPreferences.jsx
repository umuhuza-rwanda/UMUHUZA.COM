import "./DatingPreferences.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiHeart,
  FiUsers,
  FiCheckCircle,
  FiSave,
  FiInfo,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";


function DatingPreferences() {
  const navigate = useNavigate();

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [currentUser, setCurrentUser] = useState(null);

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [profile, setProfile] = useState(null);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [lookingFor, setLookingFor] = useState("");

  const [lookingForGender, setLookingForGender] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (authError) {
          console.error(
            "Error getting current user:",
            authError
          );

          setCurrentUser(null);
          setLoading(false);

          return;
        }

        setCurrentUser(user || null);

        if (!user) {
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error(
          "Authentication error:",
          err
        );

        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        const user = session?.user || null;

        setCurrentUser(user);

        if (!user) {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // LOAD PROFILE FROM SUPABASE
  // =====================================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            `
              id,
              full_name,
              username,
              bio,
              profile_photo_url,
              looking_for_gender,
              relation_goal,
              updated_at
            `
          )
          .eq("id", currentUser.id)
          .single();

        if (!mounted) {
          return;
        }

        if (profileError) {
          console.error(
            "Error loading dating preferences:",
            profileError
          );

          setProfile(null);

          setError(
            "Unable to load your dating preferences. Please try again."
          );

          setLoading(false);

          return;
        }

        if (!data) {
          setProfile(null);

          setError(
            "Your UMUHUZA profile could not be found."
          );

          setLoading(false);

          return;
        }

        setProfile(data);

        // =================================================
        // LOAD EXISTING SUPABASE VALUES
        // =================================================

        setLookingFor(
          data.relation_goal || ""
        );

        setLookingForGender(
          data.looking_for_gender || ""
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Unexpected profile loading error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load your dating preferences. Please try again."
          );

          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

  // =====================================================
  // CHANGE PREFERENCE
  // =====================================================

  const handlePreferenceChange = (
    setter,
    value
  ) => {
    setter(value);

    setSaved(false);

    setError("");
  };

  // =====================================================
  // SAVE DATING PREFERENCES
  // =====================================================

  const handleSave = async () => {
    setError("");
    setSaved(false);

    // ---------------------------------------------------
    // CHECK AUTHENTICATION
    // ---------------------------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "Your session has expired. Please log in again."
      );

      return;
    }

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!lookingFor) {
      setError(
        "Please choose what you are looking for."
      );

      return;
    }

    if (!lookingForGender) {
      setError(
        "Please choose who you would like to meet."
      );

      return;
    }

    // ---------------------------------------------------
    // SAVE TO SUPABASE
    // ---------------------------------------------------

    try {
      setSaving(true);

      const {
        data,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          relation_goal: lookingFor,

          looking_for_gender:
            lookingForGender,

          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error(
          "Error saving dating preferences:",
          updateError
        );

        setError(
          "We couldn't save your preferences. Please try again."
        );

        return;
      }

      if (data) {
        setProfile(data);

        setLookingFor(
          data.relation_goal || lookingFor
        );

        setLookingForGender(
          data.looking_for_gender ||
            lookingForGender
        );
      }

      setSaved(true);

      console.log(
        "❤️ UMUHUZA dating preferences saved successfully."
      );

      // Remove success message after 4 seconds
      setTimeout(() => {
        setSaved(false);
      }, 4000);
    } catch (err) {
      console.error(
        "Unexpected error saving dating preferences:",
        err
      );

      setError(
        "We couldn't save your preferences. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // BACK TO PROFILE
  // =====================================================

const handleBackToProfile = () => {
  navigate("/profile");
};

  // =====================================================
  // LOGIN FALLBACK
  // =====================================================

  if (!currentUser && !loading) {
    return (
      <div className="dating-preferences-page">

        <div className="dating-empty-card">

          <div className="dating-empty-icon">
            ❤️
          </div>

          <h2>
            Please log in
          </h2>

          <p>
            You need to be logged in to manage
            your dating preferences.
          </p>

          <button
            type="button"
            className="dating-primary-btn"
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
      <div className="dating-preferences-page">

        <div className="dating-loading-card">

          <div className="dating-loading-icon">
            ❤️
          </div>

          <h2>
            Loading Preferences...
          </h2>

          <p>
            We're getting your UMUHUZA
            dating preferences ready.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="dating-preferences-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dating-header">

        <button
          type="button"
          className="dating-back-btn"
          onClick={handleBackToProfile}
        >

          <FiArrowLeft />

          <span>
            Back to Profile
          </span>

        </button>

        <div className="dating-brand">
          ❤️ UMUHUZA
        </div>

        <div className="dating-header-title">

          <FiHeart />

          <span>
            Dating Preferences
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dating-main">

        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="dating-intro-card">

          <div className="dating-intro-icon">

            <FiHeart />

          </div>

          <div>

            <span className="dating-eyebrow">
              YOUR PREFERENCES
            </span>

            <h1>
              Tell UMUHUZA What You're Looking For
            </h1>

            <p>
              Your preferences help us recommend
              people who are more likely to be a
              meaningful match for you.
            </p>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="dating-error">

            <FiInfo />

            <span>
              {error}
            </span>

          </div>
        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {saved && (
          <div className="dating-success">

            <FiCheckCircle />

            <div>

              <strong>
                Preferences saved successfully
              </strong>

              <span>
                Your UMUHUZA recommendations will
                use your updated preferences.
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            PREFERENCE FORM
        ================================================= */}

        <section className="dating-form-card">

          {/* =================================================
              WHAT ARE YOU LOOKING FOR?
          ================================================= */}

          <div className="dating-section-header">

            <div className="dating-section-icon heart">

              <FiHeart />

            </div>

            <div>

              <h2>
                What are you looking for?
              </h2>

              <p>
                Choose the type of connection
                you're hoping to find.
              </p>

            </div>

          </div>


          <div className="dating-options">

            {/* MARRIAGE */}

            <button
              type="button"
              className={`dating-option ${
                lookingFor === "marriage"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingFor,
                  "marriage"
                )
              }
            >

              <div className="dating-option-icon">
                💍
              </div>

              <div className="dating-option-content">

                <strong>
                  Marriage
                </strong>

                <span>
                  I'm looking for a serious
                  relationship that can lead to marriage.
                </span>

              </div>

              <div className="dating-option-check">

                {lookingFor === "marriage" && (
                  <FiCheckCircle />
                )}

              </div>

            </button>


            {/* SERIOUS RELATIONSHIP */}

            <button
              type="button"
              className={`dating-option ${
                lookingFor ===
                "serious-relationship"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingFor,
                  "serious-relationship"
                )
              }
            >

              <div className="dating-option-icon">
                ❤️
              </div>

              <div className="dating-option-content">

                <strong>
                  Serious Relationship
                </strong>

                <span>
                  I'm interested in building
                  a committed and meaningful relationship.
                </span>

              </div>

              <div className="dating-option-check">

                {lookingFor ===
                  "serious-relationship" && (
                  <FiCheckCircle />
                )}

              </div>

            </button>


            {/* FRIENDSHIP */}

            <button
              type="button"
              className={`dating-option ${
                lookingFor === "friendship"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingFor,
                  "friendship"
                )
              }
            >

              <div className="dating-option-icon">
                🤝
              </div>

              <div className="dating-option-content">

                <strong>
                  Friendship
                </strong>

                <span>
                  I'm looking to meet genuine people
                  and build meaningful friendships.
                </span>

              </div>

              <div className="dating-option-check">

                {lookingFor === "friendship" && (
                  <FiCheckCircle />
                )}

              </div>

            </button>


            {/* GETTING TO KNOW */}

            <button
              type="button"
              className={`dating-option ${
                lookingFor ===
                "getting-to-know"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingFor,
                  "getting-to-know"
                )
              }
            >

              <div className="dating-option-icon">
                💕
              </div>

              <div className="dating-option-content">

                <strong>
                  Getting to Know Someone
                </strong>

                <span>
                  I'm open to meeting someone
                  and seeing where the connection goes.
                </span>

              </div>

              <div className="dating-option-check">

                {lookingFor ===
                  "getting-to-know" && (
                  <FiCheckCircle />
                )}

              </div>

            </button>

          </div>


          {/* =================================================
              WHO ARE YOU LOOKING FOR?
          ================================================= */}

          <div className="dating-section-header second-section">

            <div className="dating-section-icon users">

              <FiUsers />

            </div>

            <div>

              <h2>
                Who would you like to meet?
              </h2>

              <p>
                Choose who UMUHUZA should recommend
                to you.
              </p>

            </div>

          </div>


          <div className="dating-gender-options">

            {/* MEN */}

            <button
              type="button"
              className={`dating-gender-option ${
                lookingForGender === "men"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingForGender,
                  "men"
                )
              }
            >

              <div className="gender-option-emoji">
                👨
              </div>

              <strong>
                Men
              </strong>

              {lookingForGender === "men" && (
                <FiCheckCircle />
              )}

            </button>


            {/* WOMEN */}

            <button
              type="button"
              className={`dating-gender-option ${
                lookingForGender === "women"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingForGender,
                  "women"
                )
              }
            >

              <div className="gender-option-emoji">
                👩
              </div>

              <strong>
                Women
              </strong>

              {lookingForGender === "women" && (
                <FiCheckCircle />
              )}

            </button>


            {/* MEN AND WOMEN */}

            <button
              type="button"
              className={`dating-gender-option ${
                lookingForGender ===
                "men-and-women"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  setLookingForGender,
                  "men-and-women"
                )
              }
            >

              <div className="gender-option-emoji">
                👨‍👩‍👧
              </div>

              <strong>
                Men & Women
              </strong>

              {lookingForGender ===
                "men-and-women" && (
                <FiCheckCircle />
              )}

            </button>

          </div>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="dating-information">

            <FiInfo />

            <div>

              <strong>
                How UMUHUZA uses this
              </strong>

              <p>
                These preferences help personalize
                your discovery experience. You can
                change them at any time.
              </p>

            </div>

          </div>


          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <div className="dating-save-container">

            <button
              type="button"
              className="dating-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving ? (
                <>
                  <span className="dating-spinner"></span>

                  Saving Preferences...
                </>
              ) : (
                <>
                  <FiSave />

                  Save Preferences
                </>
              )}

            </button>


            <button
              type="button"
              className="dating-cancel-btn"
              onClick={handleBackToProfile}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="dating-footer">

          <div className="dating-footer-heart">
            ❤️
          </div>

          <strong>
            UMUHUZA
          </strong>

          <p>
            Meaningful connections. Genuine people.
          </p>

          <small>
            Your preferences are private and
            controlled by you.
          </small>

        </footer>

      </main>

    </div>
  );
}


export default DatingPreferences;
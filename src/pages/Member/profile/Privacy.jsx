import "./Privacy.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiShield,
  FiEye,
  FiUsers,
  FiMapPin,
  FiMessageCircle,
  FiHeart,
  FiWifi,
  FiClock,
  FiCheck,
  FiSave,
  FiInfo,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";


function Privacy() {
  const navigate = useNavigate();

  // =====================================================
  // AUTH / UI STATE
  // =====================================================

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // PRIVACY SETTINGS
  // =====================================================

  const [profileVisibility, setProfileVisibility] =
    useState("members");

  const [showInDiscover, setShowInDiscover] =
    useState(true);

  const [locationVisibility, setLocationVisibility] =
    useState("district");

  const [showOnlineStatus, setShowOnlineStatus] =
    useState(true);

  const [showLastActive, setShowLastActive] =
    useState(true);

  const [readReceipts, setReadReceipts] =
    useState(true);

  const [allowMessagesFrom, setAllowMessagesFrom] =
    useState("matches");

  const [allowLikesFrom, setAllowLikesFrom] =
    useState("everyone");


  // =====================================================
  // AUTH
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error(
            "Error getting current user:",
            authError
          );
        }

        if (!mounted) {
          return;
        }

        setCurrentUser(user || null);

        if (!user) {
          setError(
            "Your session has expired. Please log in again."
          );

          setLoading(false);
        }
      } catch (authError) {
        console.error(
          "Unable to get current user:",
          authError
        );

        if (mounted) {
          setCurrentUser(null);

          setError(
            "Your session has expired. Please log in again."
          );

          setLoading(false);
        }
      }
    };

    loadCurrentUser();


    // ===================================================
    // AUTH STATE LISTENER
    // ===================================================

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
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
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);


  // =====================================================
  // LOAD PRIVACY SETTINGS
  // =====================================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    let active = true;

    const loadPrivacySettings = async () => {
      try {
        setLoading(true);
        setError("");

        // =================================================
        // GET PRIVACY JSON FROM PROFILES
        // =================================================

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("privacy")
          .eq(
            "id",
            currentUser.id
          )
          .maybeSingle();


        if (!active) {
          return;
        }


        // =================================================
        // ERROR
        // =================================================

        if (profileError) {
          console.error(
            "Error loading privacy settings:",
            profileError
          );

          setError(
            "Unable to load your privacy settings. Please try again."
          );

          setLoading(false);

          return;
        }


        // =================================================
        // NO PROFILE
        // =================================================

        if (!data) {
          setError(
            "We couldn't find your KUNDWA profile."
          );

          setLoading(false);

          return;
        }


        // =================================================
        // PRIVACY DATA
        // =================================================

        const privacy =
          data.privacy || {};


        // =================================================
        // LOAD SAVED VALUES
        // =================================================

        setProfileVisibility(
          privacy.profileVisibility ||
          "members"
        );


        setShowInDiscover(
          privacy.showInDiscover !== undefined
            ? privacy.showInDiscover
            : true
        );


        setLocationVisibility(
          privacy.locationVisibility ||
          "district"
        );


        setShowOnlineStatus(
          privacy.showOnlineStatus !== undefined
            ? privacy.showOnlineStatus
            : true
        );


        setShowLastActive(
          privacy.showLastActive !== undefined
            ? privacy.showLastActive
            : true
        );


        setReadReceipts(
          privacy.readReceipts !== undefined
            ? privacy.readReceipts
            : true
        );


        setAllowMessagesFrom(
          privacy.allowMessagesFrom ||
          "matches"
        );


        setAllowLikesFrom(
          privacy.allowLikesFrom ||
          "everyone"
        );


        setLoading(false);

      } catch (privacyError) {
        console.error(
          "Error loading privacy settings:",
          privacyError
        );

        if (active) {
          setError(
            "Unable to load your privacy settings. Please try again."
          );

          setLoading(false);
        }
      }
    };


    loadPrivacySettings();


    // =====================================================
    // SUPABASE REALTIME
    // =====================================================

    const channel = supabase
      .channel(
        `privacy-settings-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter:
            `id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (
            !active ||
            !payload?.new
          ) {
            return;
          }


          const privacy =
            payload.new.privacy || {};


          setProfileVisibility(
            privacy.profileVisibility ||
            "members"
          );


          setShowInDiscover(
            privacy.showInDiscover !== undefined
              ? privacy.showInDiscover
              : true
          );


          setLocationVisibility(
            privacy.locationVisibility ||
            "district"
          );


          setShowOnlineStatus(
            privacy.showOnlineStatus !== undefined
              ? privacy.showOnlineStatus
              : true
          );


          setShowLastActive(
            privacy.showLastActive !== undefined
              ? privacy.showLastActive
              : true
          );


          setReadReceipts(
            privacy.readReceipts !== undefined
              ? privacy.readReceipts
              : true
          );


          setAllowMessagesFrom(
            privacy.allowMessagesFrom ||
            "matches"
          );


          setAllowLikesFrom(
            privacy.allowLikesFrom ||
            "everyone"
          );
        }
      )
      .subscribe((status) => {
        console.log(
          "🔐 Privacy realtime:",
          status
        );
      });


    return () => {
      active = false;

      supabase.removeChannel(
        channel
      );
    };
  }, [currentUser?.id]);


  // =====================================================
  // SAVE PRIVACY SETTINGS
  // =====================================================

  const handleSave = async () => {
    if (!currentUser?.id) {
      setError(
        "Please log in again to save your privacy settings."
      );

      return;
    }


    try {
      setSaving(true);
      setSaved(false);
      setError("");


      // =================================================
      // PRIVACY DATA
      // =================================================

      const privacyData = {
        profileVisibility,

        showInDiscover,

        locationVisibility,

        showOnlineStatus,

        showLastActive,

        readReceipts,

        allowMessagesFrom,

        allowLikesFrom,
      };


      // =================================================
      // SAVE TO SUPABASE
      // =================================================

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          privacy: privacyData,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          currentUser.id
        );


      if (updateError) {
        throw updateError;
      }


      // =================================================
      // SUCCESS
      // =================================================

      setSaved(true);


      // =================================================
      // HIDE SUCCESS MESSAGE
      // =================================================

      setTimeout(() => {
        setSaved(false);
      }, 3500);

    } catch (saveError) {
      console.error(
        "Error saving privacy settings:",
        saveError
      );

      setError(
        "We couldn't save your privacy settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const Toggle = ({
    checked,
    onChange,
    label,
    description,
    icon,
  }) => {
    return (
      <div className="privacy-toggle-row">

        <div className="privacy-toggle-icon">
          {icon}
        </div>


        <div className="privacy-toggle-content">

          <h3>
            {label}
          </h3>

          <p>
            {description}
          </p>

        </div>


        <button
          type="button"
          className={
            checked
              ? "privacy-toggle active"
              : "privacy-toggle"
          }
          onClick={() =>
            onChange(!checked)
          }
          aria-pressed={checked}
          disabled={saving}
        >

          <span className="privacy-toggle-knob">

            {checked && (
              <FiCheck />
            )}

          </span>

        </button>

      </div>
    );
  };


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (
    !currentUser &&
    !loading
  ) {
    return (
      <div className="privacy-page">

        <div className="privacy-empty-card">

          <div className="privacy-empty-icon">
            <FiShield />
          </div>


          <h2>
            Please log in
          </h2>


          <p>
            You need to be logged in to manage
            your privacy settings.
          </p>


          <button
            type="button"
            className="privacy-primary-btn"
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
      <div className="privacy-page">

        <div className="privacy-loading-card">

          <div className="privacy-loading-icon">
            <FiShield />
          </div>


          <h2>
            Loading Privacy Settings...
          </h2>


          <p>
            We're preparing your privacy controls.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="privacy-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="privacy-header">


        <button
          type="button"
          className="privacy-back-btn"
          onClick={() =>
            navigate("/profile")
          }
        >

          <FiArrowLeft />

          <span>
            Back to Profile
          </span>

        </button>


        <div className="privacy-brand">
          ❤️ KUNDWA
        </div>

<button
  type="button"
  className="privacy-close-btn"
  onClick={() =>
    navigate("/profile")
  }
  aria-label="Close"
>
  ×
</button>



      </header>



      {/* =================================================
          MAIN
      ================================================= */}

      <main className="privacy-main">


        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <div className="privacy-page-intro">


          <div className="privacy-intro-icon">

            <FiShield />

          </div>


          <span className="privacy-eyebrow">

            PRIVACY SETTINGS

          </span>


          <h1>

            Your Privacy

          </h1>


          <p>

            Control who can discover you, interact
            with you, and see information about you
            on KUNDWA.

          </p>


        </div>



        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="privacy-error">

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

          <div className="privacy-success">

            <FiCheck />

            <span>
              Your privacy settings have been saved successfully.
            </span>

          </div>

        )}



        {/* =================================================
            PROFILE VISIBILITY
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiEye />

            </div>


            <div>

              <h2>
                Profile Visibility
              </h2>

              <p>
                Choose who can view your KUNDWA profile.
              </p>

            </div>


          </div>



          <div className="privacy-options">


            {/* EVERYONE */}

            <label
              className={
                profileVisibility === "everyone"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="profileVisibility"
                value="everyone"
                checked={
                  profileVisibility ===
                  "everyone"
                }
                onChange={() =>
                  setProfileVisibility(
                    "everyone"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  Everyone
                </strong>

                <small>
                  Your profile can be discovered by anyone
                  using KUNDWA.
                </small>

              </div>

            </label>



            {/* MEMBERS */}

            <label
              className={
                profileVisibility === "members"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="profileVisibility"
                value="members"
                checked={
                  profileVisibility ===
                  "members"
                }
                onChange={() =>
                  setProfileVisibility(
                    "members"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  KUNDWA Members Only
                </strong>

                <small>
                  Only registered KUNDWA members can view
                  your profile.
                </small>

              </div>

            </label>



            {/* MATCHES */}

            <label
              className={
                profileVisibility === "matches"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="profileVisibility"
                value="matches"
                checked={
                  profileVisibility ===
                  "matches"
                }
                onChange={() =>
                  setProfileVisibility(
                    "matches"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  Matches Only
                </strong>

                <small>
                  Only people who match your preferences
                  can view your full profile.
                </small>

              </div>

            </label>


          </div>

        </section>



        {/* =================================================
            DISCOVERY
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiUsers />

            </div>


            <div>

              <h2>
                Discovery
              </h2>

              <p>
                Control whether other members can discover you.
              </p>

            </div>


          </div>



          <Toggle
            checked={showInDiscover}
            onChange={setShowInDiscover}
            label="Show me in Discover"
            description="Allow your profile to appear in KUNDWA discovery and recommendation results."
            icon={<FiUsers />}
          />


        </section>



        {/* =================================================
            LOCATION PRIVACY
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiMapPin />

            </div>


            <div>

              <h2>
                Location Privacy
              </h2>

              <p>
                Decide how much of your location other
                members can see.
              </p>

            </div>


          </div>



          <div className="privacy-location-warning">

            <FiInfo />

            <p>
              KUNDWA will never publicly display your
              exact home address.
            </p>

          </div>



          <div className="privacy-options">


            {/* DISTRICT */}

            <label
              className={
                locationVisibility === "district"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="locationVisibility"
                value="district"
                checked={
                  locationVisibility ===
                  "district"
                }
                onChange={() =>
                  setLocationVisibility(
                    "district"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  District / Province
                </strong>

                <small>
                  Show your district in Rwanda or province
                  in Burundi.
                </small>

              </div>

            </label>



            {/* COUNTRY */}

            <label
              className={
                locationVisibility === "country"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="locationVisibility"
                value="country"
                checked={
                  locationVisibility ===
                  "country"
                }
                onChange={() =>
                  setLocationVisibility(
                    "country"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  Country Only
                </strong>

                <small>
                  Show only your country to other members.
                </small>

              </div>

            </label>



            {/* HIDDEN */}

            <label
              className={
                locationVisibility === "hidden"
                  ? "privacy-option selected"
                  : "privacy-option"
              }
            >

              <input
                type="radio"
                name="locationVisibility"
                value="hidden"
                checked={
                  locationVisibility ===
                  "hidden"
                }
                onChange={() =>
                  setLocationVisibility(
                    "hidden"
                  )
                }
              />


              <span className="privacy-radio"></span>


              <div>

                <strong>
                  Hide Location
                </strong>

                <small>
                  Do not show your location publicly on
                  your profile.
                </small>

              </div>

            </label>


          </div>

        </section>



        {/* =================================================
            MESSAGES & LIKES
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiMessageCircle />

            </div>


            <div>

              <h2>
                Messages & Interactions
              </h2>

              <p>
                Decide who can contact and interact with you.
              </p>

            </div>


          </div>



          {/* MESSAGES */}

          <div className="privacy-select-row">


            <div className="privacy-select-info">


              <div className="privacy-small-icon">

                <FiMessageCircle />

              </div>


              <div>

                <h3>
                  Who can message me?
                </h3>

                <p>
                  Control who can start a conversation with you.
                </p>

              </div>


            </div>


            <select
              value={allowMessagesFrom}
              onChange={(event) =>
                setAllowMessagesFrom(
                  event.target.value
                )
              }
              disabled={saving}
            >

              <option value="everyone">
                Everyone
              </option>

              <option value="matches">
                Matches Only
              </option>

              <option value="nobody">
                Nobody
              </option>

            </select>

          </div>



          {/* LIKES */}

          <div className="privacy-select-row">


            <div className="privacy-select-info">


              <div className="privacy-small-icon">

                <FiHeart />

              </div>


              <div>

                <h3>
                  Who can like me?
                </h3>

                <p>
                  Choose who can send you likes.
                </p>

              </div>


            </div>


            <select
              value={allowLikesFrom}
              onChange={(event) =>
                setAllowLikesFrom(
                  event.target.value
                )
              }
              disabled={saving}
            >

              <option value="everyone">
                Everyone
              </option>

              <option value="preferences">
                People Matching My Preferences
              </option>

              <option value="nobody">
                Nobody
              </option>

            </select>

          </div>


        </section>



        {/* =================================================
            ONLINE ACTIVITY
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiWifi />

            </div>


            <div>

              <h2>
                Online Activity
              </h2>

              <p>
                Control what other members can see about
                your activity.
              </p>

            </div>


          </div>



          <Toggle
            checked={showOnlineStatus}
            onChange={setShowOnlineStatus}
            label="Show Online Status"
            description="Let other members know when you are currently online."
            icon={<FiWifi />}
          />


          <div className="privacy-divider"></div>


          <Toggle
            checked={showLastActive}
            onChange={setShowLastActive}
            label="Show Last Active"
            description="Allow other members to see when you were last active."
            icon={<FiClock />}
          />


        </section>



        {/* =================================================
            MESSAGES PRIVACY
        ================================================= */}

        <section className="privacy-card">


          <div className="privacy-card-header">


            <div className="privacy-card-icon">

              <FiMessageCircle />

            </div>


            <div>

              <h2>
                Message Privacy
              </h2>

              <p>
                Manage how your conversations appear to you
                and other members.
              </p>

            </div>


          </div>



          <Toggle
            checked={readReceipts}
            onChange={setReadReceipts}
            label="Read Receipts"
            description="Let people know when you have read their messages."
            icon={<FiCheck />}
          />


        </section>



        {/* =================================================
            PRIVACY INFORMATION
        ================================================= */}

        <section className="privacy-info-card">


          <div className="privacy-info-icon">

            <FiShield />

          </div>


          <div>

            <h3>
              Your privacy matters
            </h3>


            <p>
              KUNDWA is designed to help you build meaningful
              connections while giving you control over your
              personal information.
            </p>


            <ul>

              <li>
                Your exact home address is never displayed.
              </li>

              <li>
                You can change your privacy preferences at any time.
              </li>

              <li>
                Privacy settings apply to your KUNDWA profile.
              </li>

              <li>
                Some features may depend on your privacy choices.
              </li>

            </ul>

          </div>


        </section>



        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <div className="privacy-save-container">


          <button
            type="button"
            className="privacy-save-btn"
            onClick={handleSave}
            disabled={saving}
          >

            {saving ? (

              <>
                Saving...
              </>

            ) : (

              <>
                <FiSave />
                Save Privacy Settings
              </>

            )}

          </button>


        </div>



        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="privacy-footer">


          <div className="privacy-footer-heart">
            ❤️
          </div>


          <strong>
            KUNDWA
          </strong>


          <p>
            Meaningful connections. Genuine people.
          </p>


          <small>
            Your privacy and safety matter to us.
          </small>


        </footer>


      </main>

    </div>
  );
}


export default Privacy;
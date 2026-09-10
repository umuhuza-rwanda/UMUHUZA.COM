import "./NotificationSettings.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiBell,
  FiHeart,
  FiUsers,
  FiMessageCircle,
  FiEye,
  FiStar,
  FiInfo,
  FiMail,
  FiMoon,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";


// =====================================================
// DEFAULT NOTIFICATION SETTINGS
// =====================================================

const DEFAULT_NOTIFICATIONS = {
  newInterest: true,
  newConnection: true,
  newMessages: true,
  profileViews: false,
  newMatches: true,
  generalUpdates: true,
  emailNotifications: false,
  quietHours: false,
};


// =====================================================
// COMPONENT
// =====================================================

function NotificationSettings() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
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
  // NOTIFICATION SETTINGS
  // =====================================================

  const [notifications, setNotifications] =
    useState(DEFAULT_NOTIFICATIONS);


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {

    let mounted = true;


    const loadUser = async () => {

      try {

        const {
          data,
          error: userError,
        } = await supabase.auth.getUser();


        if (userError) {
          throw userError;
        }


        if (!mounted) {
          return;
        }


        setCurrentUser(
          data?.user || null
        );


      } catch (authError) {

        console.error(
          "Notification settings auth error:",
          authError
        );


        if (mounted) {

          setCurrentUser(null);
          setError(
            "Unable to verify your session."
          );

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    loadUser();


    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (!mounted) {
            return;
          }


          setCurrentUser(
            session?.user || null
          );

        }
      );


    return () => {

      mounted = false;

      authListener?.subscription?.unsubscribe();

    };

  }, []);


  // =====================================================
  // LOAD NOTIFICATION SETTINGS
  // =====================================================

  useEffect(() => {

    if (!currentUser?.id) {
      return;
    }


    let active = true;


    const loadNotificationSettings =
      async () => {

        setLoading(true);
        setError("");


        try {

          const {
            data,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("notifications")
            .eq(
              "id",
              currentUser.id
            )
            .maybeSingle();


          if (profileError) {
            throw profileError;
          }


          if (!active) {
            return;
          }


          const storedNotifications =
            data?.notifications;


          if (
            storedNotifications &&
            typeof storedNotifications === "object" &&
            !Array.isArray(storedNotifications)
          ) {

            setNotifications({
              ...DEFAULT_NOTIFICATIONS,
              ...storedNotifications,
            });

          } else {

            setNotifications(
              DEFAULT_NOTIFICATIONS
            );

          }


        } catch (loadError) {

          console.error(
            "Error loading notification settings:",
            loadError
          );


          if (active) {

            setError(
              "We couldn't load your notification settings. Please try again."
            );

          }

        } finally {

          if (active) {
            setLoading(false);
          }

        }

      };


    loadNotificationSettings();


    // ===================================================
    // REALTIME PROFILE LISTENER
    // ===================================================

    const channel = supabase
      .channel(
        `notification-settings-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${currentUser.id}`,
        },
        (payload) => {

          const updatedNotifications =
            payload.new?.notifications;


          if (
            updatedNotifications &&
            typeof updatedNotifications === "object" &&
            !Array.isArray(updatedNotifications)
          ) {

            setNotifications({
              ...DEFAULT_NOTIFICATIONS,
              ...updatedNotifications,
            });

          }

        }
      )
      .subscribe((status) => {

        console.log(
          "🔔 Notification settings realtime:",
          status
        );

      });


    return () => {

      active = false;

      supabase.removeChannel(channel);

    };

  }, [currentUser?.id]);


  // =====================================================
  // CHANGE SETTING
  // =====================================================

  const handleToggle = async (
    settingName
  ) => {

    if (
      !currentUser ||
      saving
    ) {
      return;
    }


    const previousNotifications =
      notifications;


    const newValue =
      !notifications[settingName];


    const updatedNotifications = {

      ...notifications,

      [settingName]:
        newValue,

    };


    // Update UI immediately

    setNotifications(
      updatedNotifications
    );


    setSaving(true);
    setSaved(false);
    setError("");


    try {

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          notifications:
            updatedNotifications,

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


      setSaved(true);


      setTimeout(() => {

        setSaved(false);

      }, 2500);


    } catch (saveError) {

      console.error(
        "Error saving notification setting:",
        saveError
      );


      // Restore previous value

      setNotifications(
        previousNotifications
      );


      setError(
        "We couldn't save this setting. Please try again."
      );


    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (
    !currentUser &&
    !loading
  ) {

    return (

      <div className="notification-page">

        <div className="notification-empty-card">

          <div className="notification-empty-icon">

            <FiBell />

          </div>


          <h2>
            Please log in
          </h2>


          <p>
            You need to be logged in to manage
            your UMUHUZA notification settings.
          </p>


          <button
            type="button"
            className="notification-primary-btn"
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

      <div className="notification-page">

        <div className="notification-loading-card">

          <div className="notification-loading-icon">

            <FiBell />

          </div>


          <h2>
            Loading Notifications...
          </h2>


          <p>
            We're preparing your notification settings.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="notification-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="notification-header">

        <button
          type="button"
          className="notification-back-btn"
          onClick={() =>
            navigate("/profile")
          }
        >

          <FiArrowLeft />

          <span>
            Back to Profile
          </span>

        </button>


        <div className="notification-brand">

          ❤️ UMUHUZA

        </div>


        <div className="notification-header-title">

          <FiBell />

          <span>
            Notifications
          </span>

        </div>

      </header>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="notification-error">

          {error}

        </div>

      )}


      {/* =================================================
          SAVED MESSAGE
      ================================================= */}

      {saved && (

        <div className="notification-saved">

          <FiCheckCircle />

          Notification preferences saved

        </div>

      )}


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="notification-main">


        {/* =================================================
            INTRO CARD
        ================================================= */}

        <section className="notification-intro-card">

          <div className="notification-intro-icon">

            <FiBell />

          </div>


          <div>

            <span className="notification-eyebrow">
              NOTIFICATION SETTINGS
            </span>


            <h1>
              Stay Connected
            </h1>


            <p>
              Choose the notifications you want to
              receive from UMUHUZA. You can change
              these settings anytime.
            </p>

          </div>

        </section>


        {/* =================================================
            CONNECTION NOTIFICATIONS
        ================================================= */}

        <section className="notification-section">

          <div className="notification-section-heading">

            <div>

              <span>
                CONNECTIONS
              </span>


              <h2>
                Connection Activity
              </h2>


              <p>
                Stay informed when people interact
                with your profile.
              </p>

            </div>

          </div>


          <div className="notification-list">


            {/* NEW INTEREST */}

            <NotificationRow

              icon={<FiHeart />}

              iconClass="interest"

              title="New Interest"

              description="Notify me when someone sends me interest."

              checked={
                notifications.newInterest
              }

              onChange={() =>
                handleToggle(
                  "newInterest"
                )
              }

            />


            {/* NEW CONNECTION */}

            <NotificationRow

              icon={<FiUsers />}

              iconClass="connection"

              title="New Connection"

              description="Notify me when I become connected with someone."

              checked={
                notifications.newConnection
              }

              onChange={() =>
                handleToggle(
                  "newConnection"
                )
              }

            />


            {/* NEW MATCH */}

            <NotificationRow

              icon={<FiStar />}

              iconClass="match"

              title="New Matches"

              description="Let me know when UMUHUZA finds a potential match."

              checked={
                notifications.newMatches
              }

              onChange={() =>
                handleToggle(
                  "newMatches"
                )
              }

            />


            {/* PROFILE VIEWS */}

            <NotificationRow

              icon={<FiEye />}

              iconClass="views"

              title="Profile Views"

              description="Notify me when someone views my profile."

              checked={
                notifications.profileViews
              }

              onChange={() =>
                handleToggle(
                  "profileViews"
                )
              }

            />

          </div>

        </section>


        {/* =================================================
            COMMUNICATION
        ================================================= */}

        <section className="notification-section">

          <div className="notification-section-heading">

            <div>

              <span>
                COMMUNICATION
              </span>


              <h2>
                Messages & Updates
              </h2>


              <p>
                Choose how UMUHUZA keeps you informed.
              </p>

            </div>

          </div>


          <div className="notification-list">


            {/* MESSAGES */}

            <NotificationRow

              icon={<FiMessageCircle />}

              iconClass="messages"

              title="New Messages"

              description="Notify me when I receive a new message."

              checked={
                notifications.newMessages
              }

              onChange={() =>
                handleToggle(
                  "newMessages"
                )
              }

            />


            {/* GENERAL UPDATES */}

            <NotificationRow

              icon={<FiInfo />}

              iconClass="updates"

              title="UMUHUZA Updates"

              description="Receive important updates and announcements from UMUHUZA."

              checked={
                notifications.generalUpdates
              }

              onChange={() =>
                handleToggle(
                  "generalUpdates"
                )
              }

            />


            {/* EMAIL */}

            <NotificationRow

              icon={<FiMail />}

              iconClass="email"

              title="Email Notifications"

              description="Receive selected UMUHUZA notifications by email."

              checked={
                notifications.emailNotifications
              }

              onChange={() =>
                handleToggle(
                  "emailNotifications"
                )
              }

            />

          </div>

        </section>


        {/* =================================================
            QUIET HOURS
        ================================================= */}

        <section className="notification-section">

          <div className="notification-section-heading">

            <div>

              <span>
                YOUR TIME
              </span>


              <h2>
                Quiet Hours
              </h2>


              <p>
                Take a break from notifications when
                you don't want to be disturbed.
              </p>

            </div>

          </div>


          <div className="notification-list">

            <NotificationRow

              icon={<FiMoon />}

              iconClass="quiet"

              title="Quiet Hours"

              description="Temporarily pause UMUHUZA notifications during your quiet time."

              checked={
                notifications.quietHours
              }

              onChange={() =>
                handleToggle(
                  "quietHours"
                )
              }

            />

          </div>

        </section>


        {/* =================================================
            SAVING STATUS
        ================================================= */}

        {saving && (

          <div className="notification-saving">

            <FiLoader />

            Saving your preferences...

          </div>

        )}


        {/* =================================================
            INFORMATION CARD
        ================================================= */}

        <section className="notification-info-card">

          <div className="notification-info-icon">

            <FiCheckCircle />

          </div>


          <div>

            <strong>
              You're in control
            </strong>


            <p>
              Your notification preferences are saved
              securely to your UMUHUZA account. You can
              update them whenever you want.
            </p>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="notification-footer">

          <div className="notification-footer-heart">
            ❤️
          </div>


          <strong>
            UMUHUZA
          </strong>


          <p>
            Meaningful connections. Genuine people.
          </p>


          <small>
            Your privacy and experience matter to us.
          </small>

        </footer>


      </main>

    </div>

  );

}


// =====================================================
// NOTIFICATION ROW COMPONENT
// =====================================================

function NotificationRow({

  icon,

  iconClass,

  title,

  description,

  checked,

  onChange,

}) {

  return (

    <div className="notification-row">


      <div
        className={`notification-icon ${iconClass}`}
      >

        {icon}

      </div>


      <div className="notification-content">

        <h3>
          {title}
        </h3>


        <p>
          {description}
        </p>

      </div>


      <label className="notification-switch">

        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />


        <span className="notification-slider"></span>

      </label>

    </div>

  );

}


export default NotificationSettings;
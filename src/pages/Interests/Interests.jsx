import "./Interests.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  useAppPreferences,
} from "../../context/AppPreferencesContext";

import {
  FiArrowLeft,
  FiHeart,
  FiCheck,
  FiX,
  FiUser,
  FiUsers,
  FiMessageCircle,
  FiMapPin,
  FiClock,
  FiMail,
  FiRefreshCw,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";


// =====================================================
// INTERESTS / CONNECTIONS PAGE
// SUPABASE VERSION
// =====================================================

function Interests() {

  const navigate = useNavigate();

  const { t } = useAppPreferences();


  // =====================================================
  // CURRENT USER
  // =====================================================

  const [currentUser, setCurrentUser] =
    useState(null);


  // =====================================================
  // EMAIL VERIFICATION
  // =====================================================

  const [emailVerified, setEmailVerified] =
    useState(false);

  const [verificationLoading, setVerificationLoading] =
    useState(false);

  const [verificationMessage, setVerificationMessage] =
    useState("");


  // =====================================================
  // INTERESTS
  // =====================================================

  const [interests, setInterests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // CONNECTIONS
  // =====================================================

  const [connections, setConnections] =
    useState([]);

  const [connectionsLoading, setConnectionsLoading] =
    useState(true);


  // =====================================================
  // PROCESSING
  // =====================================================

  const [processingId, setProcessingId] =
    useState(null);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] =
    useState("");


  // =====================================================
  // GET CURRENT SUPABASE USER
  // =====================================================

  useEffect(() => {

    let active = true;


    const loadCurrentUser = async () => {

      const {
        data,
        error: authError,
      } =
        await supabase.auth.getUser();


      if (!active) {
        return;
      }


      if (authError) {

        console.error(
          "Supabase auth error:",
          authError
        );

        setCurrentUser(null);

        setLoading(false);

        setConnectionsLoading(false);

        return;
      }


      const user =
        data?.user || null;


      setCurrentUser(user);


      // -----------------------------------------------
      // SUPABASE EMAIL VERIFICATION
      // -----------------------------------------------

      setEmailVerified(
        Boolean(
          user?.email_confirmed_at
        )
      );


      setLoading(false);

    };


    loadCurrentUser();


    // =================================================
    // AUTH STATE CHANGES
    // =================================================

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (!active) {
            return;
          }


          const user =
            session?.user || null;


          setCurrentUser(user);


          setEmailVerified(
            Boolean(
              user?.email_confirmed_at
            )
          );

        }
      );


    return () => {

      active = false;

      authListener?.subscription?.unsubscribe();

    };

  }, []);


  // =====================================================
  // REFRESH SUPABASE USER
  // =====================================================

  const refreshCurrentUser =
    async () => {

      try {

        const {
          data,
          error: authError,
        } =
          await supabase.auth.getUser();


        if (authError) {
          throw authError;
        }


        const user =
          data?.user || null;


        setCurrentUser(user);


        setEmailVerified(
          Boolean(
            user?.email_confirmed_at
          )
        );


        return user;

      } catch (authError) {

        console.error(
          "Supabase user refresh error:",
          authError
        );

        return null;
      }
    };


  // =====================================================
  // RESEND VERIFICATION EMAIL
  // =====================================================

  const handleResendVerification =
    async () => {

      if (!currentUser?.email) {

setVerificationMessage(
  t("verification.loginAgain")
);

        return;
      }


      try {

        setVerificationLoading(true);

        setVerificationMessage("");

        setError("");


        const {
          error: resendError,
        } =
          await supabase.auth.resend({
            type: "signup",
            email: currentUser.email,
          });


        if (resendError) {
          throw resendError;
        }


setVerificationMessage(
  t("verification.emailSent")
);

      } catch (supabaseError) {

        console.error(
          "Verification email error:",
          supabaseError
        );


        setVerificationMessage(
          t("verification.emailSent")
        );

      } finally {

        setVerificationLoading(false);

      }

    };


  // =====================================================
  // CHECK EMAIL VERIFICATION
  // =====================================================

  const handleCheckVerification =
    async () => {

      try {

        setVerificationLoading(true);

        setVerificationMessage("");

        setError("");


        const user =
          await refreshCurrentUser();


        if (!user) {
          return;
        }


        if (
          user.email_confirmed_at
        ) {

          setEmailVerified(true);


          setVerificationMessage(
            t("verification.emailVerified")
          );

        } else {

          setEmailVerified(false);


setVerificationMessage(
  t("verification.notVerified")
);

        }

      } catch (supabaseError) {

        console.error(
          "Verification check error:",
          supabaseError
        );


        setVerificationMessage(
          t("verification.unableToCheck")
        );

      } finally {

        setVerificationLoading(false);

      }

    };


  // =====================================================
  // LOAD INCOMING PENDING INTERESTS
  // =====================================================

  useEffect(() => {

    if (!currentUser) {

      setInterests([]);

      setLoading(false);

      return undefined;
    }


    let active = true;


    setLoading(true);

    setError("");


    const loadInterests =
      async () => {

        try {

          const {
            data,
            error: interestsError,
          } =
            await supabase
              .from("interests")
              .select("*")
              .eq(
                "receiverId",
                currentUser.id
              )
              .eq(
                "status",
                "pending"
              )
              .order(
                "createdAt",
                {
                  ascending: false,
                }
              );


          if (!active) {
            return;
          }


          if (interestsError) {
            throw interestsError;
          }


          setInterests(
            data || []
          );


        } catch (supabaseError) {

          console.error(
            "Error loading interests:",
            supabaseError
          );


          if (
            supabaseError?.code ===
            "PGRST205"
          ) {

            setError(
              t("interests.tableNotFound")
            );

          } else {

            setError(
              t("interests.unableToLoad")
            );

          }


          setInterests([]);

        } finally {

          if (active) {
            setLoading(false);
          }

        }

      };


    loadInterests();


    // =================================================
    // REALTIME INTERESTS
    // =================================================

    const channel =
      supabase
        .channel(
          `interests-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "interests",
          },
          (payload) => {

            const changedInterest =
              payload.new;


            // Only reload when this user's
            // incoming interest may have changed.

            if (
              !changedInterest ||
              changedInterest.receiverId ===
                currentUser.id
            ) {

              loadInterests();

            }

          }
        )
        .subscribe();


    return () => {

      active = false;

      supabase.removeChannel(
        channel
      );

    };

  }, [
    currentUser,
    t,
  ]);


  // =====================================================
  // LOAD CONNECTIONS
  // =====================================================

  useEffect(() => {

    if (!currentUser) {

      setConnections([]);

      setConnectionsLoading(false);

      return undefined;
    }


    let active = true;


    setConnectionsLoading(true);

    setError("");


const loadConnections = async () => {
  try {
    console.log(
      "🤝 Loading connections for:",
      currentUser.id
    );

    const {
      data: connectionRecords,
      error: connectionsError,
    } = await supabase
      .from("connections")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("status", "connected")
      .order("updated_at", {
        ascending: false,
      });

    if (!active) {
      return;
    }

    if (connectionsError) {
      throw connectionsError;
    }

    const records = connectionRecords || [];

    console.log(
      "🤝 CONNECTION RECORDS:",
      records
    );

    if (records.length === 0) {
      setConnections([]);
      return;
    }

    // Get the IDs of the people connected to current user
    const otherUserIds = records
      .map(
        (connection) =>
          connection.connected_user_id
      )
      .filter(Boolean);

    let profiles = [];

    if (otherUserIds.length > 0) {
      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .in("id", otherUserIds);

      if (profileError) {
        throw profileError;
      }

      profiles = profileData || [];
    }

    const profileMap = new Map(
      profiles.map((profile) => [
        profile.id,
        profile,
      ])
    );

    const finalConnections = records.map(
      (connection) => ({
        ...connection,

        userId:
          connection.connected_user_id,

        profile:
          profileMap.get(
            connection.connected_user_id
          ) || {},
      })
    );

    console.log(
      "🤝 FINAL CONNECTIONS:",
      finalConnections
    );

    setConnections(finalConnections);

  } catch (supabaseError) {

    console.error(
      "❌ Error loading connections:",
      supabaseError
    );

    setConnections([]);

    setError(
      supabaseError?.message ||
      "Unable to load connections."
    );

  } finally {

    if (active) {
      setConnectionsLoading(false);
    }

  }
};

    loadConnections();


    // =================================================
    // REALTIME CONNECTIONS
    // =================================================

    const channel =
      supabase
        .channel(
          `connections-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "connections",
          },
          () => {

            loadConnections();

          }
        )
        .subscribe();


    return () => {

      active = false;

      supabase.removeChannel(
        channel
      );

    };

  }, [
    currentUser,
    t,
  ]);


const handleAccept = async (interest) => {
  if (!currentUser || !interest?.id) {
    return;
  }

  try {
    setProcessingId(interest.id);
    setError("");

    const senderId = interest.senderId;

    if (!senderId) {
      throw new Error(
        "This interest does not have a senderId."
      );
    }

    if (senderId === currentUser.id) {
      throw new Error(
        "You cannot accept your own interest."
      );
    }

    const now = new Date().toISOString();

    console.log("🤝 ACCEPTING INTEREST", {
      interestId: interest.id,
      senderId,
      receiverId: currentUser.id,
    });

    // =====================================================
    // STEP 1 — ACCEPT THE INTEREST
    // =====================================================

    const {
      data: updatedInterest,
      error: interestError,
    } = await supabase
      .from("interests")
      .update({
        status: "accepted",
        respondedAt: now,
      })
      .eq("id", interest.id)
      .eq("receiverId", currentUser.id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();

    console.log(
      "🤝 INTEREST UPDATE:",
      {
        updatedInterest,
        interestError,
      }
    );

    if (interestError) {
      throw interestError;
    }

    if (!updatedInterest) {
      throw new Error(
        "The interest could not be accepted. It may already have been responded to."
      );
    }

    // =====================================================
    // STEP 2 — CREATE CONNECTION FOR CURRENT USER
    // =====================================================

    const {
      data: myExistingConnection,
      error: myConnectionLookupError,
    } = await supabase
      .from("connections")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("connected_user_id", senderId)
      .limit(1)
      .maybeSingle();

    if (myConnectionLookupError) {
      throw myConnectionLookupError;
    }

    if (myExistingConnection) {

      const {
        error: updateMyConnectionError,
      } = await supabase
        .from("connections")
        .update({
          status: "connected",
          updated_at: now,
        })
        .eq(
          "id",
          myExistingConnection.id
        );

      if (updateMyConnectionError) {
        throw updateMyConnectionError;
      }

    } else {

      const {
        error: insertMyConnectionError,
      } = await supabase
        .from("connections")
        .insert({
          user_id: currentUser.id,
          connected_user_id: senderId,
          status: "connected",
          created_at: now,
          updated_at: now,
        });

      if (insertMyConnectionError) {
        throw insertMyConnectionError;
      }
    }



    // =====================================================
    // STEP 4 — FIND EXISTING CONVERSATION
    // =====================================================

    const {
      data: existingConversation,
      error: conversationLookupError,
    } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(participant_one.eq.${currentUser.id},participant_two.eq.${senderId}),and(participant_one.eq.${senderId},participant_two.eq.${currentUser.id})`
      )
      .limit(1)
      .maybeSingle();

    if (conversationLookupError) {
      throw conversationLookupError;
    }

    let conversation =
      existingConversation;

    // =====================================================
    // STEP 5 — CREATE CONVERSATION IF NEEDED
    // =====================================================

    if (!conversation) {

      const {
        data: newConversation,
        error: conversationInsertError,
      } = await supabase
        .from("conversations")
        .insert({
          participant_one:
            currentUser.id,

          participant_two:
            senderId,
        })
        .select("*")
        .single();

      console.log(
        "💬 NEW CONVERSATION:",
        {
          newConversation,
          conversationInsertError,
        }
      );

      if (conversationInsertError) {
        throw conversationInsertError;
      }

      conversation =
        newConversation;
    }

    console.log(
      "💬 CONVERSATION READY:",
      conversation
    );

    // =====================================================
    // STEP 6 — SAVE CONVERSATION ID TO INTEREST
    // =====================================================

    const {
      error: connectionIdError,
    } = await supabase
      .from("interests")
      .update({
        connectionId:
          conversation.id,
      })
      .eq(
        "id",
        interest.id
      );

    if (connectionIdError) {
      console.warn(
        "⚠️ Could not save conversation ID:",
        connectionIdError
      );
    }

    // =====================================================
    // STEP 7 — REMOVE FROM PENDING
    // =====================================================

    setInterests(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== interest.id
        )
    );

    // =====================================================
    // STEP 8 — REFRESH CONNECTIONS
    // =====================================================

    await loadConnectionsAfterAccept();

    console.log(
      "✅ INTEREST ACCEPTED SUCCESSFULLY"
    );

  } catch (supabaseError) {

    console.error(
      "❌ ACCEPT INTEREST ERROR:",
      supabaseError
    );

    setError(
      supabaseError?.message ||
      "Unable to accept interest."
    );

  } finally {

    setProcessingId(null);

  }
};

  // =====================================================
  // RELOAD CONNECTIONS AFTER ACCEPT
  // =====================================================


const loadConnectionsAfterAccept = async () => {
  if (!currentUser?.id) {
    return;
  }

  try {
    console.log(
      "🤝 Refreshing connections after accept..."
    );

    const {
      data: connectionRecords,
      error: connectionsError,
    } = await supabase
      .from("connections")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("status", "connected")
      .order("updated_at", {
        ascending: false,
      });

    if (connectionsError) {
      throw connectionsError;
    }

    const records = connectionRecords || [];

    if (records.length === 0) {
      setConnections([]);
      return;
    }

    const otherUserIds = records
      .map(
        (connection) =>
          connection.connected_user_id
      )
      .filter(Boolean);

    let profiles = [];

    if (otherUserIds.length > 0) {
      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .in("id", otherUserIds);

      if (profileError) {
        throw profileError;
      }

      profiles = profileData || [];
    }

    const profileMap = new Map(
      profiles.map((profile) => [
        profile.id,
        profile,
      ])
    );

    const finalConnections = records.map(
      (connection) => ({
        ...connection,

        userId:
          connection.connected_user_id,

        profile:
          profileMap.get(
            connection.connected_user_id
          ) || {},
      })
    );

    setConnections(finalConnections);

    console.log(
      "✅ Connections refreshed:",
      finalConnections
    );

  } catch (supabaseError) {

    console.error(
      "❌ Error refreshing connections:",
      supabaseError
    );

    setError(
      supabaseError?.message ||
      "Unable to refresh connections."
    );

  }
};



  // =====================================================
  // DECLINE INTEREST
  // =====================================================

  const handleDecline =
    async (interest) => {

      if (!interest) {
        return;
      }


      try {

        setProcessingId(
          interest.id
        );

        setError("");


        const now =
          new Date().toISOString();


        const {
          error: interestError,
        } =
          await supabase
            .from("interests")
            .update(
              {
                status:
                  "declined",

                respondedAt:
                  now,
              }
            )
            .eq(
              "id",
              interest.id
            );


        if (interestError) {
          throw interestError;
        }


        setInterests(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                interest.id
            )
        );


      } catch (supabaseError) {

        console.error(
          "Error declining interest:",
          supabaseError
        );


        setError(
          "Unable to decline interest."
        );

      } finally {

        setProcessingId(null);

      }

    };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate =
    (timestamp) => {

      if (!timestamp) {
        return "";
      }


      try {

        const date =
          timestamp instanceof Date
            ? timestamp
            : new Date(timestamp);


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return "";
        }


        return date.toLocaleDateString(
          undefined,
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

      } catch {

        return "";

      }

    };


  // =====================================================
  // GET CONNECTION PROFILE
  // =====================================================

  const getConnectionProfile =
    (connection) => {

      return (
        connection?.profile ||
        {}
      );

    };


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser) {

    return (

      <div className="interests-page">

        <div className="interests-empty-card">

          <div className="interests-empty-icon">
            ❤️
          </div>


          <h2>
            {t("connections.pleaseLogin")}
          </h2>


          <p>
            {t("connections.loginToView")}
          </p>


          <button
            type="button"
            className="interests-primary-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            {t("chat.goToLogin")}
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    connectionsLoading
  ) {

    return (

      <div className="interests-page">

        <div className="interests-empty-card">

          <div className="interests-empty-icon">
            💕
          </div>


          <h2>
            {t("connections.loading")}
          </h2>


          <p>
            {t(
              "connections.preparing"
            )}
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="interests-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="interests-header">


        <button
          type="button"
          className="interests-back-btn"
          onClick={() =>
            navigate(
              "/member-home"
            )
          }
        >

          <FiArrowLeft />

          <span>
            {t("common.back")}
          </span>

        </button>


        <div className="interests-logo">

          <div className="profile-logo">

            <img
              src={umurangaLogo}
              alt="UMURANGA.COM"
            />

          </div>

        </div>


        <div className="interests-header-title">

          <FiUsers />

          <span>
            {t("connections.title")}
          </span>

        </div>

      </header>


      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="interests-main">


        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="connections-page-heading">

          <div>

            <span className="interests-label">
              💕 {t("connections.label")}
            </span>


            <h1>
              {t("connections.heading")}
            </h1>


            <p>
              {t(
                "connections.description"
              )}
            </p>

          </div>


          <div className="connections-total-card">

            <strong>
              {connections.length}
            </strong>


            <span>
              {t("connections.total")}
            </span>

          </div>

        </section>


        {/* =================================================
            EMAIL VERIFICATION
        ================================================= */}

        {!emailVerified && (

          <div
            className="email-verification-overlay"
            role="dialog"
            aria-modal="true"
          >

            <div className="email-verification-modal">


              <button
                type="button"
                className="email-verification-close"
                onClick={() =>
                  navigate(
                    "/member-home"
                  )
                }
                aria-label={t("verification.close")}
              >

                <FiX />

              </button>


              <div className="email-verification-icon">

                <FiMail />

              </div>


              <h2>
                 {t("verification.title")}
              </h2>


<p className="email-verification-lead">
  {t("verification.lead")}
</p>


              <div className="email-verification-address">

                <FiMail />

                <span>
                  {currentUser?.email || ""}
                </span>

              </div>


<p className="email-verification-help">
  {t("verification.help")}
</p>


              {verificationMessage && (

                <div className="verification-message">

                  {verificationMessage}

                </div>

              )}


              <div className="email-verification-actions">


                <button
                  type="button"
                  className="send-verification-btn"
                  onClick={
                    handleResendVerification
                  }
                  disabled={
                    verificationLoading
                  }
                >

                  <FiMail />

{verificationLoading
  ? t("verification.pleaseWait")
  : t("verification.sendEmail")}

                </button>


                <button
                  type="button"
                  className="check-verification-btn"
                  onClick={
                    handleCheckVerification
                  }
                  disabled={
                    verificationLoading
                  }
                >

                  <FiCheck />

                  <FiCheck />

{t("verification.check")}

                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="chat-error">

            {error}

          </div>

        )}


        {/* =================================================
            TWO COLUMN LAYOUT
        ================================================= */}

        <div className="connections-layout">


          {/* =================================================
              LEFT COLUMN — CONNECTIONS
          ================================================= */}

          <section className="connections-column">


            <div className="column-header">

              <div className="column-title">

                <div className="column-icon connections-icon">

                  <FiUsers />

                </div>


                <div>

                  <h2>
                    {t("connections.yourConnections")}
                  </h2>


                  <p>
                    {t("connections.peopleConnected")}
                  </p>

                </div>

              </div>


              <span className="column-count">

                {connections.length}

              </span>

            </div>


            {/* =================================================
                CONNECTIONS
            ================================================= */}

            {connectionsLoading ? (

              <div className="column-loading">

                <div className="loading-circle">
                  💕
                </div>


                <p>
                  {t("connections.loadingConnections")}
                </p>

              </div>

            ) : connections.length === 0 ? (

              <div className="connections-empty">

                <div className="connections-empty-icon">
                  🤝
                </div>


                <h3>
                  {t("connections.noConnections")}
                </h3>


                <p>
                  {t("connections.newConnection")}
                </p>


                <button
                  type="button"
                  className="interests-primary-btn"
                  onClick={() =>
                    navigate(
                      "/member-home"
                    )
                  }
                >

                  {t("connections.discoverPeople")}

                </button>

              </div>

            ) : (

              <div className="connections-list">

                {connections.map(
                  (connection) => {

                    const profile =
                      getConnectionProfile(
                        connection
                      );


                    const memberName =
                      profile.firstName ||
                      profile.first_name ||
                      profile.full_name ||
                      profile.name ||
                      "UMUHUZA Member";


                    const memberImage =
                      profile.profilePhoto ||
                      profile.profile_photo_url ||
                      profile.profile_photo ||
                      profile.photoURL ||
                      profile.photo_url ||
                      profile.image ||
                      profile.avatar ||
                      "";


                    const memberCity =
                      profile.city ||
                      "";


                    const memberCountry =
                      profile.country ||
                      "";


                    const connectedDate =
                      formatDate(
                        connection.connectedAt
                      );


                    return (

                      <article
                        className="connection-card"
                        key={
                          connection.id
                        }
                      >


                        <div className="connection-photo">

                          {memberImage ? (

                            <img
                              src={
                                memberImage
                              }
                              alt={
                                memberName
                              }
                            />

                          ) : (

                            <div className="connection-photo-placeholder">

                              <FiUser />

                            </div>

                          )}


                          {profile.online && (

                            <span className="connection-online-dot" />

                          )}

                        </div>


                        <div className="connection-info">


                          <div className="connection-name-row">

                            <h3>
                              {memberName}
                            </h3>


                            <span className="connected-badge">

                              🤝 {t("home.connected")}

                            </span>

                          </div>


                          {(memberCity ||
                            memberCountry) && (

                            <p className="connection-location">

                              <FiMapPin />

                              <span>

                                {memberCity}

                                {memberCity &&
                                  memberCountry
                                  ? ", "
                                  : ""}

                                {memberCountry}

                              </span>

                            </p>

                          )}


                          {profile.lookingFor && (

                            <p className="connection-looking-for">

                              ❤️ {t("connections.lookingFor")}:{" "}

                              {profile.lookingFor}

                            </p>

                          )}


                          {connectedDate && (

                            <p className="connection-date">

                              <FiClock />

                              {t("connected")}{" "}

                              {connectedDate}

                            </p>

                          )}


                          <div className="connection-actions">


<button
  type="button"
  className="connection-profile-btn"
  onClick={() => {
    const memberId =
      connection.userId ||
      connection.connected_user_id;

    if (!memberId) {
      console.error(
        "VIEW PROFILE: Missing member ID",
        connection
      );
      return;
    }

    navigate(
      `/member-profile/${memberId}`,
      {
        state: {
          member: {
            id: memberId,
            ...profile,
          },
        },
      }
    );
  }}
>
  <FiUser />

  {t("home.viewProfile")}
</button>


                            <button
                              type="button"
                              className="connection-chat-btn"
                              onClick={() =>
                                navigate(
                                  "/chat",
                                  {
                                    state: {
                                      selectedUserId:
                                        connection.userId,
                                    },
                                  }
                                )
                              }
                            >

                              <FiMessageCircle />

                              {t("connections.startChat")}

                            </button>

                          </div>

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>


          {/* =================================================
              RIGHT COLUMN — PENDING INTERESTS
          ================================================= */}

          <aside className="pending-column">


            <div className="pending-card">


              <div className="pending-header">

                <div className="pending-title">

                  <div className="column-icon pending-icon">

                    <FiHeart />

                  </div>


                  <div>

                    <h2>
                      {t("connections.pendingInterests")}
                    </h2>


                    <p>
{t("connections.waitingResponse")}
                    </p>

                  </div>

                </div>


                <span className="pending-count">

                  {interests.length}

                </span>

              </div>


              {interests.length === 0 ? (

                <div className="pending-empty">

                  <div className="pending-empty-icon">
                    💕
                  </div>


                  <h3>
                    {t("connections.allCaughtUp")}
                  </h3>


                  <p>
                    {t("connections.noPendingInterests")}
                  </p>

                </div>

              ) : (

                <div className="pending-list">

                  {interests.map(
                    (interest) => {


                      const senderName =
                        interest.fromUserName ||
                        interest.senderName ||
                        interest.sender_name ||
                        "UMUHUZA Member";


                      const senderImage =
                        interest.fromUserPhoto ||
                        interest.senderPhoto ||
                        interest.profilePhoto ||
                        interest.profile_photo_url ||
                        interest.photoURL ||
                        interest.photo_url ||
                        "";


                      const processing =
                        processingId ===
                        interest.id;


                      return (

                        <article
                          className="pending-interest-card"
                          key={
                            interest.id
                          }
                        >


                          <div className="pending-photo">

                            {senderImage ? (

                              <img
                                src={
                                  senderImage
                                }
                                alt={
                                  senderName
                                }
                              />

                            ) : (

                              <div className="pending-photo-placeholder">

                                <FiUser />

                              </div>

                            )}

                          </div>


                          <div className="pending-info">


                            <div className="pending-name-row">

                              <h3>
                                {senderName}
                              </h3>


                              <span>
                                ❤️
                              </span>

                            </div>


                            {(interest.fromUserCity ||
                              interest.fromUserCountry) && (

                              <p className="pending-location">

                                <FiMapPin />

                                {interest.fromUserCity ||
                                  ""}

                                {interest.fromUserCity &&
                                  interest.fromUserCountry
                                  ? ", "
                                  : ""}

                                {interest.fromUserCountry ||
                                  ""}

                              </p>

                            )}


                            <p className="pending-message">

                      {t("connections.wouldLikeToKnow"
                              ).replace(
                                "{name}",
                                senderName
                              )}

                            </p>


                            {interest.createdAt && (

                              <small>

                               {t("connections.sent")} {" "}

                                {formatDate(
                                  interest.createdAt
                                )}

                              </small>

                            )}


                            <div className="pending-actions">


                              <button
                                type="button"
                                className="pending-accept-btn"
                                onClick={() =>
                                  handleAccept(
                                    interest
                                  )
                                }
                                disabled={
                                  processing
                                }
                              >

                                <FiCheck />

                                {processing
                                  ? "..."
                                  : t("connections.accept")}

                              </button>


                              <button
                                type="button"
                                className="pending-decline-btn"
                                onClick={() =>
                                  handleDecline(
                                    interest
                                  )
                                }
                                disabled={
                                  processing
                                }
                              >

                                <FiX />

                              </button>

                            </div>

                          </div>

                        </article>

                      );

                    }
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                DISCOVERY CARD
            ================================================= */}

            <div className="discover-more-card">


              <div className="discover-more-icon">
                💕
              </div>


              <h3>
                {t("connections.lookingFor")}
              </h3>


              <p>
                {t("connections.discoverMore")}
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/member-home"
                  )
                }
              >

                {t("connections.discoverPeople")}

              </button>

            </div>

          </aside>

        </div>

      </main>

    </div>

  );

}


export default Interests;
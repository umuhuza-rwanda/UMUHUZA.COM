import "./Notifications.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppPreferences } from "../../context/AppPreferencesContext";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiArrowLeft,
  FiBell,
  FiHeart,
  FiMessageCircle,
  FiCheck,
  FiUser,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function Notifications() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();

  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingInterest, setAcceptingInterest] = useState(null);

  // =====================================================
  // AUTH
  // =====================================================
  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setCurrentUser(session?.user ?? null);

        if (!session?.user) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Session error:", err);

        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setCurrentUser(session?.user ?? null);

      if (!session?.user) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================
  useEffect(() => {
    if (!currentUser?.id) return;

    let active = true;

    setLoading(true);
    setError("");

    const loadNotifications = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: false,
          });

        if (!active) return;

        if (fetchError) {
          console.error(
            "Notifications error:",
            fetchError
          );

          setError(
            "Unable to load your notifications."
          );

          setLoading(false);
          return;
        }

        const rows = data || [];

        // -------------------------------------------------
        // Get IDs of users connected to notifications
        // -------------------------------------------------
        const senderIds = [
          ...new Set(
            rows
              .map(
                (notification) =>
                  notification.related_user_id ||
                  notification.from_user_id ||
                  notification.fromUserId ||
                  null
              )
              .filter(Boolean)
          ),
        ];

        let profileMap = {};

        // -------------------------------------------------
        // Load sender profiles
        // -------------------------------------------------
        if (senderIds.length > 0) {
          const {
            data: profiles,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select(
              "id, full_name, username, profile_photo_url"
            )
            .in("id", senderIds);

          if (profileError) {
            console.warn(
              "Unable to load notification profiles:",
              profileError
            );
          } else {
            profileMap = (profiles || []).reduce(
              (result, profile) => {
                result[profile.id] = profile;
                return result;
              },
              {}
            );
          }
        }

        // -------------------------------------------------
        // Normalize notifications
        // -------------------------------------------------
        const normalizedNotifications = rows.map(
          (notification) => {
            const relatedUserId =
              notification.related_user_id ||
              notification.from_user_id ||
              notification.fromUserId ||
              null;

            const profile = relatedUserId
              ? profileMap[relatedUserId]
              : null;

            return {
              ...notification,

              // User who caused the notification
              related_user_id: relatedUserId,

              // Sender name
              sender_name:
                profile?.full_name ||
                notification.sender_name ||
                notification.from_user_name ||
                notification.fromUserName ||
                "UMUHUZA Member",

              // Sender photo
              sender_photo:
                profile?.profile_photo_url ||
                notification.sender_photo ||
                notification.from_user_photo ||
                notification.fromUserPhoto ||
                "",

              // New notification system uses is_read.
              // The fallback supports your older records too.
              is_read:
                typeof notification.is_read ===
                "boolean"
                  ? notification.is_read
                  : Boolean(notification.read),
            };
          }
        );

        setNotifications(normalizedNotifications);
        setLoading(false);
      } catch (err) {
        console.error(
          "Unexpected notifications error:",
          err
        );

        if (!active) return;

        setError(
          "Unable to load your notifications."
        );

        setLoading(false);
      }
    };

    // Initial load
    loadNotifications();

    // -------------------------------------------------
    // REALTIME
    // -------------------------------------------------
    const channel = supabase
      .channel(
        `notifications-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // =====================================================
  // HELPERS
  // =====================================================
  const formatNotificationDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString([], {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================
  const markAsRead = async (notification) => {
    if (!currentUser?.id) return;

    if (!notification?.id) return;

    if (notification.is_read) return;

    // Immediately update UI
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              is_read: true,
            }
          : item
      )
    );

    const { error: updateError } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", notification.id)
      .eq("user_id", currentUser.id);

    if (updateError) {
      console.error(
        "Error marking notification as read:",
        updateError
      );

      // Restore unread state
      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: false,
              }
            : item
        )
      );
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAllAsRead = async () => {
    if (!currentUser?.id) return;

    if (unreadCount === 0) return;

    // Immediately update UI
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );

    const { error: updateError } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", currentUser.id)
      .eq("is_read", false);

    if (updateError) {
      console.error(
        "Mark all notifications error:",
        updateError
      );

      setError(
        "Unable to mark all notifications as read."
      );

      // Reload from database
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", {
          ascending: false,
        });

      if (data) {
        setNotifications(data);
      }
    }
  };

  // =====================================================
  // ACCEPT INTEREST
  // =====================================================
  const handleAcceptInterest = async (
    notification
  ) => {
    if (!currentUser?.id) return;

    const otherUserId =
      notification?.related_user_id ||
      notification?.from_user_id ||
      notification?.fromUserId;

    if (!otherUserId) {
      setError(
        "Unable to identify this member."
      );
      return;
    }

    if (acceptingInterest === notification.id) {
      return;
    }

    try {
      setAcceptingInterest(notification.id);
      setError("");

      const myName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        "UMUHUZA Member";

      // -------------------------------------------------
      // 1. Mark original notification as accepted
      // -------------------------------------------------
      const {
        error: notificationError,
      } = await supabase
        .from("notifications")
        .update({
          is_read: true,
          type: "interest_accepted",
          title: "Interest accepted ❤️",
          message: `${myName} accepted your interest ❤️`,
        })
        .eq("id", notification.id)
        .eq("user_id", currentUser.id);

      if (notificationError) {
        throw notificationError;
      }

      // -------------------------------------------------
      // 2. Update interest
      // -------------------------------------------------
      const {
        error: interestError,
      } = await supabase
        .from("interests")
        .update({
          status: "connected",
          respondedAt: new Date().toISOString(),
        })
        .eq("senderId", otherUserId)
        .eq("receiverId", currentUser.id);

      if (interestError) {
        console.warn(
          "Interest update warning:",
          interestError
        );
      }

      // -------------------------------------------------
      // 3. Notify the other user
      // -------------------------------------------------
      const {
        error: acceptedNotificationError,
      } = await supabase
        .from("notifications")
        .insert({
          user_id: otherUserId,
          type: "interest_accepted",
          title: "Interest accepted ❤️",
          message: `${myName} accepted your interest ❤️`,
          related_user_id: currentUser.id,
          is_read: false,
        });

      if (acceptedNotificationError) {
        console.error(
          "Accepted notification error:",
          acceptedNotificationError
        );
      }

      // -------------------------------------------------
      // 4. Open chat
      // -------------------------------------------------
      navigate("/chat", {
        state: {
          selectedUserId: otherUserId,
        },
      });
    } catch (err) {
      console.error(
        "Error accepting interest:",
        err
      );

      setError(
        err?.message ||
          "Unable to accept this interest. Please try again."
      );
    } finally {
      setAcceptingInterest(null);
    }
  };

  // =====================================================
  // START CHAT
  // =====================================================
  const handleStartChat = async (notification) => {
    const otherUserId =
      notification?.related_user_id ||
      notification?.from_user_id ||
      notification?.fromUserId;

    if (!otherUserId) {
      setError(
        "Unable to identify this member."
      );
      return;
    }

    await markAsRead(notification);

    navigate("/chat", {
      state: {
        selectedUserId: otherUserId,
      },
    });
  };

  // =====================================================
  // NOTIFICATION CLICK
  // =====================================================
  const handleNotificationClick = async (
    notification
  ) => {
    const otherUserId =
      notification?.related_user_id ||
      notification?.from_user_id ||
      notification?.fromUserId;

    // -------------------------------------------------
    // Interest
    // -------------------------------------------------
    if (notification.type === "interest") {
      await markAsRead(notification);
      return;
    }

    // -------------------------------------------------
    // Accepted interest
    // -------------------------------------------------
    if (
      notification.type ===
        "interest_accepted" ||
      notification.type === "accepted"
    ) {
      await handleStartChat(notification);
      return;
    }

    // -------------------------------------------------
    // Message
    // -------------------------------------------------
    if (notification.type === "message") {
      await markAsRead(notification);

      if (!otherUserId) {
        setError(
          "Unable to identify the sender of this message."
        );
        return;
      }

      navigate("/chat", {
        state: {
          selectedUserId: otherUserId,
        },
      });

      return;
    }

    // -------------------------------------------------
    // Other notifications
    // -------------------------------------------------
    await markAsRead(notification);
  };

  // =====================================================
  // ICONS
  // =====================================================
  const getNotificationIcon = (type) => {
    if (
      type === "interest" ||
      type === "like"
    ) {
      return <FiHeart />;
    }

    if (
      type === "interest_accepted" ||
      type === "accepted"
    ) {
      return <FiCheck />;
    }

    if (type === "message") {
      return <FiMessageCircle />;
    }

    return <FiBell />;
  };

  // =====================================================
  // TEXT
  // =====================================================
  const getNotificationText = (
    notification
  ) => {
    // New notification structure
    if (notification?.message) {
      return notification.message;
    }

    // Old notification structure
    if (notification?.text) {
      return notification.text;
    }

    const name =
      notification?.sender_name ||
      notification?.from_user_name ||
      "UMUHUZA Member";

    if (notification.type === "interest") {
      return `${name} would like to get to know you. ❤️`;
    }

    if (
      notification.type ===
        "interest_accepted" ||
      notification.type === "accepted"
    ) {
      return `${name} accepted your interest. ❤️`;
    }

    if (notification.type === "message") {
      return "You have a new message.";
    }

    if (notification.type === "like") {
      return `${name} liked you. ❤️`;
    }

    return "You have a new notification.";
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================
  if (!currentUser) {
    return (
      <div className="notifications-page">
        <div className="notifications-empty-card">
          <div className="notifications-empty-icon">
            ❤️
          </div>

          <h2>
            {t("pleaseLogIn") ||
              "Please log in"}
          </h2>

          <p>
            {t("loginToNotifications") ||
              "Log in to view your notifications."}
          </p>

          <button
            className="notifications-primary-btn"
            onClick={() => navigate("/login")}
          >
            {t("goToLogin") ||
              "Go to Login"}
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="notifications-page">
      {/* HEADER */}
      <header className="notifications-header">
        <button
          className="notifications-back-btn"
          onClick={() =>
            navigate("/member-home")
          }
        >
          <FiArrowLeft />

          <span>
            {t("back") || "Back"}
          </span>
        </button>

        <div className="notifications-logo">
          <img
            src={umurangaLogo}
            alt="UMUHUZA"
            style={{ height: 36 }}
          />
        </div>

        <div className="notifications-title">
          <FiBell />

          <span>
            {t("notifications") ||
              "Notifications"}
          </span>
        </div>
      </header>

      <main className="notifications-main">
        {/* HEADING */}
        <div className="notifications-heading">
          <div>
            <span className="notifications-label">
              🔔{" "}
              {t("yourActivity") ||
                "YOUR ACTIVITY"}
            </span>

            <h1>
              {t("notifications") ||
                "Notifications"}
            </h1>

            <p>
              {t("stayUpdatedActivity") ||
                "Stay updated with your activity."}
            </p>

            {/* MARK ALL READ */}
            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-read-btn"
                onClick={markAllAsRead}
              >
                <FiCheck />
                {t("markAllRead") ||
                  "Mark all read"}
              </button>
            )}
          </div>

          <div className="notifications-count">
            {unreadCount}

            <span>
              {t("unread") || "Unread"}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="notifications-error">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="notifications-empty-card">
            <div className="notifications-empty-icon">
              🔔
            </div>

            <h2>
              {t("loadingNotifications") ||
                "Loading notifications..."}
            </h2>

            <p>
              {t("pleaseWait") ||
                "Please wait."}
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* EMPTY */
          <div className="notifications-empty-card">
            <div className="notifications-empty-icon">
              🔔
            </div>

            <h2>
              {t("noNotificationsYet") ||
                "No notifications yet"}
            </h2>

            <p>
              {t(
                "notificationEmptyMessage"
              ) ||
                "When someone interacts with you, you'll see the notification here."}
            </p>

            <button
              className="notifications-primary-btn"
              onClick={() =>
                navigate("/member-home")
              }
            >
              {t("discoverPeople") ||
                "Discover People"}
            </button>
          </div>
        ) : (
          /* NOTIFICATION LIST */
          <div className="notifications-list">
            {notifications.map(
              (notification) => {
                const notificationName =
                  notification.sender_name ||
                  "UMUHUZA Member";

                const isInterest =
                  notification.type ===
                  "interest";

                const isAccepted =
                  notification.type ===
                    "interest_accepted" ||
                  notification.type ===
                    "accepted";

                return (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      notification.is_read
                        ? "notification-read"
                        : "notification-unread"
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >
                    {/* TYPE ICON */}
                    <div className="notification-icon">
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* PROFILE PHOTO */}
                    <div className="notification-avatar">
                      {notification.sender_photo ? (
                        <img
                          src={
                            notification.sender_photo
                          }
                          alt={
                            notificationName
                          }
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="notification-content">
                      <h3>
                        {notificationName}
                      </h3>

                      <p>
                        {getNotificationText(
                          notification
                        )}
                      </p>

                      <span>
                        {formatNotificationDate(
                          notification.created_at ||
                            notification.createdAt
                        )}
                      </span>
                    </div>

                    {/* ACCEPT BUTTON */}
                    {isInterest && (
                      <button
                        type="button"
                        className="start-chat-btn"
                        disabled={
                          acceptingInterest ===
                          notification.id
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          handleAcceptInterest(
                            notification
                          );
                        }}
                      >
                        {acceptingInterest ===
                        notification.id
                          ? t("accepting") ||
                            "Accepting..."
                          : `✓ ${
                              t("accept") ||
                              "ACCEPT"
                            }`}
                      </button>
                    )}

                    {/* START CHAT BUTTON */}
                    {isAccepted && (
                      <button
                        type="button"
                        className="start-chat-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleStartChat(
                            notification
                          );
                        }}
                      >
                        💬{" "}
                        {t("startChat") ||
                          "Start Chat"}
                      </button>
                    )}

                    {/* UNREAD DOT */}
                    {!notification.is_read && (
                      <span className="notification-unread-dot"></span>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;
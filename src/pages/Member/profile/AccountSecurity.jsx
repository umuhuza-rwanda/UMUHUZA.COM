import "./AccountSecurity.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiTrash2,
  FiKey,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";

function AccountSecurity() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [currentUser, setCurrentUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    let active = true;

    const loadAccount = async (user) => {
      if (!active) return;

      if (!user) {
        setCurrentUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      try {
        const { data, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "Error loading account profile:",
            profileError
          );

          if (active) {
            setError(
              "We couldn't load your account information."
            );
          }

          return;
        }

        if (active) {
          setProfile(data || null);
        }
      } catch (supabaseError) {
        console.error(
          "Error loading account profile:",
          supabaseError
        );

        if (active) {
          setError(
            "We couldn't load your account information."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Unable to get current user:",
            userError
          );

          if (active) {
            setCurrentUser(null);
            setProfile(null);
            setLoading(false);
          }

          return;
        }

        await loadAccount(user);
      } catch (authError) {
        console.error(
          "Account authentication error:",
          authError
        );

        if (active) {
          setCurrentUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user || null;

        await loadAccount(user);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // =====================================================
  // EMAIL VERIFIED
  // =====================================================

  const isEmailVerified =
    Boolean(currentUser?.email_confirmed_at);

  // =====================================================
  // FORMAT ACCOUNT CREATION DATE
  // =====================================================

  const getCreatedDate = () => {
    if (!currentUser?.created_at) {
      return "Not available";
    }

    const date = new Date(
      currentUser.created_at
    );

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // SEND EMAIL VERIFICATION
  // =====================================================

  const handleEmailVerification = async () => {
    clearMessages();

    if (!currentUser?.email) {
      setError(
        "Please log in again to continue."
      );

      return;
    }

    if (isEmailVerified) {
      setSuccess(
        "Your email address is already verified."
      );

      return;
    }

    try {
      setActionLoading(true);

      const {
        error: verificationError,
      } = await supabase.auth.resend({
        type: "signup",
        email: currentUser.email,
        options: {
          emailRedirectTo:
            `${window.location.origin}/login`,
        },
      });

      if (verificationError) {
        console.error(
          "Email verification error:",
          verificationError
        );

        const message =
          verificationError.message || "";

        if (
          message
            .toLowerCase()
            .includes("rate")
        ) {
          setError(
            "Too many requests. Please wait a little while before trying again."
          );
        } else {
          setError(
            message ||
              "We couldn't send the verification email."
          );
        }

        return;
      }

      setSuccess(
        "Verification email sent. Please check your inbox."
      );
    } catch (verificationError) {
      console.error(
        "Email verification error:",
        verificationError
      );

      setError(
        verificationError?.message ||
          "We couldn't send the verification email."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // SEND PASSWORD RESET EMAIL
  // =====================================================

  const handlePasswordReset = async () => {
    clearMessages();

    if (!currentUser?.email) {
      setError(
        "No email address is associated with this account."
      );

      return;
    }

    try {
      setActionLoading(true);

      const {
        error: resetError,
      } = await supabase.auth.resetPasswordForEmail(
        currentUser.email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        console.error(
          "Password reset error:",
          resetError
        );

        const message =
          resetError.message || "";

        if (
          message
            .toLowerCase()
            .includes("rate")
        ) {
          setError(
            "Too many requests. Please wait before trying again."
          );
        } else {
          setError(
            message ||
              "We couldn't send the password reset email."
          );
        }

        return;
      }

      setSuccess(
        `Password reset instructions have been sent to ${currentUser.email}.`
      );
    } catch (resetError) {
      console.error(
        "Password reset error:",
        resetError
      );

      setError(
        resetError?.message ||
          "We couldn't send the password reset email."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const handleDeleteAccount = async () => {
    clearMessages();

    if (!currentUser) {
      setError(
        "Please log in again to continue."
      );

      return;
    }

    try {
      setActionLoading(true);

      /*
        Supabase Auth users cannot safely be deleted
        directly from the browser.

        We therefore call a secure database RPC.
        The RPC must use auth.uid() to identify the
        currently authenticated user.
      */

      const {
        error: deleteError,
      } = await supabase.rpc(
        "delete_my_account"
      );

      if (deleteError) {
        console.error(
          "Account deletion error:",
          deleteError
        );

        const message =
          deleteError.message || "";

        if (
          message
            .toLowerCase()
            .includes("recent")
        ) {
          setError(
            "For your security, please log in again before deleting your account."
          );
        } else {
          setError(
            message ||
              "We couldn't delete your account. Please try again."
          );
        }

        return;
      }

      /*
        Sign out locally after successful deletion.
      */

      await supabase.auth.signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (deleteError) {
      console.error(
        "Account deletion error:",
        deleteError
      );

      setError(
        deleteError?.message ||
          "We couldn't delete your account. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser && !loading) {
    return (
      <div className="security-page">
        <div className="security-empty-card">
          <div className="security-empty-icon">
            🔐
          </div>

          <h2>
            Please log in
          </h2>

          <p>
            You need to be logged in to manage
            your UMUHUZA account security.
          </p>

          <button
            type="button"
            className="security-primary-btn"
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
      <div className="security-page">
        <div className="security-loading-card">
          <div className="security-loading-icon">
            🔐
          </div>

          <h2>
            Loading Account Security...
          </h2>

          <p>
            We're securely loading your
            account information.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="security-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="security-header">

        <button
          type="button"
          className="security-back-btn"
          onClick={() =>
            navigate("/member/profile")
          }
        >
          <FiArrowLeft />

          <span>
            Back to Profile
          </span>
        </button>

        <div className="security-brand">
          ❤️ UMUHUZA
        </div>

        <div className="security-header-title">
          <FiShield />

          <span>
            Account & Security
          </span>
        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="security-main">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="security-intro">

          <div className="security-intro-icon">
            <FiShield />
          </div>

          <div>

            <span className="security-eyebrow">
              ACCOUNT SECURITY
            </span>

            <h1>
              Protect Your UMUHUZA Account
            </h1>

            <p>
              Manage your login information,
              email verification and account security.
            </p>

          </div>

        </section>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="security-success">

            <FiCheckCircle />

            <span>
              {success}
            </span>

          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="security-error">

            <FiAlertCircle />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <section className="security-card">

          <div className="security-card-heading">

            <div className="security-card-icon account">
              <FiMail />
            </div>

            <div>

              <h2>
                Account Information
              </h2>

              <p>
                Your basic UMUHUZA account details.
              </p>

            </div>

          </div>

          <div className="security-info-list">

            {/* EMAIL */}

            <div className="security-info-row">

              <div className="security-info-label">

                <FiMail />

                <span>
                  Email Address
                </span>

              </div>

              <div className="security-info-value">

                <strong>
                  {currentUser?.email ||
                    profile?.email ||
                    "Not available"}
                </strong>

              </div>

            </div>

            {/* EMAIL STATUS */}

            <div className="security-info-row">

              <div className="security-info-label">

                <FiCheckCircle />

                <span>
                  Email Verification
                </span>

              </div>

              <div>

                {isEmailVerified ? (
                  <span className="security-status verified">

                    <FiCheckCircle />

                    Verified

                  </span>
                ) : (
                  <span className="security-status unverified">

                    <FiAlertCircle />

                    Not Verified

                  </span>
                )}

              </div>

            </div>

            {/* ACCOUNT CREATED */}

            <div className="security-info-row">

              <div className="security-info-label">

                <FiShield />

                <span>
                  Account Created
                </span>

              </div>

              <div className="security-info-value">

                <strong>
                  {getCreatedDate()}
                </strong>

              </div>

            </div>

            {/* UID */}

            <div className="security-info-row">

              <div className="security-info-label">

                <FiKey />

                <span>
                  Account ID
                </span>

              </div>

              <div className="security-info-value security-uid">

                <strong>
                  {currentUser?.id}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            EMAIL VERIFICATION
        ================================================= */}

        <section className="security-card">

          <div className="security-card-heading">

            <div className="security-card-icon verification">
              <FiMail />
            </div>

            <div>

              <h2>
                Email Verification
              </h2>

              <p>
                Keep your email address verified
                to help protect your account.
              </p>

            </div>

          </div>

          <div className="security-action-box">

            <div className="security-action-icon">

              {isEmailVerified ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}

            </div>

            <div className="security-action-content">

              <h3>
                {isEmailVerified
                  ? "Your email is verified"
                  : "Your email is not verified"}
              </h3>

              <p>
                {isEmailVerified
                  ? "Your email address has been successfully verified."
                  : "Verify your email address to improve your account security."}
              </p>

            </div>

            {!isEmailVerified && (
              <button
                type="button"
                className="security-action-btn"
                onClick={
                  handleEmailVerification
                }
                disabled={actionLoading}
              >
                <FiRefreshCw />

                {actionLoading
                  ? "Sending..."
                  : "Send Verification"}
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <section className="security-card">

          <div className="security-card-heading">

            <div className="security-card-icon password">
              <FiLock />
            </div>

            <div>

              <h2>
                Password & Login
              </h2>

              <p>
                Keep your password strong and secure.
              </p>

            </div>

          </div>

          <div className="security-action-box">

            <div className="security-action-icon">

              <FiLock />

            </div>

            <div className="security-action-content">

              <h3>
                Change Your Password
              </h3>

              <p>
                We'll send a secure password reset
                link to your registered email address.
              </p>

            </div>

            <button
              type="button"
              className="security-action-btn"
              onClick={
                handlePasswordReset
              }
              disabled={actionLoading}
            >
              <FiKey />

              {actionLoading
                ? "Sending..."
                : "Reset Password"}
            </button>

          </div>

        </section>

        {/* =================================================
            SECURITY TIPS
        ================================================= */}

        <section className="security-tips-card">

          <div className="security-tips-icon">
            🛡️
          </div>

          <div>

            <h2>
              Keep Your Account Safe
            </h2>

            <ul>

              <li>
                Use a strong password that you
                don't use on other websites.
              </li>

              <li>
                Never share your UMUHUZA password
                with anyone.
              </li>

              <li>
                Keep your email address verified.
              </li>

              <li>
                Be careful with suspicious links
                or messages asking for your password.
              </li>

            </ul>

          </div>

        </section>

        {/* =================================================
            DANGER ZONE
        ================================================= */}

        <section className="security-danger-card">

          <div className="security-danger-heading">

            <div className="security-danger-icon">

              <FiTrash2 />

            </div>

            <div>

              <span>
                DANGER ZONE
              </span>

              <h2>
                Delete Account
              </h2>

              <p>
                Permanently delete your UMUHUZA
                account and associated profile data.
              </p>

            </div>

          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              className="security-delete-btn"
              onClick={() => {

                clearMessages();

                setShowDeleteConfirm(
                  true
                );

              }}
              disabled={actionLoading}
            >
              <FiTrash2 />

              Delete My Account
            </button>
          ) : (
            <div className="delete-confirmation">

              <div className="delete-warning">

                <FiAlertCircle />

                <div>

                  <strong>
                    Are you absolutely sure?
                  </strong>

                  <p>
                    This action permanently deletes
                    your UMUHUZA account. This cannot
                    be undone.
                  </p>

                </div>

              </div>

              <div className="delete-confirmation-actions">

                <button
                  type="button"
                  className="cancel-delete-btn"
                  onClick={() =>
                    setShowDeleteConfirm(
                      false
                    )
                  }
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={
                    handleDeleteAccount
                  }
                  disabled={actionLoading}
                >
                  <FiTrash2 />

                  {actionLoading
                    ? "Deleting Account..."
                    : "Yes, Delete My Account"}
                </button>

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="security-footer">

          <div className="security-footer-heart">
            ❤️
          </div>

          <strong>
            UMUHUZA
          </strong>

          <p>
            Meaningful connections. Genuine people.
          </p>

          <small>
            Your privacy and security matter to us.
          </small>

        </footer>

      </main>

    </div>
  );
}

export default AccountSecurity;
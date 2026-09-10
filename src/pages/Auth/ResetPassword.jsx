import "./ResetPassword.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CHECK RECOVERY SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      try {
        // Supabase processes the recovery link and creates
        // a temporary authenticated session.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError) {
          console.error(
            "Recovery session error:",
            sessionError
          );

          setError(
            "This password reset link is invalid or has expired."
          );

          setLoading(false);
          return;
        }

        if (!session) {
          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );

          setLoading(false);
          return;
        }

        console.log(
          "🔐 Password recovery session found."
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Password recovery error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to verify the password reset link."
          );

          setLoading(false);
        }
      }
    };

    checkRecoverySession();

    // Listen for Supabase authentication changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(
          "🔐 Reset password auth event:",
          event
        );

        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setError("");
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
  // PASSWORD VALIDATION
  // =====================================================

  const validatePassword = () => {
    if (!password) {
      setError("Please enter a new password.");
      return false;
    }

    if (password.length < 6) {
      setError(
        "Your password must be at least 6 characters."
      );
      return false;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!validatePassword()) {
      return;
    }

    setSaving(true);

    try {
      // Make sure the recovery session still exists.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        setError(
          "Your password reset session has expired. Please request a new reset link."
        );

        setSaving(false);
        return;
      }

      console.log(
        "🔐 Updating password..."
      );

      // =================================================
      // THIS IS THE IMPORTANT PART
      // =================================================

      const {
        data,
        error: updateError,
      } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error(
          "❌ Password update error:",
          updateError
        );

        throw updateError;
      }

      console.log(
        "✅ Password updated successfully:",
        data?.user?.id
      );

      // Password was actually changed.
      setSuccess(true);

      // Clear password fields.
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(
        "❌ Reset password error:",
        err
      );

      setError(
        err?.message ||
          "Unable to change your password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="reset-password-page">

        <div className="reset-password-card">

          <div className="reset-password-icon">
            <FiLock />
          </div>

          <h1>
            Checking Reset Link
          </h1>

          <p>
            Please wait while we verify
            your password reset link.
          </p>

          <div className="reset-password-spinner" />

        </div>

      </div>
    );
  }

  // =====================================================
  // SUCCESS
  // =====================================================

  if (success) {
    return (
      <div className="reset-password-page">

        <div className="reset-password-card success-card">

          <div className="reset-password-success-icon">
            <FiCheckCircle />
          </div>

          <h1>
            Password Changed Successfully
          </h1>

          <p>
            Your password has been updated successfully.
            You can now sign in using your new password.
          </p>

          <button
            type="button"
            className="reset-password-primary-btn"
            onClick={() =>
              navigate("/login", {
                replace: true,
              })
            }
          >
            Go to Sign In
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR / EXPIRED LINK
  // =====================================================

  if (error && !password && !confirmPassword) {
    return (
      <div className="reset-password-page">

        <div className="reset-password-card">

          <div className="reset-password-error-icon">
            <FiAlertCircle />
          </div>

          <h1>
            Reset Link Problem
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="reset-password-primary-btn"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Request New Reset Link
          </button>

          <button
            type="button"
            className="reset-password-back-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            <FiArrowLeft />
            Back to Sign In
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN FORM
  // =====================================================

  return (
    <div className="reset-password-page">

      <div className="reset-password-card">

        {/* ICON */}

        <div className="reset-password-icon">
          <FiLock />
        </div>

        {/* TITLE */}

        <h1>
          Create a New Password
        </h1>

        <p className="reset-password-description">
          Choose a new password for your UMUHUZA
          account.
        </p>

        {/* ERROR */}

        {error && (
          <div className="reset-password-error">

            <FiAlertCircle />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleResetPassword}
          className="reset-password-form"
        >

          {/* NEW PASSWORD */}

          <div className="reset-password-field">

            <label htmlFor="new-password">
              New Password
            </label>

            <div className="reset-password-input-wrapper">

              <FiLock />

              <input
                id="new-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your new password"
                autoComplete="new-password"
                disabled={saving}
              />

              <button
                type="button"
                className="reset-password-eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="reset-password-field">

            <label htmlFor="confirm-password">
              Confirm New Password
            </label>

            <div className="reset-password-input-wrapper">

              <FiLock />

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={saving}
              />

              <button
                type="button"
                className="reset-password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>

          {/* PASSWORD REQUIREMENT */}

          <div className="reset-password-requirement">

            <span>
              ✓
            </span>

            <p>
              Password must contain at least
              6 characters.
            </p>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="reset-password-primary-btn"
            disabled={saving}
          >
            {saving
              ? "Changing Password..."
              : "Change Password"}
          </button>

        </form>

        {/* BACK */}

        <button
          type="button"
          className="reset-password-back-btn"
          onClick={() =>
            navigate("/login")
          }
          disabled={saving}
        >
          <FiArrowLeft />
          Back to Sign In
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;
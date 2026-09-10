import "./Auth.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // =====================================================
  // SEND SUPABASE PASSWORD RESET EMAIL
  // =====================================================

  const handleResetPassword = async () => {
    setError("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // SUPABASE PASSWORD RESET
      // =================================================

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        console.error(
          "Supabase password reset error:",
          resetError
        );

        setError(
          resetError.message ||
            "We couldn't send the password reset email. Please try again."
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(true);

    } catch (resetException) {
      console.error(
        "Password reset exception:",
        resetException
      );

      setError(
        resetException?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (success) {
    return (
      <div className="auth-page">

        <div className="auth-container">

          {/* LEFT SIDE */}

          <div className="auth-welcome">

            <div className="auth-logo">
              ❤️ UMUHUZA
            </div>

            <h1>
              Welcome
              <br />
              Back
            </h1>

            <p>
              We'll help you get back into
              your UMUHUZA account.
            </p>

            <div className="auth-hearts">
              ❤️ 💕 ❤️
            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="auth-form-container">

            <div className="auth-form">

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >

                <FiCheckCircle
                  size={64}
                  style={{
                    marginBottom: "15px",
                  }}
                />

                <h2>
                  Check Your Email
                </h2>

              </div>


              <p
                className="auth-subtitle"
                style={{
                  textAlign: "center",
                  lineHeight: "1.7",
                }}
              >

                If an account exists for{" "}

                <strong>
                  {email}
                </strong>

                , we've sent instructions
                to reset your password.

              </p>


              <div
                style={{
                  marginTop: "25px",
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >

                📩

                <br />

                Check your inbox and spam folder.

              </div>


              <button
                type="button"
                className="auth-primary-btn"
                onClick={() =>
                  navigate("/login")
                }
              >

                Back to Login ❤️

              </button>


              <button
                type="button"
                className="auth-link"
                style={{
                  width: "100%",
                  marginTop: "15px",
                }}
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setError("");
                }}
              >

                Try another email

              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // RESET EMAIL FORM
  // =====================================================

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="auth-welcome">

          <div className="auth-logo">
            ❤️ UMUHUZA
          </div>

          <h1>
            Reset Your
            <br />
            Password
          </h1>

          <p>
            Don't worry. We'll help you get
            back into your account.
          </p>

          <div className="auth-hearts">
            ❤️ 💕 ❤️
          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="auth-form-container">

          <div className="auth-form">

            {/* BACK */}

            <button
              type="button"
              className="auth-link"
              onClick={() =>
                navigate("/login")
              }
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "25px",
              }}
            >

              <FiArrowLeft />

              Back to Login

            </button>


            <h2>
              Forgot Password?
            </h2>


            <p className="auth-subtitle">
              Enter the email address associated
              with your UMUHUZA account.
            </p>


            {/* ERROR */}

            {error && (
              <div className="auth-error">

                <FiAlertCircle />

                {error}

              </div>
            )}


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="resetEmail">
                Email Address
              </label>

              <div className="input-wrapper">

                <FiMail />

                <input
                  id="resetEmail"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  onKeyDown={(event) => {

                    if (event.key === "Enter") {
                      handleResetPassword();
                    }

                  }}
                />

              </div>

            </div>


            {/* SEND RESET LINK */}

            <button
              type="button"
              className="auth-primary-btn"
              onClick={handleResetPassword}
              disabled={loading}
            >

              {loading
                ? "Sending Reset Email..."
                : "Send Reset Link"
              }

              {!loading && (
                <span>
                  🔐
                </span>
              )}

            </button>


            <div className="auth-switch">

              <span>
                Remember your password?
              </span>

              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  navigate("/login")
                }
                disabled={loading}
              >

                Login

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;
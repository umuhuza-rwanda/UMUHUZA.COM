import "./Login.css";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useAppPreferences } from "../../context/AppPreferencesContext";

import { supabase } from "../../lib/supabase";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useAppPreferences();

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    // ===================================================
    // VALIDATION
    // ===================================================

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // ===================================================
    // SUPABASE LOGIN
    // ===================================================

    try {
      setLoading(true);

      console.log("=================================");
      console.log("❤️ UMUHUZA SUPABASE LOGIN");
      console.log("Email:", cleanEmail);
      console.log("=================================");

      const {
        data,
        error: supabaseError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      // =================================================
      // AUTH ERROR
      // =================================================

      if (supabaseError) {
        console.error(
          "Supabase login error:",
          supabaseError
        );

        const message =
          supabaseError.message?.toLowerCase() || "";

        if (
          message.includes("invalid login credentials")
        ) {
          setError(
            "Incorrect email or password. Please check your email and password."
          );
        } else if (
          message.includes("email not confirmed")
        ) {
          setError(
            "Please confirm your email address before logging in."
          );
        } else if (
          message.includes("too many requests")
        ) {
          setError(
            "Too many login attempts. Please wait a moment and try again."
          );
        } else {
          setError(
            supabaseError.message ||
              "Unable to log in. Please try again."
          );
        }

        return;
      }

      // =================================================
      // GET AUTHENTICATED USER
      // =================================================

      const user = data?.user;

      if (!user) {
        console.error(
          "Supabase login returned no user."
        );

        setError(
          "Login succeeded, but no user account was returned."
        );

        return;
      }

      console.log(
        "✅ Supabase authentication successful"
      );

      console.log(
        "User ID:",
        user.id
      );

      console.log(
        "User email:",
        user.email
      );

      // =================================================
      // IMPORTANT:
      // GET THE CURRENT SESSION AGAIN
      // =================================================

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Session verification error:",
          sessionError
        );

        setError(
          "Your account was authenticated, but your session could not be verified."
        );

        return;
      }

      const authenticatedUser =
        sessionData?.session?.user;

      if (!authenticatedUser) {
        console.error(
          "No authenticated session user found."
        );

        setError(
          "Your login session could not be established. Please try again."
        );

        return;
      }

      console.log(
        "✅ Active session confirmed:",
        authenticatedUser.id
      );

      // =================================================
      // LOAD PROFILE
      // =================================================

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          username,
          profile_completed,
          signup_step
          `
        )
        .eq(
          "id",
          authenticatedUser.id
        )
        .maybeSingle();

      // =================================================
      // PROFILE QUERY ERROR
      // =================================================

      if (profileError) {
        console.error(
          "❌ Supabase profile error:",
          profileError
        );

        setError(
          "Your account was authenticated, but we could not load your profile. Please try again."
        );

        return;
      }

      // =================================================
      // PROFILE FOUND
      // =================================================

      if (profile) {
        console.log(
          "✅ Existing UMUHUZA profile found:"
        );

        console.log({
          profileId: profile.id,
          fullName: profile.full_name,
          username: profile.username,
          profileCompleted:
            profile.profile_completed,
          signupStep:
            profile.signup_step,
        });

        // =================================================
        // IMPORTANT
        //
        // Whether the password was normal or reset,
        // an existing profile belongs to an existing user.
        //
        // SEND THEM DIRECTLY TO MEMBER HOME.
        // =================================================

        console.log(
          "🏠 Redirecting existing user to Member Home..."
        );

        navigate(
          "/member-home",
          {
            replace: true,
          }
        );

        return;
      }

      // =================================================
      // NO PROFILE FOUND
      // =================================================

      console.warn(
        "⚠️ No profile found for authenticated user:",
        authenticatedUser.id
      );

      /*
        Before sending the user to Profile Setup,
        verify whether this is actually a brand-new
        account.

        Password reset users should not normally reach
        this section because their existing profile should
        already exist.
      */

      const createdAt =
        authenticatedUser.created_at
          ? new Date(
              authenticatedUser.created_at
            )
          : null;

      const now = new Date();

      const accountAgeMinutes =
        createdAt
          ? (now.getTime() -
              createdAt.getTime()) /
            1000 /
            60
          : null;

      console.log(
        "Account age in minutes:",
        accountAgeMinutes
      );

      // =================================================
      // BRAND NEW ACCOUNT
      // =================================================

      if (
        accountAgeMinutes !== null &&
        accountAgeMinutes < 10
      ) {
        console.log(
          "🆕 New account detected → Profile Setup"
        );

        navigate(
          "/profile-setup",
          {
            replace: true,
          }
        );

        return;
      }

      // =================================================
      // EXISTING AUTH ACCOUNT BUT PROFILE MISSING
      // =================================================

      /*
        This is different from a genuinely new signup.

        The account already exists in Supabase Auth but
        its profile row cannot be found.

        Do NOT silently send an established user into
        profile setup.

        Instead, show a clear error so we can investigate
        the missing profile/RLS issue.
      */

      console.error(
        "❌ Existing Auth account has no profiles row."
      );

      setError(
        "Your account is valid, but your profile could not be found. Please contact support."
      );

    } catch (loginError) {
      console.error(
        "❌ Unexpected Supabase login error:",
        loginError
      );

      setError(
        loginError?.message ||
          "Unable to log in. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-card">
        {/* =================================================
            LOGO
        ================================================= */}

<div className="premium-logo">
  <img src={umurangaLogo} alt="UMUHUZA" />
</div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Sign in to continue your love journey.
        </p>
<LanguageSwitcher />
        


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="login-field">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

{/* =================================================
    PASSWORD
================================================= */}

<div className="login-field">

  <div className="password-row">
    <label htmlFor="login-password">
      Password
    </label>

    <button
      type="button"
      className="auth-link"
      onClick={handleForgotPassword}
      disabled={loading}
    >
      Forgot Password?
    </button>
  </div>

  {/* Password input with eye icon inside */}
  <div className="password-input-wrapper">
    <input
      id="login-password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      autoComplete="current-password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      disabled={loading}
      className="password-input"
    />

    <button
      type="button"
      className="password-toggle-btn"
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={loading}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
    </button>
  </div>

</div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login ❤️"
            }
          </button>

        </form>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="login-divider">
          OR
        </div>

        {/* =================================================
            SIGN UP
        ================================================= */}

        <p className="login-signup">

          Don't have an account?{" "}

          <Link to="/signup">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
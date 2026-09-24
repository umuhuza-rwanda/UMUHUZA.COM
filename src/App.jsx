import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import SupabaseTest from "./SupabaseTest";
import { useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import FloatingInviteButton from "./components/FloatingInviteButton";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Spin from "./pages/Spin/Spin";


// =========================
// AUTH PAGES
// =========================

import Signup from "./pages/Auth/Signup";
import AboutYou from "./pages/Auth/AboutYou";
import ProfileSetup from "./pages/Auth/ProfileSetup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Premium from "./pages/Premium/Premium";
import AdminPayments from "./pages/AdminPayments";
import ResetPassword from "./pages/Auth/ResetPassword";

// =========================
// MEMBER PAGES
// =========================

import MemberHome from "./pages/MemberHome/MemberHome";
import MemberProfile from "./pages/MemberHome/MemberProfile";
import Chat from "./pages/Chat/Chat";
import Interests from "./pages/Interests/Interests";
import Notifications from "./pages/Notifications/Notifications";

// =========================
// PROFILE SETTINGS
// =========================

import PersonalInformation from "./pages/Member/profile/PersonalInformation";
import DatingPreferences from "./pages/Member/profile/DatingPreferences";
import LocationDiscovery from "./pages/Member/profile/LocationDiscovery";
import NotificationSettings from "./pages/Member/profile/NotificationSettings";
import AccountSecurity from "./pages/Member/profile/AccountSecurity";
import Privacy from "./pages/Member/profile/Privacy";
import NewAppPreferences from "./pages/Member/profile/NewAppPreferences";
import HelpSupport from "./pages/Member/profile/HelpSupport";
import SuccessStoriesPage from "./pages/Public/SuccessStoriesPage";

// =========================
// MAIN PROFILE
// =========================

import Profile from "./pages/Member/Profile";

// =========================
// APP PREFERENCES CONTEXT
// =========================

import {
  AppPreferencesProvider,
} from "./context/AppPreferencesContext";



// =========================
// HOMEPAGE COMPONENTS
// =========================

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import MemberCard from "./components/MemberCard/MemberCard";
import SuccessStories from "./components/SuccessStories/SuccessStories";

import Footer from "./components/Footer/Footer";
import AboutUs from "./components/AboutUs/AboutUs";

import HowItWorks from "./pages/Public/HowItWorks";
import Contact from "./pages/Public/Contact";
import Referral from "./pages/Referral/Referral";
import InstallAppPrompt from "./components/InstallAppPrompt/InstallAppPrompt";

// =========================
// MEMBER LAYOUT
// =========================
import alineImage from "./assets/images/members/aline.jpg";
import patrickImage from "./assets/images/members/patrick.jpg";
import dianeImage from "./assets/images/members/diane.jpg";

import MemberLayout from "./components/MemberLayout";

// ======================================================
// HOME PAGE
// ======================================================



// ======================================================
// SESSION STARTUP CHECK
// ======================================================

function SessionStartup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSavedSession = async () => {
      console.log(
        "🔐 UMUHUZA: Checking saved Supabase session..."
      );

      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error(
          "❌ UMUHUZA session check error:",
          error
        );

        setCheckingSession(false);
        return;
      }

      const session = data?.session;

      console.log(
        "🔐 UMUHUZA saved session:",
        session ? "FOUND ✅" : "NOT FOUND ❌"
      );

      if (session?.user) {
        console.log(
          "👤 UMUHUZA saved user:",
          session.user.id
        );

        if (location.pathname === "/") {
          console.log(
            "🏠 → 👤 Existing session detected."
          );

          console.log(
            "➡️ Redirecting to Member Home..."
          );

          navigate(
            "/member-home",
            {
              replace: true,
            }
          );
        }
      }

      setCheckingSession(false);
    };

    checkSavedSession();

    return () => {
      mounted = false;
    };
  }, [navigate, location.pathname]);

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
          background: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "40px",
          }}
        >
          ❤️
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Loading UMUHUZA...
        </div>
      </div>
    );
  }

  return null;
}




function Home() {
  return (
    <>
      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          HERO
      ========================= */}

      <Hero />

      <div className="members-grid">
  <MemberCard
    image={alineImage}
    name="Aline"
    age={24}
    city="Kigali"
    country="Rwanda"
    lookingFor="Marriage"
    online={true}
    nearYou={true}
    onViewProfile={() => {}}
    onLike={() => {}}
    onSendInterest={() => {}}
    onStartChat={() => {}}
  />

  <MemberCard
    image={patrickImage}
    name="Vincent"
    age={26}
    city="Huye"
    country="Rwanda"
    lookingFor="Serious Relationship"
    online={true}
    onViewProfile={() => {}}
    onLike={() => {}}
    onSendInterest={() => {}}
    onStartChat={() => {}}
  />

  <MemberCard
    image={dianeImage}
    name="Valence"
    age={26}
    city="Musanze"
    country="Rwanda"
    lookingFor="Friendship"
    online={true}
    nearYou={true}
    onViewProfile={() => {}}
    onLike={() => {}}
    onSendInterest={() => {}}
    onStartChat={() => {}}
  />
</div>

      {/* =========================
          SUCCESS STORIES
      ========================= */}

      <SuccessStories />



      {/* =========================
          FOOTER
      ========================= */}

      <Footer />
    </>
  );
}

// ======================================================
// ANDROID BACK BUTTON
// ======================================================

function AndroidBackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      // If there is browser/router history available,
      // go back to the previous UMUHUZA page.
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }

      // If already at the first page, minimize the Android app
      // instead of unexpectedly closing it.
      await CapacitorApp.minimizeApp();
    };

    const listener = CapacitorApp.addListener(
      "backButton",
      handleBackButton
    );

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [navigate, location.pathname]);

  return null;
}

// ======================================================
// ANDROID NOTIFICATION PERMISSION
// ======================================================
// ======================================================
// ANDROID PUSH NOTIFICATIONS
// ======================================================

function AndroidNotificationPermission() {
    const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    let authSubscription = null;
    let registrationListener = null;
    let registrationErrorListener = null;

    const savePushToken = async (token) => {
      if (!token) {
        console.warn("⚠️ UMUHUZA: No push token received.");
        return;
      }

      try {
        const {
          data: { user },
          error: sessionError,
        } = await supabase.auth.getUser();

        if (sessionError) {
          console.error(
            "❌ UMUHUZA: Could not get current user:",
            sessionError
          );
          return;
        }

        if (!user) {
          console.log(
            "ℹ️ UMUHUZA: No logged-in user yet. Push token will be saved after login."
          );
          return;
        }

        const { error } = await supabase
          .from("push_tokens")
          .upsert(
            {
              user_id: user.id,
              token,
              platform: "android",
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,token",
            }
          );

        if (error) {
          console.error(
            "❌ UMUHUZA: Failed to save push token:",
            error
          );
          return;
        }

        console.log(
          "✅ UMUHUZA: Push token saved to Supabase."
        );
      } catch (error) {
        console.error(
          "❌ UMUHUZA: Push token save error:",
          error
        );
      }
    };

    const setupPushNotifications = async () => {
      // Only run inside the native Android app.
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      if (Capacitor.getPlatform() !== "android") {
        return;
      }

      try {
        // ------------------------------------------------
        // CHECK NOTIFICATION PERMISSION
        // ------------------------------------------------

        let permission =
          await PushNotifications.checkPermissions();

        console.log(
          "🔔 UMUHUZA notification permission:",
          permission.receive
        );

        // Ask Android if permission has not been decided yet.
        if (permission.receive === "prompt") {
          permission =
            await PushNotifications.requestPermissions();

          console.log(
            "🔔 UMUHUZA notification permission result:",
            permission.receive
          );
        }

        // User denied notifications.
        if (permission.receive !== "granted") {
          console.log(
            "🔕 UMUHUZA: Notification permission not granted."
          );
          return;
        }

        // ------------------------------------------------
        // FCM TOKEN REGISTRATION
        // ------------------------------------------------

        registrationListener =
          await PushNotifications.addListener(
            "registration",
            async (token) => {
              console.log(
                "📲 UMUHUZA FCM registration token received:",
                token.value
              );

              await savePushToken(token.value);
            }
          );

        // ------------------------------------------------
        // REGISTRATION ERROR
        // ------------------------------------------------

        registrationErrorListener =
          await PushNotifications.addListener(
            "registrationError",
            (error) => {
              console.error(
                "❌ UMUHUZA FCM registration error:",
                error
              );
            }
          );

                  // ------------------------------------------------
        // HANDLE NOTIFICATION TAP
        // ------------------------------------------------

        const notificationActionListener =
          await PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (action) => {
              console.log(
                "🔔 UMUHUZA notification tapped:",
                action
              );

              navigate("/notifications");
            }
          );

        // Store the listener so it can be removed later.
        window.umuhuzaNotificationActionListener =
          notificationActionListener;

        // ------------------------------------------------
        // REGISTER DEVICE WITH FCM
        // ------------------------------------------------

        await PushNotifications.register();

        console.log(
          "✅ UMUHUZA: Device registered for push notifications."
        );

        // ------------------------------------------------
        // SAVE TOKEN AFTER LOGIN
        // ------------------------------------------------

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          console.log(
            "👤 UMUHUZA: Logged-in user ready for push notifications:",
            user.id
          );
        }

        authSubscription =
          supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;

              if (
                event === "SIGNED_IN" &&
                session?.user
              ) {
                console.log(
                  "🔐 UMUHUZA: User signed in. Push notifications ready."
                );
              }
            }
          ).data.subscription;
      } catch (error) {
        console.error(
          "❌ UMUHUZA push notification setup error:",
          error
        );
      }
    };

    setupPushNotifications();

    return () => {
      mounted = false;

      if (registrationListener) {
        registrationListener.remove();
      }

      if (registrationErrorListener) {
        registrationErrorListener.remove();
      }
      
            if (window.umuhuzaNotificationActionListener) {
        window.umuhuzaNotificationActionListener.remove();
        window.umuhuzaNotificationActionListener = null;
      }
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  return null;
}

function FloatingInviteButtonWrapper() {
  const location = useLocation();

  // Only show on Member Home
  const showButton =
    location.pathname === "/member-home";

  if (!showButton) return null;

  return <FloatingInviteButton />;
}
// ======================================================
// APP
// ======================================================

function App() {
  return (
    
      <AppPreferencesProvider>

  

      <BrowserRouter>

      <SessionStartup />
      
      <AndroidBackButtonHandler />
      {/* Floating EARN button - only on Member Home */}
<FloatingInviteButtonWrapper />

<InstallAppPrompt />
      <AndroidNotificationPermission />

        <Routes>

          {/* =================================================
              HOMEPAGE
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =================================================
              AUTHENTICATION
          ================================================= */}

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/register"
            element={<Signup />}
          />

          <Route
            path="/about-you"
            element={<AboutYou />}
          />

          <Route
            path="/profile-setup"
            element={<ProfileSetup />}
          />

          <Route
            path="/premium"
            element={<Premium />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route path="/spin" element={<Spin />} />

{/* =================================================
    PUBLIC SEO PAGES
================================================= */}



<Route
  path="/about-us"
  element={<AboutUs />}
/>

<Route
  path="/how-it-works"
  element={<HowItWorks />}
/>

<Route
  path="/success-stories"
  element={<SuccessStoriesPage />}
/>

<Route
  path="/contact"
  element={<Contact />}
/>
          <Route
  path="/reset-password"
  element={<ResetPassword />}
/>

          {/* =================================================
              FORGOT PASSWORD
          ================================================= */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
  path="/supabase-test"
  element={<SupabaseTest />}
/>

          {/* =================================================
              INTERESTS
          ================================================= */}

          <Route
            path="/interests"
            element={
              <MemberLayout>
                <Interests />
              </MemberLayout>
            }
          />
          <Route path="/admin/payments" element={<AdminPayments />} />

          {/* =================================================
              MEMBER HOME
          ================================================= */}

          <Route
            path="/member-home"
            element={
              <MemberLayout>
                <MemberHome />
              </MemberLayout>
            }
          />

          {/* =================================================
              REFERRAL / INVITE FRIENDS
          ================================================= */}

          <Route
            path="/referral"
            element={
              <MemberLayout>
                <Referral />
              </MemberLayout>
            }
          />

          {/* =================================================
              INDIVIDUAL MEMBER PROFILE
              
              MemberProfile has its own header.
              Therefore MemberLayout is NOT used here.
          ================================================= */}

<Route path="/member-profile/:uid" element={<MemberProfile />} />
          {/* =================================================
              MAIN PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={
              <MemberLayout>
                <Profile />
              </MemberLayout>
            }
          />
         

          
          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <Route
            path="/member/profile/personal-information"
            element={
              <MemberLayout>
                <PersonalInformation />
              </MemberLayout>
            }
          />

          {/* =================================================
              DATING PREFERENCES
          ================================================= */}

          <Route
            path="/member/profile/dating-preferences"
            element={
              <MemberLayout>
                <DatingPreferences />
              </MemberLayout>
            }
          />

          {/* =================================================
              LOCATION & DISCOVERY
          ================================================= */}

          <Route
            path="/member/profile/location-discovery"
            element={
              <MemberLayout>
                <LocationDiscovery />
              </MemberLayout>
            }
          />

          {/* =================================================
              NOTIFICATION SETTINGS
          ================================================= */}

          <Route
            path="/member/profile/notifications"
            element={
              <MemberLayout>
                <NotificationSettings />
              </MemberLayout>
            }
          />

          {/* =================================================
              ACCOUNT & SECURITY
          ================================================= */}

          <Route
            path="/member/profile/account-security"
            element={
              <MemberLayout>
                <AccountSecurity />
              </MemberLayout>
            }
          />

          {/* =================================================
              PRIVACY
          ================================================= */}

          <Route
            path="/member/profile/privacy"
            element={
              <MemberLayout>
                <Privacy />
              </MemberLayout>
            }
          />

          {/* =================================================
              APP PREFERENCES
          ================================================= */}

<Route
  path="/member/profile/app-preferences"
  element={
    <MemberLayout>
      <NewAppPreferences />
    </MemberLayout>
  }
/>
          {/* =================================================
              HELP & SUPPORT
          ================================================= */}

          <Route
            path="/member/profile/help-support"
            element={
              <MemberLayout>
                <HelpSupport />
              </MemberLayout>
            }
          />

          {/* =================================================
              CHAT
          ================================================= */}

          <Route
            path="/chat"
            element={
              <MemberLayout>
                <Chat />
              </MemberLayout>
            }
          />

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Route
            path="/notifications"
            element={
              <MemberLayout>
                <Notifications />
              </MemberLayout>
            }
          />

          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>

      </BrowserRouter>

    </AppPreferencesProvider>
  );
}

export default App;
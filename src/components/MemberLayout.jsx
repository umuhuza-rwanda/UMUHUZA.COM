import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function MemberLayout({ children }) {
  // =====================================================
  // AUTH STATE
  // =====================================================

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CHECK SUPABASE SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      console.log("🔐 UMUHUZA: Checking saved Supabase session...");

      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error(
          "❌ Error restoring Supabase session:",
          error
        );

        setSession(null);
        setLoading(false);
        return;
      }

      console.log(
        "🔐 Restored session:",
        data?.session ? "YES ✅" : "NO ❌"
      );

      if (data?.session?.user) {
        console.log(
          "👤 Restored user:",
          data.session.user.id
        );
      }

      setSession(data?.session || null);
      setLoading(false);
    };

    checkSession();

    // ===================================================
    // LISTEN FOR AUTH CHANGES
    // ===================================================

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log(
          "🔐 Supabase auth event:",
          _event
        );

        if (!mounted) return;

        setSession(newSession);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // =====================================================
  // WAIT FOR SESSION RESTORATION
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontSize: "32px",
          }}
        >
          ❤️
        </div>

        <div>
          Loading UMUHUZA...
        </div>
      </div>
    );
  }

  // =====================================================
  // NO SESSION
  // =====================================================

  if (!session) {
    console.log(
      "❌ No Supabase session → returning to Home"
    );

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // =====================================================
  // AUTHENTICATED
  // =====================================================

  console.log(
    "✅ Supabase session active → Member Area"
  );

  return (
    <>
      {children}
    </>
  );
}

export default MemberLayout;
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function SupabaseTest() {
  const [result, setResult] = useState("Testing...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function testSupabase() {
      console.log("========== SUPABASE AUTH TEST ==========");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("User:", user);
      console.log("Error:", error);

      if (error) {
        setResult("❌ Error getting Supabase user");
        setDetails(
          JSON.stringify(
            {
              message: error.message,
              name: error.name,
              status: error.status,
              code: error.code,
            },
            null,
            2
          )
        );
        return;
      }

      if (!user) {
        setResult("⚠️ Supabase is connected, but no user is logged in.");
        setDetails("Please log in with a Supabase account.");
        return;
      }

      setResult("✅ Supabase authentication is working!");
      setDetails(
        JSON.stringify(
          {
            id: user.id,
            email: user.email,
          },
          null,
          2
        )
      );
    }

    testSupabase();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Supabase Test</h1>

      <h2>{result}</h2>

      <pre
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {details}
      </pre>
    </div>
  );
}
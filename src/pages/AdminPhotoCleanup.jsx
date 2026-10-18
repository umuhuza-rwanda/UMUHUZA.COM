import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

// =====================================================
// ADMIN ONLY
// =====================================================
const ADMIN_EMAILS = ["evijecarif57@gmail.com"];

const PROFILE_BUCKET = "profile-photos";
const MIN_SIZE_TO_FIX = 150 * 1024; // only fix ≥ 150 KB
const MAX_MAIN_SIZE = 100 * 1024;
const TARGET_MAIN_SIZE = 50 * 1024;
const MAX_THUMB_SIZE = 50 * 1024;
const TARGET_THUMB_SIZE = 30 * 1024;
const MAIN_DIMENSION = 1000;
const THUMB_DIMENSION = 360;

// =====================================================
// COMPRESS MAIN
// =====================================================
const compressMain = (file) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        let width = image.naturalWidth;
        let height = image.naturalHeight;

        if (width > MAIN_DIMENSION || height > MAIN_DIMENSION) {
          const scale = Math.min(
            MAIN_DIMENSION / width,
            MAIN_DIMENSION / height
          );
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);

        const qualities = [0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3];

        const run = async () => {
          let best = null;
          for (const q of qualities) {
            const blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), "image/jpeg", q)
            );
            if (!blob) continue;
            if (blob.size <= TARGET_MAIN_SIZE) {
              resolve(
                new File([blob], "main.jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
              return;
            }
            if (blob.size < MAX_MAIN_SIZE) best = blob;
          }

          if (best) {
            resolve(
              new File([best], "main.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
            return;
          }

          let w = width;
          let h = height;
          while (w > 400 && h > 400) {
            w = Math.round(w * 0.85);
            h = Math.round(h * 0.85);
            canvas.width = w;
            canvas.height = h;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(image, 0, 0, w, h);
            const blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), "image/jpeg", 0.5)
            );
            if (blob && blob.size < MAX_MAIN_SIZE) {
              resolve(
                new File([blob], "main.jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
              return;
            }
          }

          reject(new Error("Could not compress under 100 KB"));
        };

        run().catch(reject);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to load image"));
    };

    image.src = objectUrl;
  });
};

// =====================================================
// COMPRESS THUMB
// =====================================================
const compressThumb = (file) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        let width = image.naturalWidth;
        let height = image.naturalHeight;

        if (width > THUMB_DIMENSION || height > THUMB_DIMENSION) {
          const scale = Math.min(
            THUMB_DIMENSION / width,
            THUMB_DIMENSION / height
          );
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);

        const qualities = [0.7, 0.6, 0.5, 0.45, 0.4, 0.35];

        const run = async () => {
          let best = null;
          for (const q of qualities) {
            const blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), "image/jpeg", q)
            );
            if (!blob) continue;
            if (blob.size <= TARGET_THUMB_SIZE) {
              resolve(
                new File([blob], "thumb.jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
              return;
            }
            if (blob.size <= MAX_THUMB_SIZE) best = blob;
          }

          if (best) {
            resolve(
              new File([best], "thumb.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
            return;
          }

          const blob = await new Promise((res) =>
            canvas.toBlob((b) => res(b), "image/jpeg", 0.3)
          );
          if (blob && blob.size < 70 * 1024) {
            resolve(
              new File([blob], "thumb.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
            return;
          }

          reject(new Error("Could not create thumb"));
        };

        run().catch(reject);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to load image for thumb"));
    };

    image.src = objectUrl;
  });
};

// =====================================================
// PAGE
// =====================================================
function AdminPhotoCleanup() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  const [profiles, setProfiles] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    fixed: 0,
    skipped: 0,
    failed: 0,
  });

  const addLog = (message) => {
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()} — ${message}`,
      ...prev,
    ]);
  };

  // Auth + admin check
  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user);

      if (!user) {
        navigate("/login");
        return;
      }

      const email = (user.email || "").toLowerCase().trim();
      const isAdmin = ADMIN_EMAILS.some(
        (e) => e.toLowerCase().trim() === email
      );

      if (!isAdmin) {
        setAllowed(false);
        setChecking(false);
        navigate("/member-home");
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    check();
  }, [navigate]);

  const loadProfiles = async () => {
    setLoadingList(true);
    addLog("Loading profiles...");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, profile_photo_url, profile_photo_thumb_url")
      .eq("profile_completed", true)
      .not("profile_photo_url", "is", null);

    if (error) {
      addLog("Error loading profiles: " + error.message);
      setLoadingList(false);
      return;
    }

    setProfiles(data || []);
    addLog(`Loaded ${(data || []).length} profiles with photos.`);
    setLoadingList(false);
  };

  const processOne = async (profile) => {
    const url = profile.profile_photo_url;
    if (!url) {
      setStats((s) => ({ ...s, skipped: s.skipped + 1 }));
      return;
    }

    // Skip if already has a real thumb URL (optional — still fix large mains)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Fetch failed " + response.status);
      }

      const blob = await response.blob();
      const sizeKb = Math.round(blob.size / 1024);

      if (blob.size < MIN_SIZE_TO_FIX) {
        addLog(
          `SKIP ${profile.full_name || profile.id} — ${sizeKb} KB (already small)`
        );
        setStats((s) => ({ ...s, skipped: s.skipped + 1 }));
        return;
      }

      addLog(
        `FIX ${profile.full_name || profile.id} — ${sizeKb} KB → compressing...`
      );

      const file = new File([blob], "photo.jpg", {
        type: blob.type || "image/jpeg",
      });

      const mainFile = await compressMain(file);
      const thumbFile = await compressThumb(file);

      const base = `${profile.id}/${Date.now()}-cleanup`;
      const mainPath = `${base}.jpg`;
      const thumbPath = `${base}-thumb.jpg`;

      const { error: mainErr } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(mainPath, mainFile, {
          cacheControl: "86400",
          upsert: false,
          contentType: "image/jpeg",
        });

      if (mainErr) throw mainErr;

      const { error: thumbErr } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(thumbPath, thumbFile, {
          cacheControl: "86400",
          upsert: false,
          contentType: "image/jpeg",
        });

      if (thumbErr) throw thumbErr;

      const { data: mainData } = supabase.storage
        .from(PROFILE_BUCKET)
        .getPublicUrl(mainPath);

      const { data: thumbData } = supabase.storage
        .from(PROFILE_BUCKET)
        .getPublicUrl(thumbPath);

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          profile_photo_url: mainData.publicUrl,
          profile_photo_thumb_url: thumbData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateErr) throw updateErr;

      addLog(
        `OK ${profile.full_name || profile.id} — main ${Math.round(
          mainFile.size / 1024
        )} KB, thumb ${Math.round(thumbFile.size / 1024)} KB`
      );
      setStats((s) => ({ ...s, fixed: s.fixed + 1 }));
    } catch (err) {
      console.error(err);
      addLog(
        `FAIL ${profile.full_name || profile.id} — ${err.message || err}`
      );
      setStats((s) => ({ ...s, failed: s.failed + 1 }));
    }
  };

  const runCleanup = async () => {
    if (!profiles.length) {
      addLog("Load profiles first.");
      return;
    }

    setRunning(true);
    setStats({ fixed: 0, skipped: 0, failed: 0 });
    addLog("Starting cleanup (only photos ≥ 150 KB)...");

    for (const profile of profiles) {
      if (!running && stats.fixed + stats.skipped + stats.failed > 0) {
        // allow stop only between items — simplified: run all
      }
      await processOne(profile);
      // small pause to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    addLog("Cleanup finished.");
    setRunning(false);
  };

  if (checking) {
    return (
      <div style={{ padding: 24, color: "#fff" }}>Checking admin access...</div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a1a",
        color: "#f3e8ff",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/member-home")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          background: "transparent",
          border: "1px solid #7c3aed",
          color: "#e9d5ff",
          padding: "8px 14px",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        <FiArrowLeft /> Back
      </button>

      <h1 style={{ margin: "0 0 8px" }}>Admin — Photo Cleanup</h1>
      <p style={{ color: "#c4b5fd", marginBottom: 20 }}>
        Re-compress profile photos ≥ 150 KB. Creates main (≤ 100 KB) + thumb
        (20–50 KB).
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          type="button"
          onClick={loadProfiles}
          disabled={loadingList || running}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "#7c3aed",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loadingList ? "Loading..." : "1. Load profiles"}
        </button>

        <button
          type="button"
          onClick={runCleanup}
          disabled={running || !profiles.length}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: running ? "#6b7280" : "#db2777",
            color: "#fff",
            fontWeight: 700,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Running..." : "2. Start cleanup"}
        </button>
      </div>

      <div style={{ marginBottom: 16, color: "#ddd6fe" }}>
        Profiles loaded: <strong>{profiles.length}</strong>
        {" · "}
        Fixed: <strong>{stats.fixed}</strong>
        {" · "}
        Skipped: <strong>{stats.skipped}</strong>
        {" · "}
        Failed: <strong>{stats.failed}</strong>
      </div>

      <div
        style={{
          background: "#1a1028",
          borderRadius: 12,
          padding: 16,
          maxHeight: 420,
          overflow: "auto",
          fontSize: 13,
          lineHeight: 1.5,
          border: "1px solid #4c1d95",
        }}
      >
        {logs.length === 0 ? (
          <span style={{ color: "#a78bfa" }}>
            Logs will appear here. Load profiles, then start cleanup.
          </span>
        ) : (
          logs.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>

      <p style={{ marginTop: 16, fontSize: 13, color: "#a78bfa" }}>
        Logged in as: {currentUser?.email}
      </p>
    </div>
  );
}

export default AdminPhotoCleanup;
import "./Profile.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiUser,
  FiHeart,
  FiMapPin,
  FiBell,
  FiLock,
  FiShield,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiTrash2,
  FiCamera,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiMail,
  FiUpload,
  FiCheckCircle,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";
import { useAppPreferences } from "../../context/AppPreferencesContext";

const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4 MB

function Profile() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  // =====================================================
  // AUTH
  // =====================================================
  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setCurrentUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setCurrentUser(session?.user ?? null);
          if (!session?.user) {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // LOAD PROFILE
  // =====================================================
  useEffect(() => {
    if (!currentUser) return;

    let active = true;
    setLoading(true);
    setError("");

    const loadProfile = async () => {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!active) return;

      if (fetchError) {
        console.error(fetchError);
        setError("Unable to load your profile.");
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({ id: currentUser.id, ...data });
      } else {
        setProfile({
          id: currentUser.id,
          firstName: currentUser.user_metadata?.full_name || "",
          email: currentUser.email || "",
        });
      }

      setLoading(false);
    };

    loadProfile();

    const channel = supabase
      .channel(`profile-${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${currentUser.id}`,
        },
        () => loadProfile()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // =====================================================
  // UPLOAD PHOTO TO SUPABASE STORAGE
  // =====================================================
  const openPhotoPicker = () => {
    setPhotoError("");
    fileInputRef.current?.click();
  };

  // =====================================================
// COMPRESS IMAGE (reduces size to ~200-300KB)
// =====================================================
const compressImage = (file, quality = 0.7, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            // Create a new File from the blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality // 0.7 = good balance between quality and size
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
  });
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file || !currentUser) return;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    setPhotoError("Only JPG, PNG, and WEBP images are allowed.");
    event.target.value = "";
    return;
  }

  try {
    setUploadingPhoto(true);
    setPhotoError("");

    // ===============================
    // 1. Compress the image
    // ===============================
    const compressedFile = await compressImage(file, 0.7, 800); // quality 0.7, max width 800px

    // ===============================
    // 2. Upload compressed file
    // ===============================
    const fileExt = "jpg"; // force jpg for better compression
    const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, compressedFile, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(uploadError.message || "Upload failed");
    }

    // ===============================
    // 3. Get public URL
    // ===============================
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // ===============================
    // 4. Save URL in profiles table
    // ===============================
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        profile_photo_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentUser.id);

    if (updateError) throw updateError;

    // Update UI
    setProfile((prev) => ({
      ...prev,
      profile_photo_url: publicUrl,
    }));
  } catch (err) {
    console.error("Photo upload error:", err);
    setPhotoError(err.message || "Unable to upload photo.");
  } finally {
    setUploadingPhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

  // =====================================================
  // DELETE PHOTO
  // =====================================================
  const handleDeletePhoto = async () => {
    if (!currentUser || !profile?.profile_photo_url) return;

    const confirmed = window.confirm("Are you sure you want to delete your profile photo?");
    if (!confirmed) return;

    try {
      setUploadingPhoto(true);
      setPhotoError("");

      // Remove from profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          profile_photo_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        profile_photo_url: null,
      }));
    } catch (err) {
      console.error("Delete photo error:", err);
      setPhotoError(err.message || "Unable to delete photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // =====================================================
  // PROFILE COMPLETION
  // =====================================================
  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      { value: profile.full_name || profile.firstName, weight: 10 },
      { value: profile.gender, weight: 10 },
      { value: profile.date_of_birth || profile.dateOfBirth, weight: 10 },
      { value: profile.country, weight: 10 },
      { value: profile.city, weight: 10 },
      { value: profile.looking_for || profile.lookingFor, weight: 10 },
      { value: profile.looking_for_gender || profile.lookingForGender, weight: 10 },
      { value: profile.profile_photo_url, weight: 15 },
      { value: profile.about || profile.aboutYou, weight: 15 },
    ];

    let percentage = 0;
    fields.forEach((field) => {
      if (field.value !== undefined && field.value !== null && String(field.value).trim() !== "") {
        percentage += field.weight;
      }
    });

    return Math.min(percentage, 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const getCompletionMessage = () => {
    if (profileCompletion >= 100) return t("profileComplete") || "Your profile is complete!";
    if (profileCompletion >= 80) return t("almostThere") || "Almost there!";
    if (profileCompletion >= 50) return t("profileLookingGood") || "Looking good!";
    return t("completeProfile") || "Complete your profile to get better matches.";
  };

  // =====================================================
  // DISPLAY HELPERS
  // =====================================================
  const profilePhoto = profile?.profile_photo_url || null;

  const displayName =
    profile?.full_name ||
    profile?.firstName ||
    profile?.name ||
    currentUser?.user_metadata?.full_name ||
    "UMUHUZA Member";

  const locationText = [profile?.city, profile?.country].filter(Boolean).join(", ");

  // =====================================================
  // ACTIONS
  // =====================================================
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Unable to sign out.");
      setSigningOut(false);
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================
  if (!currentUser && !loading) {
    return (
      <div className="profile-page">
        <div className="profile-empty-card">
          <div className="profile-empty-icon">❤️</div>
          <h2>Please log in</h2>
          <p>You need to be logged in to view your UMUHUZA profile.</p>
          <button
            type="button"
            className="profile-primary-btn"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading-card">
          <div className="profile-loading-icon">❤️</div>
          <h2>Loading Your Profile...</h2>
          <p>We're getting your UMUHUZA profile ready.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-back-btn"
          onClick={() => navigate("/member-home")}
        >
          <FiArrowLeft />
          <span>{t("back") || "Back"}</span>
        </button>

        <div className="profile-brand">❤️ UMUHUZA</div>

        <div className="profile-header-title">
          <FiUser />
          <span>{t("profile") || "Profile"}</span>
        </div>
      </header>

      {error && <div className="profile-error">{error}</div>}

      <main className="profile-main">
        <section className="profile-hero-card">
          {/* PHOTO */}
          <div className="profile-photo-container">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={displayName}
                className="profile-main-photo"
              />
            ) : (
              <div className="profile-photo-placeholder">
                <FiUser />
              </div>
            )}

            <button
              type="button"
              className="profile-camera-btn"
              onClick={openPhotoPicker}
              disabled={uploadingPhoto}
              title="Upload profile photo"
            >
              <FiCamera />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </div>

<div className="profile-photo-actions">

  {/* CHANGE PHOTO */}
  <button
    type="button"
    className="profile-upload-btn profile-change-photo-btn"
    onClick={openPhotoPicker}
    disabled={uploadingPhoto}
  >
    <FiCamera />
    {uploadingPhoto ? "Uploading..." : "Change Photo"}
  </button>

  {/* DELETE PHOTO */}
  <button
    type="button"
    className="profile-upload-btn profile-delete-photo-btn"
    onClick={handleDeletePhoto}
    disabled={uploadingPhoto || !profilePhoto}
  >
    <FiTrash2 />
    {uploadingPhoto ? "Deleting..." : "Delete Photo"}
  </button>

  {/* VIEW PHOTO */}
  <button
    type="button"
    className="profile-upload-btn profile-view-photo-btn"
    onClick={() => {
      if (profilePhoto) {
        window.open(profilePhoto, "_blank", "noopener,noreferrer");
      }
    }}
    disabled={!profilePhoto}
  >
    <FiEye />
    View Photo
  </button>

</div>

          {photoError && <div className="profile-photo-error">{photoError}</div>}

          {/* INFO */}
          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h1>{displayName}</h1>
              {profile?.email && (
                <span className="profile-email-badge">
                  <FiMail />
                  {t("verifiedAccount") || "Verified"}
                </span>
              )}
            </div>

            {locationText && (
              <p className="profile-location">
                <FiMapPin /> {locationText}
              </p>
            )}

            {profile?.age && (
              <p className="profile-age">
                {profile.age} {t("yearsOld") || "years old"}
              </p>
            )}

            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => navigate("/member/profile/personal-information")}
            >
              <FiUser />
              {t("editProfile") || "Edit Profile"}
            </button>
          </div>

          {/* COMPLETION */}
          <div className="profile-completion">
            <div className="completion-top">
              <div>
                <span className="completion-label">
                  {t("profileCompletion") || "Profile Completion"}
                </span>
                <strong>{profileCompletion}%</strong>
              </div>
              {profileCompletion >= 100 && <FiCheckCircle />}
            </div>
            <div className="completion-bar">
              <div
                className="completion-progress"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p>{getCompletionMessage()}</p>
          </div>
        </section>

        {/* SETTINGS LIST */}
        <section className="profile-settings-card">
          <div className="settings-heading">
            <span>{t("accountSettings") || "ACCOUNT SETTINGS"}</span>
            <h2>{t("manageAccount") || "Manage Your Account"}</h2>
            <p>{t("manageAccountDescription") || "Update your information and control your experience."}</p>
          </div>

          <div className="settings-list">
            {[
              { path: "/member/profile/personal-information", icon: <FiUser />, title: "Personal Information", desc: "Name, age, gender...", className: "personal" },
              { path: "/member/profile/dating-preferences", icon: <FiHeart />, title: "Dating Preferences", desc: "What you're looking for", className: "dating" },
              { path: "/member/profile/location-discovery", icon: <FiMapPin />, title: "Location & Discovery", desc: "Nearby and discovery settings", className: "location" },
              { path: "/member/profile/notifications", icon: <FiBell />, title: "Notifications", desc: "Control notifications", className: "notifications" },
              { path: "/member/profile/account-security", icon: <FiLock />, title: "Account & Security", desc: "Password and security", className: "security" },
              { path: "/member/profile/privacy", icon: <FiShield />, title: "Privacy", desc: "Profile visibility", className: "privacy" },
              { path: "/member/profile/app-preferences", icon: <FiSettings />, title: "App Preferences", desc: "Language and appearance", className: "preferences" },
              { path: "/member/profile/help-support", icon: <FiHelpCircle />, title: "Help & Support", desc: "Get help", className: "help" },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                className="settings-row"
                onClick={() => navigate(item.path)}
              >
                <div className={`settings-icon ${item.className}`}>{item.icon}</div>
                <div className="settings-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <FiChevronRight className="settings-arrow" />
              </button>
            ))}
          </div>
        </section>

        {/* ACCOUNT ACTIONS */}
        <section className="profile-account-actions">
          <button
            type="button"
            className="profile-signout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <FiLogOut />
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>

          <button
            type="button"
            className="profile-delete-btn"
            onClick={() => navigate("/member/profile/account-security")}
          >
            <FiTrash2 />
            Delete Account
          </button>
        </section>

        <footer className="profile-footer">
          <div className="profile-footer-heart">❤️</div>
          <strong>UMUHUZA</strong>
          <p>Meaningful connections. Genuine people.</p>
        </footer>
      </main>
    </div>
  );
}

export default Profile;
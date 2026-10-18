import "./Auth.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { FiImage, FiCamera, FiUser } from "react-icons/fi";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useAppPreferences } from "../../context/AppPreferencesContext";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { supabase } from "../../lib/supabase";

function ProfileSetup() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();

  // =====================================================
  // SETTINGS
  // =====================================================
  const PROFILE_BUCKET = "profile-photos";

  // Hard max — never upload above this
  const MAX_COMPRESSED_SIZE = 100 * 1024; // 100 KB

  // Preferred target — compress toward this when possible
  const TARGET_COMPRESSED_SIZE = 50 * 1024; // ~50 KB

  const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 1000; // was 1600 — smaller = less data
  // =====================================================
  // STATE
  // =====================================================
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // INTERESTS (translated)
  // =====================================================
  const interests = [
    { value: "Love", label: t("interest.love") || "❤️ Love" },
    { value: "Music", label: t("interest.music") || "🎵 Music" },
    { value: "Travel", label: t("interest.travel") || "✈️ Travel" },
    { value: "Sports", label: t("interest.sports") || "⚽ Sports" },
    { value: "Reading", label: t("interest.reading") || "📚 Reading" },
    { value: "Movies", label: t("interest.movies") || "🎬 Movies" },
    { value: "Cooking", label: t("interest.cooking") || "🍳 Cooking" },
    { value: "Nature", label: t("interest.nature") || "🌿 Nature" },
    { value: "Dancing", label: t("interest.dancing") || "💃 Dancing" },
    { value: "Fitness", label: t("interest.fitness") || "🏋️ Fitness" },
    { value: "Faith", label: t("interest.faith") || "🙏 Faith" },
    { value: "Art", label: t("interest.art") || "🎨 Art" },
  ];

  // =====================================================
  // IMAGE COMPRESSION
  // =====================================================
  // =====================================================
  // IMAGE COMPRESSION (max 100 KB, prefer ~50 KB)
  // =====================================================
  const compressImage = (file, maxSize = MAX_COMPRESSED_SIZE) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No image selected."));
        return;
      }

      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);

          let width = image.naturalWidth;
          let height = image.naturalHeight;

          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            const scale = Math.min(
              MAX_IMAGE_DIMENSION / width,
              MAX_IMAGE_DIMENSION / height
            );
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(
              new Error("Your browser does not support image compression.")
            );
            return;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          // Prefer lower quality first so we land near ~50 KB
          const qualities = [
            0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3,
          ];

          const createBlob = (quality) =>
            new Promise((blobResolve) => {
              canvas.toBlob(
                (blob) => blobResolve(blob),
                "image/jpeg",
                quality
              );
            });

          const compressWithQuality = async () => {
            let bestUnderMax = null;

            for (const quality of qualities) {
              const blob = await createBlob(quality);
              if (!blob) continue;

              // Ideal: under ~50 KB
              if (blob.size <= TARGET_COMPRESSED_SIZE) {
                resolve(
                  new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                    { type: "image/jpeg", lastModified: Date.now() }
                  )
                );
                return;
              }

              // Keep best result under hard max (100 KB)
              if (blob.size < maxSize) {
                bestUnderMax = blob;
              }
            }

            if (bestUnderMax) {
              resolve(
                new File(
                  [bestUnderMax],
                  file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                  { type: "image/jpeg", lastModified: Date.now() }
                )
              );
              return;
            }

            // Still too big → shrink dimensions
            let currentWidth = width;
            let currentHeight = height;

            while (currentWidth > 400 && currentHeight > 400) {
              currentWidth = Math.round(currentWidth * 0.85);
              currentHeight = Math.round(currentHeight * 0.85);
              canvas.width = currentWidth;
              canvas.height = currentHeight;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, currentWidth, currentHeight);
              ctx.drawImage(image, 0, 0, currentWidth, currentHeight);

              const blob = await createBlob(0.55);
              if (blob && blob.size <= TARGET_COMPRESSED_SIZE) {
                resolve(
                  new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                    { type: "image/jpeg", lastModified: Date.now() }
                  )
                );
                return;
              }
              if (blob && blob.size < maxSize) {
                resolve(
                  new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                    { type: "image/jpeg", lastModified: Date.now() }
                  )
                );
                return;
              }
            }

            const finalBlob = await createBlob(0.3);
            if (!finalBlob || finalBlob.size >= maxSize) {
              reject(
                new Error(
                  "This image could not be compressed below 100 KB."
                )
              );
              return;
            }

            resolve(
              new File(
                [finalBlob],
                file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                { type: "image/jpeg", lastModified: Date.now() }
              )
            );
          };

          compressWithQuality().catch(reject);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to read this image."));
      };

      image.src = objectUrl;
    });
  };


    // =====================================================
  // THUMB COMPRESSION (20–50 KB for member cards)
  // =====================================================
  const MAX_THUMB_SIZE = 50 * 1024; // hard max 50 KB
  const TARGET_THUMB_SIZE = 30 * 1024; // prefer ~30 KB
  const THUMB_DIMENSION = 360;

  const compressThumb = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No image for thumb."));
        return;
      }

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
            reject(new Error("Thumb compression not supported."));
            return;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          const qualities = [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35];

          const createBlob = (quality) =>
            new Promise((res) =>
              canvas.toBlob((b) => res(b), "image/jpeg", quality)
            );

          const run = async () => {
            let best = null;

            for (const q of qualities) {
              const blob = await createBlob(q);
              if (!blob) continue;

              if (blob.size <= TARGET_THUMB_SIZE) {
                resolve(
                  new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + "-thumb.jpg",
                    { type: "image/jpeg", lastModified: Date.now() }
                  )
                );
                return;
              }

              if (blob.size <= MAX_THUMB_SIZE) {
                best = blob;
              }
            }

            if (best) {
              resolve(
                new File(
                  [best],
                  file.name.replace(/\.[^/.]+$/, "") + "-thumb.jpg",
                  { type: "image/jpeg", lastModified: Date.now() }
                )
              );
              return;
            }

            // Shrink more if still large
            let w = width;
            let h = height;
            while (w > 200 && h > 200) {
              w = Math.round(w * 0.85);
              h = Math.round(h * 0.85);
              canvas.width = w;
              canvas.height = h;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, w, h);
              ctx.drawImage(image, 0, 0, w, h);

              const blob = await createBlob(0.45);
              if (blob && blob.size <= MAX_THUMB_SIZE) {
                resolve(
                  new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + "-thumb.jpg",
                    { type: "image/jpeg", lastModified: Date.now() }
                  )
                );
                return;
              }
            }

            const finalBlob = await createBlob(0.3);
            if (!finalBlob || finalBlob.size > 70 * 1024) {
              reject(new Error("Could not create small card image."));
              return;
            }

            resolve(
              new File(
                [finalBlob],
                file.name.replace(/\.[^/.]+$/, "") + "-thumb.jpg",
                { type: "image/jpeg", lastModified: Date.now() }
              )
            );
          };

          run().catch(reject);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to create thumb."));
      };

      image.src = objectUrl;
    });
  };
  // =====================================================
  // CLEAN PREVIEW URLS
  // =====================================================
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo?.preview) URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photos]);

  // =====================================================
  // TAKE PHOTO
  // =====================================================
  const takePhotoWithCamera = async (photoIndex) => {
    try {
      setError("");
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!photo.dataUrl) throw new Error("Unable to capture photo.");

      const response = await fetch(photo.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `umuhuza-camera-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const compressedFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressedFile);

      setPhotos((current) => {
        const updated = [...current];
        if (updated[photoIndex]?.preview) URL.revokeObjectURL(updated[photoIndex].preview);
        updated[photoIndex] = { file: compressedFile, preview: previewUrl };
        return updated;
      });
    } catch (err) {
      if (err?.message?.includes("cancel")) return;
      setError(err?.message || t("profileSetup.errorCamera") || "Unable to take a photo.");
    }
  };

  // =====================================================
  // PHOTO FROM GALLERY
  // =====================================================
  const handlePhotoChange = async (event, photoIndex) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(t("profileSetup.errorInvalidImage") || "Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_ORIGINAL_SIZE) {
      setError(t("profileSetup.errorImageTooLarge") || "This image is too large (max 20 MB).");
      event.target.value = "";
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      if (compressedFile.size > MAX_COMPRESSED_SIZE) {
        setError(
          t("profileSetup.errorCompress") ||
            "Image could not be compressed below 100 KB."
        );
        event.target.value = "";
        return;
      }

      const preview = URL.createObjectURL(compressedFile);
      setPhotos((current) => {
        const updated = [...current];
        if (updated[photoIndex]?.preview) URL.revokeObjectURL(updated[photoIndex].preview);
        updated[photoIndex] = { file: compressedFile, preview };
        return updated;
      });
    } catch (err) {
      setError(err?.message || t("profileSetup.errorCompress") || "Unable to compress this image.");
    }

    event.target.value = "";
  };

  // =====================================================
  // REMOVE PHOTO
  // =====================================================
  const handleRemovePhoto = (photoIndex) => {
    setPhotos((current) => {
      const updated = [...current];
      if (updated[photoIndex]?.preview) URL.revokeObjectURL(updated[photoIndex].preview);
      updated[photoIndex] = null;
      return updated;
    });
    setError("");
  };

  // =====================================================
  // SELECT INTEREST
  // =====================================================
  const handleInterestClick = (value) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  // =====================================================
  // UPLOAD HELPERS
  // =====================================================
  const createPhotoPath = (userId, index) => {
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${userId}/${Date.now()}-${index}-${randomPart}.jpg`;
  };

const uploadProfilePhoto = async (userId, photo, index) => {
  if (!photo?.file) return null;

  const randomPart = Math.random().toString(36).substring(2, 10);
  const base = `${userId}/${Date.now()}-${index}-${randomPart}`;

  // -------- MAIN (≤ 100 KB, already compressed) --------
  const mainPath = `${base}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(mainPath, photo.file, {
      cacheControl: "86400",
      upsert: false,
      contentType: "image/jpeg",
    });

  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const { data: mainData } = supabase.storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(mainPath);

  if (!mainData?.publicUrl) {
    throw new Error("Unable to create profile photo URL.");
  }

  let thumbUrl = null;

  // -------- THUMB (20–50 KB) — only for main photo (index 0) --------
  if (index === 0) {
    try {
      const thumbFile = await compressThumb(photo.file);
      const thumbPath = `${base}-thumb.jpg`;

      const { error: thumbError } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(thumbPath, thumbFile, {
          cacheControl: "86400",
          upsert: false,
          contentType: "image/jpeg",
        });

      if (!thumbError) {
        const { data: thumbData } = supabase.storage
          .from(PROFILE_BUCKET)
          .getPublicUrl(thumbPath);
        thumbUrl = thumbData?.publicUrl || null;
      }
    } catch (thumbErr) {
      console.warn("Thumb upload skipped:", thumbErr);
      // fallback: use main if thumb fails
      thumbUrl = mainData.publicUrl;
    }
  }

  return {
    path: mainPath,
    url: mainData.publicUrl,   // main
    thumbUrl,                  // thumb (only index 0)
  };
};

  // =====================================================
  // FINISH PROFILE
  // =====================================================
  const handleFinishProfile = async () => {
    setError("");

    if (!photos[0]) {
      setError(t("profileSetup.errorMainPhoto") || "Please upload your main profile photo.");
      return;
    }

    if (selectedInterests.length === 0) {
      setError(t("profileSetup.errorInterests") || "Please select at least one interest.");
      return;
    }

    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(t("profileSetup.errorSession") || "Your account session has expired.");
      }

      const userId = userData.user.id;
      const uploadedPhotos = [];

      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index];
        if (!photo) continue;

        const uploaded = await uploadProfilePhoto(userId, photo, index);
        if (uploaded) uploadedPhotos.push({ index, ...uploaded });
      }



const mainPhoto = uploadedPhotos.find((p) => p.index === 0);
if (!mainPhoto) {
  throw new Error("Main profile photo could not be uploaded.");
}

const photoUrls = uploadedPhotos.map((p) => p.url);
const photoPaths = uploadedPhotos.map((p) => p.path);

const { error: profileError } = await supabase
  .from("profiles")
  .update({
    interests: selectedInterests,

    // MAIN → full profile
    profile_photo_url: mainPhoto.url,

    // THUMB → cards / lists
    profile_photo_thumb_url: mainPhoto.thumbUrl || mainPhoto.url,

    profile_photos: photoUrls,
    profile_photo_paths: photoPaths,
    profile_photo_count: uploadedPhotos.length,
    profile_completed: true,
    updated_at: new Date().toISOString(),
  })
  .eq("id", userId);

      if (profileError) throw profileError;

      navigate("/member-home", { replace: true });
    } catch (err) {
      console.error("Profile setup error:", err);
      setError(err?.message || t("profileSetup.errorGeneric") || "We couldn't save your profile.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-welcome">
          <div className="premium-logo">
            <img src={umurangaLogo} alt="UMUHUZA" />
          </div>

          <h1>
            {t("profileSetup.heroTitle") || "Create Your"}
            <br />
            {t("shyira ifoto kuri profile yawe ") || "UMUHUZA Profile"}
          </h1>

          <p>
            {t("profileSetup.heroSubtitle") ||
              "Show the real you and let genuine people discover you."}
          </p>

          <LanguageSwitcher />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-container">
          <div className="auth-form">

            <h2>{t("profileSetup.title") || "Build Your Profile"}</h2>
            <p className="auth-subtitle">
              {t("profileSetup.subtitle") || "Add your real photo and choose your interests."}
            </p>

            {/* STEP INDICATOR */}
            <div className="signup-progress">
              <div className="progress-step completed">
                <span>✓</span>
                <small>{t("signup.stepAccount") || "Account"}</small>
              </div>
              <div className="progress-line active-line"></div>
              <div className="progress-step completed">
                <span>✓</span>
                <small>{t("signup.stepAbout") || "About You"}</small>
              </div>
              <div className="progress-line active-line"></div>
              <div className="progress-step active">
                <span>3</span>
                <small>{t("signup.stepProfile") || "Profile"}</small>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {/* MAIN PHOTO */}
            <div className="profile-photo-section">
              <div className="profile-photo-placeholder">
                {photos[0] ? (
                  <img
                    src={photos[0].preview}
                    alt="Main profile"
                    className="profile-photo-preview"
                  />
                ) : (
                  <FiUser className="profile-placeholder-icon" />
                )}
                <div className="camera-icon">
                  <FiCamera />
                </div>
              </div>

              <div className="photo-text">
                <h3>
                  {t("profileSetup.mainPhoto") || "Main Profile Photo"}
                  <span style={{ color: "#E63946", marginLeft: 4 }}>*</span>
                </h3>
                <p>
                  {t("profileSetup.mainPhotoRequired") ||
                    "Your main photo is required and will be shown on your UMUHUZA profile."}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="upload-photo-btn"
                    onClick={() => takePhotoWithCamera(0)}
                    disabled={loading}
                  >
                    <FiCamera />
                    {photos[0]
                      ? t("profileSetup.retakePhoto") || "Retake Photo"
                      : t("profileSetup.takePhoto") || "Take Photo"}
                  </button>

                  <button
                    type="button"
                    className="upload-photo-btn"
                    onClick={() => document.getElementById("profile-photo-0")?.click()}
                    disabled={loading}
                  >
                    <FiImage />
                    {photos[0]
                      ? t("profileSetup.changePhoto") || "Change Photo"
                      : t("profileSetup.chooseGallery") || "Choose from Gallery"}
                  </button>
                </div>

                <input
                  id="profile-photo-0"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhotoChange(e, 0)}
                  disabled={loading}
                  style={{ display: "none" }}
                />

                <small style={{ display: "block", marginTop: 8, color: "#777" }}>
                  {t("profileSetup.compressNote") || "Images are automatically compressed to under 250 KB."}
                </small>
              </div>
            </div>

            {/* REAL PHOTO POLICY */}
            <div className="profile-completion" style={{ marginBottom: 25 }}>
              <div className="completion-header">
                <span>🛡️ {t("profileSetup.realPhotoPolicy") || "Real Profile Policy"}</span>
              </div>
              <small>
                <strong>{t("profileSetup.realPhotoText") || "Use your real photo."}</strong>{" "}
                {t("profileSetup.realPhotoDesc") ||
                  "UMUHUZA is for real people seeking real love and connections."}
              </small>
            </div>

            {/* INTERESTS */}
            <div className="form-group">
              <label>{t("profileSetup.interests") || "Your Interests"}</label>
              <div className="interest-options">
                {interests.map((interest) => {
                  const selected = selectedInterests.includes(interest.value);
                  return (
                    <button
                      key={interest.value}
                      type="button"
                      className={selected ? "selected-interest" : ""}
                      onClick={() => handleInterestClick(interest.value)}
                      disabled={loading}
                    >
                      {interest.label}
                      {selected && <span style={{ marginLeft: 5 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
              <small className="input-help">
                {t("profileSetup.interestsHelp") || "Choose the interests that describe you."}
              </small>
            </div>

            {/* FINISH BUTTON */}
            <button
              type="button"
              className="auth-primary-btn"
              onClick={handleFinishProfile}
              disabled={loading}
            >
              {loading
                ? t("profileSetup.saving") || "Saving Profile..."
                : t("profileSetup.finish") || "Finish Profile ❤️"}
            </button>

            {/* LOGIN */}
            <div className="auth-switch">
              <span>{t("signup.alreadyMember") || "Already a member?"}</span>
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                {t("signup.login") || "Login"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
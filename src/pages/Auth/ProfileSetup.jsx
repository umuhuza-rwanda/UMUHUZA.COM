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
  const MAX_COMPRESSED_SIZE = 250 * 1024;
  const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 1600;

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
            reject(new Error("Your browser does not support image compression."));
            return;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          const qualities = [0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3];

          const createBlob = (quality) =>
            new Promise((blobResolve) => {
              canvas.toBlob((blob) => blobResolve(blob), "image/jpeg", quality);
            });

          const compressWithQuality = async () => {
            for (const quality of qualities) {
              const blob = await createBlob(quality);
              if (blob && blob.size < maxSize) {
                resolve(
                  new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
                return;
              }
            }

            // Fallback: reduce dimensions
            let currentWidth = width;
            let currentHeight = height;
            while (currentWidth > 600 && currentHeight > 600) {
              currentWidth = Math.round(currentWidth * 0.85);
              currentHeight = Math.round(currentHeight * 0.85);
              canvas.width = currentWidth;
              canvas.height = currentHeight;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, currentWidth, currentHeight);
              ctx.drawImage(image, 0, 0, currentWidth, currentHeight);

              const blob = await createBlob(0.7);
              if (blob && blob.size < maxSize) {
                resolve(
                  new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
                return;
              }
            }

            const finalBlob = await createBlob(0.3);
            if (!finalBlob || finalBlob.size >= maxSize) {
              reject(new Error("This image could not be compressed below 250 KB."));
              return;
            }

            resolve(
              new File([finalBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
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
      if (compressedFile.size >= MAX_COMPRESSED_SIZE) {
        setError(t("profileSetup.errorCompress") || "Image could not be compressed below 250 KB.");
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

    const filePath = createPhotoPath(userId, index);
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_BUCKET)
      .upload(filePath, photo.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

    const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("Unable to create profile photo URL.");

    return { path: filePath, url: data.publicUrl };
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
      if (!mainPhoto) throw new Error("Main profile photo could not be uploaded.");

      const photoUrls = uploadedPhotos.map((p) => p.url);
      const photoPaths = uploadedPhotos.map((p) => p.path);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          interests: selectedInterests,
          profile_photo_url: mainPhoto.url,
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
            {t("profileSetup.heroTitle2") || "UMUHUZA Profile"}
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
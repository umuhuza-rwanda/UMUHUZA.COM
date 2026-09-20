import "./Auth.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import {
  FiCamera,
  FiUser,
  FiX,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function ProfileSetup() {
  const navigate = useNavigate();

  // =====================================================
  // SUPABASE STORAGE BUCKET
  // =====================================================

  const PROFILE_BUCKET = "profile-photos";

  // =====================================================
  // IMAGE COMPRESSION SETTINGS
  // =====================================================

  // FINAL uploaded image MUST be below this size.
  const MAX_COMPRESSED_SIZE = 250 * 1024;

  // Maximum original image accepted before compression.
  // This allows users to select large phone/camera photos.
  const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;

  // Maximum dimension of the compressed image.
  // This dramatically reduces large camera photos.
  const MAX_IMAGE_DIMENSION = 1600;

  // =====================================================
  // PROFILE PHOTOS
  // =====================================================

  const [photos, setPhotos] = useState([
    null,
    null,
    null,
    null,
  ]);

  // =====================================================
  // SELECTED INTERESTS
  // =====================================================

  const [selectedInterests, setSelectedInterests] =
    useState([]);

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // INTEREST OPTIONS
  // =====================================================

  const interests = [
    "❤️ Love",
    "🎵 Music",
    "✈️ Travel",
    "⚽ Sports",
    "📚 Reading",
    "🎬 Movies",
    "🍳 Cooking",
    "🌿 Nature",
    "💃 Dancing",
    "🏋️ Fitness",
    "🙏 Faith",
    "🎨 Art",
  ];

  // =====================================================
  // COMPRESS IMAGE
  // =====================================================

  const compressImage = (
    file,
    maxSize = MAX_COMPRESSED_SIZE
  ) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No image selected."));
        return;
      }

      const image = new Image();

      const objectUrl =
        URL.createObjectURL(file);

      image.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);

          let width = image.naturalWidth;
          let height = image.naturalHeight;

          // ---------------------------------------------
          // RESIZE IMAGE
          // ---------------------------------------------

          if (
            width > MAX_IMAGE_DIMENSION ||
            height > MAX_IMAGE_DIMENSION
          ) {
            const scale =
              Math.min(
                MAX_IMAGE_DIMENSION / width,
                MAX_IMAGE_DIMENSION / height
              );

            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas =
            document.createElement("canvas");

          const ctx =
            canvas.getContext("2d");

          if (!ctx) {
            reject(
              new Error(
                "Your browser does not support image compression."
              )
            );

            return;
          }

          canvas.width = width;
          canvas.height = height;

          // ---------------------------------------------
          // WHITE BACKGROUND
          // ---------------------------------------------
          //
          // This prevents transparent PNG images from
          // becoming black when converted to JPEG.
          //

          ctx.fillStyle = "#ffffff";

          ctx.fillRect(
            0,
            0,
            width,
            height
          );

          // ---------------------------------------------
          // DRAW IMAGE
          // ---------------------------------------------

          ctx.drawImage(
            image,
            0,
            0,
            width,
            height
          );

          // ---------------------------------------------
          // TRY DIFFERENT JPEG QUALITIES
          // ---------------------------------------------

          const qualities = [
            0.85,
            0.80,
            0.75,
            0.70,
            0.65,
            0.60,
            0.55,
            0.50,
            0.45,
            0.40,
            0.35,
            0.30,
          ];

          const createBlob = (
            quality
          ) => {
            return new Promise(
              (blobResolve) => {
                canvas.toBlob(
                  (blob) => {
                    blobResolve(blob);
                  },
                  "image/jpeg",
                  quality
                );
              }
            );
          };

          const compressWithQuality =
            async () => {
              // -----------------------------------------
              // FIRST TRY QUALITY REDUCTION
              // -----------------------------------------

              for (
                const quality of qualities
              ) {
                const blob =
                  await createBlob(
                    quality
                  );

                if (!blob) {
                  continue;
                }

                if (
                  blob.size <
                  maxSize
                ) {
                  const compressedFile =
                    new File(
                      [
                        blob,
                      ],
                      file.name.replace(
                        /\.[^/.]+$/,
                        ""
                      ) + ".jpg",
                      {
                        type:
                          "image/jpeg",
                        lastModified:
                          Date.now(),
                      }
                    );

                  resolve(
                    compressedFile
                  );

                  return;
                }
              }

              // -----------------------------------------
              // IF STILL TOO LARGE:
              // REDUCE DIMENSIONS
              // -----------------------------------------

              let currentWidth =
                width;

              let currentHeight =
                height;

              while (
                currentWidth > 600 &&
                currentHeight > 600
              ) {
                currentWidth =
                  Math.round(
                    currentWidth *
                      0.85
                  );

                currentHeight =
                  Math.round(
                    currentHeight *
                      0.85
                  );

                canvas.width =
                  currentWidth;

                canvas.height =
                  currentHeight;

                ctx.fillStyle =
                  "#ffffff";

                ctx.fillRect(
                  0,
                  0,
                  currentWidth,
                  currentHeight
                );

                ctx.drawImage(
                  image,
                  0,
                  0,
                  currentWidth,
                  currentHeight
                );

                const blob =
                  await createBlob(
                    0.70
                  );

                if (
                  blob &&
                  blob.size <
                    maxSize
                ) {
                  const compressedFile =
                    new File(
                      [
                        blob,
                      ],
                      file.name.replace(
                        /\.[^/.]+$/,
                        ""
                      ) + ".jpg",
                      {
                        type:
                          "image/jpeg",
                        lastModified:
                          Date.now(),
                      }
                    );

                  resolve(
                    compressedFile
                  );

                  return;
                }
              }

              // -----------------------------------------
              // FINAL FALLBACK
              // -----------------------------------------

              const finalBlob =
                await createBlob(
                  0.30
                );

              if (
                !finalBlob
              ) {
                reject(
                  new Error(
                    "Unable to compress image."
                  )
                );

                return;
              }

              if (
                finalBlob.size >=
                maxSize
              ) {
                reject(
                  new Error(
                    "This image could not be compressed below 250 KB. Please choose another photo."
                  )
                );

                return;
              }

              const compressedFile =
                new File(
                  [
                    finalBlob,
                  ],
                  file.name.replace(
                    /\.[^/.]+$/,
                    ""
                  ) + ".jpg",
                  {
                    type:
                      "image/jpeg",
                    lastModified:
                      Date.now(),
                  }
                );

              resolve(
                compressedFile
              );
            };

          compressWithQuality().catch(
            reject
          );
        } catch (compressionError) {
          URL.revokeObjectURL(
            objectUrl
          );

          reject(
            compressionError
          );
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            "Unable to read this image."
          )
        );
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
        if (photo?.preview) {
          URL.revokeObjectURL(
            photo.preview
          );
        }
      });
    };
  }, [photos]);

  // =====================================================
// TAKE PHOTO WITH PHONE CAMERA
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

    if (!photo.dataUrl) {
      throw new Error("Unable to capture photo.");
    }

    // Convert camera photo to File
    const response = await fetch(photo.dataUrl);
    const blob = await response.blob();

    const file = new File(
      [blob],
      `umuhuza-camera-${Date.now()}.jpg`,
      {
        type: "image/jpeg",
      }
    );

    // Use the same compression system already used by your website
    const compressedFile = await compressImage(
      file,
      MAX_COMPRESSED_SIZE
    );

    if (compressedFile.size > MAX_COMPRESSED_SIZE) {
      throw new Error(
        "The captured photo is still too large. Please try another photo."
      );
    }

    // Create preview
    const previewUrl = URL.createObjectURL(compressedFile);

    setPhotos((currentPhotos) => {
      const updatedPhotos = [...currentPhotos];

      // Remove previous preview URL
      if (updatedPhotos[photoIndex]?.preview) {
        URL.revokeObjectURL(updatedPhotos[photoIndex].preview);
      }

      updatedPhotos[photoIndex] = {
        file: compressedFile,
        preview: previewUrl,
      };

      return updatedPhotos;
    });

  } catch (error) {
    console.error("Camera error:", error);

    if (error?.message?.includes("cancel")) {
      return;
    }

    setError(
      error?.message ||
      "Unable to take a photo. Please check your camera permission."
    );
  }
};

  // =====================================================
  // PHOTO CHANGE
  // =====================================================

  const handlePhotoChange = async (
    event,
    photoIndex
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // =================================================
    // IMAGE TYPE VALIDATION
    // =================================================

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image."
      );

      event.target.value = "";

      return;
    }

    // =================================================
    // ORIGINAL FILE SIZE VALIDATION
    // =================================================
    //
    // IMPORTANT:
    // We DO NOT reject an 8 MB image anymore.
    // It will be compressed in the browser first.
    //

    if (
      file.size >
      MAX_ORIGINAL_SIZE
    ) {
      setError(
        "This image is too large. Please choose an image smaller than 20 MB."
      );

      event.target.value = "";

      return;
    }

    try {
      // =================================================
      // COMPRESS IMAGE BEFORE STORAGE
      // =================================================

      console.log(
        `Original image size: ${(
          file.size /
          1024
        ).toFixed(1)} KB`
      );

      const compressedFile =
        await compressImage(
          file
        );

      console.log(
        `Compressed image size: ${(
          compressedFile.size /
          1024
        ).toFixed(1)} KB`
      );

      // =================================================
      // FINAL SAFETY CHECK
      // =================================================

      if (
        compressedFile.size >=
        MAX_COMPRESSED_SIZE
      ) {
        setError(
          "The image could not be compressed below 250 KB. Please choose another photo."
        );

        event.target.value = "";

        return;
      }

      // =================================================
      // CREATE PREVIEW FROM COMPRESSED FILE
      // =================================================
      //
      // IMPORTANT:
      // The preview now also represents the compressed
      // image, not the original 8 MB image.
      //

      const preview =
        URL.createObjectURL(
          compressedFile
        );

      setPhotos(
        (currentPhotos) => {
          const updatedPhotos =
            [
              ...currentPhotos,
            ];

          // Revoke previous preview

          if (
            updatedPhotos[
              photoIndex
            ]?.preview
          ) {
            URL.revokeObjectURL(
              updatedPhotos[
                photoIndex
              ].preview
            );
          }

          updatedPhotos[
            photoIndex
          ] = {
            file:
              compressedFile,
            preview,
          };

          return updatedPhotos;
        }
      );

      setError("");
    } catch (compressionError) {
      console.error(
        "UMUHUZA IMAGE COMPRESSION ERROR:",
        compressionError
      );

      setError(
        compressionError?.message ||
          "Unable to compress this image. Please choose another photo."
      );
    }

    // =================================================
    // ALLOW SAME FILE TO BE SELECTED AGAIN
    // =================================================

    event.target.value = "";
  };

  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const handleRemovePhoto = (
    photoIndex
  ) => {
    setPhotos(
      (currentPhotos) => {
        const updatedPhotos =
          [
            ...currentPhotos,
          ];

        if (
          updatedPhotos[
            photoIndex
          ]?.preview
        ) {
          URL.revokeObjectURL(
            updatedPhotos[
              photoIndex
            ].preview
          );
        }

        updatedPhotos[
          photoIndex
        ] = null;

        return updatedPhotos;
      }
    );

    setError("");
  };

  // =====================================================
  // SELECT INTEREST
  // =====================================================

  const handleInterestClick = (
    interest
  ) => {
    setSelectedInterests(
      (currentInterests) => {
        if (
          currentInterests.includes(
            interest
          )
        ) {
          return currentInterests.filter(
            (item) =>
              item !== interest
          );
        }

        return [
          ...currentInterests,
          interest,
        ];
      }
    );
  };

  // =====================================================
  // CREATE UNIQUE PHOTO FILE NAME
  // =====================================================

  const createPhotoPath = (
    userId,
    file,
    index
  ) => {
    // Images are converted to JPEG
    // during compression.

    const extension =
      "jpg";

    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 10);

    return `${userId}/${Date.now()}-${index}-${randomPart}.${extension}`;
  };

  // =====================================================
  // UPLOAD PHOTO
  // =====================================================

  const uploadProfilePhoto =
    async (
      userId,
      photo,
      index
    ) => {
      if (!photo?.file) {
        return null;
      }

      // =================================================
      // FINAL UPLOAD SIZE CHECK
      // =================================================

      if (
        photo.file.size >=
        MAX_COMPRESSED_SIZE
      ) {
        throw new Error(
          "Profile photo must be smaller than 250 KB."
        );
      }

      const filePath =
        createPhotoPath(
          userId,
          photo.file,
          index
        );

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(PROFILE_BUCKET)
          .upload(
            filePath,
            photo.file,
            {
              cacheControl:
                "3600",
              upsert: false,
              contentType:
                "image/jpeg",
            }
          );

      if (uploadError) {
        console.error(
          "UMUHUZA STORAGE UPLOAD ERROR:",
          uploadError
        );

        throw new Error(
          `Photo upload failed: ${uploadError.message}`
        );
      }

      // =================================================
      // GET PUBLIC URL
      // =================================================

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from(PROFILE_BUCKET)
          .getPublicUrl(
            filePath
          );

      const publicUrl =
        publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Unable to create profile photo URL."
        );
      }

      return {
        path: filePath,
        url: publicUrl,
      };
    };

  // =====================================================
  // FINISH PROFILE
  // =====================================================

  const handleFinishProfile =
    async () => {
      setError("");

      // =================================================
      // VALIDATION
      // =================================================

      if (!photos[0]) {
        setError(
          "Please upload your main profile photo. A real profile photo is required to join UMUHUZA."
        );

        return;
      }

      if (
        selectedInterests.length ===
        0
      ) {
        setError(
          "Please select at least one interest."
        );

        return;
      }

      // =================================================
      // START LOADING
      // =================================================

      setLoading(true);

      try {
        // =================================================
        // GET CURRENT AUTHENTICATED USER
        // =================================================

        const {
          data: userData,
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError) {
          console.error(
            "UMUHUZA AUTH ERROR:",
            userError
          );

          throw new Error(
            `Authentication error: ${userError.message}`
          );
        }

        const user =
          userData?.user;

        if (!user) {
          throw new Error(
            "Your account session has expired. Please log in again."
          );
        }

        const userId =
          user.id;

        console.log(
          "=========================================="
        );

        console.log(
          "UMUHUZA PROFILE SETUP"
        );

        console.log(
          "User ID:",
          userId
        );

        console.log(
          "=========================================="
        );

        // =================================================
        // UPLOAD PHOTOS
        // =================================================

        const uploadedPhotos =
          [];

        for (
          let index = 0;
          index <
          photos.length;
          index++
        ) {
          const photo =
            photos[index];

          if (!photo) {
            continue;
          }

          console.log(
            `Uploading compressed photo ${index + 1}...`
          );

          console.log(
            `Upload size: ${(
              photo.file.size /
              1024
            ).toFixed(1)} KB`
          );

          const uploaded =
            await uploadProfilePhoto(
              userId,
              photo,
              index
            );

          if (uploaded) {
            uploadedPhotos.push({
              index,
              path:
                uploaded.path,
              url:
                uploaded.url,
            });
          }
        }

        // =================================================
        // CHECK MAIN PHOTO
        // =================================================

        const mainPhoto =
          uploadedPhotos.find(
            (photo) =>
              photo.index === 0
          );

        if (!mainPhoto) {
          throw new Error(
            "Your main profile photo could not be uploaded."
          );
        }

        // =================================================
        // PHOTO URLS
        // =================================================

        const photoUrls =
          uploadedPhotos.map(
            (photo) =>
              photo.url
          );

        // =================================================
        // PHOTO PATHS
        // =================================================

        const photoPaths =
          uploadedPhotos.map(
            (photo) =>
              photo.path
          );

        console.log(
          "Uploaded photos:",
          photoUrls
        );

        // =================================================
        // SAVE PROFILE
        // =================================================

        const {
          error: profileError,
        } =
          await supabase
            .from("profiles")
            .update({
              interests:
                selectedInterests,

              profile_photo_url:
                mainPhoto.url,

              profile_photos:
                photoUrls,

              profile_photo_paths:
                photoPaths,

              profile_photo_count:
                uploadedPhotos.length,

              profile_completed:
                true,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              userId
            );

        // =================================================
        // DATABASE ERROR
        // =================================================

        if (profileError) {
          console.error(
            "=========================================="
          );

          console.error(
            "UMUHUZA PROFILE DATABASE ERROR"
          );

          console.error(
            "Message:",
            profileError.message
          );

          console.error(
            "Code:",
            profileError.code
          );

          console.error(
            "Details:",
            profileError.details
          );

          console.error(
            "Hint:",
            profileError.hint
          );

          console.error(
            "=========================================="
          );

          throw profileError;
        }

        // =================================================
        // SUCCESS
        // =================================================

        console.log(
          "=========================================="
        );

        console.log(
          "UMUHUZA PROFILE SAVED SUCCESSFULLY"
        );

        console.log(
          "User ID:",
          userId
        );

        console.log(
          "Photo count:",
          uploadedPhotos.length
        );

        console.log(
          "Interests:",
          selectedInterests
        );

        console.log(
          "=========================================="
        );

        // =================================================
        // GO TO MEMBER HOME
        // =================================================

        navigate(
          "/member-home",
          {
            replace: true,
          }
        );
      } catch (
        profileError
      ) {
        console.error(
          "=========================================="
        );

        console.error(
          "UMUHUZA PROFILE SETUP ERROR"
        );

        console.error(
          profileError
        );

        console.error(
          "=========================================="
        );

        const message =
          profileError?.message ||
          "";

        const lowerMessage =
          message.toLowerCase();

        // =================================================
        // STORAGE / BUCKET ERROR
        // =================================================

        if (
          lowerMessage.includes(
            "bucket"
          ) ||
          lowerMessage.includes(
            "storage"
          ) ||
          lowerMessage.includes(
            "photo upload"
          )
        ) {
          setError(
            message ||
              "Profile photo storage is not configured correctly. Please check your Supabase Storage bucket."
          );
        }

        // =================================================
        // RLS ERROR
        // =================================================

        else if (
          lowerMessage.includes(
            "row-level security"
          ) ||
          lowerMessage.includes(
            "permission denied"
          ) ||
          lowerMessage.includes(
            "not authorized"
          ) ||
          lowerMessage.includes(
            "violates row-level security"
          )
        ) {
          setError(
            "Supabase did not allow your profile to be updated. Please check the profiles RLS policy."
          );
        }

        // =================================================
        // AUTH / SESSION ERROR
        // =================================================

        else if (
          lowerMessage.includes(
            "jwt"
          ) ||
          lowerMessage.includes(
            "session"
          ) ||
          lowerMessage.includes(
            "token"
          ) ||
          lowerMessage.includes(
            "authentication"
          )
        ) {
          setError(
            "Your account session has expired. Please log in again."
          );
        }

        // =================================================
        // DATABASE COLUMN ERROR
        // =================================================

        else if (
          lowerMessage.includes(
            "column"
          ) &&
          lowerMessage.includes(
            "profiles"
          )
        ) {
          setError(
            message
          );
        }

        // =================================================
        // DEFAULT ERROR
        // =================================================

        else {
          setError(
            message ||
              "We couldn't save your profile. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // PAGE
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
            Create Your
            <br />
            UMUHUZA Profile
          </h1>

          <p>
            Show the real you and let
            genuine people discover you.
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

            <h2>
              Build Your Profile
            </h2>

            <p className="auth-subtitle">
              Add your real photo and
              choose your interests.
            </p>

            {/* =================================================
                STEP INDICATOR
            ================================================= */}

            <div className="signup-progress">

              <div className="progress-step completed">
                <span>✓</span>
                <small>Account</small>
              </div>

              <div className="progress-line active-line"></div>

              <div className="progress-step completed">
                <span>✓</span>
                <small>About You</small>
              </div>

              <div className="progress-line active-line"></div>

              <div className="progress-step active">
                <span>3</span>
                <small>Profile</small>
              </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}

            <div className="profile-photo-section">

              <div className="profile-photo-placeholder">

                {photos[0] ? (
                  <img
                    src={
                      photos[0].preview
                    }
                    alt="Main profile preview"
                    className="profile-photo-preview"
                  />
                ) : (
                  <FiUser
                    className="profile-placeholder-icon"
                  />
                )}

                <div className="camera-icon">
                  <FiCamera />
                </div>

              </div>

              <div className="photo-text">

                <h3>
                  Main Profile Photo

                  <span
                    style={{
                      color: "#E63946",
                      marginLeft: "4px",
                    }}
                  >
                    *
                  </span>
                </h3>

                <p>
                  Your main photo is required
                  and will be shown on your
                  UMUHUZA profile.
                </p>

<button
  type="button"
  className="upload-photo-btn"
  onClick={() => takePhotoWithCamera(0)}
  disabled={loading}
>
  <FiCamera />
  {photos[0] ? "Change Photo" : "Take Photo"}
</button>

                <input
                  id="profile-photo-0"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handlePhotoChange(
                      event,
                      0
                    )
                  }
                  disabled={loading}
                  style={{
                    display: "none",
                  }}
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "#777",
                  }}
                >
                  Images are automatically
                  compressed to under 250 KB.
                </small>

              </div>

            </div>

            {/* =================================================
                REAL PHOTO NOTICE
            ================================================= */}

            <div
              className="profile-completion"
              style={{
                marginBottom: "25px",
              }}
            >

              <div className="completion-header">
                <span>
                  🛡️ Real Profile Policy
                </span>
              </div>

              <small>
                <strong>
                  Use your real photo.
                </strong>{" "}
                UMUHUZA is for genuine
                connections. Fake or
                misleading profile photos
                are not allowed.
              </small>

            </div>

            {/* =================================================
                ADDITIONAL PHOTOS
            ================================================= */}

            <div className="form-group">

              <label>
                Additional Photos

                <span
                  style={{
                    color: "#999",
                    fontWeight: "400",
                    marginLeft: "5px",
                  }}
                >
                  (Optional)
                </span>
              </label>

              <small className="input-help">
                You can add up to 3 more
                photos. Your main photo
                remains your primary profile
                picture.
              </small>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >

                {[1, 2, 3].map(
                  (photoIndex) => (

                    <div
                      key={photoIndex}
                      style={{
                        position:
                          "relative",
                      }}
                    >

                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          border:
                            "2px dashed #ddd",
                          borderRadius:
                            "14px",
                          background:
                            "#fafafa",
                          overflow:
                            "hidden",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >

                        {photos[
                          photoIndex
                        ] ? (

                          <img
                            src={
                              photos[
                                photoIndex
                              ].preview
                            }
                            alt={`Additional profile photo ${photoIndex}`}
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />

                        ) : (

                          <FiCamera
                            style={{
                              fontSize:
                                "24px",
                              color:
                                "#bbb",
                            }}
                          />

                        )}

                      </div>

                      {photos[
                        photoIndex
                      ] ? (

                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePhoto(
                              photoIndex
                            )
                          }
                          disabled={
                            loading
                          }
                          style={{
                            position:
                              "absolute",
                            top: "-6px",
                            right:
                              "-6px",
                            width:
                              "28px",
                            height:
                              "28px",
                            borderRadius:
                              "50%",
                            border:
                              "none",
                            background:
                              "#E63946",
                            color:
                              "white",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            cursor:
                              "pointer",
                          }}
                        >
                          <FiX />
                        </button>

                      ) : (

                        <label
                          htmlFor={`profile-photo-${photoIndex}`}
                          style={{
                            position:
                              "absolute",
                            inset: "0",
                            cursor:
                              "pointer",
                          }}
                        />

                      )}

                      <input
                        id={`profile-photo-${photoIndex}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                          handlePhotoChange(
                            event,
                            photoIndex
                          )
                        }
                        disabled={
                          loading
                        }
                        style={{
                          display:
                            "none",
                        }}
                      />

                    </div>

                  )
                )}

              </div>

            </div>

            {/* =================================================
                INTERESTS
            ================================================= */}

            <div className="form-group">

              <label>
                Your Interests
              </label>

              <div className="interest-options">

                {interests.map(
                  (interest) => {

                    const selected =
                      selectedInterests.includes(
                        interest
                      );

                    return (
                      <button
                        key={interest}
                        type="button"
                        className={
                          selected
                            ? "selected-interest"
                            : ""
                        }
                        onClick={() =>
                          handleInterestClick(
                            interest
                          )
                        }
                        disabled={loading}
                      >

                        {interest}

                        {selected && (
                          <span
                            style={{
                              marginLeft:
                                "5px",
                            }}
                          >
                            ✓
                          </span>
                        )}

                      </button>
                    );
                  }
                )}

              </div>

              <small className="input-help">
                Choose the interests that
                describe you.
              </small>

            </div>

            {/* =================================================
                FINISH PROFILE
            ================================================= */}

            <button
              type="button"
              className="auth-primary-btn"
              onClick={
                handleFinishProfile
              }
              disabled={loading}
            >
              {loading
                ? "Saving Profile..."
                : "Finish Profile ❤️"}
            </button>

            {/* =================================================
                LOGIN
            ================================================= */}

            <div className="auth-switch">

              <span>
                Already a member?
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

export default ProfileSetup;
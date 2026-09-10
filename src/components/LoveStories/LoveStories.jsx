import "./LoveStories.css";

import { useRef, useState } from "react";

import love1 from "../../assets/videos/love1.mp4";
import love2 from "../../assets/videos/love2.mp4";
import love3 from "../../assets/videos/love3.mp4";

function LoveStories() {
  const fileInputRef = useRef(null);

  const [uploadedVideo, setUploadedVideo] = useState(null);

  const stories = [
    {
      video: love1,
      name: "Aline",
      age: 24,
      city: "Kigali",
      looking: "Marriage",
      duration: "8 sec",
    },
    {
      video: love2,
      name: "Vincent",
      age: 26,
      city: "Huye",
      looking: "Serious Relationship",
      duration: "12 sec",
    },
    {
      video: love3,
      name: "Valence",
      age: 26,
      city: "Musanze",
      looking: "Friendship",
      duration: "10 sec",
    },
  ];

  // OPEN COMPUTER FILE PICKER
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // WHEN USER SELECTS VIDEO
  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("Please choose a video file.");
      return;
    }

    const videoUrl = URL.createObjectURL(file);

    setUploadedVideo({
      url: videoUrl,
      name: file.name,
    });
  };

  // REMOVE VIDEO
  const removeVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.url);
    }

    setUploadedVideo(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="love-stories">

      {/* =========================
          HEADER
      ========================= */}

      <div className="love-stories-header">

        <h2>❤️ UMUHUZA Love Stories</h2>

        <p>
          Real people. Real smiles. Real connections.
        </p>

      </div>


      {/* =========================
          UPLOAD STORY
      ========================= */}

      <div className="story-upload-area">

        <div className="upload-story-icon">
          🎥
        </div>

        <h3>
          Share Your Love Story
        </h3>

        <p>
          Upload a short video and inspire
          people in the UMUHUZA community.
        </p>


        {/* IMPORTANT:
            This input is hidden but connected
            to the Upload button.
        */}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="story-file-input"
        />


        <button
          type="button"
          className="upload-story-btn"
          onClick={openFilePicker}
        >
          🎥 Upload Your Love Story
        </button>

        <small>
          Select a video from your computer
        </small>

      </div>


      {/* =========================
          VIDEO PREVIEW
      ========================= */}

      {uploadedVideo && (
        <div className="uploaded-story-preview">

          <div className="uploaded-story-header">

            <div>
              <h3>
                🎉 Your Love Story
              </h3>

              <p>
                {uploadedVideo.name}
              </p>
            </div>


            <button
              type="button"
              className="remove-story-btn"
              onClick={removeVideo}
            >
              ✕
            </button>

          </div>


          <video
            src={uploadedVideo.url}
            controls
            className="uploaded-story-video"
          />


          <div className="upload-success">
            ❤️ Video selected successfully!
          </div>

        </div>
      )}


      {/* =========================
          EXISTING STORIES
      ========================= */}

      <div className="stories-grid">

        {stories.map((story, index) => (

          <div
            className="story-card"
            key={index}
          >

            <video
              controls
              preload="metadata"
              className="story-video"
            >

              <source
                src={story.video}
                type="video/mp4"
              />

              Your browser does not support video playback.

            </video>


            <div className="story-info">

              <span className="verified">
                ✔ Verified
              </span>


              <h3>
                {story.name}, {story.age}
              </h3>


              <p>
                📍 {story.city}
              </p>


              <p>
                ❤️ Looking for: {story.looking}
              </p>


              <p>
                🟢 Active Now
              </p>


              <p>
                🎥 {story.duration}
              </p>


              <button
                type="button"
              >
                ❤️ I'm Interested
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default LoveStories;
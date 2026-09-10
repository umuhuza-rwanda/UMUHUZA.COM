import "./MemberProfile.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiArrowLeft,
  FiHeart,
  FiMessageCircle,
  FiMapPin,
  FiCheckCircle,
  FiX,
  FiUser,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function MemberProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = useParams();

  // Prefer member from navigation state (faster)
  const [member, setMember] = useState(location.state?.member || null);
  const [loading, setLoading] = useState(!location.state?.member);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  // =====================================================
  // LOAD MEMBER FROM SUPABASE (when page is refreshed)
  // =====================================================
  useEffect(() => {
    // If we already have the member from state, no need to fetch
    if (member || !uid) return;

    const loadMember = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("Member profile not found");
          setMember(null);
          return;
        }

        // Normalize the data so it matches what the UI expects
        setMember({
          id: data.id,
          full_name: data.full_name || data.first_name || data.name || "UMUHUZA Member",
          firstName: data.first_name || data.firstName || "",
          lastName: data.last_name || data.lastName || "",
          age: data.age || null,
          city: data.city || "",
          country: data.country || "",
          profile_photo_url: data.profile_photo_url || data.profilePhoto || "",
          profilePhoto: data.profile_photo_url || data.profilePhoto || "",
          about: data.about || data.aboutYou || "",
          lookingFor: data.looking_for || data.lookingFor || "",
          verified: data.verified || false,
          online: data.online || false,
          gender: data.gender || "",
          ...data,
        });
      } catch (err) {
        console.error("Error loading member:", err);
        setError("Unable to load this member's profile");
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [uid, member]);

  // =====================================================
  // LIKE
  // =====================================================
  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  // =====================================================
  // SEND INTEREST
  // =====================================================
  const handleInterest = async () => {
    if (!member?.id || interestSent || interestLoading) return;

    setInterestLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Check if already sent
      const { data: existing } = await supabase
        .from("interests")
        .select("id")
        .eq("sender_id", user.id)
        .eq("receiver_id", member.id)
        .maybeSingle();

      if (existing) {
        setInterestSent(true);
        return;
      }

      // Insert interest
      const { error } = await supabase.from("interests").insert({
        sender_id: user.id,
        receiver_id: member.id,
        sender_name: user.user_metadata?.full_name || "UMUHUZA Member",
        receiver_name: member.full_name || member.firstName || "Member",
        status: "pending",
      });

      if (error) throw error;

      setInterestSent(true);
    } catch (err) {
      console.error("Interest error:", err);
      alert("Unable to send interest. Please try again.");
    } finally {
      setInterestLoading(false);
    }
  };

  // =====================================================
  // START CHAT
  // =====================================================
// =======================================================
// START CHAT
// =======================================================

const handleChat = () => {
  if (!currentUser) {
    alert("Please log in before starting a chat.");
    navigate("/login");
    return;
  }

  if (!member) {
    return;
  }

  const memberId =
    member.id ||
    member.uid ||
    member.userId;

  if (!memberId) {
    alert("Unable to identify this member.");
    return;
  }

  if (memberId === currentUser.uid) {
    alert("You cannot start a chat with yourself.");
    return;
  }

  // Open the Supabase Chat page and tell it
  // which member should be selected.
  navigate("/chat", {
    state: {
      selectedUserId: memberId,
      member: member,
    },
  });
};

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="member-profile-page">
        <div style={{ 
          minHeight: "60vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ fontSize: 40 }}>❤️</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================
  if (!member || error) {
    return (
      <div className="member-profile-page">
        <div className="profile-not-found-card">
          <div className="profile-not-found-icon">❤️</div>
          <h2>Member profile not found</h2>
          <p>
            {error || "We couldn't find this member's profile. Please return to discovery and try again."}
          </p>
          <button
            className="back-to-members-btn"
            onClick={() => navigate("/member-home")}
          >
            <FiArrowLeft /> Back to Members
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DISPLAY VALUES
  // =====================================================
  const name =
    member.full_name ||
    member.firstName ||
    member.name ||
    [member.firstName, member.lastName].filter(Boolean).join(" ") ||
    "UMUHUZA Member";

  const photo =
    member.profile_photo_url ||
    member.profilePhoto ||
    member.photoURL ||
    member.image ||
    "";

  const age = member.age || null;
  const locationText = [member.city, member.country].filter(Boolean).join(", ");

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="member-profile-page">
      {/* Top Bar */}
      <div className="profile-topbar">
        <button className="back-btn" onClick={() => navigate("/member-home")}>
          <FiArrowLeft /> Back to Discovery
        </button>

        <div className="profile-logo">
          <img src={umurangaLogo} alt="UMUHUZA" style={{ height: 36 }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="profile-hero">
        {/* Photo */}
        <div className="profile-photo-wrapper">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="large-profile-photo"
            />
          ) : (
            <div className="large-profile-photo placeholder">
              <span style={{ fontSize: 80 }}>❤️</span>
            </div>
          )}

          {member.online && (
            <div className="photo-online-badge">
              <span></span> Online Now
            </div>
          )}
        </div>

        {/* Info */}
        <div className="profile-main-info">
          <div className="profile-status-row">
            {member.online && (
              <span className="online-badge">
                <span className="status-dot"></span> Online Now
              </span>
            )}
            {member.verified && (
              <span className="verified-badge">
                <FiCheckCircle /> Verified
              </span>
            )}
          </div>

          <h1>
            {name}
            {age ? `, ${age}` : ""}
          </h1>

          {locationText && (
            <p className="profile-location">
              <FiMapPin /> {locationText}
            </p>
          )}

          {member.lookingFor && (
            <div className="looking-for-badge">
              ❤️ Looking for: {member.lookingFor}
            </div>
          )}

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              className={`profile-like-btn ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              <FiHeart />
              {liked ? "Liked" : "Like"}
            </button>

            <button
              className={`profile-interest-btn ${interestSent ? "interest-sent" : ""}`}
              onClick={handleInterest}
              disabled={interestSent || interestLoading}
            >
              {interestLoading
                ? "Sending..."
                : interestSent
                ? "Interest Sent"
                : "Send Interest"}
            </button>

            <button className="profile-chat-btn" onClick={handleChat}>
              <FiMessageCircle />
              Start Chat
            </button>
          </div>

          <p style={{ marginTop: 12, fontSize: 13, color: "#7c3aed" }}>
            ❤️ Both people must show interest before chat becomes available.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="profile-content">
        {/* About */}
        <div className="profile-section">
          <div className="section-title">
            <span className="section-icon">💕</span>
            <h2>About {name.split(" ")[0]}</h2>
          </div>
          <p>
            {member.about ||
              member.aboutYou ||
              "I am a kind, positive and genuine person looking for meaningful connections. I enjoy spending time with good people, discovering new experiences and building relationships based on honesty and respect."}
          </p>
        </div>

        {/* Interests */}
        <div className="profile-section">
          <div className="section-title">
            <span className="section-icon">❤️</span>
            <h2>Interests</h2>
          </div>
          <div className="profile-interests">
            <span>🎵 Music</span>
            <span>✈️ Travel</span>
            <span>🍳 Cooking</span>
            <span>🎬 Movies</span>
            <span>🌿 Nature</span>
          </div>
        </div>

        {/* Looking For */}
        <div className="profile-section looking-section">
          <div className="section-title">
            <span className="section-icon">💕</span>
            <h2>What {name.split(" ")[0]} Is Looking For</h2>
          </div>
          <div className="connection-box">
            <div className="connection-icon">❤️</div>
            <div>
              <h3>{member.lookingFor || "Meaningful connection"}</h3>
              <p>
                Looking for someone genuine, respectful and ready to build
                something meaningful together.
              </p>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="profile-safety">
          <div className="safety-icon">
            <FiCheckCircle />
          </div>
          <div>
            <strong>Stay Safe on UMUHUZA</strong>
            <p>
              Take your time getting to know someone before sharing personal
              information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MemberProfile;
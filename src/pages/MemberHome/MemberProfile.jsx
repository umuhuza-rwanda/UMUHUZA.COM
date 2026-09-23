import "./MemberProfile.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { useAppPreferences } from "../../context/AppPreferencesContext";

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
// =====================================================
// FORMAT LABELS
// =====================================================
const formatLabel = (value) => {
  if (!value) return null;

  const map = {
    // Personal Status
    single: "Single",
    divorced: "Divorced",
    widowed: "Widowed",
    separated: "Separated",

    // Looking for
    men: "Men",
    women: "Women",
    "men-and-women": "Men & Women",

    // Relationship Goal
    marriage: "Marriage",
    "serious-relationship": "Serious Relationship",
    friendship: "Friendship",
    "getting-to-know": "Getting to Know Someone",
  };

  return map[value] || value;
};

function MemberProfile() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();
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
        setError(t("memberProfile.loadError"));
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
      alert(t("memberProfile.interestError"));
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
          <p>{t("memberProfile.loading")}</p>
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
<h2>{t("memberProfile.notFound")}</h2>
<p>
  {error || t("memberProfile.notFoundDescription")}
</p>
<button
  className="back-to-members-btn"
  onClick={() => navigate("/member-home")}
>
  <FiArrowLeft /> {t("memberProfile.backToMembers")}
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
          <FiArrowLeft /> {t("memberProfile.backToDiscovery")}
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
             <span></span> {t("memberProfile.onlineNow")}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="profile-main-info">
          <div className="profile-status-row">
            {member.online && (
              <span className="online-badge">
                <span className="status-dot"></span> {t("memberProfile.onlineNow")}
              </span>
            )}
            {member.verified && (
              <span className="verified-badge">
                <FiCheckCircle /> {t("memberProfile.verified")}
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
              ❤️ {t("memberProfile.lookingFor")}: {member.lookingFor}
            </div>
          )}

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              className={`profile-like-btn ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              <FiHeart />
              {liked ? t("memberProfile.liked") : t("memberProfile.like")}
            </button>

            <button
              className={`profile-interest-btn ${interestSent ? "interest-sent" : ""}`}
              onClick={handleInterest}
              disabled={interestSent || interestLoading}
            >
              {interestLoading
                ? t("memberProfile.sending")
                : interestSent
                ? t("memberProfile.interestSent")
                : t("memberProfile.sendInterest")}
            </button>

            <button className="profile-chat-btn" onClick={handleChat}>
              <FiMessageCircle />
              {t("memberProfile.startChat")}
            </button>
          </div>

          <p style={{ marginTop: 12, fontSize: 13, color: "#7c3aed" }}>
            send message to start chat for free
          </p>
        </div>
      </section>

{/* Content */}
<section className="profile-content">

  {/* ===================== ABOUT ===================== */}
  <div className="profile-section">
    <div className="section-title">
      <span className="section-icon">💕</span>
      {t("memberProfile.about") || "About"} {name.split(" ")[0]}
    </div>
    <p>
      {member.about ||
        member.aboutYou ||
        t("memberProfile.defaultAbout") ||
        "This member hasn't written about themselves yet."}
    </p>
  </div>

  {/* ===================== MORE ABOUT ===================== */}
  {(member.personal_status ||
    member.looking_for_gender ||
    member.relation_goal) && (
    <div className="profile-section">
      <div className="section-title">
        <span className="section-icon">👤</span>
        More About {name.split(" ")[0]}
      </div>

      <div className="about-details-grid">
        {member.personal_status && (
          <div className="about-detail-item">
            <span className="detail-label">Personal Status</span>
            <span className="detail-value">
              {formatLabel(member.personal_status)}
            </span>
          </div>
        )}

        {member.looking_for_gender && (
          <div className="about-detail-item">
            <span className="detail-label">Looking For</span>
            <span className="detail-value">
              {formatLabel(member.looking_for_gender)}
            </span>
          </div>
        )}

        {member.relation_goal && (
          <div className="about-detail-item">
            <span className="detail-label">Relationship Goal</span>
            <span className="detail-value">
              {formatLabel(member.relation_goal)}
            </span>
          </div>
        )}
      </div>
    </div>
  )}

  {/* ===================== INTERESTS (REAL DATA) ===================== */}
  <div className="profile-section">
    <div className="section-title">
      <span className="section-icon">❤️</span>
      <h2>{t("memberProfile.interests") || "Interests"}</h2>
    </div>

    <div className="profile-interests">
      {(() => {
        // Try different possible column names
        let interests =
          member.interests ||
          member.hobbies ||
          member.user_interests ||
          [];

        // If it's a string, turn it into an array
        if (typeof interests === "string") {
          interests = interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);
        }

        // If it's not an array yet
        if (!Array.isArray(interests)) {
          interests = [];
        }

        if (interests.length === 0) {
          return (
            <p style={{ color: "#9ca3af", fontSize: 14 }}>
              No interests added yet.
            </p>
          );
        }

        return interests.map((interest, index) => (
          <span key={index}>{interest}</span>
        ));
      })()}
    </div>
  </div>

  {/* ===================== LOOKING FOR ===================== */}
  <div className="profile-section looking-section">
    <div className="section-title">
      <span className="section-icon">💕</span>
      <h2>{t("memberProfile.lookingForTitle") || "What They're Looking For"}</h2>
    </div>
    <div className="connection-box">
      <div className="connection-icon">❤️</div>
      <div>
        <h3>
          {formatLabel(member.relation_goal) ||
            member.lookingFor ||
            t("memberProfile.meaningfulConnection") ||
            "Meaningful connection"}
        </h3>
        <p>
          {t("memberProfile.lookingForDescription") ||
            "This person is looking for a genuine and meaningful connection."}
        </p>
      </div>
    </div>
  </div>

  {/* ===================== SAFETY ===================== */}
  <div className="profile-safety">
    <div className="safety-icon">
      <FiCheckCircle />
    </div>
    <div>
      <strong>{t("memberProfile.staySafe") || "Stay Safe"}</strong>
      <p>
        {t("memberProfile.safetyDescription") ||
          "Never share personal financial information and always meet in public places."}
      </p>
    </div>
  </div>

</section>
    </div>
  );
}

export default MemberProfile;
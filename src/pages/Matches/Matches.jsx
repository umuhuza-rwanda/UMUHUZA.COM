import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMessageCircle } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Matches.css";

function Matches() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // AUTH
  // =====================================================
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  // =====================================================
  // LOAD MATCHES (Mutual Likes)
  // =====================================================
  useEffect(() => {
    if (!currentUser?.id) return;

    let active = true;

    const loadMatches = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. People I liked
        const { data: myLikes, error: myLikesError } = await supabase
          .from("likes")
          .select("likedId")
          .eq("likerId", currentUser.id);

        if (myLikesError) throw myLikesError;

        const myLikedIds = (myLikes || [])
          .map((l) => l.likedId)
          .filter(Boolean);

        if (myLikedIds.length === 0) {
          if (active) {
            setMatches([]);
            setLoading(false);
          }
          return;
        }

        // 2. People who liked me AND I also liked them
        const { data: mutualLikes, error: mutualError } = await supabase
          .from("likes")
          .select("likerId")
          .eq("likedId", currentUser.id)
          .in("likerId", myLikedIds);

        if (mutualError) throw mutualError;

        const matchIds = (mutualLikes || [])
          .map((l) => l.likerId)
          .filter(Boolean);

        if (matchIds.length === 0) {
          if (active) {
            setMatches([]);
            setLoading(false);
          }
          return;
        }

        // 3. Load profiles (with multiple possible photo fields)
const { data: profiles, error: profileError } = await supabase
  .from("profiles")
  .select(`
    id,
    full_name,
    profile_photo_url,
    city,
    country,
    date_of_birth,
    latitude,
    longitude
  `)
  .in("id", matchIds);

        if (profileError) throw profileError;

        if (!active) return;
const formatted = (profiles || []).map((profile) => {
  let age = null;
  if (profile.date_of_birth) {
    try {
      const today = new Date();
      const birth = new Date(profile.date_of_birth);
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
    } catch {
      age = null;
    }
  }

  return {
    id: profile.id,
    name: profile.full_name || "UMUHUZA Member",
    photo: profile.profile_photo_url || "",
    city: profile.city || "",
    country: profile.country || "",
    age,
    date_of_birth: profile.date_of_birth,
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
});

        setMatches(formatted);
      } catch (err) {
        console.error("Error loading matches:", err);
        if (active) {
          setError(err.message || "Unable to load matches.");
          setMatches([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMatches();

    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  return (
    <div className="matches-page">
      {/* Header */}
      <div className="matches-header">
        <button className="back-btn" onClick={() => navigate("/dating")}>
          <FiArrowLeft /> Back
        </button>

        <h1>Matches</h1>

        <div className="matches-logo">
          <img
            src={umurangaLogo}
            alt="UMUHUZA"
            style={{ height: 36, objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="matches-content">
        {loading ? (
          <p className="matches-message">Loading matches...</p>
        ) : error ? (
          <p className="matches-message error">{error}</p>
        ) : matches.length === 0 ? (
          <div className="matches-empty">
            <div className="matches-empty-icon">💕</div>
            <h3>No matches yet</h3>
            <p>
              When you and someone like each other, they will appear here.
            </p>
            <button
              className="matches-primary-btn"
              onClick={() => navigate("/member-home")}
            >
              Discover People
            </button>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map((member) => (
              <div key={member.id} className="match-card">
                {/* Photo */}
                <div className="match-avatar">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("no-photo");
                      }}
                    />
                  ) : (
                    <div className="match-avatar-placeholder">❤️</div>
                  )}
                </div>

                {/* Info */}
                <div className="match-info">
                  <strong>
                    {member.name}
                    {member.age ? `, ${member.age}` : ""}
                  </strong>
                  <span>
                    {[member.city, member.country]
                      .filter(Boolean)
                      .join(", ") || "Location not added"}
                  </span>
                </div>

                {/* Actions */}
                <div className="match-actions">
                  <button
                    className="view-profile-btn"
                    onClick={() =>
                      navigate(`/member-profile/${member.id}`, {
                        state: { member },
                      })
                    }
                  >
                    View Profile
                  </button>

                  <button
                    className="chat-btn"
                    onClick={() =>
                      navigate("/chat", {
                        state: { selectedUserId: member.id },
                      })
                    }
                  >
                    <FiMessageCircle /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;
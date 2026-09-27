import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiUser } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Likes.css";

function Likes() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [likedByMe, setLikedByMe] = useState([]);      // people I liked
  const [likedMe, setLikedMe] = useState([]);          // people who liked me
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("likedByMe"); // likedByMe | likedMe


  // =====================================================
  // AUTH
  // =====================================================
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  // =====================================================
  // LOAD LIKES
  // =====================================================
  useEffect(() => {
    if (!currentUser?.id) return;

    let active = true;

    const loadLikes = async () => {
      setLoading(true);
      setError("");

      try {
        // ===================== PEOPLE I LIKED =====================
        const { data: myLikes, error: myLikesError } = await supabase
          .from("likes")
          .select("likedId")
          .eq("likerId", currentUser.id);

        if (myLikesError) throw myLikesError;

        // ===================== PEOPLE WHO LIKED ME =====================
        const { data: likesOnMe, error: likesOnMeError } = await supabase
          .from("likes")
          .select("likerId")
          .eq("likedId", currentUser.id);

        if (likesOnMeError) throw likesOnMeError;

        const likedByMeIds = (myLikes || []).map((l) => l.likedId).filter(Boolean);
        const likedMeIds = (likesOnMe || []).map((l) => l.likerId).filter(Boolean);

        const allIds = [...new Set([...likedByMeIds, ...likedMeIds])];

        let profiles = [];

        if (allIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
           .select("id, full_name, profile_photo_url, city, country, date_of_birth, latitude, longitude")
            .in("id", allIds);

          if (profileError) throw profileError;
          profiles = profileData || [];
        }

        if (!active) return;

        const profileMap = new Map(profiles.map((p) => [p.id, p]));

        // =====================================================
// LIKE BACK
// =====================================================
const handleLikeBack = async (member) => {
  if (!currentUser?.id || !member?.id) return;

  try {
    // Check if already liked
    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("likerId", currentUser.id)
      .eq("likedId", member.id)
      .maybeSingle();

    if (existing) {
      // Already liked → just go to matches
      navigate("/matches");
      return;
    }

    // Create the like
    const { error } = await supabase.from("likes").insert({
      likerId: currentUser.id,
      likedId: member.id,
      createdAt: new Date().toISOString(),
    });

    if (error) {
      // If already exists (race condition)
      if (error.code === "23505") {
        navigate("/matches");
        return;
      }
      throw error;
    }

    // Optional: create a notification for the other person
    await supabase.from("notifications").insert({
      user_id: member.id,
      type: "like",
      title: "New Like ❤️",
      message: "Someone liked you back!",
      related_user_id: currentUser.id,
      is_read: false,
    });

    // Go to Matches page
    navigate("/matches");
  } catch (err) {
    console.error("Like back error:", err);
    setError(err.message || "Unable to like back. Please try again.");
  }
};

const mapProfiles = (ids) =>
  ids
    .map((id) => profileMap.get(id))
    .filter(Boolean)
    .map((profile) => {
      // Calculate age from date_of_birth
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
        date_of_birth: profile.date_of_birth || null,
        latitude: profile.latitude || null,
        longitude: profile.longitude || null,
      };
    });

        setLikedByMe(mapProfiles(likedByMeIds));
        setLikedMe(mapProfiles(likedMeIds));
      } catch (err) {
        console.error("Error loading likes:", err);
        if (active) {
          setError(err.message || "Unable to load likes.");
          setLikedByMe([]);
          setLikedMe([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLikes();

    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  const currentList = activeSection === "likedByMe" ? likedByMe : likedMe;

  return (
    <div className="likes-page">
{/* Header */}
<div className="likes-header">
  <button className="back-btn" onClick={() => navigate("/dating")}>
    <FiArrowLeft /> Back
  </button>

  <h1></h1>

  {/* Logo on the right */}
  <div className="likes-logo">
    <img
      src={umurangaLogo}
      alt="UMUHUZA"
      style={{ height: 60, objectFit: "contain" }}
    />
  </div>
</div>

      {/* Section tabs */}
      <div className="likes-sections">
        <button
          className={`likes-section-btn ${activeSection === "likedByMe" ? "active" : ""}`}
          onClick={() => setActiveSection("likedByMe")}
        >
          People you liked ({likedByMe.length})
        </button>
        <button
          className={`likes-section-btn ${activeSection === "likedMe" ? "active" : ""}`}
          onClick={() => setActiveSection("likedMe")}
        >
          People who liked you ({likedMe.length})
        </button>
      </div>

      <div className="likes-content">
        {loading ? (
          <p className="likes-message">Loading likes...</p>
        ) : error ? (
          <p className="likes-message error">{error}</p>
        ) : currentList.length === 0 ? (
          <div className="likes-empty">
            <div className="likes-empty-icon">♡</div>
            <h3>
              {activeSection === "likedByMe"
                ? "No likes yet"
                : "No one has liked you yet"}
            </h3>
            <p>
              {activeSection === "likedByMe"
                ? "When you like someone, they will appear here."
                : "When someone likes you, they will appear here."}
            </p>
            <button
              className="likes-primary-btn"
              onClick={() => navigate("/member-home")}
            >
              Discover People
            </button>
          </div>
        ) : (
          <div className="likes-list">
            {currentList.map((member) => (
              <div key={member.id} className="like-card">
                <div className="like-avatar">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    <FiUser size={28} />
                  )}
                </div>

                <div className="like-info">
                  <strong>{member.name}</strong>
                  <span>
                    {[member.city, member.country].filter(Boolean).join(", ") ||
                      "Location not added"}
                  </span>
                </div>
 
<div className="like-actions">
  <button
    className="view-profile-btn"
    onClick={() =>
      navigate(`/member-profile/${member.id}`, {
        state: {
          member: {
            id: member.id,
            full_name: member.name,
            name: member.name,
            profile_photo_url: member.photo,
            profilePhoto: member.photo,
            city: member.city,
            country: member.country,
            age: member.age,
            date_of_birth: member.date_of_birth,
            latitude: member.latitude,
            longitude: member.longitude,
          },
        },
      })
    }
  >
    View Profile
  </button>

  {/* Only show Like Back when viewing "People who liked you" */}
  {activeSection === "likedMe" && (
    <button
      className="like-back-btn"
      onClick={() => handleLikeBack(member)}
    >
      <FiHeart /> Like Back
    </button>
  )}
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Likes;
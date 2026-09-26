import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiUsers, FiBell } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Dating.css";

function Dating() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [interestsCount, setInterestsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);


  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    const loadCounts = async () => {
      // Likes received (people who liked me)
      const { count: likesReceived } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("likedId", currentUser.id);

      // Pending interests received
      const { count: pendingInterests } = await supabase
        .from("interests")
        .select("*", { count: "exact", head: true })
        .eq("receiverId", currentUser.id)
        .eq("status", "pending");

      // Unread notifications
      const { count: unreadNotifs } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
        .eq("is_read", false);

      setLikesCount(likesReceived || 0);
      setInterestsCount(pendingInterests || 0);
      setNotificationsCount(unreadNotifs || 0);
    };

    loadCounts();
  }, [currentUser?.id]);

  return (
    <div className="dating-page">
     
      <div className="dating-header">
<button className="back-btn" onClick={() => navigate("/member-home")}>
  <FiArrowLeft /> Back
</button>
        <h1></h1>
        {/* Logo on the right */}
  <div className="likes-logo">
    <img
      src={umurangaLogo}
      alt="UMUHUZA"
      style={{ height: 50, objectFit: "contain" }}
     
    />
  </div>
      </div>

      {/* Title */}
      <div className="dating-intro">
        <h2>Your Dating Hub 💕</h2>
        <p>See who likes you, your interests and notifications</p>
      </div>

      {/* 3 Big Cards */}
      <div className="dating-cards">

        {/* LIKES - Light Pink */}
        <button
          className="dating-card likes-card"
          onClick={() => navigate("/likes")}
        >
          <div className="dating-card-icon">
            <FiHeart size={32} />
          </div>
          <div className="dating-card-text">
            <h3>Likes</h3>
            <p>People who liked you & people you liked</p>
          </div>
          <div className="dating-card-count">
            {likesCount}
          </div>
        </button>

        {/* INTERESTS - Violet + Green */}
        <button
          className="dating-card interests-card"
          onClick={() => navigate("/interests")}
        >
          <div className="dating-card-icon">
            <FiUsers size={32} />
          </div>
          <div className="dating-card-text">
            <h3>Interests</h3>
            <p>Pending interests & your connections</p>
          </div>
          <div className="dating-card-count">
            {interestsCount}
          </div>
        </button>

        {/* NOTIFICATIONS - Blue */}
        <button
          className="dating-card notifications-card"
          onClick={() => navigate("/notifications")}
        >
          <div className="dating-card-icon">
            <FiBell size={32} />
          </div>
          <div className="dating-card-text">
            <h3>Notifications</h3>
            <p>New likes, interests and messages</p>
          </div>
          <div className="dating-card-count">
            {notificationsCount}
          </div>
        </button>

      </div>
    </div>
  );
}

export default Dating;
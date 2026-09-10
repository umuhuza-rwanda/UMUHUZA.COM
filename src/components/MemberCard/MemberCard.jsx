import "./MemberCard.css";
import { FiMapPin, FiUser, FiHeart, FiMessageCircle } from "react-icons/fi";

function MemberCard({
  image,
  name,
  age,
  city,
  country,
  lookingFor,
  online = false,
  nearYou = false,
  onViewProfile,
  onLike,
  onSendInterest,
  onStartChat,
}) {
  return (
    <div className="member-card">
      {/* PHOTO */}
      <div className="member-card-photo">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <div className="member-card-placeholder">
            <FiUser />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="member-card-body">
        <h3 className="member-card-name">
          {name}{age ? `, ${age}` : ""}
        </h3>

        {(city || country) && (
          <p className="member-card-location">
            <FiMapPin />
            <span>
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </p>
        )}

        {lookingFor && (
          <p className="member-card-looking">
            <FiHeart />
            <span>Looking for: {lookingFor}</span>
          </p>
        )}

        <p className={`member-card-status ${online ? "online" : "offline"}`}>
          <span className="status-dot" />
          {online ? "Online" : "Offline"}
        </p>

        {nearYou && (
          <span className="member-card-near">
            <FiMapPin />
            Near You
          </span>
        )}

        {/* BUTTONS */}
        <div className="member-card-actions">
          <button className="btn-view" onClick={onViewProfile}>
            <FiUser />
            View Profile
          </button>

          <button className="btn-like" onClick={onLike}>
            <FiHeart />
            Like
          </button>

          <button className="btn-interest" onClick={onSendInterest}>
            <FiHeart />
            Send Interest
          </button>

          <button className="btn-chat" onClick={onStartChat}>
            <FiMessageCircle />
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberCard;
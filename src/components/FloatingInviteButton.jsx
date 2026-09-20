import { useNavigate } from "react-router-dom";
import { FiGift } from "react-icons/fi";
import "./FloatingInviteButton.css";

function FloatingInviteButton() {
  const navigate = useNavigate();

  return (
    <button
      className="floating-invite-btn"
      onClick={() => navigate("/referral")}
      title="Invite Friends"
    >
      <FiGift size={22} />
      <span>EARN</span>
    </button>
  );
}

export default FloatingInviteButton;
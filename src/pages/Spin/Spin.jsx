import "./Spin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGift } from "react-icons/fi";
import { supabase } from "../../lib/supabase";

const PRIZES = [
  { id: 1, label: "10,000 RWF", type: "money", value: 10000, color: "#F59E0B" },
  { id: 2, label: "Profile Boost\n7 Days", type: "boost", value: 7, color: "#8B5CF6" },
  { id: 3, label: "1,000 RWF", type: "money", value: 1000, color: "#22C55E" },
  { id: 4, label: "3 Days\nUnlimited Chat", type: "premium", value: 3, color: "#3B82F6" },
  { id: 5, label: "5,000 RWF", type: "money", value: 5000, color: "#EAB308" },
  { id: 6, label: "Try Again", type: "retry", value: 0, color: "#F97316" },
  { id: 7, label: "+5 Free Chats", type: "chats", value: 5, color: "#14B8A6" },
  { id: 8, label: "0 RWF", type: "lose", value: 0, color: "#6B7280" },
];

function Spin() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // LOAD USER + DATA
  // =====================================================
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setCurrentUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("lotto_tickets, wallet_balance")
        .eq("id", user.id)
        .maybeSingle();

      setTickets(profile?.lotto_tickets || 0);
      setWalletBalance(profile?.wallet_balance || 0);
      setLoading(false);
    };

    load();
  }, [navigate]);

  // =====================================================
  // SPIN LOGIC
  // =====================================================
  const handleSpin = async () => {
    if (spinning || tickets <= 0) return;

    setSpinning(true);
    setResult(null);
    setMessage("");

    // Random prize
    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[randomIndex];

    // Calculate rotation (5 full spins + landing on the prize)
    const segmentAngle = 360 / PRIZES.length;
    const extraSpins = 5 * 360;
    const targetAngle = 360 - randomIndex * segmentAngle - segmentAngle / 2;
    const finalRotation = rotation + extraSpins + targetAngle;

    setRotation(finalRotation);

    // Wait for animation
    setTimeout(async () => {
      setResult(prize);

      // Update tickets
      const newTickets = tickets - 1;
      setTickets(newTickets);

      // Apply reward
      let newBalance = walletBalance;

      if (prize.type === "money") {
        newBalance = walletBalance + prize.value;
        setWalletBalance(newBalance);
        setMessage(`🎉 You won ${prize.value.toLocaleString()} RWF!`);
      } else if (prize.type === "chats") {
        setMessage(`🎉 You won +${prize.value} Free Chats!`);
      } else if (prize.type === "boost") {
        setMessage(`🚀 Profile Boost activated for ${prize.value} days!`);
      } else if (prize.type === "premium") {
        setMessage(`⭐ Unlimited Chat for ${prize.value} days!`);
      } else if (prize.type === "retry") {
        setMessage("🔄 Try Again! You get another chance.");
        setTickets((prev) => prev + 1); // give ticket back
      } else {
        setMessage("😔 0 RWF - Better luck next time!");
      }

      // Save to Supabase
      if (currentUser) {
        await supabase
          .from("profiles")
          .update({
            lotto_tickets: prize.type === "retry" ? tickets : newTickets,
            wallet_balance: newBalance,
          })
          .eq("id", currentUser.id);
      }

      setSpinning(false);
    }, 4500);
  };

  if (loading) {
    return (
      <div className="spin-page">
        <div className="spin-loading">Loading Lotto...</div>
      </div>
    );
  }

  return (
    <div className="spin-page">
      {/* Header */}
      <header className="spin-header">
        <button className="spin-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="spin-logo">❤️ UMUHUZA</div>
        <div style={{ width: 60 }}></div>
      </header>

      {/* Title */}
      <div className="spin-title-section">
        <div className="spin-heart">💜</div>
        <h1>UMUHUZA <span>LOTTO</span></h1>
        <p>Spin & Win Real Money + Rewards</p>
      </div>

      {/* Stats */}
      <div className="spin-stats">
        <div className="spin-stat-card">
          <span className="stat-icon">🎫</span>
          <div>
            <small>You have:</small>
            <strong>{tickets} Free Tickets</strong>
          </div>
        </div>
        <div className="spin-stat-card">
          <span className="stat-icon">👛</span>
          <div>
            <small>Wallet Balance:</small>
            <strong>{walletBalance.toLocaleString()} RWF</strong>
          </div>
        </div>
      </div>

      {/* Wheel */}
      <div className="wheel-container">
        <div className="wheel-pointer">▼</div>

        <div
          className={`wheel ${spinning ? "spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, index) => {
            const angle = (360 / PRIZES.length) * index;
            return (
              <div
                key={prize.id}
                className="wheel-segment"
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: prize.color,
                }}
              >
                <span className="segment-label">{prize.label}</span>
              </div>
            );
          })}
          <div className="wheel-center"></div>
        </div>
      </div>

      {/* Result Message */}
      {message && (
        <div className="spin-result-message">
          {message}
        </div>
      )}

      {/* Spin Button */}
      <button
        className="spin-now-btn"
        onClick={handleSpin}
        disabled={spinning || tickets <= 0}
      >
        {spinning ? "Spinning..." : tickets <= 0 ? "No Tickets Left" : "SPIN NOW ▶"}
      </button>

      {/* Footer info */}
      <div className="spin-footer">
        <div className="footer-item">
          <span>🛡️</span>
          <small>Safe & Secure</small>
        </div>
        <div className="footer-item">
          <span>💜</span>
          <small>More Connections</small>
        </div>
        <div className="footer-item">
          <span>🎁</span>
          <small>Real Rewards</small>
        </div>
      </div>
    </div>
  );
}

export default Spin;
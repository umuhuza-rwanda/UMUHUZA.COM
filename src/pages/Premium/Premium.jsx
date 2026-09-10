import "./Premium.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiGift, FiUnlock } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { supabase } from "../../lib/supabase";

function Premium() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Payment Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // "pack" | "monthly"

  // =====================================================
  // LOAD USER + PROFILE
  // =====================================================
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setCurrentUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("chat_limit_used, extra_chat_credits, premium_until")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    load();
  }, [navigate]);

  // =====================================================
  // HANDLE "I HAVE PAID"
  // =====================================================
const handlePaymentDone = async () => {
  if (!currentUser || !selectedPlan || submitting) return;

  try {
    setSubmitting(true);
    setMessage("");

    const amount = selectedPlan === "pack" ? 200 : 500;
    const planName = selectedPlan === "pack" ? "pack_5" : "monthly";

    console.log("Submitting payment:", {
      user_id: currentUser.id,
      user_email: currentUser.email,
      amount,
      plan: planName,
    });

    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        user_id: currentUser.id,
        user_email: currentUser.email,
        amount: amount,
        currency: "RWF",
        plan: planName,
        status: "pending",
        purpose:
          selectedPlan === "pack"
            ? "5 extra chats"
            : "Monthly unlimited chat",
      })
      .select();

    console.log("Insert result:", { data, error });

    if (error) {
      console.error("Payment insert error:", error);
      setMessage("Error: " + error.message);
      return;
    }

    setShowPaymentModal(false);
    setMessage(
      "✅ Payment submitted successfully!\n\nIt will take less than 10 minutes to confirm your payment."
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    setMessage("Unable to submit payment request. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  // =====================================================
  // CALCULATE STATUS
  // =====================================================
  const freeChatsUsed = profile?.chat_limit_used || 0;
  const freeChatsLimit = 10;
  const remainingFreeChats = Math.max(freeChatsLimit - freeChatsUsed, 0);
  const extraCredits = profile?.extra_chat_credits || 0;

  const isPremium =
    profile?.premium_until && new Date(profile.premium_until) > new Date();

  if (loading) {
    return (
      <div className="premium-page">
        <div className="premium-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      {/* Header */}
      <header className="premium-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="premium-logo">
          <img src={umurangaLogo} alt="UMUHUZA" />
        </div>
      </header>

      <main className="premium-main">
        <div className="premium-hero">
          <h1>💎 UMUHUZA Premium</h1>
          <p>Unlock more conversations with real people</p>
        </div>

        {/* Current Status */}
        <div className="status-card">
          <h3>Your Current Status</h3>

          <div className="status-row">
            <span>Free chats remaining</span>
            <strong>
              {remainingFreeChats} / {freeChatsLimit}
            </strong>
          </div>

          <div className="status-row">
            <span>Extra chat credits</span>
            <strong>{extraCredits}</strong>
          </div>

          <div className="status-row">
            <span>Premium status</span>
            <strong className={isPremium ? "active" : "inactive"}>
              {isPremium ? "Active" : "Not Active"}
            </strong>
          </div>
        </div>

        {message && <div className="premium-message">{message}</div>}

        {/* Option 1 - Chat Pack */}
        <div className="premium-card">
          <div className="card-badge">Popular</div>
          <h2>Chat Pack</h2>
          <p className="price">
            200 RWF <span>/ $0.14</span>
          </p>
          <p className="desc">Unlock 5 more people to chat with</p>

          <ul>
            <li>
              <FiCheck /> +5 new chat slots
            </li>
            <li>
              <FiCheck /> Never expires
            </li>
            <li>
              <FiCheck /> Instant activation after payment
            </li>
          </ul>

          <button
            className="premium-btn pack-btn"
            onClick={() => {
              setSelectedPlan("pack");
              setShowPaymentModal(true);
            }}
          >
            Buy Chat Pack
          </button>
        </div>

        {/* Option 2 - Monthly Unlimited */}
        <div className="premium-card featured">
          <div className="card-badge best">Best Value</div>
          <h2>Monthly Unlimited</h2>
          <p className="price">
            500 RWF <span>/ $0.34</span>
          </p>
          <p className="desc">Chat with unlimited people for 30 days</p>

          <ul>
            <li>
              <FiUnlock /> Unlimited new chats
            </li>
            <li>
              <FiCheck /> Valid for 30 days
            </li>
            <li>
              <FiCheck /> Priority support
            </li>
          </ul>

          <button
            className="premium-btn monthly-btn"
            onClick={() => {
              setSelectedPlan("monthly");
              setShowPaymentModal(true);
            }}
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Option 3 - Referral */}
        <div className="premium-card referral-card">
          <h2>
            <FiGift /> Referral Rewards
          </h2>
          <p className="desc">Invite friends and unlock free chats</p>

          <div className="referral-rewards">
            <div className="reward-item">
              <span className="reward-number">5</span>
              <div>
                <strong>Invite 5 friends</strong>
                <p>+2 free chats</p>
              </div>
            </div>

            <div className="reward-item">
              <span className="reward-number">10</span>
              <div>
                <strong>Invite 10 friends</strong>
                <p>+10 free chats</p>
              </div>
            </div>

            <div className="reward-item special">
              <span className="reward-number">15</span>
              <div>
                <strong>Invite 15 friends</strong>
                <p>1 Month Unlimited</p>
              </div>
            </div>
          </div>

          <button
            className="premium-btn referral-btn"
            onClick={() => navigate("/referral")}
          >
            Go to Referral Program
          </button>
        </div>

        <p className="premium-note">
          Note: Existing conversations are never restricted.
          <br />
          Only starting chats with new people is limited.
        </p>
      </main>

      {/* ==============================
          PAYMENT MODAL
      ============================== */}
      {showPaymentModal && (
        <div
          className="payment-overlay"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="payment-header">
              <div>
                <h2>
                  {selectedPlan === "pack"
                    ? "Chat Pack - 200 RWF"
                    : "Monthly Premium - 500 RWF"}
                </h2>
                <p>Choose your preferred payment method</p>
              </div>
              <button
                className="payment-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Mobile Money */}
            <div className="payment-section">
              <h3>📱 Mobile Money</h3>

              <div className="payment-box">
                <p>Dial this code:</p>
                <div className="payment-code">*182*8*1*594213#</div>
              </div>

              <div className="payment-box">
                <p>Or send money to:</p>
                <div className="payment-code">0787 448 122</div>
                <small>Registered to: Vincent</small>
              </div>
            </div>

            {/* Crypto */}
            <div className="payment-section">
              <h3>
                💎 Crypto Payment (
                {selectedPlan === "pack" ? "$0.14" : "$0.34"})
              </h3>

              {/* Binance BEP20 */}
              <div className="crypto-card">
                <div className="crypto-title">Binance (BEP20)</div>
                <div className="crypto-address">
                  0x5ef0b305fa8e0385b54ea8e97141a60451ec23db
                </div>
                <button
                  className="copy-btn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "0x5ef0b305fa8e0385b54ea8e97141a60451ec23db"
                    )
                  }
                >
                  Copy Address
                </button>
              </div>

              {/* Binance TRC20 */}
              <div className="crypto-card">
                <div className="crypto-title">Binance (TRC20)</div>
                <div className="crypto-address">
                  TFmBkE2JkxCsyk7ko8iSuXRoykczhmoPa8
                </div>
                <button
                  className="copy-btn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "TFmBkE2JkxCsyk7ko8iSuXRoykczhmoPa8"
                    )
                  }
                >
                  Copy Address
                </button>
              </div>

              {/* OKX ERC20 */}
              <div className="crypto-card">
                <div className="crypto-title">OKX (ERC20)</div>
                <div className="crypto-address">
                  0xf7c8226782ce273e8dc7c28c9fa9fa12d2b68627
                </div>
                <button
                  className="copy-btn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "0xf7c8226782ce273e8dc7c28c9fa9fa12d2b68627"
                    )
                  }
                >
                  Copy Address
                </button>
              </div>
            </div>

            {/* After Payment */}
            <div className="payment-footer">
              <p>
                After payment, click the button below.
                <br />
                We will activate your plan after confirmation.
              </p>

              <button
                className="confirm-payment-btn"
                onClick={handlePaymentDone}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "I Have Paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Premium;
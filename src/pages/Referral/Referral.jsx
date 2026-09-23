import "./Referral.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiArrowLeft,
  FiCopy,
  FiShare2,
  FiGift,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

const PRIZES = [
  { id: 1, label: "10,000\nRWF", type: "money", value: 10000, color: "#F59E0B" },
  { id: 2, label: "Boost\n7 Days", type: "boost", value: 7, color: "#8B5CF6" },
  { id: 3, label: "1,000\nRWF", type: "money", value: 1000, color: "#22C55E" },
  { id: 4, label: "3 Days\nPremium", type: "premium", value: 3, color: "#3B82F6" },
  { id: 5, label: "5,000\nRWF", type: "money", value: 5000, color: "#EAB308" },
  { id: 6, label: "Try\nAgain", type: "retry", value: 0, color: "#F97316" },
  { id: 7, label: "+5\nChats", type: "chats", value: 5, color: "#14B8A6" },
  { id: 8, label: "0\nRWF", type: "lose", value: 0, color: "#6B7280" },
];

function Referral() {
  const navigate = useNavigate();

  // ========== STATES ==========
  const [currentUser, setCurrentUser] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimError, setClaimError] = useState("");
  const [selectedRewardTier, setSelectedRewardTier] = useState(null);

  // Lotto states
  const [tickets, setTickets] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lottoMessage, setLottoMessage] = useState("");

  // =====================================================
  // AUTH + LOAD DATA
  // =====================================================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;

        if (!mounted) return;

        if (!user) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        setCurrentUser(user);

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("id, referral_code, successful_referrals, lotto_tickets, wallet_balance")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (profileError || !data) {
          setError(".");
          setLoading(false);
          return;
        }

// After you successfully get the profile data
if (data) {
  setReferralData(data);
  setTickets(data.lotto_tickets || 0);
  setWalletBalance(data.wallet_balance || 0);

  // ===== CREATE REAL REFERRAL CODE IF MISSING =====
  if (!data.referral_code) {
    const newCode = `UMUHUZA-${user.id.slice(0, 8).toUpperCase()}`;

    // Save it to the database
    await supabase
      .from("profiles")
      .update({ referral_code: newCode })
      .eq("id", user.id);

    // Update the local state
    setReferralData((prev) => ({
      ...prev,
      referral_code: newCode,
    }));
  }
}
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(".");
          setLoading(false);
        }
      }
    };

    load();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // =====================================================
  // VALUES
  // =====================================================
  const referralCode = referralData?.referral_code || "UMUHUZA-XXXXXX";
  const successfulReferrals = Number(referralData?.successful_referrals ?? 0);

  const productionDomain = "https://umuhuza-com-a1xv.vercel.app";
  const referralLink = `${
    window.location.hostname === "localhost" ? productionDomain : window.location.origin
  }/signup?ref=${encodeURIComponent(referralCode)}`;

  // =====================================================
  // REWARD DEFINITIONS
  // =====================================================
  const rewardDefinitions = {
    five: {
      tier: "five",
      threshold: 5,
      title: "5 Friends Reward",
      description: "You've successfully invited 5 friends.",
      benefit: "Profile Boost + 2 free chats unlocked.",
      icon: "🚀",
    },
    ten: {
      tier: "ten",
      threshold: 10,
      title: "10 Friends Reward",
      description: "You've successfully invited 10 friends.",
      benefit: "Stronger Profile Boost + 10 free chats unlocked.",
      icon: "🚀",
    },
    fifteen: {
      tier: "fifteen",
      threshold: 15,
      title: "15+ Friends Special Reward",
      description: "You've successfully invited 15 or more friends.",
      benefit: "1 Month Unlimited Messaging + Maximum Profile Boost.",
      icon: "⭐",
    },
  };

  const rewardLevel = useMemo(() => {
    if (successfulReferrals >= 15) {
      return {
        type: "special",
        title: "Special Reward Unlocked!",
        description: "You've unlocked 1 Month Unlimited Messaging + Maximum Profile Boost.",
      };
    }
    if (successfulReferrals >= 10) {
      return {
        type: "ten",
        title: "10 Friends Reward Unlocked!",
        description: "You've unlocked Stronger Profile Boost + 10 free chats.",
      };
    }
    if (successfulReferrals >= 5) {
      return {
        type: "five",
        title: "5 Friends Reward Unlocked!",
        description: "You've unlocked Profile Boost + 2 free chats.",
      };
    }
    return {
      type: "progress",
      title: "Keep Inviting!",
      description: "Invite 5 friends to unlock your first reward.",
    };
  }, [successfulReferrals]);

  const currentTarget =
    successfulReferrals >= 15 ? 15 : successfulReferrals >= 10 ? 15 : successfulReferrals >= 5 ? 10 : 5;

  const progressPercentage =
    currentTarget > 0 ? Math.min((successfulReferrals / currentTarget) * 100, 100) : 0;

  const remaining =
    successfulReferrals >= 15 ? 0 : Math.max(currentTarget - successfulReferrals, 0);

  // =====================================================
  // SPIN FUNCTION
  // =====================================================
  const handleSpin = async () => {
    if (spinning || tickets <= 0) return;

    setSpinning(true);
    setLottoMessage("");

    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[randomIndex];

    const segmentAngle = 360 / PRIZES.length;
    const finalRotation =
      rotation + 5 * 360 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation(finalRotation);

    setTimeout(async () => {
      let newTickets = tickets - 1;
      let newBalance = walletBalance;
      let msg = "";

      if (prize.type === "money") {
        newBalance += prize.value;
        msg = `🎉 You won ${prize.value.toLocaleString()} RWF!`;
      } else if (prize.type === "chats") {
        msg = `🎉 You won +${prize.value} Free Chats!`;
      } else if (prize.type === "boost") {
        msg = `🚀 Profile Boost for ${prize.value} days!`;
      } else if (prize.type === "premium") {
        msg = `⭐ Unlimited Chat for ${prize.value} days!`;
      } else if (prize.type === "retry") {
        newTickets += 1;
        msg = "🔄 Try Again! Ticket returned.";
      } else {
        msg = "😔 0 RWF - Better luck next time!";
      }

      setTickets(newTickets);
      setWalletBalance(newBalance);
      setLottoMessage(msg);

      if (currentUser) {
        await supabase
          .from("profiles")
          .update({
            lotto_tickets: newTickets,
            wallet_balance: newBalance,
          })
          .eq("id", currentUser.id);
      }

      setSpinning(false);
    }, 4500);
  };

  // =====================================================
  // COPY / SHARE
  // =====================================================
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const shareText = `💕 Join me on UMUHUZA!\n\n${referralLink}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Join UMUHUZA", text: shareText, url: referralLink });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      if (err?.name !== "AbortError") console.error(err);
    }
  };

  // =====================================================
  // CLAIM REWARD
  // =====================================================
  const handleOpenClaimReward = async () => {
    setClaimError("");
    setClaimMessage("");

    try {
      if (!currentUser) {
        setClaimError("Please log in again.");
        setShowClaimModal(true);
        return;
      }

      const { data: claims } = await supabase
        .from("reward_claims")
        .select("reward_tier")
        .eq("user_id", currentUser.id);

      const claimedTiers = new Set((claims || []).map((c) => c.reward_tier));

      let availableReward = null;
      if (successfulReferrals >= 15 && !claimedTiers.has("fifteen")) {
        availableReward = rewardDefinitions.fifteen;
      } else if (successfulReferrals >= 10 && !claimedTiers.has("ten")) {
        availableReward = rewardDefinitions.ten;
      } else if (successfulReferrals >= 5 && !claimedTiers.has("five")) {
        availableReward = rewardDefinitions.five;
      }

      if (!availableReward) {
        setClaimError("You have already claimed all available rewards.");
        setShowClaimModal(true);
        return;
      }

      setSelectedRewardTier(availableReward);
      setShowClaimModal(true);
    } catch (err) {
      setClaimError("Unable to check rewards.");
      setShowClaimModal(true);
    }
  };

  const handleCloseClaimReward = () => {
    if (claimingReward) return;
    setShowClaimModal(false);
    setSelectedRewardTier(null);
    setClaimError("");
    setClaimMessage("");
  };

  const handleClaimReward = async () => {
    if (!currentUser || !selectedRewardTier) return;

    const { tier, threshold } = selectedRewardTier;

    try {
      setClaimingReward(true);
      setClaimError("");
      setClaimMessage("");

      const { data, error: rpcError } = await supabase.rpc("claim_referral_reward", {
        p_user_id: currentUser.id,
        p_reward_tier: tier,
        p_threshold: threshold,
      });

      if (rpcError) {
        setClaimError("Could not claim reward. Please try again.");
        return;
      }

      if (data?.success === true) {
        setClaimMessage(`🎉 Your ${threshold}-friend reward has been claimed!`);
      } else {
        setClaimError(data?.reason || "Could not claim reward.");
      }
    } catch (err) {
      setClaimError("Could not claim reward.");
    } finally {
      setClaimingReward(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  if (!currentUser) {
    return (
      <div className="referral-page">
        <div className="referral-empty-state">
          <div className="referral-empty-icon">💕</div>
          <h2>Please log in</h2>
          <p>Log in to access your UMUHUZA referral rewards.</p>
          <button type="button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="referral-page">
        <div className="referral-loading">
          <div className="referral-loading-icon">💕</div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page">
      {/* HEADER */}
      <header className="referral-header">
        <button
          type="button"
          className="referral-back-btn"
          onClick={() => navigate("/member-home")}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div className="referral-logo">
          <img
            src={umurangaLogo}
            alt="UMUHUZA.COM"
            style={{ height: 36, objectFit: "contain" }}
          />
        </div>
        <div className="referral-header-spacer" />
      </header>

      <main className="referral-main">
        {/* ================= LOTTO SECTION ================= */}
        <section className="lotto-section">
          <div className="lotto-title">
            <div className="lotto-heart">💜</div>
            <h2>
              UMUHUZA <span>LOTTO</span>
            </h2>
            <p>Spin & Win Real Money + Rewards</p>
          </div>

          <div className="lotto-stats">
            <div className="lotto-stat">
              <span>🎫</span>
              <div>
                <small>Tickets</small>
                <strong>{tickets}</strong>
              </div>
            </div>
            <div className="lotto-stat">
              <span>👛</span>
              <div>
                <small>Wallet</small>
                <strong>{walletBalance.toLocaleString()} RWF</strong>
              </div>
            </div>
          </div>

          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
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

          {lottoMessage && <div className="lotto-result">{lottoMessage}</div>}

          <button
            className="spin-now-btn"
            onClick={handleSpin}
            disabled={spinning || tickets <= 0}
          >
            {spinning ? "Spinning..." : tickets <= 0 ? "No Tickets" : "SPIN NOW ▶"}
          </button>
        </section>

        {/* ================= INVITE & REWARD ================= */}
        <section className="referral-hero">
          <div className="referral-hero-icon">💕</div>
          <div>
            <div className="referral-label">INVITE & REWARD</div>
            <h1>Invite Friends</h1>
            <p>
              Invite your friends to UMUHUZA and unlock free chats + profile boost.
            </p>
          </div>
        </section>

        {error && <div className="referral-error">{error}</div>}

        {/* CODE + LINK */}
        <section className="referral-sharing-grid">
          <div className="referral-share-card">
            <div className="share-card-heading">
              <div className="share-card-icon purple">
                <FiGift />
              </div>
              <div>
                <span>Your referral code</span>
                <strong>Share this code with friends</strong>
              </div>
            </div>
            <div className="referral-code-box">
              <span>{referralCode}</span>
              <button type="button" onClick={handleCopyCode}>
                {copiedCode ? <FiCheckCircle /> : <FiCopy />}
                <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          <div className="referral-share-card">
            <div className="share-card-heading">
              <div className="share-card-icon green">
                <FiShare2 />
              </div>
              <div>
                <span>Your referral link</span>
                <strong>Send this link to your friends</strong>
              </div>
            </div>
            <div className="referral-link-box">
              <div className="referral-link-text">{referralLink}</div>
              <div className="referral-link-actions">
                <button type="button" onClick={handleCopyLink}>
                  {copiedLink ? <FiCheckCircle /> : <FiCopy />}
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </button>
                <button type="button" className="share-button" onClick={handleShare}>
                  <FiShare2 />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="referral-progress-card">
          <div className="progress-card-top">
            <div>
              <div className="progress-small-label">YOUR PROGRESS</div>
              <h2>
                {successfulReferrals} <span>/ {currentTarget}</span>
              </h2>
            </div>
            <div className="progress-users-icon">
              <FiUsers />
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {successfulReferrals >= 15 ? (
            <div className="progress-message success">
              <FiStar />
              <div>
                <strong>Amazing! 🎉</strong>
                <span>You've reached the special 15+ level.</span>
              </div>
            </div>
          ) : (
            <div className="progress-message">
              <FiGift />
              <div>
                <strong>
                  {remaining === 1
                    ? "1 more successful referral"
                    : `${remaining} more successful referrals`}
                </strong>
                <span> to unlock your next reward! 🎁</span>
              </div>
            </div>
          )}
        </section>

        {/* REWARD UNLOCKED */}
        {successfulReferrals >= 5 && (
          <section className={`reward-unlocked-card ${rewardLevel.type}`}>
            <div className="reward-unlocked-icon">
              {successfulReferrals >= 15 ? "⭐" : "🎉"}
            </div>
            <div className="reward-unlocked-content">
              <div className="reward-unlocked-label">
                {successfulReferrals >= 15 ? "SPECIAL REWARD" : "REWARD UNLOCKED"}
              </div>
              <h2>{rewardLevel.title}</h2>
              <p>{rewardLevel.description}</p>
              <div className="reward-benefit">
                <FiMessageCircle />
                <span>
                  {successfulReferrals >= 15
                    ? "1 Month Unlimited Messaging + Maximum Profile Boost"
                    : successfulReferrals >= 10
                    ? "Stronger Profile Boost + 10 free chats"
                    : "Profile Boost + 2 free chats"}
                </span>
              </div>
              <button
                type="button"
                className="claim-reward-btn"
                onClick={handleOpenClaimReward}
                disabled={claimingReward}
              >
                <FiGift />
                {claimingReward ? "Claiming..." : "Claim Your Reward"}
              </button>
            </div>
          </section>
        )}

        {/* REWARD LEVELS */}
        <section className="reward-levels-section">
          <div className="section-heading">
            <div>
              <span>KEEP GOING</span>
              <h2>Referral Rewards</h2>
            </div>
            <FiGift />
          </div>

          <div className="reward-levels">
            <div className={`reward-level ${successfulReferrals >= 5 ? "unlocked" : ""}`}>
              <div className="reward-level-number">
                {successfulReferrals >= 5 ? <FiCheckCircle /> : "5"}
              </div>
              <div className="reward-level-content">
                <strong>First Reward</strong>
                <span>Invite 5 successful members</span>
              </div>
              <div className="reward-level-prize">🚀 Profile Boost + 2 Free Chats</div>
            </div>

            <div className={`reward-level ${successfulReferrals >= 10 ? "unlocked" : ""}`}>
              <div className="reward-level-number">
                {successfulReferrals >= 10 ? <FiCheckCircle /> : "10"}
              </div>
              <div className="reward-level-content">
                <strong>Double Reward</strong>
                <span>Invite 10 successful members</span>
              </div>
              <div className="reward-level-prize">🚀 Stronger Boost + 10 Free Chats</div>
            </div>

            <div className={`reward-level special ${successfulReferrals >= 15 ? "unlocked" : ""}`}>
              <div className="reward-level-number">
                {successfulReferrals >= 15 ? <FiCheckCircle /> : <FiStar />}
              </div>
              <div className="reward-level-content">
                <strong>Special Reward</strong>
                <span>Invite 15 or more successful members</span>
              </div>
              <div className="reward-level-prize">⭐ 1 Month Unlimited Messaging</div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="referral-how-card">
          <div className="how-icon">💕</div>
          <div>
            <h3>How it works</h3>
            <p>
              Share your unique referral link or code with friends. When they successfully
              join UMUHUZA, your progress increases and you unlock free chats + profile boost.
            </p>
          </div>
        </section>
      </main>

      {/* CLAIM MODAL */}
      {showClaimModal && (
        <div className="claim-modal-overlay" onClick={handleCloseClaimReward}>
          <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="claim-modal-close"
              onClick={handleCloseClaimReward}
              disabled={claimingReward}
            >
              <FiX />
            </button>

            <div className="claim-modal-icon">
              {selectedRewardTier?.icon || "🎁"}
            </div>
            <div className="claim-modal-label">UMUHUZA.COM REWARD</div>
            <h2>{selectedRewardTier ? selectedRewardTier.title : "Reward"}</h2>

            {claimMessage && (
              <div className="claim-success-message">
                <FiCheckCircle />
                <span>{claimMessage}</span>
              </div>
            )}

            {claimError && <div className="claim-error-message">{claimError}</div>}

            {selectedRewardTier && (
              <>
                <p className="claim-modal-description">
                  {selectedRewardTier.description}
                </p>
                <div className="claim-modal-benefit">
                  <FiMessageCircle />
                  <span>{selectedRewardTier.benefit}</span>
                </div>

                {!claimMessage && (
                  <button
                    type="button"
                    className="claim-confirm-btn"
                    onClick={handleClaimReward}
                    disabled={claimingReward}
                  >
                    <FiGift />
                    {claimingReward ? "Processing..." : "Confirm & Claim Reward"}
                  </button>
                )}
              </>
            )}

            {claimMessage && (
              <button
                type="button"
                className="claim-done-btn"
                onClick={handleCloseClaimReward}
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Referral;
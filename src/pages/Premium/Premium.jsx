import "./Premium.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiGift,
  FiUnlock,
} from "react-icons/fi";

import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { supabase } from "../../lib/supabase";
import { useAppPreferences } from "../../context/AppPreferencesContext";

function Premium() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();

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
      const planName =
        selectedPlan === "pack" ? "pack_5" : "monthly";

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
              ? t("premium.interestPackPurpose")
              : t("premium.monthlyPurpose"),
        })
        .select();

      console.log("Insert result:", { data, error });

      if (error) {
        console.error("Payment insert error:", error);

        setMessage(
          t("premium.paymentError").replace(
            "{message}",
            error.message
          )
        );

        return;
      }

      setShowPaymentModal(false);

      setMessage(t("premium.paymentSubmitted"));
    } catch (err) {
      console.error("Unexpected error:", err);

      setMessage(t("premium.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // CALCULATE STATUS
  // =====================================================
  const freeChatsUsed = profile?.chat_limit_used || 0;
  const freeChatsLimit = 10;

  const remainingFreeChats = Math.max(
    freeChatsLimit - freeChatsUsed,
    0
  );

  const extraCredits = profile?.extra_chat_credits || 0;

  const isPremium =
    profile?.premium_until &&
    new Date(profile.premium_until) > new Date();

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="premium-page">
        <div className="premium-loading">
          {t("premium.loading")}
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="premium-page">
      {/* Header */}
      <header className="premium-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> {t("premium.back")}
        </button>

        <div className="premium-logo">
          <img src={umurangaLogo} alt="UMUHUZA" />
        </div>
      </header>

      <main className="premium-main">
        {/* Hero */}
        <div className="premium-hero">
          <h1>{t("premium.title")}</h1>

          <p>{t("premium.subtitle")}</p>
        </div>

        {/* Current Status */}
        <div className="status-card">
          <h3>{t("premium.currentStatus")}</h3>

          <div className="status-row">
            <span>
              {t("premium.freeChatsRemaining")}
            </span>

            <strong>
              {remainingFreeChats} / {freeChatsLimit}
            </strong>
          </div>

          <div className="status-row">
            <span>
              {t("premium.extraChatCredits")}
            </span>

            <strong>{extraCredits}</strong>
          </div>

          <div className="status-row">
            <span>
              {t("premium.premiumStatus")}
            </span>

            <strong
              className={
                isPremium ? "active" : "inactive"
              }
            >
              {isPremium
                ? t("premium.active")
                : t("premium.notActive")}
            </strong>
          </div>
        </div>

        {/* Payment message */}
        {message && (
          <div className="premium-message">
            {message}
          </div>
        )}

        {/* =====================================================
            OPTION 1 - CHAT PACK
        ===================================================== */}
        <div className="premium-card">
          <div className="card-badge">
            {t("premium.popular")}
          </div>

          <h2>{t("premium.chatPack")}</h2>

          <p className="price">
            200 RWF <span>/ $0.14</span>
          </p>

          <p className="desc">
            {t("premium.chatPackDescription")}
          </p>

          <ul>
            <li>
              <FiCheck />{" "}
              {t("premium.newChatSlots")}
            </li>

            <li>
              <FiCheck />{" "}
              {t("premium.neverExpires")}
            </li>

            <li>
              <FiCheck />{" "}
              {t("premium.instantActivation")}
            </li>
          </ul>

          <button
            className="premium-btn pack-btn"
            onClick={() => {
              setSelectedPlan("pack");
              setShowPaymentModal(true);
            }}
          >
            {t("premium.buyChatPack")}
          </button>
        </div>

        {/* =====================================================
            OPTION 2 - MONTHLY UNLIMITED
        ===================================================== */}
        <div className="premium-card featured">
          <div className="card-badge best">
            {t("premium.bestValue")}
          </div>

          <h2>
            {t("premium.monthlyUnlimited")}
          </h2>

          <p className="price">
            500 RWF <span>/ $0.34</span>
          </p>

          <p className="desc">
            {t("premium.monthlyDescription")}
          </p>

          <ul>
            <li>
              <FiUnlock />{" "}
              {t("premium.unlimitedNewChats")}
            </li>

            <li>
              <FiCheck />{" "}
              {t("premium.valid30Days")}
            </li>

            <li>
              <FiCheck />{" "}
              {t("premium.prioritySupport")}
            </li>
          </ul>

          <button
            className="premium-btn monthly-btn"
            onClick={() => {
              setSelectedPlan("monthly");
              setShowPaymentModal(true);
            }}
          >
            {t("premium.upgradePremium")}
          </button>
        </div>

        {/* =====================================================
            OPTION 3 - REFERRAL
        ===================================================== */}
        <div className="premium-card referral-card">
          <h2>
            <FiGift />{" "}
            {t("premium.referralRewards")}
          </h2>

          <p className="desc">
            {t("premium.referralDescription")}
          </p>

          <div className="referral-rewards">
            {/* 5 Friends */}
            <div className="reward-item">
              <span className="reward-number">
                5
              </span>

              <div>
                <strong>
                  {t("premium.invite5Friends")}
                </strong>

                <p>
                  {t("premium.freeChats2")}
                </p>
              </div>
            </div>

            {/* 10 Friends */}
            <div className="reward-item">
              <span className="reward-number">
                10
              </span>

              <div>
                <strong>
                  {t("premium.invite10Friends")}
                </strong>

                <p>
                  {t("premium.freeChats10")}
                </p>
              </div>
            </div>

            {/* 15 Friends */}
            <div className="reward-item special">
              <span className="reward-number">
                15
              </span>

              <div>
                <strong>
                  {t("premium.invite15Friends")}
                </strong>

                <p>
                  {t("premium.oneMonthUnlimited")}
                </p>
              </div>
            </div>
          </div>

          <button
            className="premium-btn referral-btn"
            onClick={() => navigate("/referral")}
          >
            {t("premium.goToReferral")}
          </button>
        </div>

        {/* Note */}
        <p className="premium-note">
          {t("premium.noteExisting")}
          <br />
          {t("premium.noteNew")}
        </p>
      </main>

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}
      {showPaymentModal && (
        <div
          className="payment-overlay"
          onClick={() =>
            setShowPaymentModal(false)
          }
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* =================================================
                PAYMENT HEADER
            ================================================= */}
            <div className="payment-header">
              <div>
                <h2>
                  {selectedPlan === "pack"
                    ? t("premium.chatPackPlan")
                    : t("premium.monthlyPlan")}
                </h2>

                <p>
                  {t("premium.choosePayment")}
                </p>
              </div>

              <button
                className="payment-close"
                onClick={() =>
                  setShowPaymentModal(false)
                }
              >
                ✕
              </button>
            </div>

            {/* =================================================
                MOBILE MONEY
            ================================================= */}
            <div className="payment-section">
              <h3>
                {t("premium.mobileMoney")}
              </h3>

              <div className="payment-box">
                <p>
                  {t("premium.dialCode")}
                </p>

                <div className="payment-code">
                  *182*8*1*594213#
                </div>
              </div>

              <div className="payment-box">
                <p>
                  {t("premium.sendMoney")}
                </p>

                <div className="payment-code">
                  0787 448 122
                </div>

                <small>
                  {t("premium.registeredTo")}
                </small>
              </div>
            </div>

            {/* =================================================
                CRYPTO
            ================================================= */}
            <div className="payment-section">
              <h3>
                {t("premium.cryptoPayment")} (
                {selectedPlan === "pack"
                  ? "$0.14"
                  : "$0.34"}
                )
              </h3>

              {/* Binance BEP20 */}
              <div className="crypto-card">
                <div className="crypto-title">
                  Binance (BEP20)
                </div>

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
                  {t("premium.copyAddress")}
                </button>
              </div>

              {/* Binance TRC20 */}
              <div className="crypto-card">
                <div className="crypto-title">
                  Binance (TRC20)
                </div>

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
                  {t("premium.copyAddress")}
                </button>
              </div>

              {/* OKX ERC20 */}
              <div className="crypto-card">
                <div className="crypto-title">
                  OKX (ERC20)
                </div>

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
                  {t("premium.copyAddress")}
                </button>
              </div>
            </div>

            {/* =================================================
                AFTER PAYMENT
            ================================================= */}
            <div className="payment-footer">
              <p>
                {t("premium.afterPayment")}
                <br />
                {t(
                  "premium.activationConfirmation"
                )}
              </p>

              <button
                className="confirm-payment-btn"
                onClick={handlePaymentDone}
                disabled={submitting}
              >
                {submitting
                  ? t("premium.submitting")
                  : t("premium.iHavePaid")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Premium;
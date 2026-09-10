import "./Referral.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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


function Referral() {
  const navigate = useNavigate();


  // =====================================================
  // CURRENT USER
  // =====================================================

  const [currentUser, setCurrentUser] = useState(null);


  // =====================================================
  // REFERRAL DATA
  // =====================================================

  const [referralData, setReferralData] = useState(null);


  const [loading, setLoading] = useState(true);


  const [error, setError] = useState("");


  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState(null);


  // =====================================================
  // COPY / SHARE STATE
  // =====================================================

  const [copiedCode, setCopiedCode] =
    useState(false);

  const [copiedLink, setCopiedLink] =
    useState(false);


  // =====================================================
  // CLAIM REWARD STATE
  // =====================================================

  const [showClaimModal, setShowClaimModal] =
    useState(false);

  const [claimingReward, setClaimingReward] =
    useState(false);

  const [claimMessage, setClaimMessage] =
    useState("");

  const [claimError, setClaimError] =
    useState("");

  const [selectedRewardTier, setSelectedRewardTier] =
    useState(null);


  // =====================================================
  // AUTHENTICATION
  // SUPABASE
  // =====================================================

  useEffect(() => {
    let mounted = true;


    const loadSession = async () => {
      try {
        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession();


        if (sessionError) {
          console.error(
            "Unable to get Supabase session:",
            sessionError
          );


          if (mounted) {
            setCurrentUser(null);
            setReferralData(null);
            setLoading(false);
          }


          return;
        }


        const user = data?.session?.user ?? null;


        if (mounted) {
          setCurrentUser(user);


          if (!user) {
            setReferralData(null);
            setLoading(false);
          }
        }
      } catch (sessionError) {
        console.error(
          "Supabase session error:",
          sessionError
        );


        if (mounted) {
          setCurrentUser(null);
          setReferralData(null);
          setLoading(false);
        }
      }
    };


    loadSession();


    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) return;


          const user =
            session?.user ?? null;


          setCurrentUser(user);


          if (!user) {
            setReferralData(null);
            setLoading(false);
          }
        }
      );


    return () => {
      mounted = false;


      authListener?.subscription?.unsubscribe();
    };
  }, []);


  // =====================================================
  // LOAD REFERRAL DATA
  // SUPABASE
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }


    let mounted = true;


    const loadReferralData = async () => {
      try {
        setLoading(true);
        setError("");


        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            `
              id,
              referral_code,
              successful_referrals
            `
          )
          .eq("id", currentUser.id)
          .maybeSingle();


        if (!mounted) return;


        if (profileError) {
          console.error(
            "UMUHUZA referral profile error:",
            profileError
          );


          setReferralData(null);


          setError(
            "Unable to load your referral information."
          );


          setLoading(false);


          return;
        }


        if (!data) {
          setReferralData(null);


          setError(
            "Unable to load your referral information."
          );


          setLoading(false);


          return;
        }


        /*
        =====================================================
        IMPORTANT

        The referral counter comes directly from
        successful_referrals in the Supabase profiles table.

        We intentionally do NOT use referral_count as
        a fallback here.

        This keeps one permanent source of truth for
        successful referrals.
        =====================================================
        */


        setReferralData(data);


        setLoading(false);
      } catch (loadError) {
        console.error(
          "UMUHUZA referral loading error:",
          loadError
        );


        if (!mounted) return;


        setError(
          "Unable to load your referral information."
        );


        setLoading(false);
      }
    };


    loadReferralData();


    /*
    =====================================================
    REALTIME PROFILE UPDATES

    When successful_referrals changes in Supabase,
    refresh the referral information automatically.
    =====================================================
    */


    const channel =
      supabase
        .channel(
          `referral-profile-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${currentUser.id}`,
          },
          async () => {
            const {
              data,
              error: refreshError,
            } = await supabase
              .from("profiles")
              .select(
                `
                  id,
                  referral_code,
                  successful_referrals
                `
              )
              .eq("id", currentUser.id)
              .maybeSingle();


            if (refreshError) {
              console.error(
                "Unable to refresh referral profile:",
                refreshError
              );


              return;
            }


            if (data && mounted) {
              setReferralData(data);
            }
          }
        )
        .subscribe();


    return () => {
      mounted = false;


      supabase.removeChannel(channel);
    };
  }, [currentUser]);


  // =====================================================
  // REFERRAL CODE
  // =====================================================

  const referralCode =
    referralData?.referral_code ||
    "UMUHUZA-XXXXXX";


  // =====================================================
  // SUCCESSFUL REFERRALS
  // =====================================================

  const successfulReferrals =
    Number(
      referralData?.successful_referrals ?? 0
    );


  // =====================================================
  // REFERRAL LINK
  // =====================================================

  const referralLink =
    `${window.location.origin}/signup?ref=${encodeURIComponent(
      referralCode
    )}`;


  // =====================================================
  // REWARD DEFINITIONS
  // =====================================================

  const rewardDefinitions = {
    five: {
      tier: "five",

      threshold: 5,

      title: "5 Friends Reward",

      description:
        "You've successfully invited 5 friends.",

      benefit:
        "1 free WhatsApp number for one person you choose.",

      icon: "🎁",
    },


    ten: {
      tier: "ten",

      threshold: 10,

      title: "10 Friends Reward",

      description:
        "You've successfully invited 10 friends.",

      benefit:
        "2 free WhatsApp numbers for two people you choose.",

      icon: "🎁",
    },


    fifteen: {
      tier: "fifteen",

      threshold: 15,

      title: "15+ Friends Special Reward",

      description:
        "You've successfully invited 15 or more friends.",

      benefit:
        "You've unlocked the special UMUHUZA reward.",

      icon: "⭐",
    },
  };


  // =====================================================
  // REWARD LEVEL
  // =====================================================

  const rewardLevel =
    useMemo(() => {
      if (successfulReferrals >= 15) {
        return {
          type: "special",

          title:
            "Special Reward Unlocked!",

          description:
            "You've successfully invited 15 or more friends. Your special UMUHUZA reward is unlocked.",
        };
      }


      if (successfulReferrals >= 10) {
        return {
          type: "ten",

          title:
            "2 Rewards Unlocked!",

          description:
            "You've successfully invited 10 friends. You've unlocked 2 free WhatsApp numbers.",
        };
      }


      if (successfulReferrals >= 5) {
        return {
          type: "five",

          title:
            "Reward Unlocked!",

          description:
            "You've successfully invited 5 friends. You've unlocked 1 free WhatsApp number.",
        };
      }


      return {
        type: "progress",

        title:
          "Keep Inviting!",

        description:
          "Invite 5 friends who successfully join UMUHUZA to unlock your first reward.",
      };
    }, [
      successfulReferrals,
    ]);


  // =====================================================
  // CURRENT TARGET
  // =====================================================

  const currentTarget =
    successfulReferrals >= 15
      ? 15
      : successfulReferrals >= 10
      ? 15
      : successfulReferrals >= 5
      ? 10
      : 5;


  // =====================================================
  // PROGRESS PERCENTAGE
  // =====================================================

  const progressPercentage =
    currentTarget > 0
      ? Math.min(
          (
            successfulReferrals /
            currentTarget
          ) * 100,
          100
        )
      : 0;


  // =====================================================
  // REMAINING
  // =====================================================

  const remaining =
    successfulReferrals >= 15
      ? 0
      : Math.max(
          currentTarget -
            successfulReferrals,
          0
        );


  // =====================================================
  // COPY REFERRAL CODE
  // =====================================================

  const handleCopyCode =
    async () => {
      try {
        await navigator.clipboard.writeText(
          referralCode
        );


        setCopiedCode(true);


        setTimeout(() => {
          setCopiedCode(false);
        }, 2000);
      } catch (copyError) {
        console.error(
          "Unable to copy referral code:",
          copyError
        );
      }
    };


  // =====================================================
  // COPY REFERRAL LINK
  // =====================================================

  const handleCopyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          referralLink
        );


        setCopiedLink(true);


        setTimeout(() => {
          setCopiedLink(false);
        }, 2000);
      } catch (copyError) {
        console.error(
          "Unable to copy referral link:",
          copyError
        );
      }
    };


  // =====================================================
  // SHARE
  // =====================================================

  const handleShare =
    async () => {
      const shareText =
        `💕 Join me on UMUHUZA! Find genuine connections and start your journey today.\n\n${referralLink}`;


      try {
        if (navigator.share) {
          await navigator.share({
            title: "Join UMUHUZA",

            text: shareText,

            url: referralLink,
          });


          return;
        }


        await navigator.clipboard.writeText(
          shareText
        );


        setCopiedLink(true);


        setTimeout(() => {
          setCopiedLink(false);
        }, 2000);
      } catch (shareError) {
        if (
          shareError?.name ===
          "AbortError"
        ) {
          return;
        }


        console.error(
          "Unable to share referral:",
          shareError
        );
      }
    };


  // =====================================================
  // OPEN CLAIM REWARD
  // =====================================================

  const handleOpenClaimReward =
    async () => {
      setClaimError("");
      setClaimMessage("");


      let availableReward = null;


      /*
      =====================================================
      HIGHEST UNCLAIMED REWARD

      We now check reward_claims in Supabase rather
      than the old Firebase claimedRewards object.
      =====================================================
      */


      try {
        if (!currentUser) {
          setClaimError(
            "Please log in again before claiming your reward."
          );


          setShowClaimModal(true);


          return;
        }


        const {
          data: claims,
          error: claimsError,
        } = await supabase
          .from("reward_claims")
          .select(
            "reward_tier"
          )
          .eq(
            "user_id",
            currentUser.id
          );


        if (claimsError) {
          console.error(
            "Unable to load reward claims:",
            claimsError
          );


          setClaimError(
            "Unable to check your reward history. Please try again."
          );


          setShowClaimModal(true);


          return;
        }


        const claimedTiers =
          new Set(
            (claims || []).map(
              (claim) =>
                claim.reward_tier
            )
          );


        if (
          successfulReferrals >= 15 &&
          !claimedTiers.has("fifteen")
        ) {
          availableReward =
            rewardDefinitions.fifteen;
        } else if (
          successfulReferrals >= 10 &&
          !claimedTiers.has("ten")
        ) {
          availableReward =
            rewardDefinitions.ten;
        } else if (
          successfulReferrals >= 5 &&
          !claimedTiers.has("five")
        ) {
          availableReward =
            rewardDefinitions.five;
        }


        /*
        ===================================================
        NOTHING AVAILABLE
        ===================================================
        */


        if (!availableReward) {
          setClaimError(
            "You have already claimed all rewards currently available to you."
          );


          setShowClaimModal(true);


          return;
        }


        setSelectedRewardTier(
          availableReward
        );


        setShowClaimModal(true);
      } catch (claimCheckError) {
        console.error(
          "Unable to check referral rewards:",
          claimCheckError
        );


        setClaimError(
          "Unable to check your available rewards. Please try again."
        );


        setShowClaimModal(true);
      }
    };


  // =====================================================
  // CLOSE CLAIM MODAL
  // =====================================================

  const handleCloseClaimReward =
    () => {
      if (claimingReward) {
        return;
      }


      setShowClaimModal(false);

      setSelectedRewardTier(null);

      setClaimError("");

      setClaimMessage("");
    };


  // =====================================================
  // CLAIM REWARD
  // SUPABASE RPC
  // =====================================================

  const handleClaimReward =
    async () => {
      if (!currentUser) {
        setClaimError(
          "Please log in again before claiming your reward."
        );


        return;
      }


      if (!selectedRewardTier) {
        setClaimError(
          "Please select a reward first."
        );


        return;
      }


      const {
        tier,
        threshold,
      } = selectedRewardTier;


      try {
        setClaimingReward(true);

        setClaimError("");

        setClaimMessage("");


        /*
        =====================================================
        CALL SUPABASE RPC

        The PostgreSQL function handles the transaction,
        threshold check, duplicate protection, and
        reward_claims insert atomically.
        =====================================================
        */


        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "claim_referral_reward",
          {
            p_user_id:
              currentUser.id,

            p_reward_tier:
              tier,

            p_threshold:
              threshold,
          }
        );


        if (rpcError) {
          console.error(
            "UMUHUZA reward claim RPC error:",
            rpcError
          );


          setClaimError(
            "We couldn't complete your reward claim. Please try again."
          );


          return;
        }


        if (!data) {
          setClaimError(
            "No response was received from the reward system. Please try again."
          );


          return;
        }


        /*
        =====================================================
        SUCCESS
        =====================================================
        */


        if (
          data.success === true
        ) {
          setClaimMessage(
            `🎉 Your ${threshold}-friend reward has been successfully claimed!`
          );


          setClaimError("");


          return;
        }


        /*
        =====================================================
        ALREADY CLAIMED
        =====================================================
        */


        if (
          data.reason ===
          "REWARD_ALREADY_CLAIMED"
        ) {
          setClaimError(
            "This reward has already been claimed."
          );


          return;
        }


        /*
        =====================================================
        THRESHOLD NOT REACHED
        =====================================================
        */


        if (
          data.reason ===
          "REFERRAL_THRESHOLD_NOT_REACHED"
        ) {
          setClaimError(
            "You have not reached the required referral level yet."
          );


          return;
        }


        /*
        =====================================================
        USER NOT FOUND
        =====================================================
        */


        if (
          data.reason ===
          "USER_NOT_FOUND"
        ) {
          setClaimError(
            "Your UMUHUZA account could not be found."
          );


          return;
        }


        /*
        =====================================================
        UNKNOWN RESPONSE
        =====================================================
        */


        console.warn(
          "Unexpected reward claim response:",
          data
        );


        setClaimError(
          "We couldn't complete your reward claim. Please try again."
        );
      } catch (claimError) {
        console.error(
          "UMUHUZA reward claim error:",
          claimError
        );


        setClaimError(
          "We couldn't complete your reward claim. Please try again."
        );
      } finally {
        setClaimingReward(false);
      }
    };


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser) {
    return (
      <div className="referral-page">

        <div className="referral-empty-state">

          <div className="referral-empty-icon">
            💕
          </div>


          <h2>
            Please log in
          </h2>


          <p>
            Log in to access your UMUHUZA
            referral rewards.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="referral-page">

        <div className="referral-loading">

          <div className="referral-loading-icon">
            💕
          </div>


          <h2>
            Loading your rewards...
          </h2>


          <p>
            Please wait a moment.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="referral-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="referral-header">

        <button
          type="button"
          className="referral-back-btn"
          onClick={() =>
            navigate(
              "/member-home"
            )
          }
        >

          <FiArrowLeft />

          <span>
            Back
          </span>

        </button>


        <div className="referral-logo">
          ❤️ UMUHUZA
        </div>


        <div className="referral-header-spacer" />

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="referral-main">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="referral-hero">

          <div className="referral-hero-icon">
            💕
          </div>


          <div>

            <div className="referral-label">
              INVITE & REWARD
            </div>


            <h1>
              Invite Friends
            </h1>


            <p>
              Invite your friends to UMUHUZA
              and unlock exciting rewards.
            </p>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="referral-error">
            {error}
          </div>
        )}


        {/* =================================================
            REFERRAL CODE + LINK
        ================================================= */}

        <section className="referral-sharing-grid">


          {/* CODE */}

          <div className="referral-share-card">

            <div className="share-card-heading">

              <div className="share-card-icon purple">
                <FiGift />
              </div>


              <div>

                <span>
                  Your referral code
                </span>

                <strong>
                  Share this code with friends
                </strong>

              </div>

            </div>


            <div className="referral-code-box">

              <span>
                {referralCode}
              </span>


              <button
                type="button"
                onClick={
                  handleCopyCode
                }
              >

                {copiedCode
                  ? <FiCheckCircle />
                  : <FiCopy />
                }


                <span>
                  {copiedCode
                    ? "Copied!"
                    : "Copy Code"}
                </span>

              </button>

            </div>

          </div>


          {/* LINK */}

          <div className="referral-share-card">

            <div className="share-card-heading">

              <div className="share-card-icon green">
                <FiShare2 />
              </div>


              <div>

                <span>
                  Your referral link
                </span>

                <strong>
                  Send this link to your friends
                </strong>

              </div>

            </div>


            <div className="referral-link-box">

              <div className="referral-link-text">
                {referralLink}
              </div>


              <div className="referral-link-actions">

                <button
                  type="button"
                  onClick={
                    handleCopyLink
                  }
                >

                  {copiedLink
                    ? <FiCheckCircle />
                    : <FiCopy />
                  }


                  <span>
                    {copiedLink
                      ? "Copied!"
                      : "Copy Link"}
                  </span>

                </button>


                <button
                  type="button"
                  className="share-button"
                  onClick={
                    handleShare
                  }
                >

                  <FiShare2 />

                  <span>
                    Share
                  </span>

                </button>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <section className="referral-progress-card">

          <div className="progress-card-top">

            <div>

              <div className="progress-small-label">
                YOUR PROGRESS
              </div>


              <h2>

                {successfulReferrals}

                {" "}

                <span>
                  / {currentTarget}
                </span>

              </h2>

            </div>


            <div className="progress-users-icon">
              <FiUsers />
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width:
                  `${progressPercentage}%`,
              }}
            />

          </div>


          {successfulReferrals >= 15 ? (

            <div className="progress-message success">

              <FiStar />


              <div>

                <strong>
                  Amazing! 🎉
                </strong>


                <span>
                  You've reached the special
                  15+ referral reward level.
                </span>

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


                <span>
                  to unlock your next reward! 🎁
                </span>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            REWARD UNLOCKED
        ================================================= */}

        {successfulReferrals >= 5 && (

          <section
            className={
              `reward-unlocked-card ${rewardLevel.type}`
            }
          >

            <div className="reward-unlocked-icon">

              {successfulReferrals >= 15
                ? "⭐"
                : "🎉"}

            </div>


            <div className="reward-unlocked-content">

              <div className="reward-unlocked-label">

                {successfulReferrals >= 15
                  ? "SPECIAL REWARD"
                  : "REWARD UNLOCKED"}

              </div>


              <h2>
                {rewardLevel.title}
              </h2>


              <p>
                {rewardLevel.description}
              </p>


              <div className="reward-benefit">

                <FiMessageCircle />


                <span>

                  {successfulReferrals >= 15
                    ? "You've unlocked a special UMUHUZA reward."
                    : successfulReferrals >= 10
                    ? "2 free WhatsApp numbers for people you choose."
                    : "1 free WhatsApp number for one person you choose."}

                </span>

              </div>


              <button
                type="button"
                className="claim-reward-btn"
                onClick={
                  handleOpenClaimReward
                }
                disabled={
                  claimingReward
                }
              >

                <FiGift />


                {claimingReward
                  ? "Claiming..."
                  : "Claim Your Reward"}

              </button>

            </div>

          </section>

        )}


        {/* =================================================
            REWARD LEVELS
        ================================================= */}

        <section className="reward-levels-section">

          <div className="section-heading">

            <div>

              <span>
                KEEP GOING
              </span>


              <h2>
                Referral Rewards
              </h2>

            </div>


            <FiGift />

          </div>


          <div className="reward-levels">


            {/* =================================================
                5 FRIENDS
            ================================================= */}

            <div
              className={
                `reward-level ${
                  successfulReferrals >= 5
                    ? "unlocked"
                    : ""
                }`
              }
            >

              <div className="reward-level-number">

                {successfulReferrals >= 5
                  ? <FiCheckCircle />
                  : "5"}

              </div>


              <div className="reward-level-content">

                <strong>
                  First Reward
                </strong>


                <span>
                  Invite 5 successful members
                </span>

              </div>


              <div className="reward-level-prize">
                📱 1 WhatsApp number
              </div>

            </div>


            {/* =================================================
                10 FRIENDS
            ================================================= */}

            <div
              className={
                `reward-level ${
                  successfulReferrals >= 10
                    ? "unlocked"
                    : ""
                }`
              }
            >

              <div className="reward-level-number">

                {successfulReferrals >= 10
                  ? <FiCheckCircle />
                  : "10"}

              </div>


              <div className="reward-level-content">

                <strong>
                  Double Reward
                </strong>


                <span>
                  Invite 10 successful members
                </span>

              </div>


              <div className="reward-level-prize">
                📱📱 2 WhatsApp numbers
              </div>

            </div>


            {/* =================================================
                15 FRIENDS
            ================================================= */}

            <div
              className={
                `reward-level special ${
                  successfulReferrals >= 15
                    ? "unlocked"
                    : ""
                }`
              }
            >

              <div className="reward-level-number">

                {successfulReferrals >= 15
                  ? <FiCheckCircle />
                  : <FiStar />}

              </div>


              <div className="reward-level-content">

                <strong>
                  Special Reward
                </strong>


                <span>
                  Invite 15 or more successful members
                </span>

              </div>


              <div className="reward-level-prize">
                ⭐ Special UMUHUZA reward
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section className="referral-how-card">

          <div className="how-icon">
            💕
          </div>


          <div>

            <h3>
              How it works
            </h3>


            <p>
              Share your unique referral link or
              code with friends. When they
              successfully join UMUHUZA, your
              referral progress increases.
            </p>

          </div>

        </section>

      </main>


      {/* =================================================
          CLAIM REWARD MODAL
      ================================================= */}

      {showClaimModal && (

        <div
          className="claim-modal-overlay"
          onClick={
            handleCloseClaimReward
          }
        >

          <div
            className="claim-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* CLOSE */}

            <button
              type="button"
              className="claim-modal-close"
              onClick={
                handleCloseClaimReward
              }
              disabled={
                claimingReward
              }
            >

              <FiX />

            </button>


            {/* ICON */}

            <div className="claim-modal-icon">

              {selectedRewardTier?.icon ||
                "🎁"}

            </div>


            {/* LABEL */}

            <div className="claim-modal-label">
              UMUHUZA.COM REWARD
            </div>


            {/* TITLE */}

            <h2>

              {selectedRewardTier
                ? selectedRewardTier.title
                : "Reward"}

            </h2>


            {/* SUCCESS */}

            {claimMessage && (

              <div className="claim-success-message">

                <FiCheckCircle />


                <span>
                  {claimMessage}
                </span>

              </div>

            )}


            {/* ERROR */}

            {claimError && (

              <div className="claim-error-message">

                {claimError}

              </div>

            )}


            {/* REWARD DETAILS */}

            {selectedRewardTier && (

              <>

                <p className="claim-modal-description">

                  {selectedRewardTier.description}

                </p>


                <div className="claim-modal-benefit">

                  <FiMessageCircle />


                  <span>
                    {selectedRewardTier.benefit}
                  </span>

                </div>


                {!claimMessage && (

                  <button
                    type="button"
                    className="claim-confirm-btn"
                    onClick={
                      handleClaimReward
                    }
                    disabled={
                      claimingReward
                    }
                  >

                    <FiGift />


                    {claimingReward
                      ? "Processing Claim..."
                      : "Confirm & Claim Reward"}

                  </button>

                )}

              </>

            )}


            {/* SUCCESS CLOSE */}

            {claimMessage && (

              <button
                type="button"
                className="claim-done-btn"
                onClick={
                  handleCloseClaimReward
                }
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
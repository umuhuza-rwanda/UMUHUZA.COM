// =========================================================
// UMUHUZA REFERRAL REWARDS
// =========================================================

import { supabase } from "../lib/supabase";


// =========================================================
// REWARD LEVELS
// =========================================================

export const REFERRAL_REWARDS = {
  FIVE: 5,
  TEN: 10,
  FIFTEEN: 15,
};


// =========================================================
// GET REWARD INFORMATION
// =========================================================

export const getReferralRewardInfo = (
  referralCount = 0
) => {
  const count =
    Number(referralCount) || 0;


  // =========================
  // 15+ FRIENDS
  // =========================

  if (count >= 15) {
    return {
      level: 15,

      title:
        "Special Reward",

      description:
        "You've invited 15 or more friends.",

      whatsappNumbers:
        2,

      specialReward:
        true,

      unlocked:
        true,
    };
  }


  // =========================
  // 10 FRIENDS
  // =========================

  if (count >= 10) {
    return {
      level: 10,

      title:
        "2 WhatsApp Numbers",

      description:
        "You've unlocked 2 free WhatsApp numbers.",

      whatsappNumbers:
        2,

      specialReward:
        false,

      unlocked:
        true,
    };
  }


  // =========================
  // 5 FRIENDS
  // =========================

  if (count >= 5) {
    return {
      level: 5,

      title:
        "1 WhatsApp Number",

      description:
        "You've unlocked 1 free WhatsApp number.",

      whatsappNumbers:
        1,

      specialReward:
        false,

      unlocked:
        true,
    };
  }


  // =========================
  // NO REWARD
  // =========================

  return {
    level: 0,

    title:
      "Keep inviting",

    description:
      "Invite more friends to unlock rewards.",

    whatsappNumbers:
      0,

    specialReward:
      false,

    unlocked:
      false,
  };
};


// =========================================================
// GET NEXT REWARD
// =========================================================

export const getNextReferralReward = (
  referralCount = 0
) => {
  const count =
    Number(referralCount) || 0;


  if (count < 5) {
    return {
      target: 5,

      remaining:
        5 - count,

      title:
        "1 WhatsApp Number",
    };
  }


  if (count < 10) {
    return {
      target: 10,

      remaining:
        10 - count,

      title:
        "2 WhatsApp Numbers",
    };
  }


  if (count < 15) {
    return {
      target: 15,

      remaining:
        15 - count,

      title:
        "Special Reward",
    };
  }


  return {
    target: 15,

    remaining: 0,

    title:
      "Special Reward Unlocked",
  };
};


// =========================================================
// COMPLETE REFERRAL
//
// Called when a referred member completes
// their profile.
//
// Supabase version.
//
// The actual database transaction is handled
// by the PostgreSQL RPC:
//
// complete_referral
// =========================================================

export const completeReferral = async (
  referredUserUid
) => {
  if (!referredUserUid) {
    return {
      success: false,

      reason:
        "missing-user",
    };
  }


  try {
    // =====================================================
    // CALL SUPABASE RPC
    // =====================================================

    const {
      data,
      error,
    } = await supabase.rpc(
      "complete_referral",
      {
        p_referred_user_id:
          referredUserUid,
      }
    );


    // =====================================================
    // DATABASE ERROR
    // =====================================================

    if (error) {
      console.error(
        "UMUHUZA referral completion error:",
        error
      );


      return {
        success: false,

        reason:
          "supabase-error",

        error,
      };
    }


    // =====================================================
    // NO RESPONSE
    // =====================================================

    if (!data) {
      return {
        success: false,

        reason:
          "empty-response",
      };
    }


    // =====================================================
    // RETURN RPC RESULT
    // =====================================================

    return {
      success:
        data.success !== false,

      alreadyCompleted:
        data.already_completed ?? false,

      referrerUid:
        data.referrer_uid ?? null,

      referralCount:
        Number(
          data.referral_count ?? 0
        ),

      rewardInfo:
        data.reward_level
          ? getReferralRewardInfo(
              data.referral_count
            )
          : null,

      reason:
        data.reason ?? null,
    };
  } catch (error) {
    console.error(
      "UMUHUZA referral completion error:",
      error
    );


    return {
      success: false,

      reason:
        "supabase-error",

      error,
    };
  }
};
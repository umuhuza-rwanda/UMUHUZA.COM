import { supabase } from "../lib/supabase";

// =====================================================
// PROCESS SUCCESSFUL REFERRAL
// =====================================================
//
// IMPORTANT:
//
// This function counts ONE referred member only ONE time.
//
// The actual atomic transaction is handled by the
// PostgreSQL function:
//     process_successful_referral
//
// Supabase RPC calls that database function.
//
// =====================================================

export const processSuccessfulReferral = async (
  referralCode,
  newUserId
) => {
  // =====================================================
  // BASIC VALIDATION
  // =====================================================

  if (!referralCode || !newUserId) {
    console.warn(
      "Referral processing skipped: missing referral code or new user ID."
    );

    return false;
  }

  try {
    // ===================================================
    // CLEAN REFERRAL CODE
    // ===================================================

    const cleanReferralCode = String(referralCode)
      .trim()
      .toUpperCase();

    if (!cleanReferralCode) {
      return false;
    }

    // ===================================================
    // PROCESS REFERRAL ATOMICALLY IN SUPABASE
    // ===================================================
    //
    // This replaces the Firebase runTransaction().
    //
    // The PostgreSQL function:
    //
    // 1. Finds the referrer.
    // 2. Prevents self-referral.
    // 3. Checks whether this referral was already processed.
    // 4. Calculates the new referral count.
    // 5. Creates the referral record.
    // 6. Updates the referrer's counters.
    //
    // All operations happen inside ONE database transaction.
    //
    // ===================================================

    const { data, error } = await supabase.rpc(
      "process_successful_referral",
      {
        p_referral_code: cleanReferralCode,
        p_new_user_id: newUserId,
      }
    );

    // ===================================================
    // HANDLE SUPABASE ERROR
    // ===================================================

    if (error) {
      console.error(
        "UMUHUZA referral processing error:",
        error
      );

      return false;
    }

    // ===================================================
    // NO RESULT
    // ===================================================

    if (!data) {
      console.warn(
        "Referral processing returned no result."
      );

      return false;
    }

    // ===================================================
    // ALREADY PROCESSED
    // ===================================================

    if (data.already_processed === true) {
      console.log(
        "Referral already processed. No additional referral counted.",
        {
          referralCode: cleanReferralCode,
          referrerId: data.referrer_id,
          newUserId,
        }
      );

      return false;
    }

    // ===================================================
    // REFERRER NOT FOUND
    // ===================================================

    if (data.success === false) {
      console.warn(
        "Referral could not be processed:",
        data
      );

      return false;
    }

    // ===================================================
    // SUCCESS
    // =====================================================

    console.log(
      "Successful UMUHUZA referral processed:",
      {
        referralCode: cleanReferralCode,

        referrerId:
          data.referrer_id,

        newUserId:
          data.referred_user_id,

        referralCount:
          data.referral_count,

        rewardLevel:
          data.reward_level,
      }
    );

    return true;
  } catch (error) {
    console.error(
      "UMUHUZA referral processing error:",
      error
    );

    return false;
  }
};
import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();


// =====================================================
// HELPERS
// =====================================================

function getConversationId(userOne, userTwo) {
  return [userOne, userTwo]
    .sort()
    .join("_");
}


function isPremiumActive(userData) {
  if (!userData?.premium) {
    return false;
  }

  // Support:
  // premium_expires_at
  // premium_expiry
  // premium_until

  const expiry =
    userData.premium_expires_at ||
    userData.premium_expiry ||
    userData.premium_until;

  // Premium marked true without expiry
  // is treated as active.
  if (!expiry) {
    return true;
  }

  const expiryDate =
    new Date(expiry);

  if (
    Number.isNaN(
      expiryDate.getTime()
    )
  ) {
    return false;
  }

  return (
    expiryDate.getTime() >
    Date.now()
  );
}


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

async function authenticateUser(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization || "";

    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        allowed: false,

        reason:
          "not_authenticated",

        message:
          "Authentication is required.",
      });
    }

    const accessToken =
      authorization.substring(
        "Bearer ".length
      );


    // =================================================
    // VERIFY SUPABASE ACCESS TOKEN
    // =================================================

    const {
      data,
      error,
    } = await supabase.auth.getUser(
      accessToken
    );


    if (
      error ||
      !data?.user
    ) {
      return res.status(401).json({
        allowed: false,

        reason:
          "not_authenticated",

        message:
          "Your session is invalid or expired.",
      });
    }


    req.user =
      data.user;

    next();

  } catch (error) {

    console.error(
      "Supabase authentication error:",
      error
    );

    return res.status(401).json({
      allowed: false,

      reason:
        "not_authenticated",

      message:
        "Your session is invalid or expired.",
    });
  }
}


// =====================================================
// POST /api/chat/authorize
// =====================================================

router.post(
  "/authorize",
  authenticateUser,
  async (req, res) => {

    try {

      const currentUserId =
        req.user.id;

      const {
        targetUserId,
      } = req.body;


      // =================================================
      // VALIDATION
      // =================================================

      if (
        !targetUserId ||
        typeof targetUserId !== "string"
      ) {
        return res.status(400).json({
          allowed: false,

          reason:
            "invalid_target",

          message:
            "A target user is required.",
        });
      }


      if (
        targetUserId ===
        currentUserId
      ) {
        return res.status(400).json({
          allowed: false,

          reason:
            "cannot_chat_self",

          message:
            "You cannot start a chat with yourself.",
        });
      }


      // =================================================
      // CONVERSATION ID
      // =================================================

      const conversationId =
        getConversationId(
          currentUserId,
          targetUserId
        );


      // =================================================
      // CALL ATOMIC SUPABASE RPC
      // =================================================

      const {
        data,
        error,
      } = await supabase.rpc(
        "authorize_chat",
        {
          p_current_user_id:
            currentUserId,

          p_target_user_id:
            targetUserId,

          p_conversation_id:
            conversationId,
        }
      );


      // =================================================
      // RPC ERROR
      // =================================================

      if (error) {

        console.error(
          "Supabase chat authorization error:",
          error
        );

        return res.status(500).json({
          allowed: false,

          reason:
            "authorization_failed",

          consumed: false,

          existingConversation:
            false,

          message:
            "Unable to verify your chat access. Please try again.",
        });
      }


      // =================================================
      // EMPTY RESPONSE
      // =================================================

      if (!data) {

        return res.status(500).json({
          allowed: false,

          reason:
            "authorization_failed",

          consumed: false,

          existingConversation:
            false,

          message:
            "Unable to verify your chat access. Please try again.",
        });
      }


      // =================================================
      // NORMALIZE RPC RESPONSE
      // =================================================

      const result = {
        allowed:
          data.allowed === true,

        existingConversation:
          data.existing_conversation === true,

        consumed:
          data.consumed === true,

        reason:
          data.reason || null,

        conversationId:
          data.conversation_id ||
          conversationId,

        remainingFreeChats:
          Math.max(
            0,
            Number(
              data.remaining_free_chats ?? 0
            )
          ),

        remainingReferralChats:
          Math.max(
            0,
            Number(
              data.remaining_referral_chats ?? 0
            )
          ),

        premium:
          data.premium === true,

        premiumExpiresAt:
          data.premium_expires_at ||
          null,

        message:
          data.message ||
          null,
      };


      // =================================================
      // NOT ALLOWED
      // =================================================

      if (!result.allowed) {

        return res.status(403).json(
          result
        );
      }


      // =================================================
      // SUCCESS
      // =================================================

      return res.status(200).json(
        result
      );


    } catch (error) {

      console.error(
        "POST /api/chat/authorize error:",
        error
      );

      return res.status(500).json({
        allowed: false,

        reason:
          "authorization_failed",

        consumed: false,

        existingConversation:
          false,

        message:
          "Unable to verify your chat access. Please try again.",
      });
    }
  }
);


export default router;
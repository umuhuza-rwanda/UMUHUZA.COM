// =====================================================
// UMUHUZA NOTIFICATIONS
// =====================================================

import { supabase } from "../lib/supabase";


// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createNotification = async ({
  recipientId,
  senderId,
  senderName,
  type,
  title,
  message,
  link,
}) => {

  if (!recipientId) {
    console.error(
      "Cannot create notification: recipientId missing"
    );

    return;
  }


  try {

    const { error } = await supabase
      .from("notifications")
      .insert({
        recipient_id:
          recipientId,

        sender_id:
          senderId || null,

        sender_name:
          senderName || "UMUHUZA Member",

        type,

        title,

        message,

        link:
          link || null,

        is_read:
          false,

        created_at:
          new Date().toISOString(),
      });


    if (error) {
      throw error;
    }


    console.log(
      "Notification created successfully."
    );


  } catch (error) {

    console.error(
      "Error creating notification:",
      error
    );

  }

};
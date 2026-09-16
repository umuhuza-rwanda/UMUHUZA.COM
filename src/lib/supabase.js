import { createClient } from "@supabase/supabase-js";
import { Preferences } from "@capacitor/preferences";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// =====================================================
// CAPACITOR PERSISTENT STORAGE
// =====================================================
//
// This allows Supabase authentication sessions to
// survive completely closing and reopening the
// UMUHUZA Android app.
//

const capacitorStorage = {
  getItem: async (key) => {
    const { value } = await Preferences.get({
      key,
    });

    return value;
  },

  setItem: async (key, value) => {
    await Preferences.set({
      key,
      value,
    });
  },

  removeItem: async (key) => {
    await Preferences.remove({
      key,
    });
  },
};

// =====================================================
// SUPABASE CLIENT
// =====================================================

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,

      // IMPORTANT:
      // Store Supabase session in Capacitor's
      // persistent native storage.
      storage: capacitorStorage,
    },
  }
);
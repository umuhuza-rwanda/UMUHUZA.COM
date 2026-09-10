import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase"; // ← make sure this path is correct

// =====================================================
// CONTEXT
// =====================================================

const AppPreferencesContext = createContext(null);

// =====================================================
// DEFAULT SETTINGS
// =====================================================

const DEFAULT_LANGUAGE = "en";
const DEFAULT_THEME = "dark";

// =====================================================
// SUPPORTED LANGUAGES
// =====================================================

export const supportedLanguages = [
  { code: "en", name: "English", shortName: "EN" },
  { code: "fr", name: "Français", shortName: "FR" },
  { code: "rw", name: "Kinyarwanda", shortName: "RW" },
  { code: "sw", name: "Kiswahili", shortName: "SW" },
];

// =====================================================
// TRANSLATIONS  (keep your existing translations object)
// =====================================================

export const translations = {
  // ......... paste your full translations object here (en, fr, rw, sw)
  // I left it out only to keep this message shorter
  // Just copy-paste the big translations object from your current file
};

// =====================================================
// PROVIDER
// =====================================================

export function AppPreferencesProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [currentUser, setCurrentUser] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);

  // =====================================================
  // AUTH LISTENER (Supabase)
  // =====================================================
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setCurrentUser(session?.user ?? null);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const user = session?.user ?? null;
        setCurrentUser(user);

        if (!user) {
          // Not logged in → use general localStorage
          const savedLanguage = localStorage.getItem("kundwa_language");
          const savedTheme = localStorage.getItem("kundwa_theme");

          setLanguageState(savedLanguage || DEFAULT_LANGUAGE);
          setThemeState(savedTheme || DEFAULT_THEME);
          setPreferencesLoading(false);
          return;
        }

        // Logged in → try user-specific preferences
        const localKey = `kundwa_preferences_${user.id}`;
        const savedLocal = localStorage.getItem(localKey);

        if (savedLocal) {
          try {
            const parsed = JSON.parse(savedLocal);
            if (parsed.language) setLanguageState(parsed.language);
            if (parsed.theme) setThemeState(parsed.theme);
          } catch (err) {
            console.error("Error reading local preferences:", err);
          }
        }

        // Also try to load from profiles table (optional)
        try {
          const { data } = await supabase
            .from("profiles")
            .select("preferences")
            .eq("id", user.id)
            .maybeSingle();

          if (data?.preferences) {
            if (data.preferences.language && !savedLocal) {
              setLanguageState(data.preferences.language);
            }
            if (data.preferences.theme && !savedLocal) {
              setThemeState(data.preferences.theme);
            }
          }
        } catch (err) {
          console.error("Unable to load preferences from Supabase:", err);
        }

        setPreferencesLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // APPLY THEME
  // =====================================================
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    let resolved = theme;
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(resolved);
    root.setAttribute("data-kundwa-theme", resolved);

    try {
      localStorage.setItem("kundwa_theme", theme);
    } catch {}
  }, [theme]);

  // =====================================================
  // SYSTEM THEME LISTENER
  // =====================================================
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemTheme = (event) => {
      const resolved = event.matches ? "dark" : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolved);
      document.documentElement.setAttribute("data-kundwa-theme", resolved);
    };

    mediaQuery.addEventListener("change", handleSystemTheme);
    return () => mediaQuery.removeEventListener("change", handleSystemTheme);
  }, [theme]);

  // =====================================================
  // SAVE PREFERENCES
  // =====================================================
  const savePreferences = async ({
    newLanguage = language,
    newTheme = theme,
  } = {}) => {
    try {
      setLanguageState(newLanguage);
      setThemeState(newTheme);

      const preferences = {
        language: newLanguage,
        theme: newTheme,
      };

      if (currentUser) {
        const localKey = `kundwa_preferences_${currentUser.id}`;
        localStorage.setItem(localKey, JSON.stringify(preferences));

        // Optional: also save to profiles table
        await supabase
          .from("profiles")
          .update({
            preferences,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", currentUser.id);
      } else {
        localStorage.setItem("kundwa_language", newLanguage);
        localStorage.setItem("kundwa_theme", newTheme);
      }

      return { success: true };
    } catch (error) {
      console.error("Unable to save preferences:", error);
      return { success: false, error };
    }
  };

  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================
  const changeLanguage = async (newLanguage) => {
    if (!translations[newLanguage]) {
      console.error("Unsupported language:", newLanguage);
      return false;
    }

    const result = await savePreferences({
      newLanguage,
      newTheme: theme,
    });

    return result.success;
  };

  // =====================================================
  // CHANGE THEME
  // =====================================================
  const changeTheme = async (newTheme) => {
    const validThemes = ["light", "dark", "system"];
    if (!validThemes.includes(newTheme)) {
      console.error("Unsupported theme:", newTheme);
      return false;
    }

    const result = await savePreferences({
      newLanguage: language,
      newTheme,
    });

    return result.success;
  };

  // =====================================================
  // TRANSLATION FUNCTION
  // =====================================================
const t = (key) => {
  if (!translations || !translations[language]) {
    return key; // fallback so the page doesn't crash
  }
  return translations[language][key] || translations.en?.[key] || key;
};

  // =====================================================
  // CONTEXT VALUE
  // =====================================================
  const value = {
    language,
    theme,
    currentUser,
    preferencesLoading,
    supportedLanguages,
    translations,
    changeLanguage,
    changeTheme,
    savePreferences,
    t,
  };

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error(
      "useAppPreferences must be used inside AppPreferencesProvider"
    );
  }

  return context;
}

export default AppPreferencesContext;
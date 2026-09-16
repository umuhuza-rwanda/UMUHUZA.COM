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
  en: {
    // Common
    "common.backToProfile": "Back to Profile",
    "common.meaningfulConnections": "Meaningful connections. Genuine people.",
    "common.save": "Save",
    "common.saving": "Saving...",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",

    // Navbar / Member Home
    "nav.messages": "Messages",
    "nav.connections": "Connections",
    "nav.notifications": "Notifications",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "My Profile",
    "nav.inviteFriends": "Invite Friends",
    "nav.accountSettings": "Account Settings",
    "nav.aboutUs": "About Us",

    // Member Home
    "home.welcome": "WELCOME TO UMUHUZA",
    "home.discoverTitle": "Discover Someone",
    "home.discoverSubtitle": "special today",
    "home.discoverDescription": "Meet genuine people looking for meaningful relationships, friendship and love.",
    "home.searchPlaceholder": "Search members...",
    "home.discoverPeople": "Discover People",
    "home.meaningfulConnection": "Find people who could be a meaningful connection.",
    "home.near": "Near",
    "home.viewProfile": "View Profile",
    "home.like": "Like",
    "home.liked": "Liked",
    "home.sendInterest": "Send Interest",
    "home.interestSent": "Interest Sent",
    "home.connected": "Connected",
    "home.startChat": "Start Chat",
    "home.noMembers": "No matching members yet",
    "home.tryAnother": "We're still growing the UMUHUZA community. Try another category.",

    // Categories
    "category.recommended": "Recommended",
    "category.online": "Online",
    "category.diaspora": "Diaspora",
    "category.new": "New",
    "category.verified": "Verified",
    "category.nearby": "Nearby",

    // Premium
    "premium.title": "UMUHUZA Premium",
    "premium.subtitle": "Unlock more conversations with real people",
    "premium.currentStatus": "Your Current Status",
    "premium.freeChats": "Free chats remaining",
    "premium.extraCredits": "Extra chat credits",
    "premium.status": "Premium status",
    "premium.active": "Active",
    "premium.notActive": "Not Active",
    "premium.chatPack": "Chat Pack",
    "premium.monthly": "Monthly Unlimited",
    "premium.referral": "Referral Rewards",
    "premium.buyPack": "Buy Chat Pack",
    "premium.upgrade": "Upgrade to Premium",
    "premium.goToReferral": "Go to Referral Program",

    // App Preferences
    "appPreferences.eyebrow": "APP PREFERENCES",
    "appPreferences.title": "App Preferences",
    "appPreferences.description": "Customize your UMUHUZA experience to make the app feel right for you.",
    "appPreferences.language.title": "Language",
    "appPreferences.language.description": "Choose the language you prefer to use on UMUHUZA.",
    "appPreferences.language.label": "App Language",
    "appPreferences.appearance.title": "Appearance",
    "appPreferences.appearance.description": "Choose how UMUHUZA looks on your device.",
    "appPreferences.appearance.light": "Light",
    "appPreferences.appearance.dark": "Dark",
    "appPreferences.appearance.system": "System",
    "appPreferences.sound.title": "Sound",
    "appPreferences.media.title": "Media",
    "appPreferences.save": "Save Preferences",
    "appPreferences.saving": "Saving Preferences...",
  },

  // ==============================
  // KINYARWANDA
  // ==============================
  rw: {
    "common.backToProfile": "Subira ku Profile",
    "common.meaningfulConnections": "Ubushake bw'ukuri. Abantu b'ukuri.",
    "common.save": "Bika",
    "common.saving": "Birimo kubikwa...",
    "common.loading": "Birimo gupakira...",

    "nav.messages": "Ubutumwa",
    "nav.connections": "Abo mwahuje",
    "nav.notifications": "Amakuru",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "Profile Yanjye",
    "nav.inviteFriends": "Tumira Inshuti",
    "nav.accountSettings": "Igenamiterere",
    "nav.aboutUs": "Abo turi bo",

    "home.welcome": "MURAKAZA NEZA KURI UMUHUZA",
    "home.discoverTitle": "Shaka Umuntu",
    "home.discoverSubtitle": "wihariye uyu munsi",
    "home.discoverDescription": "Hura n'abantu b'ukuri bashaka ubukundanyi, ubucuti n'urukundo.",
    "home.searchPlaceholder": "Shaka umukunzi...",
    "home.discoverPeople": "Shakisha Abantu",
    "home.meaningfulConnection": "Shaka abantu bashobora kuba abo mwahuje.",
    "home.near": "Hafi ya",
    "home.viewProfile": "Reba Profile",
    "home.like": "Kunda",
    "home.liked": "Wakunze",
    "home.sendInterest": "Ohereza Ubushake",
    "home.interestSent": "Ubushake Bwoherejwe",
    "home.connected": "Mwahuje",
    "home.startChat": "Tangira Ikiganiro",
    "home.noMembers": "Nta muntu uhuye n'ibyo ushaka",
    "home.tryAnother": "Turacyakura umuryango wa UMUHUZA. Gerageza indi kategori.",

    "category.recommended": "Byasabwe",
    "category.online": "Kuri interineti",
    "category.diaspora": "Diaspora",
    "category.new": "Bashya",
    "category.verified": "Byemejwe",
    "category.nearby": "Hafi",

    "premium.title": "UMUHUZA Premium",
    "premium.subtitle": "Fungura ibiganiro byinshi n'abantu b'ukuri",
    "premium.currentStatus": "Imiterere yawe",
    "premium.freeChats": "Ibiganiro by'ubuntu bisigaye",
    "premium.extraCredits": "Ama credit y'ibiganiro",
    "premium.status": "Imiterere ya Premium",
    "premium.active": "Ikora",
    "premium.notActive": "Ntabwo ikora",
    "premium.chatPack": "Paki y'Ibiganiro",
    "premium.monthly": "Ukwezi Kwose",
    "premium.referral": "Ibihembo byo Gutumira",
    "premium.buyPack": "Gura Paki",
    "premium.upgrade": "Kwegera Premium",
    "premium.goToReferral": "Jya ku Gahunda yo Gutumira",

    "appPreferences.eyebrow": "IGENAMITERERE",
    "appPreferences.title": "Igenamiterere ry'Porogaramu",
    "appPreferences.description": "Hindura UMUHUZA kugira ngo ihure n'ibyo ukunda.",
    "appPreferences.language.title": "Ururimi",
    "appPreferences.language.description": "Hitamo ururimi ushaka gukoresha kuri UMUHUZA.",
    "appPreferences.language.label": "Ururimi rwa Porogaramu",
    "appPreferences.appearance.title": "Imigaragarire",
    "appPreferences.appearance.description": "Hitamo uko UMUHUZA igaragara ku mudasobwa wawe.",
    "appPreferences.appearance.light": "Urumuri",
    "appPreferences.appearance.dark": "Umwijima",
    "appPreferences.appearance.system": "Sisitemu",
    "appPreferences.save": "Bika Igenamiterere",
    "appPreferences.saving": "Birimo kubikwa...",
  },

  // ==============================
  // FRENCH
  // ==============================
  fr: {
    "common.backToProfile": "Retour au profil",
    "common.meaningfulConnections": "Des connexions authentiques. Des personnes sincères.",
    "nav.messages": "Messages",
    "nav.connections": "Connexions",
    "nav.notifications": "Notifications",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "home.welcome": "BIENVENUE SUR UMUHUZA",
    "home.discoverTitle": "Découvrez quelqu'un",
    "home.discoverSubtitle": "de spécial aujourd'hui",
    "home.discoverDescription": "Rencontrez des personnes sincères à la recherche de relations significatives, d'amitié et d'amour.",
    "home.searchPlaceholder": "Rechercher des membres...",
    "home.discoverPeople": "Découvrir des personnes",
    "home.viewProfile": "Voir le profil",
    "home.like": "J'aime",
    "home.sendInterest": "Envoyer un intérêt",
    "home.startChat": "Démarrer le chat",
    "premium.title": "UMUHUZA Premium",
    "premium.subtitle": "Débloquez plus de conversations",
    "appPreferences.title": "Préférences de l'application",
    "appPreferences.language.title": "Langue",
    "appPreferences.appearance.title": "Apparence",
  },

  // ==============================
  // SWAHILI
  // ==============================
  sw: {
    "common.backToProfile": "Rudi kwenye Wasifu",
    "common.meaningfulConnections": "Mahusiano ya kweli. Watu wa kweli.",
    "nav.messages": "Ujumbe",
    "nav.connections": "Miunganisho",
    "nav.notifications": "Arifa",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "home.welcome": "KARIBU UMUHUZA",
    "home.discoverTitle": "Gundua Mtu",
    "home.discoverSubtitle": "maalum leo",
    "home.discoverDescription": "Kutana na watu wa kweli wanaotafuta mahusiano yenye maana, urafiki na upendo.",
    "home.searchPlaceholder": "Tafuta wanachama...",
    "home.discoverPeople": "Gundua Watu",
    "home.viewProfile": "Angalia Wasifu",
    "home.like": "Penda",
    "home.sendInterest": "Tuma Nia",
    "home.startChat": "Anza Gumzo",
    "premium.title": "UMUHUZA Premium",
    "appPreferences.title": "Mapendeleo ya Programu",
    "appPreferences.language.title": "Lugha",
    // English
"chat.pleaseLogin": "Please log in",
"chat.loginToChat": "Login to chat with your UMUHUZA Messages.",
"chat.goToLogin": "Go to Login",
"chat.loadingChats": "Loading Chats",
"chat.pleaseWait": "Please wait...",
"chat.noMembers": "No members available",
"chat.noMembersDesc": "There are currently no other UMUHUZA members.",
"chat.peopleYouCanMessage": "People you can message",
"chat.searchConversations": "Search conversations...",
"chat.noConversationsFound": "No conversations found",
"chat.onlineNow": "Online now",
"chat.startConversation": "Start your conversation with",
"chat.selectPerson": "Select a person to start chatting.",
"chat.messagePlaceholder": "Message",
"chat.sendingImages": "Sending images...",
"chat.image": "image",
"chat.images": "images",
"chat.loadingMessages": "Loading messages...",
"common.back": "Back",

// Kinyarwanda
"chat.pleaseLogin": "Nyura mu konti",
"chat.loginToChat": "Nyura mu konti kugira ngo uvugane n'abandi.",
"chat.goToLogin": "Jya ku Kwinjira",
"chat.loadingChats": "Birimo gupakira ibiganiro",
"chat.pleaseWait": "Tegereza gato...",
"chat.noMembers": "Nta muntu uhari",
"chat.noMembersDesc": "Nta bandi bagize UMUHUZA bahari ubu.",
"chat.peopleYouCanMessage": "Abantu ushobora kuvugana na bo",
"chat.searchConversations": "Shakisha ibiganiro...",
"chat.noConversationsFound": "Nta biganiro byabonetse",
"chat.onlineNow": "Ari kuri interineti",
"chat.startConversation": "Tangira ikiganiro na",
"chat.selectPerson": "Hitamo umuntu utangire ikiganiro.",
"chat.messagePlaceholder": "Andika ubutumwa",
"chat.sendingImages": "Birimo kohereza amashusho...",
"chat.image": "ishusho",
"chat.images": "amashusho",
"chat.loadingMessages": "Birimo gupakira ubutumwa...",
"common.back": "Subira",
// french
"chat.pleaseLogin": "Veuillez vous connecter",
"chat.loginToChat": "Connectez-vous pour discuter avec vos messages UMUHUZA.",
"chat.goToLogin": "Aller à la connexion",
"chat.loadingChats": "Chargement des discussions",
"chat.pleaseWait": "Veuillez patienter...",
"chat.noMembers": "Aucun membre disponible",
"chat.noMembersDesc": "Il n'y a actuellement aucun autre membre UMUHUZA.",
"chat.peopleYouCanMessage": "Personnes avec qui vous pouvez discuter",
"chat.searchConversations": "Rechercher des conversations...",
"chat.noConversationsFound": "Aucune conversation trouvée",
"chat.onlineNow": "En ligne",
"chat.startConversation": "Commencez votre conversation avec",
"chat.selectPerson": "Sélectionnez une personne pour commencer à discuter.",
"chat.messagePlaceholder": "Message",
"chat.sendingImages": "Envoi des images...",
"chat.image": "image",
"chat.images": "images",
"chat.loadingMessages": "Chargement des messages...",
"common.back": "Retour",
// swahili
"chat.pleaseLogin": "Tafadhali ingia",
"chat.loginToChat": "Ingia ili kuzungumza na ujumbe wako wa UMUHUZA.",
"chat.goToLogin": "Nenda kwenye Kuingia",
"chat.loadingChats": "Inapakia gumzo",
"chat.pleaseWait": "Tafadhali subiri...",
"chat.noMembers": "Hakuna wanachama waliopo",
"chat.noMembersDesc": "Kwa sasa hakuna wanachama wengine wa UMUHUZA.",
"chat.peopleYouCanMessage": "Watu unaoweza kuwasiliana nao",
"chat.searchConversations": "Tafuta mazungumzo...",
"chat.noConversationsFound": "Hakuna mazungumzo yaliyopatikana",
"chat.onlineNow": "Yuko mtandaoni",
"chat.startConversation": "Anza mazungumzo yako na",
"chat.selectPerson": "Chagua mtu ili kuanza kuzungumza.",
"chat.messagePlaceholder": "Ujumbe",
"chat.sendingImages": "Inatuma picha...",
"chat.image": "picha",
"chat.images": "picha",
"chat.loadingMessages": "Inapakia ujumbe...",
"common.back": "Rudi",
  },
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
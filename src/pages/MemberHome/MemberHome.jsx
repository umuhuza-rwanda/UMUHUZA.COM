import "./MemberHome.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiHome,
  FiUsers,
  FiExternalLink,
  FiMessageCircle,
  FiBell,
  FiUser,
  FiSearch,
  FiDollarSign,
  FiGlobe,
  FiMail,
  FiCheckCircle,
  FiX,
  FiShare2,
  FiGift,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiSettings,
  FiHeart,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";
import { useAppPreferences } from "../../context/AppPreferencesContext";



function MemberHome() {
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
    supportedLanguages,
    t,
    theme,
    changeTheme,
  } = useAppPreferences();

  // =====================================================
  // STATE
  // =====================================================

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  const [currentUserProfile, setCurrentUserProfile] =
    useState(null);

  const [allMembers, setAllMembers] = useState([]);

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] =
    useState("recommended");

  const [likedMembers, setLikedMembers] =
    useState([]);
 
  const [interestedMembers, setInterestedMembers] =
    useState([]);

  const [interests, setInterests] =
    useState([]);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [showCommunityLinks, setShowCommunityLinks] =
    useState(false);
    const whatsappGroupLink =
  "https://chat.whatsapp.com/IAOf4F19GvS9eNhFLByjcz";

const handleWhatsApp = () => {
  window.open(
    whatsappGroupLink,
    "_blank",
    "noopener,noreferrer"
  );
};

  const [showLanguageMenu, setShowLanguageMenu] =
    useState(false);

  const [languageChanging, setLanguageChanging] =
    useState(false);

  const [interestLoading, setInterestLoading] =
    useState(null);

  const [showVerificationBox, setShowVerificationBox] =
    useState(false);

  const [verificationSending, setVerificationSending] =
    useState(false);

  const [verificationMessage, setVerificationMessage] =
    useState("");

  const [notifications, setNotifications] =
    useState([]);


    // =====================================================
// COMMUNITY LINKS
// =====================================================



 

  // =====================================================
  // UNREAD CHAT MESSAGES
  // =====================================================

  const [unreadMessageCount, setUnreadMessageCount] =
    useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const [showThemeMenu, setShowThemeMenu] =
    useState(false);

  // =====================================================
  // REFERRAL
  // =====================================================

  const [referralCode, setReferralCode] =
    useState("");

  const [referralCopied, setReferralCopied] =
    useState(false);

  const [referralLinkCopied, setReferralLinkCopied] =
    useState(false);

  const [showReferralPanel, setShowReferralPanel] =
    useState(false);

  // =====================================================
  // AUTH
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setCurrentUser(session?.user ?? null);
        setAuthLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setCurrentUser(session?.user ?? null);
          setAuthLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

useEffect(() => {
  if (!currentUser?.id) {
    setNotifications([]);
    return;
  }

  let active = true;

  const load = async () => {
    try {
      console.log("🔔 Loading notifications for:", currentUser.id);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", {
          ascending: false,
        });

      if (!active) return;

      if (error) {
        console.error("❌ Notifications load error:", error);
        setNotifications([]);
        return;
      }

      console.log("🔔 Notifications received:", data);

      setNotifications(data || []);
    } catch (err) {
      console.error("❌ Notifications exception:", err);

      if (active) {
        setNotifications([]);
      }
    }
  };

  load();

const channel = supabase
  .channel(`notifications-${currentUser.id}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${currentUser.id}`,
    },
    () => {
      load();
    }
  )
  .subscribe((status) => {
    console.log(
      "🔔 Notification realtime status:",
      status
    );
  });

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}, [currentUser?.id]);


  // =====================================================
  // UNREAD CHAT MESSAGE COUNT
  // =====================================================
// =====================================================
// UNREAD CHAT MESSAGE COUNT
// =====================================================

useEffect(() => {
  if (!currentUser?.id) {
    setUnreadMessageCount(0);
    return;
  }

  let active = true;

  const loadUnreadMessageCount = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("id", {
          count: "exact",
          head: true,
        })
        .neq("sender_id", currentUser.id)
        .eq("is_read", false);

      if (!active) return;

      if (error) {
        console.error(
          "Unread messages count error:",
          error
        );

        setUnreadMessageCount(0);
        return;
      }

      setUnreadMessageCount(count || 0);
    } catch (err) {
      console.error(
        "Unable to load unread message count:",
        err
      );

      if (active) {
        setUnreadMessageCount(0);
      }
    }
  };

  // Load immediately
  loadUnreadMessageCount();

  // Listen for new messages / messages being marked read
  const channel = supabase
    .channel(`member-home-unread-messages-${currentUser.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      () => {
        loadUnreadMessageCount();
      }
    )
    .subscribe((status) => {
      console.log(
        "💬 MemberHome message badge listener:",
        status
      );
    });

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}, [currentUser?.id]);

const unreadNotifications =
  notifications.filter(
    (notification) =>
      notification.is_read === false
  );

const unreadNotificationCount =
  unreadNotifications.length;

    const pendingInterestsCount = interests.filter(
  (interest) => interest.status === "pending"
).length;



  // =====================================================
  // CURRENT USER PROFILE
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      setCurrentUserProfile(null);
      setProfileLoading(false);
      return;
    }

    let active = true;

    setProfileLoading(true);

    const load = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error(error);

        setError(
          "Unable to load your profile."
        );

        setProfileLoading(false);
        return;
      }

      setCurrentUserProfile(
        data
          ? {
              id: currentUser.id,
              ...data,
            }
          : null
      );

      setProfileLoading(false);
    };

    load();

    const channel = supabase
      .channel(
        `profile-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${currentUser.id}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // =====================================================
  // REFERRAL
  // =====================================================

  useEffect(() => {
    if (
      !currentUser ||
      !currentUserProfile
    ) {
      return;
    }

    if (
      currentUserProfile.referralCode
    ) {
      setReferralCode(
        currentUserProfile.referralCode
      );

      return;
    }

    const create = async () => {
      const code =
        `KUNDWA-${currentUser.id
          .slice(0, 6)
          .toUpperCase()}`;

      await supabase
        .from("profiles")
        .update({
          referralCode: code,
        })
        .eq(
          "id",
          currentUser.id
        );

      setReferralCode(code);
    };

    create();
  }, [
    currentUser,
    currentUserProfile,
  ]);

  // =====================================================
  // MEMBER AGE
  // =====================================================

  const calculateMemberAge = (
    dateOfBirth
  ) => {
    if (!dateOfBirth) {
      return null;
    }

    try {
      const today = new Date();

      const birthDate =
        new Date(
          `${dateOfBirth}T00:00:00`
        );

      if (
        Number.isNaN(
          birthDate.getTime()
        )
      ) {
        return null;
      }

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (
          monthDifference === 0 &&
          today.getDate() <
            birthDate.getDate()
        )
      ) {
        age--;
      }

      return age >= 0
        ? age
        : null;
    } catch {
      return null;
    }
  };

  // =====================================================
  // NORMALIZE MEMBER PROFILE
  // =====================================================
  //
  // IMPORTANT:
  // This keeps the existing member-card design.
  //
  // Supabase profile columns are converted into the
  // names already expected by the MemberHome UI.
  //
  // Main profile fields:
  //
  // full_name
  // username
  // date_of_birth
  // profile_photo_url
  //
  // =====================================================

  const normalizeMemberProfile = (member) => {
  const firstName =
    member.firstName ??
    member.first_name ??
    member.firstname ??
    "";

  const lastName =
    member.lastName ??
    member.last_name ??
    member.lastname ??
    "";

  const dateOfBirth =
    member.dateOfBirth ??
    member.date_of_birth ??
    member.birthDate ??
    member.birth_date ??
    "";

  const calculatedAge =
    member.age ??
    calculateMemberAge(dateOfBirth);

  const profilePhotoUrl =
    member.profile_photo_url ??
    member.profilePhoto ??
    member.profile_photo ??
    member.photoURL ??
    member.photo_url ??
    member.avatar ??
    member.image ??
    "";

  const lookingForGender =
    member.lookingForGender ??
    member.looking_for_gender ??
    member.lookingFor ??
    member.looking_for ??
    "";

  const livingCountry =
    member.livingCountry ??
    member.living_country ??
    member.currentCountry ??
    member.current_country ??
    member.country ??
    "";

  const city =
    member.city ??
    member.location ??
    "";

      // ==============================
  // MEMBER NAME
  // ==============================

  const fullName =
    member.full_name ??
    member.username ??
    [firstName, lastName]
      .filter(Boolean)
      .join(" ");

  const verified =
    member.verified ??
    member.isVerified ??
    member.is_verified ??
    member.emailVerified ??
    member.email_verified ??
    false;

  const online =
    member.online ??
    false;

  const createdAt =
    member.createdAt ??
    member.created_at ??
    null;

  return {
    ...member,

    // ID
    id: member.id,

    // Names
    full_name: fullName,

    username:
      member.username ?? "",

    firstName,

    lastName,

    name:
      fullName ||
      "UMUHUZA Member",

    // Personal information
    dateOfBirth,

    age:
      calculatedAge,

    gender:
      member.gender ??
      "",

    // Profile photo
    profile_photo_url:
      profilePhotoUrl,

    profilePhoto:
      profilePhotoUrl,

    // Location
    city,

    country:
      member.country ??
      "",

    livingCountry,

    // Preferences
    lookingForGender,

    // Status
    verified,

    online,

    // Dates
    createdAt,
  };
};
  // =====================================================
  // LOAD MEMBERS
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      setAllMembers([]);
      setLoading(false);
      return;
    }

    let active = true;

    setLoading(true);
    setError("");

    const load = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*");

      if (!active) return;

      if (error) {
        console.error(
          "Supabase members error:",
          error
        );

        setError(
          "Unable to load members."
        );

        setAllMembers([]);
        setLoading(false);

        return;
      }

      const normalizedMembers =
        (data || [])
          .map(
            normalizeMemberProfile
          )
          .filter(
            (member) =>
              member.id !==
              currentUser.id
          );

      console.log(
        "UMUHUZA members loaded:",
        normalizedMembers
      );

      setAllMembers(
        normalizedMembers
      );

      setLoading(false);
    };

    load();

    const channel =
      supabase
        .channel("all-members")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
          },
          () => {
            load();
          }
        )
        .subscribe();

    return () => {
      active = false;

      supabase.removeChannel(
        channel
      );
    };
  }, [currentUser]);

// =====================================================
// LOAD MY LIKES FROM SUPABASE
// =====================================================

useEffect(() => {
  if (!currentUser?.id) {
    setLikedMembers([]);
    return;
  }

  let active = true;

  const loadMyLikes = async () => {
    try {
      console.log(
        "❤️ Loading saved likes for:",
        currentUser.id
      );

      const {
        data,
        error,
      } = await supabase
        .from("likes")
        .select("likedId")
        .eq(
          "likerId",
          currentUser.id
        );

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "❌ Error loading saved likes:",
          error
        );

        // Do NOT silently pretend there are no likes.
        setError(
          error.message ||
          "Unable to load your saved likes."
        );

        setLikedMembers([]);

        return;
      }

      const savedLikedIds =
        (data || [])
          .map(
            (like) =>
              like.likedId
          )
          .filter(Boolean);

      console.log(
        "❤️ Saved likes loaded:",
        savedLikedIds
      );

      setLikedMembers(
        savedLikedIds
      );

    } catch (loadError) {

      console.error(
        "❌ Unexpected likes loading error:",
        loadError
      );

      if (active) {
        setLikedMembers([]);

        setError(
          loadError?.message ||
          "Unable to load your saved likes."
        );
      }
    }
  };

  // Load immediately when the user logs in
  loadMyLikes();


  // ===================================================
  // REALTIME LIKES
  // ===================================================

  const channel =
    supabase
      .channel(
        `my-likes-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter:
            `likerId=eq.${currentUser.id}`,
        },
        () => {
          loadMyLikes();
        }
      )
      .subscribe();


  return () => {
    active = false;

    supabase.removeChannel(
      channel
    );
  };

}, [currentUser?.id]);
  // =====================================================
  // INTERESTS
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      setInterests([]);
      setInterestedMembers([]);
      return;
    }

    let active = true;

    const load = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("interests")
        .select("*")
        .eq(
          "senderId",
          currentUser.id
        );

      if (!active) return;

      if (error) {
        console.error(
          "Interests error:",
          error
        );

        return;
      }

      const records =
        data || [];

      setInterests(
        records
      );

      setInterestedMembers(
        records
          .map(
            (interest) =>
              interest.receiverId
          )
          .filter(Boolean)
      );
    };

    load();

    const channel =
      supabase
        .channel(
          `interests-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "interests",
            filter: `senderId=eq.${currentUser.id}`,
          },
          () => load()
        )
        .subscribe();

    return () => {
      active = false;

      supabase.removeChannel(
        channel
      );
    };
  }, [currentUser]);

  // =====================================================
  // HELPERS
  // =====================================================

  const normalize = (
    value
  ) =>
    value == null
      ? ""
      : String(value)
          .trim()
          .toLowerCase();

  const isRwanda = (
    value
  ) =>
    [
      "rwanda",
      "rw",
      "republic of rwanda",
    ].includes(
      normalize(value)
    );

  const isBurundi = (
    value
  ) =>
    [
      "burundi",
      "bi",
      "republic of burundi",
    ].includes(
      normalize(value)
    );

  const isRwandaOrBurundi = (
    value
  ) =>
    isRwanda(value) ||
    isBurundi(value);

  const isDiasporaMember = (
    member
  ) => {
    if (!member) {
      return false;
    }

    const living =
      member.country ||
      member.currentCountry ||
      member.residenceCountry ||
      "";

    const nationality =
      member.nationality ||
      member.countryOfOrigin ||
      member.originCountry ||
      member.homeCountry ||
      "";

    if (
      isRwandaOrBurundi(
        nationality
      ) &&
      living &&
      !isRwandaOrBurundi(
        living
      )
    ) {
      return true;
    }

    if (
      !nationality &&
      living &&
      !isRwandaOrBurundi(
        living
      )
    ) {
      return true;
    }

    return false;
  };

  const getInterestForMember = (
    id
  ) =>
    interests.find(
      (interest) =>
        interest.receiverId ===
        id
    ) || null;

  const matchesGenderPreference = (
    member
  ) => {
    if (!currentUserProfile) {
      return true;
    }

    const pref =
      normalize(
        currentUserProfile.lookingForGender
      );

    const gender =
      normalize(
        member?.gender
      );

    if (
      !pref ||
      [
        "both",
        "all",
        "men-and-women",
        "men and women",
        "male and female",
      ].includes(pref)
    ) {
      return true;
    }

    if (
      [
        "male",
        "men",
        "man",
      ].includes(pref)
    ) {
      return (
        gender === "male" ||
        gender === "men"
      );
    }

    if (
      [
        "female",
        "women",
        "woman",
      ].includes(pref)
    ) {
      return (
        gender === "female" ||
        gender === "women"
      );
    }

    return true;
  };

  const getLocationScore = (
    member
  ) => {
    if (!currentUserProfile) {
      return 0;
    }

    let score = 0;

    if (
      normalize(
        currentUserProfile.country
      ) ===
      normalize(
        member?.country
      )
    ) {
      score += 30;
    }

    if (
      normalize(
        currentUserProfile.city
      ) ===
      normalize(
        member?.city
      )
    ) {
      score += 50;
    }

    return score;
  };

  const getRecommendationScore = (
    member
  ) => {
    let score =
      getLocationScore(
        member
      );

    if (
      member?.verified
    ) {
      score += 10;
    }

    if (
      member?.online
    ) {
      score += 5;
    }

    if (
      member?.newMember
    ) {
      score += 5;
    }

    return score;
  };

  // =====================================================
// CHECK IF USER CAN START CHAT WITH A NEW PERSON
// =====================================================
const getOrCreateConversation = async (person) => {
  if (!currentUser || !person?.id) return null;

  try {
    // 1. Check if conversation already exists (A → B)
    const { data: existing1 } = await supabase
      .from("conversations")
      .select("*")
      .eq("participant_one", currentUser.id)
      .eq("participant_two", person.id)
      .maybeSingle();

    if (existing1) return existing1;

    // 2. Check if conversation already exists (B → A)
    const { data: existing2 } = await supabase
      .from("conversations")
      .select("*")
      .eq("participant_one", person.id)
      .eq("participant_two", currentUser.id)
      .maybeSingle();

    if (existing2) return existing2;

    // 3. No conversation exists → CREATE a new one
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert({
        participant_one: currentUser.id,
        participant_two: person.id,
        chat_started_by: currentUser.id, // important
      })
      .select()
      .single();

    if (createError) throw createError;

    // =====================================================
    // 4. INCREASE chat_limit_used (only for new conversation)
    // =====================================================
    await increaseChatLimitUsed();

    return newConversation;
  } catch (err) {
    console.error("Conversation error:", err);
    setError("Unable to open this chat.");
    return null;
  }
};

  // =====================================================
  // SMART MEMBERS
  // =====================================================

  const smartMembers =
    useMemo(() => {
      if (!currentUserProfile) {
        return [];
      }

      return allMembers
        .filter(
          matchesGenderPreference
        )
        .map(
          (member) => ({
            ...member,
            recommendationScore:
              getRecommendationScore(
                member
              ),
          })
        )
        .sort(
          (a, b) =>
            b.recommendationScore -
            a.recommendationScore
        );
    }, [
      allMembers,
      currentUserProfile,
    ]);

  // =====================================================
  // FILTERED MEMBERS
  // =====================================================

  const filteredMembers =
    useMemo(() => {
      let result = [
        ...smartMembers,
      ];

      if (
        activeCategory ===
        "online"
      ) {
        result =
          result.filter(
            (member) =>
              member.online
          );
      }

      if (
        activeCategory ===
        "new"
      ) {
        result =
          result.filter(
            (member) =>
              member.newMember
          );
      }

      if (
        activeCategory ===
        "verified"
      ) {
        result =
          result.filter(
            (member) =>
              member.verified
          );
      }

      if (
        activeCategory ===
        "diaspora"
      ) {
        result =
          result.filter(
            isDiasporaMember
          );
      }

      if (
        activeCategory ===
        "nearby" &&
        currentUserProfile
      ) {
        result =
          result
            .filter(
              (member) =>
                normalize(
                  member.country
                ) ===
                  normalize(
                    currentUserProfile.country
                  ) ||
                normalize(
                  member.city
                ) ===
                  normalize(
                    currentUserProfile.city
                  )
            )
            .sort(
              (a, b) =>
                getLocationScore(
                  b
                ) -
                getLocationScore(
                  a
                )
            );
      }

      if (
        search.trim()
      ) {
        const s =
          normalize(search);

        result =
          result.filter(
            (member) => {
              const name =
                normalize(
                  member.name ||
                    member.full_name ||
                    member.username
                );

              const city =
                normalize(
                  member.city
                );

              const country =
                normalize(
                  member.country
                );

              return (
                name.includes(s) ||
                city.includes(s) ||
                country.includes(s)
              );
            }
          );
      }

      return result;
    }, [
      smartMembers,
      activeCategory,
      search,
      currentUserProfile,
    ]);

    // ===================== REFRESHABLE MEMBER ROTATION =====================

// Number of people displayed at one time.
// Change this number if you want more or fewer cards.
const MEMBERS_PER_REFRESH = 9;

// Proper Fisher-Yates shuffle
const shuffleMembers = (members) => {
  const shuffled = [...members];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
};


// Keep track of members already shown to this user.
// This survives a normal page refresh.
const getSeenMemberIds = () => {
  if (!currentUser?.id) return [];

  try {
    const saved = localStorage.getItem(
      `umuhuza_seen_members_${currentUser.id}`
    );

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};


const saveSeenMemberIds = (ids) => {
  if (!currentUser?.id) return;

  try {
    localStorage.setItem(
      `umuhuza_seen_members_${currentUser.id}`,
      JSON.stringify(ids)
    );
  } catch {
    // Ignore localStorage errors
  }
};


// Select a fresh group of people whenever the page loads.
const refreshableMembers = useMemo(() => {
  if (!currentUser?.id || filteredMembers.length === 0) {
    return [];
  }

  let seenIds = getSeenMemberIds();

  // People who haven't appeared recently
  let unseenMembers = filteredMembers.filter(
    member => !seenIds.includes(member.id)
  );

  // If we have already seen everybody,
  // start a new rotation.
  if (unseenMembers.length === 0) {
    seenIds = [];
    unseenMembers = [...filteredMembers];

    saveSeenMemberIds([]);
  }

  // Shuffle the fresh people
  const shuffled = shuffleMembers(unseenMembers);

  // Select only a limited number for this refresh
  const selected = shuffled.slice(
    0,
    MEMBERS_PER_REFRESH
  );

  // Remember these people
  const newSeenIds = [
    ...seenIds,
    ...selected.map(member => member.id),
  ];

  saveSeenMemberIds(newSeenIds);

  return selected;
}, [filteredMembers, currentUser]);

// =====================================================
// LIKE / UNLIKE MEMBER
// =====================================================
// =====================================================
// LIKE / UNLIKE MEMBER
// =====================================================
const handleLike = async (member) => {
  if (!currentUser || !member?.id) {
    console.error("Cannot like: missing user or member.");
    return;
  }

  const memberId = member.id;
  const alreadyLiked = likedMembers.includes(memberId);

  setError("");

  try {
    // ===================== UNLIKE =====================
    if (alreadyLiked) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("likerId", currentUser.id)
        .eq("likedId", memberId);

      if (deleteError) throw deleteError;

      setLikedMembers((prev) => prev.filter((id) => id !== memberId));
      return;
    }

    // ===================== LIKE =====================
    const { error: likeError } = await supabase
      .from("likes")
      .insert({
        likerId: currentUser.id,
        likedId: memberId,
        createdAt: new Date().toISOString(),
      });

    if (likeError) {
      // Already liked
      if (likeError.code === "23505") {
        setLikedMembers((prev) =>
          prev.includes(memberId) ? prev : [...prev, memberId]
        );
        return;
      }
      throw likeError;
    }

    // Update UI immediately
    setLikedMembers((prev) =>
      prev.includes(memberId) ? prev : [...prev, memberId]
    );

    // ===================== SENDER INFORMATION =====================
    const senderName =
      currentUserProfile?.full_name ||
      currentUserProfile?.firstName ||
      currentUserProfile?.name ||
      currentUser.user_metadata?.full_name ||
      "UMUHUZA Member";

// ===================== CREATE NOTIFICATION =====================

const { data: notificationData, error: notificationError } =
  await supabase
    .from("notifications")
    .insert({
      user_id: memberId,
      type: "like",
      title: "Someone liked you ❤️",
      message: `${senderName} liked your profile.`,
      related_user_id: currentUser.id,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

if (notificationError) {
  console.error(
    "Like notification error:",
    notificationError
  );
}

    if (notificationError) {
      console.error("Like notification error:", notificationError);
    }

  } catch (err) {
    console.error("Like error:", err);
    setError(err?.message || "Unable to like this member.");
  }
};


// =====================================================
// SEND INTEREST
// =====================================================
const handleInterest = async (member) => {
  if (!currentUser) {
    navigate("/login");
    return;
  }

  if (!member?.id) {
    console.error("No member ID found.");
    return;
  }

  // Already sent?
  if (getInterestForMember(member.id)) {
    return;
  }

  setInterestLoading(member.id);
  setError("");

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Please log in again.");
      return;
    }

    // Optional: require email verification
    if (!user.email_confirmed_at) {
      setShowVerificationBox(true);
      return;
    }

    const senderName =
      currentUserProfile?.full_name ||
      currentUserProfile?.firstName ||
      currentUserProfile?.name ||
      user.user_metadata?.full_name ||
      "UMUHUZA Member";

    const senderPhoto =
      currentUserProfile?.profile_photo_url ||
      currentUserProfile?.profilePhoto ||
      "";

    const receiverName =
      member.full_name ||
      member.firstName ||
      member.name ||
      "UMUHUZA Member";

    const receiverPhoto =
      member.profile_photo_url ||
      member.profilePhoto ||
      "";

    // ===================== INSERT INTEREST =====================
    const { data: interest, error: interestError } = await supabase
      .from("interests")
      .insert({
        senderId: user.id,
        receiverId: member.id,
        senderName,
        receiverName,
        senderPhoto,
        receiverPhoto,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (interestError) {
      console.error("Interest insert error:", interestError);
      setError(interestError.message || "Unable to send interest.");
      return;
    }

    // ===================== CREATE NOTIFICATION =====================



console.log("🔔 INTEREST NOTIFICATION RESULT:", {
  notificationData,
  notificationError,
});
    if (notificationError) {
      console.error("Interest notification error:", notificationError);
    }

    // ===================== UPDATE UI =====================
    setInterests((prev) => [...prev, interest]);
    setInterestedMembers((prev) => [...prev, member.id]);

    console.log("Interest sent successfully to", receiverName);

  } catch (err) {
    console.error("Send Interest error:", err);
    setError(err?.message || "Unable to send interest. Please try again.");
  } finally {
    setInterestLoading(null);
  }
};
  // =====================================================
  // LOADING
  // =====================================================

  if (
    authLoading ||
    loading ||
    profileLoading
  ) {
    return (
      <div className="member-loading-page">
        <div className="member-loading-card">

          <div className="member-loading-icon">
            ❤️
          </div>

          <h2>
            Finding Your Connections...
          </h2>

          <p>
            UMUHUZA is finding people
            who may be a good match
            for you.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser) {
    return (
      <div className="member-loading-page">

        <div className="member-loading-card">

          <div className="member-loading-icon">
            ❤️
          </div>

          <h2>
            Please log in
          </h2>

          <p>
            You need to be logged in
            to discover members.
          </p>

          <button
            className="auth-primary-btn"
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // START CHAT
  // =====================================================
// =====================================================
// START CHAT
// =====================================================

const handleStartChat = (member) => {
  try {
    // -------------------------------------------------
    // USER MUST BE LOGGED IN
    // -------------------------------------------------
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // -------------------------------------------------
    // CHECK MEMBER
    // -------------------------------------------------
    if (!member) {
      setError("Unable to open this member's chat.");
      return;
    }

    // -------------------------------------------------
    // GET MEMBER ID
    // -------------------------------------------------
    const memberId =
      member.id ||
      member.uid ||
      member.userId;

    if (!memberId) {
      console.error(
        "START CHAT: member has no ID",
        member
      );

      setError(
        "Unable to identify this member."
      );

      return;
    }

    // -------------------------------------------------
    // DON'T CHAT WITH YOURSELF
    // -------------------------------------------------
    if (
      String(memberId) ===
      String(currentUser.id)
    ) {
      setError(
        "You cannot start a chat with yourself."
      );

      return;
    }

    // -------------------------------------------------
    // CLEAR OLD ERROR
    // -------------------------------------------------
    setError("");

    // -------------------------------------------------
    // DEBUG
    // -------------------------------------------------
    console.log(
      "💬 START CHAT",
      {
        memberId,
        memberName:
          member.full_name ||
          member.name ||
          member.username ||
          "Unknown member",
      }
    );

    // -------------------------------------------------
    // OPEN CHAT
    // -------------------------------------------------
    navigate("/chat", {
      state: {
        selectedUserId: memberId,
        member: member,
      },
    });

  } catch (chatError) {
    console.error(
      "START CHAT ERROR:",
      chatError
    );

    setError(
      chatError?.message ||
      "Unable to start chat. Please try again."
    );
  }
};

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="member-page">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header
        className="member-navbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#f8f1e9",
          position: "sticky",
          top: 0,
          zIndex: 200,
          width: "100%",
        }}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div
          className="member-logo"
          onClick={() =>
            navigate("/")
          }
          style={{
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <img
            src={umurangaLogo}
            alt="UMUHUZA.COM"
            style={{
              height: 42,
              objectFit: "contain",
            }}
          />
        </div>

        {/* =================================================
            DESKTOP NAV LINKS
        ================================================= */}

        <div
          className="desktop-nav-links"
          style={{
            display: "none",
          }}
        >

          <button
            onClick={() =>
              navigate("/chat")
            }
            style={{
              position: "relative",
            }}
          >
            <FiMessageCircle
              size={18}
            />
            Messages
            {unreadMessageCount > 0 && (
              <span
                className="unread-message-badge"
 style={{
  position: "absolute",
  top: -9,
  right: -9,

  minWidth: 9,
  height: 9,
  padding: "0 6px",

  borderRadius: "999px",

  background: "#ff3040",
  color: "#ffffff",

  fontSize: 11,
  fontWeight: 800,
  lineHeight: 1,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  border: "2px solid #ffffff",

  boxSizing: "border-box",

  zIndex: 20,

  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.18)",
}}  
              >
                {unreadMessageCount > 99
                  ? "99+"
                  : unreadMessageCount}
              </span>
            )}
          </button>

          <button
            onClick={() =>
              navigate(
                "/interests"
              )
            }
          >
            <FiUsers
              size={18}
            />
            Connections
          </button>

          <button
            onClick={() =>
              navigate(
                "/notifications"
              )
            }
          >
            <FiBell
              size={18}
            />
            Notifications

            {unreadNotifications.length >
              0 && (
              <span className="desktop-notification-badge">
                {
                  unreadNotifications.length
                }
              </span>
            )}
          </button>

          <button
            onClick={() =>
              navigate(
                "/premium"
              )
            }
          >
            <FiDollarSign
              size={18}
            />
            Premium
          </button>

<button
  type="button"
  className="desktop-whatsapp-btn"
  onClick={handleWhatsApp}
>
  <span>
    🟢
  </span>
  WhatsApp
</button>

        </div>

        {/* =================================================
            RIGHT CONTROLS
        ================================================= */}

        <div
          className="member-navbar-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "auto",
          }}
        >

          {/* =================================================
              LANGUAGE
          ================================================= */}

          <div
            style={{
              position:
                "relative",
            }}
          >

            <button
              className="member-navbar-control"
              onClick={(e) => {
                e.stopPropagation();

                setShowLanguageMenu(
                  !showLanguageMenu
                );

                setShowThemeMenu(
                  false
                );

                setShowMenu(
                  false
                );
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius:
                  "50%",
                border: "none",
                background:
                  "white",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                cursor:
                  "pointer",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <FiGlobe
                size={19}
                color="#5b21b6"
              />
            </button>

            {showLanguageMenu && (
              <div
                className="dropdown-menu"
                style={{
                  right: 0,
                  top: 48,
                }}
              >

                {[
                  {
                    code: "en",
                    label:
                      "🇬🇧 English",
                  },
                  {
                    code: "rw",
                    label:
                      "🇷🇼 Kinyarwanda",
                  },
                  {
                    code: "fr",
                    label:
                      "🇫🇷 Français",
                  },
                  {
                    code: "sw",
                    label:
                      "🌍 Kiswahili",
                  },
                ].map(
                  (item) => (
                    <button
                      key={
                        item.code
                      }
                      onClick={() => {
                        changeLanguage(
                          item.code
                        );

                        setShowLanguageMenu(
                          false
                        );
                      }}
                      className={
                        language ===
                        item.code
                          ? "active"
                          : ""
                      }
                    >
                      {
                        item.label
                      }
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =================================================
              THEME
          ================================================= */}

          <div
            style={{
              position:
                "relative",
            }}
          >

            <button
              className="member-navbar-control"
              onClick={(e) => {
                e.stopPropagation();

                setShowThemeMenu(
                  !showThemeMenu
                );

                setShowLanguageMenu(
                  false
                );

                setShowMenu(
                  false
                );
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius:
                  "50%",
                border: "none",
                background:
                  "white",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                cursor:
                  "pointer",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >

              {theme ===
              "dark" ? (
                <FiMoon
                  size={19}
                  color="#5b21b6"
                />
              ) : (
                <FiSun
                  size={19}
                  color="#5b21b6"
                />
              )}

            </button>

            {showThemeMenu && (
              <div
                className="dropdown-menu"
                style={{
                  right: 0,
                  top: 48,
                }}
              >

                <button
                  onClick={() => {
                    changeTheme(
                      "light"
                    );

                    setShowThemeMenu(
                      false
                    );
                  }}
                >
                  <FiSun
                    size={16}
                  />
                  Light
                </button>

                <button
                  onClick={() => {
                    changeTheme(
                      "dark"
                    );

                    setShowThemeMenu(
                      false
                    );
                  }}
                >
                  <FiMoon
                    size={16}
                  />
                  Dark
                </button>

              </div>
            )}

          </div>

{/* =================================================
    MENU
================================================= */}

<div
  style={{
    position: "relative",
  }}
>
  <button
    type="button"
    className="member-navbar-control menu-control-btn"
    onClick={(e) => {
      e.stopPropagation();

      setShowMenu(!showMenu);

      setShowLanguageMenu(false);
      setShowThemeMenu(false);
    }}
    aria-label="Open menu"
  >
    <FiMenu
      size={21}
      color="#5b21b6"
    />
  </button>

  {showMenu && (
    <div className="umuhuza-menu-dropdown">

      {/* MENU HEADER */}
      <div className="umuhuza-menu-header">
        <div className="umuhuza-menu-header-icon">
          <FiMenu size={18} />
        </div>

        <div>
          <strong>Menu</strong>
          <span>Manage your UMUHUZA account</span>
        </div>
      </div>


      {/* MY PROFILE */}
      <button
        type="button"
        className="umuhuza-menu-item"
        onClick={() => {
          setShowMenu(false);
          navigate("/profile");
        }}
      >
        <div className="umuhuza-menu-icon profile">
          <FiUser size={19} />
        </div>

        <div className="umuhuza-menu-text">
          <strong>{t("nav.myProfile") || "My Profile"}</strong>
          <span>View and edit your profile</span>
        </div>

        <FiChevronDown
          className="umuhuza-menu-arrow"
          size={16}
        />
      </button>


      {/* INVITE FRIENDS */}
      <button
        type="button"
        className="umuhuza-menu-item"
        onClick={() => {
          setShowMenu(false);
          navigate("/referral");
        }}
      >
        <div className="umuhuza-menu-icon invite">
          <FiGift size={19} />
        </div>

        <div className="umuhuza-menu-text">
          <strong>{t("nav.inviteFriends") || "Invite Friends"}</strong>
          <span>Invite friends to join UMUHUZA</span>
        </div>

        <FiChevronDown
          className="umuhuza-menu-arrow"
          size={16}
        />
      </button>


      {/* ACCOUNT SETTINGS */}
      <button
        type="button"
        className="umuhuza-menu-item"
        onClick={() => {
          setShowMenu(false);

          // All account settings are now inside My Profile
          navigate("/profile");
        }}
      >
        <div className="umuhuza-menu-icon settings">
          <FiSettings size={19} />
        </div>

        <div className="umuhuza-menu-text">
          <strong>{t("nav.accountSettings") || "Account Settings"}</strong>
          <span>Privacy, security and preferences</span>
        </div>

        <FiChevronDown
          className="umuhuza-menu-arrow"
          size={16}
        />
      </button>

    </div>
  )}
</div>

        </div>

      </header>

     
      {/* =================================================
          SECONDARY NAV
      ================================================= */}
{/* =================================================
    SECONDARY NAV
================================================= */}

<nav className="member-secondary-nav">

  {/* Messages */}
  <button
    className="secondary-nav-item"
    onClick={() => navigate("/chat")}
  >
    <div className="nav-icon-box">
      <FiMessageCircle size={22} color="white" />

      {unreadMessageCount > 0 && (
        <span className="nav-badge">
          {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
        </span>
      )}
    </div>
    <span>{t("nav.messages") || "Messages"}</span>
  </button>

  {/* Connections */}
  <button
    className="secondary-nav-item"
    onClick={() => navigate("/interests")}
  >
    <div className="nav-icon-box">
      <FiUsers size={22} color="white" />

      {pendingInterestsCount > 0 && (
        <span className="nav-badge">
          {pendingInterestsCount > 99 ? "99+" : pendingInterestsCount}
        </span>
      )}
    </div>
    <span>{t("nav.connections") || "Connections"}</span>
  </button>

  {/* Notifications */}
{/* Notifications */}
<button
  className="secondary-nav-item"
  onClick={() => navigate("/notifications")}
  style={{
    position: "relative",
  }}
>
  <div className="nav-icon-box">
    <FiBell
      size={22}
      color="white"
    />
  </div>

<span>{t("nav.notifications") || "Notifications"}</span>

  {unreadNotificationCount > 0 && (
    <span className="secondary-notification-badge">
      {unreadNotificationCount > 99
        ? "99+"
        : unreadNotificationCount}
    </span>
  )}
</button>

  {/* Premium */}
  <button
    className="secondary-nav-item"
    onClick={() => navigate("/premium")}
  >
    <div className="nav-icon-box">
      <FiDollarSign size={22} color="white" />
    </div>
    <span>{t("nav.premium") || "Premium"}</span>
  </button>

  {/* WhatsApp */}
<button
  type="button"
  className="secondary-nav-item whatsapp-nav-item"
  onClick={() => setShowCommunityLinks(true)}
>
  <div className="nav-icon-box">
    <span style={{ fontSize: 18, color: "white" }}>🟢</span>
  </div>
  <span>{t("nav.whatsapp") || "WhatsApp"}</span>
</button>

</nav>
      {/* =================================================
          HERO
      ================================================= */}

      <main className="member-main">
<section className="member-welcome">
  <div>
    <span className="welcome-label">
      ❤️ {t("home.welcome") || "WELCOME TO UMUHUZA"}
    </span>

    <h1>
      {t("home.discoverTitle") || "Discover Someone"}
      <br />
      <span>{t("home.discoverSubtitle") || "special today"}</span>
    </h1>

    <p>
      {t("home.discoverDescription") ||
        "Meet genuine people looking for meaningful relationships, friendship and love."}
    </p>

    {currentUserProfile && (
      <div className="member-location-summary">
        📍 {t("home.near") || "Near"}{" "}
        <strong>
          {currentUserProfile.city || "You"}
        </strong>
        {currentUserProfile.country
          ? `, ${currentUserProfile.country}`
          : ""}
      </div>
    )}
  </div>

  <div className="member-search">
    <FiSearch />
    <input
      type="text"
      placeholder={t("home.searchPlaceholder") || "Search members..."}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</section>


        {error && (
          <div className="member-error">
            {error}
          </div>
        )}

        {/* =================================================
            DISCOVERY TABS
        ================================================= */}

        <section className="member-section">
<div className="section-heading">
  <div>
    <h2>
      💕 {t("home.discoverPeople") || "Discover People"}
    </h2>
    <p>
      {t("home.meaningfulConnection") ||
        "Find people who could be a meaningful connection."}
    </p>
  </div>

  <div className="member-result-count">
    {filteredMembers.length}{" "}
    {filteredMembers.length === 1 ? "person" : "people"}
  </div>
</div>

          {/* =================================================
              DISCOVERY TABS
          ================================================= */}

          <div className="discovery-tabs">
{[
  { key: "recommended", label: `💕 ${t("category.recommended") || "Recommended"}` },
  { key: "online", label: `🟢 ${t("category.online") || "Online"}` },
  { key: "diaspora", label: `🌍 ${t("category.diaspora") || "Diaspora"}` },
  { key: "new", label: `✨ ${t("category.new") || "New"}` },
  { key: "verified", label: `✓ ${t("category.verified") || "Verified"}` },
  { key: "nearby", label: `📍 ${t("category.nearby") || "Nearby"}` },
].map((tab) => (
  <button
    key={tab.key}
    className={`discovery-tab ${activeCategory === tab.key ? "active" : ""}`}
    onClick={() => setActiveCategory(tab.key)}
  >
    {tab.label}
  </button>

              )
            )}

          </div>



 {/* =================================================
    MEMBER CARDS
================================================= */}

{refreshableMembers.length === 0 ? (
<div className="no-members-card">
  <div className="no-members-icon">💕</div>
  <h3>{t("home.noMembers") || "No matching members yet"}</h3>
  <p>
    {t("home.tryAnother") ||
      "We're still growing the UMUHUZA community. Try another category."}
  </p>
</div>
) : (
  <div className="member-discovery-grid">
    {refreshableMembers.map((member) => {
      // ==============================
      // MEMBER NAME
      // ==============================
      const name =
        member.full_name ||
        member.name ||
        [member.firstName, member.lastName].filter(Boolean).join(" ") ||
        "UMUHUZA Member";

      // ==============================
      // MEMBER PHOTO
      // ==============================
      const photo =
        member.profile_photo_url ||
        member.profilePhoto ||
        member.profile_photo ||
        member.photoURL ||
        member.photo_url ||
        member.avatar ||
        member.image ||
        "";

      // ==============================
      // MEMBER AGE
      // ==============================
      const age =
        member.age ||
        calculateMemberAge(
          member.date_of_birth ||
            member.dateOfBirth ||
            member.birth_date ||
            member.birthDate
        );

      // ==============================
      // INTEREST STATUS
      // ==============================
      const interest = getInterestForMember(member.id);
      const isPending = interest?.status === "pending";
      const isConnected = interest?.status === "accepted";

      return (
        <div className="member-card" key={member.id}>
          <div className="member-photo-wrapper">
            {photo ? (
              <img src={photo} alt={name} className="member-photo" />
            ) : (
              <div className="member-photo-placeholder">
                <FiUser size={48} />
              </div>
            )}

            {member.online && (
              <span className="member-online-badge">🟢 Online</span>
            )}

            {member.verified && (
              <span className="member-verified-badge">✓ Verified</span>
            )}
          </div>

          <div className="member-info">
            <h3>
              {name}
              {age ? `, ${age}` : ""}
            </h3>

            <p>
              📍 {member.city || "Location not added"}
              {member.country ? `, ${member.country}` : ""}
            </p>

            {/* VIEW PROFILE */}
{/* VIEW PROFILE */}
<button
  className="member-action-btn"
  onClick={() => {
    const memberId = member.id || member.uid;
    navigate(`/member-profile/${memberId}`, {
      state: { member },
    });
  }}
>
  👤 {t("home.viewProfile") || "View Profile"}
</button>

{/* LIKE */}
<button
  className={`member-action-btn like-btn ${
    likedMembers.includes(member.id) ? "liked" : ""
  }`}
  onClick={() => handleLike(member)}
>
  {likedMembers.includes(member.id)
    ? `❤️ ${t("home.liked") || "Liked"}`
    : `♡ ${t("home.like") || "Like"}`}
</button>

{/* SEND INTEREST */}
<button
  className={`member-action-btn interest-btn ${
    isPending || isConnected ? "sent" : ""
  }`}
  onClick={() => handleInterest(member)}
  disabled={isPending || isConnected || interestLoading === member.id}
>
  {interestLoading === member.id
    ? "Sending..."
    : isConnected
    ? `🤝 ${t("home.connected") || "Connected"}`
    : isPending
    ? `✓ ${t("home.interestSent") || "Interest Sent"}`
    : `💕 ${t("home.sendInterest") || "Send Interest"}`}
</button>

{/* START CHAT */}
<button
  className="member-action-btn chat-btn"
  onClick={() => handleStartChat(member)}
>
  💬 {t("home.startChat") || "Start Chat"}
</button>
          </div>
        </div>
      );
    })}
  </div>
)}

{/* =================================================
    COMMUNITY LINKS MODAL
================================================= */}
{showCommunityLinks && (
  <div
    className="community-overlay"
    onClick={() => setShowCommunityLinks(false)}
  >
    <div
      className="community-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="community-header">
        <div>
          <h3>Join Our Community ❤️</h3>
          <p>Connect with real people on WhatsApp & Telegram</p>
        </div>
        <button
          className="community-close"
          onClick={() => setShowCommunityLinks(false)}
        >
          ✕
        </button>
      </div>

      <div className="community-options">
        {/* WhatsApp Group */}
        <a
          href="https://chat.whatsapp.com/IAOf4F19GvS9eNhFLByjcz"
          target="_blank"
          rel="noopener noreferrer"
          className="community-btn whatsapp-group"
        >
          <div className="community-icon">🟢</div>
          <div className="community-text">
            <strong>WhatsApp Group</strong>
            <span>Join the main community group</span>
          </div>
        </a>

        {/* WhatsApp Channel */}
        <a
          href="https://whatsapp.com/channel/0029Vb8tQ95ISTkDtauHpV2b"
          target="_blank"
          rel="noopener noreferrer"
          className="community-btn whatsapp-channel"
        >
          <div className="community-icon">📢</div>
          <div className="community-text">
            <strong>WhatsApp Channel</strong>
            <span>Get updates & announcements</span>
          </div>
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/+jIyn-yrHlC5jYWM0"
          target="_blank"
          rel="noopener noreferrer"
          className="community-btn telegram"
        >
          <div className="community-icon">✈️</div>
          <div className="community-text">
            <strong>Telegram</strong>
            <span>Join our Telegram community</span>
          </div>
        </a>
      </div>
    </div>
  </div>
)}

        </section>

      </main>

    </div>
  );
}

export default MemberHome;
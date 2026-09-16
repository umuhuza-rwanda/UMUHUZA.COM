import "./Chat.css";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAppPreferences } from "../../context/AppPreferencesContext";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiArrowLeft,
  FiSend,
  FiSearch,
  FiMoreVertical,
  FiPhone,
  FiImage,
  FiHeart,
  FiCheckCircle,
  FiUser,
  FiX,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";


// =====================================================
// CONSTANTS
// =====================================================

const CHAT_IMAGE_BUCKET = "chat-images";

const IMAGE_MAX_BYTES = 250 * 1024;

const IMAGE_EXPIRY_MS =
  48 * 60 * 60 * 1000;

const IMAGE_SIGNED_URL_SECONDS =
  48 * 60 * 60;


// =====================================================
// CHECK IF IMAGE MESSAGE IS EXPIRED
// =====================================================

const isExpiredImageMessage =
  (chatMessage) => {

    if (
      chatMessage?.message_type !==
      "image"
    ) {
      return false;
    }

    if (
      !chatMessage?.expires_at
    ) {
      return false;
    }

    const expiresTime =
      new Date(
        chatMessage.expires_at
      ).getTime();

    if (
      Number.isNaN(
        expiresTime
      )
    ) {
      return false;
    }

    return (
      expiresTime <= Date.now()
    );
  };

  const t = (key) => {
  if (!translations || !translations[language]) {
    return key;
  }

  return (
    translations[language][key] ||
    translations.en?.[key] ||
    key
  );
};

// =====================================================
// FILTER EXPIRED IMAGE MESSAGES
// =====================================================

const filterVisibleMessages =
  (messageList) => {

    return (
      messageList || []
    ).filter(
      (chatMessage) =>
        !isExpiredImageMessage(
          chatMessage
        )
    );
  };


// =====================================================
// COMPRESS IMAGE TO MAX 250 KB
// =====================================================

const compressImageTo250KB =
  (file) => {

    return new Promise(
      (resolve, reject) => {

        if (
          !file ||
          !file.type?.startsWith(
            "image/"
          )
        ) {

          reject(
            new Error(
              "Invalid image file."
            )
          );

          return;
        }


        const reader =
          new FileReader();


        reader.onload = (
          event
        ) => {

          const img =
            new Image();


          img.onload = () => {

            const canvas =
              document.createElement(
                "canvas"
              );

            const context =
              canvas.getContext(
                "2d"
              );


            if (!context) {

              reject(
                new Error(
                  "Unable to process image."
                )
              );

              return;
            }


            let maxDimension =
              1600;

            let width =
              img.width;

            let height =
              img.height;


            // =========================================
            // INITIAL RESIZE
            // =========================================

            const resizeToMax =
              () => {

                if (
                  width <= maxDimension &&
                  height <= maxDimension
                ) {
                  return;
                }

                if (
                  width >= height
                ) {

                  height =
                    Math.round(
                      (
                        height /
                        width
                      ) *
                      maxDimension
                    );

                  width =
                    maxDimension;

                } else {

                  width =
                    Math.round(
                      (
                        width /
                        height
                      ) *
                      maxDimension
                    );

                  height =
                    maxDimension;
                }
              };


            resizeToMax();


            // Keep slightly below 250 KB
            // to make sure Storage never receives
            // an image above the requested limit.

            const targetSize =
              IMAGE_MAX_BYTES;


            // =========================================
            // TRY DIFFERENT QUALITY LEVELS
            // =========================================

            const attempt =
              (
                currentWidth,
                currentHeight,
                quality
              ) => {

                canvas.width =
                  currentWidth;

                canvas.height =
                  currentHeight;


                context.clearRect(
                  0,
                  0,
                  currentWidth,
                  currentHeight
                );


                context.drawImage(
                  img,
                  0,
                  0,
                  currentWidth,
                  currentHeight
                );


                canvas.toBlob(
                  (blob) => {

                    if (!blob) {

                      reject(
                        new Error(
                          "Image compression failed."
                        )
                      );

                      return;
                    }


                    // =================================
                    // SUCCESS
                    // =================================

                    if (
                      blob.size <=
                      targetSize
                    ) {

                      const newName =
                        file.name.replace(
                          /\.[^/.]+$/,
                          ".jpg"
                        );


                      const compressedFile =
                        new File(
                          [
                            blob,
                          ],
                          newName,
                          {
                            type:
                              "image/jpeg",

                            lastModified:
                              Date.now(),
                          }
                        );


                      resolve(
                        compressedFile
                      );

                      return;
                    }


                    // =================================
                    // LOWER QUALITY
                    // =================================

                    const nextQuality =
                      quality - 0.08;


                    if (
                      nextQuality >=
                      0.25
                    ) {

                      attempt(
                        currentWidth,
                        currentHeight,
                        nextQuality
                      );

                      return;
                    }


                    // =================================
                    // REDUCE DIMENSIONS
                    // =================================

                    const nextWidth =
                      Math.round(
                        currentWidth *
                        0.80
                      );

                    const nextHeight =
                      Math.round(
                        currentHeight *
                        0.80
                      );


                    if (
                      nextWidth < 320 ||
                      nextHeight < 320
                    ) {

                      // Final aggressive attempt

                      canvas.toBlob(
                        (finalBlob) => {

                          if (
                            !finalBlob ||
                            finalBlob.size >
                            targetSize
                          ) {

                            reject(
                              new Error(
                                `${file.name} could not be compressed below 250 KB.`
                              )
                            );

                            return;
                          }


                          const finalName =
                            file.name.replace(
                              /\.[^/.]+$/,
                              ".jpg"
                            );


                          resolve(
                            new File(
                              [
                                finalBlob,
                              ],
                              finalName,
                              {
                                type:
                                  "image/jpeg",

                                lastModified:
                                  Date.now(),
                              }
                            )
                          );

                        },
                        "image/jpeg",
                        0.20
                      );

                      return;
                    }


                    attempt(
                      nextWidth,
                      nextHeight,
                      0.78
                    );

                  },
                  "image/jpeg",
                  quality
                );

              };


            attempt(
              width,
              height,
              0.85
            );

          };


          img.onerror = () => {

            reject(
              new Error(
                "Unable to read image."
              )
            );

          };


          img.src =
            event.target.result;

        };


        reader.onerror = () => {

          reject(
            new Error(
              "Unable to read selected image."
            )
          );

        };


        reader.readAsDataURL(
          file
        );

      }
    );
  };


// =====================================================
// CHAT COMPONENT
// =====================================================

function Chat() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { t } =
    useAppPreferences();


  // =====================================================
  // CURRENT USER
  // =====================================================

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);


  // =====================================================
  // MEMBERS
  // =====================================================

  const [
    connections,
    setConnections,
  ] = useState([]);

  const [
    loadingConnections,
    setLoadingConnections,
  ] = useState(true);


  // =====================================================
  // SELECTED PERSON
  // =====================================================

  const [
    selectedPerson,
    setSelectedPerson,
  ] = useState(null);


  // =====================================================
  // CURRENT CONVERSATION
  // =====================================================

  const [
    currentConversation,
    setCurrentConversation,
  ] = useState(null);


  // =====================================================
  // MESSAGES
  // =====================================================

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);


  // =====================================================
  // MESSAGE INPUT
  // =====================================================

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    sending,
    setSending,
  ] = useState(false);


  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [
    selectedImages,
    setSelectedImages,
  ] = useState([]);

  const [
    uploadingImages,
    setUploadingImages,
  ] = useState(false);


  // =====================================================
  // IMAGE INPUT
  // =====================================================

  const imageInputRef =
    useRef(null);


  // =====================================================
  // SEARCH
  // =====================================================

  const [
    search,
    setSearch,
  ] = useState("");


  // =====================================================
  // ERROR
  // =====================================================

  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // AUTH
  // =====================================================

  useEffect(() => {

    let active = true;


    const loadCurrentUser =
      async () => {

        try {

          const {
            data,
            error: authError,
          } =
            await supabase.auth.getUser();


          if (!active) {
            return;
          }


          if (authError) {

            console.error(
              "Supabase auth error:",
              authError
            );

            setCurrentUser(null);

            return;
          }


          setCurrentUser(
            data?.user || null
          );

        } catch (err) {

          console.error(
            "Unable to get Supabase user:",
            err
          );


          if (active) {
            setCurrentUser(null);
          }

        }

      };


    loadCurrentUser();


    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (!active) {
            return;
          }

          setCurrentUser(
            session?.user || null
          );

        }
      );


    return () => {

      active = false;

      subscription.unsubscribe();

    };

  }, []);


  // =====================================================
  // ONLINE PRESENCE
  // =====================================================

  useEffect(() => {

    if (!currentUser) {
      return undefined;
    }


    let active = true;


    const updatePresence =
      async (online) => {

        try {

          const {
            error: presenceError,
          } =
            await supabase
              .from("profiles")
              .update({
                online,
                last_seen:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                currentUser.id
              );


          if (
            presenceError &&
            active
          ) {

            console.error(
              "Unable to update online status:",
              presenceError
            );

          }

        } catch (err) {

          console.error(
            "Presence error:",
            err
          );

        }

      };


    updatePresence(true);


    const handleBeforeUnload =
      () => {
        updatePresence(false);
      };


    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );


    return () => {

      active = false;


      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );


      updatePresence(false);

    };

  }, [currentUser]);


  // =====================================================
  // LOAD MEMBERS
  // =====================================================

  useEffect(() => {

    if (!currentUser) {

      setConnections([]);

      setLoadingConnections(false);

      return undefined;
    }


    let active = true;


    setLoadingConnections(true);

    setError("");


    const loadMembers =
      async () => {

        try {

          const {
            data,
            error: membersError,
          } =
            await supabase
              .from("profiles")
              .select("*");


          if (!active) {
            return;
          }


          if (membersError) {

            console.error(
              "Error loading members:",
              membersError
            );


            setError(
              "Unable to load UMUHUZA members."
            );


            setConnections([]);

            setLoadingConnections(false);

            return;
          }


          const loadedMembers =
            (data || [])
              .map(
                (profile) => ({

                  ...profile,

                  id:
                    profile.id,


                  full_name:
                    profile.full_name ||
                    [
                      profile.first_name,
                      profile.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    profile.name ||
                    "UMUHUZA Member",


                  firstName:
                    profile.first_name ||
                    profile.firstName ||
                    "",


                  lastName:
                    profile.last_name ||
                    profile.lastName ||
                    "",


                  profilePhoto:
                    profile.profile_photo_url ||
                    profile.profilePhoto ||
                    profile.photo_url ||
                    profile.photoURL ||
                    profile.image ||
                    "",


                  profile_photo_url:
                    profile.profile_photo_url ||
                    profile.profilePhoto ||
                    profile.photo_url ||
                    profile.photoURL ||
                    profile.image ||
                    "",


                  online:
                    profile.online === true,


                  lastSeen:
                    profile.last_seen ||
                    profile.lastSeen ||
                    null,

                })
              )
              .filter(
                (profile) =>
                  profile.id !==
                  currentUser.id
              );


          // =================================================
          // SORT PEOPLE BY MOST RECENT CONVERSATION
          // =================================================

          try {

            const {
              data: conversations,
            } =
              await supabase
                .from("conversations")
                .select(
                  `
                    id,
                    participant_one,
                    participant_two,
                    last_message_at,
                    updated_at,
                    created_at
                  `
                )
                .or(
                  `participant_one.eq.${currentUser.id},participant_two.eq.${currentUser.id}`
                );


            const recentMap =
              new Map();


            (
              conversations ||
              []
            ).forEach(
              (conversation) => {

                const otherUserId =
                  conversation.participant_one ===
                  currentUser.id
                    ? conversation.participant_two
                    : conversation.participant_one;


                if (!otherUserId) {
                  return;
                }


                const recentDate =
                  conversation.last_message_at ||
                  conversation.updated_at ||
                  conversation.created_at ||
                  null;


                if (
                  !recentDate
                ) {
                  return;
                }


                const existing =
                  recentMap.get(
                    otherUserId
                  );


                if (
                  !existing ||
                  new Date(
                    recentDate
                  ).getTime() >
                  new Date(
                    existing
                  ).getTime()
                ) {

                  recentMap.set(
                    otherUserId,
                    recentDate
                  );

                }

              }
            );


            loadedMembers.sort(
              (a, b) => {

                const aDate =
                  recentMap.get(
                    a.id
                  );

                const bDate =
                  recentMap.get(
                    b.id
                  );


                if (
                  aDate &&
                  bDate
                ) {

                  return (
                    new Date(
                      bDate
                    ).getTime() -
                    new Date(
                      aDate
                    ).getTime()
                  );

                }


                if (
                  aDate &&
                  !bDate
                ) {
                  return -1;
                }


                if (
                  !aDate &&
                  bDate
                ) {
                  return 1;
                }


                return String(
                  a.full_name || ""
                ).localeCompare(
                  String(
                    b.full_name || ""
                  )
                );

              }
            );

          } catch (conversationSortError) {

            console.error(
              "Conversation sorting error:",
              conversationSortError
            );

          }


          setConnections(
            loadedMembers
          );

          setLoadingConnections(false);

        } catch (err) {

          console.error(
            "Member loading error:",
            err
          );


          if (!active) {
            return;
          }


          setError(
            "Unable to load UMUHUZA members."
          );


          setConnections([]);

          setLoadingConnections(false);

        }

      };


    loadMembers();


    // =====================================================
    // REALTIME PROFILE + CONVERSATION UPDATES
    // =====================================================

    const profileChannel =
      supabase
        .channel(
          `chat-profiles-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
          },
          () => {
            loadMembers();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
          },
          () => {
            loadMembers();
          }
        )
        .subscribe();


    return () => {

      active = false;


      supabase.removeChannel(
        profileChannel
      );

    };

  }, [currentUser]);

  // =====================================================
// INCREASE chat_limit_used
// =====================================================
const increaseChatLimitUsed = async () => {
  if (!currentUser) return;

  try {
    // Get current values
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("chat_limit_used, extra_chat_credits, premium_until")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error || !profile) return;

    // If user has Premium → do nothing
    if (profile.premium_until) {
      const premiumDate = new Date(profile.premium_until);
      if (premiumDate > new Date()) {
        return;
      }
    }

    // If user has extra credits → decrease credit instead
    if ((profile.extra_chat_credits || 0) > 0) {
      await supabase
        .from("profiles")
        .update({
          extra_chat_credits: profile.extra_chat_credits - 1,
        })
        .eq("id", currentUser.id);
      return;
    }

    // Otherwise increase the free limit counter
    await supabase
      .from("profiles")
      .update({
        chat_limit_used: (profile.chat_limit_used || 0) + 1,
      })
      .eq("id", currentUser.id);

  } catch (err) {
    console.error("Error increasing chat limit:", err);
  }
};


  // =====================================================
  // FILTER MEMBERS
  // =====================================================

  const filteredPeople =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      if (!searchValue) {
        return connections;
      }


      return connections.filter(
        (person) => {

          const name =
            String(
              person.full_name ||
              person.firstName ||
              person.first_name ||
              person.name ||
              ""
            ).toLowerCase();


          const city =
            String(
              person.city ||
              ""
            ).toLowerCase();


          const country =
            String(
              person.country ||
              ""
            ).toLowerCase();


          return (
            name.includes(
              searchValue
            ) ||
            city.includes(
              searchValue
            ) ||
            country.includes(
              searchValue
            )
          );

        }
      );

    }, [
      connections,
      search,
    ]);


  // =====================================================
  // GET OR CREATE CONVERSATION
  // =====================================================

  const getOrCreateConversation =
    async (person) => {

      if (
        !currentUser ||
        !person?.id
      ) {
        return null;
      }


      const userId =
        currentUser.id;

      const personId =
        person.id;


      try {

        // ================================================
        // USER -> PERSON
        // ================================================

        const {
          data: firstConversation,
          error: firstError,
        } =
          await supabase
            .from("conversations")
            .select("*")
            .eq(
              "participant_one",
              userId
            )
            .eq(
              "participant_two",
              personId
            )
            .limit(1);


        if (firstError) {
          throw firstError;
        }


        if (
          firstConversation &&
          firstConversation.length > 0
        ) {

          return firstConversation[0];

        }


        // ================================================
        // PERSON -> USER
        // ================================================

        const {
          data: secondConversation,
          error: secondError,
        } =
          await supabase
            .from("conversations")
            .select("*")
            .eq(
              "participant_one",
              personId
            )
            .eq(
              "participant_two",
              userId
            )
            .limit(1);


        if (secondError) {
          throw secondError;
        }


        if (
          secondConversation &&
          secondConversation.length > 0
        ) {

          return secondConversation[0];

        }


        // ================================================
        // CREATE CONVERSATION
        // ================================================

        const {
          data: newConversation,
          error: createError,
        } =
          await supabase
            .from("conversations")
            .insert({
              participant_one:
                userId,

              participant_two:
                personId,
            })
            .select("*")
            .single();


        if (createError) {
          throw createError;
        }


        return newConversation;

      } catch (err) {

        console.error(
          "Conversation error:",
          err
        );


        setError(
          "Unable to open this chat."
        );


        return null;
      }

    };


  // =====================================================
  // OPEN CHAT
  // =====================================================

  const openChat =
    async (person) => {

      if (
        !currentUser ||
        !person
      ) {
        return null;
      }


      setError("");


      const conversation =
        await getOrCreateConversation(
          person
        );


      if (!conversation) {
        return null;
      }


      setCurrentConversation(
        conversation
      );


      return conversation;

    };


  // =====================================================
  // SELECT PERSON
  // =====================================================

  const handleSelectPerson =
    async (person) => {

      if (!person) {
        return;
      }


      setSelectedPerson(
        person
      );


      setMessage("");

      setMessages([]);

      clearSelectedImages();

      setCurrentConversation(
        null
      );

      setError("");


      await openChat(
        person
      );

    };


  // =====================================================
  // SELECT PERSON FROM PROFILE / DEFAULT PERSON
  // =====================================================

  useEffect(() => {
    if (selectedPerson || connections.length === 0) {
      return;
    }

    const selectedUserId =
      location.state?.selectedUserId;

    const requestedPerson = selectedUserId
      ? connections.find(
          (person) =>
            String(person.id) === String(selectedUserId)
        )
      : null;

    const person =
      requestedPerson || connections[0];

    if (!person) {
      return;
    }

    console.log("💬 CHAT TARGET", {
      selectedUserId,
      personId: person.id,
      personName:
        person.full_name ||
        person.name ||
        person.username ||
        "Unknown",
    });

    setSelectedPerson(person);

    openChat(person);
  }, [
    connections,
    selectedPerson,
    location.state?.selectedUserId,
  ]);


  // =====================================================
  // CLEANUP EXPIRED IMAGES
  // =====================================================

  const cleanupExpiredImages =
    async () => {

      if (!currentUser) {
        return;
      }


      try {

        const now =
          new Date().toISOString();


        const {
          data: expiredMessages,
          error: expiredError,
        } =
          await supabase
            .from("messages")
            .select(
              `
                id,
                sender_id,
                image_path,
                expires_at,
                message_type
              `
            )
            .eq(
              "message_type",
              "image"
            )
            .not(
              "image_path",
              "is",
              null
            )
            .lte(
              "expires_at",
              now
            )
            .limit(100);


        if (expiredError) {

          console.error(
            "Expired image query error:",
            expiredError
          );

          return;
        }


        if (
          !expiredMessages ||
          expiredMessages.length === 0
        ) {
          return;
        }


        // =================================================
        // BEST-EFFORT STORAGE CLEANUP
        // =================================================

        const paths =
          expiredMessages
            .map(
              (item) =>
                item.image_path
            )
            .filter(Boolean);


        if (
          paths.length > 0
        ) {

          const {
            error: storageError,
          } =
            await supabase
              .storage
              .from(
                CHAT_IMAGE_BUCKET
              )
              .remove(
                paths
              );


          if (storageError) {

            console.error(
              "Expired image Storage deletion error:",
              storageError
            );

          }

        }


        // =================================================
        // DELETE EXPIRED MESSAGE RECORDS
        // =================================================

        const ownMessageIds =
          expiredMessages
            .filter(
              (item) =>
                item.sender_id ===
                currentUser.id
            )
            .map(
              (item) =>
                item.id
            )
            .filter(Boolean);


        if (
          ownMessageIds.length > 0
        ) {

          const {
            error: deleteError,
          } =
            await supabase
              .from("messages")
              .delete()
              .in(
                "id",
                ownMessageIds
              );


          if (deleteError) {

            console.error(
              "Expired message deletion error:",
              deleteError
            );

          }

        }

      } catch (err) {

        console.error(
          "Expired image cleanup error:",
          err
        );

      }

    };


  // =====================================================
  // AUTOMATIC IMAGE CLEANUP
  // =====================================================

  useEffect(() => {

    if (!currentUser) {
      return undefined;
    }


    cleanupExpiredImages();


    const cleanupInterval =
      setInterval(
        () => {
          cleanupExpiredImages();
        },
        60 * 1000
      );


    return () => {

      clearInterval(
        cleanupInterval
      );

    };

  }, [currentUser]);


  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  useEffect(() => {

    if (
      !currentUser ||
      !selectedPerson
    ) {

      setMessages([]);

      setCurrentConversation(
        null
      );

      return undefined;
    }


    let active = true;

    let messageChannel =
      null;


    setLoadingMessages(true);

    setError("");


    const loadConversationAndMessages =
      async () => {

        try {

          const conversation =
            await getOrCreateConversation(
              selectedPerson
            );


          if (!active) {
            return;
          }


          if (!conversation) {

            setLoadingMessages(false);

            return;
          }


          setCurrentConversation(
            conversation
          );


          const conversationId =
            conversation.id;


          if (!conversationId) {

            setError(
              "Unable to open this conversation."
            );


            setMessages([]);

            setLoadingMessages(false);

            return;
          }


          const {
            data,
            error: messagesError,
          } =
            await supabase
              .from("messages")
              .select("*")
              .eq(
                "conversation_id",
                conversationId
              )
              .order(
                "created_at",
                {
                  ascending: true,
                }
              );


          if (!active) {
            return;
          }


          if (messagesError) {

            console.error(
              "Message load error:",
              messagesError
            );


            setError(
              "Unable to load messages."
            );


            setMessages([]);

            setLoadingMessages(false);

            return;
          }


          setMessages(
            filterVisibleMessages(
              data
            )
          );


          // =================================================
          // MARK INCOMING MESSAGES AS READ
          // =================================================
          // This removes the unread badge on MemberHome
          // once the conversation has actually been opened.
          // =================================================

          const { error: markReadError } =
            await supabase
              .from("messages")
              .update({
                is_read: true,
              })
              .eq(
                "conversation_id",
                conversationId
              )
              .neq(
                "sender_id",
                currentUser.id
              )
              .eq(
                "is_read",
                false
              );

          if (markReadError) {
            console.error(
              "Unable to mark incoming messages as read:",
              markReadError
            );
          }


          setLoadingMessages(
            false
          );


          // =================================================
          // REALTIME MESSAGES
          // =================================================

          messageChannel =
            supabase
              .channel(
                `chat-messages-${conversationId}-${currentUser.id}`
              )
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "messages",
                  filter:
                    `conversation_id=eq.${conversationId}`,
                },
                async () => {

                  try {

                    const {
                      data:
                        updatedMessages,
                      error:
                        reloadError,
                    } =
                      await supabase
                        .from("messages")
                        .select("*")
                        .eq(
                          "conversation_id",
                          conversationId
                        )
                        .order(
                          "created_at",
                          {
                            ascending: true,
                          }
                        );


                    if (
                      reloadError
                    ) {

                      console.error(
                        "Realtime message reload error:",
                        reloadError
                      );

                      return;
                    }


                    if (active) {

                      setMessages(
                        filterVisibleMessages(
                          updatedMessages
                        )
                      );

                    }

                  } catch (err) {

                    console.error(
                      "Realtime message error:",
                      err
                    );

                  }

                }
              )
              .subscribe(
                (status) => {

                  console.log(
                    "🔥 Realtime messages status:",
                    status
                  );

                }
              );

        } catch (err) {

          console.error(
            "Chat loading error:",
            err
          );


          if (active) {

            setError(
              "Unable to load messages."
            );


            setMessages([]);

            setLoadingMessages(false);

          }

        }

      };


    loadConversationAndMessages();


    return () => {

      active = false;


      if (messageChannel) {

        supabase.removeChannel(
          messageChannel
        );

        messageChannel = null;

      }

    };

  }, [
    currentUser,
    selectedPerson,
  ]);


  // =====================================================
  // FORMAT MESSAGE TIME
  // =====================================================

  const formatMessageTime =
    (timestamp) => {

      if (!timestamp) {
        return t("offline");
      }


      try {

        const date =
          timestamp?.toDate
            ? timestamp.toDate()
            : new Date(timestamp);


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return "";
        }


        return date.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      } catch {

        return "";

      }

    };


  // =====================================================
  // FORMAT LAST SEEN
  // =====================================================

  const formatLastSeen =
    (timestamp) => {

      if (!timestamp) {
        return "Offline";
      }


      try {

        const date =
          timestamp?.toDate
            ? timestamp.toDate()
            : new Date(timestamp);


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return "Offline";
        }


        const now =
          new Date();


        const difference =
          Math.floor(
            (
              now.getTime() -
              date.getTime()
            ) / 60000
          );


        if (
          difference < 1
        ) {

          return t(
            "lastSeenJustNow"
          );

        }


        if (
          difference < 60
        ) {

          return `Last seen ${difference} min ago`;

        }


        const hours =
          Math.floor(
            difference / 60
          );


        if (
          hours < 24
        ) {

          return hours === 1
            ? t(
                "lastSeenHour"
              ).replace(
                "{count}",
                hours
              )
            : t(
                "lastSeenHours"
              ).replace(
                "{count}",
                hours
              );

        }


        return `Last seen ${date.toLocaleDateString()}`;

      } catch {

        return t("offline");

      }

    };


  // =====================================================
  // CREATE MESSAGE NOTIFICATION
  // =====================================================

  const createMessageNotification =
    async (person) => {

      if (
        !currentUser ||
        !person?.id
      ) {
        return;
      }


      try {

        const senderName =
          currentUser.user_metadata
            ?.full_name ||
          currentUser.user_metadata
            ?.name ||
          currentUser.email ||
          "UMUHUZA Member";


        const senderPhoto =
          currentUser.user_metadata
            ?.avatar_url ||
          currentUser.user_metadata
            ?.profile_photo_url ||
          "";


        const {
          error:
            notificationError,
        } =
          await supabase
            .from("notifications")
            .insert({

              user_id:
                person.id,

              from_user_id:
                currentUser.id,

              from_user_name:
                senderName,

              from_user_photo:
                senderPhoto,

              type:
                "message",

              text:
                `${senderName} sent you a message ❤️`,

              read:
                false,

            });


        if (
          notificationError
        ) {

          console.error(
            "Message notification error:",
            notificationError
          );

        }

      } catch (err) {

        console.error(
          "Message notification error:",
          err
        );

      }

    };


  // =====================================================
  // OPEN IMAGE PICKER
  // =====================================================

  const openImagePicker =
    () => {

      if (
        sending ||
        uploadingImages
      ) {
        return;
      }


      setError("");


      if (
        imageInputRef.current
      ) {

        imageInputRef.current.click();

      }

    };


  // =====================================================
  // IMAGE FILE SELECTION
  // =====================================================
const handleImageSelection = (event) => {
  try {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) =>
      file?.type?.startsWith("image/")
    );

    if (!imageFiles.length) {
      setError("Please select a valid image.");
      return;
    }

    const newImages = imageFiles.map(
      (file, index) => ({
        id: `${Date.now()}-${index}-${Math.random()
          .toString(36)
          .slice(2)}`,

        file,

        preview: URL.createObjectURL(file),
      })
    );

    setSelectedImages((previous) => [
      ...previous,
      ...newImages,
    ]);

    setError("");

    // Allow selecting the same image again later.
    if (event.target) {
      event.target.value = "";
    }
  } catch (error) {
    console.error(
      "IMAGE SELECTION ERROR:",
      error
    );

    setError(
      "Unable to select this image. Please try another image."
    );
  }
};
  // =====================================================
  // REMOVE SELECTED IMAGE
  // =====================================================

const removeSelectedImage = (imageId) => {
  setSelectedImages((previous) => {
    const imageToRemove = previous.find(
      (item) => item.id === imageId
    );

    if (
      imageToRemove?.preview &&
      imageToRemove.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imageToRemove.preview
      );
    }

    return previous.filter(
      (item) => item.id !== imageId
    );
  });
};

  // =====================================================
  // CLEAR SELECTED IMAGES
  // =====================================================

  const clearSelectedImages = () => {

    selectedImages.forEach((image) => {
      if (image?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setSelectedImages([]);

  };


  // =====================================================
  // CLEANUP PREVIEWS ON UNMOUNT
  // =====================================================

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [selectedImages]);


  // =====================================================
  // SEND IMAGES
  // =====================================================

  const handleSendImages = async () => {

    if (
      !currentUser ||
      !selectedPerson ||
      !selectedImages.length ||
      sending ||
      uploadingImages
    ) {
      return;
    }

    setUploadingImages(true);
    setError("");

    try {

      const conversation =
        currentConversation ||
        (await getOrCreateConversation(selectedPerson));

      if (!conversation?.id) {
        throw new Error("Unable to open conversation.");
      }

      setCurrentConversation(conversation);

      const expiresAt =
        new Date(Date.now() + IMAGE_EXPIRY_MS).toISOString();

      for (const selectedImage of selectedImages) {

        const originalFile = selectedImage?.file;

        if (!originalFile) {
          continue;
        }

        // Compress only when the user actually sends the image.
        const compressedFile =
          await compressImageTo250KB(originalFile);

        const extension = "jpg";
        const uniqueName =
          `${currentUser.id}/${conversation.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

        const { error: uploadError } =
          await supabase
            .storage
            .from(CHAT_IMAGE_BUCKET)
            .upload(uniqueName, compressedFile, {
              cacheControl: "3600",
              contentType: "image/jpeg",
              upsert: false,
            });

        if (uploadError) {
          throw uploadError;
        }

        const { data: signedData, error: signedError } =
          await supabase
            .storage
            .from(CHAT_IMAGE_BUCKET)
            .createSignedUrl(
              uniqueName,
              IMAGE_SIGNED_URL_SECONDS
            );

        if (signedError || !signedData?.signedUrl) {
          // Best effort cleanup if the signed URL could not be created.
          await supabase
            .storage
            .from(CHAT_IMAGE_BUCKET)
            .remove([uniqueName]);

          throw signedError ||
            new Error("Unable to create image URL.");
        }

        const {
          data: insertedImageMessage,
          error: messageError,
        } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversation.id,
            sender_id: currentUser.id,
            content: signedData.signedUrl,
            message_type: "image",
            image_url: signedData.signedUrl,
            image_path: uniqueName,
            expires_at: expiresAt,
            is_read: false,
          })
          .select()
          .single();

        if (messageError) {
          await supabase
            .storage
            .from(CHAT_IMAGE_BUCKET)
            .remove([uniqueName]);

          throw messageError;
        }

        const now =
          insertedImageMessage?.created_at ||
          new Date().toISOString();

        const { error: conversationError } =
          await supabase
            .from("conversations")
            .update({
              last_message: "📷 Image",
              last_message_at: now,
              last_message_sender_id: currentUser.id,
              updated_at: now,
            })
            .eq("id", conversation.id);

        if (conversationError) {
          console.error(
            "Conversation image update error:",
            conversationError
          );
        }

        await createMessageNotification(selectedPerson);
      }

      clearSelectedImages();

    } catch (err) {

      console.error("Error sending images:", err);

      setError(
        err?.message ||
        "Unable to send image. Please try again."
      );

    } finally {
      setUploadingImages(false);
    }

  };


// =====================================================
// SEND MESSAGE - OPTIMISTIC UI
// =====================================================

const handleSendMessage =
  async () => {

    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      !currentUser ||
      !selectedPerson ||
      sending
    ) {
      return;
    }


    // ===================================================
    // CREATE TEMPORARY MESSAGE ID
    // ===================================================

    const optimisticId =
      `optimistic-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;


    // ===================================================
    // CREATE OPTIMISTIC MESSAGE
    // ===================================================

    const optimisticMessage = {

      id:
        optimisticId,

      conversation_id:
        currentConversation?.id ||
        null,

      sender_id:
        currentUser.id,

      content:
        trimmedMessage,

      message_type:
        "text",

      is_read:
        false,

      created_at:
        new Date().toISOString(),

      // Important:
      // This message exists only in the UI
      // until Supabase confirms it.
      _optimistic:
        true,

      send_status:
        "sending",

    };


    // ===================================================
    // SHOW MESSAGE IMMEDIATELY
    // ===================================================

    setMessages(
      (previousMessages) => [
        ...previousMessages,
        optimisticMessage,
      ]
    );


    // ===================================================
    // CLEAR INPUT IMMEDIATELY
    // ===================================================

    setMessage("");

    setError("");

    setSending(true);


    try {

      // =================================================
      // GET / CREATE CONVERSATION
      // =================================================

      const conversation =
        await getOrCreateConversation(
          selectedPerson
        );


      if (!conversation) {

        throw new Error(
          "Unable to open conversation."
        );

      }


      setCurrentConversation(
        conversation
      );


      // =================================================
      // INSERT INTO SUPABASE
      // =================================================

      const {
        data: insertedMessage,
        error: messageError,
      } = await supabase
        .from("messages")
        .insert({

          conversation_id:
            conversation.id,

          sender_id:
            currentUser.id,

          content:
            trimmedMessage,

          message_type:
            "text",

          is_read:
            false,

        })
        .select()
        .single();


      // =================================================
      // MESSAGE FAILED
      // =================================================

      if (messageError) {

        throw messageError;

      }


      // =================================================
      // MESSAGE SUCCESSFUL
      // =================================================

      const serverMessage = {

        ...insertedMessage,

        _optimistic:
          false,

        send_status:
          "sent",

      };


      // =================================================
      // REPLACE OPTIMISTIC MESSAGE WITH REAL MESSAGE
      // =================================================

      setMessages(
        (previousMessages) =>
          previousMessages.map(
            (item) =>
              item.id === optimisticId
                ? serverMessage
                : item
          )
      );


      // =================================================
      // UPDATE CONVERSATION
      // =================================================

      const now =
        insertedMessage?.created_at ||
        new Date().toISOString();


      const {
        error: conversationError,
      } = await supabase
        .from("conversations")
        .update({

          last_message:
            trimmedMessage,

          last_message_at:
            now,

          last_message_sender_id:
            currentUser.id,

          updated_at:
            now,

        })
        .eq(
          "id",
          conversation.id
        );


      if (conversationError) {

        console.error(
          "Conversation update error:",
          conversationError
        );

      }


      // =================================================
      // NOTIFICATION
      // =================================================

      await createMessageNotification(
        selectedPerson
      );


    } catch (err) {

      console.error(
        "Error sending message:",
        err
      );


      // =================================================
      // MESSAGE FAILED
      // =================================================
      //
      // DO NOT REMOVE IT.
      //
      // Keep it visible and show ✕.
      //

      setMessages(
        (previousMessages) =>
          previousMessages.map(
            (item) =>
              item.id === optimisticId
                ? {
                    ...item,

                    send_status:
                      "failed",

                    send_error:
                      err?.message ||
                      "Unable to send message.",

                  }
                : item
          )
      );


      setError(
        "Message was not sent. Please try again."
      );


    } finally {

      setSending(false);

    }
  };


  // =====================================================
  // SEND LOVE
  // =====================================================

  const handleSendLove =
    async () => {

      if (
        !currentUser ||
        !selectedPerson ||
        sending
      ) {
        return;
      }


      try {

        setSending(true);

        setError("");


        const conversation =
          await getOrCreateConversation(
            selectedPerson
          );


        if (!conversation) {
          return;
        }


        setCurrentConversation(
          conversation
        );


        const {
          data:
            insertedMessage,
          error:
            messageError,
        } =
          await supabase
            .from("messages")
            .insert({

              conversation_id:
                conversation.id,

              sender_id:
                currentUser.id,

              content:
                "❤️",

              message_type:
                "text",

              is_read:
                false,

            })
            .select()
            .single();


        if (
          messageError
        ) {
          throw messageError;
        }


        const now =
          insertedMessage?.created_at ||
          new Date().toISOString();


        const {
          error:
            conversationError,
        } =
          await supabase
            .from("conversations")
            .update({

              last_message:
                "❤️",

              last_message_at:
                now,

              last_message_sender_id:
                currentUser.id,

              updated_at:
                now,

            })
            .eq(
              "id",
              conversation.id
            );


        if (
          conversationError
        ) {
          throw conversationError;
        }


        await createMessageNotification(
          selectedPerson
        );

      } catch (err) {

        console.error(
          "Error sending love:",
          err
        );


        setError(
          "Unable to send love."
        );

      } finally {

        setSending(false);

      }

    };


  // =====================================================
  // SEND TEXT MESSAGE
  // =====================================================



   // =====================================================
// MERGE SERVER MESSAGES WITH OPTIMISTIC MESSAGES
// =====================================================

const mergeServerMessages = (serverMessages) => {
  setMessages((previousMessages) => {

    // Keep messages that are currently waiting for Supabase
    // or messages that failed to send.
    const optimisticMessages =
      previousMessages.filter(
        (item) =>
          item._optimistic === true &&
          (
            item.send_status === "sending" ||
            item.send_status === "failed"
          )
      );

    const mergedMessages = [
      ...(serverMessages || []),
    ];

    // ===================================================
    // REMOVE OPTIMISTIC MESSAGE IF SERVER ALREADY
    // CONTAINS THE SAME MESSAGE
    // ===================================================

    const stillWaitingOptimistic =
      optimisticMessages.filter(
        (optimisticMessage) => {

          const optimisticTime =
            new Date(
              optimisticMessage.created_at
            ).getTime();

          const matchingServerMessage =
            mergedMessages.some(
              (serverMessage) => {

                if (
                  serverMessage.sender_id !==
                  optimisticMessage.sender_id
                ) {
                  return false;
                }

                if (
                  serverMessage.content !==
                  optimisticMessage.content
                ) {
                  return false;
                }

                const serverTime =
                  new Date(
                    serverMessage.created_at
                  ).getTime();

                // Allow a small time difference between
                // optimistic creation and Supabase creation.
                return (
                  Math.abs(
                    serverTime -
                    optimisticTime
                  ) < 60000
                );
              }
            );

          return !matchingServerMessage;
        }
      );


    // ===================================================
    // SERVER MESSAGES + STILL PENDING/FAILED MESSAGES
    // ===================================================

    return [
      ...mergedMessages,
      ...stillWaitingOptimistic,
    ].sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );
  });
}; 


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown =
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSendMessage();

      }

    };


  // =====================================================
  // SELECTED PERSON NAME
  // =====================================================

  const selectedName =
    selectedPerson?.full_name ||
    [
      selectedPerson?.firstName ||
        selectedPerson?.first_name,

      selectedPerson?.lastName ||
        selectedPerson?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    selectedPerson?.name ||
    "UMUHUZA Member";


  // =====================================================
  // SELECTED PERSON PHOTO
  // =====================================================

  const selectedImage =
    selectedPerson?.profile_photo_url ||
    selectedPerson?.profilePhoto ||
    selectedPerson?.profile_photo ||
    selectedPerson?.photo_url ||
    selectedPerson?.photoURL ||
    selectedPerson?.image ||
    "";


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser) {

    return (
      <div className="chat-page">

        <div className="chat-empty-state">

          <div className="empty-state-icon">
            ❤️
          </div>

          <h2>
            {t("please LogIn")}
          </h2>

          <p>
            {t("loginToChat")} with
            your UMUHUZA Messages.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            {t("goToLogin")}
          </button>

        </div>

      </div>
    );

  }


  // =====================================================
  // LOADING CONNECTIONS
  // =====================================================

  if (loadingConnections) {

    return (
      <div className="chat-page">

        <div className="chat-empty-state">

          <div className="empty-state-icon">
            💕
          </div>

          <h2>
            {t("loading Chats")}
          </h2>

          <p>
            {t("please Wait message")}
          </p>

        </div>

      </div>
    );

  }


  // =====================================================
  // NO MEMBERS
  // =====================================================

  if (
    connections.length === 0
  ) {

    return (
      <div className="chat-page">

        <header className="chat-topbar">

          <button
            type="button"
            className="chat-back-btn"
            onClick={() =>
              navigate(
                "/member-home"
              )
            }
          >

            <FiArrowLeft />

            <span>
              {t("back")}
            </span>

          </button>


          <div className="chat-logo">

            <div className="profile-logo">

              <img
                src={umurangaLogo}
                alt="UMUHUZA.COM"
              />

            </div>

          </div>

        </header>


        <div className="chat-empty-state">

          <div className="empty-state-icon">
            💕
          </div>

<h2>{t("noMembers") || "No members available"}</h2>

<p>{t("noMembersDesc") || "There are currently no other UMUHUZA members."}</p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/member-home"
              )
            }
          >
  {t("home.discoverPeople") || "Discover People"}
</button>

        </div>

      </div>
    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="chat-page">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="chat-topbar">

        <button
          type="button"
          className="chat-back-btn"
          onClick={() =>
            navigate(
              "/member-home"
            )
          }
        >

          <FiArrowLeft />

<span>{t("back") || "Back"}</span>

        </button>


        <div className="chat-logo">

          <div className="profile-logo">

            <img
              src={umurangaLogo}
              alt="UMUHUZA.COM"
            />

          </div>

        </div>

      </header>


      {/* =================================================
          CHAT CONTAINER
      ================================================= */}

      <main className="chat-container">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="chat-sidebar">

          <div className="chat-sidebar-header">

            <div>

<h2>{t("nav.messages") || "Messages"}</h2>

              <p>
                {t("chat.peopleYouCanMessage") || "People you can message"}
              </p>

            </div>


            <span className="chat-count">

              {connections.length}

            </span>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="chat-search">

            <FiSearch />

            <input
              type="text"
   placeholder={t("chat.searchConversations") || "Search conversations..."}
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          {/* =================================================
              PEOPLE
          ================================================= */}

          <div className="chat-people-list">

            {filteredPeople.length === 0 ? (

              <div className="no-chat-results">

                <span>
                  🔍
                </span>

{t("chat.noConversationsFound") || "No conversations found"}

              </div>

            ) : (

              filteredPeople.map(
                (person) => {

                  const personName =
                    person.full_name ||
                    [
                      person.firstName ||
                        person.first_name,

                      person.lastName ||
                        person.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    person.name ||
                    "UMUHUZA Member";


                  const personImage =
                    person.profile_photo_url ||
                    person.profilePhoto ||
                    person.profile_photo ||
                    person.photo_url ||
                    person.photoURL ||
                    person.image ||
                    "";


                  const lastSeen =
                    person.last_seen ||
                    person.lastSeen ||
                    null;


                  return (

                    <button
                      type="button"
                      key={person.id}
                      className={`chat-person ${
                        selectedPerson?.id ===
                        person.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectPerson(
                          person
                        )
                      }
                    >

                      <div className="chat-person-avatar">

                        {personImage ? (

                          <img
                            src={personImage}
                            alt={personName}
                          />

                        ) : (

                          <FiUser />

                        )}


                        {person.online && (

                          <span
                            className="online-dot"
                          />

                        )}

                      </div>


                      <div className="chat-person-info">

                        <div className="chat-person-name">

                          <strong>
                            {personName}
                          </strong>


                          {person.verified && (

                            <FiCheckCircle
                              className="verified-icon"
                            />

                          )}

                        </div>


                        <p>

{person.online
  ? `🟢 ${t("chat.onlineNow") || "Online now"}`
  : formatLastSeen(lastSeen)}

                        </p>

                      </div>

                    </button>

                  );

                }
              )

            )}

          </div>

        </aside>


        {/* =================================================
            CONVERSATION
        ================================================= */}

        {selectedPerson ? (

          <section className="chat-conversation">


            {/* =================================================
                CONVERSATION HEADER
            ================================================= */}

            <div className="conversation-header">

              <div className="conversation-person">

                <div className="conversation-avatar">

                  {selectedImage ? (

                    <img
                      src={selectedImage}
                      alt={selectedName}
                    />

                  ) : (

                    <FiUser />

                  )}


                  {selectedPerson.online && (

                    <span
                      className="online-dot"
                    />

                  )}

                </div>


                <div>

                  <div className="conversation-name">

                    <h2>
                      {selectedName}
                    </h2>


                    {selectedPerson.verified && (

                      <FiCheckCircle
                        className="verified-icon"
                      />

                    )}

                  </div>


                  <p>

                    {selectedPerson.online
                      ? `🟢 ${t(
                          "onlineNow"
                        )}`
                      : formatLastSeen(
                          selectedPerson.last_seen ||
                          selectedPerson.lastSeen
                        )}

                  </p>

                </div>

              </div>


              <div className="conversation-actions">

                <button
                  type="button"
                  title="Voice Call"
                >
                  <FiPhone />
                </button>


                <button
                  type="button"
                  title="More"
                >
                  <FiMoreVertical />
                </button>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="chat-error">

                {error}

              </div>

            )}


            {/* =================================================
                MESSAGES BODY
            ================================================= */}

            <div className="conversation-body">

              <div className="messages-list">


                {loadingMessages ? (

                  <div className="empty-conversation">

                    <div>
                      💕
                    </div>

                    <p>
                      <p>{t("chat.pleaseWait") || "Please wait..."}</p>
                    </p>

                  </div>

                ) : messages.length === 0 ? (

                  <div className="empty-conversation">

                    <div>
                      💕
                    </div>

<p>
  {t("chat.startConversation") || "Start your conversation with"}{" "}
  {selectedName}.
</p>

                  </div>

                ) : (

                  messages.map(
                    (chatMessage) => {

                      // --------------------------------------
                      // SAFETY: don't render expired image
                      // --------------------------------------

                      if (
                        isExpiredImageMessage(
                          chatMessage
                        )
                      ) {
                        return null;
                      }


                      const isMine =
                        chatMessage.sender_id ===
                        currentUser.id;


                      const messageType =
                        chatMessage.message_type ||
                        "text";


                      const messageContent =
                        chatMessage.content ||
                        "";


                      const messageCreatedAt =
                        chatMessage.created_at;


                      // IMPORTANT:
                      // Prefer image_url.
                      // If unavailable, use content.

                      const imageUrl =
                        chatMessage.image_url ||
                        chatMessage.content ||
                        "";


                      const isImageMessage =
                        messageType ===
                        "image";


                      return (

                        <div
                          key={
                            chatMessage.id
                          }
                          className={`message-row ${
                            isMine
                              ? "my-message"
                              : "their-message"
                          }`}
                        >


                          {/* ----------------------------------
                              RECEIVER AVATAR
                          ---------------------------------- */}

                          {!isMine && (

                            selectedImage ? (

                              <img
                                src={
                                  selectedImage
                                }
                                alt={
                                  selectedName
                                }
                                className="message-avatar"
                              />

                            ) : (

                              <div className="message-avatar">

                                <FiUser />

                              </div>

                            )

                          )}


                          {/* ----------------------------------
                              IMAGE MESSAGE
                          ---------------------------------- */}

                          {isImageMessage ? (

                            <div
                              className="message-bubble image-message"
                            >

                              {imageUrl ? (

                                <a
                                  href={
                                    imageUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="chat-image-link"
                                  title="Open image"
                                >

                                  <img
                                    src={
                                      imageUrl
                                    }
                                    alt="Chat image"
                                    className="chat-sent-image"
                                    loading="lazy"
                                    onError={(event) => {

                                      console.error(
                                        "Unable to display chat image:",
                                        imageUrl
                                      );

                                      // Don't keep showing
                                      // a broken-image icon.

                                      event.currentTarget.style.display =
                                        "none";

                                      const parent =
                                        event.currentTarget.parentElement;

                                      if (
                                        parent &&
                                        !parent.querySelector(
                                          ".chat-image-error"
                                        )
                                      ) {

                                        const errorElement =
                                          document.createElement(
                                            "div"
                                          );

                                        errorElement.className =
                                          "chat-image-error";

                                        errorElement.textContent =
                                          "Image unavailable";

                                        parent.appendChild(
                                          errorElement
                                        );

                                      }

                                    }}
                                  />

                                </a>

                              ) : (

                                <div className="chat-image-error">

                                  Image unavailable

                                </div>

                              )}

                            </div>

                          ) : (

                            /* --------------------------------
                               NORMAL TEXT MESSAGE
                            -------------------------------- */

                            <div
                              className={`message-bubble ${
                                messageContent ===
                                "❤️"
                                  ? "love-message"
                                  : ""
                              }`}
                            >

                              {messageContent}

                            </div>

                          )}


                          {/* ----------------------------------
                              TIME
                          ---------------------------------- */}

                          <span className="message-time">

                            {formatMessageTime(
                              messageCreatedAt
                            )}


      {isMine && (

  <span
    className={`message-status ${
      chatMessage.send_status === "failed"
        ? "message-send-failed"
        : chatMessage.send_status === "sending"
        ? "message-send-pending"
        : "message-send-success"
    }`}
    title={
      chatMessage.send_status === "failed"
        ? "Message not sent"
        : chatMessage.send_status === "sending"
        ? "Sending..."
        : "Sent successfully"
    }
  >

    {chatMessage.send_status === "failed"
      ? "✕"
      : chatMessage.send_status === "sending"
      ? "…"
      : "✓"}

  </span>

)}

                          </span>

                        </div>

                      );

                    }
                  )

                )}

              </div>

            </div>


            {/* =================================================
                MESSAGE INPUT AREA
                =================================================
                
                IMPORTANT:
                Selected images are now HERE,
                at the bottom of the chat.
            ================================================= */}

            <div className="message-input-area">


              {/* =================================================
                  SELECTED IMAGE PREVIEW
              ================================================= */}

              {selectedImages.length > 0 && (

                <div className="selected-images-preview">

                  {selectedImages.map((image) => (

                    <div
                      className="selected-image-preview"
                      key={image.id}
                    >

                      <img
                        src={image.preview}
                        alt={image.file?.name || "Selected image"}
                      />

                      <button
                        type="button"
                        className="remove-selected-image"
                        onClick={() =>
                          removeSelectedImage(image.id)
                        }
                        disabled={sending || uploadingImages}
                        title="Remove image"
                      >
                        <FiX />
                      </button>

                      <span>
                        {Math.round(
                          (image.file?.size || 0) / 1024
                        )}{" "}
                        KB
                      </span>

                    </div>

                  ))}

                  <button
                    type="button"
                    className="send-selected-images-btn"
                    onClick={handleSendImages}
                    disabled={
                      sending ||
                      uploadingImages ||
                      selectedImages.length === 0
                    }
                  >
                    {uploadingImages
                      ? "Sending images..."
                      : `Send ${selectedImages.length} ${
                          selectedImages.length === 1
                            ? "image"
                            : "images"
                        }`}
                  </button>

                </div>

              )}


              {/* =================================================
                  HIDDEN IMAGE INPUT
              ================================================= */}

              <input
                ref={
                  imageInputRef
                }
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageSelection
                }
                style={{
                  display: "none",
                }}
              />


              {/* =================================================
                  SEND IMAGE
              ================================================= */}

              <button
                type="button"
                className="message-tool-btn"
                title="Send Images"
                onClick={
                  openImagePicker
                }
                disabled={
                  sending ||
                  uploadingImages
                }
              >

                <FiImage />

              </button>


              {/* =================================================
                  SEND LOVE
              ================================================= */}

              <button
                type="button"
                className="message-tool-btn"
                title="Send Love"
                onClick={
                  handleSendLove
                }
                disabled={
                  sending ||
                  uploadingImages
                }
              >

                <FiHeart />

              </button>


              {/* =================================================
                  MESSAGE INPUT
              ================================================= */}

              <div className="message-input-wrapper">

                <input
                  type="text"
                  placeholder={`Message ${selectedName}...`}
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  disabled={
                    sending ||
                    uploadingImages
                  }
                />

              </div>


              {/* =================================================
                  SEND MESSAGE
              ================================================= */}

              <button
                type="button"
                className="send-message-btn"
                onClick={
                  handleSendMessage
                }
                disabled={
                  !message.trim() ||
                  sending ||
                  uploadingImages
                }
              >

                <FiSend />

              </button>

            </div>

          </section>

        ) : (

          <section className="chat-conversation">

            <div className="empty-conversation">

              <div>
                💕
              </div>

              <h2>
                {t("messages")}
              </h2>
<p>
  {t("chat.selectPerson") || "Select a person to start chatting."}
</p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


export default Chat;
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

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
// TRANSLATIONS
// =====================================================

const translations = {
  // ===================================================
  // ENGLISH
  // ===================================================

  en: {
    // ==============================
    // COMMON
    // ==============================

    "common.backToProfile": "Back to Profile",
    "common.meaningfulConnections":
      "Meaningful connections. Genuine people.",
    "common.save": "Save",
    "common.saving": "Saving...",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.back": "Back",

    // ==============================
    // NAVBAR
    // ==============================

    "nav.messages": "Messages",
    "nav.connections": "Connections",
    "nav.notifications": "Notifications",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "My Profile",
    "nav.inviteFriends": "Invite Friends",
    "nav.accountSettings": "Account Settings",
    "nav.aboutUs": "About Us",

    // ==============================
    // MEMBER HOME
    // ==============================

    "home.welcome": "WELCOME TO UMUHUZA",
    "home.discoverTitle": "Discover Someone",
    "home.discoverSubtitle": "special today",
    "home.discoverDescription":
      "Meet genuine people looking for meaningful relationships, friendship and love.",
    "home.searchPlaceholder": "Search members...",
    "home.discoverPeople": "Discover People",
    "home.meaningfulConnection":
      "Find people who could be a meaningful connection.",
    "home.near": "Near",
    "home.viewProfile": "View Profile",
    "home.like": "Like",
    "home.liked": "Liked",
    "home.sendInterest": "Send Interest",
    "home.interestSent": "Interest Sent",
    "home.connected": "Connected",
    "home.startChat": "Start Chat",
    "home.noMembers": "No matching members yet",
    "home.tryAnother":
      "We're still growing the UMUHUZA community. Try another category.",

    // ==============================
    // CATEGORIES
    // ==============================

    "category.recommended": "Recommended",
    "category.online": "Online",
    "category.diaspora": "Diaspora",
    "category.new": "New",
    "category.verified": "Verified",
    "category.nearby": "Nearby",


    // NOTIFICATIONS
"notifications.loginRequired":
  "Please log in",

"notifications.loginToView":
  "Log in to view your notifications.",

"notifications.goToLogin":
  "Go to Login",

"notifications.back":
  "Back",

"notifications.title":
  "Notifications",

"notifications.activity":
  "YOUR ACTIVITY",

"notifications.heading":
  "Notifications",

"notifications.stayUpdated":
  "Stay updated with your activity.",

"notifications.markAllRead":
  "Mark all read",

"notifications.unread":
  "Unread",

"notifications.loading":
  "Loading notifications...",

"notifications.pleaseWait":
  "Please wait.",

"notifications.emptyTitle":
  "No notifications yet",

"notifications.emptyMessage":
  "When someone interacts with you, you'll see the notification here.",

"notifications.discoverPeople":
  "Discover People",

"notifications.accepting":
  "Accepting...",

"notifications.accept":
  "ACCEPT",

"notifications.startChat":
  "Start Chat",

"notifications.member":
  "UMUHUZA Member",

"notifications.unableToLoad":
  "Unable to load your notifications.",

"notifications.markAllFailed":
  "Unable to mark all notifications as read.",

"notifications.identifyMember":
  "Unable to identify this member.",

"notifications.identifySender":
  "Unable to identify the sender of this message.",

"notifications.acceptFailed":
  "Unable to accept this interest. Please try again.",

"notifications.interestAccepted":
  "Interest accepted ❤️",

"notifications.interestAcceptedMessage":
  "{name} accepted your interest ❤️",

"notifications.newInterest":
  "{name} would like to get to know you. ❤️",

"notifications.acceptedInterest":
  "{name} accepted your interest. ❤️",

"notifications.newMessage":
  "You have a new message.",

"notifications.likedYou":
  "{name} liked you. ❤️",

"notifications.newNotification":
  "You have a new notification.",


  "memberProfile.loading": "Loading profile...",
"memberProfile.notFound": "Member profile not found",
"memberProfile.notFoundDescription":
  "We couldn't find this member's profile. Please return to discovery and try again.",
"memberProfile.loadError": "Unable to load this member's profile",
"memberProfile.backToMembers": "Back to Members",
"memberProfile.backToDiscovery": "Back to Discovery",
"memberProfile.onlineNow": "Online Now",
"memberProfile.verified": "Verified",
"memberProfile.lookingFor": "Looking for",
"memberProfile.liked": "Liked",
"memberProfile.like": "Like",
"memberProfile.sending": "Sending...",
"memberProfile.interestSent": "Interest Sent",
"memberProfile.sendInterest": "Send Interest",
"memberProfile.startChat": "Start Chat",
"memberProfile.chatInterestNotice":
  "Both people must show interest before chat becomes available.",
"memberProfile.about": "About",
"memberProfile.defaultAbout":
  "Ndi umuntu ugwaneza, ubona ibintu mu mucyo kandi utaryarya, ushaka umubano ufite icyo uvuze. Nkunda kumarana igihe n'abantu beza, kuvumbura ibintu bishya, no kubaka umubano ushingiye ku bunyangamugayo no kubahana.",
"memberProfile.interests": "Interests",
"memberProfile.music": "Music",
"memberProfile.travel": "Travel",
"memberProfile.cooking": "Cooking",
"memberProfile.movies": "Movies",
"memberProfile.nature": "Nature",
"memberProfile.whatLookingFor": "What",
"memberProfile.meaningfulConnection": "Meaningful connection",
"memberProfile.lookingForDescription":
  "Looking for someone genuine, respectful and ready to build something meaningful together.",
"memberProfile.staySafe": "Stay Safe on UMUHUZA",
"memberProfile.lookingForTitle": "What They're Looking For",
"memberProfile.safetyDescription":
  "Take your time getting to know someone before sharing personal information.",

  // PREMIUM

  "premium.back": "Back",
"premium.loading": "Loading...",
"premium.title": "💎 UMUHUZA Premium",
"premium.subtitle": "Unlock more conversations with real people",

"premium.currentStatus": "Your Current Status",
"premium.freeChatsRemaining": "Free chats remaining",
"premium.extraChatCredits": "Extra chat credits",
"premium.premiumStatus": "Premium status",
"premium.active": "Active",
"premium.notActive": "Not Active",

"premium.popular": "Popular",
"premium.chatPack": "Chat Pack",
"premium.chatPackDescription": "Unlock 5 more people to chat with",
"premium.newChatSlots": "+5 new chat slots",
"premium.neverExpires": "Never expires",
"premium.instantActivation": "Instant activation after payment",
"premium.buyChatPack": "Buy Chat Pack",

"premium.bestValue": "Best Value",
"premium.monthlyUnlimited": "Monthly Unlimited",
"premium.monthlyDescription": "Chat with unlimited people for 30 days",
"premium.unlimitedNewChats": "Unlimited new chats",
"premium.valid30Days": "Valid for 30 days",
"premium.prioritySupport": "Priority support",
"premium.upgradePremium": "Upgrade to Premium",

"premium.referralRewards": "Referral Rewards",
"premium.referralDescription": "Invite friends and unlock free chats",
"premium.invite5Friends": "Invite 5 friends",
"premium.invite10Friends": "Invite 10 friends",
"premium.invite15Friends": "Invite 15 friends",
"premium.freeChats2": "+2 free chats",
"premium.freeChats10": "+10 free chats",
"premium.oneMonthUnlimited": "1 Month Unlimited",
"premium.goToReferral": "Go to Referral Program",

"premium.noteExisting": "Note: Existing conversations are never restricted.",
"premium.noteNew": "Only starting chats with new people is limited.",

"premium.choosePayment": "Choose your preferred payment method",
"premium.mobileMoney": "📱 Mobile Money",
"premium.dialCode": "Dial this code:",
"premium.sendMoney": "Or send money to:",
"premium.registeredTo": "Registered to: Vincent",

"premium.cryptoPayment": "💎 Crypto Payment",
"premium.copyAddress": "Copy Address",

"premium.afterPayment": "After payment, click the button below.",
"premium.activationConfirmation": "We will activate your plan after confirmation.",
"premium.submitting": "Submitting...",
"premium.iHavePaid": "I Have Paid",

"premium.chatPackPlan": "Chat Pack - 200 RWF",
"premium.monthlyPlan": "Monthly Premium - 500 RWF",

"premium.paymentSubmitted": "✅ Payment submitted successfully!\n\nIt will take less than 10 minutes to confirm your payment.",
"premium.submitError": "Unable to submit payment request. Please try again.",
"premium.paymentError": "Error: {message}",

"premium.interestPackPurpose": "5 extra chats",
"premium.monthlyPurpose": "Monthly unlimited chat",

    // ===================================================
// CONNECTIONS / INTERESTS
// ===================================================

"connections.pleaseLogin": "Please log in",
"connections.loginToView": "Please log in to view your connections and interests.",
"connections.loading": "Loading Your Connections",
"connections.preparing": "Preparing your connections and interests...",
"connections.title": "Connections & Interests",
"connections.label": "UMUHUZA Connections",
"connections.heading": "People You Are Connected With",
"connections.description":
  "Manage your connections and respond to people who are interested in connecting with you.",
"connections.total": "Connections",
"connections.yourConnections": "Your Connections",
"connections.peopleConnected":
  "People you are connected with",
"connections.loadingConnections":
  "Loading connections...",
"connections.noConnections": "No Connections Yet",
"connections.newConnection":
  "Your new connections will appear here.",
"connections.pendingInterests": "Pending Interests",
"connections.waitingResponse":
  "People waiting for your response",
"connections.allCaughtUp": "All Caught Up!",
"connections.noPendingInterests":
  "You don't have any pending interests right now.",
"connections.lookingFor": "Looking for",
"connections.startChat": "Start Chat",
"connections.sent": "Sent",
"connections.accept": "Accept",
"connections.decline": "Decline",
"connections.wouldLikeToKnow":
  "{name} would like to connect with you.",
"connections.lookingForMore": "Looking for more people?",
"connections.discoverMore":
  "Discover more UMUHUZA members and find meaningful connections.",
"connections.discoverPeople":
  "Discover People",

// ===================================================
// EMAIL VERIFICATION
// ===================================================

"verification.close": "Close",
"verification.title": "Verify Your Email",
"verification.lead":
  "Before you can send an interest, you need to verify your email address.",
"verification.help":
  "We need a verified email to help keep UMUHUZA safe and authentic.",
"verification.sendEmail":
  "Send Verification Email",
"verification.check":
  "I Have Verified My Email",
"verification.pleaseWait":
  "Please wait...",
"verification.loginAgain":
  "Please log in again.",
"verification.emailSent":
  "Verification email sent successfully.",
"verification.sendFailed":
  "Unable to send verification email.",
"verification.success":
  "Email verified successfully.",
"verification.notVerified":
  "Email is not verified yet.",
"verification.checkFailed":
  "Unable to check verification status.",

    // ==============================
    // CHAT / MESSAGES
    // ==============================

    "chat.pleaseLogin": "Please log in",
    "chat.loginToChat":
      "Login to chat with your UMUHUZA Messages.",
    "chat.goToLogin": "Go to Login",
    "chat.loadingChats": "Loading Chats",
    "chat.pleaseWait": "Please wait...",
    "chat.noMembers": "No members available",
    "chat.noMembersDesc":
      "There are currently no other UMUHUZA members.",
    "chat.peopleYouCanMessage":
      "People you can message",
    "chat.searchConversations":
      "Search conversations...",
    "chat.noConversationsFound":
      "No conversations found",
    "chat.onlineNow": "Online now",
    "chat.startConversation":
      "Start your conversation with",
    "chat.selectPerson":
      "Select a person to start chatting.",
    "chat.messagePlaceholder": "Message",
    "chat.sendingImages": "Sending images...",
    "chat.image": "image",
    "chat.images": "images",
    "chat.loadingMessages":
      "Loading messages...",
     // ===================== SIGNUP =====================
"signup.title": "Create Your Account",
"signup.subtitle": "Let's start with the basics.",
"signup.firstName": "First Name",
"signup.firstNamePlaceholder": "Enter your first name",
"signup.lastName": "Last Name",
"signup.lastNamePlaceholder": "Enter your last name",
"signup.email": "Email Address",
"signup.emailPlaceholder": "Enter your email",
"signup.emailHelp": "You can verify your email after creating your account.",
"signup.password": "Create Password",
"signup.passwordPlaceholder": "Create a password",
"signup.passwordHelp": "Use at least 8 characters.",
"signup.dateOfBirth": "Date of Birth",
"signup.ageHelp": "Your age is calculated automatically.",
"signup.youAre": "You are",
"signup.yearsOld": "years old.",
"signup.gender": "Gender",
"signup.selectGender": "Select your gender",
"signup.male": "Male",
"signup.female": "Female",
"signup.whereLive": "Where do you live?",
"signup.selectCountry": "Select your country",
"signup.rwanda": "Rwanda",
"signup.burundi": "Burundi",
"signup.otherCountry": "Other Country",
"signup.district": "District",
"signup.province": "Province",
"signup.countryOfResidence": "Country of Residence",
"signup.location": "Location",
"signup.selectCountryFirst": "Select country first",
"signup.selectDistrict": "Select your district",
"signup.selectProvince": "Select your province",
"signup.selectYourCountry": "Select your country",
"signup.phone": "Phone Number",
"signup.phonePlaceholder": "Enter your phone number",
"signup.phoneHelp": "Your phone number helps keep your UMUHUZA account secure.",
"signup.referralCode": "Referral Code",
"signup.referralPlaceholder": "Enter referral code",
"signup.referralHelp": "If a UMUHUZA member invited you, enter their referral code.",
"signup.terms": "I agree to the UMUHUZA Terms & Privacy Policy",
"signup.continue": "Continue",
"signup.creating": "Creating Account...",
"signup.alreadyMember": "Already a member?",
"signup.login": "Login",
"signup.heroTitle": "Start Your Love Journey",
"signup.heroSubtitle": "Join genuine people looking for meaningful connections.",

// ===================== ABOUT YOU =====================
"aboutYou.title": "About You",
"aboutYou.subtitle": "Choose the options that describe you.",
"aboutYou.heroTitle": "Tell Us About You",
"aboutYou.heroSubtitle": "Help us understand what you are looking for so UMUHUZA can help you discover meaningful connections.",
"aboutYou.personalStatus": "Personal Status",
"aboutYou.lookingFor": "Looking For",
"aboutYou.relationshipGoal": "Relationship Goal",
"aboutYou.continue": "Continue",
"aboutYou.saving": "Saving...",

// ===================== PROFILE SETUP =====================
"profileSetup.title": "Build Your Profile",
"profileSetup.subtitle": "Add your real photo and choose your interests.",
"profileSetup.heroTitle": "Create Your UMUHUZA Profile",
"profileSetup.heroSubtitle": "Show the real you and let genuine people discover you.",
"profileSetup.mainPhoto": "Main Profile Photo",
"profileSetup.mainPhotoRequired": "Your main photo is required and will be shown on your UMUHUZA profile.",
"profileSetup.takePhoto": "Take Photo",
"profileSetup.retakePhoto": "Retake Photo",
"profileSetup.chooseGallery": "Choose from Gallery",
"profileSetup.changePhoto": "Change Photo",
"profileSetup.interests": "Your Interests",
"profileSetup.interestsHelp": "Choose the interests that describe you.",
"profileSetup.finish": "Finish Profile ❤️",
"profileSetup.saving": "Saving Profile...",
"profileSetup.realPhotoPolicy": "Real Profile Policy",
"profileSetup.realPhotoText": "Use your real photo. UMUHUZA is for real people seeking real love and connections.", 
"interest.love": "❤️ Love",
"interest.music": "🎵 Music",
"interest.travel": "✈️ Travel",
"interest.sports": "⚽ Sports",
"interest.reading": "📚 Reading",
"interest.movies": "🎬 Movies",
"interest.cooking": "🍳 Cooking",
"interest.nature": "🌿 Nature",
"interest.dancing": "💃 Dancing",
"interest.fitness": "🏋️ Fitness",
"interest.faith": "🙏 Faith",
"interest.art": "🎨 Art",
// Steps
"signup.stepAccount": "Account",
"signup.stepAbout": "About You",
"signup.stepProfile": "Profile",

// About You
"aboutYou.selectStatus": "Select your personal status",
"aboutYou.selectLookingFor": "Choose who you want to meet",
"aboutYou.selectGoal": "Choose your relationship goal",
"aboutYou.lookingHelp": "UMUHUZA will use this to help recommend compatible people.",
"aboutYou.goalHelp": "Choose what you genuinely hope to find on UMUHUZA.",
"aboutYou.personalStatus": "Personal Status",
"aboutYou.lookingFor": "Who are you looking for?",
"aboutYou.relationshipGoal": "Relationship Goal",

// Status
"status.single": "Single",
"status.divorced": "Divorced",
"status.widowed": "Widowed",
"status.separated": "Separated",

// Looking For
"looking.men": "👨 Men",
"looking.women": "👩 Women",
"looking.both": "👨 Men & 👩 Women",

// Goals
"goal.marriage": "💍 Marriage",
"goal.serious": "❤️ Serious Relationship",
"goal.friendship": "🤝 Friendship",
"goal.gettingToKnow": "💕 Getting to Know Someone",
"profileSetup.compressNote": " .",
"profileSetup.errorMainPhoto": "Please upload your main profile photo. A real profile photo is required to join UMUHUZA.",
"profileSetup.errorInterests": "Please select at least one interest.",
"profileSetup.errorCamera": "Unable to take a photo. Please check your camera permission.",
"profileSetup.errorInvalidImage": "Please select a valid image.",
"profileSetup.errorImageTooLarge": "This image is too large. Please choose an image smaller than 20 MB.",
"profileSetup.errorCompress": "The image could not be compressed below 250 KB. Please choose another photo.",
"profileSetup.errorSession": "Your account session has expired. Please log in again.",
"profileSetup.errorGeneric": "We couldn't save your profile. Please try again.",
"profileSetup.saving": "Saving Profile...",
"profileSetup.finish": "Finish Profile ❤️",
"profileSetup.retakePhoto": "Retake Photo",
"profileSetup.takePhoto": "Take Photo",
"profileSetup.changePhoto": "Change Photo",
"profileSetup.chooseGallery": "Choose from Gallery",
"profileSetup.realPhotoPolicy": "Real Profile Policy",
"profileSetup.realPhotoText": "Use your real photo.",
"profileSetup.realPhotoDesc": "UMUHUZA is for real people seeking real love and connections. Fake or misleading profile photos are not allowed.",
  },

  // ===================================================
  // KINYARWANDA
  // ===================================================

  rw: {
    // ==============================
    // COMMON
    // ==============================

    "common.backToProfile": "Subira kuri Profile",
    "common.meaningfulConnections":
      "Ubushuti bw'ukuri. Abantu b'ukuri.",
    "common.save": "Bika",
    "common.saving": "Birimo kubikwa...",
    "common.loading": "Birimo gupakira...",
    "common.error": "Hari ikibazo cyabaye",
    "common.back": "Subira",

    // ==============================
    // NAVBAR
    // ==============================

    "nav.messages": "Ubutumwa",
    "nav.connections": "Abo mwahuje",
    "nav.notifications": "Amakuru",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "Profile Yanjye",
    "nav.inviteFriends": "Tumira Inshuti",
    "nav.accountSettings": "Igenamiterere",
    "nav.aboutUs": "Abo turi bo",

    // ==============================
    // MEMBER HOME
    // ==============================

    "home.welcome": "MURAKAZA NEZA KURI UMUHUZA",
    "home.discoverTitle": "Shaka Umuntu",
    "home.discoverSubtitle": "wihariye uyu munsi",
    "home.discoverDescription":
      "Hura n'abantu b'ukuri bashaka ubucuti, umubano n'urukundo.",
    "home.searchPlaceholder": "Shaka abantu...",
    "home.discoverPeople": "Shakisha Abantu",
    "home.meaningfulConnection":
      "Shaka abantu bashobora kuba abo mwahuje.",
    "home.near": "Hafi ya",
    "home.viewProfile": "Reba Profile",
    "home.like": "Kunda",
    "home.liked": "Wakunze",
    "home.sendInterest": "Ohereza Ubushake",
    "home.interestSent": "Ubushake Bwoherejwe",
    "home.connected": "Mwahuje",
    "home.startChat": "Tangira Ikiganiro",
    "home.noMembers":
      "Nta muntu uhuye n'ibyo ushaka",
    "home.tryAnother":
      "Turacyakura umuryango wa UMUHUZA. Gerageza indi kategori.",

    // ==============================
    // CATEGORIES
    // ==============================

    "category.recommended": "Byasabwe",
    "category.online": "Kuri interineti",
    "category.diaspora": "Diaspora",
    "category.new": "Bashya",
    "category.verified": "Byemejwe",
    "category.nearby": "Hafi",

    // ==============================
    // PREMIUM
    // ==============================

"premium.back": "Subira inyuma",
"premium.loading": "Birimo gutegurwa...",
"premium.title": "💎 UMUHUZA Premium",
"premium.subtitle": "Fungura ibiganiro byinshi n’abantu nyabo",
"premium.currentStatus": "Imiterere Yawe Y’ubu",
"premium.freeChatsRemaining": "Ibiganiro by’ubuntu bisigaye",
"premium.extraChatCredits": "Inguzanyo z’inyongera z’ibiganiro",
"premium.premiumStatus": "Imiterere ya Premium",
"premium.active": "Irakora",
"premium.notActive": "Ntabwo ikora",
"premium.popular": "Iikunzwe",
"premium.chatPack": "Porogaramu y’Ibiganiro",
"premium.chatPackDescription": "Fungura abandi bantu 5 ushobora kuganira na bo",
"premium.newChatSlots": "+5 myanya mishya y’ibiganiro",
"premium.neverExpires": "Ntijya irangira",
"premium.instantActivation": "Ikora ako kanya nyuma yo kwishyura",
"premium.buyChatPack": "Gura Porogaramu y’Ibiganiro",
"premium.bestValue": "Agaciro Keza",
"premium.monthlyUnlimited": "Ibiganiro Bitagira Umupaka Bya Buri Kwezi",
"premium.monthlyDescription": "Ganira n’abantu batagira umupaka mu minsi 30",
"premium.unlimitedNewChats": "Ibiganiro bishya bitagira umupaka",
"premium.valid30Days": "Bimara iminsi 30",
"premium.prioritySupport": "Ubufasha bw’ibanze",
"premium.upgradePremium": "Kuzamura kuri Premium",
"premium.referralRewards": "Ibihembo byo Gutumira Inshuti",
"premium.referralDescription": "Tumira inshuti ubone ibiganiro by’ubuntu",
"premium.invite5Friends": "Tumira inshuti 5",
"premium.invite10Friends": "Tumira inshuti 10",
"premium.invite15Friends": "Tumira inshuti 15",
"premium.freeChats2": "+2 biganiro by’ubuntu",
"premium.freeChats10": "+10 biganiro by’ubuntu",
"premium.oneMonthUnlimited": "Ukwezi 1 kw’Ibiganiro Bitagira Umupaka",
"premium.goToReferral": "Jya kuri Porogaramu yo Gutumira",
"premium.noteExisting": "Icyitonderwa: Ibiganiro usanzwe ufite ntibijya bibuzwa.",
"premium.noteNew": "Gutangiza ibiganiro n’abantu bashya ni byo byonyine bigira imipaka.",
"premium.choosePayment": "Hitamo uburyo ukunda bwo kwishyura",
"premium.mobileMoney": "📱 Mobile Money",
"premium.dialCode": "Hamagara iyi kode:",
"premium.sendMoney": "Cyangwa wohereze amafaranga kuri:",
"premium.registeredTo": "Yanditswe kuri: Vincent",
"premium.cryptoPayment": "💎 Kwishyura hakoreshejwe Crypto",
"premium.copyAddress": "Koporora Aderesi",
"premium.afterPayment": "Nyuma yo kwishyura, kanda buto iri hano hepfo.",
"premium.activationConfirmation": "Tuzakora plan yawe nyuma yo kwemeza ubwishyu.",
"premium.submitting": "Birimo koherezwa...",
"premium.iHavePaid": "Nishyuye",
"premium.chatPackPlan": "Porogaramu y’Ibiganiro - 200 RWF",
"premium.monthlyPlan": "Premium ya Buri Kwezi - 500 RWF",
"premium.paymentSubmitted": "✅ Ubwishyu bwoherejwe neza!\n\nBizatwara iminota itarenze 10 kwemeza ubwishyu bwawe.",
"premium.submitError": "Ntibyashobotse kohereza ubusabe bwo kwishyura. Ongera ugerageze.",
"premium.paymentError": "Ikosa: {message}",
"premium.interestPackPurpose": "Ibiganiro 5 by’inyongera",
"premium.monthlyPurpose": "Ibiganiro bitagira umupaka bya buri kwezi",

      // NOTIFICATIONS
"notifications.loginRequired":
  "Please log in",

"notifications.loginToView":
  "Log in to view your notifications.",

"notifications.goToLogin":
  "Go to Login",

"notifications.back":
  "Back",

"notifications.title":
  "Notifications",

"notifications.activity":
  "YOUR ACTIVITY",

"notifications.heading":
  "Notifications",

"notifications.stayUpdated":
  "Stay updated with your activity.",

"notifications.markAllRead":
  "Mark all read",

"notifications.unread":
  "Unread",

"notifications.loading":
  "Loading notifications...",

"notifications.pleaseWait":
  "Please wait.",

"notifications.emptyTitle":
  "No notifications yet",

"notifications.emptyMessage":
  "When someone interacts with you, you'll see the notification here.",

"notifications.discoverPeople":
  "Discover People",

"notifications.accepting":
  "Accepting...",

"notifications.accept":
  "ACCEPT",

"notifications.startChat":
  "Start Chat",

"notifications.member":
  "UMUHUZA Member",

"notifications.unableToLoad":
  "Unable to load your notifications.",

"notifications.markAllFailed":
  "Unable to mark all notifications as read.",

"notifications.identifyMember":
  "Unable to identify this member.",

"notifications.identifySender":
  "Unable to identify the sender of this message.",

"notifications.acceptFailed":
  "Unable to accept this interest. Please try again.",

"notifications.interestAccepted":
  "Interest accepted ❤️",

"notifications.interestAcceptedMessage":
  "{name} accepted your interest ❤️",

"notifications.newInterest":
  "{name} would like to get to know you. ❤️",

"notifications.acceptedInterest":
  "{name} accepted your interest. ❤️",

"notifications.newMessage":
  "You have a new message.",

"notifications.likedYou":
  "{name} liked you. ❤️",

"notifications.newNotification":
  "You have a new notification.",

  "memberProfile.loading": "Umwirondoro urimo gutegurwa...",
"memberProfile.notFound": "Umwirondoro w’umunyamuryango ntubashije kuboneka",
"memberProfile.notFoundDescription":
  "Ntabwo twashoboye kubona umwirondoro w’uyu munyamuryango. Subira aharebwa abanyamuryango wongere ugerageze.",
"memberProfile.loadError":
  "Ntibyashobotse gufungura umwirondoro w’uyu munyamuryango",
"memberProfile.backToMembers": "Subira ku Banyamuryango",
"memberProfile.backToDiscovery": "Subira ku Bashakishwa",
"memberProfile.onlineNow": "Ari kuri murandasi ubu",
"memberProfile.verified": "Yemejwe",
"memberProfile.lookingFor": "Ashaka",
"memberProfile.liked": "Wamukunze",
"memberProfile.like": "Kunda",
"memberProfile.sending": "Birimo koherezwa...",
"memberProfile.interestSent": "Ubutumwa bwo kugaragaza ko umukunda bwoherejwe",
"memberProfile.sendInterest": "Erekana ko umukunda",
"memberProfile.startChat": "Tangira Ikiganiro",
"memberProfile.chatInterestNotice":
  "Abantu bombi bagomba kugaragaza ko bashimishijwe mbere y’uko ikiganiro kibasha gutangira.",
"memberProfile.about": "Ibyerekeye",
"memberProfile.defaultAbout":
  "Ndi umuntu ugira neza, utekereza neza kandi w’ukuri ushaka umubano ufite intego. Nkunda kumarana igihe n’abantu beza, kumenya ibintu bishya no kubaka imibanire ishingiye ku kuri no kubahana.",
"memberProfile.interests": "Ibyo Akunda",
"memberProfile.music": "Umuziki",
"memberProfile.travel": "Ingendo",
"memberProfile.cooking": "Guteka",
"memberProfile.movies": "Filimi",
"memberProfile.nature": "Ib nature",
"memberProfile.whatLookingFor": "Ibyo",
"memberProfile.meaningfulConnection": "Umubano ufite intego",
"memberProfile.lookingForDescription":
  "Ashaka umuntu w’ukuri, wubaha abandi kandi witeguye kubaka umubano ufite intego hamwe.",
"memberProfile.staySafe": "Gumana Umutekano kuri UMUHUZA",
"memberProfile.lookingForTitle": "Ibyo Ashaka",
"memberProfile.safetyDescription":
  "Fata igihe uhugura umuntu mbere yo kumuha amakuru akwerekeyeho bwite.",

      // ===================================================
// CONNECTIONS / INTERESTS
// ===================================================

"connections.pleaseLogin":
  "Nyamuneka injira muri konti yawe",
"connections.loginToView":
  "Injira muri konti yawe kugira ngo urebe abo mwahuje n'ubushake bwo guhuza.",
"connections.loading":
  "Birimo gupakira abo mwahuje",
"connections.preparing":
  "Turimo gutegura abo mwahuje n'ubushake bwo guhuza...",
"connections.title":
  "Abo Mwahuje n'Ubushake",
"connections.label":
  "Abo UMUHUZA Mwahuye",
"connections.heading":
  "Abantu Mwahuye",
"connections.description":
  "Genzura abo mwahuje kandi usubize abantu bagaragaje ko bashaka guhuza nawe.",
"connections.total":
  "Abo mwahuje",
"connections.yourConnections":
  "Abo Mwahuje",
"connections.peopleConnected":
  "Abantu mwahujwe",
"connections.loadingConnections":
  "Birimo gupakira abo mwahuje...",
"connections.noConnections":
  "Nta bo mwahuje kugeza ubu",
"connections.newConnection":
  "Abo mushya mwahuza bazagaragara hano.",
"connections.pendingInterests":
  "Ubushake Butegereje",
"connections.waitingResponse":
  "Abategereje igisubizo cyawe",
"connections.allCaughtUp":
  "Nta kindi gisigaye!",
"connections.noPendingInterests":
  "Nta bushake bwo guhuza butegereje ubu.",
"connections.lookingFor":
  "Ashaka",
"connections.startChat":
  "Tangira Ikiganiro",
"connections.sent":
  "Byoherejwe",
"connections.accept":
  "Emera",
"connections.decline":
  "Anga",
"connections.wouldLikeToKnow":
  "{name} arashaka ko mumenyana.",
"connections.lookingForMore":
  "Urashaka guhura n'abandi?",
"connections.discoverMore":
  "Shakisha abandi bagize UMUHUZA maze ubone abo mwahuza mu buryo bufite ireme.",
"connections.discoverPeople":
  "Shakisha Abantu",

// ===================================================
// EMAIL VERIFICATION
// ===================================================

"verification.close":
  "Funga",
"verification.title":
  "Emeza Email Yawe",
"verification.lead":
  "Mbere yo kohereza ubushake bwo guhuza, ugomba kubanza kwemeza email yawe.",
"verification.help":
  "Dukeneye email yemejwe kugira ngo dufashe kurinda UMUHUZA no gukomeza kuba urubuga rwizewe.",
"verification.sendEmail":
  "Ohereza Email yo Kwemeza",
"verification.check":
  "Nemeje Email Yanjye",
"verification.pleaseWait":
  "Tegereza gato...",
"verification.loginAgain":
  "Nyamuneka ongera winjire.",
"verification.emailSent":
  "Email yo kwemeza yoherejwe neza.",
"verification.sendFailed":
  "Ntibyashobotse kohereza email yo kwemeza.",
"verification.success":
  "Email yemejwe neza.",
"verification.notVerified":
  "Email ntiraremezwa.",
"verification.checkFailed":
  "Ntibyashobotse kugenzura niba email yemejwe.",

    // ==============================
    // CHAT / MESSAGES
    // ==============================

    "chat.pleaseLogin": "Nyura mu konti",
    "chat.loginToChat":
      "Nyura mu konti kugira ngo uvugane n'abandi.",
    "chat.goToLogin": "Jya ku Kwinjira",
    "chat.loadingChats":
      "Birimo gupakira ibiganiro",
    "chat.pleaseWait": "Tegereza gato...",
    "chat.noMembers": "Nta muntu uhari",
    "chat.noMembersDesc":
      "Nta bandi bagize UMUHUZA bahari ubu.",
    "chat.peopleYouCanMessage":
      "Abantu ushobora kuvugana na bo",
    "chat.searchConversations":
      "Shakisha ibiganiro...",
    "chat.noConversationsFound":
      "Nta biganiro byabonetse",
    "chat.onlineNow":
      "Ari kuri interineti",
    "chat.startConversation":
      "Tangira ikiganiro na",
    "chat.selectPerson":
      "Hitamo umuntu utangire ikiganiro.",
    "chat.messagePlaceholder":
      "Andika ubutumwa",
    "chat.sendingImages":
      "Birimo kohereza amashusho...",
    "chat.image": "ishusho",
    "chat.images": "amashusho",
    "chat.loadingMessages":
      "Birimo gupakira ubutumwa...",
      "signup.title": "Kora Konti Yawe",
"signup.subtitle": "Tangira n'ibanze.",
"signup.firstName": "Izina rya mbere",
"signup.firstNamePlaceholder": "Andika izina ryawe rya mbere",
"signup.lastName": "Izina ry'umuryango",
"signup.lastNamePlaceholder": "Andika izina ry'umuryango",
"signup.email": "Imeli",
"signup.emailPlaceholder": "Andika imeli yawe",
"signup.emailHelp": "Ushobora kwemeza imeli yawe nyuma yo gukora konti.",
"signup.password": "Kora ijambo ry'ibanga",
"signup.passwordPlaceholder": "Kora ijambo ry'ibanga",
"signup.passwordHelp": "Koresha byibuze inyuguti 8.",
"signup.dateOfBirth": "Itariki y'amavuko",
"signup.ageHelp": "Imyaka yawe ibarwa automatically.",
"signup.youAre": "Uri",
"signup.yearsOld": "imyaka.",
"signup.gender": "Igitsina",
"signup.selectGender": "Hitamo igitsina cyawe",
"signup.male": "Gabo",
"signup.female": "Gore",
"signup.whereLive": "Utuye he?",
"signup.selectCountry": "Hitamo igihugu",
"signup.rwanda": "Rwanda",
"signup.burundi": "Burundi",
"signup.otherCountry": "Ikindi gihugu",
"signup.district": "Akarere",
"signup.province": "Intara",
"signup.countryOfResidence": "Igihugu utuyemo",
"signup.location": "Aho utuye",
"signup.selectCountryFirst": "Banza uhitemo igihugu",
"signup.selectDistrict": "Hitamo akarere kawe",
"signup.selectProvince": "Hitamo intara yawe",
"signup.selectYourCountry": "Hitamo igihugu cyawe",
"signup.phone": "Numero ya telefone",
"signup.phonePlaceholder": "Andika numero ya telefone",
"signup.phoneHelp": "Numero ya telefone ifasha kurinda konti yawe.",
"signup.referralCode": "Kode y'ubutumire",
"signup.referralPlaceholder": "Andika kode y'ubutumire",
"signup.referralHelp": "Niba umuntu wo kuri UMUHUZA yagutumye, andika kode ye.",
"signup.terms": "Nemeye amategeko n'amabwiriza ya UMUHUZA",
"signup.continue": "Komeza",
"signup.creating": "Turimo gukora konti...",
"signup.alreadyMember": "Usanzwe ufite konti?",
"signup.login": "Injira",
"signup.heroTitle": "Tangira Urugendo rwawe rw'Urukundo",
"signup.heroSubtitle": "Hura n'abantu b'ukuri bashaka umubano w'ukuri.",

"aboutYou.title": "Ibyerekeye Wowe",
"aboutYou.subtitle": "Hitamo ibisobanura wowe.",
"aboutYou.heroTitle": "Tubwire Ibyerekeye Wowe",
"aboutYou.heroSubtitle": "Dufashe kumenya icyo ushaka kugira ngo UMUHUZA igufashe kubona umubano mwiza.",
"aboutYou.personalStatus": "Imimerere yawe",
"aboutYou.lookingFor": "Ushaka",
"aboutYou.relationshipGoal": "Intego y'umubano",
"aboutYou.continue": "Komeza",
"aboutYou.saving": "Birimo kubika...",

"profileSetup.title": "Kora Profil Yawe",
"profileSetup.subtitle": "Ongeraho ifoto yawe n'ibyo ukunda.",
"profileSetup.heroTitle": "Kora Profil Yawe ya UMUHUZA",
"profileSetup.heroSubtitle": "Erekana uwo uri cyane kugira ngo abandi bakumenye.",
"profileSetup.mainPhoto": "Ifoto Nkuru ya Profil",
"profileSetup.mainPhotoRequired": "Ifoto nkuru irakenewe kandi niyo izagaragara ku profil yawe.",
"profileSetup.takePhoto": "Fata Ifoto",
"profileSetup.retakePhoto": "Ongera ufate ifoto",
"profileSetup.chooseGallery": "Hitamo mu masome",
"profileSetup.changePhoto": "Hindura Ifoto",
"profileSetup.interests": "Ibyo Ukunda",
"profileSetup.interestsHelp": "Hitamo ibyo ukunda.",
"profileSetup.finish": "Rangiza Profil ❤️",
"profileSetup.saving": "Birimo kubika profil...",
"profileSetup.realPhotoPolicy": "Politiki y'Ifoto y'Ukuri",
"profileSetup.realPhotoText": "Koresha ifoto yawe nyayo. UMUHUZA ni iy'abantu b'ukuri bashaka urukundo rw'ukuri.",
"interest.love": "❤️ Urukundo",
"interest.music": "🎵 Umuziki",
"interest.travel": "✈️ Gukora urugendo",
"interest.sports": "⚽ Siporo",
"interest.reading": "📚 Gusoma",
"interest.movies": "🎬 Filime",
"interest.cooking": "🍳 Guteka",
"interest.nature": "🌿 Kamere",
"interest.dancing": "💃 Kubyina",
"interest.fitness": "🏋️ Imyitozo",
"interest.faith": "🙏 Kwizera",
"interest.art": "🎨 Ubuhanzi",
"signup.stepAccount": "Konti",
"signup.stepAbout": "Ibyerekeye Wowe",
"signup.stepProfile": "Profil",

"aboutYou.selectStatus": "Hitamo imimerere yawe",
"aboutYou.selectLookingFor": "Hitamo uwo ushaka",
"aboutYou.selectGoal": "Hitamo intego y'umubano",
"aboutYou.lookingHelp": "UMUHUZA izakoresha ibi kugira ngo igufashe kubona abantu bahuje.",
"aboutYou.goalHelp": "Hitamo icyo ushaka cyane kuri UMUHUZA.",
"aboutYou.personalStatus": "Imimerere yawe",
"aboutYou.lookingFor": "Ushaka",
"aboutYou.relationshipGoal": "Intego y'umubano",

"status.single": "Ingaragu",
"status.divorced": "Yatandukanye",
"status.widowed": "Umupfakazi",
"status.separated": "Batandukanye",

"looking.men": "👨 Abagabo",
"looking.women": "👩 Abagore",
"looking.both": "👨 Abagabo & 👩 Abagore",

"goal.marriage": "💍 Gushyingirwa",
"goal.serious": "❤️ Umubano ukomeye",
"goal.friendship": "🤝 Ubushuti",
"goal.gettingToKnow": "💕 Kumenyana",
"profileSetup.compressNote": ".",
"profileSetup.errorMainPhoto": "Nyamuneka shyiraho ifoto nkuru ya profil. Ifoto y'ukuri irakenewe.",
"profileSetup.errorInterests": "Nyamuneka hitamo byibuze ikintu kimwe ukunda.",
"profileSetup.errorCamera": "Ntibishoboka gufata ifoto. Reba uburenganzira bwa kamera.",
"profileSetup.errorInvalidImage": "Nyamuneka hitamo ifoto yemewe.",
"profileSetup.errorImageTooLarge": "Iyi foto ni nini cyane. Hitamo ifoto iri munsi ya 20 MB.",
"profileSetup.errorCompress": "Ifoto ntiyashoboye kugabanuka munsi ya 250 KB. Hitamo indi.",
"profileSetup.errorSession": "Sesiyo yawe yarangiye. Ongera winjire.",
"profileSetup.errorGeneric": "Ntibyashoboka kubika profil yawe. Ongera ugerageze.",
"profileSetup.saving": "Birimo kubika profil...",
"profileSetup.finish": "Rangiza Profil ❤️",
"profileSetup.retakePhoto": "Ongera ufate ifoto",
"profileSetup.takePhoto": "Fata Ifoto",
"profileSetup.changePhoto": "Hindura Ifoto",
"profileSetup.chooseGallery": "Hitamo mu masome",
"profileSetup.realPhotoPolicy": "Politiki y'Ifoto y'Ukuri",
"profileSetup.realPhotoText": "Koresha ifoto yawe nyayo.",
"profileSetup.realPhotoDesc": "UMUHUZA ni iy'abantu b'ukuri bashaka urukundo rw'ukuri. Amafoto y'ibinyoma ntiyemewe.",
  },

  // ===================================================
  // FRENCH
  // ===================================================

  fr: {
    // ==============================
    // COMMON
    // ==============================

    "common.backToProfile": "Retour au profil",
    "common.meaningfulConnections":
      "Des connexions authentiques. Des personnes sincères.",
    "common.save": "Enregistrer",
    "common.saving": "Enregistrement...",
    "common.loading": "Chargement...",
    "common.error":
      "Une erreur s'est produite",
    "common.back": "Retour",

    // ==============================
    // NAVBAR
    // ==============================

    "nav.messages": "Messages",
    "nav.connections": "Connexions",
    "nav.notifications": "Notifications",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "Mon profil",
    "nav.inviteFriends": "Inviter des amis",
    "nav.accountSettings":
      "Paramètres du compte",
    "nav.aboutUs": "À propos de nous",

    // ==============================
    // MEMBER HOME
    // ==============================

    "home.welcome": "BIENVENUE SUR UMUHUZA",
    "home.discoverTitle":
      "Découvrez quelqu'un",
    "home.discoverSubtitle":
      "de spécial aujourd'hui",
    "home.discoverDescription":
      "Rencontrez des personnes sincères à la recherche de relations significatives, d'amitié et d'amour.",
    "home.searchPlaceholder":
      "Rechercher des membres...",
    "home.discoverPeople":
      "Découvrir des personnes",
    "home.meaningfulConnection":
      "Trouvez des personnes avec qui vous pourriez avoir une connexion significative.",
    "home.near": "Près de",
    "home.viewProfile": "Voir le profil",
    "home.like": "J'aime",
    "home.liked": "Aimé",
    "home.sendInterest":
      "Envoyer un intérêt",
    "home.interestSent":
      "Intérêt envoyé",
    "home.connected": "Connecté",
    "home.startChat":
      "Commencer une discussion",
    "home.noMembers":
      "Aucun membre correspondant pour le moment",
    "home.tryAnother":
      "La communauté UMUHUZA est encore en pleine croissance. Essayez une autre catégorie.",

    // ==============================
    // CATEGORIES
    // ==============================

    "category.recommended":
      "Recommandé",
    "category.online": "En ligne",
    "category.diaspora": "Diaspora",
    "category.new": "Nouveaux",
    "category.verified": "Vérifiés",
    "category.nearby": "À proximité",

    // ==============================
    // PREMIUM
    // ==============================

"premium.back": "Retour",
"premium.loading": "Chargement...",
"premium.title": "💎 UMUHUZA Premium",
"premium.subtitle": "Débloquez plus de conversations avec de vraies personnes",
"premium.currentStatus": "Votre statut actuel",
"premium.freeChatsRemaining": "Conversations gratuites restantes",
"premium.extraChatCredits": "Crédits de conversation supplémentaires",
"premium.premiumStatus": "Statut Premium",
"premium.active": "Actif",
"premium.notActive": "Inactif",
"premium.popular": "Populaire",
"premium.chatPack": "Pack de conversations",
"premium.chatPackDescription": "Débloquez 5 personnes supplémentaires avec qui discuter",
"premium.newChatSlots": "+5 nouveaux emplacements de conversation",
"premium.neverExpires": "N’expire jamais",
"premium.instantActivation": "Activation instantanée après paiement",
"premium.buyChatPack": "Acheter le pack de conversations",
"premium.bestValue": "Meilleur rapport qualité-prix",
"premium.monthlyUnlimited": "Illimité mensuel",
"premium.monthlyDescription": "Discutez avec un nombre illimité de personnes pendant 30 jours",
"premium.unlimitedNewChats": "Conversations nouvelles illimitées",
"premium.valid30Days": "Valable pendant 30 jours",
"premium.prioritySupport": "Assistance prioritaire",
"premium.upgradePremium": "Passer à Premium",
"premium.referralRewards": "Récompenses de parrainage",
"premium.referralDescription": "Invitez vos amis et débloquez des conversations gratuites",
"premium.invite5Friends": "Invitez 5 amis",
"premium.invite10Friends": "Invitez 10 amis",
"premium.invite15Friends": "Invitez 15 amis",
"premium.freeChats2": "+2 conversations gratuites",
"premium.freeChats10": "+10 conversations gratuites",
"premium.oneMonthUnlimited": "1 mois de conversations illimitées",
"premium.goToReferral": "Accéder au programme de parrainage",
"premium.noteExisting": "Remarque : Les conversations existantes ne sont jamais limitées.",
"premium.noteNew": "Seul le démarrage de conversations avec de nouvelles personnes est limité.",
"premium.choosePayment": "Choisissez votre mode de paiement préféré",
"premium.mobileMoney": "📱 Mobile Money",
"premium.dialCode": "Composez ce code :",
"premium.sendMoney": "Ou envoyez l’argent à :",
"premium.registeredTo": "Enregistré au nom de : Vincent",
"premium.cryptoPayment": "💎 Paiement en crypto",
"premium.copyAddress": "Copier l’adresse",
"premium.afterPayment": "Après le paiement, cliquez sur le bouton ci-dessous.",
"premium.activationConfirmation": "Nous activerons votre forfait après confirmation du paiement.",
"premium.submitting": "Envoi en cours...",
"premium.iHavePaid": "J’ai payé",
"premium.chatPackPlan": "Pack de conversations - 200 RWF",
"premium.monthlyPlan": "Premium mensuel - 500 RWF",
"premium.paymentSubmitted": "✅ Paiement envoyé avec succès !\n\nLa confirmation de votre paiement prendra moins de 10 minutes.",
"premium.submitError": "Impossible d’envoyer la demande de paiement. Veuillez réessayer.",
"premium.paymentError": "Erreur : {message}",
"premium.interestPackPurpose": "5 conversations supplémentaires",
"premium.monthlyPurpose": "Conversations mensuelles illimitées",

"memberProfile.loading": "Chargement du profil...",
"memberProfile.notFound": "Profil du membre introuvable",
"memberProfile.notFoundDescription":
  "Nous n’avons pas pu trouver le profil de ce membre. Veuillez retourner à la découverte et réessayer.",
"memberProfile.loadError":
  "Impossible de charger le profil de ce membre",
"memberProfile.backToMembers": "Retour aux membres",
"memberProfile.backToDiscovery": "Retour à la découverte",
"memberProfile.onlineNow": "En ligne maintenant",
"memberProfile.verified": "Vérifié",
"memberProfile.lookingFor": "Recherche",
"memberProfile.liked": "Aimé",
"memberProfile.like": "J’aime",
"memberProfile.sending": "Envoi en cours...",
"memberProfile.interestSent": "Intérêt envoyé",
"memberProfile.sendInterest": "Envoyer mon intérêt",
"memberProfile.startChat": "Démarrer une conversation",
"memberProfile.chatInterestNotice":
  "Les deux personnes doivent montrer leur intérêt avant que la conversation soit disponible.",
"memberProfile.about": "À propos de",
"memberProfile.defaultAbout":
  "Je suis une personne gentille, positive et sincère à la recherche de relations significatives. J’aime passer du temps avec de bonnes personnes, découvrir de nouvelles expériences et construire des relations basées sur l’honnêteté et le respect.",
"memberProfile.interests": "Centres d’intérêt",
"memberProfile.music": "Musique",
"memberProfile.travel": "Voyage",
"memberProfile.cooking": "Cuisine",
"memberProfile.movies": "Films",
"memberProfile.nature": "Nature",
"memberProfile.whatLookingFor": "Ce que",
"memberProfile.meaningfulConnection": "Une relation significative",
"memberProfile.lookingForDescription":
  "Recherche une personne sincère, respectueuse et prête à construire quelque chose de significatif ensemble.",
"memberProfile.staySafe": "Restez en sécurité sur UMUHUZA",
"memberProfile.lookingForTitle": "Ce qu’il/elle recherche",
"memberProfile.safetyDescription":
  "Prenez le temps d’apprendre à connaître quelqu’un avant de partager des informations personnelles.",

      // NOTIFICATIONS

"notifications.loginRequired":
  "Veuillez vous connecter",

"notifications.loginToView":
  "Connectez-vous pour voir vos notifications.",

"notifications.goToLogin":
  "Se connecter",

"notifications.back":
  "Retour",

"notifications.title":
  "Notifications",

"notifications.activity":
  "VOTRE ACTIVITÉ",

"notifications.heading":
  "Notifications",

"notifications.stayUpdated":
  "Restez informé de votre activité.",

"notifications.markAllRead":
  "Tout marquer comme lu",

"notifications.unread":
  "Non lues",

"notifications.loading":
  "Chargement des notifications...",

"notifications.pleaseWait":
  "Veuillez patienter.",

"notifications.emptyTitle":
  "Aucune notification pour le moment",

"notifications.emptyMessage":
  "Lorsqu'une personne interagit avec vous, vous verrez la notification ici.",

"notifications.discoverPeople":
  "Découvrir des personnes",

"notifications.accepting":
  "Acceptation...",

"notifications.accept":
  "ACCEPTER",

"notifications.startChat":
  "Commencer une discussion",

"notifications.member":
  "Membre UMUHUZA",

"notifications.unableToLoad":
  "Impossible de charger vos notifications.",

"notifications.markAllFailed":
  "Impossible de marquer toutes les notifications comme lues.",

"notifications.identifyMember":
  "Impossible d'identifier ce membre.",

"notifications.identifySender":
  "Impossible d'identifier l'expéditeur de ce message.",

"notifications.acceptFailed":
  "Impossible d'accepter cette demande. Veuillez réessayer.",

"notifications.interestAccepted":
  "Demande acceptée ❤️",

"notifications.interestAcceptedMessage":
  "{name} a accepté votre demande ❤️",

"notifications.newInterest":
  "{name} souhaite faire votre connaissance. ❤️",

"notifications.acceptedInterest":
  "{name} a accepté votre demande. ❤️",

"notifications.newMessage":
  "Vous avez un nouveau message.",

"notifications.likedYou":
  "{name} vous a aimé. ❤️",

"notifications.newNotification":
  "Vous avez une nouvelle notification.",

      // ===================================================
// CONNECTIONS / INTERESTS
// ===================================================

"connections.pleaseLogin":
  "Veuillez vous connecter",
"connections.loginToView":
  "Connectez-vous pour voir vos connexions et vos demandes.",
"connections.loading":
  "Chargement de vos connexions",
"connections.preparing":
  "Préparation de vos connexions et demandes...",
"connections.title":
  "Connexions et demandes",
"connections.label":
  "Connexions UMUHUZA",
"connections.heading":
  "Personnes avec qui vous êtes connecté",
"connections.description":
  "Gérez vos connexions et répondez aux personnes qui souhaitent entrer en contact avec vous.",
"connections.total":
  "Connexions",
"connections.yourConnections":
  "Vos connexions",
"connections.peopleConnected":
  "Personnes avec qui vous êtes connecté",
"connections.loadingConnections":
  "Chargement des connexions...",
"connections.noConnections":
  "Aucune connexion pour le moment",
"connections.newConnection":
  "Vos nouvelles connexions apparaîtront ici.",
"connections.pendingInterests":
  "Demandes en attente",
"connections.waitingResponse":
  "Personnes en attente de votre réponse",
"connections.allCaughtUp":
  "Tout est à jour !",
"connections.noPendingInterests":
  "Vous n'avez aucune demande en attente pour le moment.",
"connections.lookingFor":
  "Recherche",
"connections.startChat":
  "Commencer une discussion",
"connections.sent":
  "Envoyé",
"connections.accept":
  "Accepter",
"connections.decline":
  "Refuser",
"connections.wouldLikeToKnow":
  "{name} souhaite faire votre connaissance.",
"connections.lookingForMore":
  "Vous cherchez encore des personnes ?",
"connections.discoverMore":
  "Découvrez davantage de membres UMUHUZA et créez des connexions significatives.",
"connections.discoverPeople":
  "Découvrir des personnes",

// ===================================================
// EMAIL VERIFICATION
// ===================================================

"verification.close":
  "Fermer",
"verification.title":
  "Vérifiez votre adresse e-mail",
"verification.lead":
  "Avant de pouvoir envoyer une demande, vous devez vérifier votre adresse e-mail.",
"verification.help":
  "Nous avons besoin d'une adresse e-mail vérifiée pour contribuer à maintenir UMUHUZA sûr et authentique.",
"verification.sendEmail":
  "Envoyer l'e-mail de vérification",
"verification.check":
  "J'ai vérifié mon e-mail",
"verification.pleaseWait":
  "Veuillez patienter...",
"verification.loginAgain":
  "Veuillez vous reconnecter.",
"verification.emailSent":
  "L'e-mail de vérification a été envoyé avec succès.",
"verification.sendFailed":
  "Impossible d'envoyer l'e-mail de vérification.",
"verification.success":
  "E-mail vérifié avec succès.",
"verification.notVerified":
  "L'e-mail n'est pas encore vérifié.",
"verification.checkFailed":
  "Impossible de vérifier le statut de l'e-mail.",

    // ==============================
    // CHAT / MESSAGES
    // ==============================

    "chat.pleaseLogin":
      "Veuillez vous connecter",
    "chat.loginToChat":
      "Connectez-vous pour discuter avec vos messages UMUHUZA.",
    "chat.goToLogin":
      "Aller à la connexion",
    "chat.loadingChats":
      "Chargement des discussions",
    "chat.pleaseWait":
      "Veuillez patienter...",
    "chat.noMembers":
      "Aucun membre disponible",
    "chat.noMembersDesc":
      "Il n'y a actuellement aucun autre membre UMUHUZA.",
    "chat.peopleYouCanMessage":
      "Personnes avec qui vous pouvez discuter",
    "chat.searchConversations":
      "Rechercher des conversations...",
    "chat.noConversationsFound":
      "Aucune conversation trouvée",
    "chat.onlineNow": "En ligne",
    "chat.startConversation":
      "Commencez votre conversation avec",
    "chat.selectPerson":
      "Sélectionnez une personne pour commencer à discuter.",
    "chat.messagePlaceholder":
      "Message",
    "chat.sendingImages":
      "Envoi des images...",
    "chat.image": "image",
    "chat.images": "images",
    "chat.loadingMessages":
      "Chargement des messages...",
      "signup.title": "Créez Votre Compte",
"signup.subtitle": "Commençons par les bases.",
"signup.firstName": "Prénom",
"signup.firstNamePlaceholder": "Entrez votre prénom",
"signup.lastName": "Nom de famille",
"signup.lastNamePlaceholder": "Entrez votre nom de famille",
"signup.email": "Adresse e-mail",
"signup.emailPlaceholder": "Entrez votre e-mail",
"signup.emailHelp": "Vous pourrez vérifier votre e-mail après la création du compte.",
"signup.password": "Créer un mot de passe",
"signup.passwordPlaceholder": "Créer un mot de passe",
"signup.passwordHelp": "Utilisez au moins 8 caractères.",
"signup.dateOfBirth": "Date de naissance",
"signup.ageHelp": "Votre âge est calculé automatiquement.",
"signup.youAre": "Vous avez",
"signup.yearsOld": "ans.",
"signup.gender": "Genre",
"signup.selectGender": "Sélectionnez votre genre",
"signup.male": "Homme",
"signup.female": "Femme",
"signup.whereLive": "Où habitez-vous ?",
"signup.selectCountry": "Sélectionnez votre pays",
"signup.rwanda": "Rwanda",
"signup.burundi": "Burundi",
"signup.otherCountry": "Autre pays",
"signup.district": "District",
"signup.province": "Province",
"signup.countryOfResidence": "Pays de résidence",
"signup.location": "Localisation",
"signup.selectCountryFirst": "Sélectionnez d'abord le pays",
"signup.selectDistrict": "Sélectionnez votre district",
"signup.selectProvince": "Sélectionnez votre province",
"signup.selectYourCountry": "Sélectionnez votre pays",
"signup.phone": "Numéro de téléphone",
"signup.phonePlaceholder": "Entrez votre numéro de téléphone",
"signup.phoneHelp": "Votre numéro aide à sécuriser votre compte UMUHUZA.",
"signup.referralCode": "Code de parrainage",
"signup.referralPlaceholder": "Entrez le code de parrainage",
"signup.referralHelp": "Si un membre UMUHUZA vous a invité, entrez son code.",
"signup.terms": "J'accepte les Conditions et la Politique de confidentialité d'UMUHUZA",
"signup.continue": "Continuer",
"signup.creating": "Création du compte...",
"signup.alreadyMember": "Déjà membre ?",
"signup.login": "Se connecter",
"signup.heroTitle": "Commencez Votre Histoire d'Amour",
"signup.heroSubtitle": "Rejoignez des personnes authentiques à la recherche de connexions significatives.",

"aboutYou.title": "À Propos de Vous",
"aboutYou.subtitle": "Choisissez les options qui vous décrivent.",
"aboutYou.heroTitle": "Parlez-nous de Vous",
"aboutYou.heroSubtitle": "Aidez-nous à comprendre ce que vous recherchez pour que UMUHUZA puisse vous aider.",
"aboutYou.personalStatus": "Statut personnel",
"aboutYou.lookingFor": "Vous recherchez",
"aboutYou.relationshipGoal": "Objectif relationnel",
"aboutYou.continue": "Continuer",
"aboutYou.saving": "Enregistrement...",

"profileSetup.title": "Créez Votre Profil",
"profileSetup.subtitle": "Ajoutez votre vraie photo et choisissez vos centres d'intérêt.",
"profileSetup.heroTitle": "Créez Votre Profil UMUHUZA",
"profileSetup.heroSubtitle": "Montrez qui vous êtes vraiment et laissez les bonnes personnes vous découvrir.",
"profileSetup.mainPhoto": "Photo Principale du Profil",
"profileSetup.mainPhotoRequired": "La photo principale est obligatoire et sera affichée sur votre profil.",
"profileSetup.takePhoto": "Prendre une photo",
"profileSetup.retakePhoto": "Reprendre la photo",
"profileSetup.chooseGallery": "Choisir depuis la galerie",
"profileSetup.changePhoto": "Changer la photo",
"profileSetup.interests": "Vos centres d'intérêt",
"profileSetup.interestsHelp": "Choisissez les centres d'intérêt qui vous décrivent.",
"profileSetup.finish": "Terminer le Profil ❤️",
"profileSetup.saving": "Enregistrement du profil...",
"profileSetup.realPhotoPolicy": "Politique de Photo Réelle",
"profileSetup.realPhotoText": "Utilisez votre vraie photo. UMUHUZA est destiné aux vraies personnes cherchant de vraies connexions.",
"interest.love": "❤️ Amour",
"interest.music": "🎵 Musique",
"interest.travel": "✈️ Voyage",
"interest.sports": "⚽ Sport",
"interest.reading": "📚 Lecture",
"interest.movies": "🎬 Cinéma",
"interest.cooking": "🍳 Cuisine",
"interest.nature": "🌿 Nature",
"interest.dancing": "💃 Danse",
"interest.fitness": "🏋️ Fitness",
"interest.faith": "🙏 Foi",
"interest.art": "🎨 Art",
"signup.stepAccount": "Compte",
"signup.stepAbout": "À propos de vous",
"signup.stepProfile": "Profil",

"aboutYou.selectStatus": "Sélectionnez votre statut",
"aboutYou.selectLookingFor": "Choisissez qui vous voulez rencontrer",
"aboutYou.selectGoal": "Choisissez votre objectif relationnel",
"aboutYou.lookingHelp": "UMUHUZA utilisera cela pour recommander des personnes compatibles.",
"aboutYou.goalHelp": "Choisissez ce que vous espérez vraiment trouver sur UMUHUZA.",
"aboutYou.personalStatus": "Statut personnel",
"aboutYou.lookingFor": "Qui recherchez-vous ?",
"aboutYou.relationshipGoal": "Objectif relationnel",

"status.single": "Célibataire",
"status.divorced": "Divorcé(e)",
"status.widowed": "Veuf / Veuve",
"status.separated": "Séparé(e)",

"looking.men": "👨 Hommes",
"looking.women": "👩 Femmes",
"looking.both": "👨 Hommes & 👩 Femmes",

"goal.marriage": "💍 Mariage",
"goal.serious": "❤️ Relation sérieuse",
"goal.friendship": "🤝 Amitié",
"goal.gettingToKnow": "💕 Faire connaissance",
"profileSetup.compressNote": ".",
"profileSetup.errorMainPhoto": "Veuillez télécharger votre photo principale. Une vraie photo est obligatoire.",
"profileSetup.errorInterests": "Veuillez sélectionner au moins un centre d'intérêt.",
"profileSetup.errorCamera": "Impossible de prendre une photo. Vérifiez l'autorisation de la caméra.",
"profileSetup.errorInvalidImage": "Veuillez sélectionner une image valide.",
"profileSetup.errorImageTooLarge": "Cette image est trop grande. Choisissez une image de moins de 20 Mo.",
"profileSetup.errorCompress": "L'image n'a pas pu être compressée en dessous de 250 Ko.",
"profileSetup.errorSession": "Votre session a expiré. Veuillez vous reconnecter.",
"profileSetup.errorGeneric": "Nous n'avons pas pu enregistrer votre profil. Veuillez réessayer.",
"profileSetup.saving": "Enregistrement du profil...",
"profileSetup.finish": "Terminer le Profil ❤️",
"profileSetup.retakePhoto": "Reprendre la photo",
"profileSetup.takePhoto": "Prendre une photo",
"profileSetup.changePhoto": "Changer la photo",
"profileSetup.chooseGallery": "Choisir depuis la galerie",
"profileSetup.realPhotoPolicy": "Politique de Photo Réelle",
"profileSetup.realPhotoText": "Utilisez votre vraie photo.",
"profileSetup.realPhotoDesc": "UMUHUZA est destiné aux vraies personnes cherchant de vraies connexions. Les fausses photos ne sont pas autorisées.",
  },

  // ===================================================
  // SWAHILI
  // ===================================================

  sw: {
    // ==============================
    // COMMON
    // ==============================

    "common.backToProfile":
      "Rudi kwenye Wasifu",
    "common.meaningfulConnections":
      "Mahusiano ya kweli. Watu wa kweli.",
    "common.save": "Hifadhi",
    "common.saving": "Inahifadhi...",
    "common.loading": "Inapakia...",
    "common.error": "Kuna hitilafu",
    "common.back": "Rudi",

    // ==============================
    // NAVBAR
    // ==============================

    "nav.messages": "Ujumbe",
    "nav.connections": "Miunganisho",
    "nav.notifications": "Arifa",
    "nav.premium": "Premium",
    "nav.whatsapp": "WhatsApp",
    "nav.myProfile": "Wasifu Wangu",
    "nav.inviteFriends":
      "Alika Marafiki",
    "nav.accountSettings":
      "Mipangilio ya Akaunti",
    "nav.aboutUs": "Kuhusu Sisi",

    // ==============================
    // MEMBER HOME
    // ==============================

    "home.welcome":
      "KARIBU UMUHUZA",
    "home.discoverTitle":
      "Gundua Mtu",
    "home.discoverSubtitle":
      "maalum leo",
    "home.discoverDescription":
      "Kutana na watu wa kweli wanaotafuta mahusiano yenye maana, urafiki na upendo.",
    "home.searchPlaceholder":
      "Tafuta wanachama...",
    "home.discoverPeople":
      "Gundua Watu",
    "home.meaningfulConnection":
      "Tafuta watu ambao wanaweza kuwa na uhusiano wa maana na wewe.",
    "home.near": "Karibu na",
    "home.viewProfile":
      "Tazama Wasifu",
    "home.like": "Penda",
    "home.liked": "Umeipenda",
    "home.sendInterest":
      "Tuma Nia",
    "home.interestSent":
      "Nia Imetumwa",
    "home.connected":
      "Mmeunganishwa",
    "home.startChat":
      "Anza Mazungumzo",
    "home.noMembers":
      "Hakuna wanachama wanaolingana kwa sasa",
    "home.tryAnother":
      "Jumuiya ya UMUHUZA bado inakua. Jaribu kategoria nyingine.",

    // ==============================
    // CATEGORIES
    // ==============================

    "category.recommended":
      "Inayopendekezwa",
    "category.online":
      "Mtandaoni",
    "category.diaspora":
      "Diaspora",
    "category.new": "Wapya",
    "category.verified":
      "Waliothibitishwa",
    "category.nearby":
      "Karibu",

    // ==============================
    // PREMIUM
    // ==============================

"premium.back": "Rudi",
"premium.loading": "Inapakia...",
"premium.title": "💎 UMUHUZA Premium",
"premium.subtitle": "Fungua mazungumzo zaidi na watu halisi",

"premium.currentStatus": "Hali Yako ya Sasa",
"premium.freeChatsRemaining": "Mazungumzo ya bure yaliyosalia",
"premium.extraChatCredits": "Salio la ziada la mazungumzo",
"premium.premiumStatus": "Hali ya Premium",
"premium.active": "Inatumika",
"premium.notActive": "Haitumiki",

"premium.popular": "Maarufu",
"premium.chatPack": "Kifurushi cha Mazungumzo",
"premium.chatPackDescription": "Fungua watu 5 zaidi wa kuzungumza nao",
"premium.newChatSlots": "+5 nafasi mpya za mazungumzo",
"premium.neverExpires": "Haiishi muda",
"premium.instantActivation": "Huwashwa mara moja baada ya malipo",
"premium.buyChatPack": "Nunua Kifurushi cha Mazungumzo",

"premium.bestValue": "Thamani Bora",
"premium.monthlyUnlimited": "Mazungumzo Yasiyo na Kikomo ya Kila Mwezi",
"premium.monthlyDescription": "Zungumza na watu bila kikomo kwa siku 30",
"premium.unlimitedNewChats": "Mazungumzo mapya bila kikomo",
"premium.valid30Days": "Halali kwa siku 30",
"premium.prioritySupport": "Msaada wa kipaumbele",
"premium.upgradePremium": "Boresha hadi Premium",

"premium.referralRewards": "Zawadi za Kuwaalika Marafiki",
"premium.referralDescription": "Alika marafiki na ufungue mazungumzo ya bure",
"premium.invite5Friends": "Alika marafiki 5",
"premium.invite10Friends": "Alika marafiki 10",
"premium.invite15Friends": "Alika marafiki 15",
"premium.freeChats2": "+2 mazungumzo ya bure",
"premium.freeChats10": "+10 mazungumzo ya bure",
"premium.oneMonthUnlimited": "Mwezi 1 wa Mazungumzo Yasiyo na Kikomo",
"premium.goToReferral": "Nenda kwenye Mpango wa Rufaa",

"premium.noteExisting": "Kumbuka: Mazungumzo yaliyopo hayazuiwi kamwe.",
"premium.noteNew": "Ni kuanzisha mazungumzo na watu wapya pekee kunakowekewa kikomo.",

"premium.choosePayment": "Chagua njia unayopendelea ya malipo",
"premium.mobileMoney": "📱 Mobile Money",
"premium.dialCode": "Piga msimbo huu:",
"premium.sendMoney": "Au tuma pesa kwa:",
"premium.registeredTo": "Imesajiliwa kwa: Vincent",

"premium.cryptoPayment": "💎 Malipo ya Crypto",
"premium.copyAddress": "Nakili Anwani",

"premium.afterPayment": "Baada ya malipo, bofya kitufe kilicho hapa chini.",
"premium.activationConfirmation": "Tutawasha mpango wako baada ya kuthibitisha malipo.",
"premium.submitting": "Inatuma...",
"premium.iHavePaid": "Nimelipa",

"premium.chatPackPlan": "Kifurushi cha Mazungumzo - 200 RWF",
"premium.monthlyPlan": "Premium ya Kila Mwezi - 500 RWF",

"premium.paymentSubmitted": "✅ Malipo yametumwa kwa mafanikio!\n\nItachukua chini ya dakika 10 kuthibitisha malipo yako.",
"premium.submitError": "Imeshindikana kutuma ombi la malipo. Tafadhali jaribu tena.",
"premium.paymentError": "Hitilafu: {message}",

"premium.interestPackPurpose": "Mazungumzo 5 ya ziada",
"premium.monthlyPurpose": "Mazungumzo yasiyo na kikomo ya kila mwezi",

"memberProfile.loading": "Inapakia wasifu...",
"memberProfile.notFound": "Wasifu wa mwanachama haukupatikana",
"memberProfile.notFoundDescription":
  "Hatukuweza kupata wasifu wa mwanachama huyu. Tafadhali rudi kwenye ukurasa wa kugundua wanachama na ujaribu tena.",
"memberProfile.loadError":
  "Imeshindikana kupakia wasifu wa mwanachama huyu",
"memberProfile.backToMembers": "Rudi kwa Wanachama",
"memberProfile.backToDiscovery": "Rudi kwenye Ugunduzi",
"memberProfile.onlineNow": "Yuko mtandaoni sasa",
"memberProfile.verified": "Amethibitishwa",
"memberProfile.lookingFor": "Anatafuta",
"memberProfile.liked": "Umempenda",
"memberProfile.like": "Penda",
"memberProfile.sending": "Inatuma...",
"memberProfile.interestSent": "Ujumbe wa nia umetumwa",
"memberProfile.sendInterest": "Tuma Nia",
"memberProfile.startChat": "Anza Mazungumzo",
"memberProfile.chatInterestNotice":
  "Watu wote wawili lazima waonyeshe nia kabla ya mazungumzo kuanza.",
"memberProfile.about": "Kuhusu",
"memberProfile.defaultAbout":
  "Mimi ni mtu mwenye moyo mzuri, chanya na mwaminifu ninayetafuta mahusiano yenye maana. Ninafurahia kutumia muda na watu wazuri, kugundua mambo mapya na kujenga mahusiano yanayotegemea uaminifu na heshima.",
"memberProfile.interests": "Mambo Anayopenda",
"memberProfile.music": "Muziki",
"memberProfile.travel": "Safari",
"memberProfile.cooking": "Kupika",
"memberProfile.movies": "Filamu",
"memberProfile.nature": "Asili",
"memberProfile.whatLookingFor": "Kile",
"memberProfile.meaningfulConnection": "Uhusiano wenye maana",
"memberProfile.lookingForDescription":
  "Anatafuta mtu mwaminifu, mwenye heshima na aliye tayari kujenga kitu cha maana pamoja.",
"memberProfile.staySafe": "Kaa Salama kwenye UMUHUZA",
"memberProfile.lookingForTitle": "Anachotafuta",
"memberProfile.safetyDescription":
  "Chukua muda kumjua mtu vizuri kabla ya kushiriki naye taarifa zako binafsi.",


      // NOTIFICATIONS
"notifications.loginRequired":
  "Tafadhali ingia",

"notifications.loginToView":
  "Ingia ili kuona arifa zako.",

"notifications.goToLogin":
  "Nenda kwenye Kuingia",

"notifications.back":
  "Rudi",

"notifications.title":
  "Arifa",

"notifications.activity":
  "SHUGHULI ZAKO",

"notifications.heading":
  "Arifa",

"notifications.stayUpdated":
  "Endelea kupata taarifa kuhusu shughuli zako.",

"notifications.markAllRead":
  "Weka zote kuwa zimesomwa",

"notifications.unread":
  "Hazijasomwa",

"notifications.loading":
  "Inapakia arifa...",

"notifications.pleaseWait":
  "Tafadhali subiri.",

"notifications.emptyTitle":
  "Hakuna arifa bado",

"notifications.emptyMessage":
  "Mtu anapowasiliana nawe, utaona arifa hapa.",

"notifications.discoverPeople":
  "Gundua Watu",

"notifications.accepting":
  "Inakubali...",

"notifications.accept":
  "KUBALI",

"notifications.startChat":
  "Anza Mazungumzo",

"notifications.member":
  "Mwanachama wa UMUHUZA",

"notifications.unableToLoad":
  "Imeshindikana kupakia arifa zako.",

"notifications.markAllFailed":
  "Imeshindikana kuweka arifa zote kuwa zimesomwa.",

"notifications.identifyMember":
  "Imeshindikana kumtambua mwanachama huyu.",

"notifications.identifySender":
  "Imeshindikana kumtambua mtumaji wa ujumbe huu.",

"notifications.acceptFailed":
  "Imeshindikana kukubali ombi hili. Tafadhali jaribu tena.",

"notifications.interestAccepted":
  "Ombi limekubaliwa ❤️",

"notifications.interestAcceptedMessage":
  "{name} amekubali ombi lako ❤️",

"notifications.newInterest":
  "{name} angependa kukufahamu. ❤️",

"notifications.acceptedInterest":
  "{name} amekubali ombi lako. ❤️",

"notifications.newMessage":
  "Una ujumbe mpya.",

"notifications.likedYou":
  "{name} amekupenda. ❤️",

"notifications.newNotification":
  "Una arifa mpya.",

      // ===================================================
// CONNECTIONS / INTERESTS
// ===================================================

"connections.pleaseLogin":
  "Tafadhali ingia",
"connections.loginToView":
  "Ingia ili kuona miunganisho na maombi yako.",
"connections.loading":
  "Inapakia miunganisho yako",
"connections.preparing":
  "Inaandaa miunganisho na maombi yako...",
"connections.title":
  "Miunganisho na Maombi",
"connections.label":
  "Miunganisho ya UMUHUZA",
"connections.heading":
  "Watu Uliounganishwa Nao",
"connections.description":
  "Dhibiti miunganisho yako na uwajibu watu wanaotaka kuungana nawe.",
"connections.total":
  "Miunganisho",
"connections.yourConnections":
  "Miunganisho Yako",
"connections.peopleConnected":
  "Watu uliounganishwa nao",
"connections.loadingConnections":
  "Inapakia miunganisho...",
"connections.noConnections":
  "Hakuna Miunganisho Bado",
"connections.newConnection":
  "Miunganisho yako mipya itaonekana hapa.",
"connections.pendingInterests":
  "Maombi Yanayosubiri",
"connections.waitingResponse":
  "Watu wanaosubiri jibu lako",
"connections.allCaughtUp":
  "Umemaliza Yote!",
"connections.noPendingInterests":
  "Kwa sasa huna maombi yanayosubiri.",
"connections.lookingFor":
  "Anatafuta",
"connections.startChat":
  "Anza Mazungumzo",
"connections.sent":
  "Imetumwa",
"connections.accept":
  "Kubali",
"connections.decline":
  "Kataa",
"connections.wouldLikeToKnow":
  "{name} angependa kukufahamu.",
"connections.lookingForMore":
  "Unatafuta watu zaidi?",
"connections.discoverMore":
  "Gundua wanachama zaidi wa UMUHUZA na upate miunganisho yenye maana.",
"connections.discoverPeople":
  "Gundua Watu",

// ===================================================
// EMAIL VERIFICATION
// ===================================================

"verification.close":
  "Funga",
"verification.title":
  "Thibitisha Barua Pepe Yako",
"verification.lead":
  "Kabla ya kutuma ombi la kuungana, unahitaji kuthibitisha anwani yako ya barua pepe.",
"verification.help":
  "Tunahitaji barua pepe iliyothibitishwa ili kusaidia kuweka UMUHUZA salama na halisi.",
"verification.sendEmail":
  "Tuma Barua Pepe ya Uthibitishaji",
"verification.check":
  "Nimethibitisha Barua Pepe Yangu",
"verification.pleaseWait":
  "Tafadhali subiri...",
"verification.loginAgain":
  "Tafadhali ingia tena.",
"verification.emailSent":
  "Barua pepe ya uthibitishaji imetumwa kwa mafanikio.",
"verification.sendFailed":
  "Imeshindikana kutuma barua pepe ya uthibitishaji.",
"verification.success":
  "Barua pepe imethibitishwa kwa mafanikio.",
"verification.notVerified":
  "Barua pepe bado haijathibitishwa.",
"verification.checkFailed":
  "Imeshindikana kuangalia hali ya uthibitishaji.",

    // ==============================
    // CHAT / MESSAGES
    // ==============================

    "chat.pleaseLogin":
      "Tafadhali ingia",
    "chat.loginToChat":
      "Ingia ili kuzungumza kupitia Ujumbe wa UMUHUZA.",
    "chat.goToLogin":
      "Nenda kwenye Kuingia",
    "chat.loadingChats":
      "Inapakia gumzo",
    "chat.pleaseWait":
      "Tafadhali subiri...",
    "chat.noMembers":
      "Hakuna wanachama waliopo",
    "chat.noMembersDesc":
      "Kwa sasa hakuna wanachama wengine wa UMUHUZA.",
    "chat.peopleYouCanMessage":
      "Watu unaoweza kuwasiliana nao",
    "chat.searchConversations":
      "Tafuta mazungumzo...",
    "chat.noConversationsFound":
      "Hakuna mazungumzo yaliyopatikana",
    "chat.onlineNow":
      "Yuko mtandaoni",
    "chat.startConversation":
      "Anza mazungumzo yako na",
    "chat.selectPerson":
      "Chagua mtu ili kuanza kuzungumza.",
    "chat.messagePlaceholder":
      "Ujumbe",
    "chat.sendingImages":
      "Inatuma picha...",
    "chat.image": "picha",
    "chat.images": "picha",
    "chat.loadingMessages":
      "Inapakia ujumbe...",
      "signup.title": "Unda Akaunti Yako",
"signup.subtitle": "Tuanze na mambo ya msingi.",
"signup.firstName": "Jina la Kwanza",
"signup.firstNamePlaceholder": "Andika jina lako la kwanza",
"signup.lastName": "Jina la Familia",
"signup.lastNamePlaceholder": "Andika jina la familia",
"signup.email": "Barua Pepe",
"signup.emailPlaceholder": "Andika barua pepe yako",
"signup.emailHelp": "Unaweza kuthibitisha barua pepe baada ya kuunda akaunti.",
"signup.password": "Unda Nenosiri",
"signup.passwordPlaceholder": "Unda nenosiri",
"signup.passwordHelp": "Tumia angalau herufi 8.",
"signup.dateOfBirth": "Tarehe ya Kuzaliwa",
"signup.ageHelp": "Umri wako unahesabiwa kiotomatiki.",
"signup.youAre": "Una",
"signup.yearsOld": "miaka.",
"signup.gender": "Jinsia",
"signup.selectGender": "Chagua jinsia yako",
"signup.male": "Mwanaume",
"signup.female": "Mwanamke",
"signup.whereLive": "Unaishi wapi?",
"signup.selectCountry": "Chagua nchi",
"signup.rwanda": "Rwanda",
"signup.burundi": "Burundi",
"signup.otherCountry": "Nchi Nyingine",
"signup.district": "Wilaya",
"signup.province": "Mkoa",
"signup.countryOfResidence": "Nchi Unayoishi",
"signup.location": "Mahali",
"signup.selectCountryFirst": "Chagua nchi kwanza",
"signup.selectDistrict": "Chagua wilaya yako",
"signup.selectProvince": "Chagua mkoa wako",
"signup.selectYourCountry": "Chagua nchi yako",
"signup.phone": "Nambari ya Simu",
"signup.phonePlaceholder": "Andika nambari ya simu",
"signup.phoneHelp": "Nambari ya simu husaidia kulinda akaunti yako.",
"signup.referralCode": "Nambari ya Rufaa",
"signup.referralPlaceholder": "Andika nambari ya rufaa",
"signup.referralHelp": "Ikiwa mwanachama wa UMUHUZA amekualika, andika nambari yake.",
"signup.terms": "Nakubali Sheria na Sera ya Faragha ya UMUHUZA",
"signup.continue": "Endelea",
"signup.creating": "Inaunda akaunti...",
"signup.alreadyMember": "Tayari una akaunti?",
"signup.login": "Ingia",
"signup.heroTitle": "Anza Safari Yako ya Upendo",
"signup.heroSubtitle": "Jiunge na watu wa kweli wanaotafuta uhusiano wa maana.",

"aboutYou.title": "Kuhusu Wewe",
"aboutYou.subtitle": "Chagua chaguo zinazokuelezea.",
"aboutYou.heroTitle": "Tuambie Kuhusu Wewe",
"aboutYou.heroSubtitle": "Tusaidie kuelewa unachotafuta ili UMUHUZA ikusaidie kupata uhusiano wa maana.",
"aboutYou.personalStatus": "Hali yako",
"aboutYou.lookingFor": "Unatafuta",
"aboutYou.relationshipGoal": "Lengo la Uhusiano",
"aboutYou.continue": "Endelea",
"aboutYou.saving": "Inahifadhi...",

"profileSetup.title": "Jenga Wasifu Wako",
"profileSetup.subtitle": "Ongeza picha yako halisi na uchague mambo unayopenda.",
"profileSetup.heroTitle": "Unda Wasifu Wako wa UMUHUZA",
"profileSetup.heroSubtitle": "Onyesha wewe mwenyewe ili watu wa kweli wakugundue.",
"profileSetup.mainPhoto": "Picha Kuu ya Wasifu",
"profileSetup.mainPhotoRequired": "Picha kuu inahitajika na itaonekana kwenye wasifu wako.",
"profileSetup.takePhoto": "Piga Picha",
"profileSetup.retakePhoto": "Piga Picha Tena",
"profileSetup.chooseGallery": "Chagua kutoka Galeri",
"profileSetup.changePhoto": "Badilisha Picha",
"profileSetup.interests": "Mambo Unayopenda",
"profileSetup.interestsHelp": "Chagua mambo yanayokuelezea.",
"profileSetup.finish": "Maliza Wasifu ❤️",
"profileSetup.saving": "Inahifadhi wasifu...",
"profileSetup.realPhotoPolicy": "Sera ya Picha Halisi",
"profileSetup.realPhotoText": "Tumia picha yako halisi. UMUHUZA ni kwa watu wa kweli wanaotafuta upendo wa kweli.",
"interest.love": "❤️ Upendo",
"interest.music": "🎵 Muziki",
"interest.travel": "✈️ Kusafiri",
"interest.sports": "⚽ Michezo",
"interest.reading": "📚 Kusoma",
"interest.movies": "🎬 Filamu",
"interest.cooking": "🍳 Kupika",
"interest.nature": "🌿 Asili",
"interest.dancing": "💃 Kucheza",
"interest.fitness": "🏋️ Mazoezi",
"interest.faith": "🙏 Imani",
"interest.art": "🎨 Sanaa",
"signup.stepAccount": "Akaunti",
"signup.stepAbout": "Kuhusu Wewe",
"signup.stepProfile": "Wasifu",

"aboutYou.selectStatus": "Chagua hali yako",
"aboutYou.selectLookingFor": "Chagua unayemtafuta",
"aboutYou.selectGoal": "Chagua lengo la uhusiano",
"aboutYou.lookingHelp": "UMUHUZA itatumia hii kukusaidia kupata watu wanaofaa.",
"aboutYou.goalHelp": "Chagua unachotafuta kweli kwenye UMUHUZA.",
"aboutYou.personalStatus": "Hali yako",
"aboutYou.lookingFor": "Unatafuta nani?",
"aboutYou.relationshipGoal": "Lengo la Uhusiano",

"status.single": "Sijaolewa / Sijaowa",
"status.divorced": "Nimetalikiwa",
"status.widowed": "Mjane",
"status.separated": "Tumeachana",

"looking.men": "👨 Wanaume",
"looking.women": "👩 Wanawake",
"looking.both": "👨 Wanaume & 👩 Wanawake",

"goal.marriage": "💍 Ndoa",
"goal.serious": "❤️ Uhusiano wa Kweli",
"goal.friendship": "🤝 Urafiki",
"goal.gettingToKnow": "💕 Kujuana",
"profileSetup.compressNote": ".",
"profileSetup.errorMainPhoto": "Tafadhali pakia picha yako kuu. Picha halisi inahitajika.",
"profileSetup.errorInterests": "Tafadhali chagua angalau kitu kimoja unachopenda.",
"profileSetup.errorCamera": "Imeshindikana kupiga picha. Angalia ruhusa ya kamera.",
"profileSetup.errorInvalidImage": "Tafadhali chagua picha halali.",
"profileSetup.errorImageTooLarge": "Picha hii ni kubwa sana. Chagua picha chini ya 20 MB.",
"profileSetup.errorCompress": "Picha haikuweza kupunguzwa chini ya 250 KB. Chagua nyingine.",
"profileSetup.errorSession": "Kikao chako kimeisha. Tafadhali ingia tena.",
"profileSetup.errorGeneric": "Hatukuweza kuhifadhi wasifu wako. Jaribu tena.",
"profileSetup.saving": "Inahifadhi wasifu...",
"profileSetup.finish": "Maliza Wasifu ❤️",
"profileSetup.retakePhoto": "Piga Picha Tena",
"profileSetup.takePhoto": "Piga Picha",
"profileSetup.changePhoto": "Badilisha Picha",
"profileSetup.chooseGallery": "Chagua kutoka Galeri",
"profileSetup.realPhotoPolicy": "Sera ya Picha Halisi",
"profileSetup.realPhotoText": "Tumia picha yako halisi.",
"profileSetup.realPhotoDesc": "UMUHUZA ni kwa watu wa kweli wanaotafuta upendo wa kweli. Picha bandia haziruhusiwi.",
  },
};

// =====================================================
// PROVIDER
// =====================================================

export function AppPreferencesProvider({ children }) {
  const [language, setLanguageState] =
    useState(DEFAULT_LANGUAGE);

  const [theme, setThemeState] =
    useState(DEFAULT_THEME);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [preferencesLoading, setPreferencesLoading] =
    useState(true);

  // =====================================================
  // AUTH LISTENER (Supabase)
  // =====================================================

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setCurrentUser(session?.user ?? null);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const user = session?.user ?? null;

        setCurrentUser(user);

        if (!user) {
          // Not logged in → use general localStorage
          const savedLanguage =
            localStorage.getItem("kundwa_language");

          const savedTheme =
            localStorage.getItem("kundwa_theme");

          setLanguageState(
            savedLanguage || DEFAULT_LANGUAGE
          );

          setThemeState(
            savedTheme || DEFAULT_THEME
          );

          setPreferencesLoading(false);
          return;
        }

        // Logged in → try user-specific preferences
        const localKey =
          `kundwa_preferences_${user.id}`;

        const savedLocal =
          localStorage.getItem(localKey);

        if (savedLocal) {
          try {
            const parsed =
              JSON.parse(savedLocal);

            if (parsed.language) {
              setLanguageState(
                parsed.language
              );
            }

            if (parsed.theme) {
              setThemeState(
                parsed.theme
              );
            }
          } catch (err) {
            console.error(
              "Error reading local preferences:",
              err
            );
          }
        }

        // Also try to load from profiles table
        try {
          const { data } = await supabase
            .from("profiles")
            .select("preferences")
            .eq("id", user.id)
            .maybeSingle();

          if (data?.preferences) {
            if (
              data.preferences.language &&
              !savedLocal
            ) {
              setLanguageState(
                data.preferences.language
              );
            }

            if (
              data.preferences.theme &&
              !savedLocal
            ) {
              setThemeState(
                data.preferences.theme
              );
            }
          }
        } catch (err) {
          console.error(
            "Unable to load preferences from Supabase:",
            err
          );
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

    root.classList.remove(
      "light",
      "dark"
    );

    let resolved = theme;

    if (theme === "system") {
      resolved = window
        .matchMedia(
          "(prefers-color-scheme: dark)"
        )
        .matches
        ? "dark"
        : "light";
    }

    root.classList.add(resolved);

    root.setAttribute(
      "data-kundwa-theme",
      resolved
    );

    try {
      localStorage.setItem(
        "kundwa_theme",
        theme
      );
    } catch {}
  }, [theme]);

  // =====================================================
  // SYSTEM THEME LISTENER
  // =====================================================

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemTheme = (event) => {
      const resolved = event.matches
        ? "dark"
        : "light";

      document.documentElement.classList.remove(
        "light",
        "dark"
      );

      document.documentElement.classList.add(
        resolved
      );

      document.documentElement.setAttribute(
        "data-kundwa-theme",
        resolved
      );
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemTheme
    );

    return () =>
      mediaQuery.removeEventListener(
        "change",
        handleSystemTheme
      );
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
        const localKey =
          `kundwa_preferences_${currentUser.id}`;

        localStorage.setItem(
          localKey,
          JSON.stringify(preferences)
        );

        // Also save to profiles table
        await supabase
          .from("profiles")
          .update({
            preferences,
            updatedAt:
              new Date().toISOString(),
          })
          .eq("id", currentUser.id);
      } else {
        localStorage.setItem(
          "kundwa_language",
          newLanguage
        );

        localStorage.setItem(
          "kundwa_theme",
          newTheme
        );
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Unable to save preferences:",
        error
      );

      return {
        success: false,
        error,
      };
    }
  };

  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================

  const changeLanguage = async (
    newLanguage
  ) => {
    if (!translations[newLanguage]) {
      console.error(
        "Unsupported language:",
        newLanguage
      );

      return false;
    }

    const result =
      await savePreferences({
        newLanguage,
        newTheme: theme,
      });

    return result.success;
  };

  // =====================================================
  // CHANGE THEME
  // =====================================================

  const changeTheme = async (
    newTheme
  ) => {
    const validThemes = [
      "light",
      "dark",
      "system",
    ];

    if (!validThemes.includes(newTheme)) {
      console.error(
        "Unsupported theme:",
        newTheme
      );

      return false;
    }

    const result =
      await savePreferences({
        newLanguage: language,
        newTheme,
      });

    return result.success;
  };

  // =====================================================
  // TRANSLATION FUNCTION
  // =====================================================

  const t = (key) => {
    if (
      !translations ||
      !translations[language]
    ) {
      return (
        translations.en?.[key] ||
        key
      );
    }

    return (
      translations[language][key] ||
      translations.en?.[key] ||
      key
    );
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
    <AppPreferencesContext.Provider
      value={value}
    >
      {children}
    </AppPreferencesContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useAppPreferences() {
  const context =
    useContext(AppPreferencesContext);

  if (!context) {
    throw new Error(
      "useAppPreferences must be used inside AppPreferencesProvider"
    );
  }

  return context;
}

export default AppPreferencesContext;
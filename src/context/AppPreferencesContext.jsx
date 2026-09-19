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
  "I am a kind, positive and genuine person looking for meaningful connections. I enjoy spending time with good people, discovering new experiences and building relationships based on honesty and respect.",
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
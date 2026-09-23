import "./Auth.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";

import {
  FiUser,
  FiMail,
  FiLock,
  FiCalendar,
  FiPhone,
  FiGlobe,
  FiMapPin,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";

function Signup() {
  const navigate = useNavigate();

  // =====================================================
  // REFERRAL
  // =====================================================

  const [referralCode, setReferralCode] =
    useState("");

  const [referralMessage, setReferralMessage] =
    useState("");

  // =====================================================
  // REFERRAL CODE FROM URL
  // =====================================================

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const ref =
      params.get("ref");

    if (ref) {
      const cleanReferralCode =
        ref.trim().toUpperCase();

      setReferralCode(
        cleanReferralCode
      );

      setReferralMessage(
        "You were invited to join UMUHUZA ❤️"
      );
    }
  }, []);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [location, setLocation] =
    useState("");

  // =====================================================
  // PHONE
  // =====================================================

  const [phoneCountryCode, setPhoneCountryCode] =
    useState("+250");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  // Used when user chooses "Other"
  const [customPhoneCountryCode, setCustomPhoneCountryCode] =
    useState("");

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // RWANDA DISTRICTS
  // =====================================================

  const rwandaDistricts = [
    "Gasabo",
    "Kicukiro",
    "Nyarugenge",

    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",

    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyamagabe",
    "Nyanza",
    "Nyaruguru",
    "Ruhango",

    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",

    "Burera",
    "Gakenke",
    "Gicumbi",
    "Musanze",
    "Rulindo",
  ];

  // =====================================================
  // BURUNDI PROVINCES
  // =====================================================

  const burundiProvinces = [
    "Bubanza",
    "Bujumbura Mairie",
    "Bujumbura Rural",
    "Bururi",
    "Cankuzo",
    "Cibitoke",
    "Gitega",
    "Karuzi",
    "Kayanza",
    "Kirundo",
    "Makamba",
    "Muramvya",
    "Muyinga",
    "Mwaro",
    "Ngozi",
    "Rumonge",
    "Rutana",
    "Ruyigi",
  ];

  // =====================================================
  // COUNTRY OPTIONS
  // =====================================================

  const countries = [
    {
      code: "RW",
      name: "Rwanda",
      flag: "🇷🇼",
    },

    {
      code: "BI",
      name: "Burundi",
      flag: "🇧🇮",
    },

    {
      code: "US",
      name: "United States",
      flag: "🇺🇸",
    },

    {
      code: "CA",
      name: "Canada",
      flag: "🇨🇦",
    },

    {
      code: "GB",
      name: "United Kingdom",
      flag: "🇬🇧",
    },

    {
      code: "BE",
      name: "Belgium",
      flag: "🇧🇪",
    },

    {
      code: "FR",
      name: "France",
      flag: "🇫🇷",
    },

    {
      code: "DE",
      name: "Germany",
      flag: "🇩🇪",
    },

    {
      code: "SE",
      name: "Sweden",
      flag: "🇸🇪",
    },

    {
      code: "NL",
      name: "Netherlands",
      flag: "🇳🇱",
    },

    {
      code: "AU",
      name: "Australia",
      flag: "🇦🇺",
    },

    {
      code: "NZ",
      name: "New Zealand",
      flag: "🇳🇿",
    },

    {
      code: "CH",
      name: "Switzerland",
      flag: "🇨🇭",
    },

    {
      code: "IT",
      name: "Italy",
      flag: "🇮🇹",
    },

    {
      code: "ES",
      name: "Spain",
      flag: "🇪🇸",
    },

    {
      code: "ZA",
      name: "South Africa",
      flag: "🇿🇦",
    },

    {
      code: "UG",
      name: "Uganda",
      flag: "🇺🇬",
    },

    {
      code: "KE",
      name: "Kenya",
      flag: "🇰🇪",
    },

    {
      code: "TZ",
      name: "Tanzania",
      flag: "🇹🇿",
    },

    {
      code: "CD",
      name: "Democratic Republic of the Congo",
      flag: "🇨🇩",
    },

    {
      code: "OTHER",
      name: "Other Country",
      flag: "🌍",
    },
  ];

  // =====================================================
  // PHONE COUNTRY CODES
  // =====================================================

  const phoneCodes = [
    {
      code: "+250",
      country: "Rwanda",
      flag: "🇷🇼",
    },

    {
      code: "+257",
      country: "Burundi",
      flag: "🇧🇮",
    },

    {
      code: "+1",
      country: "United States / Canada",
      flag: "🇺🇸",
    },

    {
      code: "+32",
      country: "Belgium",
      flag: "🇧🇪",
    },

    {
      code: "+33",
      country: "France",
      flag: "🇫🇷",
    },

    {
      code: "+44",
      country: "United Kingdom",
      flag: "🇬🇧",
    },

    {
      code: "+49",
      country: "Germany",
      flag: "🇩🇪",
    },

    {
      code: "+46",
      country: "Sweden",
      flag: "🇸🇪",
    },

    {
      code: "+31",
      country: "Netherlands",
      flag: "🇳🇱",
    },

    {
      code: "+27",
      country: "South Africa",
      flag: "🇿🇦",
    },

    {
      code: "+256",
      country: "Uganda",
      flag: "🇺🇬",
    },

    {
      code: "+254",
      country: "Kenya",
      flag: "🇰🇪",
    },

    {
      code: "+255",
      country: "Tanzania",
      flag: "🇹🇿",
    },

    {
      code: "+243",
      country: "DR Congo",
      flag: "🇨🇩",
    },

    {
      code: "+61",
      country: "Australia",
      flag: "🇦🇺",
    },

    {
      code: "+64",
      country: "New Zealand",
      flag: "🇳🇿",
    },

    {
      code: "+41",
      country: "Switzerland",
      flag: "🇨🇭",
    },

    // ===================================================
    // OTHER
    // ===================================================

    {
      code: "OTHER",
      country: "Other",
      flag: "🌍",
    },
  ];

  // =====================================================
  // CALCULATE AGE
  // =====================================================

  const calculateAge = (
    birthDate
  ) => {
    if (!birthDate) {
      return null;
    }

    const today =
      new Date();

    const birth =
      new Date(
        `${birthDate}T00:00:00`
      );

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() -
      birth.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  };

  // =====================================================
  // CURRENT AGE
  // =====================================================

  const currentAge =
    dateOfBirth
      ? calculateAge(dateOfBirth)
      : null;

  // =====================================================
  // COUNTRY CHANGE
  // =====================================================

  const handleCountryChange = (
    event
  ) => {
    const selectedCountry =
      event.target.value;

    setCountry(
      selectedCountry
    );

    setLocation("");

    if (
      selectedCountry === "rwanda"
    ) {
      setPhoneCountryCode(
        "+250"
      );

      setCustomPhoneCountryCode("");
    } else if (
      selectedCountry === "burundi"
    ) {
      setPhoneCountryCode(
        "+257"
      );

      setCustomPhoneCountryCode("");
    }
  };

  // =====================================================
  // PHONE COUNTRY CODE CHANGE
  // =====================================================

  const handlePhoneCountryCodeChange = (
    event
  ) => {
    const value =
      event.target.value;

    setPhoneCountryCode(value);

    if (value !== "OTHER") {
      setCustomPhoneCountryCode("");
    }
  };

  // =====================================================
  // GENERATE MEMBER REFERRAL CODE
  // =====================================================

  const generateReferralCode =
    () => {
      const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

      let randomPart =
        "";

      for (
        let i = 0;
        i < 6;
        i++
      ) {
        const randomIndex =
          Math.floor(
            Math.random() *
              characters.length
          );

        randomPart +=
          characters[randomIndex];
      }

      return `UMUHUZA-${randomPart}`;
    };

  // =====================================================
  // SIGN UP
  // =====================================================

  const handleSignup =
    async () => {
      setError("");

      // =================================================
      // BASIC VALIDATION
      // =================================================

      if (!firstName.trim()) {
        setError(
          "Please enter your first name."
        );

        return;
      }

      if (!lastName.trim()) {
        setError(
          "Please enter your last name."
        );

        return;
      }

      if (!email.trim()) {
        setError(
          "Please enter your email address."
        );

        return;
      }

      // =================================================
      // EMAIL FORMAT
      // =================================================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          email.trim()
        )
      ) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }

      if (!password) {
        setError(
          "Please create a password."
        );

        return;
      }

      if (password.length < 8) {
        setError(
          "Password must contain at least 8 characters."
        );

        return;
      }

      if (!dateOfBirth) {
        setError(
          "Please select your date of birth."
        );

        return;
      }

      const age =
        calculateAge(
          dateOfBirth
        );

      if (
        age === null ||
        age < 0
      ) {
        setError(
          "Please enter a valid date of birth."
        );

        return;
      }

      if (age < 18) {
        setError(
          "You must be at least 18 years old to join UMUHUZA."
        );

        return;
      }

      if (age > 100) {
        setError(
          "Please enter a valid date of birth."
        );

        return;
      }

      if (!gender) {
        setError(
          "Please select your gender."
        );

        return;
      }

      if (!country) {
        setError(
          "Please select your country."
        );

        return;
      }

      if (!location) {
        setError(
          country === "rwanda"
            ? "Please select your district."
            : country === "burundi"
            ? "Please select your province."
            : "Please select the country you live in."
        );

        return;
      }

      // =================================================
      // PHONE VALIDATION
      // =================================================

      if (!phoneNumber.trim()) {
        setError(
          "Please enter your phone number."
        );

        return;
      }

      // =================================================
      // DETERMINE EFFECTIVE PHONE CODE
      // =================================================

      let effectivePhoneCountryCode =
        phoneCountryCode;

      if (
        phoneCountryCode === "OTHER"
      ) {
        const cleanCustomCode =
          customPhoneCountryCode
            .trim()
            .replace(/\s+/g, "");

        if (!cleanCustomCode) {
          setError(
            "Please enter your country phone code."
          );

          return;
        }

        if (
          !/^\+\d{1,4}$/.test(
            cleanCustomCode
          )
        ) {
          setError(
            "Please enter a valid country phone code, for example +91 or +234."
          );

          return;
        }

        effectivePhoneCountryCode =
          cleanCustomCode;
      }

      // =================================================
      // TERMS
      // =================================================

      if (!termsAccepted) {
        setError(
          "Please agree to the UMUHUZA Terms & Privacy Policy."
        );

        return;
      }

      // =================================================
      // CLEAN REFERRAL CODE
      // =================================================

      const cleanReferredBy =
        referralCode
          ? referralCode
              .trim()
              .toUpperCase()
          : null;

      // =================================================
      // LOCATION DATA
      // =================================================

      let displayCountry =
        "";

      let displayLocation =
        "";

      if (country === "rwanda") {
        displayCountry =
          "Rwanda";

        displayLocation =
          location;
      } else if (
        country === "burundi"
      ) {
        displayCountry =
          "Burundi";

        displayLocation =
          location;
      } else {
        const selectedCountry =
          countries.find(
            (item) =>
              item.name.toLowerCase() ===
              location.toLowerCase()
          );

        displayCountry =
          selectedCountry
            ? selectedCountry.name
            : location;

        displayLocation =
          displayCountry;
      }

      // =================================================
      // GENERATE REFERRAL CODE
      // =================================================

      const newReferralCode =
        generateReferralCode();

      // =================================================
      // START LOADING
      // =================================================

      setLoading(true);

      try {
        // =================================================
        // CLEAN FORM DATA
        // =================================================

        const cleanFirstName =
          firstName.trim();

        const cleanLastName =
          lastName.trim();

        const cleanEmail =
          email
            .trim()
            .toLowerCase();

        // Remove spaces and non-digit characters
        const cleanPhone =
          phoneNumber
            .trim()
            .replace(/\D/g, "")
            .replace(/^0+/, "");

        if (!cleanPhone) {
          setError(
            "Please enter a valid phone number."
          );

          return;
        }

        // =================================================
        // FULL INTERNATIONAL PHONE
        // =================================================

        const fullPhone =
          `${effectivePhoneCountryCode}${cleanPhone}`;

        console.log(
          "📱 UMUHUZA PHONE:",
          {
            countryCode:
              effectivePhoneCountryCode,

            localNumber:
              cleanPhone,

            fullPhone,
          }
        );

        // =================================================
        // FULL NAME
        // =================================================

        const fullName =
          `${cleanFirstName} ${cleanLastName}`;

        // =================================================
        // USERNAME
        // =================================================

        const baseUsername =
          `${cleanFirstName}${cleanLastName}`
            .toLowerCase()
            .replace(
              /[^a-z0-9]/g,
              ""
            );

        const username =
          baseUsername ||
          `umuhuza${Date.now()}`;

        // =================================================
        // CHECK WHETHER PHONE ALREADY EXISTS
        // =================================================
        //
        // IMPORTANT:
        // This check MUST happen before auth.signUp().
        //
        // The previous version incorrectly placed this
        // inside options.data.
        //
        // =================================================

        const {
          data: existingPhone,
          error: phoneCheckError,
        } = await supabase
          .from("profiles")
          .select("id")
          .eq(
            "phone",
            fullPhone
          )
          .maybeSingle();

        if (phoneCheckError) {
          console.error(
            "UMUHUZA PHONE CHECK ERROR:",
            phoneCheckError
          );

          setError(
            "Unable to verify your phone number right now. Please try again."
          );

          return;
        }

        // =================================================
        // DUPLICATE PHONE
        // =================================================

        if (existingPhone) {
          setError(
            "This phone number is already registered with UMUHUZA. Please log in instead."
          );

          return;
        }

        // =================================================
        // SUPABASE AUTH SIGNUP
        // =================================================

        const {
          data,
          error: signupError,
        } =
          await supabase.auth.signUp({
            email:
              cleanEmail,

            password:
              password,

            options: {
              data: {
                // =================================================
                // PROFILE
                // =================================================

                full_name:
                  fullName,

                username:
                  username,

                bio:
                  "",

                date_of_birth:
                  dateOfBirth,

                gender:
                  gender,

                country:
                  displayCountry,

                city:
                  displayLocation,

                profile_photo_url:
                  "",

                // =================================================
                // ACCOUNT INFORMATION
                // =================================================

                first_name:
                  cleanFirstName,

                last_name:
                  cleanLastName,

                age:
                  age,

                // =================================================
                // PHONE
                // =================================================

                phone_country_code:
                  effectivePhoneCountryCode,

                phone_number:
                  cleanPhone,

                phone:
                  fullPhone,

                phone_verified:
                  false,

                // =================================================
                // REFERRAL
                // =================================================

                referral_code:
                  newReferralCode,

                referred_by:
                  cleanReferredBy,

                referral_code_used:
                  cleanReferredBy,

                referral_count:
                  0,

                successful_referrals:
                  0,

                referral_rewards:
                  0,

                referral_reward_level:
                  0,

                referral_special_reward:
                  false,

                referral_reward_claimed:
                  0,

                claimed_rewards:
                  {},

                // =================================================
                // SIGNUP STATUS
                // =================================================

                signup_step:
                  1,

                account_completed:
                  true,

                about_you_completed:
                  false,

                profile_completed:
                  false,

                can_send_interest:
                  false,

                // =================================================
                // TERMS
                // =================================================

                terms_accepted:
                  true,
              },
            },
          });

        // =================================================
        // SUPABASE AUTH ERROR
        // =================================================

        if (signupError) {
          console.error(
            "UMUHUZA Supabase signup error:",
            signupError
          );

          const rawMessage =
            signupError?.message ||
            "";

          const message =
            rawMessage.toLowerCase();

          // =================================================
          // EMAIL ALREADY REGISTERED
          // =================================================

          if (
            message.includes(
              "user already registered"
            ) ||
            message.includes(
              "already registered"
            ) ||
            message.includes(
              "email address is already registered"
            )
          ) {
            setError(
              "This email is already registered. Please log in."
            );
          }

          // =================================================
          // INVALID EMAIL
          // =================================================

          else if (
            message.includes("invalid") &&
            message.includes("email")
          ) {
            setError(
              "Please enter a valid email address."
            );
          }

          // =================================================
          // PASSWORD ERROR
          // =================================================

          else if (
            message.includes("password")
          ) {
            setError(
              rawMessage ||
              "Your password could not be accepted."
            );
          }

          // =================================================
          // RATE LIMIT
          // =================================================

          else if (
            message.includes(
              "rate limit"
            ) ||
            message.includes(
              "too many requests"
            ) ||
            message.includes(
              "too many"
            ) ||
            message.includes(
              "over_email_send_rate_limit"
            )
          ) {
            setError(
              "Signup is temporarily unavailable. Please try again in a little while."
            );
          }

          // =================================================
          // CAPTCHA / SECURITY
          // =================================================

          else if (
            message.includes(
              "captcha"
            )
          ) {
            setError(
              "Signup security verification could not be completed. Please try again."
            );
          }

          // =================================================
          // NETWORK
          // =================================================

          else if (
            message.includes(
              "network"
            ) ||
            message.includes(
              "fetch"
            ) ||
            message.includes(
              "failed to fetch"
            )
          ) {
            setError(
              "Unable to connect to UMUHUZA right now. Please check your internet connection and try again."
            );
          }

          // =================================================
          // DEFAULT
          // =================================================

          else {
            setError(
              rawMessage ||
              "Something went wrong while creating your account."
            );
          }

          return;
        }

        // =================================================
        // VERIFY USER
        // =================================================

        const createdUser =
          data?.user;

        if (!createdUser) {
          setError(
            "Your account could not be created. Please try again."
          );

          return;
        }

        // =================================================
        // SAVE PHONE TO PROFILES
        // =================================================

        const {
          error: profilePhoneError,
        } =
          await supabase
            .from("profiles")
            .update({
              phone_country_code:
                effectivePhoneCountryCode,

              phone_number:
                cleanPhone,

              phone:
                fullPhone,

              phone_verified:
                false,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              createdUser.id
            );

        if (profilePhoneError) {
          console.error(
            "UMUHUZA PROFILE PHONE SAVE ERROR:",
            profilePhoneError
          );

          // Handle duplicate caused by the database
          // unique index.
          if (
            profilePhoneError.code ===
              "23505" ||
            profilePhoneError.message
              ?.toLowerCase()
              .includes(
                "duplicate"
              ) ||
            profilePhoneError.message
              ?.toLowerCase()
              .includes(
                "unique"
              )
          ) {
            setError(
              "This phone number is already registered with UMUHUZA. Please log in instead."
            );

            return;
          }

          setError(
            "Your account was created, but we could not save your phone number. Please try again."
          );

          return;
        }

        // =================================================
        // ACCOUNT CREATED
        // =================================================

        console.log(
          "=========================================="
        );

        console.log(
          "UMUHUZA SUPABASE ACCOUNT CREATED"
        );

        console.log(
          "User ID:",
          createdUser.id
        );

        console.log(
          "Email:",
          createdUser.email
        );

        console.log(
          "Phone:",
          fullPhone
        );

        console.log(
          "Session available:",
          !!data?.session
        );

        console.log(
          "=========================================="
        );

        // =================================================
        // CONTINUE
        // =================================================

        navigate(
          "/about-you"
        );

      } catch (signupError) {
        console.error(
          "=========================================="
        );

        console.error(
          "UMUHUZA UNEXPECTED SIGNUP ERROR"
        );

        console.error(
          signupError
        );

        console.error(
          "=========================================="
        );

        const rawMessage =
          signupError?.message ||
          "";

        const message =
          rawMessage.toLowerCase();

        // =================================================
        // DUPLICATE PHONE
        // =================================================

        if (
          message.includes(
            "duplicate"
          ) ||
          message.includes(
            "unique"
          ) ||
          message.includes(
            "phone"
          ) &&
          message.includes(
            "already"
          )
        ) {
          setError(
            "This phone number is already registered with UMUHUZA. Please log in instead."
          );
        }

        // =================================================
        // RATE LIMIT
        // =================================================

        else if (
          message.includes(
            "rate limit"
          ) ||
          message.includes(
            "too many requests"
          ) ||
          message.includes(
            "too many"
          ) ||
          message.includes(
            "over_email_send_rate_limit"
          )
        ) {
          setError(
            "Signup is temporarily unavailable. Please try again in a little while."
          );
        }

        // =================================================
        // NETWORK
        // =================================================

        else if (
          message.includes(
            "network"
          ) ||
          message.includes(
            "failed to fetch"
          ) ||
          message.includes(
            "fetch"
          )
        ) {
          setError(
            "Unable to connect to UMUHUZA right now. Please check your internet connection and try again."
          );
        }

        // =================================================
        // DEFAULT
        // =================================================

        else {
          setError(
            rawMessage ||
            "Something went wrong while creating your account."
          );
        }

      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="auth-welcome">

<div className="premium-logo">
  <img src={umurangaLogo} alt="UMUHUZA" />
</div>

          <h1>
            Start Your
            <br />
            Love Journey
          </h1>

          <p>
            Join genuine people looking
            for meaningful connections.
          </p>

          <div className="auth-hearts">
            ❤️ 💕 ❤️
          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="auth-form-container">

          <div className="auth-form">

            {/* =================================================
                TITLE
            ================================================= */}

            <h2>
              Create Your Account
            </h2>

            <p className="auth-subtitle">
              Let's start with the basics.
            </p>

            {/* =================================================
                STEP INDICATOR
            ================================================= */}

            <div className="signup-progress">

              <div className="progress-step active">
                <span>
                  1
                </span>

                <small>
                  Account
                </small>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>
                  2
                </span>

                <small>
                  About You
                </small>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>
                  3
                </span>

                <small>
                  Profile
                </small>
              </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* =================================================
                FIRST NAME
            ================================================= */}

            <div className="form-group">

              <label htmlFor="firstName">
                First Name
              </label>

              <div className="input-wrapper">

                <FiUser />

                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>

            {/* =================================================
                LAST NAME
            ================================================= */}

            <div className="form-group">

              <label htmlFor="lastName">
                Last Name
              </label>

              <div className="input-wrapper">

                <FiUser />

                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <FiMail />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              <small className="input-help">
                You can verify your email
                after creating your account.
              </small>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-group">

              <label htmlFor="password">
                Create Password
              </label>

              <div className="input-wrapper">

                <FiLock />

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              <small className="input-help">
                Use at least 8 characters.
              </small>

            </div>

            {/* =================================================
                DATE OF BIRTH
            ================================================= */}

            <div className="form-group">

              <label htmlFor="dateOfBirth">
                Date of Birth
              </label>

              <div className="input-wrapper">

                <FiCalendar />

                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              <small className="input-help">

                Your age is calculated automatically.

                {currentAge !== null &&
                  currentAge >= 0 && (
                    <>
                      {" "}
                      You are{" "}
                      <strong>
                        {currentAge}
                      </strong>{" "}
                      years old.
                    </>
                  )}

              </small>

            </div>

            {/* =================================================
                GENDER
            ================================================= */}

            <div className="form-group">

              <label htmlFor="gender">
                Gender
              </label>

              <div className="input-wrapper">

                <FiUser />

                <select
                  id="gender"
                  value={gender}
                  onChange={(event) =>
                    setGender(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >

                  <option value="">
                    Select your gender
                  </option>

                  <option value="male">
                    👨 Male
                  </option>

                  <option value="female">
                    👩 Female
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                COUNTRY
            ================================================= */}

            <div className="form-group">

              <label htmlFor="country">
                Where do you live?
              </label>

              <div className="input-wrapper">

                <FiGlobe />

                <select
                  id="country"
                  value={country}
                  onChange={
                    handleCountryChange
                  }
                  disabled={loading}
                >

                  <option value="">
                    Select your country
                  </option>

                  <option value="rwanda">
                    🇷🇼 Rwanda
                  </option>

                  <option value="burundi">
                    🇧🇮 Burundi
                  </option>

                  <option value="other">
                    🌍 Other Country
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="form-group">

              <label htmlFor="location">

                {country === "rwanda"
                  ? "District"
                  : country === "burundi"
                  ? "Province"
                  : country === "other"
                  ? "Country of Residence"
                  : "Location"}

              </label>

              <div className="input-wrapper">

                <FiMapPin />

                <select
                  id="location"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  disabled={
                    loading ||
                    !country
                  }
                >

                  <option value="">

                    {!country
                      ? "Select country first"
                      : country === "rwanda"
                      ? "Select your district"
                      : country === "burundi"
                      ? "Select your province"
                      : "Select your country"}

                  </option>

                  {/* RWANDA */}

                  {country === "rwanda" &&
                    rwandaDistricts.map(
                      (district) => (
                        <option
                          key={district}
                          value={district}
                        >
                          {district}
                        </option>
                      )
                    )}

                  {/* BURUNDI */}

                  {country === "burundi" &&
                    burundiProvinces.map(
                      (province) => (
                        <option
                          key={province}
                          value={province}
                        >
                          {province}
                        </option>
                      )
                    )}

                  {/* OTHER COUNTRIES */}

                  {country === "other" &&
                    countries
                      .filter(
                        (item) =>
                          item.code !== "RW" &&
                          item.code !== "BI" &&
                          item.code !== "OTHER"
                      )
                      .map(
                        (item) => (
                          <option
                            key={item.code}
                            value={item.name}
                          >
                            {item.flag}{" "}
                            {item.name}
                          </option>
                        )
                      )}

                </select>

              </div>

              <small className="input-help">

                {country === "rwanda" &&
                  "Select your district in Rwanda."}

                {country === "burundi" &&
                  "Select your province in Burundi."}

                {country === "other" &&
                  "Your profile will be displayed as Diaspora."}

                {!country &&
                  "Choose your country first."}

              </small>

            </div>

            {/* =================================================
                PHONE
            ================================================= */}

            <div className="form-group">

              <label htmlFor="phoneNumber">
                Phone Number
              </label>

              <div className="phone-input-group">

                <div className="phone-code-wrapper">

                  <FiPhone />

                  <select
                    value={
                      phoneCountryCode
                    }
                    onChange={
                      handlePhoneCountryCodeChange
                    }
                    disabled={loading}
                    aria-label="Phone country code"
                  >

                    {phoneCodes.map(
                      (item) => (
                        <option
                          key={item.code}
                          value={item.code}
                        >
                          {item.flag}{" "}
                          {item.code}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  autoComplete="tel-national"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              {/* =================================================
                  CUSTOM COUNTRY CODE
              ================================================= */}

              {phoneCountryCode ===
                "OTHER" && (
                <div
                  className="form-group"
                  style={{
                    marginTop: "10px",
                  }}
                >

                  <label htmlFor="customPhoneCountryCode">
                    Country Phone Code
                  </label>

                  <div className="input-wrapper">

                    <FiGlobe />

                    <input
                      id="customPhoneCountryCode"
                      type="tel"
                      placeholder="Example: +91"
                      value={
                        customPhoneCountryCode
                      }
                      onChange={(event) => {
                        let value =
                          event.target.value;

                        value =
                          value.replace(
                            /[^\d+]/g,
                            ""
                          );

                        if (
                          value &&
                          !value.startsWith("+")
                        ) {
                          value =
                            `+${value}`;
                        }

                        setCustomPhoneCountryCode(
                          value
                        );
                      }}
                      disabled={loading}
                      inputMode="tel"
                    />

                  </div>

                  <small className="input-help">
                    Enter your country's calling
                    code, for example +91, +234,
                    +254 or +33.
                  </small>

                </div>
              )}

              <small className="input-help">
                Your phone number helps keep
                your UMUHUZA account secure.
              </small>

            </div>

            {/* =================================================
                REFERRAL CODE
            ================================================= */}

            <div className="form-group referral-signup-group">

              <label htmlFor="referralCode">
                Referral Code
              </label>

              <div className="input-wrapper">

                <span className="referral-input-icon">
                  🎁
                </span>

                <input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(event) => {

                    setReferralCode(
                      event.target.value
                        .toUpperCase()
                    );

                    setReferralMessage("");

                  }}
                  disabled={loading}
                />

              </div>

              {referralMessage ? (
                <small className="input-help referral-success-message">
                  💕 {referralMessage}
                </small>
              ) : (
                <small className="input-help">
                  If a UMUHUZA member invited you,
                  enter their referral code.
                </small>
              )}

            </div>

            {/* =================================================
                TERMS
            ================================================= */}

            <div className="terms">

              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(
                    event.target.checked
                  )
                }
                disabled={loading}
              />

              <label htmlFor="terms">

                I agree to the UMUHUZA{" "}

                <span>
                  Terms & Privacy Policy
                </span>

              </label>

            </div>

            {/* =================================================
                CONTINUE
            ================================================= */}

            <button
              type="button"
              className="auth-primary-btn"
              onClick={
                handleSignup
              }
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Continue"}

              {!loading && (
                <span>
                  ❤️
                </span>
              )}

            </button>

            {/* =================================================
                LOGIN
            ================================================= */}

            <div className="auth-switch">

              <span>
                Already a member?
              </span>

              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  navigate("/login")
                }
                disabled={loading}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;
import "./Auth.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useAppPreferences } from "../../context/AppPreferencesContext";
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
  const { t } = useAppPreferences();

  // =====================================================
  // STATE
  // =====================================================
  const [referralCode, setReferralCode] = useState("");
  const [referralMessage, setReferralMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");

  const [phoneCountryCode, setPhoneCountryCode] = useState("+250");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customPhoneCountryCode, setCustomPhoneCountryCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // REFERRAL FROM URL
  // =====================================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      const cleanReferralCode = ref.trim().toUpperCase();
      setReferralCode(cleanReferralCode);
      setReferralMessage(t("signup.referralInvited") || "You were invited to join UMUHUZA ❤️");
    }
  }, [t]);

  // =====================================================
  // DATA
  // =====================================================
  const rwandaDistricts = [
    "Gasabo", "Kicukiro", "Nyarugenge", "Bugesera", "Gatsibo", "Kayonza",
    "Kirehe", "Ngoma", "Nyagatare", "Rwamagana", "Gisagara", "Huye",
    "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
    "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi",
    "Rutsiro", "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
  ];

  const burundiProvinces = [
    "Bubanza", "Bujumbura Mairie", "Bujumbura Rural", "Bururi", "Cankuzo",
    "Cibitoke", "Gitega", "Karuzi", "Kayanza", "Kirundo", "Makamba",
    "Muramvya", "Muyinga", "Mwaro", "Ngozi", "Rumonge", "Rutana", "Ruyigi",
  ];

  const countries = [
    { code: "RW", name: "Rwanda", flag: "🇷🇼" },
    { code: "BI", name: "Burundi", flag: "🇧🇮" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "CH", name: "Switzerland", flag: "🇨🇭" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "UG", name: "Uganda", flag: "🇺🇬" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
    { code: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
    { code: "OTHER", name: "Other Country", flag: "🌍" },
  ];

  const phoneCodes = [
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+243", country: "DR Congo", flag: "🇨🇩" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "OTHER", country: "Other", flag: "🌍" },
  ];

  // =====================================================
  // HELPERS
  // =====================================================
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(`${birthDate}T00:00:00`);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = dateOfBirth ? calculateAge(dateOfBirth) : null;

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    setLocation("");

    if (selectedCountry === "rwanda") {
      setPhoneCountryCode("+250");
      setCustomPhoneCountryCode("");
    } else if (selectedCountry === "burundi") {
      setPhoneCountryCode("+257");
      setCustomPhoneCountryCode("");
    }
  };

  const handlePhoneCountryCodeChange = (event) => {
    const value = event.target.value;
    setPhoneCountryCode(value);
    if (value !== "OTHER") setCustomPhoneCountryCode("");
  };

  const generateReferralCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += characters[Math.floor(Math.random() * characters.length)];
    }
    return `UMUHUZA-${randomPart}`;
  };

  // =====================================================
  // SIGN UP
  // =====================================================
  const handleSignup = async () => {
    setError("");

    if (!firstName.trim()) {
      setError(t("signup.errorFirstName") || "Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setError(t("signup.errorLastName") || "Please enter your last name.");
      return;
    }
    if (!email.trim()) {
      setError(t("signup.errorEmail") || "Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError(t("signup.errorEmailInvalid") || "Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError(t("signup.errorPassword") || "Please create a password.");
      return;
    }
    if (password.length < 8) {
      setError(t("signup.errorPasswordLength") || "Password must contain at least 8 characters.");
      return;
    }

    if (!dateOfBirth) {
      setError(t("signup.errorDob") || "Please select your date of birth.");
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (age === null || age < 0) {
      setError(t("signup.errorDobInvalid") || "Please enter a valid date of birth.");
      return;
    }
    if (age < 18) {
      setError(t("signup.errorAge") || "You must be at least 18 years old to join UMUHUZA.");
      return;
    }

    if (!gender) {
      setError(t("signup.errorGender") || "Please select your gender.");
      return;
    }
    if (!country) {
      setError(t("signup.errorCountry") || "Please select your country.");
      return;
    }
    if (!location) {
      setError(
        country === "rwanda"
          ? t("signup.errorDistrict") || "Please select your district."
          : country === "burundi"
          ? t("signup.errorProvince") || "Please select your province."
          : t("signup.errorLocation") || "Please select the country you live in."
      );
      return;
    }

    if (!phoneNumber.trim()) {
      setError(t("signup.errorPhone") || "Please enter your phone number.");
      return;
    }

    let effectivePhoneCountryCode = phoneCountryCode;
    if (phoneCountryCode === "OTHER") {
      const cleanCustomCode = customPhoneCountryCode.trim().replace(/\s+/g, "");
      if (!cleanCustomCode) {
        setError(t("signup.errorPhoneCode") || "Please enter your country phone code.");
        return;
      }
      if (!/^\+\d{1,4}$/.test(cleanCustomCode)) {
        setError(t("signup.errorPhoneCodeInvalid") || "Please enter a valid country phone code.");
        return;
      }
      effectivePhoneCountryCode = cleanCustomCode;
    }

    if (!termsAccepted) {
      setError(t("signup.errorTerms") || "Please agree to the UMUHUZA Terms & Privacy Policy.");
      return;
    }

    const cleanReferredBy = referralCode ? referralCode.trim().toUpperCase() : null;

    let displayCountry = "";
    let displayLocation = "";

    if (country === "rwanda") {
      displayCountry = "Rwanda";
      displayLocation = location;
    } else if (country === "burundi") {
      displayCountry = "Burundi";
      displayLocation = location;
    } else {
      const selectedCountry = countries.find(
        (item) => item.name.toLowerCase() === location.toLowerCase()
      );
      displayCountry = selectedCountry ? selectedCountry.name : location;
      displayLocation = displayCountry;
    }

    const newReferralCode = generateReferralCode();
    setLoading(true);

    try {
      const cleanFirstName = firstName.trim();
      const cleanLastName = lastName.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phoneNumber.trim().replace(/\D/g, "").replace(/^0+/, "");

      if (!cleanPhone) {
        setError(t("signup.errorPhoneInvalid") || "Please enter a valid phone number.");
        return;
      }

      const fullPhone = `${effectivePhoneCountryCode}${cleanPhone}`;
      const fullName = `${cleanFirstName} ${cleanLastName}`;
      const baseUsername = `${cleanFirstName}${cleanLastName}`.toLowerCase().replace(/[^a-z0-9]/g, "");
      const username = baseUsername || `umuhuza${Date.now()}`;

      // Check phone uniqueness
      const { data: existingPhone, error: phoneCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", fullPhone)
        .maybeSingle();

      if (phoneCheckError) {
        setError(t("signup.errorPhoneCheck") || "Unable to verify your phone number right now.");
        return;
      }

      if (existingPhone) {
        setError(t("signup.errorPhoneExists") || "This phone number is already registered. Please log in instead.");
        return;
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            bio: "",
            date_of_birth: dateOfBirth,
            gender,
            country: displayCountry,
            city: displayLocation,
            profile_photo_url: "",
            first_name: cleanFirstName,
            last_name: cleanLastName,
            age,
            phone_country_code: effectivePhoneCountryCode,
            phone_number: cleanPhone,
            phone: fullPhone,
            phone_verified: false,
            referral_code: newReferralCode,
            referred_by: cleanReferredBy,
            referral_code_used: cleanReferredBy,
            referral_count: 0,
            successful_referrals: 0,
            referral_rewards: 0,
            referral_reward_level: 0,
            referral_special_reward: false,
            referral_reward_claimed: 0,
            claimed_rewards: {},
            signup_step: 1,
            account_completed: true,
            about_you_completed: false,
            profile_completed: false,
            can_send_interest: false,
            terms_accepted: true,
          },
        },
      });

      if (signupError) {
        const message = (signupError.message || "").toLowerCase();
        if (message.includes("already registered") || message.includes("user already registered")) {
          setError(t("signup.errorEmailExists") || "This email is already registered. Please log in.");
        } else {
          setError(signupError.message || t("signup.errorGeneric") || "Something went wrong.");
        }
        return;
      }

      const createdUser = data?.user;
      if (!createdUser) {
        setError(t("signup.errorCreate") || "Your account could not be created.");
        return;
      }

      // Save phone to profiles
      const { error: profilePhoneError } = await supabase
        .from("profiles")
        .update({
          phone_country_code: effectivePhoneCountryCode,
          phone_number: cleanPhone,
          phone: fullPhone,
          phone_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", createdUser.id);

      if (profilePhoneError) {
        if (profilePhoneError.code === "23505") {
          setError(t("signup.errorPhoneExists") || "This phone number is already registered.");
        } else {
          setError(t("signup.errorPhoneSave") || "Account created but phone could not be saved.");
        }
        return;
      }

      navigate("/about-you");
    } catch (err) {
      setError(err?.message || t("signup.errorGeneric") || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-welcome">
          <div className="premium-logo">
            <img src={umurangaLogo} alt="UMUHUZA" />
          </div>

          <h1>
            {t("signup.heroTitle") || "Start Your"}
            <br />
            {t("signup.heroTitle2") || "Love Journey"}
          </h1>

          <p>
            {t("signup.heroSubtitle") || "Join genuine people looking for meaningful connections."}
          </p>

          <LanguageSwitcher />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-container">
          <div className="auth-form">

            <h2>{t("signup.title") || "Create Your Account"}</h2>
            <p className="auth-subtitle">
              {t("signup.subtitle") || "Let's start with the basics."}
            </p>

            {/* STEP INDICATOR */}
            <div className="signup-progress">
              <div className="progress-step active">
                <span>1</span>
                <small>{t("signup.stepAccount") || "Account"}</small>
              </div>
              <div className="progress-line" />
              <div className="progress-step">
                <span>2</span>
                <small>{t("signup.stepAbout") || "About You"}</small>
              </div>
              <div className="progress-line" />
              <div className="progress-step">
                <span>3</span>
                <small>{t("signup.stepProfile") || "Profile"}</small>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {/* FIRST NAME */}
            <div className="form-group">
              <label htmlFor="firstName">{t("signup.firstName") || "First Name"}</label>
              <div className="input-wrapper">
                <FiUser />
                <input
                  id="firstName"
                  type="text"
                  placeholder={t("signup.firstNamePlaceholder") || "Enter your first name"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* LAST NAME */}
            <div className="form-group">
              <label htmlFor="lastName">{t("signup.lastName") || "Last Name"}</label>
              <div className="input-wrapper">
                <FiUser />
                <input
                  id="lastName"
                  type="text"
                  placeholder={t("signup.lastNamePlaceholder") || "Enter your last name"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">{t("signup.email") || "Email Address"}</label>
              <div className="input-wrapper">
                <FiMail />
                <input
                  id="email"
                  type="email"
                  placeholder={t("signup.emailPlaceholder") || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <small className="input-help">
                {t("signup.emailHelp") || "You can verify your email after creating your account."}
              </small>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">{t("signup.password") || "Create Password"}</label>
              <div className="password-input-wrapper">
                <div className="input-wrapper" style={{ paddingRight: 0 }}>
                  <FiLock />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("signup.passwordPlaceholder") || "Create a password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="password-input"
                  />
                </div>
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <small className="input-help">
                {t("signup.passwordHelp") || "Use at least 8 characters."}
              </small>
            </div>

            {/* DATE OF BIRTH */}
            <div className="form-group">
              <label htmlFor="dateOfBirth">{t("signup.dateOfBirth") || "Date of Birth"}</label>
              <div className="input-wrapper">
                <FiCalendar />
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={loading}
                />
              </div>
              <small className="input-help">
                {t("signup.ageHelp") || "Your age is calculated automatically."}
                {currentAge !== null && currentAge >= 0 && (
                  <> {t("signup.youAre") || "You are"} <strong>{currentAge}</strong> {t("signup.yearsOld") || "years old."}</>
                )}
              </small>
            </div>

            {/* GENDER */}
            <div className="form-group">
              <label htmlFor="gender">{t("signup.gender") || "Gender"}</label>
              <div className="input-wrapper">
                <FiUser />
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={loading}
                >
                  <option value="">{t("signup.selectGender") || "Select your gender"}</option>
                  <option value="male">👨 {t("signup.male") || "Male"}</option>
                  <option value="female">👩 {t("signup.female") || "Female"}</option>
                </select>
              </div>
            </div>

            {/* COUNTRY */}
            <div className="form-group">
              <label htmlFor="country">{t("signup.whereLive") || "Where do you live?"}</label>
              <div className="input-wrapper">
                <FiGlobe />
                <select
                  id="country"
                  value={country}
                  onChange={handleCountryChange}
                  disabled={loading}
                >
                  <option value="">{t("signup.selectCountry") || "Select your country"}</option>
                  <option value="rwanda">🇷🇼 {t("signup.rwanda") || "Rwanda"}</option>
                  <option value="burundi">🇧🇮 {t("signup.burundi") || "Burundi"}</option>
                  <option value="other">🌍 {t("signup.otherCountry") || "Other Country"}</option>
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label htmlFor="location">
                {country === "rwanda"
                  ? t("signup.district") || "District"
                  : country === "burundi"
                  ? t("signup.province") || "Province"
                  : country === "other"
                  ? t("signup.countryOfResidence") || "Country of Residence"
                  : t("signup.location") || "Location"}
              </label>
              <div className="input-wrapper">
                <FiMapPin />
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading || !country}
                >
                  <option value="">
                    {!country
                      ? t("signup.selectCountryFirst") || "Select country first"
                      : country === "rwanda"
                      ? t("signup.selectDistrict") || "Select your district"
                      : country === "burundi"
                      ? t("signup.selectProvince") || "Select your province"
                      : t("signup.selectYourCountry") || "Select your country"}
                  </option>

                  {country === "rwanda" &&
                    rwandaDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}

                  {country === "burundi" &&
                    burundiProvinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}

                  {country === "other" &&
                    countries
                      .filter((c) => c.code !== "RW" && c.code !== "BI" && c.code !== "OTHER")
                      .map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* PHONE */}
            <div className="form-group">
              <label htmlFor="phoneNumber">{t("signup.phone") || "Phone Number"}</label>
              <div className="phone-input-group">
                <div className="phone-code-wrapper">
                  <FiPhone />
                  <select
                    value={phoneCountryCode}
                    onChange={handlePhoneCountryCodeChange}
                    disabled={loading}
                  >
                    {phoneCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder={t("signup.phonePlaceholder") || "Enter your phone number"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
              </div>

              {phoneCountryCode === "OTHER" && (
                <div className="form-group" style={{ marginTop: 10 }}>
                  <label>{t("signup.phoneCode") || "Country Phone Code"}</label>
                  <div className="input-wrapper">
                    <FiGlobe />
                    <input
                      type="tel"
                      placeholder="Example: +91"
                      value={customPhoneCountryCode}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d+]/g, "");
                        if (value && !value.startsWith("+")) value = `+${value}`;
                        setCustomPhoneCountryCode(value);
                      }}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <small className="input-help">
                {t("signup.phoneHelp") || "Your phone number helps keep your UMUHUZA account secure."}
              </small>
            </div>

            {/* REFERRAL */}
            <div className="form-group referral-signup-group">
              <label htmlFor="referralCode">
                {t("signup.referralCode") || "Referral Code"}
              </label>
              <div className="input-wrapper">
                <span className="referral-input-icon">🎁</span>
                <input
                  id="referralCode"
                  type="text"
                  placeholder={t("signup.referralPlaceholder") || "Enter referral code"}
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    setReferralMessage("");
                  }}
                  disabled={loading}
                />
              </div>
              {referralMessage ? (
                <small className="input-help referral-success-message">💕 {referralMessage}</small>
              ) : (
                <small className="input-help">
                  {t("signup.referralHelp") || "If a UMUHUZA member invited you, enter their referral code."}
                </small>
              )}
            </div>

            {/* TERMS */}
            <div className="terms">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms">
                {t("signup.terms") || "I agree to the UMUHUZA Terms & Privacy Policy"}
              </label>
            </div>

            {/* CONTINUE */}
            <button
              type="button"
              className="auth-primary-btn"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading
                ? t("signup.creating") || "Creating Account..."
                : t("signup.continue") || "Continue"}
              {!loading && <span> ❤️</span>}
            </button>

            {/* LOGIN */}
            <div className="auth-switch">
              <span>{t("signup.alreadyMember") || "Already a member?"}</span>
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                {t("signup.login") || "Login"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
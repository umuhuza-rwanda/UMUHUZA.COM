import "./PersonalInformation.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiGlobe,
  FiMapPin,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";


function PersonalInformation() {
  const navigate = useNavigate();

  // =====================================================
  // AUTH / USER STATE
  // =====================================================

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [firstName, setFirstName] = useState("");

  const [email, setEmail] = useState("");

  const [gender, setGender] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [age, setAge] = useState(null);

  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");

  // =====================================================
  // ORIGINAL DATA
  // Used to know whether changes were made.
  // =====================================================

  const [originalData, setOriginalData] = useState(null);

  // =====================================================
  // UI STATE
  // =====================================================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

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
  // CALCULATE AGE
  // =====================================================

  const calculateAge = (birthDate) => {
    if (!birthDate) {
      return null;
    }

    const today = new Date();

    const birth = new Date(`${birthDate}T00:00:00`);

    if (Number.isNaN(birth.getTime())) {
      return null;
    }

    let calculatedAge =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() -
      birth.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birth.getDate()
      )
    ) {
      calculatedAge--;
    }

    return calculatedAge;
  };

  // =====================================================
  // GET CURRENT AUTH USER
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error(
            "Error getting current user:",
            authError
          );
        }

        if (!mounted) {
          return;
        }

        setCurrentUser(user || null);

        if (!user) {
          setLoading(false);
        }
      } catch (authError) {
        console.error(
          "Unable to get current user:",
          authError
        );

        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    loadCurrentUser();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        const user =
          session?.user || null;

        setCurrentUser(user);

        if (!user) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // =====================================================
  // LOAD USER PROFILE FROM SUPABASE
  // =====================================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    let active = true;

    setLoading(true);
    setError("");

    const loadProfile = async () => {
      try {
        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            `
              id,
              full_name,
              gender,
              date_of_birth,
              country,
              city
            `
          )
          .eq(
            "id",
            currentUser.id
          )
          .maybeSingle();

        if (!active) {
          return;
        }

        if (profileError) {
          console.error(
            "Error loading personal information:",
            profileError
          );

          setError(
            "Unable to load your personal information."
          );

          setLoading(false);

          return;
        }

        if (!data) {
          setError(
            "We couldn't find your KUNDWA profile."
          );

          setLoading(false);

          return;
        }

        // =================================================
        // LOAD DATA
        // =================================================

        const loadedFirstName =
          data.full_name || "";

        const loadedEmail =
          currentUser.email || "";

        const loadedGender =
          data.gender || "";

        const loadedDateOfBirth =
          data.date_of_birth || "";

        const loadedCountry =
          data.country || "";

        const loadedCity =
          data.city || "";

        // =================================================
        // SET FORM
        // =================================================

        setFirstName(
          loadedFirstName
        );

        setEmail(
          loadedEmail
        );

        setGender(
          loadedGender
        );

        setDateOfBirth(
          loadedDateOfBirth
        );

        setCountry(
          loadedCountry
        );

        setCity(
          loadedCity
        );

        // =================================================
        // CALCULATE AGE
        // =================================================

        const calculatedAge =
          calculateAge(
            loadedDateOfBirth
          );

        setAge(
          calculatedAge
        );

        // =================================================
        // SAVE ORIGINAL DATA
        // =================================================

        setOriginalData({
          firstName:
            loadedFirstName,

          gender:
            loadedGender,

          dateOfBirth:
            loadedDateOfBirth,

          country:
            loadedCountry,

          city:
            loadedCity,
        });

        setLoading(false);
      } catch (profileError) {
        console.error(
          "Error loading personal information:",
          profileError
        );

        if (active) {
          setError(
            "Unable to load your personal information."
          );

          setLoading(false);
        }
      }
    };

    loadProfile();

    // =====================================================
    // SUPABASE REALTIME
    // =====================================================

    const channel = supabase
      .channel(
        `personal-information-${currentUser.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter:
            `id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (
            !active ||
            !payload?.new
          ) {
            return;
          }

          const data =
            payload.new;

          const loadedFirstName =
            data.full_name || "";

          const loadedGender =
            data.gender || "";

          const loadedDateOfBirth =
            data.date_of_birth || "";

          const loadedCountry =
            data.country || "";

          const loadedCity =
            data.city || "";

          setFirstName(
            loadedFirstName
          );

          setGender(
            loadedGender
          );

          setDateOfBirth(
            loadedDateOfBirth
          );

          setCountry(
            loadedCountry
          );

          setCity(
            loadedCity
          );

          setAge(
            calculateAge(
              loadedDateOfBirth
            )
          );

          setOriginalData({
            firstName:
              loadedFirstName,

            gender:
              loadedGender,

            dateOfBirth:
              loadedDateOfBirth,

            country:
              loadedCountry,

            city:
              loadedCity,
          });
        }
      )
      .subscribe((status) => {
        console.log(
          "👤 Personal information realtime:",
          status
        );
      });

    return () => {
      active = false;

      supabase.removeChannel(
        channel
      );
    };
  }, [currentUser?.id]);

  // =====================================================
  // DATE OF BIRTH CHANGE
  // =====================================================

  const handleDateOfBirthChange =
    (event) => {
      const value =
        event.target.value;

      setDateOfBirth(
        value
      );

      const calculatedAge =
        calculateAge(
          value
        );

      setAge(
        calculatedAge
      );

      setError("");
      setSuccess("");
    };

  // =====================================================
  // COUNTRY CHANGE
  // =====================================================

  const handleCountryChange =
    (event) => {
      const selectedCountry =
        event.target.value;

      setCountry(
        selectedCountry
      );

      // Country change means
      // previous district/province
      // may no longer be valid.

      setCity("");

      setError("");
      setSuccess("");
    };

  // =====================================================
  // CHECK WHETHER FORM HAS CHANGES
  // =====================================================

  const hasChanges = () => {
    if (!originalData) {
      return false;
    }

    return (
      firstName.trim() !==
        (originalData.firstName || "")

      ||

      gender !==
        (originalData.gender || "")

      ||

      dateOfBirth !==
        (originalData.dateOfBirth || "")

      ||

      country !==
        (originalData.country || "")

      ||

      city !==
        (originalData.city || "")
    );
  };

  // =====================================================
  // SAVE CHANGES
  // =====================================================

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // =================================================
    // CHECK AUTH
    // =================================================

    if (!currentUser?.id) {
      setError(
        "Your session has expired. Please log in again."
      );

      return;
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (!firstName.trim()) {
      setError(
        "Please enter your first name."
      );

      return;
    }

    if (!gender) {
      setError(
        "Please select your gender."
      );

      return;
    }

    if (!dateOfBirth) {
      setError(
        "Please select your date of birth."
      );

      return;
    }

    const calculatedAge =
      calculateAge(
        dateOfBirth
      );

    if (
      calculatedAge === null ||
      Number.isNaN(calculatedAge)
    ) {
      setError(
        "Please enter a valid date of birth."
      );

      return;
    }

    if (calculatedAge < 18) {
      setError(
        "You must be at least 18 years old to use KUNDWA."
      );

      return;
    }

    if (calculatedAge > 100) {
      setError(
        "Please enter a valid date of birth."
      );

      return;
    }

    if (!country) {
      setError(
        "Please select your country."
      );

      return;
    }

    if (!city) {
      setError(
        "Please select your district or province."
      );

      return;
    }

    // =================================================
    // START SAVING
    // =================================================

    try {
      setSaving(true);

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          full_name:
            firstName.trim(),

          gender:
            gender,

          date_of_birth:
            dateOfBirth,

          country:
            country,

          city:
            city,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          currentUser.id
        );

      if (updateError) {
        throw updateError;
      }

      // =================================================
      // UPDATE LOCAL AGE
      // =================================================

      setAge(
        calculatedAge
      );

      // =================================================
      // UPDATE ORIGINAL DATA
      // =================================================

      setOriginalData({
        firstName:
          firstName.trim(),

        gender:
          gender,

        dateOfBirth:
          dateOfBirth,

        country:
          country,

        city:
          city,
      });

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      setSuccess(
        "Your personal information has been saved successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (saveError) {
      console.error(
        "Error saving personal information:",
        saveError
      );

      setError(
        "We couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/profile");
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser && !loading) {
    return (
      <div className="personal-information-page">

        <header className="personal-information-header">

          <button
            type="button"
            className="personal-back-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            <FiArrowLeft />

            <span>
              Back
            </span>
          </button>

          <div className="personal-logo">
            ❤️ KUNDWA
          </div>

        </header>

        <main className="personal-information-main">

          <div className="personal-state-card">

            <div className="personal-state-icon">
              👤
            </div>

            <h2>
              Please log in
            </h2>

            <p>
              You need to be logged in to
              manage your personal information.
            </p>

            <button
              type="button"
              className="personal-primary-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Go to Login
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="personal-information-page">

        <header className="personal-information-header">

          <button
            type="button"
            className="personal-back-btn"
            onClick={handleBack}
          >
            <FiArrowLeft />

            <span>
              Back
            </span>
          </button>

          <div className="personal-logo">
            ❤️ KUNDWA
          </div>

        </header>

        <main className="personal-information-main">

          <div className="personal-state-card">

            <div className="personal-loading-icon">
              ❤️
            </div>

            <h2>
              Loading Your Information
            </h2>

            <p>
              We're securely retrieving your
              KUNDWA profile.
            </p>

            <div className="personal-spinner"></div>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="personal-information-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="personal-information-header">

        <button
          type="button"
          className="personal-back-btn"
          onClick={handleBack}
          disabled={saving}
        >
          <FiArrowLeft />

          <span>
            Back
          </span>
        </button>

        <div className="personal-logo">
          ❤️ KUNDWA
        </div>

        <div className="personal-header-title">

          <FiUser />

          <span>
            Personal Information
          </span>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="personal-information-main">

        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="personal-page-heading">

          <div>

            <span className="personal-eyebrow">
              👤 PROFILE SETTINGS
            </span>

            <h1>
              Personal Information
            </h1>

            <p>
              Keep your basic information accurate
              and up to date on KUNDWA.
            </p>

          </div>

          <div className="personal-heading-icon">
            <FiUser />
          </div>

        </section>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="personal-success-message">

            <FiCheckCircle />

            <span>
              {success}
            </span>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="personal-error-message">

            <FiAlertCircle />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* =================================================
            FORM CARD
        ================================================= */}

        <section className="personal-form-card">

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="personal-section-heading">

            <div className="personal-section-icon">
              👤
            </div>

            <div>

              <h2>
                Basic Information
              </h2>

              <p>
                This information helps people
                understand who you are.
              </p>

            </div>

          </div>

          {/* =================================================
              FIRST NAME
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalFirstName">
              First Name
            </label>

            <div className="personal-input-wrapper">

              <FiUser />

              <input
                id="personalFirstName"
                type="text"
                value={firstName}
                placeholder="Enter your first name"
                onChange={(event) => {

                  setFirstName(
                    event.target.value
                  );

                  setError("");
                  setSuccess("");

                }}
                disabled={saving}
                autoComplete="given-name"
              />

            </div>

            <small>
              This is the name displayed on your
              KUNDWA profile.
            </small>

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalEmail">
              Email Address
            </label>

            <div className="personal-input-wrapper personal-readonly-wrapper">

              <FiMail />

              <input
                id="personalEmail"
                type="email"
                value={email}
                readOnly
                disabled
              />

              <span className="personal-readonly-badge">
                Account
              </span>

            </div>

            <small>
              Your email is connected to your
              KUNDWA account and cannot be edited here.
            </small>

          </div>

          {/* =================================================
              GENDER
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalGender">
              Gender
            </label>

            <div className="personal-input-wrapper">

              <FiUser />

              <select
                id="personalGender"
                value={gender}
                onChange={(event) => {

                  setGender(
                    event.target.value
                  );

                  setError("");
                  setSuccess("");

                }}
                disabled={saving}
              >

                <option value="">
                  Select your gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              DATE OF BIRTH
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalDateOfBirth">
              Date of Birth
            </label>

            <div className="personal-input-wrapper">

              <FiCalendar />

              <input
                id="personalDateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={
                  handleDateOfBirthChange
                }
                disabled={saving}
              />

            </div>

            <div className="personal-age-display">

              <FiCheckCircle />

              <span>
                {age !== null
                  ? `You are ${age} years old.`
                  : "Your age will be calculated automatically."
                }
              </span>

            </div>

          </div>

          {/* =================================================
              LOCATION SECTION
          ================================================= */}

          <div className="personal-divider"></div>

          <div className="personal-section-heading">

            <div className="personal-section-icon location">
              📍
            </div>

            <div>

              <h2>
                Location
              </h2>

              <p>
                Your location helps KUNDWA
                recommend relevant people.
              </p>

            </div>

          </div>

          {/* =================================================
              COUNTRY
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalCountry">
              Country
            </label>

            <div className="personal-input-wrapper">

              <FiGlobe />

              <select
                id="personalCountry"
                value={country}
                onChange={
                  handleCountryChange
                }
                disabled={saving}
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
                  🌍 Other
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              DISTRICT / PROVINCE
          ================================================= */}

          <div className="personal-form-group">

            <label htmlFor="personalCity">

              {country === "burundi"
                ? "Province"
                : country === "rwanda"
                ? "District"
                : "Location"
              }

            </label>

            <div className="personal-input-wrapper">

              <FiMapPin />

              <select
                id="personalCity"
                value={city}
                onChange={(event) => {

                  setCity(
                    event.target.value
                  );

                  setError("");
                  setSuccess("");

                }}
                disabled={
                  saving ||
                  !country
                }
              >

                <option value="">

                  {!country
                    ? "Select country first"
                    : country === "burundi"
                    ? "Select your province"
                    : country === "rwanda"
                    ? "Select your district"
                    : "Select your location"
                  }

                </option>

                {/* =========================================
                    RWANDA
                ========================================= */}

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
                  )
                }

                {/* =========================================
                    BURUNDI
                ========================================= */}

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
                  )
                }

                {/* =========================================
                    OTHER
                ========================================= */}

                {country === "other" && (
                  <option value="other">
                    Other Location
                  </option>
                )}

              </select>

            </div>

            <small>

              {country === "rwanda" &&
                "Select your district in Rwanda."
              }

              {country === "burundi" &&
                "Select your province in Burundi."
              }

              {country === "other" &&
                "You can select Other Location."
              }

              {!country &&
                "Choose your country first."
              }

            </small>

          </div>

          {/* =================================================
              SAVE AREA
          ================================================= */}

          <div className="personal-save-area">

            <div className="personal-save-info">

              {hasChanges() ? (
                <>
                  <span className="unsaved-dot"></span>

                  <span>
                    You have unsaved changes.
                  </span>
                </>
              ) : (
                <>
                  <FiCheckCircle />

                  <span>
                    Your information is up to date.
                  </span>
                </>
              )}

            </div>

            <div className="personal-action-buttons">

              <button
                type="button"
                className="personal-cancel-btn"
                onClick={handleBack}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="personal-save-btn"
                onClick={handleSave}
                disabled={
                  saving ||
                  !hasChanges()
                }
              >

                {saving ? (
                  <>
                    <span className="personal-button-spinner"></span>

                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />

                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            SECURITY NOTE
        ================================================= */}

        <div className="personal-security-note">

          <div className="personal-security-icon">
            🔐
          </div>

          <div>

            <strong>
              Your information is secure
            </strong>

            <p>
              Your personal information is stored
              securely in your KUNDWA account.
              Only information intended for your
              profile is shown to other members.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default PersonalInformation;
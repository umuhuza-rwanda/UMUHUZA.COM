import "./LocationDiscovery.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiMapPin,
  FiGlobe,
  FiSearch,
  FiNavigation,
  FiHeart,
  FiEye,
  FiCheck,
  FiSave,
  FiInfo,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";


// =====================================================
// COUNTRY LIST
// =====================================================

const countries = [
  { code: "rwanda", name: "Rwanda", flag: "🇷🇼" },
  { code: "burundi", name: "Burundi", flag: "🇧🇮" },
  { code: "afghanistan", name: "Afghanistan", flag: "🇦🇫" },
  { code: "albania", name: "Albania", flag: "🇦🇱" },
  { code: "algeria", name: "Algeria", flag: "🇩🇿" },
  { code: "andorra", name: "Andorra", flag: "🇦🇩" },
  { code: "angola", name: "Angola", flag: "🇦🇴" },
  { code: "antigua-and-barbuda", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "argentina", name: "Argentina", flag: "🇦🇷" },
  { code: "armenia", name: "Armenia", flag: "🇦🇲" },
  { code: "australia", name: "Australia", flag: "🇦🇺" },
  { code: "austria", name: "Austria", flag: "🇦🇹" },
  { code: "azerbaijan", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "bahamas", name: "Bahamas", flag: "🇧🇸" },
  { code: "bahrain", name: "Bahrain", flag: "🇧🇭" },
  { code: "bangladesh", name: "Bangladesh", flag: "🇧🇩" },
  { code: "barbados", name: "Barbados", flag: "🇧🇧" },
  { code: "belarus", name: "Belarus", flag: "🇧🇾" },
  { code: "belgium", name: "Belgium", flag: "🇧🇪" },
  { code: "belize", name: "Belize", flag: "🇧🇿" },
  { code: "benin", name: "Benin", flag: "🇧🇯" },
  { code: "bhutan", name: "Bhutan", flag: "🇧🇹" },
  { code: "bolivia", name: "Bolivia", flag: "🇧🇴" },
  { code: "bosnia-and-herzegovina", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "botswana", name: "Botswana", flag: "🇧🇼" },
  { code: "brazil", name: "Brazil", flag: "🇧🇷" },
  { code: "brunei", name: "Brunei", flag: "🇧🇳" },
  { code: "bulgaria", name: "Bulgaria", flag: "🇧🇬" },
  { code: "burkina-faso", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "cabo-verde", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "cambodia", name: "Cambodia", flag: "🇰🇭" },
  { code: "cameroon", name: "Cameroon", flag: "🇨🇲" },
  { code: "canada", name: "Canada", flag: "🇨🇦" },
  { code: "central-african-republic", name: "Central African Republic", flag: "🇨🇫" },
  { code: "chad", name: "Chad", flag: "🇹🇩" },
  { code: "chile", name: "Chile", flag: "🇨🇱" },
  { code: "china", name: "China", flag: "🇨🇳" },
  { code: "colombia", name: "Colombia", flag: "🇨🇴" },
  { code: "comoros", name: "Comoros", flag: "🇰🇲" },
  { code: "congo", name: "Congo", flag: "🇨🇬" },
  { code: "costa-rica", name: "Costa Rica", flag: "🇨🇷" },
  { code: "croatia", name: "Croatia", flag: "🇭🇷" },
  { code: "cuba", name: "Cuba", flag: "🇨🇺" },
  { code: "cyprus", name: "Cyprus", flag: "🇨🇾" },
  { code: "czechia", name: "Czechia", flag: "🇨🇿" },
  {
    code: "democratic-republic-of-the-congo",
    name: "Democratic Republic of the Congo",
    flag: "🇨🇩",
  },
  { code: "denmark", name: "Denmark", flag: "🇩🇰" },
  { code: "djibouti", name: "Djibouti", flag: "🇩🇯" },
  { code: "dominica", name: "Dominica", flag: "🇩🇲" },
  {
    code: "dominican-republic",
    name: "Dominican Republic",
    flag: "🇩🇴",
  },
  { code: "ecuador", name: "Ecuador", flag: "🇪🇨" },
  { code: "egypt", name: "Egypt", flag: "🇪🇬" },
  { code: "el-salvador", name: "El Salvador", flag: "🇸🇻" },
  {
    code: "equatorial-guinea",
    name: "Equatorial Guinea",
    flag: "🇬🇶",
  },
  { code: "eritrea", name: "Eritrea", flag: "🇪🇷" },
  { code: "estonia", name: "Estonia", flag: "🇪🇪" },
  { code: "eswatini", name: "Eswatini", flag: "🇸🇿" },
  { code: "ethiopia", name: "Ethiopia", flag: "🇪🇹" },
  { code: "fiji", name: "Fiji", flag: "🇫🇯" },
  { code: "finland", name: "Finland", flag: "🇫🇮" },
  { code: "france", name: "France", flag: "🇫🇷" },
  { code: "gabon", name: "Gabon", flag: "🇬🇦" },
  { code: "gambia", name: "Gambia", flag: "🇬🇲" },
  { code: "georgia", name: "Georgia", flag: "🇬🇪" },
  { code: "germany", name: "Germany", flag: "🇩🇪" },
  { code: "ghana", name: "Ghana", flag: "🇬🇭" },
  { code: "greece", name: "Greece", flag: "🇬🇷" },
  { code: "grenada", name: "Grenada", flag: "🇬🇩" },
  { code: "guatemala", name: "Guatemala", flag: "🇬🇹" },
  { code: "guinea", name: "Guinea", flag: "🇬🇳" },
  { code: "guinea-bissau", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "guyana", name: "Guyana", flag: "🇬🇾" },
  { code: "haiti", name: "Haiti", flag: "🇭🇹" },
  { code: "honduras", name: "Honduras", flag: "🇭🇳" },
  { code: "hungary", name: "Hungary", flag: "🇭🇺" },
  { code: "iceland", name: "Iceland", flag: "🇮🇸" },
  { code: "india", name: "India", flag: "🇮🇳" },
  { code: "indonesia", name: "Indonesia", flag: "🇮🇩" },
  { code: "iran", name: "Iran", flag: "🇮🇷" },
  { code: "iraq", name: "Iraq", flag: "🇮🇶" },
  { code: "ireland", name: "Ireland", flag: "🇮🇪" },
  { code: "israel", name: "Israel", flag: "🇮🇱" },
  { code: "italy", name: "Italy", flag: "🇮🇹" },
  { code: "jamaica", name: "Jamaica", flag: "🇯🇲" },
  { code: "japan", name: "Japan", flag: "🇯🇵" },
  { code: "jordan", name: "Jordan", flag: "🇯🇴" },
  { code: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "kenya", name: "Kenya", flag: "🇰🇪" },
  { code: "kuwait", name: "Kuwait", flag: "🇰🇼" },
  { code: "latvia", name: "Latvia", flag: "🇱🇻" },
  { code: "lebanon", name: "Lebanon", flag: "🇱🇧" },
  { code: "lesotho", name: "Lesotho", flag: "🇱🇸" },
  { code: "liberia", name: "Liberia", flag: "🇱🇷" },
  { code: "libya", name: "Libya", flag: "🇱🇾" },
  { code: "liechtenstein", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "lithuania", name: "Lithuania", flag: "🇱🇹" },
  { code: "luxembourg", name: "Luxembourg", flag: "🇱🇺" },
  { code: "madagascar", name: "Madagascar", flag: "🇲🇬" },
  { code: "malawi", name: "Malawi", flag: "🇲🇼" },
  { code: "malaysia", name: "Malaysia", flag: "🇲🇾" },
  { code: "maldives", name: "Maldives", flag: "🇲🇻" },
  { code: "mali", name: "Mali", flag: "🇲🇱" },
  { code: "malta", name: "Malta", flag: "🇲🇹" },
  { code: "mauritania", name: "Mauritania", flag: "🇲🇷" },
  { code: "mauritius", name: "Mauritius", flag: "🇲🇺" },
  { code: "mexico", name: "Mexico", flag: "🇲🇽" },
  { code: "monaco", name: "Monaco", flag: "🇲🇨" },
  { code: "mongolia", name: "Mongolia", flag: "🇲🇳" },
  { code: "montenegro", name: "Montenegro", flag: "🇲🇪" },
  { code: "morocco", name: "Morocco", flag: "🇲🇦" },
  { code: "mozambique", name: "Mozambique", flag: "🇲🇿" },
  { code: "myanmar", name: "Myanmar", flag: "🇲🇲" },
  { code: "namibia", name: "Namibia", flag: "🇳🇦" },
  { code: "nepal", name: "Nepal", flag: "🇳🇵" },
  { code: "netherlands", name: "Netherlands", flag: "🇳🇱" },
  { code: "new-zealand", name: "New Zealand", flag: "🇳🇿" },
  { code: "nicaragua", name: "Nicaragua", flag: "🇳🇮" },
  { code: "niger", name: "Niger", flag: "🇳🇪" },
  { code: "nigeria", name: "Nigeria", flag: "🇳🇬" },
  { code: "north-korea", name: "North Korea", flag: "🇰🇵" },
  { code: "north-macedonia", name: "North Macedonia", flag: "🇲🇰" },
  { code: "norway", name: "Norway", flag: "🇳🇴" },
  { code: "oman", name: "Oman", flag: "🇴🇲" },
  { code: "pakistan", name: "Pakistan", flag: "🇵🇰" },
  { code: "panama", name: "Panama", flag: "🇵🇦" },
  { code: "papua-new-guinea", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "paraguay", name: "Paraguay", flag: "🇵🇾" },
  { code: "peru", name: "Peru", flag: "🇵🇪" },
  { code: "philippines", name: "Philippines", flag: "🇵🇭" },
  { code: "poland", name: "Poland", flag: "🇵🇱" },
  { code: "portugal", name: "Portugal", flag: "🇵🇹" },
  { code: "qatar", name: "Qatar", flag: "🇶🇦" },
  { code: "romania", name: "Romania", flag: "🇷🇴" },
  { code: "russia", name: "Russia", flag: "🇷🇺" },
  { code: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "senegal", name: "Senegal", flag: "🇸🇳" },
  { code: "serbia", name: "Serbia", flag: "🇷🇸" },
  { code: "seychelles", name: "Seychelles", flag: "🇸🇨" },
  { code: "sierra-leone", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "singapore", name: "Singapore", flag: "🇸🇬" },
  { code: "slovakia", name: "Slovakia", flag: "🇸🇰" },
  { code: "slovenia", name: "Slovenia", flag: "🇸🇮" },
  { code: "somalia", name: "Somalia", flag: "🇸🇴" },
  { code: "south-africa", name: "South Africa", flag: "🇿🇦" },
  { code: "south-korea", name: "South Korea", flag: "🇰🇷" },
  { code: "south-sudan", name: "South Sudan", flag: "🇸🇸" },
  { code: "spain", name: "Spain", flag: "🇪🇸" },
  { code: "sri-lanka", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "sudan", name: "Sudan", flag: "🇸🇩" },
  { code: "suriname", name: "Suriname", flag: "🇸🇷" },
  { code: "sweden", name: "Sweden", flag: "🇸🇪" },
  { code: "switzerland", name: "Switzerland", flag: "🇨🇭" },
  { code: "syria", name: "Syria", flag: "🇸🇾" },
  { code: "taiwan", name: "Taiwan", flag: "🇹🇼" },
  { code: "tanzania", name: "Tanzania", flag: "🇹🇿" },
  { code: "thailand", name: "Thailand", flag: "🇹🇭" },
  { code: "togo", name: "Togo", flag: "🇹🇬" },
  { code: "tonga", name: "Tonga", flag: "🇹🇴" },
  {
    code: "trinidad-and-tobago",
    name: "Trinidad and Tobago",
    flag: "🇹🇹",
  },
  { code: "tunisia", name: "Tunisia", flag: "🇹🇳" },
  { code: "turkey", name: "Türkiye", flag: "🇹🇷" },
  { code: "turkmenistan", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "uganda", name: "Uganda", flag: "🇺🇬" },
  { code: "ukraine", name: "Ukraine", flag: "🇺🇦" },
  {
    code: "united-arab-emirates",
    name: "United Arab Emirates",
    flag: "🇦🇪",
  },
  { code: "united-kingdom", name: "United Kingdom", flag: "🇬🇧" },
  { code: "united-states", name: "United States", flag: "🇺🇸" },
  { code: "uruguay", name: "Uruguay", flag: "🇺🇾" },
  { code: "uzbekistan", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "vanuatu", name: "Vanuatu", flag: "🇻🇺" },
  { code: "vatican-city", name: "Vatican City", flag: "🇻🇦" },
  { code: "venezuela", name: "Venezuela", flag: "🇻🇪" },
  { code: "vietnam", name: "Vietnam", flag: "🇻🇳" },
  { code: "yemen", name: "Yemen", flag: "🇾🇪" },
  { code: "zambia", name: "Zambia", flag: "🇿🇲" },
  { code: "zimbabwe", name: "Zimbabwe", flag: "🇿🇼" },
];


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
// COMPONENT
// =====================================================

function LocationDiscovery() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [profile, setProfile] = useState(null);

  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");

  const [nearbyEnabled, setNearbyEnabled] =
    useState(true);

  const [discoveryDistance, setDiscoveryDistance] =
    useState(50);

  const [diasporaEnabled, setDiasporaEnabled] =
    useState(false);

  const [diasporaCountries, setDiasporaCountries] =
    useState([]);

  const [matchPreferencesOnly, setMatchPreferencesOnly] =
    useState(true);

  const [discoveryVisible, setDiscoveryVisible] =
    useState(true);

  const [countrySearch, setCountrySearch] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // -------------------------------------------------
        // GET CURRENT USER
        // -------------------------------------------------

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (authError) {
          console.error(
            "Location authentication error:",
            authError
          );

          setError(
            "Unable to verify your session. Please log in again."
          );

          setLoading(false);

          return;
        }

        if (!user) {
          setError(
            "Your session has expired. Please log in again."
          );

          setLoading(false);

          return;
        }

        // -------------------------------------------------
        // LOAD PROFILE
        // -------------------------------------------------

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            `
              id,
              country,
              city,
              preferences,
              updated_at
            `
          )
          .eq("id", user.id)
          .single();

        if (!mounted) {
          return;
        }

        if (profileError) {
          console.error(
            "Location profile error:",
            profileError
          );

          setError(
            "Unable to load your location settings."
          );

          setLoading(false);

          return;
        }

        if (!data) {
          setError(
            "Your UMUHUZA profile could not be found."
          );

          setLoading(false);

          return;
        }

        setProfile(data);

        // -------------------------------------------------
        // CURRENT LOCATION
        // -------------------------------------------------

        setCountry(data.country || "");

        setCity(data.city || "");

        // -------------------------------------------------
        // DISCOVERY SETTINGS
        // -------------------------------------------------

        const preferences =
          data.preferences &&
          typeof data.preferences === "object"
            ? data.preferences
            : {};

        const settings =
          preferences.locationDiscovery &&
          typeof preferences.locationDiscovery === "object"
            ? preferences.locationDiscovery
            : {};

        setNearbyEnabled(
          settings.nearbyEnabled !== false
        );

        setDiscoveryDistance(
          Number(
            settings.discoveryDistance || 50
          )
        );

        setDiasporaEnabled(
          settings.diasporaEnabled === true
        );

        setDiasporaCountries(
          Array.isArray(
            settings.diasporaCountries
          )
            ? settings.diasporaCountries
            : []
        );

        setMatchPreferencesOnly(
          settings.matchPreferencesOnly !== false
        );

        setDiscoveryVisible(
          settings.discoveryVisible !== false
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Unexpected location loading error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load your location settings. Please try again."
          );

          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // SELECTED COUNTRY
  // =====================================================

  const selectedCountry = useMemo(() => {
    return countries.find(
      (item) => item.code === country
    );
  }, [country]);

  // =====================================================
  // FILTER COUNTRIES
  // =====================================================

  const filteredCountries = useMemo(() => {
    const search =
      countrySearch.trim().toLowerCase();

    if (!search) {
      return countries;
    }

    return countries.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search)
    );
  }, [countrySearch]);

  // =====================================================
  // LOCATION CHANGE
  // =====================================================

  const handleCountryChange = (value) => {
    setCountry(value);
    setCity("");
    setSaved(false);
    setError("");
  };

  // =====================================================
  // DIASPORA COUNTRY
  // =====================================================

  const toggleDiasporaCountry = (code) => {
    setSaved(false);
    setError("");

    setDiasporaCountries((previous) => {
      if (previous.includes(code)) {
        return previous.filter(
          (item) => item !== code
        );
      }

      return [
        ...previous,
        code,
      ];
    });
  };

  // =====================================================
  // REMOVE DIASPORA COUNTRY
  // =====================================================

  const removeDiasporaCountry = (code) => {
    setDiasporaCountries((previous) =>
      previous.filter(
        (item) => item !== code
      )
    );

    setSaved(false);
    setError("");
  };

  // =====================================================
  // BACK TO PROFILE
  // =====================================================

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = async () => {
    setError("");
    setSaved(false);

    // ---------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError(
        "Your session has expired. Please log in again."
      );

      return;
    }

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

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

    if (
      diasporaEnabled &&
      diasporaCountries.length === 0
    ) {
      setError(
        "Please select at least one diaspora country."
      );

      return;
    }

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    try {
      setSaving(true);

      // -------------------------------------------------
      // PRESERVE EXISTING PREFERENCES
      // -------------------------------------------------

      const existingPreferences =
        profile?.preferences &&
        typeof profile.preferences === "object"
          ? profile.preferences
          : {};

      // -------------------------------------------------
      // BUILD LOCATION DISCOVERY SETTINGS
      // -------------------------------------------------

      const locationDiscovery = {
        nearbyEnabled:
          nearbyEnabled,

        discoveryDistance:
          Number(discoveryDistance),

        diasporaEnabled:
          diasporaEnabled,

        diasporaCountries:
          diasporaCountries,

        matchPreferencesOnly:
          matchPreferencesOnly,

        discoveryVisible:
          discoveryVisible,
      };

      // -------------------------------------------------
      // BUILD UPDATED PREFERENCES
      // -------------------------------------------------

      const updatedPreferences = {
        ...existingPreferences,

        locationDiscovery:
          locationDiscovery,
      };

      // -------------------------------------------------
      // UPDATE PROFILE
      // -------------------------------------------------

      const {
        data,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          country: country,

          city: city,

          preferences:
            updatedPreferences,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", user.id)
        .select(
          `
            id,
            country,
            city,
            preferences,
            updated_at
          `
        )
        .single();

      if (updateError) {
        console.error(
          "Error saving location settings:",
          updateError
        );

        setError(
          "We couldn't save your location settings. Please try again."
        );

        return;
      }

      // -------------------------------------------------
      // UPDATE LOCAL PROFILE
      // -------------------------------------------------

      setProfile(data);

      setCountry(
        data.country || country
      );

      setCity(
        data.city || city
      );

      setSaved(true);

      console.log(
        "📍 UMUHUZA location and discovery settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Unexpected location save error:",
        err
      );

      setError(
        "We couldn't save your location settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="location-page">

        <div className="location-loading-card">

          <div className="location-loading-icon">
            📍
          </div>

          <h2>
            Loading Location Settings...
          </h2>

          <p>
            We're preparing your UMUHUZA discovery settings.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="location-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="location-header">

        <button
          type="button"
          className="location-back-btn"
          onClick={handleBackToProfile}
        >

          <FiArrowLeft />

          <span>
            Back to Profile
          </span>

        </button>


        <div className="location-brand">
          ❤️ UMUHUZA
        </div>


        <div className="location-header-title">

          <FiMapPin />

          <span>
            Location & Discovery
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="location-main">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="location-intro-card">

          <div className="location-intro-icon">
            <FiMapPin />
          </div>


          <div>

            <span className="location-eyebrow">
              LOCATION & DISCOVERY
            </span>

            <h1>
              Find Meaningful Connections
            </h1>

            <p>
              Control where you live, who you discover,
              and how UMUHUZA helps you find people
              who match your preferences.
            </p>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="location-message error">

            <FiInfo />

            <span>
              {error}
            </span>

          </div>
        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {saved && (
          <div className="location-message success">

            <FiCheck />

            <span>
              Your location and discovery settings
              have been saved successfully.
            </span>

          </div>
        )}


        {/* =================================================
            CURRENT LOCATION
        ================================================= */}

        <section className="location-card">

          <div className="location-card-heading">

            <div className="location-card-heading-icon">
              <FiNavigation />
            </div>

            <div>

              <h2>
                Your Location
              </h2>

              <p>
                This helps UMUHUZA show you people
                near your location.
              </p>

            </div>

          </div>


          {/* COUNTRY */}

          <div className="location-form-group">

            <label>
              Country
            </label>

            <div className="location-select-wrapper">

              <FiGlobe />

              <select
                value={country}
                onChange={(event) =>
                  handleCountryChange(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select your country
                </option>

                {countries.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {item.flag} {item.name}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* DISTRICT / PROVINCE */}

          <div className="location-form-group">

            <label>
              {country === "burundi"
                ? "Province"
                : country === "rwanda"
                ? "District"
                : "City / State / Province"}
            </label>


            <div className="location-select-wrapper">

              <FiMapPin />


              {country === "rwanda" ? (
                <select
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setSaved(false);
                    setError("");
                  }}
                >

                  <option value="">
                    Select your district
                  </option>

                  {rwandaDistricts.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    )
                  )}

                </select>

              ) : country === "burundi" ? (

                <select
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setSaved(false);
                    setError("");
                  }}
                >

                  <option value="">
                    Select your province
                  </option>

                  {burundiProvinces.map(
                    (province) => (
                      <option
                        key={province}
                        value={province}
                      >
                        {province}
                      </option>
                    )
                  )}

                </select>

              ) : (

                <input
                  type="text"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setSaved(false);
                    setError("");
                  }}
                  placeholder="Enter your city, state or province"
                />

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            NEARBY DISCOVERY
        ================================================= */}

        <section className="location-card">

          <div className="location-card-heading">

            <div className="location-card-heading-icon nearby">
              <FiNavigation />
            </div>

            <div>

              <h2>
                Nearby Discovery
              </h2>

              <p>
                Discover people who are located
                near you.
              </p>

            </div>

          </div>


          <div className="location-toggle-row">

            <div className="toggle-content">

              <h3>
                Show people near me
              </h3>

              <p>
                Allow UMUHUZA to recommend people
                based on your selected location.
              </p>

            </div>


            <button
              type="button"
              className={`location-toggle ${
                nearbyEnabled
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setNearbyEnabled(
                  (previous) => !previous
                );
                setSaved(false);
              }}
              aria-label="Toggle nearby discovery"
            >

              <span />

            </button>

          </div>


          {nearbyEnabled && (
            <div className="distance-section">

              <div className="distance-heading">

                <div>

                  <strong>
                    Discovery Distance
                  </strong>

                  <p>
                    How far should we look for
                    nearby people?
                  </p>

                </div>


                <span className="distance-value">
                  {discoveryDistance} km
                </span>

              </div>


              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={discoveryDistance}
                onChange={(event) => {
                  setDiscoveryDistance(
                    Number(event.target.value)
                  );
                  setSaved(false);
                }}
                className="distance-slider"
              />


              <div className="distance-labels">

                <span>
                  5 km
                </span>

                <span>
                  500 km
                </span>

              </div>

            </div>
          )}

        </section>


        {/* =================================================
            DIASPORA
        ================================================= */}

        <section className="location-card">

          <div className="location-card-heading">

            <div className="location-card-heading-icon diaspora">
              <FiGlobe />
            </div>

            <div>

              <h2>
                Diaspora Discovery
              </h2>

              <p>
                Connect with UMUHUZA members living
                in other countries.
              </p>

            </div>

          </div>


          <div className="location-toggle-row">

            <div className="toggle-content">

              <h3>
                Discover people abroad
              </h3>

              <p>
                Expand your discovery beyond your
                current country.
              </p>

            </div>


            <button
              type="button"
              className={`location-toggle ${
                diasporaEnabled
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDiasporaEnabled(
                  (previous) => !previous
                );
                setSaved(false);
                setError("");
              }}
              aria-label="Toggle diaspora discovery"
            >

              <span />

            </button>

          </div>


          {diasporaEnabled && (
            <div className="diaspora-picker">

              <div className="diaspora-picker-header">

                <div>

                  <strong>
                    Countries to Discover
                  </strong>

                  <p>
                    Select one or more countries.
                  </p>

                </div>


                <span className="selected-count">
                  {diasporaCountries.length}
                </span>

              </div>


              {/* SELECTED COUNTRIES */}

              {diasporaCountries.length > 0 && (
                <div className="selected-country-chips">

                  {diasporaCountries.map(
                    (code) => {

                      const item =
                        countries.find(
                          (countryItem) =>
                            countryItem.code === code
                        );

                      if (!item) {
                        return null;
                      }

                      return (
                        <button
                          type="button"
                          className="country-chip"
                          key={code}
                          onClick={() =>
                            removeDiasporaCountry(
                              code
                            )
                          }
                        >

                          <span>
                            {item.flag}
                          </span>

                          <span>
                            {item.name}
                          </span>

                          <span className="chip-remove">
                            ×
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>
              )}


              {/* SEARCH */}

              <div className="country-search">

                <FiSearch />

                <input
                  type="text"
                  value={countrySearch}
                  onChange={(event) =>
                    setCountrySearch(
                      event.target.value
                    )
                  }
                  placeholder="Search countries..."
                />

              </div>


              {/* COUNTRY LIST */}

              <div className="country-list">

                {filteredCountries.map(
                  (item) => {

                    const selected =
                      diasporaCountries.includes(
                        item.code
                      );

                    return (
                      <button
                        type="button"
                        key={item.code}
                        className={`country-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          toggleDiasporaCountry(
                            item.code
                          )
                        }
                      >

                        <span className="country-flag">
                          {item.flag}
                        </span>

                        <span className="country-name">
                          {item.name}
                        </span>

                        <span className="country-check">

                          {selected && (
                            <FiCheck />
                          )}

                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </section>


        {/* =================================================
            MATCH PREFERENCES
        ================================================= */}

        <section className="location-card">

          <div className="location-card-heading">

            <div className="location-card-heading-icon matching">
              <FiHeart />
            </div>

            <div>

              <h2>
                Discovery Preferences
              </h2>

              <p>
                Control how UMUHUZA chooses people
                to show you.
              </p>

            </div>

          </div>


          {/* MATCH PREFERENCES */}

          <div className="location-toggle-row">

            <div className="toggle-content">

              <h3>
                Respect my dating preferences
              </h3>

              <p>
                Only show people who match your
                selected dating preferences.
              </p>

            </div>


            <button
              type="button"
              className={`location-toggle ${
                matchPreferencesOnly
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setMatchPreferencesOnly(
                  (previous) => !previous
                );
                setSaved(false);
              }}
              aria-label="Toggle dating preferences"
            >

              <span />

            </button>

          </div>


          {/* VISIBILITY */}

          <div className="location-toggle-row">

            <div className="toggle-content">

              <h3>
                Show me in discovery
              </h3>

              <p>
                When enabled, other eligible members
                can discover your profile.
              </p>

            </div>


            <button
              type="button"
              className={`location-toggle ${
                discoveryVisible
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setDiscoveryVisible(
                  (previous) => !previous
                );
                setSaved(false);
              }}
              aria-label="Toggle discovery visibility"
            >

              <span />

            </button>

          </div>

        </section>


        {/* =================================================
            PRIVACY NOTICE
        ================================================= */}

        <div className="location-privacy-note">

          <div className="privacy-note-icon">
            <FiEye />
          </div>


          <div>

            <strong>
              Your location stays private
            </strong>

            <p>
              UMUHUZA uses your location to improve
              discovery. Your exact address or precise
              GPS coordinates are not shown to other
              members.
            </p>

          </div>

        </div>


        {/* =================================================
            SAVE
        ================================================= */}

        <div className="location-save-container">

          <button
            type="button"
            className="location-save-btn"
            onClick={handleSave}
            disabled={saving}
          >

            {saving ? (
              <>
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


      </main>

    </div>
  );
}


export default LocationDiscovery;
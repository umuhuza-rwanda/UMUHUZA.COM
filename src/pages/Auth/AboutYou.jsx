import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useAppPreferences } from "../../context/AppPreferencesContext";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import { FiHeart, FiUser } from "react-icons/fi";
import { supabase } from "../../lib/supabase";

function AboutYou() {
  const navigate = useNavigate();
  const { t } = useAppPreferences();

  // =====================================================
  // FORM STATE
  // =====================================================
  const [personalStatus, setPersonalStatus] = useState("");
  const [lookingForGender, setLookingForGender] = useState("");
  const [relationGoal, setRelationGoal] = useState("");

  // =====================================================
  // TRANSLATED OPTIONS
  // =====================================================
  const personalStatusOptions = [
    { value: "single", label: t("status.single") || "Single" },
    { value: "divorced", label: t("status.divorced") || "Divorced" },
    { value: "widowed", label: t("status.widowed") || "Widowed" },
    { value: "separated", label: t("status.separated") || "Separated" },
  ];

  const lookingForOptions = [
    { value: "men", label: t("looking.men") || "👨 Men" },
    { value: "women", label: t("looking.women") || "👩 Women" },
    { value: "men-and-women", label: t("looking.both") || "👨 Men & 👩 Women" },
  ];

  const relationshipGoalOptions = [
    { value: "marriage", label: t("goal.marriage") || "💍 Marriage" },
    { value: "serious-relationship", label: t("goal.serious") || "❤️ Serious Relationship" },
    { value: "friendship", label: t("goal.friendship") || "🤝 Friendship" },
    { value: "getting-to-know", label: t("goal.gettingToKnow") || "💕 Getting to Know Someone" },
  ];

  // =====================================================
  // UI STATE
  // =====================================================
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SAVE ABOUT YOU
  // =====================================================
  const handleContinue = async () => {
    setError("");

    if (!personalStatus) {
      setError(t("aboutYou.errorStatus") || "Please select your personal status.");
      return;
    }

    if (!lookingForGender) {
      setError(t("aboutYou.errorLooking") || "Please choose who you are looking for.");
      return;
    }

    if (!relationGoal) {
      setError(t("aboutYou.errorGoal") || "Please choose your relationship goal.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(t("aboutYou.errorSession") || "Your account session could not be found. Please log in again.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          personal_status: personalStatus,
          looking_for_gender: lookingForGender,
          relation_goal: relationGoal,
          about_you_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(t("aboutYou.errorSave") || `Profile could not be saved: ${updateError.message}`);
        return;
      }

      navigate("/profile-setup");
    } catch (err) {
      setError(err?.message || t("aboutYou.errorGeneric") || "Something went wrong. Please try again.");
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

        {/* LEFT SIDE */}
        <div className="auth-welcome">
          <div className="premium-logo">
            <img src={umurangaLogo} alt="UMUHUZA" />
          </div>

          <h1>
            {t("aboutYou.heroTitle") || "Tell Us"}
            <br />
            {t("aboutYou.heroTitle2") || "About You"}
          </h1>

          <p>
            {t("aboutYou.heroSubtitle") ||
              "Help us understand what you are looking for so UMUHUZA can help you discover meaningful connections."}
          </p>

          <LanguageSwitcher />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-container">
          <div className="auth-form">

            <h2>{t("aboutYou.title") || "About You"}</h2>
            <p className="auth-subtitle">
              {t("aboutYou.subtitle") || "Choose the options that describe you."}
            </p>

            {/* STEP INDICATOR */}
            <div className="signup-progress">
              <div className="progress-step completed">
                <span>✓</span>
                <small>{t("signup.stepAccount") || "Account"}</small>
              </div>
              <div className="progress-line active-line"></div>
              <div className="progress-step active">
                <span>2</span>
                <small>{t("signup.stepAbout") || "About You"}</small>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <span>3</span>
                <small>{t("signup.stepProfile") || "Profile"}</small>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {/* PERSONAL STATUS */}
            <div className="form-group">
              <label htmlFor="personalStatus">
                {t("aboutYou.personalStatus") || "Personal Status"}
              </label>
              <div className="input-wrapper">
                <FiUser />
                <select
                  id="personalStatus"
                  value={personalStatus}
                  onChange={(e) => setPersonalStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="">
                    {t("aboutYou.selectStatus") || "Select your personal status"}
                  </option>
                  {personalStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOOKING FOR */}
            <div className="form-group">
              <label htmlFor="lookingForGender">
                {t("aboutYou.lookingFor") || "Who are you looking for?"}
              </label>
              <div className="input-wrapper">
                <FiHeart />
                <select
                  id="lookingForGender"
                  value={lookingForGender}
                  onChange={(e) => setLookingForGender(e.target.value)}
                  disabled={loading}
                >
                  <option value="">
                    {t("aboutYou.selectLookingFor") || "Choose who you want to meet"}
                  </option>
                  {lookingForOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <small className="input-help">
                {t("aboutYou.lookingHelp") ||
                  "UMUHUZA will use this to help recommend compatible people."}
              </small>
            </div>

            {/* RELATIONSHIP GOAL */}
            <div className="form-group">
              <label htmlFor="relationGoal">
                {t("aboutYou.relationshipGoal") || "Relationship Goal"}
              </label>
              <div className="input-wrapper">
                <FiHeart />
                <select
                  id="relationGoal"
                  value={relationGoal}
                  onChange={(e) => setRelationGoal(e.target.value)}
                  disabled={loading}
                >
                  <option value="">
                    {t("aboutYou.selectGoal") || "Choose your relationship goal"}
                  </option>
                  {relationshipGoalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <small className="input-help">
                {t("aboutYou.goalHelp") ||
                  "Choose what you genuinely hope to find on UMUHUZA."}
              </small>
            </div>

            {/* CONTINUE BUTTON */}
            <button
              type="button"
              className="auth-primary-btn"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading
                ? t("aboutYou.saving") || "Saving Your Information..."
                : t("aboutYou.continue") || "Continue ❤️"}
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

export default AboutYou;
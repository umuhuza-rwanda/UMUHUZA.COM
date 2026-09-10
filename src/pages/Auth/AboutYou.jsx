import "./Auth.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiHeart,
  FiUser,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";


function AboutYou() {

  const navigate = useNavigate();


  // =====================================================
  // FORM STATE
  // =====================================================

  const [personalStatus, setPersonalStatus] =
    useState("");

  const [lookingForGender, setLookingForGender] =
    useState("");

  const [relationGoal, setRelationGoal] =
    useState("");


  // =====================================================
  // UI STATE
  // =====================================================

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // SAVE ABOUT YOU
  // =====================================================

 const handleContinue = async () => {
  setError("");

  // =====================================================
  // VALIDATION
  // =====================================================

  if (!personalStatus) {
    setError("Please select your personal status.");
    return;
  }

  if (!lookingForGender) {
    setError("Please choose who you are looking for.");
    return;
  }

  if (!relationGoal) {
    setError("Please choose your relationship goal.");
    return;
  }

  setLoading(true);

  try {
    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "UMUHUZA About You auth error:",
        userError
      );

      setError(
        "We couldn't verify your account. Please try again."
      );

      return;
    }

    if (!user) {
      console.error(
        "UMUHUZA: No authenticated user found."
      );

      setError(
        "Your account session could not be found. Please log in again."
      );

      return;
    }

    console.log(
      "UMUHUZA USER FOUND:",
      user.id
    );

    // =====================================================
    // SAVE ABOUT YOU
    // =====================================================
    //
    // IMPORTANT:
    // We only update columns that actually exist
    // in the profiles table.
    //
    // No signup_step.
    // No email verification check.
    // No refreshSession().
    //
    // =====================================================

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

    // =====================================================
    // DATABASE ERROR
    // =====================================================

    if (updateError) {
      console.error(
        "=========================================="
      );

      console.error(
        "UMUHUZA ABOUT YOU DATABASE ERROR"
      );

      console.error(updateError);

      console.error(
        "=========================================="
      );

      setError(
        `Profile could not be saved: ${updateError.message}`
      );

      return;
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      "=========================================="
    );

    console.log(
      "UMUHUZA ABOUT YOU SAVED SUCCESSFULLY"
    );

    console.log(
      "User ID:",
      user.id
    );

    console.log(
      "Personal Status:",
      personalStatus
    );

    console.log(
      "Looking For:",
      lookingForGender
    );

    console.log(
      "Relationship Goal:",
      relationGoal
    );

    console.log(
      "=========================================="
    );

    // =====================================================
    // GO TO PROFILE SETUP
    // =====================================================

    navigate("/profile-setup");

  } catch (unexpectedError) {
    console.error(
      "UMUHUZA unexpected About You error:",
      unexpectedError
    );

    setError(
      unexpectedError?.message ||
      "Something went wrong while saving your information. Please try again."
    );

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

          <div className="auth-logo">
            ❤️ UMUHUZA
          </div>


          <h1>

            Tell Us

            <br />

            About You

          </h1>


          <p>

            Help us understand what you are
            looking for so UMUHUZA can help
            you discover meaningful connections.

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

              About You

            </h2>


            <p className="auth-subtitle">

              Choose the options that describe you.

            </p>



            {/* =================================================
                STEP INDICATOR
            ================================================= */}

            <div className="signup-progress">


              {/* ACCOUNT */}

              <div className="progress-step completed">

                <span>

                  ✓

                </span>

                <small>

                  Account

                </small>

              </div>


              {/* LINE */}

              <div className="progress-line active-line"></div>


              {/* ABOUT YOU */}

              <div className="progress-step active">

                <span>

                  2

                </span>

                <small>

                  About You

                </small>

              </div>


              {/* LINE */}

              <div className="progress-line"></div>


              {/* PROFILE */}

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
                PERSONAL STATUS
            ================================================= */}

            <div className="form-group">

              <label htmlFor="personalStatus">

                Personal Status

              </label>


              <div className="input-wrapper">

                <FiUser />


                <select
                  id="personalStatus"
                  value={personalStatus}
                  onChange={(event) =>
                    setPersonalStatus(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >

                  <option value="">

                    Select your personal status

                  </option>


                  <option value="single">

                    Single

                  </option>


                  <option value="divorced">

                    Divorced

                  </option>


                  <option value="widowed">

                    Widowed

                  </option>


                  <option value="separated">

                    Separated

                  </option>

                </select>

              </div>

            </div>



            {/* =================================================
                WHO ARE YOU LOOKING FOR
            ================================================= */}

            <div className="form-group">

              <label htmlFor="lookingForGender">

                Who are you looking for?

              </label>


              <div className="input-wrapper">

                <FiHeart />


                <select
                  id="lookingForGender"
                  value={lookingForGender}
                  onChange={(event) =>
                    setLookingForGender(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >

                  <option value="">

                    Choose who you want to meet

                  </option>


                  <option value="men">

                    👨 Men

                  </option>


                  <option value="women">

                    👩 Women

                  </option>


                  <option value="men-and-women">

                    👨 Men & 👩 Women

                  </option>

                </select>

              </div>


              <small className="input-help">

                UMUHUZA will use this to help
                recommend compatible people.

              </small>

            </div>



            {/* =================================================
                RELATIONSHIP GOAL
            ================================================= */}

            <div className="form-group">

              <label htmlFor="relationGoal">

                Relationship Goal

              </label>


              <div className="input-wrapper">

                <FiHeart />


                <select
                  id="relationGoal"
                  value={relationGoal}
                  onChange={(event) =>
                    setRelationGoal(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >

                  <option value="">

                    Choose your relationship goal

                  </option>


                  <option value="marriage">

                    💍 Marriage

                  </option>


                  <option value="serious-relationship">

                    ❤️ Serious Relationship

                  </option>


                  <option value="friendship">

                    🤝 Friendship

                  </option>


                  <option value="getting-to-know">

                    💕 Getting to Know Someone

                  </option>

                </select>

              </div>


              <small className="input-help">

                Choose what you genuinely hope
                to find on UMUHUZA.

              </small>

            </div>



            {/* =================================================
                CONTINUE
            ================================================= */}

            <button
              type="button"
              className="auth-primary-btn"
              onClick={handleContinue}
              disabled={loading}
            >

              {loading

                ? "Saving Your Information..."

                : "Continue ❤️"

              }

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


export default AboutYou;
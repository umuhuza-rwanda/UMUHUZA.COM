import "./HelpSupport.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiHelpCircle,
  FiMail,
  FiExternalLink,
  FiChevronDown,
  FiUser,
  FiMessageCircle,
  FiMoon,
  FiHeart,
  FiShield,
  FiLock,
  FiFlag,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";


function HelpSupport() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  // =====================================================
  // BACK TO PROFILE
  // =====================================================

  const handleBack = () => {
    window.location.href = "/profile";
  };


  // =====================================================
  // SUPPORT EMAIL
  // =====================================================

  const handleEmailSupport = () => {
    window.location.href =
      "mailto:umuranga.support@gmail.com";
  };


  // =====================================================
  // FAQ DATA
  // =====================================================

  const faqs = [
    {
      id: 1,
      icon: <FiUser />,
      category: "Profile",
      question: "How can I edit my profile?",
      answer:
        "You can update your name, date of birth, gender, country, city, and other personal information from your Profile settings.",
      action: () => {
        navigate("/member/profile/personal-information");
      },
      actionText: "Edit my profile",
    },

    {
      id: 2,
      icon: <FiMessageCircle />,
      category: "App Preferences",
      question: "How can I change my language?",
      answer:
        "Open App Preferences from your Profile settings. From there, you can choose the language you want to use throughout the app.",
      action: () => {
        navigate("/member/profile/app-preferences");
      },
      actionText: "Open App Preferences",
    },

    {
      id: 3,
      icon: <FiMoon />,
      category: "App Preferences",
      question: "How can I change the appearance of the app?",
      answer:
        "You can change the appearance of the app from App Preferences. Choose the appearance option that works best for you.",
      action: () => {
        navigate("/member/profile/app-preferences");
      },
      actionText: "Open App Preferences",
    },

    {
      id: 4,
      icon: <FiHeart />,
      category: "Dating",
      question: "How can I change my dating preferences?",
      answer:
        "Your dating preferences help us understand the type of person you would like to meet. You can update these preferences from Dating Preferences in your Profile settings.",
      action: () => {
        navigate("/member/profile/dating-preferences");
      },
      actionText: "Dating Preferences",
    },

    {
      id: 5,
      icon: <FiShield />,
      category: "Privacy",
      question: "How can I control my privacy?",
      answer:
        "Privacy settings allow you to control profile visibility, discovery, location visibility, online activity, messages, likes, and read receipts.",
      action: () => {
        navigate("/member/profile/privacy");
      },
      actionText: "Manage Privacy",
    },

    {
      id: 6,
      icon: <FiLock />,
      category: "Security",
      question: "I forgot my password. What should I do?",
      answer:
        "If you cannot remember your password, use the password reset option. We will send instructions to the email address associated with your account.",
      action: () => {
        navigate("/forgot-password");
      },
      actionText: "Reset my password",
    },

    {
      id: 7,
      icon: <FiFlag />,
      category: "Safety",
      question: "How can I report a member?",
      answer:
        "If another member is behaving inappropriately, violating our rules, or making you uncomfortable, please contact our support team. Include as much useful information as possible.",
      action: handleEmailSupport,
      actionText: "Contact support",
    },

    {
      id: 8,
      icon: <FiTrash2 />,
      category: "Account",
      question: "How can I delete my account?",
      answer:
        "You can permanently delete your account from Account Security. Please make sure you really want to delete your account because account deletion is permanent.",
      action: () => {
        navigate("/member/profile/account-security");
      },
      actionText: "Open Account Security",
    },
  ];


  // =====================================================
  // FAQ SEARCH
  // =====================================================

  const filteredFaqs = faqs.filter((faq) => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return true;
    }

    return (
      faq.question.toLowerCase().includes(search) ||
      faq.answer.toLowerCase().includes(search) ||
      faq.category.toLowerCase().includes(search)
    );
  });


  // =====================================================
  // FAQ TOGGLE
  // =====================================================

  const toggleFaq = (id) => {
    setOpenFaq(
      openFaq === id
        ? null
        : id
    );
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="help-support-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="help-support-header">

        <div className="help-support-header-inner">

          <button
            type="button"
            className="help-support-back-btn"
            onClick={handleBack}
            aria-label="Back to Profile"
          >
            <FiArrowLeft />

            <span>
              Back to Profile
            </span>
          </button>


          <div className="help-support-brand">

            <span className="help-support-brand-heart">
              ❤️
            </span>

            UMUHUZA

          </div>


          <div className="help-support-header-icon">
            <FiHelpCircle />
          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="help-support-main">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="help-support-hero">

          <div className="help-support-hero-icon">
            <FiHelpCircle />
          </div>


          <span className="help-support-eyebrow">
            HELP & SUPPORT
          </span>


          <h1>
            How can we help you?
          </h1>


          <p>
            Find answers to common questions about your
            profile, privacy, dating preferences, security,
            and using UMUHUZA.
          </p>


          {/* SEARCH */}

          <div className="help-support-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search help questions"
            />

            {searchTerm && (
              <button
                type="button"
                className="help-support-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

        </section>


        {/* =================================================
            QUICK SUPPORT
        ================================================= */}

        <section className="help-support-quick-card">

          <div className="help-support-quick-icon">
            <FiMail />
          </div>


          <div className="help-support-quick-content">

            <span>
              NEED PERSONAL HELP?
            </span>

            <h2>
              Our support team is here for you.
            </h2>

            <p>
              Can't find what you're looking for?
              Send us an email and we'll be happy to help.
            </p>

          </div>


          <button
            type="button"
            className="help-support-quick-btn"
            onClick={handleEmailSupport}
          >
            <FiMail />
            Contact Support
          </button>

        </section>


        {/* =================================================
            FAQ SECTION
        ================================================= */}

        <section className="help-support-faq-section">


          {/* FAQ HEADER */}

          <div className="help-support-section-heading">

            <div className="help-support-section-heading-icon">
              <FiHelpCircle />
            </div>


            <div>

              <span className="help-support-eyebrow">
                COMMON QUESTIONS
              </span>

              <h2>
                Frequently Asked Questions
              </h2>

              <p>
                Select a question below to see the answer.
              </p>

            </div>

          </div>


          {/* =================================================
              FAQ LIST
          ================================================= */}

          <div className="help-support-faq-list">

            {filteredFaqs.length > 0 ? (

              filteredFaqs.map((faq) => {

                const isOpen =
                  openFaq === faq.id;


                return (
                  <article
                    key={faq.id}
                    className={
                      `help-support-faq-item ${
                        isOpen ? "open" : ""
                      }`
                    }
                  >

                    {/* QUESTION */}

                    <button
                      type="button"
                      className="help-support-faq-question"
                      onClick={() =>
                        toggleFaq(faq.id)
                      }
                      aria-expanded={isOpen}
                    >

                      <div className="help-support-faq-question-icon">
                        {faq.icon}
                      </div>


                      <div className="help-support-faq-question-content">

                        <span className="help-support-faq-category">
                          {faq.category}
                        </span>

                        <h3>
                          {faq.question}
                        </h3>

                      </div>


                      <div className="help-support-faq-chevron-wrap">

                        <FiChevronDown
                          className="help-support-faq-chevron"
                        />

                      </div>

                    </button>


                    {/* ANSWER */}

                    {isOpen && (

                      <div className="help-support-faq-answer">

                        <div className="help-support-answer-line">
                          <FiCheckCircle />
                        </div>


                        <div className="help-support-answer-content">

                          <p>
                            {faq.answer}
                          </p>


                          {faq.action && (
                            <button
                              type="button"
                              className="help-support-faq-action"
                              onClick={faq.action}
                            >

                              {faq.actionText}

                              <FiExternalLink />

                            </button>
                          )}

                        </div>

                      </div>

                    )}

                  </article>
                );

              })

            ) : (

              /* =================================================
                 NO SEARCH RESULTS
              ================================================= */

              <div className="help-support-no-results">

                <div className="help-support-no-results-icon">
                  <FiSearch />
                </div>

                <h3>
                  No questions found
                </h3>

                <p>
                  We couldn't find an answer matching
                  "{searchTerm}".
                </p>

                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                >
                  Show all questions
                </button>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            SAFETY CARD
        ================================================= */}

        <section className="help-support-safety-card">

          <div className="help-support-safety-icon">
            <FiShield />
          </div>


          <div>

            <span className="help-support-safety-label">
              YOUR SAFETY MATTERS
            </span>

            <h2>
              Stay safe while meeting people online.
            </h2>

            <p>
              Never share passwords, financial information,
              or other sensitive information with another
              member. If something doesn't feel right,
              trust your instincts and report it.
            </p>

          </div>

        </section>


        {/* =================================================
            CONTACT SUPPORT
        ================================================= */}

        <section className="help-support-contact-card">

          <div className="help-support-contact-icon">
            <FiMail />
          </div>


          <div className="help-support-contact-content">

            <span>
              STILL NEED HELP?
            </span>

            <h2>
              We're happy to help.
            </h2>

            <p>
              Send us a message and our support team
              will help you with your question.
            </p>


            <button
              type="button"
              className="help-support-contact-btn"
              onClick={handleEmailSupport}
            >

              <FiMail />

              <span>
                umuranga.support@gmail.com
              </span>

              <FiExternalLink />

            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="help-support-footer">

          <div className="help-support-footer-heart">
            ❤️
          </div>


          <strong>
            UMUHUZA
          </strong>


          <p>
            Meaningful connections, made with care.
          </p>


          <small>
            Your privacy and safety matter to us.
          </small>

        </footer>

      </main>

    </div>
  );
}


export default HelpSupport;
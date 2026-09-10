import "./Navbar.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";


import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiPhone,
  FiHeart,
  FiHelpCircle,
  FiStar,
  FiMessageCircle,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";


function Navbar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);


  // =====================================================
  // WHATSAPP GROUP LINK
  // =====================================================
// =====================================================
// WHATSAPP GROUP LINK
// =====================================================

const whatsappGroupLink =
  "https://chat.whatsapp.com/IAOf4F19GvS9eNhFLByjcz";


const handleWhatsApp = () => {
  if (!whatsappGroupLink) {
    alert(
      "WhatsApp group link has not been added yet."
    );

    return;
  }

  window.open(
    whatsappGroupLink,
    "_blank",
    "noopener,noreferrer"
  );
};
  // =====================================================
  // NORMAL NAVIGATION
  // =====================================================

  const goTo = (path) => {

    setMenuOpen(false);

    navigate(path);

  };


  // =====================================================
  // GO TO HOMEPAGE SECTION
  // =====================================================

  const goToSection = (sectionId) => {

    setMenuOpen(false);

    // If already on homepage
    if (
      window.location.pathname === "/"
    ) {

      const section =
        document.getElementById(
          sectionId
        );

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

      return;

    }


    // If coming from another page,
    // first go to homepage.
    navigate("/");


    // Wait for homepage to render,
    // then scroll to the section.
    setTimeout(() => {

      const section =
        document.getElementById(
          sectionId
        );

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 300);

  };


  // =====================================================
  // MENU
  // =====================================================

  const menuItems = [

    {
      label: "Home",
      icon: <FiHome />,
      action: () =>
        goTo("/"),
    },


    {
      label: "About Us",
      icon: <FiInfo />,
      action: () =>
        goTo("/about-us"),
    },


    {
      label: "Contact Us",
      icon: <FiPhone />,
      action: () =>
        goToSection("contact"),
    },


    {
      label: "Successful Stories",
      icon: <FiHeart />,
      action: () =>
        goToSection(
          "successful-stories"
        ),
    },


    {
      label: "How It Works",
      icon: <FiHelpCircle />,
      action: () =>
        goToSection(
          "how-it-works"
        ),
    },


    {
      label: "Umuranga Experiences",
      icon: <FiStar />,
      action: () =>
        goToSection(
          "umuranga-experiences"
        ),
    },

  ];


  // =====================================================
  // NAVBAR
  // =====================================================

  return (

    <>

      <nav className="navbar">


        {/* =================================================
            LOGO
        ================================================= */}

        <div
          className="logo"
          onClick={() =>
            goTo("/")
          }
        >

          <span className="logo-heart">
            
          </span>

            <img
              src={umurangaLogo}
              alt="UMURANGA.COM"
            />


        </div>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="desktop-nav-links">


          {/* HOME */}

          <button
            type="button"
            onClick={() =>
              goTo("/")
            }
          >

            <FiHome />

            <span>
              Home
            </span>

          </button>


          {/* ABOUT US */}

          <button
            type="button"
            onClick={() =>
              goTo("/about-us")
            }
          >

            <FiInfo />

            <span>
              About Us
            </span>

          </button>


          {/* CHAT */}

          <button
            type="button"
            onClick={() =>
              goTo("/chat")
            }
          >

            

            <span>
              
            </span>

          </button>


        </div>


        {/* =================================================
            DESKTOP RIGHT SIDE
        ================================================= */}

        <div className="nav-right">


          {/* =================================================
              WHATSAPP
          ================================================= */}

          <button
            type="button"
            className="whatsapp-btn"
            onClick={
              handleWhatsApp
            }
          >

            <span className="whatsapp-icon">
              🟢
            </span>

            <span>
              WhatsApp
            </span>

          </button>


          {/* =================================================
              SIGN UP
          ================================================= */}

          <button
            type="button"
            className="signup-btn"
            onClick={() =>
              goTo("/signup")
            }
          >

            <FiUserPlus />

            <span>
              Sign Up
            </span>

          </button>


          {/* =================================================
              LOGIN
          ================================================= */}

          <button
            type="button"
            className="login-btn"
            onClick={() =>
              goTo("/login")
            }
          >

            <FiLogIn />

            <span>
              Login
            </span>

          </button>


          {/* =================================================
              DESKTOP MENU
          ================================================= */}

          <button
            type="button"
            className="menu-btn"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            aria-label="Open menu"
          >

            {menuOpen ? (

              <FiX />

            ) : (

              <FiMenu />

            )}

          </button>


        </div>


        {/* =================================================
            MOBILE RIGHT SIDE
        ================================================= */}

        <div className="mobile-nav-right">


          {/* =================================================
              MOBILE SIGN UP
          ================================================= */}

          <button
            type="button"
            className="mobile-signup-btn"
            onClick={() =>
              goTo("/signup")
            }
          >

            Sign Up

          </button>


          {/* =================================================
              MOBILE LOGIN
          ================================================= */}

          <button
            type="button"
            className="mobile-login-btn"
            onClick={() =>
              goTo("/login")
            }
          >

            Login

          </button>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            aria-label="Open menu"
          >

            {menuOpen ? (

              <FiX />

            ) : (

              <FiMenu />

            )}

          </button>


        </div>


      </nav>


      {/* ===================================================
          MENU OVERLAY
      =================================================== */}

      {menuOpen && (

        <div
          className="navbar-menu-overlay"
          onClick={() =>
            setMenuOpen(false)
          }
        />

      )}


      {/* ===================================================
          MENU PANEL
      =================================================== */}

      <div
        className={`navbar-menu ${
          menuOpen
            ? "open"
            : ""
        }`}
      >


        {/* =================================================
            MENU HEADER
        ================================================= */}

        <div className="navbar-menu-header">


          <div>

            <span className="navbar-menu-title">
              UMUHUZA
            </span>

            <small>
              Explore UMUHUZA.COM
            </small>

          </div>


          <button
            type="button"
            className="navbar-menu-close"
            onClick={() =>
              setMenuOpen(false)
            }
            aria-label="Close menu"
          >

            <FiX />

          </button>


        </div>


        {/* =================================================
            MENU ITEMS
        ================================================= */}

        <div className="navbar-menu-items">

          {menuItems.map(
            (item) => (

              <button
                key={
                  item.label
                }
                type="button"
                className="navbar-menu-item"
                onClick={
                  item.action
                }
              >

                <span className="menu-item-icon">

                  {item.icon}

                </span>

                <span>

                  {item.label}

                </span>

              </button>

            )
          )}

        </div>


        {/* =================================================
            MENU BOTTOM
        ================================================= */}

        <div className="navbar-menu-footer">


          <p>
            ❤️ Find genuine connections.
          </p>


          <button
            type="button"
            onClick={() =>
              goTo("/signup")
            }
          >

            Create Free Account

          </button>


        </div>


      </div>

    </>

  );

}


export default Navbar;
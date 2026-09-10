import "./Settings.css";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiHeart,
  FiMapPin,
  FiBell,
  FiLock,
  FiShield,
  FiGlobe,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiArrowLeft,
  FiMoon,
  FiSun,
} from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: <FiUser />,
          label: "Personal Information",
          description: "Name, age, photos & bio",
          path: "/member/profile/personal-information",
          color: "#7c3aed",
        },
        {
          icon: <FiHeart />,
          label: "Dating Preferences",
          description: "Who you want to meet",
          path: "/member/profile/dating-preferences",
          color: "#db2777",
        },
        {
          icon: <FiMapPin />,
          label: "Location & Discovery",
          description: "City, distance & visibility",
          path: "/member/profile/location-discovery",
          color: "#2563eb",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: <FiBell />,
          label: "Notifications",
          description: "Push, email & in-app alerts",
          path: "/member/profile/notifications",
          color: "#ea580c",
        },
        {
          icon: <FiGlobe />,
          label: "Language & Theme",
          description: "App language and appearance",
          path: "/member/profile/app-preferences",
          color: "#0891b2",
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: <FiLock />,
          label: "Account & Security",
          description: "Password, email & login",
          path: "/member/profile/account-security",
          color: "#4f46e5",
        },
        {
          icon: <FiShield />,
          label: "Privacy",
          description: "Who can see your profile",
          path: "/member/profile/privacy",
          color: "#059669",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <FiHelpCircle />,
          label: "Help & Support",
          description: "FAQs, contact & report",
          path: "/member/profile/help-support",
          color: "#7c3aed",
        },
      ],
    },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <button
          className="settings-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FiArrowLeft />
        </button>
        <h1>Settings</h1>
        <div className="settings-header-spacer" />
      </header>

      <main className="settings-content">
        {/* Profile Card */}
        <div className="settings-profile-card">
          <div className="settings-avatar">
            <FiUser />
          </div>
          <div className="settings-profile-info">
            <h2>Your Profile</h2>
            <p>Manage your account and preferences</p>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <section key={group.title} className="settings-group">
            <h3 className="settings-group-title">{group.title}</h3>
            <div className="settings-list">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="settings-item"
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className="settings-item-icon"
                    style={{ backgroundColor: item.color + "18", color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="settings-item-text">
                    <span className="settings-item-label">{item.label}</span>
                    <span className="settings-item-desc">{item.description}</span>
                  </div>
                  <FiChevronRight className="settings-item-arrow" />
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <button className="settings-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          Log Out
        </button>

        <p className="settings-version">UMUHUZA.com · Version 1.0</p>
      </main>
    </div>
  );
}

export default Settings;
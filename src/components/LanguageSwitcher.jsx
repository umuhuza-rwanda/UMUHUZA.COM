import { useAppPreferences } from "../context/AppPreferencesContext";

function LanguageSwitcher() {
  const { language, changeLanguage } = useAppPreferences();

  const languages = [
    {
      code: "en",
      label: "English",
      flag: "🇬🇧",
      bg: "#3B82F6",
      color: "#EF4444",
    },
    {
      code: "rw",
      label: "Kinyarwanda",
      flag: "🇷🇼",
      bg: "#10B981",
      color: "#ffffff",
    },
    {
      code: "sw",
      label: "Kiswahili",
      flag: "🌍",
      bg: "#EC4899",
      color: "#ffffff",
    },
    {
      code: "fr",
      label: "Français",
      flag: "🇫🇷",
      bg: "#EF4444",
      color: "#ffffff",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
        marginTop: "16px",
      }}
    >
      {languages.map((item) => {
        const isActive = language === item.code;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => changeLanguage(item.code)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: isActive ? "#86EFAC" : item.bg,
              color: isActive ? "#065F46" : item.color,
              border: "none",
              borderRadius: "20px",
              padding: "6px 12px",          // ← smaller padding
              cursor: "pointer",
              fontSize: "12px",             // ← smaller text
              fontWeight: 600,
              boxShadow: isActive
                ? "0 3px 10px rgba(0,0,0,0.15)"
                : "0 2px 8px rgba(0,0,0,0.12)",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "13px" }}>{item.flag}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
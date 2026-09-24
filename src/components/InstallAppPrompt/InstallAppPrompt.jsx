import { useEffect, useState } from "react";
import { FiDownload, FiX, FiBell } from "react-icons/fi";
import "./InstallAppPrompt.css";

function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Already running as an installed app
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    // Browser provides the installation prompt
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      setInstallPrompt(event);

      // Small delay so the popup doesn't appear immediately
      setTimeout(() => {
        const dismissed =
          localStorage.getItem(
            "umuhuza_install_prompt_dismissed"
          );

        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 1200);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } =
      await installPrompt.userChoice;

    console.log(
      "UMUHUZA install result:",
      outcome
    );

    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    localStorage.setItem(
      "umuhuza_install_prompt_dismissed",
      "true"
    );

    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="umuhuza-install-banner">
      <div className="umuhuza-install-content">

        <div className="umuhuza-install-icon">
          ❤️
        </div>

        <div className="umuhuza-install-text">
          <strong>
            Install UMUHUZA App
          </strong>

          <span>
            Get easier access and notifications
          </span>
        </div>

        <button
          type="button"
          className="umuhuza-install-button"
          onClick={handleInstall}
        >
          <FiDownload />
          Install
        </button>

        <button
          type="button"
          className="umuhuza-install-close"
          onClick={handleClose}
          aria-label="Close install message"
        >
          <FiX />
        </button>

      </div>
    </div>
  );
}

export default InstallAppPrompt;
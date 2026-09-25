import { useEffect, useState } from "react";
import {
  FiDownload,
  FiX,
  FiBell,
  FiShare2,
} from "react-icons/fi";

import "./InstallAppPrompt.css";

function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [mobileFallback, setMobileFallback] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    const userAgent =
      navigator.userAgent || navigator.vendor || window.opera || "";

    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);

    const isAndroid = /Android/i.test(userAgent);

    setIosDevice(isIOS);

    /*
     * Native browser install prompt
     */
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      console.log(
        "📲 UMUHUZA install prompt available"
      );

      setInstallPrompt(event);
      setMobileFallback(false);

      const dismissed =
        localStorage.getItem(
          "umuhuza_install_prompt_dismissed"
        );

      if (!dismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1200);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    /*
     * Mobile fallback
     *
     * Some mobile browsers do not provide
     * beforeinstallprompt.
     */
    const dismissed =
      localStorage.getItem(
        "umuhuza_install_prompt_dismissed"
      );

    if (!dismissed && (isAndroid || isIOS)) {
      setTimeout(() => {
        setMobileFallback(true);
        setShowPrompt(true);
      }, 1800);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    /*
     * Native install prompt available
     */
    if (installPrompt) {
      try {
        installPrompt.prompt();

        const { outcome } =
          await installPrompt.userChoice;

        console.log(
          "UMUHUZA install result:",
          outcome
        );

        setInstallPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error(
          "UMUHUZA install error:",
          error
        );
      }

      return;
    }

    /*
     * Mobile fallback
     */
    setShowPrompt(false);

    if (iosDevice) {
      alert(
        "To install UMUHUZA:\n\n" +
        "1. Tap the Share button in your browser.\n" +
        "2. Choose \"Add to Home Screen\".\n" +
        "3. Tap Add."
      );

      return;
    }

    alert(
      "To install UMUHUZA:\n\n" +
      "1. Open your browser menu (⋮).\n" +
      "2. Choose \"Add to Home screen\" or \"Install app\".\n" +
      "3. Confirm the installation."
    );
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
          {installPrompt ? (
            <FiDownload />
          ) : iosDevice ? (
            <FiShare2 />
          ) : (
            <FiDownload />
          )}

          {installPrompt
            ? "Install"
            : "How to Install"}
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
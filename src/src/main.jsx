if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "UMUHUZA service worker registered:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error(
          "UMUHUZA service worker registration failed:",
          error
        );
      });
  });
}
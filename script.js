(function () {
  "use strict";

  var root = document.documentElement;
  var toggleBtn = document.getElementById("theme-toggle");
  var logo = document.getElementById("logo");
  var themeColorMeta = document.getElementById("theme-color-meta");

  var LOGO_SRC = {
    dark: "assets/logo-dark.png",
    light: "assets/logo-light.png"
  };

  var THEME_COLOR = {
    dark: "#000000",
    light: "#ffffff"
  };

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    logo.src = LOGO_SRC[theme];
    themeColorMeta.setAttribute("content", THEME_COLOR[theme]);
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  // Apply logo/meta for the theme already set (inline head script picked the theme).
  applyTheme(root.getAttribute("data-theme") || "dark");

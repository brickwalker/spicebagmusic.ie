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

  toggleBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("spicebag-theme", next);
    applyTheme(next);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------------- Gigs ----------------

  var DATE_FMT = { weekday: "short", day: "numeric", month: "short" };

  function formatGigDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return { day: "", month: "" };
    var day = d.getDate();
    var month = d.toLocaleDateString("en-IE", { month: "short" });
    return { day: day, month: month.toUpperCase(), full: d };
  }

  function renderGigs(gigs) {
    var section = document.getElementById("gigs");
    var list = document.getElementById("gigs-list");

    if (!Array.isArray(gigs) || gigs.length === 0) {
      section.hidden = true;
      return;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var upcoming = gigs
      .filter(function (g) {
        return g && g.date;
      })
      .map(function (g) {
        return {
          raw: g,
          when: new Date(g.date + "T00:00:00")
        };
      })
      .filter(function (g) {
        return !isNaN(g.when.getTime()) && g.when >= today;
      })
      .sort(function (a, b) {
        return a.when - b.when;
      });

    if (upcoming.length === 0) {
      section.hidden = true;
      return;
    }

    list.innerHTML = "";

    upcoming.forEach(function (entry) {
      var g = entry.raw;
      var d = formatGigDate(g.date);

      var li = document.createElement("li");
      li.className = "gig";

      var dateEl = document.createElement("span");
      dateEl.className = "gig-date";
      dateEl.textContent = d.day + " " + d.month;

      var infoEl = document.createElement("span");
      infoEl.className = "gig-info";

      var venueEl = document.createElement("span");
      venueEl.className = "gig-venue";
      venueEl.textContent = g.venue || "";

      var cityEl = document.createElement("span");
      cityEl.className = "gig-city";
      cityEl.textContent = g.city ? " — " + g.city : "";

      var cityLine = document.createElement("div");
      cityLine.className = "gig-city";
      cityLine.textContent = g.city || "";

      infoEl.appendChild(venueEl);
      infoEl.appendChild(document.createElement("br"));
      infoEl.appendChild(cityLine);

      li.appendChild(dateEl);
      li.appendChild(infoEl);

      if (g.ticketUrl) {
        var linkEl = document.createElement("a");
        linkEl.className = "gig-tickets";
        linkEl.href = g.ticketUrl;
        linkEl.target = "_blank";
        linkEl.rel = "noopener";
        linkEl.textContent = "Tickets";
        li.appendChild(linkEl);
      }

      list.appendChild(li);
    });

    section.hidden = false;
  }

  fetch("gigs.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("gigs.json not found");
      return res.json();
    })
    .then(renderGigs)
    .catch(function () {
      // No gigs file, malformed JSON, or fetch blocked (e.g. opening index.html
      // directly via file://) — treat the same as "no gigs" and keep the
      // section hidden rather than showing an error to visitors.
      var section = document.getElementById("gigs");
      section.hidden = true;
    });
})();

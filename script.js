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

  // Accepts "YYYY-MM-DD" or "YYYY-MM-DD HH:MM" (a "T" separator also works).
  var GIG_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/;

  function parseGigDate(str) {
    var m = GIG_DATE_RE.exec(String(str || "").trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    var hasTime = m[4] !== undefined;
    var h = hasTime ? +m[4] : 0;
    var min = hasTime ? +m[5] : 0;
    var when = new Date(y, mo, d, h, min);
    // Reject impossible values such as 2026-02-31 or 25:00.
    if (
      isNaN(when.getTime()) ||
      when.getFullYear() !== y ||
      when.getMonth() !== mo ||
      when.getDate() !== d ||
      when.getHours() !== h ||
      when.getMinutes() !== min
    ) {
      return null;
    }
    return { when: when, hasTime: hasTime };
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
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
        var p = parseGigDate(g.date);
        return p && { raw: g, when: p.when, hasTime: p.hasTime };
      })
      .filter(function (g) {
        // A gig stays listed for the whole of its day, even once the
        // start time has passed.
        return g && g.when >= today;
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
      var when = entry.when;

      var li = document.createElement("li");
      li.className = "gig";

      var dateEl = document.createElement("span");
      dateEl.className = "gig-date";
      var dayEl = document.createElement("span");
      dayEl.className = "gig-day";
      dayEl.textContent =
        when.getDate() +
        " " +
        when.toLocaleDateString("en-IE", { month: "short" }).toUpperCase();
      dateEl.appendChild(dayEl);

      if (entry.hasTime) {
        var timeEl = document.createElement("span");
        timeEl.className = "gig-time";
        timeEl.textContent = pad2(when.getHours()) + ":" + pad2(when.getMinutes());
        dateEl.appendChild(timeEl);
      }

      var infoEl = document.createElement("span");
      infoEl.className = "gig-info";

      var venueEl = document.createElement("span");
      venueEl.className = "gig-venue";
      venueEl.textContent = g.venue || "";
      infoEl.appendChild(venueEl);

      if (g.city) {
        var cityLine = document.createElement("div");
        cityLine.className = "gig-city";
        cityLine.textContent = g.city;
        infoEl.appendChild(cityLine);
      }

      if (g.description) {
        var descEl = document.createElement("div");
        descEl.className = "gig-desc";
        descEl.textContent = g.description;
        infoEl.appendChild(descEl);
      }

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

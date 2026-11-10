(function () {
  "use strict";
  var C = window.FARMA_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Links from config ---------- */
  function waLink(text) {
    var base = "https://wa.me/" + (C.whatsapp || "34630282123");
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa-text") || C.whatsappTexto);
  });
  if (C.tienda) document.querySelectorAll("[data-shop]").forEach(function (a) { a.href = C.tienda; });
  if (C.buscarEnTienda) document.querySelectorAll("[data-shop-search]").forEach(function (a) {
    a.href = C.buscarEnTienda + encodeURIComponent(a.getAttribute("data-shop-search"));
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    var setOpen = function (open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
    header.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Open now (Europe/Madrid) ---------- */
  var DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  function madridNow() {
    var parts = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit",
      month: "2-digit", day: "2-digit", hour12: false
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.weekday);
    return { day: wd, minutes: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10), md: parts.month + "-" + parts.day };
  }
  function toMin(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }
  function fmt(hhmm) { return hhmm.replace(/^0/, ""); }
  function isSummer(md) {
    var v = C.verano; if (!v) return false;
    return v.desde <= v.hasta ? (md >= v.desde && md <= v.hasta) : (md >= v.desde || md <= v.hasta);
  }
  function scheduleFor(f, md) { return (f.horarioVerano && isSummer(md)) ? f.horarioVerano : f.horario; }

  function statusOf(key) {
    var f = C.farmacias && C.farmacias[key];
    if (!f) return null;
    var now = madridNow();
    var week = scheduleFor(f, now.md);
    var today = week[now.day] || [];
    for (var i = 0; i < today.length; i++) {
      if (now.minutes >= toMin(today[i][0]) && now.minutes < toMin(today[i][1])) {
        return { open: true, long: "Abierta ahora · cierra a las " + fmt(today[i][1]), short: "Abierta ahora" };
      }
    }
    for (var j = 0; j < today.length; j++) {
      if (now.minutes < toMin(today[j][0])) {
        return { open: false, long: "Cerrada ahora · abre hoy a las " + fmt(today[j][0]), short: "Abre a las " + fmt(today[j][0]) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var idx = (now.day + d) % 7;
      var next = week[idx];
      if (next && next.length) {
        var when = d === 1 ? "mañana" : "el " + DAYS[idx];
        return { open: false, long: "Cerrada ahora · abre " + when + " a las " + fmt(next[0][0]), short: "Cerrada" };
      }
    }
    return null;
  }

  function paintStatus() {
    document.querySelectorAll("[data-status]").forEach(function (el) {
      var key = el.getAttribute("data-status");
      var s = statusOf(key);
      if (!s) return;
      el.setAttribute("data-state", s.open ? "open" : "closed");
      var prefix = el.closest(".hero") ? C.farmacias[key].nombre + ": " : "";
      el.querySelector(".status__text").textContent = prefix + s.long;
    });
    document.querySelectorAll("[data-status-short]").forEach(function (el) {
      var s = statusOf(el.getAttribute("data-status-short"));
      if (!s) return;
      el.setAttribute("data-state", s.open ? "open" : "closed");
      el.textContent = s.short;
    });
  }
  try { paintStatus(); setInterval(paintStatus, 60000); } catch (e) { /* static hours remain visible */ }

  /* ---------- Pharmacy tabs: the tile turns ---------- */
  var tabsRoot = document.querySelector("[data-tabs]");
  if (tabsRoot) {
    var tabs = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    var select = function (i, opts) {
      opts = opts || {};
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        panels[k].classList.remove("is-entering");
      });
      if (opts.animate) {
        void panels[i].offsetWidth;
        panels[i].classList.add("is-entering");
      }
      if (opts.focus) tabs[i].focus();
    };

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        if (t.getAttribute("aria-selected") === "true") return;
        select(i, { animate: true });
      });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, { focus: true }); } /* keyboard: instant */
      });
    });
    panels.forEach(function (p) { p.addEventListener("animationend", function () { p.classList.remove("is-entering"); }); });

    var fromHash = tabs.findIndex(function (t) { return t.getAttribute("href") === location.hash; });
    select(fromHash > -1 ? fromHash : 0);
  }

  /* ---------- Header lifts on scroll ---------- */
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveals (once) ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Hero plaque: held tile that follows the pointer (spring-ish lerp) ---------- */
  var tile = document.querySelector("[data-tilt]");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (tile) {
    var landed = function () { tile.classList.add("is-tilting"); };
    tile.addEventListener("animationend", function (e) { if (e.target === tile) landed(); });
    if (reduceMotion) landed();
  }
  if (tile && finePointer && !reduceMotion) {
    var field = tile.querySelector(".plaque__field");
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, raf = null;
    var zone = tile.closest(".hero") || tile;
    var step = function () {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      tile.style.transform = "perspective(900px) rotateX(" + (-cur.y * 7).toFixed(2) + "deg) rotateY(" + (cur.x * 9).toFixed(2) + "deg)";
      field.style.setProperty("--sheen-x", (50 - cur.x * 50).toFixed(1) + "%");
      field.style.setProperty("--sheen-y", (50 - cur.y * 50).toFixed(1) + "%");
      if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) raf = requestAnimationFrame(step);
      else raf = null;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(step); };
    zone.addEventListener("pointermove", function (e) {
      if (!tile.classList.contains("is-tilting")) return;
      var r = tile.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
      kick();
    });
    zone.addEventListener("pointerleave", function () { target.x = 0; target.y = 0; kick(); });
  }
})();

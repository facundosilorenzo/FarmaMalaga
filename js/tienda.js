(function () {
  "use strict";
  var P = window.FARMA_PRODUCTOS || [];
  var C = window.FARMA_CONFIG || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var grid = $("[data-grid]");
  if (!grid) return;

  var euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  var byId = {};
  P.forEach(function (p, i) { p.order = i; byId[p.id] = p; });
  var imgUrl = function (p, size) { return "https://farmamalaga.com/" + p.img + "-" + (size || "home_default") + "/" + p.slug + ".jpg"; };
  var norm = function (s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- State ---------- */
  var params = new URLSearchParams(location.search);
  var state = { cat: params.get("cat") || "todo", q: params.get("q") || "", sort: "rec" };
  if (!$('[data-cat="' + state.cat + '"]')) state.cat = "todo";

  /* ---------- Render ---------- */
  function badges(p) {
    var b = [];
    if (p.agotado) b.push('<span class="badge badge--out">Agotado</span>');
    if (p.cats.indexOf("linea") > -1) b.push('<span class="badge badge--ochre">Línea propia</span>');
    if (p.promo === "martiderm") b.push('<span class="badge">−10 % del 1 al 6</span>');
    return b.join("");
  }

  function card(p, i) {
    var mono = esc(p.marca.charAt(0));
    var buy = p.agotado
      ? '<button class="btn btn--small btn--line btn--notify add-btn" type="button" data-notify="' + p.id + '"><span class="add-btn__label"><svg aria-hidden="true"><use href="#i-bell"/></svg>Avísame</span><span class="add-btn__done" aria-hidden="true"><svg><use href="#i-check"/></svg>Te avisamos</span></button>'
      : '<button class="btn btn--small btn--cobalt add-btn" type="button" data-add="' + p.id + '" aria-label="Añadir al carrito: ' + esc(p.nombre) + '"><span class="add-btn__label"><svg aria-hidden="true"><use href="#i-plus"/></svg>Añadir</span><span class="add-btn__done" aria-hidden="true"><svg><use href="#i-check"/></svg>Añadido</span></button>';
    return '<li class="product" style="--i:' + i + ';view-transition-name:p' + p.id + '">' +
      '<button class="product__open" type="button" data-open="' + p.id + '" tabindex="-1" aria-hidden="true">' +
        '<div class="product__tile"><div class="badges">' + badges(p) + '</div>' +
        '<img src="' + imgUrl(p) + '" alt="" loading="lazy" decoding="async" width="250" height="250">' +
        '<span class="product__mono">' + mono + '</span></div></button>' +
      '<div><p class="product__brand">' + esc(p.marca) + '</p>' +
        '<h3 class="product__name"><button type="button" data-open="' + p.id + '">' + esc(p.nombre) + '</button></h3>' +
        '<p class="product__fmt">' + esc(p.formato) + '</p></div>' +
      '<div class="product__buy"><span class="price">' + euro.format(p.precio) + '</span>' + buy + '</div>' +
    '</li>';
  }

  function visible() {
    var q = norm(state.q).trim();
    var list = P.filter(function (p) {
      if (state.cat !== "todo" && p.cats.indexOf(state.cat) < 0) return false;
      if (!q) return true;
      var hay = norm(p.nombre + " " + p.marca + " " + p.formato + " " + p.cats.join(" ") + (p.cats.indexOf("linea") > -1 ? " farmamalaga" : ""));
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    });
    var s = state.sort;
    list.sort(function (a, b) {
      if (a.agotado !== b.agotado) return a.agotado ? 1 : -1;
      if (s === "asc") return a.precio - b.precio;
      if (s === "desc") return b.precio - a.precio;
      if (s === "az") return a.nombre.localeCompare(b.nombre, "es");
      return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a.order - b.order;
    });
    return list;
  }

  function wireImages(root) {
    $$("img", root).forEach(function (img) {
      var fail = function () { var t = img.closest(".product__tile, .line__img"); if (t) t.classList.add("no-img"); };
      if (img.complete && img.naturalWidth === 0 && img.src) fail();
      img.addEventListener("error", fail, { once: true });
    });
  }

  function paint(animate) {
    var list = visible();
    var draw = function () {
      grid.innerHTML = list.map(card).join("");
      wireImages(grid);
      $("[data-count]").textContent = list.length === 1 ? "1 producto" : list.length + " productos";
      var empty = $("[data-empty]");
      empty.hidden = list.length > 0;
      $("[data-empty-q]").textContent = state.q;
    };
    if (animate === "reorder" && document.startViewTransition && !reduce.matches) {
      document.startViewTransition(draw);
    } else {
      draw();
      if (animate && !reduce.matches) {
        grid.classList.remove("is-entering");
        void grid.offsetWidth;
        grid.classList.add("is-entering");
      }
    }
    var u = new URL(location.href);
    state.cat === "todo" ? u.searchParams.delete("cat") : u.searchParams.set("cat", state.cat);
    state.q ? u.searchParams.set("q", state.q) : u.searchParams.delete("q");
    history.replaceState(null, "", u);
  }
  grid.addEventListener("animationend", function (e) { if (e.target.parentNode === grid && e.target === grid.lastElementChild) grid.classList.remove("is-entering"); });

  /* ---------- Chips with a sliding ink ---------- */
  var chips = $$(".chip");
  var ink = $(".chips__ink");
  function moveInk(instant) {
    var on = $('.chip[aria-checked="true"]');
    if (!on || !ink) return;
    if (instant) ink.style.transition = "none";
    ink.style.width = on.offsetWidth + "px";
    ink.style.transform = "translateX(" + on.offsetLeft + "px)";
    if (instant) { void ink.offsetWidth; ink.style.transition = ""; }
  }
  function setCat(cat, opts) {
    state.cat = cat;
    chips.forEach(function (c) { c.setAttribute("aria-checked", String(c.dataset.cat === cat)); });
    moveInk(opts && opts.instant);
    var on = $('.chip[aria-checked="true"]');
    if (on && on.scrollIntoView && !(opts && opts.instant)) on.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce.matches ? "auto" : "smooth" });
  }
  chips.forEach(function (c, i) {
    c.addEventListener("click", function () {
      if (c.getAttribute("aria-checked") === "true") return;
      setCat(c.dataset.cat);
      paint(true);
    });
    c.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
      if (n === null) return;
      e.preventDefault();
      var t = chips[(n + chips.length) % chips.length];
      t.focus(); setCat(t.dataset.cat); paint(false); /* keyboard: instant */
    });
  });
  window.addEventListener("resize", function () { moveInk(true); });

  /* ---------- Search & sort ---------- */
  var input = $("#q");
  input.value = state.q;
  var t;
  input.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = input.value; paint(false); }, 120);
  });
  $("[data-search]").addEventListener("submit", function (e) {
    e.preventDefault(); state.q = input.value; paint(true);
    $("#catalogo").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
  });
  $("[data-sort]").addEventListener("change", function (e) { state.sort = e.target.value; paint("reorder"); });
  $("[data-clear]").addEventListener("click", function () { state.q = ""; input.value = ""; setCat("todo"); paint(true); });
  $$("[data-filter-jump]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.filterJump;
      if (v === "martiderm") { state.q = "MartiDerm"; input.value = "MartiDerm"; setCat("todo"); }
      else { state.q = ""; input.value = ""; setCat(v); }
      closeDialog(drawer);
      paint(true);
      $("#catalogo").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
    });
  });

  /* ---------- Cart ---------- */
  var KEY = "farmamalaga-carrito";
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (id) { if (!byId[id] || byId[id].agotado) delete cart[id]; });
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ } };
  var units = function () { return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0); };
  var total = function () { return Object.keys(cart).reduce(function (n, id) { return n + cart[id] * byId[id].precio; }, 0); };

  var countEl = $("[data-cart-count]");
  var cartBtn = $("[data-cart-open]");
  function paintCount(bump) {
    var n = units();
    countEl.textContent = n;
    n ? countEl.removeAttribute("data-zero") : countEl.setAttribute("data-zero", "");
    cartBtn.setAttribute("aria-label", "Abrir el carrito, " + n + (n === 1 ? " producto" : " productos"));
    if (bump && !reduce.matches) {
      countEl.classList.remove("is-bump"); cartBtn.classList.remove("is-catch");
      void countEl.offsetWidth;
      countEl.classList.add("is-bump"); cartBtn.classList.add("is-catch");
    }
  }
  countEl.addEventListener("animationend", function () { countEl.classList.remove("is-bump"); });
  cartBtn.addEventListener("animationend", function () { cartBtn.classList.remove("is-catch"); });

  var lines = $("[data-lines]");
  function lineHtml(id) {
    var p = byId[id];
    return '<li class="line" data-line="' + id + '"><div><div class="line__row">' +
      '<div class="line__img"><img src="' + imgUrl(p) + '" alt="" loading="lazy"><span>' + esc(p.marca.charAt(0)) + '</span></div>' +
      '<div><p class="line__name">' + esc(p.nombre) + '</p><p class="line__meta">' + esc(p.marca) + ' · ' + esc(p.formato) + '</p>' +
      '<button class="line__remove" type="button" data-remove="' + id + '">Quitar</button></div>' +
      '<div class="line__side"><span class="line__price" data-line-price>' + euro.format(p.precio * cart[id]) + '</span>' +
      '<div class="stepper" aria-label="Cantidad de ' + esc(p.nombre) + '"><button type="button" data-line-step="-1" aria-label="Quitar uno"><svg aria-hidden="true"><use href="#i-minus"/></svg></button>' +
      '<output>' + cart[id] + '</output><button type="button" data-line-step="1" aria-label="Añadir uno"><svg aria-hidden="true"><use href="#i-plus"/></svg></button></div></div>' +
      '</div></div></li>';
  }
  function paintDrawer(newId) {
    var ids = Object.keys(cart);
    var existing = $$("[data-line]", lines).map(function (l) { return l.dataset.line; });
    ids.forEach(function (id) {
      var el = $('[data-line="' + id + '"]', lines);
      if (!el) {
        lines.insertAdjacentHTML("beforeend", lineHtml(id));
        el = lines.lastElementChild;
        wireImages(el);
        if (id === newId && !reduce.matches) el.classList.add("is-new");
      } else {
        $("output", el).textContent = cart[id];
        $("[data-line-price]", el).textContent = euro.format(byId[id].precio * cart[id]);
      }
    });
    existing.forEach(function (id) { if (!cart[id]) removeLine(id); });
    var empty = !ids.length;
    $("[data-drawer-empty]").hidden = !empty;
    $("[data-drawer-foot]").hidden = empty;
    var tot = $("[data-total]");
    var txt = euro.format(total());
    if (tot.textContent !== txt) {
      tot.textContent = txt;
      if (!reduce.matches) { tot.classList.remove("is-tick"); void tot.offsetWidth; tot.classList.add("is-tick"); }
    }
  }
  function removeLine(id) {
    var el = $('[data-line="' + id + '"]', lines);
    if (!el || el.classList.contains("is-leaving")) return;
    if (reduce.matches) { el.remove(); return; }
    el.classList.add("is-leaving");
    el.addEventListener("transitionend", function h(e) { if (e.propertyName.indexOf("grid-template-rows") > -1) { el.removeEventListener("transitionend", h); el.remove(); } });
    setTimeout(function () { if (el.isConnected) el.remove(); }, 400);
  }
  lines.addEventListener("click", function (e) {
    var line = e.target.closest("[data-line]"); if (!line) return;
    var id = line.dataset.line;
    var step = e.target.closest("[data-line-step]");
    if (step) { cart[id] = Math.max(0, cart[id] + +step.dataset.lineStep); }
    if (e.target.closest("[data-remove]")) cart[id] = 0;
    if (!cart[id]) delete cart[id];
    save(); paintCount(false); paintDrawer();
  });

  function flyToCart(fromEl, p) {
    if (reduce.matches || !fromEl || !fromEl.animate) return Promise.resolve();
    var a = fromEl.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
    if (!a.width) return Promise.resolve();
    var size = Math.min(a.width, 160);
    var img = document.createElement("img");
    img.className = "flyer"; img.alt = ""; img.src = imgUrl(p);
    img.onerror = function () { img.removeAttribute("src"); };
    var x0 = a.left + a.width / 2 - size / 2, y0 = a.top + a.height / 2 - size / 2;
    var x1 = b.left + b.width / 2 - size / 2, y1 = b.top + b.height / 2 - size / 2;
    Object.assign(img.style, { width: size + "px", height: size + "px", left: x0 + "px", top: y0 + "px" });
    document.body.appendChild(img);
    var dx = x1 - x0, dy = y1 - y0;
    var anim = img.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: "translate(" + dx * 0.55 + "px," + (dy * 0.2 - 60) + "px) scale(0.6)", opacity: 1, offset: 0.45 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(0.12)", opacity: 0.6 }
    ], { duration: 620, easing: "cubic-bezier(0.32, 0.72, 0, 1)" });
    return anim.finished.then(function () { img.remove(); }, function () { img.remove(); });
  }

  function add(id, qty, fromEl, btn) {
    var p = byId[id]; if (!p || p.agotado) return;
    cart[id] = (cart[id] || 0) + qty;
    save();
    if (btn) {
      btn.classList.add("is-done");
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.classList.remove("is-done"); }, 1400);
    }
    flyToCart(fromEl, p).then(function () { paintCount(true); });
    paintDrawer(id);
    toast(p.nombre);
  }

  /* ---------- Toasts (one at a time, newest wins) ---------- */
  var toaster = $("[data-toaster]");
  function toast(name) {
    $$(".toast", toaster).forEach(function (t) { t.remove(); });
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg><span>Añadido: ' + esc(name) + '</span><button type="button">Ver carrito</button>';
    toaster.appendChild(el);
    $("button", el).addEventListener("click", function () { openDrawer(); });
    var timer = setTimeout(close, 3200);
    el.addEventListener("pointerenter", function () { clearTimeout(timer); });
    el.addEventListener("pointerleave", function () { timer = setTimeout(close, 1600); });
    function close() {
      if (!el.isConnected) return;
      if (reduce.matches) { el.remove(); return; }
      el.classList.add("is-leaving");
      el.addEventListener("animationend", function () { el.remove(); }, { once: true });
    }
  }

  /* ---------- Dialogs ---------- */
  var quick = $("[data-quick]"), drawer = $("[data-drawer]");
  function openDialog(d) { if (!d.open) { d.classList.remove("is-closing"); d.showModal(); } }
  function closeDialog(d) {
    if (!d || !d.open || d.classList.contains("is-closing")) return;
    if (reduce.matches) { d.close(); return; }
    d.classList.add("is-closing");
    d.addEventListener("animationend", function h() { d.removeEventListener("animationend", h); d.classList.remove("is-closing"); d.close(); });
  }
  [quick, drawer].forEach(function (d) {
    d.addEventListener("cancel", function (e) { e.preventDefault(); closeDialog(d); });
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) closeDialog(d); });
  });
  function openDrawer() { closeDialog(quick); paintDrawer(); $("[data-proto]").hidden = true; openDialog(drawer); }
  cartBtn.addEventListener("click", openDrawer);
  $("[data-checkout]").addEventListener("click", function () { $("[data-proto]").hidden = false; });

  var qty = 1, current = null;
  function openQuick(id, fromEl) {
    var p = byId[id]; current = p; qty = 1;
    var img = $("[data-quick-img]");
    var media = img.parentNode;
    media.classList.remove("no-img");
    $("[data-quick-mono]").textContent = p.marca.charAt(0);
    img.onerror = function () {
      if (img.src.indexOf("large_default") > -1) img.src = imgUrl(p);
      else { media.classList.add("no-img"); img.onerror = null; }
    };
    img.src = imgUrl(p, "large_default");
    $("[data-quick-brand]").textContent = p.marca;
    $("[data-quick-name]").textContent = p.nombre;
    $("[data-quick-fmt]").textContent = p.formato;
    $("[data-quick-badges]").innerHTML = badges(p);
    $("[data-quick-price]").textContent = euro.format(p.precio);
    $("[data-qty]").textContent = qty;
    $("[data-quick-url]").href = p.url;
    var addBtn = $("[data-quick-add]");
    addBtn.disabled = !!p.agotado;
    $(".add-btn__label", addBtn).textContent = p.agotado ? "Agotado" : "Añadir al carrito";
    addBtn.classList.remove("is-done");
    if (fromEl) {
      var r = fromEl.getBoundingClientRect();
      quick.style.setProperty("--ox", (r.left + r.width / 2) / innerWidth * 100 + "%");
      quick.style.setProperty("--oy", (r.top + r.height / 2) / innerHeight * 100 + "%");
    }
    openDialog(quick);
  }
  $$("[data-step]", quick).forEach(function (b) {
    b.addEventListener("click", function () { qty = Math.max(1, Math.min(9, qty + +b.dataset.step)); $("[data-qty]").textContent = qty; });
  });
  $("[data-quick-add]").addEventListener("click", function (e) {
    if (!current) return;
    add(current.id, qty, $("[data-quick-img]"), e.currentTarget);
  });

  grid.addEventListener("click", function (e) {
    var open = e.target.closest("[data-open]");
    if (open) { openQuick(open.dataset.open, open.closest(".product").querySelector(".product__tile")); return; }
    var addB = e.target.closest("[data-add]");
    if (addB) { add(addB.dataset.add, 1, addB.closest(".product").querySelector(".product__tile img"), addB); return; }
    var n = e.target.closest("[data-notify]");
    if (n) {
      n.classList.add("is-done");
      var a = document.createElement("a");
      a.href = "https://wa.me/" + (C.whatsapp || "34630282123") + "?text=" + encodeURIComponent("Hola, avisadme cuando vuelva a haber: " + byId[n.dataset.notify].nombre);
      a.rel = "noopener"; a.target = "_blank";
      setTimeout(function () { a.click(); }, 450);
    }
  });

  /* ---------- Boot ---------- */
  setCat(state.cat, { instant: true });
  paint(false);
  paintCount(false);
  paintDrawer();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(true); });
})();

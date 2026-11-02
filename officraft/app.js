/* Officraft site — interactions
 * Cart, search, mobile menu, toast. No frameworks. localStorage
 * persists the cart between page loads.
 */

(function () {
  "use strict";

  // ---------- Data: catalog index for search ----------
  // Mirror of CATALOG.md, kept inline so the search works on a
  // static file with no backend. The PDP links to product.html
  // with a ?sku= param.
  var CATALOG = [
    { sku: "OF-WRT-001", name: "Roller Pen, 0.5mm", cat: "Writing & Desk Tools", price: 8.40, co2e: 0.18 },
    { sku: "OF-WRT-002", name: "Gel Pen, 0.7mm", cat: "Writing & Desk Tools", price: 4.20, co2e: 0.12 },
    { sku: "OF-WRT-003", name: "Mechanical Pencil, 0.5mm", cat: "Writing & Desk Tools", price: 11.80, co2e: 0.42 },
    { sku: "OF-WRT-004", name: "Whiteboard Marker, Bullet Tip", cat: "Writing & Desk Tools", price: 3.10, co2e: 0.08 },
    { sku: "OF-DSK-001", name: "Desk Pad, Recycled Leather", cat: "Writing & Desk Tools", price: 58.00, co2e: 2.1 },
    { sku: "OF-DSK-002", name: "Cable Tray, Steel", cat: "Writing & Desk Tools", price: 38.00, co2e: 1.4 },
    { sku: "OF-DSK-003", name: "Monitor Arm, Single", cat: "Writing & Desk Tools", price: 119.00, co2e: 4.8 },
    { sku: "OF-PPR-001", name: "A4 Copier Paper, 80 g/m²", cat: "Paper, Filing & Print", price: 28.50, co2e: 0.85 },
    { sku: "OF-PPR-002", name: "Recycled A4 Paper, 80 g/m²", cat: "Paper, Filing & Print", price: 31.20, co2e: 0.62 },
    { sku: "OF-PRT-001", name: "Toner, Black, HP-CF281A Compat.", cat: "Paper, Filing & Print", price: 64.00, co2e: 1.8 },
    { sku: "OF-PRT-002", name: "Toner, Black, Xerox-106R02773", cat: "Paper, Filing & Print", price: 89.00, co2e: 2.4 },
    { sku: "OF-CHR-001", name: "Task Chair, Mesh Back", cat: "Ergonomic Seating & Desks", price: 389.00, co2e: 18.4, featured: true },
    { sku: "OF-CHR-002", name: "Executive Chair, Leather", cat: "Ergonomic Seating & Desks", price: 689.00, co2e: 28.6 },
    { sku: "OF-CHR-003", name: "Drafting Stool, Lab Grade", cat: "Ergonomic Seating & Desks", price: 269.00, co2e: 13.8 },
    { sku: "OF-DSK-101", name: "Sit-Stand Desk, Electric", cat: "Ergonomic Seating & Desks", price: 489.00, co2e: 26.4 },
    { sku: "OF-DSK-102", name: "Acoustic Divider, Desktop", cat: "Ergonomic Seating & Desks", price: 159.00, co2e: 4.2 },
    { sku: "OF-CMP-001", name: "Workstation Tower, M3 Pro", cat: "Workstation Hardware", price: 2890.00, co2e: 142.0 },
    { sku: "OF-CMP-002", name: "Workstation Tower, M5 Ultra", cat: "Workstation Hardware", price: 8490.00, co2e: 248.0 },
    { sku: "OF-DSP-001", name: "Monitor 27\" 4K, ProColor", cat: "Workstation Hardware", price: 489.00, co2e: 18.6 },
    { sku: "OF-DSP-002", name: "Monitor 32\" 5K, Studio", cat: "Workstation Hardware", price: 879.00, co2e: 26.4 },
    { sku: "OF-AVC-001", name: "Conference Bar, 4K", cat: "Meeting & Conference", price: 1290.00, co2e: 11.8 },
    { sku: "OF-AVC-002", name: "Room Controller, 10\" Touch", cat: "Meeting & Conference", price: 689.00, co2e: 5.2 },
    { sku: "OF-AVC-003", name: "Room Display, 10\" E-Ink", cat: "Meeting & Conference", price: 349.00, co2e: 1.4 },
    { sku: "OF-NET-001", name: "Switch, 48-Port PoE+", cat: "Network & Server", price: 1890.00, co2e: 32.8 },
    { sku: "OF-NET-002", name: "Switch, 24-Port PoE+", cat: "Network & Server", price: 889.00, co2e: 18.2 },
    { sku: "OF-SRV-001", name: "Server, 1U Standard", cat: "Network & Server", price: 2290.00, co2e: 64.8 },
    { sku: "OF-SRV-002", name: "Server, 2U Performance", cat: "Network & Server", price: 6890.00, co2e: 132.6 },
    { sku: "OF-NET-101", name: "Cat6A Patch Cable, 2m", cat: "Network & Server", price: 4.80, co2e: 0.32 },
    { sku: "OF-NET-102", name: "Cable Manager, 1U", cat: "Network & Server", price: 24.00, co2e: 0.6 },
    { sku: "OF-AI-001", name: "LLM Inference, Tier S (per 1M tok)", cat: "AI & ML Software", price: 4.20, co2e: 0.18 },
    { sku: "OF-AI-002", name: "LLM Inference, Tier M (per 1M tok)", cat: "AI & ML Software", price: 1.40, co2e: 0.06 },
    { sku: "OF-AI-003", name: "LLM Inference, Tier E Embedding (per 1M tok)", cat: "AI & ML Software", price: 0.05, co2e: 0.01 },
    { sku: "OF-AI-101", name: "Fine-Tuning, Supervised (per run)", cat: "AI & ML Software", price: 4200.00, co2e: 45.0 },
    { sku: "OF-AI-102", name: "Fine-Tuning, Preference RLHF/DPO (per run)", cat: "AI & ML Software", price: 8900.00, co2e: 95.0 },
    { sku: "OF-AI-103", name: "RAG Platform, Managed (per seat/mo)", cat: "AI & ML Software", price: 89.00, co2e: 3.8 },
    { sku: "OF-AI-201", name: "Document AI, OCR + Extraction (per 1k pages)", cat: "AI & ML Software", price: 4.20, co2e: 0.18 },
    { sku: "OF-AI-301", name: "Speech-to-Text, Streaming (per hour)", cat: "AI & ML Software", price: 0.42, co2e: 0.02 },
    { sku: "OF-AI-302", name: "Text-to-Speech, Neural (per 1M chars)", cat: "AI & ML Software", price: 14.20, co2e: 0.6 },
    { sku: "OF-AI-401", name: "Vision AI, Classification + Detection (per 1k images)", cat: "AI & ML Software", price: 3.20, co2e: 0.14 },
    { sku: "OF-AI-501", name: "MLOps, Model Monitor (per model/mo)", cat: "AI & ML Software", price: 49.00, co2e: 2.1 }
  ];

  // Expose to other scripts on the page (search, catalog rendering)
  window.Officraft = window.Officraft || {};
  window.Officraft.catalog = CATALOG;

  // ---------- Cart (localStorage) ----------
  var CART_KEY = "officraft_cart_v1";

  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function writeCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    updateCartBadge();
  }
  function addToCart(sku, qty) {
    qty = qty || 1;
    var cart = readCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].sku === sku) { cart[i].qty += qty; found = true; break; }
    }
    if (!found) cart.push({ sku: sku, qty: qty });
    writeCart(cart);
    return cart;
  }
  function setCartQty(sku, qty) {
    var cart = readCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].sku === sku) { cart[i].qty = Math.max(0, qty); break; }
    }
    cart = cart.filter(function (line) { return line.qty > 0; });
    writeCart(cart);
    return cart;
  }
  function removeFromCart(sku) {
    var cart = readCart().filter(function (line) { return line.sku !== sku; });
    writeCart(cart);
    return cart;
  }
  function getCartItem(sku) {
    return CATALOG.find(function (p) { return p.sku === sku; });
  }
  function formatPrice(n) {
    return n.toFixed(2).replace(".", ",") + " EUR";
  }
  function formatCo2e(n) {
    return n.toFixed(2).replace(".", ",");
  }

  function updateCartBadge() {
    var cart = readCart();
    var total = cart.reduce(function (s, l) { return s + l.qty; }, 0);
    var badge = document.querySelector("[data-cart-count]");
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? "inline-flex" : "none";
    }
  }

  // ---------- Toast ----------
  function toast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<svg class="toast__icon" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 144l48 48L224 56"/></svg>' +
      '<span>' + message + '</span>';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 3500);
  }

  // ---------- Render cart drawer ----------
  function renderCartDrawer() {
    var drawer = document.querySelector("[data-cart-drawer]");
    if (!drawer) return;
    var body = drawer.querySelector("[data-cart-body]");
    var cart = readCart();
    if (cart.length === 0) {
      body.innerHTML = '<div class="cart-drawer__empty">No items in your quote list yet.<br/>Add a SKU from any product page.</div>';
      var foot = drawer.querySelector("[data-cart-foot]");
      if (foot) foot.style.display = "none";
      return;
    }
    var lines = "";
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
      var line = cart[i];
      var item = getCartItem(line.sku);
      if (!item) continue;
      var lineTotal = item.price * line.qty;
      subtotal += lineTotal;
      lines +=
        '<div class="cart-line" data-sku="' + line.sku + '">' +
          '<div>' +
            '<div class="cart-line__sku">' + line.sku + '</div>' +
            '<div class="cart-line__name">' + item.name + '</div>' +
            '<div class="cart-line__qty">' +
              '<button data-cart-dec aria-label="Decrease quantity">−</button>' +
              '<span data-cart-qty>' + line.qty + '</span>' +
              '<button data-cart-inc aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button class="cart-line__remove" data-cart-remove>Remove</button>' +
          '</div>' +
          '<div class="cart-line__price">' + formatPrice(lineTotal) + '</div>' +
        '</div>';
    }
    body.innerHTML = lines;
    var foot = drawer.querySelector("[data-cart-foot]");
    if (foot) {
      foot.style.display = "block";
      foot.querySelector("[data-cart-subtotal]").textContent = formatPrice(subtotal);
    }
  }

  function openCart() {
    var drawer = document.querySelector("[data-cart-drawer]");
    if (!drawer) return;
    renderCartDrawer();
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    var drawer = document.querySelector("[data-cart-drawer]");
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ---------- Mobile menu ----------
  function toggleMobileMenu() {
    var menu = document.querySelector("[data-mobile-menu]");
    var btn = document.querySelector("[data-menu-btn]");
    if (!menu) return;
    var open = menu.getAttribute("aria-hidden") === "true";
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  // ---------- Search ----------
  function renderSearchResults(query) {
    var wrap = document.querySelector("[data-search-results]");
    if (!wrap) return;
    var q = (query || "").trim().toLowerCase();
    if (q.length < 2) { wrap.setAttribute("data-open", "false"); wrap.innerHTML = ""; return; }
    var matches = CATALOG.filter(function (p) {
      return p.sku.toLowerCase().indexOf(q) !== -1
          || p.name.toLowerCase().indexOf(q) !== -1
          || p.cat.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    if (matches.length === 0) {
      wrap.innerHTML = '<div class="search-result"><div></div><div><div class="search-result__name">No matches</div><div class="search-result__cat">Try a SKU like OF-CHR-001</div></div><div></div></div>';
    } else {
      var html = "";
      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        html +=
          '<a class="search-result" href="product.html?sku=' + encodeURIComponent(m.sku) + '">' +
            '<svg width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--paper-muted)"><rect x="32" y="48" width="192" height="160" rx="8"/><path d="M32 96h192"/></svg>' +
            '<div>' +
              '<div class="search-result__name">' + m.name + '</div>' +
              '<div class="search-result__cat">' + m.cat + '</div>' +
            '</div>' +
            '<div>' +
              '<div class="search-result__sku">' + m.sku + '</div>' +
              '<div class="search-result__price">from ' + formatPrice(m.price) + '</div>' +
            '</div>' +
          '</a>';
      }
      wrap.innerHTML = html;
    }
    wrap.setAttribute("data-open", "true");
  }

  // ---------- Wire up ----------
  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();

    // Add to cart buttons
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add-to-cart]");
      if (add) {
        var sku = add.getAttribute("data-add-to-cart");
        addToCart(sku, 1);
        var item = getCartItem(sku);
        toast("Added to quote: " + (item ? item.name : sku));
        return;
      }
      var openBtn = e.target.closest("[data-open-cart]");
      if (openBtn) { openCart(); return; }
      var closeBtn = e.target.closest("[data-close-cart]");
      if (closeBtn) { closeCart(); return; }
      var menuBtn = e.target.closest("[data-menu-btn]");
      if (menuBtn) { toggleMobileMenu(); return; }
      var inc = e.target.closest("[data-cart-inc]");
      if (inc) {
        var line = inc.closest("[data-sku]");
        if (line) {
          var skuI = line.getAttribute("data-sku");
          var cart = readCart();
          for (var i = 0; i < cart.length; i++) {
            if (cart[i].sku === skuI) { setCartQty(skuI, cart[i].qty + 1); break; }
          }
          renderCartDrawer();
        }
        return;
      }
      var dec = e.target.closest("[data-cart-dec]");
      if (dec) {
        var lineD = dec.closest("[data-sku]");
        if (lineD) {
          var skuD = lineD.getAttribute("data-sku");
          var cartD = readCart();
          for (var j = 0; j < cartD.length; j++) {
            if (cartD[j].sku === skuD) { setCartQty(skuD, cartD[j].qty - 1); break; }
          }
          renderCartDrawer();
        }
        return;
      }
      var rem = e.target.closest("[data-cart-remove]");
      if (rem) {
        var lineR = rem.closest("[data-sku]");
        if (lineR) {
          removeFromCart(lineR.getAttribute("data-sku"));
          renderCartDrawer();
        }
        return;
      }
      // Close drawer on backdrop click
      var drawer = e.target.closest("[data-cart-drawer]");
      if (!drawer && e.target.closest("[data-cart-backdrop]")) {
        closeCart();
      }
    });

    // Search input
    var search = document.querySelector("[data-search-input]");
    if (search) {
      search.addEventListener("input", function (e) { renderSearchResults(e.target.value); });
      search.addEventListener("focus", function (e) { if (e.target.value.length >= 2) renderSearchResults(e.target.value); });
      document.addEventListener("click", function (e) {
        if (!e.target.closest("[data-search-wrap]")) {
          var wrap = document.querySelector("[data-search-results]");
          if (wrap) wrap.setAttribute("data-open", "false");
        }
      });
      search.form && search.form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = search.value.trim().toUpperCase();
        var exact = CATALOG.find(function (p) { return p.sku === q; });
        if (exact) {
          window.location.href = "product.html?sku=" + encodeURIComponent(exact.sku);
        } else {
          window.location.href = "catalog.html?q=" + encodeURIComponent(search.value);
        }
      });
    }

    // Keyboard: ESC closes drawer + menu
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeCart();
        var menu = document.querySelector("[data-mobile-menu]");
        if (menu) menu.setAttribute("aria-hidden", "true");
      }
    });

    // PDP "add to quote" needs an explicit qty input
    var qtyInput = document.querySelector("[data-qty-input]");
    if (qtyInput) {
      var addBtn = document.querySelector("[data-pdp-add]");
      if (addBtn) {
        addBtn.addEventListener("click", function () {
          var q = parseInt(qtyInput.value, 10) || 1;
          var sku = addBtn.getAttribute("data-pdp-add");
          addToCart(sku, q);
          var item = getCartItem(sku);
          toast("Added " + q + " × " + (item ? item.name : sku) + " to quote");
        });
      }
    }
  });

  // Public API for other scripts
  window.Officraft.addToCart = addToCart;
  window.Officraft.openCart = openCart;
  window.Officraft.toast = toast;
  window.Officraft.formatPrice = formatPrice;
  window.Officraft.formatCo2e = formatCo2e;
})();

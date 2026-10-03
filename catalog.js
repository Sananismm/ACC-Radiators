(function () {
  "use strict";
  var catalog = window.ACCCatalog, initial = catalog.read(location.search);
  var state = initial.state, errors = initial.errors;
  var grid = document.getElementById("grid"), model = document.getElementById("model"), search = document.getElementById("q");
  var images = { "Plastic-Aluminum": "plastic-aluminium", "All-Aluminum": "all-aluminium", "Copper-Brass": "copper-brass" };
  function element(tag, className, text) {
    var node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node;
  }
  function copyDetails(button, field) {
    button.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(field.value);
        button.textContent = "Copied";
      } catch (_) {
        field.focus(); field.select(); button.textContent = "Select and copy the text below";
      }
    });
  }
  catalog.products.forEach(function (product) {
    var card = element("article", "card product"); card.dataset.part = product.part;
    var media = element("div", "media"), img = document.createElement("img");
    img.src = "assets/optimized/" + images[product.material] + ".webp";
    img.alt = "Representative " + product.material + " radiator; actual product may differ";
    img.width = 640; img.height = 427; img.loading = "lazy";
    var fallback = element("span", "image-fallback", "Representative image unavailable"); fallback.hidden = true;
    img.addEventListener("error", function () { img.hidden = true; fallback.hidden = false; });
    media.append(img, fallback); card.append(media, element("p", "product__caption", "Representative material photograph"), element("span", "badge", product.make), element("h2", "card__title", product.name));
    var list = element("ul", "product__meta");
    [["Core", product.core], ["Transmission", product.transmission], ["Part", product.part + " | " + product.thickness + "mm Core"]].forEach(function (row) {
      var item = element("li"); item.append(element("strong", "", row[0] + ": "), document.createTextNode(row[1])); list.append(item);
    });
    card.append(list, element("p", "product__stock", "Please confirm availability and wholesale pricing."));
    var enquiry = catalog.enquiry(product), link = element("a", "btn", "Enquire by email"); link.href = enquiry.href;
    link.setAttribute("aria-label", "Enquire about " + product.name + ", part " + product.part); card.append(link);
    var details = element("details", "enquiry-details"); details.append(element("summary", "", "Copy enquiry details"));
    var label = element("label", "", "Email and enquiry text"), field = element("textarea", "enquiry-text");
    field.id = "enquiry-" + product.slug; label.htmlFor = field.id; field.readOnly = true; field.rows = 8;
    field.value = "To: " + catalog.email + "\nSubject: " + enquiry.subject + "\n\n" + enquiry.body;
    var copy = element("button", "chip", "Copy to clipboard"); copy.type = "button"; copy.setAttribute("aria-label", "Copy enquiry for " + product.part);
    copyDetails(copy, field); details.append(label, field, copy, element("p", "card__text", "Paste into your webmail. You can also select and copy the text manually."));
    card.append(details); grid.append(card);
  });
  catalog.materials.forEach(function (name) {
    var button = element("button", "chip", name === "All" ? "All materials" : name); button.type = "button";
    button.dataset.key = "mat"; button.dataset.v = name;
    button.addEventListener("click", function () { state.mat = name; update(); }); document.getElementById("mats").append(button);
  });
  document.querySelectorAll("#makes .logo").forEach(function (button) {
    button.addEventListener("click", function () { state.make = button.dataset.v; state.model = ""; update(); });
  });
  function fillModels() {
    model.replaceChildren(new Option("All models", ""));
    catalog.models(state.make).forEach(function (name) { model.add(new Option(name, name)); });
    if (state.model && !catalog.models(state.make).includes(state.model)) model.add(new Option(state.model + " (not listed)", state.model));
    model.value = state.model; search.value = state.q;
  }
  function render() {
    fillModels();
    var matches = catalog.filter(state, errors), parts = matches.map(function (p) { return p.part; });
    Array.from(grid.children).forEach(function (card) { card.hidden = !parts.includes(card.dataset.part); });
    document.querySelectorAll(".chip[data-key],.logo[data-key]").forEach(function (button) { button.setAttribute("aria-pressed", String(state[button.dataset.key] === button.dataset.v)); });
    document.getElementById("result-count").textContent = matches.length + (matches.length === 1 ? " radiator" : " radiators") + " shown";
    document.getElementById("filter-summary").textContent = "Manufacturer: " + (state.make === "All" ? "All manufacturers" : state.make) + " · Model: " + (state.model || "All models") + " · Material: " + (state.mat === "All" ? "All materials" : state.mat) + (state.q ? " · Search: " + state.q : "");
    var message = document.getElementById("filter-message"); message.hidden = !errors.length;
    message.textContent = errors.join(" ") + (errors.length ? " No products have been substituted. Reset the filters or enquire about your vehicle." : "");
    document.getElementById("empty").hidden = matches.length > 0;
    var enquiry = catalog.enquiry(null, [state.make === "All" ? "" : state.make, state.model].filter(Boolean).join(" "));
    document.getElementById("vehicle-enquiry").href = enquiry.href;
    var field = document.getElementById("vehicle-enquiry-text"); field.value = "To: " + catalog.email + "\nSubject: " + enquiry.subject + "\n\n" + enquiry.body;
  }
  function update() {
    errors = catalog.validate(state);
    var query = catalog.query(state), url = location.pathname + (query ? "?" + query : "") + location.hash;
    if (url !== location.pathname + location.search + location.hash) history.pushState(null, "", url);
    render();
  }
  function reset() { state = { make: "All", model: "", mat: "All", q: "" }; update(); }
  document.querySelectorAll("[data-reset]").forEach(function (button) { button.addEventListener("click", reset); });
  model.addEventListener("change", function () { state.model = model.value; update(); });
  // Commit text searches on submission; one meaningful history entry per search.
  document.getElementById("catalog-search").addEventListener("submit", function (event) { event.preventDefault(); state.q = search.value.trim(); update(); });
  search.addEventListener("input", function () { if (!search.value) { state.q = ""; update(); } });
  window.addEventListener("popstate", function () { var restored = catalog.read(location.search); state = restored.state; errors = restored.errors; render(); });
  copyDetails(document.getElementById("copy-vehicle-enquiry"), document.getElementById("vehicle-enquiry-text"));
  render();
})();

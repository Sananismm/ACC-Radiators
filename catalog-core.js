/* Pure catalog, URL and enquiry helpers shared by the site and built-in tests. */
(function (root) {
  "use strict";
  var data = typeof module === "object" && module.exports ? require("./catalog-data.js") : root.ACCCatalog;
  var products = data.products;
  var materials = ["All", "Plastic-Aluminum", "All-Aluminum", "Copper-Brass"];
  var email = "info@accradiators.pk";
  function makes() { return Array.from(new Set(products.map(function (p) { return p.make; }))); }
  function models(make) {
    return Array.from(new Set(products.filter(function (p) { return make === "All" || p.make === make; }).map(function (p) { return p.model; })));
  }
  function validate(state) {
    var errors = [];
    if (state.make !== "All" && !makes().includes(state.make)) errors.push("Manufacturer “" + state.make + "” is not listed in this catalog.");
    if (state.model && !models(state.make).includes(state.model)) errors.push("Model “" + state.model + "” is not listed for " + (state.make === "All" ? "the available manufacturers" : state.make) + ".");
    if (!materials.includes(state.mat)) errors.push("Material “" + state.mat + "” is not supported.");
    if (state.q.length > 200) errors.push("Please use a search of 200 characters or fewer.");
    return errors;
  }
  function read(search) {
    var params = new URLSearchParams(search);
    var state = { make: params.get("make") || "All", model: params.get("model") || "", mat: params.get("mat") || "All", q: params.get("q") || "" };
    var errors = validate(state);
    params.forEach(function (_, key) {
      if (!["make", "model", "mat", "q"].includes(key)) {
        if (!errors.includes("Unrecognized URL filter: " + key + ".")) errors.push("Unrecognized URL filter: " + key + ".");
      } else if (params.getAll(key).length > 1 && !errors.includes("Repeated URL filter: " + key + ".")) errors.push("Repeated URL filter: " + key + ".");
    });
    return { state: state, errors: errors };
  }
  function query(state) {
    var params = new URLSearchParams();
    if (state.make !== "All") params.set("make", state.make);
    if (state.model) params.set("model", state.model);
    if (state.mat !== "All") params.set("mat", state.mat);
    if (state.q) params.set("q", state.q);
    return params.toString();
  }
  function filter(state, errors) {
    if ((errors && errors.length) || validate(state).length) return [];
    var needle = state.q.trim().toLowerCase();
    return products.filter(function (p) {
      return (state.make === "All" || state.make === p.make) && (!state.model || state.model === p.model) &&
        (state.mat === "All" || state.mat === p.material) && (p.name + " " + p.part).toLowerCase().includes(needle);
    });
  }
  function enquiry(product, vehicle) {
    var subject = product ? "Radiator enquiry: " + product.name + " | " + product.part : "Radiator enquiry" + (vehicle ? ": " + vehicle : " — vehicle not listed");
    subject = subject.replace(/[\u0000-\u001f\u007f]/g, " ");
    var body = "Hello ACC Radiators,\n\n" + (product ? "I would like to enquire about:\nProduct: " + product.name + "\nPart number: " + product.part + "\nMaterial: " + product.material : "Please help me find a radiator for: " + (vehicle || "[make and model]")) +
      "\n\nVehicle / model year: [please fill in]\nTransmission: [please fill in]\nQuantity: [please fill in]\nCity: [please fill in]\n\nPlease confirm fitment, availability, pricing and warranty terms.\nThank you.";
    return { subject: subject, body: body, href: "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body) };
  }
  var api = { products: products, materials: materials, email: email, makes: makes, models: models, validate: validate, read: read, query: query, filter: filter, enquiry: enquiry };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ACCCatalog = api;
})(typeof globalThis !== "undefined" ? globalThis : this);

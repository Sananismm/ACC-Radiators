(function () {
  "use strict";
  var catalog = window.ACCCatalog;
  var make = document.getElementById("make"), model = document.getElementById("model");
  catalog.makes().forEach(function (name) { make.add(new Option(name, name)); });
  make.addEventListener("change", function () {
    model.length = 1;
    model.disabled = !make.value;
    catalog.models(make.value).forEach(function (name) { model.add(new Option(name, name)); });
  });
  document.getElementById("lookup").addEventListener("submit", function (event) {
    event.preventDefault();
    var query = catalog.query({ make: make.value || "All", model: model.value, mat: "All", q: "" });
    location.href = "products.html" + (query ? "?" + query : "");
  });
  document.getElementById("unlisted-enquiry").href = catalog.enquiry().href;
})();

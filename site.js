(function () {
  "use strict";
  var toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("main-nav");
  var mobile = window.matchMedia("(max-width: 768px)");
  function close() { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  function resize() { close(); toggle.hidden = !mobile.matches; nav.classList.toggle("is-collapsible", mobile.matches); }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", function (event) { if (event.target.closest("a")) close(); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { close(); toggle.focus(); }
  });
  mobile.addEventListener("change", resize);
  resize();
  document.querySelectorAll(".media").forEach(function (media) {
    var label = document.createElement("span"); label.className = "image-fallback"; label.textContent = "Representative image unavailable"; label.hidden = true; media.appendChild(label);
  });
  function fallback(img) {
    var logo = img.closest(".logo"), media = img.closest(".media");
    if (logo) logo.classList.add("is-text");
    if (media) media.querySelector(".image-fallback").hidden = false;
    img.hidden = true;
  }
  // Capture failures once; never request a second, missing fallback asset.
  document.addEventListener("error", function (event) {
    if (event.target.tagName === "IMG" && event.target.closest(".logo, .media")) fallback(event.target);
  }, true);
  document.querySelectorAll(".logo img, .media img").forEach(function (img) {
    if (img.complete && !img.naturalWidth) fallback(img);
  });
})();

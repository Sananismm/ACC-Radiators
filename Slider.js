/* Swipe slider: moves only on mouse drag, touch swipe, or the arrow buttons.
   Markup: [data-slider] > .slider__btn[data-dir="-1"] + .slider__track + .slider__btn[data-dir="1"] */
(function () {
  var DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag, not a click
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(root) {
    var track = root.querySelector(".slider__track");
    var prev = root.querySelector('[data-dir="-1"]');
    var next = root.querySelector('[data-dir="1"]');
    if (!track || !prev || !next) return;

    /* arrows: disabled at either end, hidden when everything already fits */
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max - 1;
      root.classList.toggle("is-static", max <= 1);
    }

    function page(dir) {
      track.scrollBy({ left: dir * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { page(-1); });
    next.addEventListener("click", function () { page(1); });

    /* mouse drag (touch and trackpad swipes already scroll natively) */
    var startX = 0, startLeft = 0, pressed = false, moved = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressed = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });

    window.addEventListener("pointermove", function (e) {
      if (!pressed) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        track.classList.add("is-dragging");
      }
      if (moved) track.scrollLeft = startLeft - dx;
    });

    function release() {
      if (!pressed) return;
      pressed = false;
      track.classList.remove("is-dragging");
    }
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    /* a drag must not also select the logo under the cursor */
    track.addEventListener("click", function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);

    /* stop the browser dragging the images themselves */
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    update();
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-slider]"), init);
})();
/* featured-gallery.js
 * Makes the screenshot gallery on each featured project interactive:
 *   - the large image shows the selected screenshot
 *   - the thumbnail strip scrolls sideways (touch, trackpad, scrollbar or keyboard)
 *   - click or tap a thumbnail to select it; Left/Right/Home/End move between thumbnails
 *
 * Without JavaScript the first screenshot still shows and the strip still scrolls.
 * Markup: see the .gallery block in index.html (data-gallery, data-gallery-main,
 * data-gallery-thumb with data-src and data-alt).
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    var thumbs = Array.from(gallery.querySelectorAll('[data-gallery-thumb]'));
    if (!main || thumbs.length < 2) return;

    function select(index, focus) {
      var thumb = thumbs[index];
      if (!thumb) return;

      main.src = thumb.dataset.src;
      main.alt = thumb.dataset.alt;

      thumbs.forEach(function (button, i) {
        button.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      });

      // keep the selected thumbnail inside the scrolling strip
      thumb.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      if (focus) thumb.focus({ preventScroll: true });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () { select(index, false); });

      thumb.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(index + 1, thumbs.length - 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(index - 1, 0);
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = thumbs.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });
  });
})();

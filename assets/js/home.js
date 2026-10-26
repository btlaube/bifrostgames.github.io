
// Featured games display image switching

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
        behavior: 'smooth'
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

// Animated profile picture behavior

document.querySelectorAll('.animated-pfp').forEach(img => {
    const idleSrc = "/assets/img/PfpAnimFrames/Frame1.png";
    const hoverSrc = "/assets/img/PfpAnimFrames/Frame2.png";
    const clickSrc = "/assets/img/PfpAnimFrames/Frame3.png";

    const CLICK_HOLD_DURATION = 500;   // ms to hold click frame
    const COUNTER_VISIBLE_TIME = 1000; // ms counter stays visible

    // --- Create wrapper ---
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

     // --- Counter Bubble ---
    const counterEl = document.createElement('div');
    counterEl.textContent = "0";
    counterEl.classList.add('pfp-counter-bubble');

    wrapper.appendChild(counterEl);

    let clickCount = 0;
    let counterTimeout = null;
    let clickTimeout = null;

    // --- Hover states ---
    const canHover = window.matchMedia('(hover: hover)').matches;

    img.addEventListener('mouseover', () => {
        img.src = hoverSrc;
    });

    img.addEventListener('mouseout', () => {
        img.src = idleSrc;
    });

    // --- Click behavior ---
    img.addEventListener('click', () => {
        clickCount++;
        counterEl.textContent = "Youch! x" + clickCount;

        // Show counter
        counterEl.style.opacity = '1';

        // Reset counter hide timer
        if (counterTimeout) clearTimeout(counterTimeout);
        counterTimeout = setTimeout(() => {
            counterEl.style.opacity = '0';
        }, COUNTER_VISIBLE_TIME);

        // Hold click frame briefly
        img.src = clickSrc;

        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            if (canHover && img.matches(':hover')) {
                img.src = hoverSrc;
            } else {
                img.src = idleSrc;
            }
        }, CLICK_HOLD_DURATION);

    });
});

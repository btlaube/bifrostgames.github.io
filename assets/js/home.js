// Get all game containers
var games = document.querySelectorAll('.featured-project');

games.forEach(game => {
    // Get the dock buttons and display image within this game container
    var buttons = game.querySelectorAll('.dock-button');
    var displayImage = game.querySelector('.display-image');

    // Attach event listeners to each button
    buttons.forEach(button => {
        button.onclick = function() {
            setDisplayImage(button, displayImage);
        };
    });
});

function setDisplayImage(button, displayImage) {
    // Assuming each button has an <img> child with the desired image source
    var buttonImage = button.querySelector('img');

    // Update the display image's source
    if (buttonImage) {
        displayImage.src = buttonImage.src;
    }
}

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
    let isHovered = false;

    img.addEventListener('mouseover', () => {
        isHovered = true;
        img.src = hoverSrc;
    });

    img.addEventListener('mouseout', () => {
        isHovered = false;
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
            img.src = isHovered ? hoverSrc : idleSrc;
        }, CLICK_HOLD_DURATION);
    });
});

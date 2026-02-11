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

    img.addEventListener('mouseover', () => {
        img.src = hoverSrc;
    });

    img.addEventListener('mouseout', () => {
        img.src = idleSrc;
    });

    img.addEventListener('mousedown', () => {
        img.src = clickSrc;
    });

    img.addEventListener('mouseup', () => {
        img.src = hoverSrc; // return to hover state after click
    });
});
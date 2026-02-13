var character = document.getElementById("character");
var block = document.getElementById("block");
var counter = 0;
var modal = document.getElementById("gameOverModal");
var modalText = document.getElementById("modalText");
var restartButton = document.getElementById("restartButton");
var quitButton = document.getElementById("quitButton");
var startModal = document.getElementById("startModal");
var startModalText = document.getElementById("startModalText");
var startButton = document.getElementById("startButton");

function jump()
{
    if(character.classList.contains("animate")){ return; }
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    }, 300);
}

function showStartModal()
{
    startModal.style.display = "block";
    startModalText.innerHTML = "Clicker Game!";
}

function hideStartModal()
{
    startModal.style.display = "none";
}

function stopGame()
{
    block.style.animation = "none";
    counter = 0;
    document.getElementById("scoreSpan").innerHTML = counter;
}

stopGame()
showStartModal();

// Function to start the game
function startGame()
{
    counter = 0;
    block.style.animation = "block 1s infinite linear";
}

startButton.onclick = function()
{
    console.log("Start button clicked");
    hideStartModal();
    startModal.style.display = "none";
    startGame();
};


var checkDead = setInterval(function()
    {
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
        // Check if block is at player down position and check if player is in down (not jumping) position
        if(blockLeft < 17 && blockLeft > -17 && characterTop >= 130){
            block.style.animation = "none";
            showModal();
        } else {
            counter++;
            document.getElementById("scoreSpan").innerHTML = Math.floor(counter / 100);
        }
    }, 10);

function showModal()
{
    modal.style.display = "block";
    modalText.innerHTML = "Game Over. Score: " + Math.floor(counter / 100);
}

// Close modal and restart game
restartButton.onclick = function()
{
    modal.style.display = "none";
    startGame();
};

quitButton.onclick = function()
{
    modal.style.display = "none";
    alert("Thanks for playing!"); 
};

var startModal = document.getElementById("startModal");
var startModalText = document.getElementById("startModalText");
var startButton = document.getElementById("startButton");
// Get references to the buttons
const clickerButton = document.getElementById('clicker-button');
const scrollerButton = document.getElementById('scroller-button');

// Show start modal
startModalText.innerHTML = "Play Click Scroller!";
startModal.style.display = "block";

// Data
var inventory = {
    "coal": 0,
    "copper": 0,
    "iron": 0,
    "sulfur": 0,
    "magnesium": 0
};

// Resource costs for each item (previous item required to unlock the next)
var itemRecipes = {
    "coal": {},                    // No cost or prerequisite for coal
    "copper": {"coal": 1},         // Copper requires 1 Coal
    "iron": {"copper": 2},         // Iron requires 2 Copper
    "sulfur": {"iron": 3},         // Sulfur requires 3 Iron
    "magnesium": {"sulfur": 4}     // Magnesium requires 4 Sulfur
};

var automatorRecipes = {
    "coal-automator": {"copper": 10},
    "copper-automator": {"iron": 10},
    "iron-automator": {"sulfur": 10},
    "sulfur-automator": {"magnesium": 10},
}

// Generation amounts for each resource (items per second)
var automatorRates = {
    "coal-automator": 0, // initially 0 until activated by first click
    "copper-automator": 0,
    "iron-automator": 0,
    "sulfur-automator": 0
};

if (startButton)
{
    startButton.onclick = function()
    {
        startModal.style.display = "none";
    };
}

if (clickerButton)
{
    // Assign onclick event to open clicker.html
    clickerButton.onclick = () => {
        window.location.href = './clicker.html';
    };
}

if (scrollerButton)
{
        // Assign onclick event to open scroller.html
    scrollerButton.onclick = () => {
        window.location.href = './scroller.html';
    };
}

// Function to save a string
function saveString(key, value) {
    localStorage.setItem(key, value);
}

// Function to save an integer
function saveInt(key, value) {
    localStorage.setItem(key, value.toString());
}

// Function to save a dictionary (or any object)
function saveDict(key, dict) {
    localStorage.setItem(key, JSON.stringify(dict));
}

// Function to retrieve a string
function getString(key) {
    return localStorage.getItem(key) || '';
}

// Function to retrieve an integer
function getInt(key) {
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : 0;
}

// Function to retrieve a dictionary (or any object)
function getDict(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : {};
}

// Example function to save an item to the inventory (array of items)
function addItemToInventory(item) {
    let inventory = getDict('inventory'); // Retrieve current inventory
    if (!Array.isArray(inventory.items)) inventory.items = []; // Initialize if not already an array
    inventory.items.push(item); // Add new item
    saveDict('inventory', inventory); // Save updated inventory
}

// Example function to save or update player stats
function updatePlayerStat(stat, amount) {
    let stats = getDict('playerStats'); // Retrieve current stats
    stats[stat] = (stats[stat] || 0) + amount; // Increment stat
    saveDict('playerStats', stats); // Save updated stats
}

// Function to save game state
function saveGameState(inventory, automatorRates, automatorRecipes, itemRecipes) {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("automatorRates", JSON.stringify(automatorRates));
    localStorage.setItem("automatorRecipes", JSON.stringify(automatorRecipes));
    localStorage.setItem("itemRecipes", JSON.stringify(itemRecipes));
    console.log("Game progress saved.");
}

// Function to load game state
function loadGameState() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    const automatorRates = JSON.parse(localStorage.getItem("automatorRates")) || {};
    const automatorRecipes = JSON.parse(localStorage.getItem("automatorRecipes")) || {};
    const itemRecipes = JSON.parse(localStorage.getItem("itemRecipes")) || {};

    return { inventory, automatorRates, automatorRecipes, itemRecipes };
}

// Function to reset game state
function clearProgress() {
    inventory = {
        "coal": 0,
        "copper": 0,
        "iron": 0,
        "sulfur": 0,
        "magnesium": 0
    };
    itemRecipes = {
        "coal": {},                    // No cost or prerequisite for coal
        "copper": {"coal": 1},         // Copper requires 1 Coal
        "iron": {"copper": 2},         // Iron requires 2 Copper
        "sulfur": {"iron": 3},         // Sulfur requires 3 Iron
        "magnesium": {"sulfur": 4}     // Magnesium requires 4 Sulfur
    };
    automatorRecipes = {
        "coal-automator": {"copper": 10},
        "copper-automator": {"iron": 10},
        "iron-automator": {"sulfur": 10},
        "sulfur-automator": {"magnesium": 10},
    }
    automatorRates = {
        "coal-automator": 0, // initially 0 until activated by first click
        "copper-automator": 0,
        "iron-automator": 0,
        "sulfur-automator": 0
    };
}
// Function to reset game state
function resetGameState() {
    localStorage.removeItem("inventory");
    localStorage.removeItem("automatorRates");
    localStorage.removeItem("automatorRecipes");
    localStorage.removeItem("itemRecipes");
    console.log("Game progress reset.");
}
/* Jump vars */
var character = document.getElementById("character");
var block = document.getElementById("block");
var counter = 0;
var saveDataButton = document.getElementById("saveDataButton");
var loadDataButton = document.getElementById("loadDataButton");
var clearDataButton = document.getElementById("clearDataButton");
var resetButton = document.getElementById("resetButton");
var startModal = document.getElementById("startModal");
var startModalText = document.getElementById("startModalText");
var startButton = document.getElementById("startButton");

/* Clicker vars */
var counter = 0;

// Select all buttons with the itemButton class
var itemButtons = document.querySelectorAll('.itemButton');
var automators = document.querySelectorAll('.automator');

// Sample data dictionary
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


// Inventory
function updateInventory(inventoryDict) {
    for (const [key, value] of Object.entries(inventoryDict)) {
        const nameElement = document.getElementById(`${key.toLowerCase()}-name`);
        const countElement = document.getElementById(`${key.toLowerCase()}-count`);

        if (nameElement && countElement) {
            nameElement.innerHTML = key; // Display the stat name
            countElement.innerHTML = value; // Display the stat value
        }
    }
}

// Interval timers for each resource generator
var generationIntervals = {};

// Function to add the resource to inventory based on the generation amount
function generateResourceFromAutomator(automator) {
    resource = automator.id.split('-')[0];
    addItemToInventory(resource, automatorRates[automator.id]);
    updateInventory(inventory);
    updateAutomatorDisplays();
    updateButtonDisplays();
}

function checkAutomator(automator)
{
    // If the generator is not already active, start the 1-second interval
    if (!generationIntervals[automator.id]) {
        activateAutomator(automator);
    }
    incrementAutomatorAmount(automator);
    incrementAutomatorCost(automator);
    updateAutomatorDisplays();
}

// Activate Automato
function activateAutomator(automator)
{
    generationIntervals[automator.id] = setInterval(() => {
        generateResourceFromAutomator(automator);
    }, 1000); // Fixed 1-second interval for all generators
}

// Function to start the generator and increase the amount per second
function incrementAutomatorAmount(automator) {
    automatorRates[automator.id] += 1 + automatorRates[automator.id] ** 0.1; // Exponential growth based on current rate
}

// Function to increase automator cost
function incrementAutomatorCost(automator) {
    for (ingredient in automatorRecipes[automator.id]) {
        automatorRecipes[automator.id][ingredient] += 1 + automatorRecipes[automator.id][ingredient] ** 0.1; // Exponential growth based on current rate
    }
}

// Function to update button displays
function updateAutomatorDisplays() {
    // Iterate through each button in automators
    automators.forEach(button => {
        const recipe = automatorRecipes[button.id];

        const costElement = document.getElementById(`${button.id}-cost`);
        const rateElement = document.getElementById(`${button.id}-rate`);

        // Extract required resource and amount from the recipe
        const [requiredResource, requiredAmount] = Object.entries(recipe)[0];
        // console.log(`${button.id} ${requiredResource} ${requiredAmount}`);

        // Update cost display
        if (costElement) {
            costElement.textContent = `Cost: ${requiredResource.charAt(0).toUpperCase() + requiredResource.slice(1)} ${requiredAmount}`;
        }

        // Update generation rate display
        if (rateElement) {
            const rate = automatorRates[button.id] || 0;
            rateElement.textContent = `${rate}/sec`;
        }

        // Enable or disable button based on inventory
        if (requiredResource) {
            button.disabled = inventory[requiredResource] < requiredAmount;
        }
    });
}

function spendRecipe(recipe)
{
    for (ingredient in recipe)
    {
        if (inventory.hasOwnProperty(ingredient)) {
            removeItemFromInventory(ingredient, recipe[ingredient]);
        }
    }
}

// Attach event listeners to each automator button
document.querySelectorAll('.automator').forEach(automator => {
    automator.onclick = function() {
        spendRecipe(automatorRecipes[automator.id]);
        checkAutomator(automator);
        updateInventory(inventory);
        updateButtonDisplays();
        updateAutomatorDisplays();
    };
});

// Function to add an item to the inventory
function addItemToInventory(itemName, amount) {
    // Check if the item exists in the inventory
    if (inventory.hasOwnProperty(itemName)) {
        inventory[itemName] += amount; // Increment the count for the item
    }
}

// Function to add an item to the inventory
function removeItemFromInventory(itemName, amount) {
    // Check if the item exists in the inventory
    if (inventory.hasOwnProperty(itemName)) {
        inventory[itemName] -= amount; // Increment the count for the item
    }
}

// Attach event listeners to each button
itemButtons.forEach(button => {
    // Get the item name from the button text (lowercase)
    const itemName = button.querySelector('p').innerText.toLowerCase();
    
    button.onclick = function() {
        addItemToInventory(itemName, 1); // Pass the item name directly
        if (button.id != 'coal-button') { // Coal is FREE!
            spendRecipe(itemRecipes[button.id.split('-')[0]]);
        }
        updateInventory(inventory);
        updateButtonDisplays();
        updateAutomatorDisplays();
    };
});

// Function to update button displays
function updateButtonDisplays() {
    // Iterate through each button in automatorRecipes
    itemButtons.forEach(button => {
        // console.log(button.id);
        if (button.id != 'coal-button') {
            const resource = button.id.split('-')[0]; // Get copper from copper-button
            const recipe = itemRecipes[resource];
            
            const costElement = document.getElementById(`${resource}-cost`);
            const rateElement = document.getElementById(`${resource}-rate`);

            // Extract the required resource and amount from the recipe
            const [requiredResource, requiredAmount] = Object.entries(recipe)[0];

            // Update cost display
            if (costElement) {
                costElement.textContent = `Cost: ${requiredResource.charAt(0).toUpperCase() + requiredResource.slice(1)} ${requiredAmount}`;
            }

            rateElement.textContent = "1/click";

            // Enable or disable button based on inventory
            if (requiredResource) {
                button.disabled = inventory[requiredResource] < requiredAmount;
            }
        }
    });
}










// Show start modal
startModalText.innerHTML = "Play the jump game!";
startModal.style.display = "block";
updateInventory(inventory);
updateButtonDisplays();
updateAutomatorDisplays();

startButton.onclick = function()
{
    startModal.style.display = "none";
};

saveDataButton.onclick = function()
{
    // Save data
    localStorage.setItem("clickCount", counter);

    // Save other data
    // Call the function to save stats
    saveStatsToLocalStorage(stats);
    // Call the function to save inventory items
    saveInventoryToLocalStorage(inventory);
};

// Function to save each stat to localStorage
function saveStatsToLocalStorage(statDict) {
    for (let stat in statDict) {
        if (statDict.hasOwnProperty(stat)) { // Check if it’s a direct property of the object
            localStorage.setItem(stat, statDict[stat]);
        }
    }
}

// Function to save each item to localStorage
function saveInventoryToLocalStorage(inventoryDict) {
    for (let item in inventoryDict) {
        if (inventoryDict.hasOwnProperty(item)) { // Check if it’s a direct property of the object
            localStorage.setItem(item, inventoryDict[item]);
        }
    }
}

loadDataButton.onclick = function()
{
    // TODO: Check for data to retrieve
        // If not, do not overwrite current progress
    // Retrieve data
    const savedClickCount = localStorage.getItem("clickCount");
    counter = savedClickCount;
};

clearDataButton.onclick = function()
{
    // Clear saved data
    localStorage.removeItem("clickCount");
};

resetButton.onclick = function()
{
    // Reset progress
    counter = 0;
};





var startModal = document.getElementById("startModal");
var startModalText = document.getElementById("startModalText");
var startButton = document.getElementById("startButton");

// Select all buttons with the itemButton class
var itemButtons = document.querySelectorAll('.itemButton');
var automators = document.querySelectorAll('.automator');

// Button references
var saveDataButton = document.getElementById("saveDataButton");
var loadDataButton = document.getElementById("loadDataButton");
var resetButton = document.getElementById("resetButton");

// Interval timers for each resource generator
var generationIntervals = {};

// On load
// Load data
const data = loadGameState();
if (data.inventory && Object.keys(data.inventory).length > 0)
{
    inventory = data.inventory;
    automatorRates = data.automatorRates;
    automatorRecipes = data.automatorRecipes;
    itemRecipes = data.itemRecipes;
}
// Update displays
updateInventoryDisplay();
updateButtonDisplays();
updateAutomatorDisplays();
// Initialize Automators
initializeAutomators();
// Save Data
saveGameState(inventory, automatorRates, automatorRecipes, itemRecipes);

// Show start modal
startModalText.innerHTML = "Start clicker";
startModal.style.display = "block";

startButton.onclick = function()
{
    startModal.style.display = "none";
};

// Event listener for save button
saveDataButton.onClick = function() {
    saveClickerState();
};

// Event listener for load button
loadDataButton.onclick = function() {
    const data = loadGameState();
    inventory = data.inventory;
    automatorRates = data.automatorRates;
    automatorRecipes = data.automatorRecipes;
    itemRecipes = data.itemRecipes;

    updateInventoryDisplay();
    updateButtonDisplays();
    updateAutomatorDisplays();
    console.log("Game progress loaded.");
};

resetButton.onClick = function()
{
    resetGameState();
    updateInventoryDisplay();
    updateButtonDisplays();
    updateAutomatorDisplays();
}

// Display update functions
// Funciton to update inventory display
function updateInventoryDisplay() {
    for (const [key, value] of Object.entries(inventory)) {
        const nameElement = document.getElementById(`${key.toLowerCase()}-name`);
        const countElement = document.getElementById(`${key.toLowerCase()}-count`);

        if (nameElement && countElement) {
            nameElement.innerHTML = key; // Display the stat name
            countElement.innerHTML = value; // Display the stat value
        }
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
        if (recipe)
            var [requiredResource, requiredAmount] = Object.entries(recipe)[0];
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
            if (recipe)
                var [requiredResource, requiredAmount] = Object.entries(recipe)[0];

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

function initializeAutomators()
{
    automators.forEach(automator => {
        activateAutomator(automator);
    });
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
// Activate Automator
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
// Attach event listeners to each automator button
automators.forEach(automator => {
    automator.onclick = function() {
        spendRecipe(automatorRecipes[automator.id]);
        checkAutomator(automator);
        updateInventoryDisplay();
        updateButtonDisplays();
        updateAutomatorDisplays();
        saveClickerState();
    };
});

// Attach event listeners to each button
itemButtons.forEach(button => {
    // Get the item name from the button text (lowercase)
    const itemName = button.querySelector('p').innerText.toLowerCase();    
    button.onclick = function() {
        addItemToInventory(itemName, 1); // Pass the item name directly
        if (button.id != 'coal-button') { // Coal is FREE!
            spendRecipe(itemRecipes[button.id.split('-')[0]]);
        }
        updateInventoryDisplay();
        updateButtonDisplays();
        updateAutomatorDisplays();
        saveClickerState();
    };
});

// Function to add an item to the inventory
function addItemToInventory(itemName, amount) {
    // Check if the item exists in the inventory
    if (inventory.hasOwnProperty(itemName)) {
        inventory[itemName] += amount; // Increment the count for the item
    }
    saveClickerState();
}
// Function to add the resource to inventory based on the generation amount
function generateResourceFromAutomator(automator) {
    resource = automator.id.split('-')[0];
    addItemToInventory(resource, automatorRates[automator.id]);
    updateInventoryDisplay();
    updateAutomatorDisplays();
    updateButtonDisplays();
}
// Function to add an item to the inventory
function removeItemFromInventory(itemName, amount) {
    // Check if the item exists in the inventory
    if (inventory.hasOwnProperty(itemName)) {
        inventory[itemName] -= amount; // Increment the count for the item
    }
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

function saveClickerState()
{
    saveGameState(inventory, automatorRates, automatorRecipes, itemRecipes);
}
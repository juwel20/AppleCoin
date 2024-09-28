// Initial variables
let clicksRemaining = 500;
let coinsEarned = 0;
let boostsRemaining = 6;
let isRefilling = false; // Indicates if we're waiting for the refill
let refillEndTime = null; // Timestamp for auto refill
let boostCooldownEnd = null; // Timestamp for boost cooldown

// Function to save game state to localStorage
function saveGameState() {
    localStorage.setItem('clicksRemaining', clicksRemaining);
    localStorage.setItem('coinsEarned', coinsEarned);
    localStorage.setItem('boostsRemaining', boostsRemaining);
    localStorage.setItem('refillEndTime', refillEndTime);
    localStorage.setItem('boostCooldownEnd', boostCooldownEnd);
}

// Function to load game state from localStorage
function loadGameState() {
    clicksRemaining = parseInt(localStorage.getItem('clicksRemaining')) || 500;
    coinsEarned = parseInt(localStorage.getItem('coinsEarned')) || 0;
    boostsRemaining = parseInt(localStorage.getItem('boostsRemaining')) || 6;
    refillEndTime = localStorage.getItem('refillEndTime') || null;
    boostCooldownEnd = localStorage.getItem('boostCooldownEnd') || null;

    updateClickDisplay();
    updateScoreDisplay();
    document.querySelector('.boost').innerText = `Boost left: ${boostsRemaining}/6`;

    // Handle refill timer on reload
    if (refillEndTime && Date.now() < parseInt(refillEndTime)) {
        startRefillTimer(true);
    }

    // Handle boost cooldown on reload
    if (boostCooldownEnd && Date.now() < parseInt(boostCooldownEnd)) {
        document.querySelector('.boost-button').disabled = true;
        const timeRemaining = parseInt(boostCooldownEnd) - Date.now();
        setTimeout(() => {
            document.querySelector('.boost-button').disabled = false;
        }, timeRemaining);
    }
}

// Function to update the click count and coin score
function handleClick() {
    if (clicksRemaining > 0 && !isRefilling) {
        clicksRemaining--;
        coinsEarned += 10; // Increment coins (e.g., 10 per click)

        // Update the HTML with the new values
        updateClickDisplay();
        updateScoreDisplay();

        // Save the game state
        saveGameState();

        // Start the refill timer if clicks reach 0
        if (clicksRemaining === 0) {
            startRefillTimer(false);
        }
    } else if (isRefilling) {
        alert("Please wait for refill.");
    }
}

// Function to update the displayed clicks
function updateClickDisplay() {
    if (isRefilling) {
        document.querySelector('.clicks').innerText = "Refilling...";
    } else {
        document.querySelector('.clicks').innerText = `Clicks: ${clicksRemaining}/500`;
    }
}

// Function to update the score display
function updateScoreDisplay() {
    document.querySelector('.score').innerHTML = `<img src="coin.png" alt="Score Icon" class="score-icon"> ${coinsEarned}`;
}

// Function to start the 1-hour refill timer
function startRefillTimer(onLoad) {
    if (!onLoad) {
        refillEndTime = Date.now() + 3600 * 1000; // 1 hour in milliseconds
        saveGameState();
    }

    isRefilling = true;
    const interval = setInterval(() => {
        const timeRemaining = parseInt(refillEndTime) - Date.now();
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);

            // Display the countdown in the Clicks section
            document.querySelector('.clicks').innerText = `Refill in: ${minutes}m ${seconds}s`;
        } else {
            clearInterval(interval);
            clicksRemaining = 500;
            isRefilling = false;
            refillEndTime = null;
            updateClickDisplay(); // Reset the click display back to full
            saveGameState();
        }
    }, 1000); // Update every second
}

// Function to handle Boost functionality
function handleBoost() {
    if (boostsRemaining > 0 && !isRefilling) {
        clicksRemaining = 500; // Reset the clicks to 500
        boostsRemaining--; // Decrease the boost count
        updateClickDisplay();
        document.querySelector('.boost').innerText = `Boost left: ${boostsRemaining}/6`;
        
        // Save game state
        saveGameState();

        // Disable boost for 3 hours
        document.querySelector('.boost-button').disabled = true;
        boostCooldownEnd = Date.now() + 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        saveGameState();

        const timeRemaining = 3 * 60 * 60 * 1000;
        setTimeout(() => {
            document.querySelector('.boost-button').disabled = false;
        }, timeRemaining);
    } else if (isRefilling) {
        alert("Cannot use Boost during refill.");
    } else {
        alert("No boosts left!");
    }
}

// Add the event listener to the apple image for clicks
document.querySelector('.apple-image').addEventListener('click', handleClick);

// Add the event listener to the Boost button
document.querySelector('.boost-button').addEventListener('click', handleBoost);

// Load the game state when the page loads
window.onload = loadGameState;

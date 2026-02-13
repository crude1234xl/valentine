// DOM Elements
const noBtn = document.querySelector('.no-btn');
const yesBtn = document.querySelector('.yes-btn');
const questionCard = document.querySelector('.question-card-container');
const successContainer = document.querySelector('.success-container');
const audio = document.getElementById('love-song');
const rainContainer = document.querySelector('.rain');
const body = document.body;

// Hide success container forcefully at start
successContainer.style.display = 'none';

// Move "No" Button - Ensure visibility & z-index
function moveNoButton() {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Fallback if measurement fails, using clientDimensions to be safe
    const btnWidth = (noBtn.offsetWidth > 0) ? noBtn.offsetWidth : 100;
    const btnHeight = (noBtn.offsetHeight > 0) ? noBtn.offsetHeight : 50;

    // Calculate safe padding (ensure it doesn't touch the edge)
    const padding = 20;

    // Calculate maximum X and Y
    const maxX = viewportWidth - btnWidth - padding;
    const maxY = viewportHeight - btnHeight - padding;

    // Ensure randomization is safe (clamp to 0 if negative)
    const safeMaxX = Math.max(0, maxX);
    const safeMaxY = Math.max(0, maxY);

    // Random position
    const randomX = Math.floor(Math.random() * safeMaxX);
    const randomY = Math.floor(Math.random() * safeMaxY);

    // Ensure button is direct child of body for absolute positioning relative to viewport
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
    }

    noBtn.style.position = 'fixed'; // Use fixed to position relative to viewport
    noBtn.style.left = `${Math.max(padding, randomX)}px`; // Ensure left padding
    noBtn.style.top = `${Math.max(padding, randomY)}px`; // Ensure top padding
    noBtn.style.zIndex = '9999'; // Highest z-index

    // Add a funny rotation
    const rotation = (Math.random() - 0.5) * 40;
    noBtn.style.transform = `rotate(${rotation}deg)`;
}

// Event Listeners for No Button
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Yes Button Action
yesBtn.addEventListener('click', () => {
    // Hide Question
    questionCard.style.display = 'none';

    // Hide or remove No button
    if (noBtn.parentNode) {
        noBtn.style.display = 'none'; // Hide it
    }

    // Show Success
    successContainer.style.display = 'flex';
    successContainer.style.flexDirection = 'column'; // Force column layout

    // Change Background Class for Pink/Black + White Rain Visibility
    document.body.classList.add('success-state');

    // Start RAIN
    startRain();

    // Play Music - Using the new file
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 1.0;
        // Explicitly load in case source changed but not reloaded
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Audio playing");
            }).catch(e => {
                console.warn("Audio play failed (interaction required or file missing):", e);
                // Maybe auto-retry on interaction if needed, but not forcing now
            });
        }
    }

    // Celebration Effects
    launchConfetti();
    spawnFloatingLove(); // More intense love effect
});

// White Rain Effect
function startRain() {
    rainContainer.classList.add('active'); // CSS handles display block

    // Create drops
    for (let i = 0; i < 150; i++) { // More drops for better effect
        const drop = document.createElement('div');
        drop.classList.add('drop');
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        drop.style.opacity = Math.random();
        rainContainer.appendChild(drop);
    }
}

// Confetti Effect
function launchConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Background Icons
function createFloatingBackground() {
    // Colorful mix as requested
    const items = ['🌈', '🌸', '🍭', '🎀', '🧸', '🔔', '💖', '✨', '🦋'];
    const container = document.querySelector('.floating-bg'); // Changed from getElementById to ensure it finds any
    if (!container) return;

    // Clear existing to avoid duplicates if re-run (good practice, though not strictly needed here)
    container.innerHTML = '';

    for (let i = 0; i < 40; i++) { // Increased count for "flying everywhere" effect
        const span = document.createElement('div');
        span.className = 'float-item';
        span.textContent = items[Math.floor(Math.random() * items.length)];

        // Randomize initial positions only - Ensure they are ON SCREEN
        // Using padding to avoid edges
        span.style.left = (Math.random() * 90 + 5) + 'vw';
        span.style.top = (Math.random() * 90 + 5) + 'vh';
        span.style.fontSize = Math.random() * 1.5 + 1.5 + 'rem';

        // Randomly assign a DIRECTION PATH (1 to 4)
        const path = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, or 4
        span.style.animationName = `floatPath${path}`;

        // Randomize Delay so they don't sync up perfectly in position
        span.style.animationDelay = -(Math.random() * 10) + 's';

        // Initial duration (will be quickly overridden by pulse)
        span.style.animationDuration = '8s';

        container.appendChild(span);
    }

    // Start the Global Speed Pulse (Normal <-> Slow Motion)
    pulsateSpeed();
}

function pulsateSpeed() {
    let isSlow = false; // Start Normal
    const container = document.querySelector('.floating-bg');

    // Initial run immediately to set state
    const updateDurations = () => {
        isSlow = !isSlow;
        const items = document.querySelectorAll('.float-item');

        // "Normal (3s) then Slow Motion (15s)"
        // Note: CSS animation is 'floatWander' which has small movement (translate +/- 40px)
        // So '3s' will look actively moving, '15s' will look very slow/floating.
        const newDuration = isSlow ? '15s' : '3s';

        items.forEach(item => {
            // Update duration on the fly to change speed instantly
            item.style.animationDuration = newDuration;
        });
    };

    // Run first update immediately then interval
    updateDurations();
    setInterval(updateDurations, 3000); // Change every 3 seconds
}

// Spawn massive love on success
function spawnFloatingLove() {
    const container = document.querySelector('.floating-bg');
    if (!container) return;
    // Add more hearts
    for (let i = 0; i < 50; i++) {
        const span = document.createElement('div');
        span.className = 'float-item';
        span.textContent = '❤️';
        span.style.fontSize = Math.random() * 2 + 1 + 'rem';
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top = '100vh'; // Start from bottom for new spawns
        span.style.animationDuration = (Math.random() * 5 + 3) + 's'; // Faster
        container.appendChild(span);
    }
}

// Initialize
createFloatingBackground();

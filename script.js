// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const app = document.getElementById('app');
const usernameInput = document.getElementById('username');
const enterBtn = document.getElementById('enter-btn');
const displayName = document.getElementById('display-name');
const longUrlInput = document.getElementById('long-url');
const shortenBtn = document.getElementById('shorten-btn');
const resultBox = document.getElementById('result');
const shortUrlInput = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const clickCount = document.getElementById('click-count');

// Mock database for URLs
const urlDatabase = {};
let currentUser = 'User';

// Event Listeners
enterBtn.addEventListener('click', handleWelcome);
shortenBtn.addEventListener('click', shortenUrl);
copyBtn.addEventListener('click', copyShortUrl);

// Add hover effects to 3D elements
const threeDElements = document.querySelectorAll('.welcome-box, .container');
threeDElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        element.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn-3d');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// Functions
function handleWelcome() {
    const name = usernameInput.value.trim();
    if (name) {
        currentUser = name;
        displayName.textContent = name;
        
        // Add animation when transitioning
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.9)';
        welcomeScreen.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            app.style.display = 'block';
            
            // Animate app appearance
            app.style.opacity = '0';
            app.style.transform = 'translateY(20px)';
            app.style.display = 'block';
            
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'translateY(0)';
                app.style.transition = 'all 0.5s ease';
            }, 50);
        }, 500);
    } else {
        // Shake animation for empty input
        usernameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            usernameInput.style.animation = '';
        }, 500);
        usernameInput.focus();
    }
}

function shortenUrl() {
    const longUrl = longUrlInput.value.trim();
    
    if (!longUrl) {
        // Shake animation for empty input
        longUrlInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            longUrlInput.style.animation = '';
        }, 500);
        longUrlInput.focus();
        return;
    }
    
    // Validate URL format
    try {
        new URL(longUrl);
    } catch (e) {
        alert('Please enter a valid URL (include http:// or https://)');
        return;
    }
    
    // Generate a short code
    const shortCode = generateShortCode();
    const shortUrl = `${window.location.origin}/${shortCode}`;
    
    // Store in our mock database
    urlDatabase[shortCode] = {
        longUrl: longUrl,
        clicks: 0
    };
    
    // Display the result with animation
    shortUrlInput.value = shortUrl;
    clickCount.textContent = '0';
    resultBox.classList.remove('hidden');
    resultBox.style.opacity = '0';
    resultBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultBox.style.opacity = '1';
        resultBox.style.transform = 'translateY(0)';
        resultBox.style.transition = 'all 0.5s ease';
    }, 50);
    
    // For demo purposes - simulate clicks
    simulateLinkClicks(shortCode);
}

function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function copyShortUrl() {
    shortUrlInput.select();
    document.execCommand('copy');
    
    // Change button text and add confirmation effect
    copyBtn.innerHTML = '<span>✓ Copied!</span>';
    copyBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    
    setTimeout(() => {
        copyBtn.innerHTML = '<span>Copy</span>';
        copyBtn.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
    }, 2000);
}

function simulateLinkClicks(shortCode) {
    // In a real app, this would track actual clicks
    let clicks = 0;
    const interval = setInterval(() => {
        clicks++;
        urlDatabase[shortCode].clicks = clicks;
        clickCount.textContent = clicks;
        
        // Add pulse animation when count updates
        clickCount.style.transform = 'scale(1.2)';
        clickCount.style.color = getRandomColor();
        setTimeout(() => {
            clickCount.style.transform = 'scale(1)';
        }, 300);
        
        if (clicks >= 15) {
            clearInterval(interval);
        }
    }, 1500);
}

function getRandomColor() {
    const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// For demo purposes - handle short URLs if someone visits them
if (window.location.pathname.length > 1) {
    const shortCode = window.location.pathname.substring(1);
    if (urlDatabase[shortCode]) {
        window.location.href = urlDatabase[shortCode].longUrl;
    }
}

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

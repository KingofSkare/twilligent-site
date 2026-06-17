/* ==========================================================================
   PARTICLE BACKGROUND SYSTEM
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 120 // Distance around mouse where links connect
};

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resizeCanvas);

// Track mouse position
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Constructor
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update position and check boundaries
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

// Populate particle array
function initParticles() {
    particlesArray = [];
    // Adjust density based on screen size
    const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    
    // Fetch theme accent color to tint particles
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();

    for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, themeColor));
    }
}

// Connect particles close to each other
function connect() {
    const themeColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-rgb').trim();
    const maxDistance = 150;
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(${themeColorRGB}, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }

        // Connect particles to mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = particlesArray[a].x - mouse.x;
            let dy = particlesArray[a].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let opacity = 1 - (distance / mouse.radius);
                ctx.strokeStyle = `rgba(${themeColorRGB}, ${opacity * 0.25})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Initialize canvas
resizeCanvas();
animate();


/* ==========================================================================
   TRANSLATION & DYNAMIC LANGUAGE SYSTEM
   ========================================================================== */
let currentLang = localStorage.getItem('twilligent_lang') || 'no';

const translations = {
    no: {
        langBtn: "English",
        statusBadge: "<span class='pulse-dot'></span> Midlertidig nettside",
        heroTitle: "Intelligente tråder, uendelige muligheter",
        heroDesc: "Dette domenet er registrert og klargjort. Mens planene veves sammen, kan du bruke denne siden som ditt personlige startpanel.",
        specStatus: "Parkert & Aktiv",
        searchPlaceholder: "Søk på nettet med Google...",
        bookmarksTitle: "Hurtiglenker",
        notesTitle: "Huskeblokk",
        notesPlaceholder: "Skriv ned dine ideer eller gjøremål her... De lagres automatisk på maskinen din.",
        footerText: "Laget spesielt for deg.",
        greetings: {
            morning: "God morgen!",
            afternoon: "God dag!",
            evening: "God kveld!",
            night: "God natt!"
        },
        saveStatusSaved: "<i class='fa-solid fa-check'></i> Lagret",
        saveStatusSaving: "<i class='fa-solid fa-circle-notch fa-spin'></i> Lagrer...",
        geminiTitle: "Gemini AI-Assistent",
        geminiSetupDesc: "Vennligst legg inn din private Gemini API-nøkkel. Den lagres trygt lokalt i din nettleser og blir aldri lastet opp til GitHub.",
        geminiPlaceholder: "Spør Gemini...",
        geminiWelcome: "Hei! Jeg er din Gemini-assistent. Hva lurer du på i dag?",
        geminiError: "Det oppstod en feil under forespørselen. Vennligst sjekk API-nøkkelen din.",
        geminiKeyPrompt: "Vennligst oppgi en gyldig API-nøkkel.",
        geminiKeySave: "Lagre nøkkel"
    },
    en: {
        langBtn: "Norsk",
        statusBadge: "<span class='pulse-dot'></span> Temporary Website",
        heroTitle: "Intelligent threads, infinite possibilities",
        heroDesc: "This domain has been registered and initialized. While future plans are being woven together, feel free to use this page as your personal hub.",
        specStatus: "Parked & Active",
        searchPlaceholder: "Search the web with Google...",
        bookmarksTitle: "Quick Links",
        notesTitle: "Scratchpad",
        notesPlaceholder: "Write down your ideas or tasks here... They are saved automatically on your machine.",
        footerText: "Created especially for you.",
        greetings: {
            morning: "Good morning!",
            afternoon: "Good afternoon!",
            evening: "Good evening!",
            night: "Good night!"
        },
        saveStatusSaved: "<i class='fa-solid fa-check'></i> Saved",
        saveStatusSaving: "<i class='fa-solid fa-circle-notch fa-spin'></i> Saving...",
        geminiTitle: "Gemini AI Assistant",
        geminiSetupDesc: "Please enter your private Gemini API key. It is securely saved locally in your browser and is never uploaded to GitHub.",
        geminiPlaceholder: "Ask Gemini...",
        geminiWelcome: "Hello! I am your Gemini assistant. How can I help you today?",
        geminiError: "An error occurred during the request. Please check your API key.",
        geminiKeyPrompt: "Please provide a valid API key.",
        geminiKeySave: "Save Key"
    }
};

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('twilligent_lang', lang);
    
    // Toggle button language text
    document.getElementById('lang-text').innerText = translations[lang].langBtn;
    
    // Text replacements
    document.getElementById('status-badge').innerHTML = translations[lang].statusBadge;
    document.getElementById('hero-title').innerText = translations[lang].heroTitle;
    document.getElementById('hero-desc').innerText = translations[lang].heroDesc;
    document.getElementById('spec-status-val').innerText = translations[lang].specStatus;
    document.getElementById('search-input').placeholder = translations[lang].searchPlaceholder;
    document.getElementById('bookmarks-title').innerText = translations[lang].bookmarksTitle;
    document.getElementById('notes-title').innerText = translations[lang].notesTitle;
    document.getElementById('notes-textarea').placeholder = translations[lang].notesPlaceholder;
    document.getElementById('footer-text').innerText = translations[lang].footerText;
    
    // Update live text containing clock elements
    updateClock();
    
    // Update Gemini AI widget text if initialized
    if (typeof initGeminiUI === 'function') {
        initGeminiUI();
    }
}

// Language toggle click listener
document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = currentLang === 'no' ? 'en' : 'no';
    updateLanguage(newLang);
});


/* ==========================================================================
   DYNAMIC CLOCK & GREETING SYSTEM
   ========================================================================== */
function updateClock() {
    const now = new Date();
    
    // Time string
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock-display').innerText = `${hrs}:${mins}:${secs}`;
    
    // Date string
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = currentLang === 'no' ? 'no-NO' : 'en-US';
    
    // Capitalize first letter of Norwegian days/months
    let dateStr = now.toLocaleDateString(locale, options);
    if (currentLang === 'no') {
        dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    document.getElementById('date-txt').innerText = dateStr;

    // Greeting message
    const hour = now.getHours();
    let greetingKey = "evening";
    
    if (hour >= 5 && hour < 12) {
        greetingKey = "morning";
    } else if (hour >= 12 && hour < 18) {
        greetingKey = "afternoon";
    } else if (hour >= 18 && hour < 23) {
        greetingKey = "evening";
    } else {
        greetingKey = "night";
    }
    
    document.getElementById('greeting-txt').innerText = translations[currentLang].greetings[greetingKey];
}

// Run clock immediately and every second
setInterval(updateClock, 1000);
updateClock();


/* ==========================================================================
   THEME MANAGER
   ========================================================================== */
const themeMenuBtn = document.getElementById('theme-menu-btn');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-opt');

// Show/hide theme selector dropdown
themeMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
});

// Close theme selector if clicking elsewhere
window.addEventListener('click', () => {
    themeMenu.classList.remove('show');
});

// Load preferred theme or default to Twilight
const activeTheme = localStorage.getItem('twilligent_theme') || 'tw twilight';
setTheme(activeTheme);

function setTheme(themeName) {
    document.body.setAttribute('data-theme-active', themeName);
    localStorage.setItem('twilligent_theme', themeName);
    
    // Update active visual state in theme options list
    themeOptions.forEach(opt => {
        if (opt.getAttribute('data-theme') === themeName) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    // Re-init particles to match colors
    setTimeout(initParticles, 100);
}

// Attach event listeners to theme option buttons
themeOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        const selectedTheme = e.target.getAttribute('data-theme');
        setTheme(selectedTheme);
    });
});


/* ==========================================================================
   QUICK LINKS / BOOKMARKS MANAGER
   ========================================================================== */
const defaultLinks = [
    { name: "GitHub", url: "https://github.com", iconClass: "fa-brands fa-github" },
    { name: "YouTube", url: "https://youtube.com", iconClass: "fa-brands fa-youtube" },
    { name: "Gmail", url: "https://mail.google.com", iconClass: "fa-solid fa-envelope" },
    { name: "Viaplay", url: "https://viaplay.no", iconClass: "fa-solid fa-circle-play" },
    { name: "TV2 Play", url: "https://play.tv2.no", iconClass: "fa-solid fa-tv" },
    { name: "Disney+", url: "https://www.disneyplus.com", iconClass: "fa-solid fa-wand-magic-sparkles" },
    { name: "Max (HBO)", url: "https://www.max.com", iconClass: "fa-solid fa-clapperboard" },
    { name: "NRK TV", url: "https://tv.nrk.no", iconClass: "fa-solid fa-tower-broadcast" },
    { name: "Yr.no (Vær)", url: "https://www.yr.no", iconClass: "fa-solid fa-cloud-sun" },
    { name: "VG", url: "https://www.vg.no", iconClass: "fa-solid fa-newspaper" },
    { name: "ChatGPT", url: "https://chatgpt.com", iconClass: "fa-solid fa-robot" },
    { name: "Gemini", url: "https://gemini.google.com", iconClass: "fa-solid fa-wand-magic-sparkles" }
];

let bookmarks = JSON.parse(localStorage.getItem('twilligent_links_v3'));

// Smart migration check: if user has old defaults or no links, load the new defaults
if (!bookmarks || (bookmarks.length === 4 && bookmarks[0].name === "Google" && bookmarks[3].name === "Wikipedia")) {
    bookmarks = defaultLinks;
    localStorage.setItem('twilligent_links_v3', JSON.stringify(bookmarks));
}

const linksGrid = document.getElementById('links-grid');
const addLinkBtn = document.getElementById('add-link-btn');
const addLinkForm = document.getElementById('add-link-form');
const cancelLinkBtn = document.getElementById('cancel-link-btn');
const saveLinkBtn = document.getElementById('save-link-btn');

const newLinkName = document.getElementById('new-link-name');
const newLinkUrl = document.getElementById('new-link-url');

function renderBookmarks() {
    linksGrid.innerHTML = '';
    
    bookmarks.forEach((item, index) => {
        const linkElem = document.createElement('a');
        linkElem.href = item.url;
        linkElem.target = "_blank";
        linkElem.className = "bookmark-item";
        
        // Pick appropriate icon based on URL or use a default one
        let iconClass = item.iconClass || "fa-solid fa-link";
        
        // Guess icon brand if not provided
        if (!item.iconClass) {
            const lowUrl = item.url.toLowerCase();
            if (lowUrl.includes("github")) iconClass = "fa-brands fa-github";
            else if (lowUrl.includes("google")) iconClass = "fa-brands fa-google";
            else if (lowUrl.includes("youtube")) iconClass = "fa-brands fa-youtube";
            else if (lowUrl.includes("facebook")) iconClass = "fa-brands fa-facebook";
            else if (lowUrl.includes("reddit")) iconClass = "fa-brands fa-reddit";
            else if (lowUrl.includes("twitter") || lowUrl.includes("x.com")) iconClass = "fa-brands fa-x-twitter";
            else if (lowUrl.includes("linkedin")) iconClass = "fa-brands fa-linkedin";
            else if (lowUrl.includes("gmail") || lowUrl.includes("mail")) iconClass = "fa-solid fa-envelope";
            else if (lowUrl.includes("viaplay")) iconClass = "fa-solid fa-circle-play";
            else if (lowUrl.includes("tv2")) iconClass = "fa-solid fa-tv";
            else if (lowUrl.includes("disney")) iconClass = "fa-solid fa-wand-magic-sparkles";
            else if (lowUrl.includes("hbo") || lowUrl.includes("max.com")) iconClass = "fa-solid fa-clapperboard";
            else if (lowUrl.includes("nrk")) iconClass = "fa-solid fa-tower-broadcast";
            else if (lowUrl.includes("yr.no")) iconClass = "fa-solid fa-cloud-sun";
            else if (lowUrl.includes("vg.no")) iconClass = "fa-solid fa-newspaper";
            else if (lowUrl.includes("chatgpt")) iconClass = "fa-solid fa-robot";
            else if (lowUrl.includes("gemini")) iconClass = "fa-solid fa-wand-magic-sparkles";
        }
        
        linkElem.innerHTML = `
            <button class="delete-bookmark-btn" data-index="${index}" title="Slett lenke">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <i class="${iconClass} bookmark-icon"></i>
            <span class="bookmark-title">${item.name}</span>
        `;
        
        // Prevent clicking parent link when clicking the delete button
        const delBtn = linkElem.querySelector('.delete-bookmark-btn');
        delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteBookmark(index);
        });

        linksGrid.appendChild(linkElem);
    });
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem('twilligent_links_v3', JSON.stringify(bookmarks));
    renderBookmarks();
}

// Toggle Add Link Form
addLinkBtn.addEventListener('click', () => {
    addLinkForm.classList.toggle('show');
    if (addLinkForm.classList.contains('show')) {
        newLinkName.focus();
    }
});

cancelLinkBtn.addEventListener('click', () => {
    addLinkForm.classList.remove('show');
    clearLinkForm();
});

function clearLinkForm() {
    newLinkName.value = '';
    newLinkUrl.value = '';
}

saveLinkBtn.addEventListener('click', () => {
    const name = newLinkName.value.trim();
    let url = newLinkUrl.value.trim();

    if (!name || !url) {
        alert(currentLang === 'no' ? "Vennligst fyll ut både navn og URL." : "Please fill in both Name and URL.");
        return;
    }

    // Auto prepend http/https
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    bookmarks.push({ name, url });
    localStorage.setItem('twilligent_links_v3', JSON.stringify(bookmarks));
    
    renderBookmarks();
    addLinkForm.classList.remove('show');
    clearLinkForm();
});

// Initial Render
renderBookmarks();


/* ==========================================================================
   STICKY NOTES WIDGET (DEBOUNCED AUTOSAVE)
   ========================================================================== */
const notesTextarea = document.getElementById('notes-textarea');
const saveStatus = document.getElementById('save-status');

// Load saved notes
notesTextarea.value = localStorage.getItem('twilligent_notes') || '';

let saveTimeout = null;

notesTextarea.addEventListener('input', () => {
    // Show saving status
    saveStatus.innerHTML = translations[currentLang].saveStatusSaving;
    saveStatus.classList.add('saving');
    saveStatus.classList.remove('saved');

    // Debounce saving
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('twilligent_notes', notesTextarea.value);
        saveStatus.innerHTML = translations[currentLang].saveStatusSaved;
        saveStatus.classList.remove('saving');
        saveStatus.classList.add('saved');
        
        // Fade save status out after 2 seconds
        setTimeout(() => {
            if (saveStatus.classList.contains('saved') && !saveStatus.classList.contains('saving')) {
                saveStatus.style.opacity = '0';
            }
        }, 2000);
        
        saveStatus.style.opacity = '1';
    }, 600);
});


// Initialization moved to the end of the file to prevent reference errors before variables are loaded

/* ==========================================================================
   GEMINI CHAT ASSISTANT SYSTEM
   ========================================================================== */
const geminiSetupContainer = document.getElementById('gemini-setup-container');
const geminiChatContainer = document.getElementById('gemini-chat-container');
const geminiApiKeyInput = document.getElementById('gemini-api-key');
const saveGeminiKeyBtn = document.getElementById('save-gemini-key');
const geminiKeyBtn = document.getElementById('gemini-key-btn');
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

let geminiApiKey = localStorage.getItem('twilligent_gemini_key') || '';
let chatHistoryContext = [];

// Escapes HTML tags to prevent XSS injection
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Simple parser to format Gemini markdown response text into clean HTML
function formatResponseText(text) {
    let escaped = escapeHTML(text);

    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code `code`
    escaped = escaped.replace(/`([^`\n]+?)`/g, '<code>$1</code>');

    // Bold **text**
    escaped = escaped.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    escaped = escaped.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');

    // Bullet points (start of line with * or -)
    escaped = escaped.replace(/^\s*[\*\-]\s+(.+)$/gm, '• $1');

    // Paragraphs / Line breaks
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
}

// Update UI state based on if API key exists
function initGeminiUI() {
    // Translate setup descriptions and titles based on language
    if (!translations[currentLang]) return;
    
    document.getElementById('gemini-title').innerText = translations[currentLang].geminiTitle;
    document.getElementById('gemini-setup-desc').innerText = translations[currentLang].geminiSetupDesc;
    document.getElementById('save-gemini-key').innerText = translations[currentLang].geminiKeySave;
    chatInput.placeholder = translations[currentLang].geminiPlaceholder;

    if (geminiApiKey) {
        geminiSetupContainer.style.display = 'none';
        geminiChatContainer.style.display = 'flex';
        
        // Load initial welcome message if chat history is empty
        if (chatHistoryContext.length === 0) {
            chatHistory.innerHTML = `
                <div class="chat-bubble model-bubble">
                    ${translations[currentLang].geminiWelcome}
                </div>
            `;
        }
    } else {
        geminiSetupContainer.style.display = 'flex';
        geminiChatContainer.style.display = 'none';
        chatHistoryContext = [];
        chatHistory.innerHTML = '';
    }
}

// Save API Key
saveGeminiKeyBtn.addEventListener('click', () => {
    const key = geminiApiKeyInput.value.trim();
    if (!key) {
        alert(translations[currentLang].geminiKeyPrompt);
        return;
    }
    
    localStorage.setItem('twilligent_gemini_key', key);
    geminiApiKey = key;
    geminiApiKeyInput.value = '';
    initGeminiUI();
});

// Setup key change/removal
geminiKeyBtn.addEventListener('click', () => {
    if (confirm(currentLang === 'no' ? "Vil du endre eller fjerne API-nøkkelen din?" : "Do you want to change or remove your API key?")) {
        localStorage.removeItem('twilligent_gemini_key');
        geminiApiKey = '';
        initGeminiUI();
        geminiApiKeyInput.focus();
    }
});

// Post query to Gemini API
async function callGeminiAPI(messageText) {
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
    
    chatHistoryContext.push({
        role: "user",
        parts: [{ text: messageText }]
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: chatHistoryContext
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    chatHistoryContext.push({
        role: "model",
        parts: [{ text: responseText }]
    });

    return responseText;
}

// Handle sending a chat message
async function handleSendMessage() {
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // 1. Add user bubble to UI
    const userBubble = document.createElement('div');
    userBubble.className = "chat-bubble user-bubble";
    userBubble.textContent = messageText;
    chatHistory.appendChild(userBubble);
    
    // Clear input & scroll
    chatInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // 2. Add loading bubble
    const loadingBubble = document.createElement('div');
    loadingBubble.className = "chat-bubble model-bubble loading-bubble";
    loadingBubble.id = "gemini-loading-bubble";
    loadingBubble.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatHistory.appendChild(loadingBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Disable inputs
    chatInput.disabled = true;
    sendChatBtn.disabled = true;

    try {
        const responseText = await callGeminiAPI(messageText);
        
        // Remove loading bubble
        loadingBubble.remove();

        // 3. Add model bubble
        const modelBubble = document.createElement('div');
        modelBubble.className = "chat-bubble model-bubble";
        modelBubble.innerHTML = formatResponseText(responseText);
        chatHistory.appendChild(modelBubble);
        
    } catch (error) {
        console.error("Chat Error:", error);
        loadingBubble.remove();

        // Add error bubble
        const errorBubble = document.createElement('div');
        errorBubble.className = "chat-bubble system-bubble";
        errorBubble.textContent = translations[currentLang].geminiError;
        chatHistory.appendChild(errorBubble);
    } finally {
        // Enable inputs
        chatInput.disabled = false;
        sendChatBtn.disabled = false;
        chatHistory.scrollTop = chatHistory.scrollHeight;
        chatInput.focus();
    }
}

// Send on click
sendChatBtn.addEventListener('click', handleSendMessage);

// Send on Enter (but Shift+Enter makes a newline)
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
// Apply initial language copy
updateLanguage(currentLang);
// Apply initial save indicator opacity control
saveStatus.style.opacity = '0';

// Initialize Gemini UI
initGeminiUI();

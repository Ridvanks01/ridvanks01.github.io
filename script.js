// EmailJS initialization - wait for EmailJS to load
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("LhKJl-1pziRqZ8Yn4");
  } else {
    // Wait for EmailJS to load
    window.addEventListener("load", () => {
      if (typeof emailjs !== "undefined") {
        emailjs.init("LhKJl-1pziRqZ8Yn4");
      }
    });
  }
})();

// ----- NAVBAR ACTIVE LINK -----
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        navLinks[0].classList.add('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if we're at the absolute bottom of the page
    const isAtBottom = Math.ceil(scrollPosition + windowHeight) >= documentHeight;
    
    // If at bottom, set contact as active
    if (isAtBottom) {
        current = 'contact';
    } else {
        // Otherwise, use the normal section detection
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ----- CONTACT FORM -----
const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      from_name: contactForm.from_name.value,
      from_email: contactForm.from_email.value,
      message: contactForm.message.value,
    };

    emailjs
      .send("service_h2ptscr", "template_n2f182o", formData)
      .then(function () {
        const successMsg =
          getNestedValue(translations[currentLanguage], "alerts.messageSent") ||
          "Message sent successfully!";
        showCustomAlert(successMsg, "success");
        contactForm.reset();
      })
      .catch(function (error) {
        const errorMsg =
          getNestedValue(
            translations[currentLanguage],
            "alerts.messageFailed"
          ) || "Oops! Something went wrong. Please try again.";
        showCustomAlert(errorMsg, "error");
        console.error("EmailJS error:", error);
      });
  });
}

function showCustomAlert(message, type) {
  const alertBox = document.createElement("div");
  alertBox.classList.add("custom-alert", type);
  alertBox.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.add("hide");
    setTimeout(() => alertBox.remove(), 300);
  }, 3000);
}

// ----- PROJECT MODAL -----
const projectCards = document.querySelectorAll(".project-card");
const modal = document.getElementById("projectModal");
const modalTitle = modal.querySelector(".modal-title");
const modalDesc = modal.querySelector(".modal-desc");
const modalImages = modal.querySelector(".modal-images");
const modalTech = modal.querySelector(".modal-tech-list");
const closeBtn = modal.querySelector(".close-btn");

if (projectCards && modal) {
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get project key from data-i18n attribute
            const titleKey = card.querySelector('.project-title')?.getAttribute('data-i18n');
            const descKey = card.querySelector('.project-desc')?.getAttribute('data-i18n');
            
            let title, desc;
            if (titleKey && translations[currentLanguage]) {
                const titleValue = getNestedValue(translations[currentLanguage], titleKey);
                if (titleValue) {
                    title = titleValue;
                } else {
                    title = card.dataset.title || '';
                }
            } else {
                title = card.dataset.title || '';
            }
            
            // Get long description from nested translations
            if (descKey && translations[currentLanguage]) {
                const descKeyLong = descKey.replace('.desc', '.descLong');
                const descValue = getNestedValue(translations[currentLanguage], descKeyLong);
                if (descValue) {
                    desc = descValue;
                } else {
                    desc = card.dataset.desc || '';
                }
            } else {
                desc = card.dataset.desc || '';
            }
            
            let tech = card.querySelector('.project-tech')?.textContent.replace(/Technologies:|Teknolojiler:|Technologien:/, '').trim() || '';
            tech = tech.replace(/^(Technologies:|Teknolojiler:|Technologien:)\s*/, '');

            let images = [];
            try {
                images = JSON.parse(card.dataset.img || '[]');
            } catch {
                images = [];
                console.warn('Invalid JSON in data-img for project:', title);
            }

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalTech.textContent = tech;
            // Update tech label based on language
            const techLabelText = getNestedValue(translations[currentLanguage], 'projects.tech') || 'Technologies:';
            modal.querySelector('.modal-tech-label').textContent = techLabelText;

            modalImages.innerHTML = '';
            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.classList.add('modal-img');
                modalImages.appendChild(img);
            });

            modal.style.display = 'block';
            modal.scrollTop = 0;
            document.body.style.overflow = 'hidden';
            document.body.style.overflowX = 'hidden';
        });
    });

    // ----- CLOSE MODAL -----
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
        }
    });
}

// ----- HAMBURGER MENU -----
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('header nav');

if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

//----- E-MAIL COPY -----
function copyEmail() {
    const emailText = document.getElementById('email_text').textContent;

    navigator.clipboard.writeText(emailText).then(() => {
        const successMsg = getNestedValue(translations[currentLanguage], 'alerts.emailCopied') || 'Email copied to clipboard!';
        showCustomAlert(successMsg, 'success');

    }).catch(err => {
        const errorMsg = getNestedValue(translations[currentLanguage], 'alerts.emailCopyFailed') || 'Failed to copy email!';
        showCustomAlert(errorMsg, 'error');
        console.error('Copy failed:', err);
    });
}

// ----- LANGUAGE SWITCH -----
let translations = {};
const loadedLanguages = new Set();

let currentLanguage = localStorage.getItem('language') || 'en';

// Language names mapping
const languageNames = {
    'en': 'EN',
    'tr': 'TR',
    'de': 'DE'
};

function toggleLanguageMenu() {
    const languageSwitch = document.querySelector('.language-switch');
    const dropdown = document.querySelector('.language-dropdown');
    if (languageSwitch) {
        const isActive = languageSwitch.classList.contains('active');
        languageSwitch.classList.toggle('active');
        
        // Enable/disable pointer events based on dropdown state
        if (dropdown) {
            if (!isActive) {
                // Opening dropdown - enable pointer events after a short delay to ensure CSS transition starts
                setTimeout(() => {
                    dropdown.style.pointerEvents = 'auto';
                }, 50);
            } else {
                // Closing dropdown - immediately disable pointer events to prevent clicks during animation
                dropdown.style.pointerEvents = 'none';
            }
        }
    }
}

// Close language menu when clicking outside
document.addEventListener('click', (e) => {
    const languageSwitch = document.querySelector('.language-switch');
    const dropdown = document.querySelector('.language-dropdown');
    if (languageSwitch && !languageSwitch.contains(e.target)) {
        languageSwitch.classList.remove('active');
        // Immediately disable pointer events when closing
        if (dropdown) {
            dropdown.style.pointerEvents = 'none';
        }
    }
});

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// Lazy load language file
async function loadLanguage(lang) {
    // If already loaded, return cached version
    if (loadedLanguages.has(lang) && translations[lang]) {
        return translations[lang];
    }

    try {
        const response = await fetch(`i18n/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${lang}.json`);
        }
        const data = await response.json();
        translations[lang] = data;
        loadedLanguages.add(lang);
        return data;
    } catch (error) {
        console.error(`Error loading language '${lang}':`, error);
        // Fallback: try to load English
        if (lang !== 'en') {
            return await loadLanguage('en');
        }
        return null;
    }
}

// Load initial language
async function loadTranslations() {
    try {
        await loadLanguage(currentLanguage);
        // Initialize language after translations are loaded
        if (currentLanguage) {
            initializeLanguage();
        }
    } catch (error) {
        console.error('Error initializing translations:', error);
    }
}

async function changeLanguage(lang) {
    // Load language if not already loaded
    await loadLanguage(lang);
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update current language display
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = languageNames[lang];
    }

    // Update dropdown button states
    document.querySelectorAll('.language-dropdown button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Close dropdown
    const languageSwitch = document.querySelector('.language-switch');
    const dropdown = document.querySelector('.language-dropdown');
    if (languageSwitch) {
        languageSwitch.classList.remove('active');
        // Immediately disable pointer events when closing
        if (dropdown) {
            dropdown.style.pointerEvents = 'none';
        }
    }

    // Close hamburger menu if open
    const hamburgerNav = document.querySelector('header nav');
    if (hamburgerNav) {
        hamburgerNav.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    // Apply translations
    applyTranslations(lang);
}

function applyTranslations(lang) {
    if (!translations[lang]) {
        console.warn(`Translations for language '${lang}' not found`);
        return;
    }

    const langData = translations[lang];

    // Update home section and home-content div with language class
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.classList.remove('lang-en', 'lang-tr', 'lang-de');
        homeSection.classList.add('lang-' + lang);
    }
    
    const homeContent = document.querySelector('.home-content');
    if (homeContent) {
        homeContent.classList.remove('lang-en', 'lang-tr', 'lang-de');
        homeContent.classList.add('lang-' + lang);
    }

    // Update navigation links and all text elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(langData, key);
        
        if (value !== null) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'TITLE') {
                document.title = value;
            } else {
                // Handle special case for home.greeting with span
                if (key === 'home.greeting') {
                    // Remove previous language classes
                    element.classList.remove('lang-en', 'lang-tr', 'lang-de');
                    // Add current language class
                    element.classList.add('lang-' + lang);
                    
                    if (lang === 'en') {
                        element.innerHTML = 'Hi, It\'s <span>Rıdvan</span>';
                    } else if (lang === 'tr') {
                        element.innerHTML = 'Merhaba, Ben <span>Rıdvan</span>';
                    } else if (lang === 'de') {
                        element.innerHTML = 'Hallo, ich bin <span>Rıdvan</span>';
                    }
                } else {
                    element.textContent = value;
                }
            }
        }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getNestedValue(langData, key);
        if (value !== null) {
            element.placeholder = value;
        }
    });

    // Update typing text
    const typingTextElement = document.querySelector('.typing-text');
    const typingTextSpan = document.querySelector('.typing-text span');
    if (typingTextElement && typingTextSpan) {
        // Remove previous language classes
        typingTextElement.classList.remove('lang-en', 'lang-tr', 'lang-de');
        // Add current language class
        typingTextElement.classList.add('lang-' + lang);
        
        let prefix;
        if (lang === 'tr') {
            prefix = 'Ben bir ';
        } else if (lang === 'de') {
            prefix = 'Ich bin ';
        } else {
            prefix = 'I\'m a ';
        }
        
        // Get typing texts from translations
        const typingTexts = getNestedValue(langData, 'home.typingTexts');
        if (typingTexts) {
            const text1 = typingTexts.text1 || 'Computer Engineer';
            const text2 = typingTexts.text2 || 'Problem Solver';
            const text3 = typingTexts.text3 || 'Late-night Coder';
            const text4 = typingTexts.text4 || 'Stack Overflow Explorer';
            
            // Update the prefix text
            const textNode = Array.from(typingTextElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = prefix;
            } else {
                typingTextElement.insertBefore(document.createTextNode(prefix), typingTextSpan);
            }
            
            // Update CSS with keyframes animation for all 4 texts
            const style = document.createElement('style');
            style.id = 'typing-text-style';
            const existingStyle = document.getElementById('typing-text-style');
            if (existingStyle) existingStyle.remove();
            
            // Escape quotes in text for CSS
            const escapeCSS = (str) => str.replace(/"/g, '\\"');
            
            style.textContent = `
                .typing-text span::before {
                    content: "${escapeCSS(text1)}";
                    color: #28a428;
                    animation: words 16s infinite;
                }
                
                @keyframes words {
                    0%, 25% {
                        content: "${escapeCSS(text1)}";
                    }
                    26%, 50% {
                        content: "${escapeCSS(text2)}";
                    }
                    51%, 75% {
                        content: "${escapeCSS(text3)}";
                    }
                    76%, 100% {
                        content: "${escapeCSS(text4)}";
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Update description paragraph with language class
    const descriptionElement = document.querySelector('[data-i18n="home.description"]');
    if (descriptionElement) {
        descriptionElement.classList.remove('lang-en', 'lang-tr', 'lang-de');
        descriptionElement.classList.add('lang-' + lang);
    }

    // Update project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const titleKey = card.querySelector('.project-title')?.getAttribute('data-i18n');
        const descKey = card.querySelector('.project-desc')?.getAttribute('data-i18n');
        
        if (titleKey) {
            const titleValue = getNestedValue(langData, titleKey);
            if (titleValue !== null) {
                card.querySelector('.project-title').textContent = titleValue;
            }
        }
        if (descKey) {
            const descValue = getNestedValue(langData, descKey);
            if (descValue !== null) {
                card.querySelector('.project-desc').textContent = descValue;
            }
        }
    });

    // Update CV and Portfolio download links based on language
    updateDownloadLinks(lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Update CV and Portfolio download links based on language
function updateDownloadLinks(lang) {
    // Map language codes to file name suffixes
    const langSuffixes = {
        'en': 'english',
        'tr': 'turkce',
        'de': 'deutsch'
    };

    // Map language codes to portfolio file name (Turkish uses "portfolyo")
    const portfolioNames = {
        'en': 'portfolio',
        'tr': 'portfolyo',
        'de': 'portfolio'
    };

    const suffix = langSuffixes[lang] || 'english';
    const portfolioName = portfolioNames[lang] || 'portfolio';
    const basePath = 'assets/cv_portfolio/';

    // Update CV download link
    const cvLink = document.getElementById('downloadCV');
    if (cvLink) {
        cvLink.href = `${basePath}ridvan_karasubasi_${suffix}_cv.pdf`;
    }

    // Update Portfolio download link
    const portfolioLink = document.getElementById('downloadPortfolio');
    if (portfolioLink) {
        portfolioLink.href = `${basePath}ridvan_karasubasi_${suffix}_${portfolioName}.pdf`;
    }
}

// Initialize language on page load
function initializeLanguage() {
    // Set initial language display
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = languageNames[currentLanguage];
    }
    // Set active state for dropdown
    document.querySelectorAll('.language-dropdown button').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
    // Ensure dropdown is closed and pointer events are disabled initially
    const languageSwitch = document.querySelector('.language-switch');
    const dropdown = document.querySelector('.language-dropdown');
    if (languageSwitch) {
        languageSwitch.classList.remove('active');
    }
    if (dropdown) {
        dropdown.style.pointerEvents = 'none';
    }
    // Apply translations
    applyTranslations(currentLanguage);
}

// Load translations when page loads
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTranslations);
} else {
    loadTranslations();
}
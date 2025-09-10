// DOM Elements
const coverPage = document.getElementById('cover-page');
const mainContent = document.getElementById('main-content');
const openCardBtn = document.getElementById('open-card');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const coverIllustration = document.querySelector('.cover-illustration');

// Wedding date (update this to your actual wedding date)
const weddingDate = new Date('2024-06-15T16:00:00');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cover page functionality
    openCardBtn.addEventListener('click', openInvitation);

    // Hide cover illustration gracefully if missing
    if (coverIllustration) {
        coverIllustration.addEventListener('error', () => {
            coverIllustration.style.display = 'none';
        });
    }
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Initialize countdown timer
    startCountdown();
    
    // Initialize RSVP form
    initializeRSVPForm();
    
    // Initialize guestbook
    initializeGuestbook();
    
    // Initialize calendar integration
    initializeCalendarIntegration();
    
    // Load saved data
    loadSavedData();
}

// Cover page - Open invitation with slide-up transition
function openInvitation() {
    // Ensure main content is shown beneath
    mainContent.classList.add('active');

    // Trigger slide-up on the cover
    coverPage.classList.add('cover-slide-up');

    // After transition, hide cover from layout
    const cleanup = () => {
        coverPage.classList.remove('active');
        coverPage.style.display = 'none';
        coverPage.removeEventListener('transitionend', cleanup);
    };
    coverPage.addEventListener('transitionend', cleanup);
}

// Navigation functionality
function handleNavigation(e) {
    e.preventDefault();
    const targetSection = e.target.getAttribute('data-section');
    
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show target section
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
    }
}

// Countdown Timer
function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;
        
        if (distance < 0) {
            // Wedding has passed
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// RSVP Form functionality
function initializeRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(rsvpForm);
        const rsvpData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            attendance: formData.get('attendance'),
            dietary: formData.get('dietary'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        // Save RSVP data
        saveRSVPData(rsvpData);
        
        // Show success message
        showNotification('Thank you for your RSVP! We look forward to celebrating with you.', 'success');
        
        // Reset form
        rsvpForm.reset();
    });
}

// Guestbook functionality
function initializeGuestbook() {
    const guestbookForm = document.getElementById('guestbook-form');
    const messagesContainer = document.getElementById('guestbook-messages');
    
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(guestbookForm);
        const messageData = {
            name: formData.get('guest-name'),
            message: formData.get('guest-message'),
            timestamp: new Date().toISOString()
        };
        
        // Save guestbook message
        saveGuestbookMessage(messageData);
        
        // Add message to display
        addMessageToDisplay(messageData);
        
        // Show success message
        showNotification('Thank you for your message! It has been added to our guestbook.', 'success');
        
        // Reset form
        guestbookForm.reset();
    });
    
    // Load existing messages
    loadGuestbookMessages();
}

function addMessageToDisplay(messageData) {
    const messagesContainer = document.getElementById('guestbook-messages');
    const messageElement = createMessageElement(messageData);
    messagesContainer.insertBefore(messageElement, messagesContainer.firstChild);
}

function createMessageElement(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guestbook-message';
    
    const date = new Date(messageData.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <h4>${escapeHtml(messageData.name)}</h4>
        <p>${escapeHtml(messageData.message)}</p>
        <div class="timestamp">${formattedDate}</div>
    `;
    
    return messageDiv;
}

function loadGuestbookMessages() {
    const messages = getGuestbookMessages();
    const messagesContainer = document.getElementById('guestbook-messages');
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
}

// Calendar Integration
function initializeCalendarIntegration() {
    const googleCalendarBtn = document.getElementById('google-calendar');
    const outlookCalendarBtn = document.getElementById('outlook-calendar');
    const appleCalendarBtn = document.getElementById('apple-calendar');
    
    const eventDetails = {
        title: 'D&F Wedding',
        description: 'Join us for our special day!',
        location: 'Garden Paradise Resort, 123 Love Lane, Romance City, RC 12345',
        startDate: '20240615T160000',
        endDate: '20240615T220000'
    };
    
    googleCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(googleUrl, '_blank');
    });
    
    outlookCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.startDate}&enddt=${eventDetails.endDate}&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(outlookUrl, '_blank');
    });
    
    appleCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // For Apple Calendar, we'll create an .ics file
        createICSFile(eventDetails);
    });
}

function createICSFile(eventDetails) {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventDetails.startDate.replace(/[-:]/g, '')}Z
DTEND:${eventDetails.endDate.replace(/[-:]/g, '')}Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'D&F-Wedding.ics';
    link.click();
    window.URL.revokeObjectURL(url);
}

// Data Storage Functions
function saveRSVPData(data) {
    const existingData = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    existingData.push(data);
    localStorage.setItem('weddingRSVPs', JSON.stringify(existingData));
}

function getRSVPData() {
    return JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
}

function saveGuestbookMessage(message) {
    const existingMessages = JSON.parse(localStorage.getItem('weddingGuestbook') || '[]');
    existingMessages.push(message);
    localStorage.setItem('weddingGuestbook', JSON.stringify(existingMessages));
}

function getGuestbookMessages() {
    return JSON.parse(localStorage.getItem('weddingGuestbook') || '[]');
}

function loadSavedData() {
    // Load any saved data on page load
    const rsvpData = getRSVPData();
    const guestbookMessages = getGuestbookMessages();
    
    console.log('Loaded RSVP data:', rsvpData.length, 'responses');
    console.log('Loaded guestbook messages:', guestbookMessages.length, 'messages');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some sample guestbook messages for demonstration
function addSampleMessages() {
    const sampleMessages = [
        {
            name: "Sarah & Mike",
            message: "Congratulations on your special day! We're so excited to celebrate with you both. Wishing you a lifetime of love and happiness! 💕",
            timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
            name: "Grandma Rose",
            message: "My dearest grandchildren, seeing you both so happy together brings tears of joy to my eyes. May your love grow stronger with each passing year.",
            timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
            name: "The Johnson Family",
            message: "We're thrilled to be part of your celebration! Your love story is truly inspiring. Here's to many years of happiness together! 🥂",
            timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        }
    ];
    
    // Only add sample messages if no messages exist
    if (getGuestbookMessages().length === 0) {
        sampleMessages.forEach(message => {
            saveGuestbookMessage(message);
        });
        loadGuestbookMessages();
    }
}

// Initialize sample messages
addSampleMessages();

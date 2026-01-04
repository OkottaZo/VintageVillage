// dark-mode.js - Simple Dark Mode for All Pages

console.log('=== VINTAGE VILLAGE DARK MODE ===');

function initializeDarkMode() {
    console.log('Initializing dark mode...');
    
    // Get toggle button
    const toggleBtn = document.getElementById('dark-mode-toggle');
    
    if (!toggleBtn) {
        console.warn('Dark mode toggle button not found on this page');
        return;
    }
    
    console.log('Toggle button found:', toggleBtn);
    
    // Check current state
    const isDarkMode = localStorage.getItem('vintageVillageDarkMode') === 'true';
    console.log('Current dark mode state:', isDarkMode);
    
    // Apply initial state
    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    }
    
    // Add click event
    toggleBtn.addEventListener('click', function() {
        console.log('Dark mode toggle clicked!');
        
        const html = document.documentElement;
        const isCurrentlyDark = html.classList.contains('dark-mode');
        
        if (isCurrentlyDark) {
            // Switch to LIGHT mode
            html.classList.remove('dark-mode');
            this.textContent = '🌙';
            this.setAttribute('aria-label', 'Switch to dark mode');
            localStorage.setItem('vintageVillageDarkMode', 'false');
            console.log('Switched to LIGHT mode');
        } else {
            // Switch to DARK mode
            html.classList.add('dark-mode');
            this.textContent = '☀️';
            this.setAttribute('aria-label', 'Switch to light mode');
            localStorage.setItem('vintageVillageDarkMode', 'true');
            console.log('Switched to DARK mode');
        }
    });
    
    console.log('Dark mode initialized successfully!');
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
        
        console.log('Cart count updated:', cartCount);
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up dark mode...');
    initializeDarkMode();
    updateCartCount();
});

// Make functions available globally
window.toggleDarkMode = function() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) toggleBtn.click();
};
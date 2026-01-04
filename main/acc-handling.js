function applyAuthUI() {
    const name = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    console.log("Detecting user:", name, "Role:", role);

    // Get elements
    const loginItem = document.getElementById('login-item');
    const signupItem = document.getElementById('signup-item');
    const profileItem = document.getElementById('profile-item');
    const logoutItem = document.getElementById('logout-item');
    const adminItem = document.getElementById('admin-item');
    const nameDisplay = document.getElementById('username-display');

    if (name && name !== "null") {
        // Logged in: Hide guest buttons
        if (loginItem) loginItem.style.display = 'none';
        if (signupItem) signupItem.style.display = 'none';

        // Show user buttons
        if (profileItem) profileItem.style.display = 'block';
        if (logoutItem) logoutItem.style.display = 'block';
        if (nameDisplay) nameDisplay.innerText = name;

        // Admin only
        if (role === 'admin' && adminItem) {
            adminItem.style.display = 'block';
        }
    } else {
        // Logged out: Show guest buttons
        if (loginItem) loginItem.style.display = 'block';
        if (signupItem) signupItem.style.display = 'block';
        
        if (profileItem) profileItem.style.display = 'none';
        if (logoutItem) logoutItem.style.display = 'none';
        if (adminItem) adminItem.style.display = 'none';
    }
}

// Run immediately
document.addEventListener('DOMContentLoaded', applyAuthUI);
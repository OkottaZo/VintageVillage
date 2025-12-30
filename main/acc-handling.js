document.addEventListener('DOMContentLoaded', function() {
        // 1. Double check the variable in the console
    console.log("Checking login status...", window.loggedInUser);

    if (window.loggedInUser !== null) {
        // 2. Hide Guest Items
        const loginItem = document.getElementById('login-item');
        const signupItem = document.getElementById('signup-item');
        
        if (loginItem) loginItem.style.setProperty('display', 'none', 'important');
        if (signupItem) signupItem.style.setProperty('display', 'none', 'important');

        // 3. Show User Items
        const profileItem = document.getElementById('profile-item');
        const logoutItem = document.getElementById('logout-item');
        
        if (profileItem) profileItem.style.display = 'block';
        if (logoutItem) logoutItem.style.display = 'block';

        // 4. Update Username Text
        const nameDisplay = document.getElementById('username-display');
        if (nameDisplay) {
            nameDisplay.innerText = "Hello, " + window.loggedInUser;
        }
    }
});
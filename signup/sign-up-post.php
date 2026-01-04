<?php
session_start();

function sanitize_input($input){
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

$userEmail = sanitize_input($_POST['email']);
$userName = sanitize_input($_POST['username']); 
$password = trim($_POST['password']);

if(!empty($userEmail) && !empty($userName) && !empty($password)){
    
    if(strlen($password) >= 6) {
        // 1. Set PHP Sessions (For server-side security)
        $_SESSION['username'] = $userName; 
        $_SESSION['email'] = $userEmail;
        $_SESSION['role'] = "user";

        // 2. The JavaScript "Bridge"
        // We use this because we NEED to save to LocalStorage before leaving
        echo "
        <script>
            // A. Get existing users list
            let users = JSON.parse(localStorage.getItem('villageUsers')) || [];

            // B. Add this new user to the array
            users.push({
                name: '$userName',
                email: '$userEmail',
                role: 'user'
            });

            // C. Save back to LocalStorage (This makes them appear in Admin Panel)
            localStorage.setItem('villageUsers', JSON.stringify(users));

            // D. Set current login status for the Navbar
            localStorage.setItem('username', '$userName');
            localStorage.setItem('userRole', 'user');

            // E. Redirect via JavaScript (DO NOT USE PHP HEADER HERE)
            window.location.href = '../main/main.php';
        </script>";
        exit(); // Stop PHP from doing anything else

    } else {
        echo '<div style="text-align:center; margin-top:50px; font-family:sans-serif;">
                <h2 style="color:red;">Password too short!</h2>
                <button onclick="history.back()">Try Again</button>
              </div>';
    }
}
// DELETE THE EXTRA LINES THAT WERE HERE BEFORE
?>
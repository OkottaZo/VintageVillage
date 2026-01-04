<?php
session_start();

// Get your form data
$user = $_POST['username'];
$pass = $_POST['password'];

if ($user === "admin@website.com" && $pass === "admin1234") {
    $_SESSION['username'] = "Admin";
    $_SESSION['email'] = "admin@website.com";
    
    // This JS forces the browser to remember the admin BEFORE redirecting
    echo "<script>
        localStorage.setItem('username', 'Admin');
        localStorage.setItem('userRole', 'admin');
        window.location.href = '../main/main.php';
    </script>";
} else {
    // Regular user logic
    $_SESSION['username'] = $user;
    $_SESSION['email'] = $user;
    
    echo "<script>
        localStorage.setItem('username', '$user');
        localStorage.setItem('userRole', 'user');
        window.location.href = '../main/main.php';
    </script>";
}
?>
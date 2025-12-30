<?php
// This must be the very first line
session_start(); 

// Clear all session variables
session_unset(); 

// Destroy the session data on the server
session_destroy(); 

// Redirect the user back to the home page
header("Location: ../main/main.php");
exit();
?>

<?php
require_once('sign-up.html');
function sanitize_input($input){
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}
$username = sanitize_input($_POST['username']);
$email = sanitize_input($_POST['email']);
$password = trim($_POST['password']);
if(!empty($password) && !empty($username) && !empty($email) ){
    if(strlen($password)>=6){
        header('Location: ../main/main.php');
        exit();
    }else {
         // --- THIS IS THE UPDATED PART ---
        echo '
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffe6e6; 
            color: #d8000c;
            border: 1px solid #cc0000;
            padding: 20px 40px;
            font-family: sans-serif;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h3 style="margin-top: 0;">Error</h3>
            <p>Password is too short</p>
            
            <button onclick="history.back()" style="
                padding: 8px 16px; 
                cursor: pointer;
                background: #fff;
                border: 1px solid #999;
                border-radius: 4px;
            ">Go Back</button>
        </div>';
        // ----------------------
    }
}

?>
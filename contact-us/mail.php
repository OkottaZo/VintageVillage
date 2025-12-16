<?php
function sanitize_input($input)
{
    $input = trim($input);
    $input = strip_tags($input);
    return $input;
}

function main()
{

$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === ''){
    echo 'All fields are required !';
    return;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    echo 'Invalid email.';
    return;
}

$to = 'support@vintagevillage.com';
$subject = 'New Contact Message - Vintage Village';

$body = "Full Name : $name\n";
$body .= "Email: $email \n\n";
$body .= "Message:\n$message";

$headers  = "From: no-reply@vintagevillage.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8";
mail($to, $subject, $message, $headers);

header('Location: thanks.html');
}

main();

?>
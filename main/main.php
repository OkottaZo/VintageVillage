<?php
session_start();

// Prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Session variables set at login/signup
$currentUser = $_SESSION['username'] ?? null;
$currentEmail = $_SESSION['email'] ?? null;
$currentRole = $_SESSION['role'] ?? 'user';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vintage Village</title>
<link rel="icon" href="../Images/Favicon2023-728352333 (1).jpg">
<link rel="stylesheet" href="main.css">

<script>
    // 1. Get PHP session data
    const currentName = <?php echo json_encode($currentUser); ?>;
    const currentEmail = <?php echo json_encode($currentEmail); ?>;
    const currentRole = <?php echo json_encode($currentRole); ?>;

    // 2. Sync logged-in user to Admin Panel storage
    if (currentName && currentEmail) {
        let users = JSON.parse(localStorage.getItem('villageUsers')) || [];

        const exists = users.some(u => u.email === currentEmail);

        if (!exists) {
            users.push({
                name: currentName,
                email: currentEmail,
                role: currentEmail === "admin@website.com" ? "admin" : "user"
            });
            localStorage.setItem('villageUsers', JSON.stringify(users));
            console.log("User synced to Admin Panel successfully.");
        }
    }

    // 3. Update Navbar UI based on LocalStorage
    window.onload = function() {
        const storedName = localStorage.getItem("username") || currentName;
        const storedRole = localStorage.getItem("userRole") || currentRole;

        if (storedName) {
            document.getElementById('login-item').style.display = 'none';
            document.getElementById('signup-item').style.display = 'none';
            document.getElementById('profile-item').style.display = 'block';
            document.getElementById('logout-item').style.display = 'block';
            document.getElementById('username-display').innerText = storedName;

            if (storedRole === "admin") {
                document.getElementById('admin-item').style.display = 'block';
                console.log("Logged in as Admin");
            }

            // Save back to LocalStorage to persist role & name
            localStorage.setItem('username', storedName);
            localStorage.setItem('userRole', storedRole);
        }
    };
</script>
</head>
<body>
<nav>
    <div>
        <a href="../main/main.php"><img src="../Images/Favicon2023-728352333 (1).jpg" alt="LbaL.com"></a>
        <ul>
            <li><a href="">Women</a></li>
            <li><a href="">Men</a></li>
            <li><a href="">Kids</a></li>
            <li id="admin-item" style="display: none;">
                <a class="usernav" href="../admin/admin.php" style="color: #ff4d4d; font-weight: bold;">ADMIN PANEL</a>
            </li>
            <li id="login-item"><a class="usernav" id="loginbutt" href="../login/login.html">Login</a></li>
            <li id="signup-item"><a class="usernav" href="../signup/sign-up.html">Sign-up</a></li>
            <li id="profile-item" style="display: none;">
                <a class="usernav" href="../profile/profile.php">
                    <span id="username-display" style="color: #d4af37; font-weight: bold;"></span>
                </a>
            </li>
            <li id="logout-item" style="display: none;">
                <a class="usernav" href="../logout/logout.php" onclick="localStorage.clear();">Logout</a>
            </li>
        </ul>
    </div>
</nav>
    <div class="hero-banner">
        <img src="../Images/Gemini_Generated_Image_5ox0ky5ox0ky5ox0.png" alt="Vintage Village Storefront">
        <a href="#shop-start" class="explore-btn">Explore Collection</a>
    </div>

    <div class="how-it-works">
        <h2>HOW IT WORKS</h2>
        <div class="toggle-buttons">
            <button class="tab-btn active" onclick="showTab('buyer')">I AM A BUYER</button>
            <button class="tab-btn" onclick="showTab('seller')">I AM A SELLER</button>
        </div>
        
        <div class="content">
            <div class="tab-content active" id="buyer-tab">
                <div class="step">
                    <div class="image-placeholder buyer-img-1"></div>
                    <h3>FIND YOUR STYLE</h3>
                    <p>Discover items at prices up to 70% off.</p>
                </div>
                <div class="step">
                    <div class="image-placeholder buyer-img-2"></div>
                    <h3>FOLLOW TRENDS</h3>
                    <p>Follow your favorite closets and brands.</p>
                </div>
            </div>
            
            <div class="tab-content" id="seller-tab">
                <div class="step">
                    <div class="image-placeholder seller-img-1"></div>
                    <h3>LIST IT</h3>
                    <p>Snap a photo and list it in less than 60 seconds.</p>
                </div>
                <div class="step">
                    <div class="image-placeholder seller-img-2"></div>
                    <h3>EARN CASH</h3>
                    <p>Shipping is easy with our prepaid labels.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="shop-container" id="shop-start">
        <div class="shop-box men" onclick="window.location.href='../shop/shop.php'"><span>SHOP MEN'S</span></div>
        <div class="shop-box women" onclick="window.location.href='../shop/shop.php'"><span>SHOP WOMEN'S</span></div>
        <div class="shop-box kids" onclick="window.location.href='../shop/shop.php'"><span>SHOP KIDS</span></div>
        <div class="shop-box accessories" onclick="window.location.href='../shop/shop.php'"><span>SHOP ACCESSORIES</span></div>
    </div>

    <footer class="main-footer">
        <div class="footer-content">
            <div class="footer-section contact">
                <h3>CONTACT US</h3>
                <p>Email: support@vintagevillage.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 Vintage Village. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // 3. TAB TOGGLE FUNCTION
        function showTab(tabName) {
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabName + '-tab').classList.add('active');
            
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        // 4. UI UPDATE: This runs every time the page loads
        window.onload = function() {
            const storedName = localStorage.getItem("username");
            const storedRole = localStorage.getItem("userRole");

            if (storedName) {
                // Hide Login and Signup
                document.getElementById('login-item').style.display = 'none';
                document.getElementById('signup-item').style.display = 'none';

                // Show Profile, Logout, and the Username
                document.getElementById('profile-item').style.display = 'block';
                document.getElementById('logout-item').style.display = 'block';
                document.getElementById('username-display').innerText = storedName;

                // SPECIAL CHECK: If the role is admin, show the admin panel link
                if (storedRole === "admin") {
                    document.getElementById('admin-item').style.display = 'block';
                    console.log("Logged in as Admin");
                }
            }
        };
    </script>
<script src="auth-check.js"></script>
</body>
</html>
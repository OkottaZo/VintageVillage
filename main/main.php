<?php
session_start();

// Prevent the browser from caching this page
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Check if the user is logged in for the JS bridge
$currentUser = isset($_SESSION['username']) ? $_SESSION['username'] : null;
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
    // This creates the variable that your external JS file will use
    window.loggedInUser = <?php echo json_encode($currentUser); ?>;
    
    // Safety check: If the user just logged out, ensure the guest buttons show immediately
    if (window.loggedInUser === null) {
        console.log("Status: Guest");
    } else {
        console.log("Status: Logged in as " + window.loggedInUser);
    }
</script>
</head>
<body>
   <nav>
    <div>
        <a href="../main/main.php">
            <img src="../Images/Favicon2023-728352333 (1).jpg" alt="LbaL.com">
        </a>
        <ul>
            <li><a href="">Women</a></li>
            <li><a href="">Men</a></li>
            <li><a href="">Kids</a></li>
            <li><a href="">Accessories</a></li>

            <li id="login-item">
                <a class="usernav" id="loginbutt" href="../login/login.html">Login</a>
            </li>
            <li id="signup-item">
                <a class="usernav" href="../signup/sign-up.html">Sign-up</a>
            </li>

            <li id="profile-item" style="display: none;">
                <a class="usernav" href="../profile/profile.php">
                    <span id="username-display" style="color: #d4af37; font-weight: bold;"></span>
                </a>
            </li>
            <li id="logout-item" style="display: none;">
                <a class="usernav" href="../logout/logout.php">Logout</a>
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
            <!-- Buyer Content -->
            <div class="tab-content active" id="buyer-tab">
                <div class="step">
                    <div class="image-placeholder buyer-img-1"></div>
                    <h3>FIND YOUR STYLE</h3>
                    <p>Discover a wide selection of items across thousands of brands, styles, sizes, and trends—at prices up to 70% off.</p>
                </div>
                <div class="step">
                    <div class="image-placeholder buyer-img-2"></div>
                    <h3>Embrace the mode that sets the tone of the times</h3>
                    <p>Be the first to see what's new by following your favorite closets and brands. Like listings to save them and get notified of special offers and discounts.</p>
                </div>
                <div class="step">
                    <div class="image-placeholder buyer-img-3"></div>
                    <h3>SCORE DEALS</h3>
                    <p>There are so many new deals to uncover every day. Make an offer and name your price, or join the fun and place a bid on a live show auction—starting as low as $3!</p>
                </div>
            </div>
            
            <!-- Seller Content -->
            <div class="tab-content" id="seller-tab">
                <div class="step">
                    <div class="image-placeholder seller-img-1"></div>
                    <h3>LIST IT</h3>
                    <p>Closet full of clothes you never wear? Snap a photo, price it, and list it in less than 60 seconds—right from your phone!</p>
                </div>
                <div class="step">
                    <div class="image-placeholder seller-img-2"></div>
                    <h3>SHARE IT</h3>
                    <p>Share listings with your followers and use daily themed Posh Parties to help shoppers discover your listings! More sharing = more sales.</p>
                </div>
                <div class="step">
                    <div class="image-placeholder seller-img-3"></div>
                    <h3>EARN CASH</h3>
                    <p>Shipping is easy with our prepaid labels, and you'll earn cash once the item is delivered!</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Update button states
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }
    </script>
    <div class="shop-container" id="shop-start">
        <div class="shop-box men" onclick="window.location.href='../shop/shop.html'">
            <span>SHOP MEN'S</span>
        </div>
        
        <div class="shop-box women" onclick="window.location.href='../shop/shop.html'">
            <span>SHOP WOMEN'S</span>
        </div>
        
        <div class="shop-box kids" onclick="window.location.href='../shop/shop.html'">
            <span>SHOP KIDS</span>
        </div>
        
        <div class="shop-box accessories" onclick="window.location.href='../shop/shop.html'">
            <span>SHOP ACCESSORIES</span>
        </div>
    </div>
    <footer class="main-footer">
        <div class="footer-content">
            <div class="footer-section categories">
                <h3>SHOP CATEGORIES</h3>
                <ul>
                    <li><a href="#">Women</a></li>
                    <li><a href="#">Men</a></li>
                    <li><a href="#">Kids</a></li>
                    <li><a href="#">Accessories</a></li>
                </ul>
            </div>
            
            <div class="footer-section contact">
                <h3>CONTACT US</h3>
                <div class="contact-info">
                    <p>Email: support@vintagevillage.com</p>
                    <p>Phone: +1 (800) 123-4567</p>
                </div>
            </div>
            
            <div class="footer-section newsletter">
                <h3>STAY UPDATED</h3>
                <p>Subscribe to our newsletter for latest trends and deals</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Your email address" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <div class="copyright">
                    <p>© 2025 Vintage Village. All rights reserved.</p>
                    <div class="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="../contact-us/contact.html">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script> 
        const loggedinUser = <?php echo json_encode($_SESSION['username']); ?>;
    </script>
    <script src="acc-handling.js"></script>
</body>
</html>
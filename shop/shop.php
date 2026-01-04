<?php
session_start();
// Check if the user is logged in
$currentUser = isset($_SESSION['username']) ? $_SESSION['username'] : null;
$currentEmail = isset($_SESSION['email']) ? $_SESSION['email'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="shop.css">
    <title>Vintage Village Shop</title>
    <script>
    // If PHP sees a session, make sure LocalStorage matches it
    const phpUser = <?php echo json_encode($currentUser); ?>;
    const phpEmail = <?php echo json_encode($currentEmail); ?>;

    if (phpUser) {
        localStorage.setItem("username", phpUser);
        if (phpEmail === "admin@website.com") {
            localStorage.setItem("userRole", "admin");
        } else {
            localStorage.setItem("userRole", "user");
        }
    }
</script>
</head>
<body>
   <nav>
    <div>
        <a href="../main/main.php">
            <img src="../Images/Favicon2023-728352333 (1).jpg" alt="Vintage Village">
        </a>
        <ul>
            <li><a href="">Women</a></li>
            <li><a href="">Men</a></li>
            <li><a href="">Kids</a></li>
            <li><a href="">Accessories</a></li>

            <li id="admin-item" style="display: none;">
                <a class="usernav" href="../admin/dashboard.php" style="color: #ff4d4d; font-weight: bold;">ADMIN PANEL</a>
            </li>

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
                <a class="usernav" href="../logout/logout.php" onclick="localStorage.clear();">Logout</a>
            </li>
        </ul>

        <button id="add-product-btn" class="add-product-btn" onclick="window.location.href='../addproduct/addproduct.html'">
            Add Product
        </button>
    </div>
</nav>

    <!-- Main Container -->
    <div class="container">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
            <div class="filter-section">
                <div class="filter-title">CATEGORIES</div>
                <ul class="category-list">
                    <li class="category-item active" onclick="toggleCategory(this)">
                        <span>Men's Clothing</span>
                        <span class="arrow">▶</span>
                        <ul class="subcategory-list">
                            <li class="subcategory-item">Shirts</li>
                            <li class="subcategory-item">T-Shirts</li>
                            <li class="subcategory-item">Jeans</li>
                            <li class="subcategory-item">Jackets</li>
                            <li class="subcategory-item">Boots</li>
                            <li class="subcategory-item">Accessories</li>
                        </ul>
                    </li>
                    <li class="category-item" onclick="toggleCategory(this)">
                        <span>Women's Clothing</span>
                        <span class="arrow">▶</span>
                        <ul class="subcategory-list">
                            <li class="subcategory-item">Dresses</li>
                            <li class="subcategory-item">Tops</li>
                            <li class="subcategory-item">Jeans</li>
                            <li class="subcategory-item">Jackets</li>
                            <li class="subcategory-item">Shoes</li>
                            <li class="subcategory-item">Bags</li>
                        </ul>
                    </li>
                    <li class="category-item" onclick="toggleCategory(this)">
                        <span>Kids' Clothing</span>
                        <span class="arrow">▶</span>
                        <ul class="subcategory-list">
                            <li class="subcategory-item">Boys</li>
                            <li class="subcategory-item">Girls</li>
                            <li class="subcategory-item">Baby</li>
                            <li class="subcategory-item">Shoes</li>
                            <li class="subcategory-item">Accessories</li>
                        </ul>
                    </li>
                    <li class="category-item" onclick="toggleCategory(this)">
                        <span>Accessories</span>
                        <span class="arrow">▶</span>
                        <ul class="subcategory-list">
                            <li class="subcategory-item">Watches</li>
                            <li class="subcategory-item">Sunglasses</li>
                            <li class="subcategory-item">Belts</li>
                            <li class="subcategory-item">Hats</li>
                            <li class="subcategory-item">Bags</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="filter-section">
                <div class="filter-title">FILTER BY</div>
                <ul class="category-list">
                    <li class="category-item">
                        <span>Price Range</span>
                        <span class="arrow">▶</span>
                    </li>
                    <li class="category-item">
                        <span>Size</span>
                        <span class="arrow">▶</span>
                    </li>
                    <li class="category-item">
                        <span>Color</span>
                        <span class="arrow">▶</span>
                    </li>
                    <li class="category-item">
                        <span>Brand</span>
                        <span class="arrow">▶</span>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Product Grid -->
        <main class="product-grid">
            <div class="grid-header">
                <h2>Showing 8 products</h2>
            </div>

            <div class="products">
                <!-- Product 1 -->
                <div class="product-card" data-id="1">
                    <div class="product-image">
                        <img src="../Images/Guns n Roses shirt.png" alt="Guns N Roses T-shirt">
                        <div class="limited-badge">Limited</div>
                    </div>
                    <div class="product-info">
                        <div class="product-title">Guns N Roses T-shirt</div>
                        <div class="price-container">
                            <span class="current-price">$300.00</span>
                        </div>
                        <div class="shop-deal">Shop T-Shirts deals</div>
                    </div>
                </div>

                <!-- Product 2 -->
                <div class="product-card" data-id="2">
                    <div class="product-image">
                        <img src="../Images/nirvana shirt.png" alt="Nirvana T-shirt">
                        <div class="limited-badge">Limited</div>
                    </div>
                    <div class="product-info">
                        <div class="product-title">Nirvana T-shirt</div>
                        <div class="price-container">
                            <span class="current-price">$300.00</span>
                        </div>
                        <div class="shop-deal">Shop T-Shirts deals</div>
                    </div>
                </div>

                <!-- Dynamic products will be added here by JavaScript -->
            </div>
        </main>
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
        // Toggle category expansion
        function toggleCategory(element) {
            // Close all other categories
            document.querySelectorAll('.category-item').forEach(item => {
                if (item !== element) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current category
            element.classList.toggle('active');
        }

        // Select subcategory
        document.querySelectorAll('.subcategory-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering parent click
                
                // Remove active from all subcategories
                document.querySelectorAll('.subcategory-item').forEach(subItem => {
                    subItem.classList.remove('active');
                });
                
                // Add active to clicked subcategory
                this.classList.add('active');
            });
        });
    </script>
    <script src="../productmanager/productmanager.js"></script>
<script src="acc-handling.js"></script>
</body>
</html>
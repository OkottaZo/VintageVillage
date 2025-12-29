// product.js - Product Detail Page Functionality - UPDATED PATHS

// ============================================
// 1. DOM SELECTION FUNCTIONS
// ============================================

function getElement(id) {
    return document.getElementById(id);
}

function query(selector) {
    return document.querySelector(selector);
}

function queryAll(selector) {
    return document.querySelectorAll(selector);
}

// ============================================
// 2. GET PRODUCT ID FROM URL
// ============================================

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    return productId ? parseInt(productId) : null;
}

// ============================================
// 3. LOAD PRODUCT DETAILS
// ============================================

function loadProductDetails() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        alert('Product not found');
        window.location.href = '../shop/shop.html';  // Go from product folder to shop folder
        return;
    }
    
    // Get all products from localStorage
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        window.location.href = '../shop/shop.html';  // Go from product folder to shop folder
        return;
    }
    
    // Update page title
    document.title = `${product.name} - Vintage Village`;
    
    // Update breadcrumb
    const category = getCategoryName(product.category);
    getElement('product-category').textContent = category;
    getElement('product-name-breadcrumb').textContent = product.name;
    
    // Update main image - FIX PATH IF NEEDED
    const mainImage = getElement('product-main-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;
    
    // If images aren't loading, try fixing the path
    if (!product.image || product.image === '') {
        mainImage.src = '../Images/Guns n Roses shirt.png'; // Default image
    }
    
    // Update product info
    getElement('product-title').textContent = product.name;
    getElement('product-price').textContent = `$${product.price.toFixed(2)}`;
    getElement('product-description-text').textContent = product.description || 'No description available.';
    
    // Update category in details
    getElement('detail-category').textContent = category;
    
    // Update stock info
    const stockCount = getElement('stock-count');
    if (product.quantity) {
        if (product.quantity > 100) {
            stockCount.textContent = '100+ items available';
        } else if (product.quantity > 10) {
            stockCount.textContent = `${product.quantity} items available`;
        } else if (product.quantity > 0) {
            stockCount.textContent = `Only ${product.quantity} left in stock`;
            getElement('stock-status').textContent = 'Low Stock';
            getElement('stock-status').style.color = '#FFA500';
        } else {
            getElement('stock-status').textContent = 'Out of Stock';
            getElement('stock-status').style.color = '#ff4444';
            stockCount.textContent = 'Currently unavailable';
        }
    }
    
    // Add limited badge if applicable
    if (product.limited) {
        const productHeader = query('.product-header');
        const limitedBadge = document.createElement('div');
        limitedBadge.className = 'limited-badge';
        limitedBadge.textContent = 'LIMITED EDITION';
        limitedBadge.style.display = 'inline-block';
        limitedBadge.style.marginLeft = '10px';
        limitedBadge.style.backgroundColor = '#000';
        limitedBadge.style.color = 'white';
        limitedBadge.style.padding = '3px 8px';
        limitedBadge.style.borderRadius = '3px';
        limitedBadge.style.fontSize = '0.8rem';
        limitedBadge.style.fontWeight = 'bold';
        productHeader.appendChild(limitedBadge);
    }
    
    // Load related products
    loadRelatedProducts(productId, product.category);
    
    // Setup event listeners
    setupEventListeners(product);
}

// ============================================
// 4. GET CATEGORY NAME
// ============================================

function getCategoryName(categoryCode) {
    const categories = {
        'men': "Men's Clothing",
        'women': "Women's Clothing",
        'kids': "Kids' Clothing",
        'accessories': "Accessories"
    };
    
    return categories[categoryCode] || 'Clothing';
}

// ============================================
// 5. LOAD RELATED PRODUCTS
// ============================================

function loadRelatedProducts(currentProductId, category) {
    const relatedContainer = getElement('related-products');
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    
    // Filter products: same category, not the current product, limit to 4
    const relatedProducts = products.filter(p => 
        p.category === category && 
        p.id !== currentProductId
    ).slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no related products in same category, show other products
        const otherProducts = products.filter(p => 
            p.id !== currentProductId
        ).slice(0, 4);
        
        displayRelatedProducts(otherProducts, relatedContainer);
    } else {
        displayRelatedProducts(relatedProducts, relatedContainer);
    }
}

function displayRelatedProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createRelatedProductCard(product);
        container.appendChild(productCard);
    });
}

function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'related-product-card';
    card.onclick = () => {
        window.location.href = `product.html?id=${product.id}`;
    };
    
    card.innerHTML = `
        <div class="related-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="related-info">
            <div class="related-title">${product.name}</div>
            <div class="related-price">$${product.price.toFixed(2)}</div>
        </div>
    `;
    
    return card;
}

// ============================================
// 6. SETUP EVENT LISTENERS
// ============================================

function setupEventListeners(product) {
    // Size buttons
    const sizeButtons = queryAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color buttons
    const colorButtons = queryAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity controls
    const minusBtn = query('.qty-btn.minus');
    const plusBtn = query('.qty-btn.plus');
    const quantityInput = getElement('quantity');
    
    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        const maxStock = product.quantity || 100;
        if (currentValue < maxStock) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        const maxStock = product.quantity || 100;
        
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > maxStock) {
            this.value = maxStock;
        }
    });
    
    // Add to Cart button
    const addToCartBtn = getElement('add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product);
    });
    
    // Buy Now button
    const buyNowBtn = getElement('buy-now');
    buyNowBtn.addEventListener('click', function() {
        addToCart(product);
        // In a real app, you would redirect to checkout
        alert('Proceeding to checkout...');
    });
}

// ============================================
// 7. ADD TO CART FUNCTIONALITY
// ============================================

function addToCart(product) {
    const quantity = parseInt(getElement('quantity').value);
    const selectedSize = query('.size-btn.active')?.textContent || 'M';
    const selectedColor = query('.color-btn.active')?.style.backgroundColor || '#000';
    
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => 
        item.productId === product.id && 
        item.size === selectedSize && 
        item.color === selectedColor
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        };
        
        cart.push(cartItem);
    }
    
    // Save cart to localStorage
    localStorage.setItem('vintageVillageCart', JSON.stringify(cart));
    
    // Show success message
    alert(`${quantity} × ${product.name} added to cart!`);
    
    // Update cart count (if cart count element exists)
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // You can update a cart icon count here if you add one to your navbar
}

// ============================================
// 8. INITIALIZE PRODUCT PAGE
// ============================================

function initializeProductPage() {
    loadProductDetails();
    updateCartCount();
}

// ============================================
// 9. START WHEN PAGE LOADS
// ============================================

document.addEventListener('DOMContentLoaded', initializeProductPage);
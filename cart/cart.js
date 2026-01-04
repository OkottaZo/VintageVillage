// cart.js - Shopping Cart Functionality for Vintage Village

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
// 2. LOAD CART ITEMS
// ============================================

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    const cartItemsContainer = getElement('cart-items');
    
    console.log('Loading cart items:', cart);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button onclick="window.location.href='../shop/shop.html'">Start Shopping</button>
            </div>
        `;
        updateOrderSummary([]);
        updateCartCount();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateOrderSummary(cart);
    updateCartCount();
}

// ============================================
// 3. CREATE CART ITEM ELEMENT
// ============================================

function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    // Create color box for visual representation
    const colorBox = item.color ? `<span class="color-box" style="background-color: ${item.color}; width: 15px; height: 15px; display: inline-block; border-radius: 50%; vertical-align: middle; margin-right: 5px;"></span>` : '';
    
    // Fix image path if needed
    let imagePath = item.image;
    if (!imagePath || imagePath === '') {
        imagePath = '../Images/Guns n Roses shirt.png';
    }
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${imagePath}" alt="${item.name}" onerror="this.src='../Images/Guns n Roses shirt.png'">
        </div>
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} <span class="unit-price">($${item.price.toFixed(2)} each)</span></div>
            <div class="cart-item-options">
                <span>Size: ${item.size || 'M'}</span>
                <span>Color: ${colorBox} ${getColorName(item.color) || 'Black'}</span>
            </div>
            <div class="cart-item-quantity">
                <div class="quantity-controls">
                    <button class="qty-btn minus">-</button>
                    <input type="number" class="cart-quantity" value="${item.quantity}" min="1" max="100">
                    <button class="qty-btn plus">+</button>
                </div>
                <button class="remove-item">Remove</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const quantityInput = cartItem.querySelector('.cart-quantity');
    const minusBtn = cartItem.querySelector('.qty-btn.minus');
    const plusBtn = cartItem.querySelector('.qty-btn.plus');
    const removeBtn = cartItem.querySelector('.remove-item');
    
    minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateQuantity(index, -1);
    });
    
    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateQuantity(index, 1);
    });
    
    quantityInput.addEventListener('change', (e) => {
        e.stopPropagation();
        updateQuantity(index, 0, parseInt(e.target.value));
    });
    
    quantityInput.addEventListener('focus', (e) => e.stopPropagation());
    quantityInput.addEventListener('click', (e) => e.stopPropagation());
    
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeItem(index);
    });
    
    // Make the whole cart item clickable to view product
    cartItem.addEventListener('click', function(e) {
        // Don't trigger if clicking on buttons or inputs
        if (e.target.closest('button') || e.target.closest('input') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
            return;
        }
        
        // Redirect to product page
        window.location.href = `../product/product.html?id=${item.productId}`;
    });
    
    // Add hover effect
    cartItem.style.cursor = 'pointer';
    cartItem.style.transition = 'background-color 0.3s';
    
    cartItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(230, 126, 34, 0.05)';
    });
    
    cartItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
    
    return cartItem;
}

// Helper function to convert color codes to names
function getColorName(colorCode) {
    if (!colorCode) return 'Black';
    
    const colorMap = {
        '#000000': 'Black',
        '#000': 'Black',
        'black': 'Black',
        '#FFFFFF': 'White',
        '#FFF': 'White',
        'white': 'White',
        '#4169E1': 'Royal Blue',
        '#DC143C': 'Crimson',
        '#228B22': 'Forest Green',
        '#FFD700': 'Gold',
        '#808080': 'Gray',
        '#FF4444': 'Red',
        '#e67e22': 'Orange'
    };
    
    return colorMap[colorCode] || colorCode;
}

// ============================================
// 4. UPDATE QUANTITY
// ============================================

function updateQuantity(index, change, newQuantity = null) {
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    
    if (index >= 0 && index < cart.length) {
        if (newQuantity !== null) {
            // Validate new quantity
            if (newQuantity < 1) {
                newQuantity = 1;
            } else if (newQuantity > 100) {
                newQuantity = 100;
                showNotification('Maximum quantity per item is 100', 'error');
            }
            cart[index].quantity = newQuantity;
        } else {
            // Validate change
            const newQty = cart[index].quantity + change;
            if (newQty < 1) {
                return; // Don't allow quantity below 1
            } else if (newQty > 100) {
                showNotification('Maximum quantity per item is 100', 'error');
                return;
            }
            cart[index].quantity = newQty;
        }
        
        // Save to localStorage
        localStorage.setItem('vintageVillageCart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
        
        // Dispatch event for other pages to update cart count
        document.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Show notification
        const itemName = cart[index].name;
        showNotification(`Updated ${itemName} quantity to ${cart[index].quantity}`, 'success');
        
        console.log('Cart quantity updated:', cart);
    }
}

// ============================================
// 5. REMOVE ITEM
// ============================================

function removeItem(index) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('vintageVillageCart', JSON.stringify(cart));
        
        // Show removal confirmation
        showNotification(`Removed ${removedItem.name} from cart`, 'success');
        
        // Reload cart items
        loadCartItems();
        
        // Dispatch event for other pages to update cart count
        document.dispatchEvent(new CustomEvent('cartUpdated'));
        
        console.log('Item removed from cart:', removedItem);
    }
}

// ============================================
// 6. UPDATE ORDER SUMMARY
// ============================================

function updateOrderSummary(cart) {
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Calculate shipping (free over $100)
    let shipping = 0;
    let shippingText = 'FREE';
    
    if (subtotal === 0) {
        shipping = 0;
        shippingText = '$0.00';
    } else if (subtotal < 100) {
        shipping = 10.00; // $10 flat rate
        shippingText = `$${shipping.toFixed(2)}`;
    }
    
    const total = subtotal + shipping;
    
    // Update DOM elements
    getElement('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    getElement('shipping').textContent = shippingText;
    getElement('total').textContent = `$${total.toFixed(2)}`;
    
    // Update shipping message
    const freeShippingMsg = query('.free-shipping');
    if (freeShippingMsg) {
        if (subtotal >= 100) {
            freeShippingMsg.textContent = '✓ Free shipping applied!';
            freeShippingMsg.style.color = '#228B22';
        } else {
            const needed = (100 - subtotal).toFixed(2);
            freeShippingMsg.textContent = `Add $${needed} more for free shipping!`;
            freeShippingMsg.style.color = '#ff4444';
        }
    }
    
    console.log('Order summary updated - Subtotal:', subtotal, 'Shipping:', shipping, 'Total:', total);
}

// ============================================
// 7. UPDATE CART COUNT (for navbar)
// ============================================

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count on this page
        const cartCountElement = getElement('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        
        // Also update all cart count elements (for consistency)
        const allCartCountElements = queryAll('#cart-count');
        allCartCountElements.forEach(element => {
            if (element !== cartCountElement) {
                element.textContent = cartCount;
            }
        });
        
        console.log('Cart count updated:', cartCount);
        return cartCount;
    } catch (error) {
        console.error('Error updating cart count:', error);
        return 0;
    }
}

// ============================================
// 8. CHECKOUT FUNCTIONALITY
// ============================================

function setupCheckout() {
    const checkoutBtn = getElement('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
            
            if (cart.length === 0) {
                showNotification('Your cart is empty! Add some items before checking out.', 'error');
                return;
            }
            
            // Calculate totals
            let subtotal = 0;
            let itemList = '';
            
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                itemList += `• ${item.quantity} × ${item.name} (${item.size}, ${getColorName(item.color)}) - $${(item.price * item.quantity).toFixed(2)}\n`;
            });
            
            const shipping = subtotal < 100 ? 10 : 0;
            const total = subtotal + shipping;
            
            // Create order summary for confirmation
            const orderSummary = `
ORDER SUMMARY:
${itemList}
------------------------------
Subtotal: $${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}
Total: $${total.toFixed(2)}
------------------------------

Proceed to checkout?
            `;
            
            const confirmCheckout = confirm(orderSummary);
            
            if (confirmCheckout) {
                // In a real application, you would:
                // 1. Save order to database
                // 2. Redirect to payment gateway
                // 3. Send confirmation email
                
                // For now, simulate successful checkout
                showNotification('Order placed successfully! Thank you for your purchase.', 'success');
                
                // Save order to localStorage for order history
                const order = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    items: cart,
                    subtotal: subtotal,
                    shipping: shipping,
                    total: total,
                    status: 'completed'
                };
                
                // Save to order history
                const orders = JSON.parse(localStorage.getItem('vintageVillageOrders') || '[]');
                orders.push(order);
                localStorage.setItem('vintageVillageOrders', JSON.stringify(orders));
                
                // Clear cart after successful checkout
                localStorage.removeItem('vintageVillageCart');
                
                // Reload cart page
                loadCartItems();
                
                // Update all pages
                document.dispatchEvent(new CustomEvent('cartUpdated'));
                
                // Redirect to thank you page (optional)
                setTimeout(() => {
                    // window.location.href = '../checkout/thankyou.html';
                }, 1500);
            }
        });
    }
}

// ============================================
// 9. NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = query('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#228B22' : '#e67e22'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    `;
    
    // Add close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add CSS animations if not already added
    if (!query('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .cart-notification button:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 10. EMPTY CART FUNCTION
// ============================================

function emptyCart() {
    const cart = JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    
    if (cart.length === 0) {
        showNotification('Your cart is already empty', 'info');
        return;
    }
    
    if (!confirm('Are you sure you want to empty your entire cart?')) {
        return;
    }
    
    localStorage.removeItem('vintageVillageCart');
    showNotification('Cart emptied successfully', 'success');
    loadCartItems();
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// ============================================
// 11. INITIALIZE CART PAGE
// ============================================

function initializeCartPage() {
    console.log('Initializing cart page...');
    
    // Load cart items
    loadCartItems();
    
    // Setup checkout button
    setupCheckout();
    
    // Add empty cart button if not exists
    if (!query('.empty-cart-btn') && query('.order-summary')) {
        const emptyCartBtn = document.createElement('button');
        emptyCartBtn.className = 'empty-cart-btn';
        emptyCartBtn.textContent = 'Empty Cart';
        emptyCartBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background-color: transparent;
            color: #ff4444;
            border: 1px solid #ff4444;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
        `;
        
        emptyCartBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#ff4444';
            this.style.color = 'white';
        });
        
        emptyCartBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#ff4444';
        });
        
        emptyCartBtn.addEventListener('click', emptyCart);
        
        query('.order-summary').appendChild(emptyCartBtn);
    }
    
    // Listen for cart updates from other pages
    document.addEventListener('cartUpdated', function() {
        console.log('Cart updated event received');
        loadCartItems();
    });
    
    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', function(e) {
        if (e.key === 'vintageVillageCart') {
            console.log('Cart storage changed, reloading...');
            loadCartItems();
        }
    });
    
    // Update cart count
    updateCartCount();
    
    console.log('Cart page initialized successfully');
}

// ============================================
// 12. START WHEN PAGE LOADS
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCartPage);
} else {
    // DOM is already ready
    initializeCartPage();
}

// ============================================
// 13. EXPORT FUNCTIONS FOR GLOBAL USE (optional)
// ============================================

// Make functions available globally if needed
window.cartManager = {
    loadCartItems: loadCartItems,
    updateCartCount: updateCartCount,
    emptyCart: emptyCart,
    showNotification: showNotification
};

// Also make key functions available directly
window.updateCartCount = updateCartCount;
window.showCartNotification = showNotification;
// productmanager.js
// CRUD Operations for Vintage Village Marketplace

// ============================================
// 1. DOM SELECTION FUNCTIONS (from your PDF)
// ============================================

// getElementById wrapper
function getElement(id) {
    return document.getElementById(id);
}

// querySelector wrapper
function query(selector) {
    return document.querySelector(selector);
}

// querySelectorAll wrapper
function queryAll(selector) {
    return document.querySelectorAll(selector);
}

// ============================================
// 2. DATA STORAGE (Using localStorage)
// ============================================

// Initialize products in localStorage if empty
function initializeProducts() {
    const products = localStorage.getItem('vintageVillageProducts');
    
    if (!products) {
        // Default products
        const defaultProducts = [
            {
                id: 1,
                name: "Guns N Roses T-shirt",
                description: "Vintage band t-shirt",
                price: 300.00,
                category: "men",
                image: "../Images/Guns n Roses shirt.png",
                limited: true
            },
            {
                id: 2,
                name: "Nirvana T-shirt",
                description: "Vintage band t-shirt",
                price: 300.00,
                category: "men",
                image: "../Images/nirvana shirt.png",
                limited: true
            }
        ];
        
        localStorage.setItem('vintageVillageProducts', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    
    return JSON.parse(products);
}

// ============================================
// 3. CREATE - Add new product
// ============================================

function addNewProduct(event) {
    // Prevent form submission
    if (event) {
        event.preventDefault();
    }
    
    // Get form data
    const productName = getElement('product-name');
    const productDescription = getElement('product-description');
    const category = getElement('category');
    const price = getElement('price');
    const quantity = getElement('quantity');
    const mainImage = getElement('main-image');
    
    // Basic validation
    if (!productName || !productName.value.trim()) {
        alert('Product name is required');
        return;
    }
    
    // Get current products
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    
    // Create new product object
    const newProduct = {
        id: Date.now(), // Simple unique ID
        name: productName.value,
        description: productDescription.value,
        category: category.value,
        price: parseFloat(price.value),
        quantity: parseInt(quantity.value) || 1,
        image: "../Images/Guns n Roses shirt.png", // Use Guns N Roses as placeholder
        limited: query('input[name="limited-edition"]') ? query('input[name="limited-edition"]').checked : false
    };
    
    // Handle image file if provided
    if (mainImage && mainImage.files && mainImage.files[0]) {
        const file = mainImage.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Store the image as base64 data URL
            newProduct.image = e.target.result;
            newProduct.imageName = file.name;
            
            // Add to array
            products.push(newProduct);
            
            // Save to localStorage
            localStorage.setItem('vintageVillageProducts', JSON.stringify(products));
            
            // Show success message
            alert('Product added successfully!');
            
            // Clear form
            if (event.target.reset) {
                event.target.reset();
            }
            
            // Clear image preview
            const previewDiv = getElement('image-preview');
            if (previewDiv) {
                previewDiv.innerHTML = '<p>No images selected</p>';
            }
            
            // Redirect to shop page
            window.location.href = '../shop/shop.html';
        };
        
        reader.onerror = function() {
            alert('Error reading image file');
        };
        
        reader.readAsDataURL(file);
    } else {
        // No image uploaded, use default
        products.push(newProduct);
        localStorage.setItem('vintageVillageProducts', JSON.stringify(products));
        
        alert('Product added successfully!');
        
        if (event.target.reset) {
            event.target.reset();
        }
        
        window.location.href = '../shop/shop.html';
    }
}

// ============================================
// 4. READ - Display all products
// ============================================

function displayProducts() {
    const products = initializeProducts();
    const productsContainer = query('.products');
    
    if (!productsContainer) return;
    
    // Remove all existing product cards
    productsContainer.innerHTML = '';
    
    // Now add all products from localStorage
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Update product count
    updateProductCount(products.length);
    
    // Make all product cards clickable
    makeProductCardsClickable();
}

// Create a single product card element
function createProductCard(product) {
    // Create main card div
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    // Add limited badge if applicable
    if (product.limited) {
        const badge = document.createElement('div');
        badge.className = 'limited-badge';
        badge.textContent = 'Limited';
        imageDiv.appendChild(badge);
    }
    
    imageDiv.appendChild(img);
    
    // Create info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    const title = document.createElement('div');
    title.className = 'product-title';
    title.textContent = product.name;
    
    const priceContainer = document.createElement('div');
    priceContainer.className = 'price-container';
    
    const priceSpan = document.createElement('span');
    priceSpan.className = 'current-price';
    priceSpan.textContent = `$${product.price.toFixed(2)}`;
    
    priceContainer.appendChild(priceSpan);
    
    const deal = document.createElement('div');
    deal.className = 'shop-deal';
    deal.textContent = 'Shop T-Shirts deals';
    
    // Add edit and delete buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'product-buttons';
    buttonsDiv.style.marginTop = '10px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '10px';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.backgroundColor = '#4CAF50';
    editBtn.style.color = 'white';
    editBtn.style.border = 'none';
    editBtn.style.padding = '5px 10px';
    editBtn.style.borderRadius = '3px';
    editBtn.style.cursor = 'pointer';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        editProduct(product.id);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.backgroundColor = '#f44336';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.borderRadius = '3px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteProduct(product.id);
    };
    
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    
    // Assemble the card
    infoDiv.appendChild(title);
    infoDiv.appendChild(priceContainer);
    infoDiv.appendChild(deal);
    infoDiv.appendChild(buttonsDiv);
    
    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    
    return card;
}

// Update product count display
function updateProductCount(count) {
    const header = query('.grid-header h2');
    if (header) {
        header.textContent = `Showing ${count} products`;
    }
}

// ============================================
// 5. MAKE PRODUCT CARDS CLICKABLE
// ============================================

function makeProductCardsClickable() {
    const productCards = queryAll('.product-card');
    
    productCards.forEach(card => {
        const productId = card.getAttribute('data-id');
        
        if (productId) {
            // Remove any existing click event to avoid duplicates
            card.removeEventListener('click', handleProductCardClick);
            
            // Add new click event
            card.addEventListener('click', handleProductCardClick);
            
            // Add hover style
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.3s, box-shadow 0.3s';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
            });
        }
    });
}

// Handle product card click - CORRECT PATH FOR YOUR STRUCTURE
function handleProductCardClick(e) {
    // Don't trigger if clicking on buttons
    if (e.target.closest('button') || e.target.tagName === 'BUTTON') {
        return;
    }
    
    const productId = this.getAttribute('data-id');
    if (productId) {
        // From shop folder to product folder: ../product/product.html
        window.location.href = `../product/product.html?id=${productId}`;
    }
}

// ============================================
// 6. UPDATE - Edit existing product
// ============================================

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    // Fill the add product form with existing data
    if (window.location.pathname.includes('addproduct.html')) {
        getElement('product-name').value = product.name;
        getElement('product-description').value = product.description;
        getElement('category').value = product.category;
        getElement('price').value = product.price;
        getElement('quantity').value = product.quantity || 1;
        
        // Handle limited edition checkbox
        const limitedCheckbox = query('input[name="limited-edition"]');
        if (limitedCheckbox) {
            limitedCheckbox.checked = product.limited || false;
        }
        
        // Store the product ID for update
        getElement('add-product-form').setAttribute('data-edit-id', productId);
        
        // Change form header
        query('.form-header h1').textContent = 'Edit Product';
        query('.submit-btn').textContent = 'Update Product';
        
        // Scroll to top
        window.scrollTo(0, 0);
    } else {
        // Redirect to edit page
        window.location.href = `../addproduct/addproduct.html?edit=${productId}`;
    }
}

function updateProduct(event) {
    if (event) {
        event.preventDefault();
    }
    
    const form = getElement('add-product-form');
    const productId = parseInt(form.getAttribute('data-edit-id'));
    
    if (!productId) {
        addNewProduct(event);
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        alert('Product not found');
        return;
    }
    
    const mainImage = getElement('main-image');
    const updatedProduct = {
        ...products[productIndex],
        name: getElement('product-name').value,
        description: getElement('product-description').value,
        category: getElement('category').value,
        price: parseFloat(getElement('price').value),
        quantity: parseInt(getElement('quantity').value) || 1,
        limited: query('input[name="limited-edition"]') ? query('input[name="limited-edition"]').checked : false
    };
    
    // Handle image update if new image is selected
    if (mainImage && mainImage.files && mainImage.files[0]) {
        const file = mainImage.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Update the image
            updatedProduct.image = e.target.result;
            updatedProduct.imageName = file.name;
            
            // Save updated product
            products[productIndex] = updatedProduct;
            localStorage.setItem('vintageVillageProducts', JSON.stringify(products));
            
            alert('Product updated successfully!');
            window.location.href = '../shop/shop.html';
        };
        
        reader.onerror = function() {
            alert('Error reading image file');
        };
        
        reader.readAsDataURL(file);
    } else {
        // No new image, keep the existing one
        products[productIndex] = updatedProduct;
        localStorage.setItem('vintageVillageProducts', JSON.stringify(products));
        
        alert('Product updated successfully!');
        window.location.href = '../shop/shop.html';
    }
}

// ============================================
// 7. DELETE - Remove product
// ============================================

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    const filteredProducts = products.filter(p => p.id !== productId);
    
    localStorage.setItem('vintageVillageProducts', JSON.stringify(filteredProducts));
    
    // Remove from DOM
    const cardToRemove = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (cardToRemove) {
        cardToRemove.remove();
    }
    
    // Update product count
    updateProductCount(filteredProducts.length);
    
    alert('Product deleted successfully!');
}

// ============================================
// 8. FILTER - Filter products by category
// ============================================

function filterByCategory(category) {
    const products = JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    const productsContainer = query('.products');
    
    if (!productsContainer) return;
    
    // Get all product cards
    const allCards = productsContainer.querySelectorAll('.product-card');
    
    // Show all if category is 'all'
    if (category === 'all') {
        allCards.forEach(card => {
            card.style.display = 'block';
        });
        updateProductCount(products.length);
        return;
    }
    
    // Hide all first
    allCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show only matching products
    let visibleCount = 0;
    products.forEach(product => {
        if (product.category === category) {
            const productCard = productsContainer.querySelector(`[data-id="${product.id}"]`);
            if (productCard) {
                productCard.style.display = 'block';
                visibleCount++;
            }
        }
    });
    
    updateProductCount(visibleCount);
}

// ============================================
// 9. INITIALIZATION AND EVENT LISTENERS
// ============================================

function initializeApp() {
    // Check which page we're on
    const isShopPage = window.location.pathname.includes('shop.html');
    const isAddProductPage = window.location.pathname.includes('addproduct.html');
    
    if (isShopPage) {
        // Initialize and display products
        initializeProducts();
        displayProducts();
        
        // Make original product cards clickable too
        makeProductCardsClickable();
        
        // Add category filter event listeners
        const categoryItems = queryAll('.subcategory-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const category = this.textContent.toLowerCase();
                filterByCategory(category);
            });
        });
    }
    
    if (isAddProductPage) {
        const form = getElement('add-product-form');
        if (form) {
            // Check if we're editing a product
            const urlParams = new URLSearchParams(window.location.search);
            const editId = urlParams.get('edit');
            
            if (editId) {
                editProduct(parseInt(editId));
            }
            
            // Add form submit event
            form.addEventListener('submit', function(event) {
                if (form.getAttribute('data-edit-id')) {
                    updateProduct(event);
                } else {
                    addNewProduct(event);
                }
            });
        }
        
        // Show/hide discount field based on "On Sale" checkbox
        const saleCheckbox = query('input[name="on-sale"]');
        const discountField = getElement('discount-field');
        
        if (saleCheckbox && discountField) {
            saleCheckbox.addEventListener('change', function() {
                discountField.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // Handle image preview
        const imageInput = getElement('main-image');
        const previewDiv = getElement('image-preview');
        
        if (imageInput && previewDiv) {
            imageInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        previewDiv.innerHTML = `
                            <div class="preview-item">
                                <img src="${e.target.result}" alt="Preview" style="width: 120px; height: 120px; object-fit: cover;">
                                <p>${imageInput.files[0].name}</p>
                            </div>
                        `;
                    };
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
    }
}

// ============================================
// 10. UTILITY FUNCTIONS
// ============================================

// Clear all products from storage (for testing)
function clearAllProducts() {
    if (confirm('Clear all products? This cannot be undone.')) {
        localStorage.removeItem('vintageVillageProducts');
        location.reload();
    }
}

// ============================================
// 11. INITIALIZE WHEN PAGE LOADS
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
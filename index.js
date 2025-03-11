 // Sample product data
 const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 89.99,
        oldPrice: 119.99,
        category: "electronics",
        image: "/api/placeholder/300/300",
        rating: 4.5,
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        oldPrice: 249.99,
        category: "electronics",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJeuWl2pfoZyC_7e3TpCxXVlDX4jcJFJgzxw&s",
        rating: 4.8,
        description: "Advanced smartwatch with health monitoring"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        oldPrice: 29.99,
        category: "clothing",
        image: "/api/placeholder/300/300",
        rating: 4.2,
        description: "Comfortable cotton t-shirt available in multiple colors"
    },
    {
        id: 4,
        name: "Kitchen Blender",
        price: 79.99,
        oldPrice: 99.99,
        category: "home",
        image: "/api/placeholder/300/300",
        rating: 4.7,
        description: "Powerful blender for smoothies and food processing"
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 129.99,
        oldPrice: 159.99,
        category: "home",
        image: "/api/placeholder/300/300",
        rating: 4.6,
        description: "Programmable coffee maker with thermal carafe"
    },
    {
        id: 6,
        name: "Bestselling Novel",
        price: 15.99,
        oldPrice: 19.99,
        category: "books",
        image: "/api/placeholder/300/300",
        rating: 4.9,
        description: "Award-winning fiction novel by a bestselling author"
    },
    {
        id: 7,
        name: "Casual Sneakers",
        price: 59.99,
        oldPrice: 79.99,
        category: "clothing",
        image: "/api/placeholder/300/300",
        rating: 4.4,
        description: "Comfortable sneakers perfect for everyday wear"
    },
    {
        id: 8,
        name: "Tablet",
        price: 349.99,
        oldPrice: 399.99,
        category: "electronics",
        image: "/api/placeholder/300/300",
        rating: 4.7,
        description: "Lightweight tablet with high-resolution display"
    }
];

// DOM Elements
const productsContainer = document.getElementById('products');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const successModal = document.getElementById('successModal');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const orderSummaryItems = document.getElementById('orderSummaryItems');
const orderTotal = document.getElementById('orderTotal');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const categoryFilter = document.getElementById('category');
const sortFilter = document.getElementById('sort');
const priceFilter = document.getElementById('price-range');
const searchInput = document.getElementById('search');

// Shopping Cart
let cart = [];

// Initialize the app
// Initialize the app
function init() {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
}

// Render products to the page
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Generate star rating HTML
        const starsHTML = generateStarRating(product.rating);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">₹${product.price.toFixed(2)}</span>
                    <span class="old-price">₹${product.oldPrice.toFixed(2)}</span>
                </div>
                <div class="product-rating">${starsHTML} (${product.rating})</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '★';
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }
    
    return starsHTML;
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    // Close cart
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Overlay click
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        checkoutModal.classList.remove('active');
        successModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Add to cart buttons
    productsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartSidebar.classList.remove('active');
            checkoutModal.classList.add('active');
            renderOrderSummary();
        }
    });
    
    // Close checkout modal
    closeCheckout.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();
        placeOrder();
    });
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Cart item event delegation (for quantity buttons and remove button)
    cartItems.addEventListener('click', e => {
        const target = e.target;
        
        if (target.classList.contains('quantity-btn')) {
            const itemId = parseInt(target.closest('.cart-item').dataset.id);
            const action = target.dataset.action;
            
            if (action === 'increase') {
                increaseQuantity(itemId);
            } else if (action === 'decrease') {
                decreaseQuantity(itemId);
            }
        } else if (target.classList.contains('remove-item')) {
            const itemId = parseInt(target.closest('.cart-item').dataset.id);
            removeFromCart(itemId);
        }
    });
    
    // Filter and sort event listeners
    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    
    // Search input
    searchInput.addEventListener('input', filterProducts);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show cart sidebar
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Increase item quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity -= 1;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    renderCartItems();
    updateCartTotal();
    updateCartCount();
    
    // If cart is empty, close the sidebar
    if (cart.length === 0) {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <button class="remove-item">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Calculate and update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Render order summary in checkout modal
function renderOrderSummary() {
    orderSummaryItems.innerHTML = '';
    
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        
        summaryItem.innerHTML = `
            <div>${item.name} x ${item.quantity}</div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        
        orderSummaryItems.appendChild(summaryItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Place order
function placeOrder() {
    // Simulate order processing
    checkoutModal.classList.remove('active');
    successModal.classList.add('active');
    
    // Clear cart
    cart = [];
    updateCart();
}

// Filter and sort products
function filterProducts() {
    const categoryValue = categoryFilter.value;
    const sortValue = sortFilter.value;
    const priceValue = priceFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    
    // Filter by category
    let filteredProducts = products;
    
    if (categoryValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryValue);
    }
    
    // Filter by price range
    if (priceValue !== 'all') {
        if (priceValue === '0-50') {
            filteredProducts = filteredProducts.filter(product => product.price <= 50);
        } else if (priceValue === '50-100') {
            filteredProducts = filteredProducts.filter(product => product.price > 50 && product.price <= 100);
        } else if (priceValue === '100-200') {
            filteredProducts = filteredProducts.filter(product => product.price > 100 && product.price <= 200);
        } else if (priceValue === '200+') {
            filteredProducts = filteredProducts.filter(product => product.price > 200);
        }
    }
    
    // Filter by search term
    if (searchValue) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchValue) || 
            product.description.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );
    }
    
    // Sort products
    if (sortValue === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'newest') {
        // For demo purposes, we'll just reverse the array
        filteredProducts.reverse();
    } else if (sortValue === 'popularity') {
        // Sort by rating
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    // Render filtered and sorted products
    renderProducts(filteredProducts);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
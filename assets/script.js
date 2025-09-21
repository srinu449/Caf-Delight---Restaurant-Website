// Cart functionality
let cart = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const reservationForm = document.getElementById('reservationForm');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeCart();
    initializeReservationForm();
    setMinDate();
});

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Cart functionality
function initializeCart() {
    // Add to cart button listeners
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const menuItem = button.closest('.menu-item');
            const item = {
                id: parseInt(menuItem.getAttribute('data-id')),
                name: menuItem.getAttribute('data-name'),
                price: parseFloat(menuItem.getAttribute('data-price')),
                quantity: 1
            };
            
            addToCart(item);
        });
    });
    
    // Cart button listener
    cartBtn.addEventListener('click', () => {
        showCartModal();
    });

    // Close cart listener
    closeCartBtn.addEventListener('click', () => {
        hideCartModal();
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            hideCartModal();
        }
    });
    
    // Place order listener
    placeOrderBtn.addEventListener('click', () => {
        placeOrder();
    });
    
    updateCartUI();
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    updateCartUI();
    showAddedToCartFeedback();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

function updateCartUI() {
    // Update cart badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    updateCartItems();
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function updateCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showCartModal() {
    cartModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideCartModal() {
    cartModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully! 🎉\nTotal: ₹${total.toFixed(2)}\nThank you for your order!`);
    
    // Clear cart
    cart = [];
    updateCartUI();
    hideCartModal();
}

function showAddedToCartFeedback() {
    // Simple feedback - you could enhance this with a toast notification
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

// Reservation form functionality
function initializeReservationForm() {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(reservationForm);
        const reservation = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            time: formData.get('time'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!reservation.name || !reservation.email || !reservation.guests || !reservation.date || !reservation.time) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(reservation.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Validate number of guests
        const guests = parseInt(reservation.guests);
        if (guests < 1 || guests > 20) {
            alert('Number of guests must be between 1 and 20.');
            return;
        }
        
        // Validate date (not in the past)
        const selectedDate = new Date(reservation.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a future date.');
            return;
        }
        
        console.log('Reservation submitted:', reservation);
        alert('Reservation request submitted! We\'ll contact you shortly to confirm.');
        
        // Reset form
        reservationForm.reset();
    });
}

function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.min = formattedDate;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero button functionality
document.querySelector('.hero-btn').addEventListener('click', () => {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth'
    });
});

// Add some interactivity to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
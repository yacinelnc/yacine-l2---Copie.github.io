document.addEventListener('DOMContentLoaded', function() {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image,
                quantity: 1
            };
            
            addToCart(product);
             
             
        });
    });

     
    if(document.getElementById('cart-items')) {
        displayCartItems();
    }

     
    function displayCartItems() {
        const cartItemsEl = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        if(cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            subtotalEl.textContent = '0';
            totalEl.textContent = '0';
            return;
        }
        
        let subtotal = 0;
        cartItemsEl.innerHTML = '';
        
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${item.price} $</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            
            cartItemsEl.appendChild(itemEl);
        });
        
        subtotalEl.textContent = subtotal.toFixed(2);
        const shipping = parseFloat(document.getElementById('shipping').textContent);
        totalEl.textContent = (subtotal + shipping).toFixed(2);
        
        
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if(this.dataset.action === 'increase') {
                    cart[index].quantity += 1;
                } else if(cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                }
                saveCart();
                displayCartItems();
            });
        });
        
         
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                saveCart();
                displayCartItems();
                updateCartCount();
            });
        });
        
         
        document.getElementById('checkout-btn').addEventListener('click', function() {
            
            setTimeout(() => {
                
                cart = [];
                saveCart();
                updateCartCount();
                
                 
                window.location.href = 'formulairecommande.html';
            }, 1000);
        });
    }

     
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        saveCart();
    }

     
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

     
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        if(document.getElementById('cart-count')) {
            document.getElementById('cart-count').textContent = count;
        }
    }
});
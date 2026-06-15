/* ==========================================================================
   PRODUCTS DATABASE
   ========================================================================== */
const products = [
    {
        id: 1,
        name: "Vestido Floral Primavera",
        category: "Vestidos",
        price: 89.99,
        oldPrice: 110.00,
        image: "assets/images/pink_floral_dress.png",
        description: "Un hermoso vestido veraniego de lino ligero con un patrón de flores silvestres en tonos pastel. Perfecto para días soleados, eventos casuales al aire libre o un paseo por la tarde. Presenta un corte sumamente cómodo con tirantes ajustables, espalda descubierta y un diseño de vuelo fluido que aporta gran movimiento y frescura.",
        sizes: ["S", "M", "L"],
        colors: ["#ffd3e0", "#fffdeb"],
        badge: "Nuevo",
        isBestSeller: true
    },
    {
        id: 2,
        name: "Blusa Blanca de Lino",
        category: "Tops",
        price: 49.99,
        image: "assets/images/chic_white_blouse.png",
        description: "Blusa de lino fino color blanco óptico con delicados detalles bordados y mangas abullonadas de estilo romántico. Ideal para lograr un look sofisticado de oficina, combinar con jeans casuales, o disfrutar de un almuerzo de fin de semana con total frescura y elegancia.",
        sizes: ["S", "M", "L"],
        colors: ["#ffffff", "#ffd3e0"],
        badge: null,
        isBestSeller: false
    },
    {
        id: 3,
        name: "Falda Plisada Rosa Pastel",
        category: "Faldas",
        price: 59.99,
        image: "assets/images/elegant_pink_skirt.png",
        description: "Elegante falda midi con textura plisada en un delicado tono rosa pastel. Cuenta con una cintura elástica sumamente cómoda que se adapta suavemente a tu figura y un corte evasé que otorga una caída espectacular. Perfecta para combinar con blusas o camisas entalladas.",
        sizes: ["S", "M"],
        colors: ["#ffd3e0", "#fffdeb"],
        badge: "Destacado",
        isBestSeller: true
    },
    {
        id: 4,
        name: "Bolso de Cuero Rosa Maki",
        category: "Accesorios",
        price: 79.99,
        oldPrice: 95.00,
        image: "assets/images/pink_leather_handbag.png",
        description: "Bolso de mano de silueta estructurada, confeccionado en cuero vegano de alta calidad color rosa maki. Diseñado con elegantes herrajes dorados que combinan con el logotipo. Cuenta con un espacioso compartimento interno forrado y una correa ajustable y removible para llevar al hombro o cruzado.",
        sizes: ["Única"],
        colors: ["#ff5599", "#fbc5d4"],
        badge: "15% OFF",
        isBestSeller: true
    },
    {
        id: 5,
        name: "Vestido Rosa Gala",
        category: "Vestidos",
        price: 120.00,
        image: "assets/images/pink_floral_dress.png",
        description: "Deslumbra en tu próximo evento formal con este vestido midi de satén selecto en color rosa boutique. Su corte elegante resalta sutilmente la silueta con un escote drapeado muy sofisticado, abertura lateral y un acabado brillante que denota exclusividad.",
        sizes: ["S", "M", "L"],
        colors: ["#f05b8a"],
        badge: "Exclusivo",
        isBestSeller: true
    },
    {
        id: 6,
        name: "Top Crop Encaje Floral",
        category: "Tops",
        price: 34.99,
        image: "assets/images/chic_white_blouse.png",
        description: "Top corto y romántico de encaje floral suave color blanco crema. Presenta un cómodo forro interior en la parte frontal y tirantes finos. Es el complemento ideal para combinar con faldas y pantalones de talle alto.",
        sizes: ["S", "M"],
        colors: ["#ffffff"],
        badge: null,
        isBestSeller: false
    }
];

/* ==========================================================================
   APP STATE & INITIALIZATION
   ========================================================================== */
let cart = JSON.parse(localStorage.getItem('maki_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('maki_favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Render initial products
    renderProducts(products);
    
    // Update badges
    updateCartBadge();
    updateFavoritesBadge();
    
    // Initialize Event Listeners
    initEventListeners();
});

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const quickViewModal = document.getElementById('quickview-modal');
const modalOverlay = document.getElementById('modal-overlay');
const toastNotification = document.getElementById('toast-notification');

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
function initEventListeners() {
    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('site-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    document.getElementById('mobile-menu-toggle').addEventListener('click', openMobileMenu);
    document.getElementById('close-mobile-menu').addEventListener('click', closeMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);

    // Cart Drawer Toggle
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Quickview Modal Close
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Product Category Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });

    // Categories Grid Card Clicks
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            
            // Activate filter button
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Filter products
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Footer Shortcuts Clicks
    const catShortcuts = document.querySelectorAll('.cat-filter-shortcut');
    catShortcuts.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            // Activate filter button
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Filter products
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const status = document.getElementById('contact-message-status');
        
        // Simular envío
        status.innerHTML = `✨ ¡Gracias, ${name}! Hemos recibido tu consulta. Nos pondremos en contacto contigo a ${email} muy pronto.`;
        status.classList.remove('hide');
        contactForm.reset();
        
        setTimeout(() => {
            status.classList.add('hide');
        }, 6000);
    });

    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        const message = document.getElementById('newsletter-message');
        
        // Simular registro
        message.innerHTML = `🎉 ¡Bienvenida al club! Te hemos enviado un cupón de 10% OFF a ${email}.`;
        message.classList.remove('hide');
        newsletterForm.reset();
        
        setTimeout(() => {
            message.classList.add('hide');
        }, 6000);
    });

    // Favorites click mock
    document.getElementById('favorites-btn').addEventListener('click', () => {
        showToast("¡Pronto podrás ver tu lista de deseos personalizada!");
    });

    // Checkout button - WhatsApp redirect
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) return;

        // Reemplazar con el número real de Maki Boutique (incluyendo código de país sin el signo '+')
        const WHATSAPP_PHONE = '525618507408'; 
        
        let message = `🌸 *¡Hola, Maki Boutique!* Me gustaría realizar el siguiente pedido:\n\n`;
        
        cart.forEach((item, index) => {
            message += `📍 *${index + 1}. ${item.name}*\n`;
            message += `   • Cantidad: ${item.qty}\n`;
            message += `   • Talla: ${item.size}\n`;
            message += `   • Precio: $${(item.price * item.qty).toFixed(2)}\n\n`;
        });
        
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        let shippingText = subtotal >= 99 ? "Gratis" : "$9.99";
        const total = subtotal >= 99 ? subtotal : subtotal + 9.99;
        
        message += `💵 *Resumen del Pedido:*\n`;
        message += `   • Subtotal: $${subtotal.toFixed(2)}\n`;
        message += `   • Envío: ${shippingText}\n`;
        message += `   • *Total a Pagar: $${total.toFixed(2)}*\n\n`;
        message += `¿Me podrían confirmar la disponibilidad y los métodos de pago? ¡Muchas gracias! 💕`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
        
        showToast("🛍️ ¡Redirigiendo a WhatsApp para completar tu compra!");
        
        setTimeout(() => {
            // Vaciar carrito tras la redirección
            cart = [];
            saveCart();
            updateCartBadge();
            renderCartItems();
            closeCart();
            
            // Redirigir a WhatsApp
            window.open(whatsappUrl, '_blank');
        }, 1500);
    });

    // Mobile nav drawer link auto close
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Interactive Search Mock
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = prompt("¿Qué prenda estás buscando?");
        if (query) {
            const results = products.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) || 
                p.description.toLowerCase().includes(query.toLowerCase()) || 
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            if (results.length > 0) {
                renderProducts(results);
                showToast(`Se encontraron ${results.length} productos para "${query}"`);
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            } else {
                showToast(`No se encontraron resultados para "${query}". Mostrando todo.`);
                renderProducts(products);
            }
        }
    });
}

/* ==========================================================================
   MENU & DRAWER TOGGLES
   ========================================================================== */
function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal() {
    quickViewModal.classList.remove('open');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================================================
   PRODUCT RENDERING
   ========================================================================== */
function renderProducts(productArray) {
    productGrid.innerHTML = '';
    
    if (productArray.length === 0) {
        productGrid.innerHTML = `
            <div class="grid-skeleton">
                <i data-lucide="frown" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--color-secondary);"></i>
                <p>Lo sentimos, no encontramos prendas en esta categoría por el momento.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    productArray.forEach(prod => {
        const hasOldPrice = prod.oldPrice ? true : false;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-box">
                ${prod.badge ? `<span class="product-badge">${prod.badge}</span>` : ''}
                <img src="${prod.image}" alt="${prod.name}">
                <div class="product-hover-actions">
                    <button class="hover-btn btn-quickview" data-id="${prod.id}" title="Vista Rápida" aria-label="Vista rápida de ${prod.name}">
                        <i data-lucide="eye"></i>
                    </button>
                    <button class="hover-btn btn-add-cart-quick" data-id="${prod.id}" aria-label="Añadir ${prod.name} al carrito">
                        <i data-lucide="shopping-cart"></i>
                        <span>Añadir</span>
                    </button>
                    <button class="hover-btn btn-fav-toggle" data-id="${prod.id}" title="Añadir a favoritos" aria-label="Guardar ${prod.name}">
                        <i data-lucide="heart" class="${favorites.includes(prod.id) ? 'fill-pink' : ''}"></i>
                    </button>
                </div>
            </div>
            <div class="product-details">
                <div class="product-cat">${prod.category}</div>
                <h3 class="product-name"><a href="#" class="btn-quickview" data-id="${prod.id}">${prod.name}</a></h3>
                <div class="product-price-box">
                    <span class="product-price">$${prod.price.toFixed(2)}</span>
                    ${hasOldPrice ? `<span class="product-price-old">$${prod.oldPrice.toFixed(2)}</span>` : ''}
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
    
    // Re-initialize Lucide Icons for dynamic content
    lucide.createIcons();
    
    // Bind Quickview click to card triggers
    const quickViewTriggers = productGrid.querySelectorAll('.btn-quickview');
    quickViewTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(trigger.getAttribute('data-id'));
            openQuickView(id);
        });
    });

    // Bind Quick Add Cart click
    const quickAddTriggers = productGrid.querySelectorAll('.btn-add-cart-quick');
    quickAddTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const id = parseInt(trigger.getAttribute('data-id'));
            addToCart(id, 1);
        });
    });

    // Bind Favorite Toggle click
    const favTriggers = productGrid.querySelectorAll('.btn-fav-toggle');
    favTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const id = parseInt(trigger.getAttribute('data-id'));
            toggleFavorite(id);
            const icon = trigger.querySelector('i');
            if (favorites.includes(id)) {
                icon.classList.add('fill-pink');
                showToast("Añadido a favoritos ❤️");
            } else {
                icon.classList.remove('fill-pink');
                showToast("Eliminado de favoritos 💔");
            }
        });
    });
}

/* ==========================================================================
   QUICK VIEW MODAL RENDERING
   ========================================================================== */
function openQuickView(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalContent = document.getElementById('modal-product-detail');
    
    // Generate Size Buttons HTML
    let sizesHtml = '';
    product.sizes.forEach((size, idx) => {
        sizesHtml += `<button class="size-btn ${idx === 0 ? 'active' : ''}" data-size="${size}">${size}</button>`;
    });

    // Generate Color Dots HTML
    let colorsHtml = '';
    product.colors.forEach((color, idx) => {
        colorsHtml += `<button class="color-btn ${idx === 0 ? 'active' : ''}" style="background-color: ${color}" data-color="${color}" aria-label="Color ${color}"></button>`;
    });

    modalContent.innerHTML = `
        <div class="modal-img-box">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info-box">
            <span class="modal-cat">${product.category}</span>
            <h2 class="modal-title">${product.name}</h2>
            <div class="modal-price">$${product.price.toFixed(2)}</div>
            <p class="modal-desc">${product.description}</p>
            
            <!-- Opción Talla -->
            <div class="option-select-box">
                <h4 class="option-title">Selecciona Talla:</h4>
                <div class="size-options">
                    ${sizesHtml}
                </div>
            </div>

            <!-- Opción Color -->
            <div class="option-select-box">
                <h4 class="option-title">Color:</h4>
                <div class="color-options">
                    ${colorsHtml}
                </div>
            </div>

            <!-- Cantidad & Agregar -->
            <div class="modal-action-box">
                <div class="qty-input-box">
                    <button class="qty-btn" id="modal-qty-minus"><i data-lucide="minus" style="width: 14px; height: 14px"></i></button>
                    <span class="qty-val" id="modal-qty-val">1</span>
                    <button class="qty-btn" id="modal-qty-plus"><i data-lucide="plus" style="width: 14px; height: 14px"></i></button>
                </div>
                <button class="btn btn-primary" id="modal-add-to-cart" data-id="${product.id}" style="flex: 1; height: 52px;">
                    <i data-lucide="shopping-bag"></i>
                    <span>Añadir al Carrito</span>
                </button>
            </div>
        </div>
    `;

    // Initialize icons in modal
    lucide.createIcons();

    // Size Selection Interactivity
    const sizeBtns = modalContent.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color Selection Interactivity
    const colorBtns = modalContent.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Quantity Counter Interactivity
    const qtyValSpan = document.getElementById('modal-qty-val');
    let qty = 1;
    
    document.getElementById('modal-qty-minus').addEventListener('click', () => {
        if (qty > 1) {
            qty--;
            qtyValSpan.textContent = qty;
        }
    });

    document.getElementById('modal-qty-plus').addEventListener('click', () => {
        qty++;
        qtyValSpan.textContent = qty;
    });

    // Add to Cart from Modal
    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        const selectedSize = modalContent.querySelector('.size-btn.active')?.getAttribute('data-size') || 'Única';
        const selectedColor = modalContent.querySelector('.color-btn.active')?.getAttribute('data-color') || '#ffffff';
        
        addToCart(product.id, qty, selectedSize, selectedColor);
        closeModal();
    });

    // Show Modal
    quickViewModal.classList.add('open');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   CART OPERATIONS
   ========================================================================== */
function addToCart(id, qty, size = 'M', color = null) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Use default color if not specified
    if (!color) {
        color = product.colors[0];
    }

    // Size override for accessories
    if (product.category === 'Accesorios') {
        size = 'Única';
    }

    // Check if item already exists in cart with same size/color
    const existingIndex = cart.findIndex(item => 
        item.id === id && 
        item.size === size && 
        item.color === color
    );

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            qty: qty
        });
    }

    saveCart();
    updateCartBadge();
    showToast(`🛒 "${product.name}" añadido al carrito.`);
    
    // Automatically open cart drawer to show progress
    setTimeout(() => {
        openCart();
    }, 500);
}

function updateCartQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
        showToast("Producto eliminado del carrito.");
    }
    
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function removeCartItem(index) {
    showToast(`Eliminado: "${cart[index].name}" del carrito.`);
    cart.splice(index, 1);
    
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('maki_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').textContent = totalCount;
    document.getElementById('cart-drawer-count').textContent = totalCount;
}

function renderCartItems() {
    const cartList = document.getElementById('cart-items-list');
    const emptyMsg = document.getElementById('empty-cart-message');
    const cartFooter = document.getElementById('cart-drawer-footer');
    
    if (cart.length === 0) {
        cartList.style.display = 'none';
        emptyMsg.style.display = 'flex';
        cartFooter.style.display = 'none';
        
        // Add listener to exploration button in empty message
        const exploreBtn = emptyMsg.querySelector('.close-cart-btn-action');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', closeCart);
        }
        return;
    }

    cartList.style.display = 'flex';
    emptyMsg.style.display = 'none';
    cartFooter.style.display = 'flex';

    cartList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemLi = document.createElement('div');
        itemLi.className = 'cart-item';
        itemLi.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-meta">Talla: ${item.size} | Color: <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${item.color}; border:1px solid #ddd; vertical-align:middle;"></span></div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                
                <!-- Qty controls -->
                <div class="cart-item-qty" style="margin-top: 8px;">
                    <button class="qty-btn btn-qty-minus" data-index="${index}"><i data-lucide="minus" style="width: 10px; height: 10px"></i></button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn btn-qty-plus" data-index="${index}"><i data-lucide="plus" style="width: 10px; height: 10px"></i></button>
                </div>
            </div>
            <button class="remove-item-btn" data-index="${index}" aria-label="Eliminar ${item.name}"><i data-lucide="trash-2"></i></button>
        `;
        cartList.appendChild(itemLi);
    });

    lucide.createIcons();

    // Bind quantity increment/decrement buttons
    cartList.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            updateCartQty(index, -1);
        });
    });

    cartList.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            updateCartQty(index, 1);
        });
    });

    // Bind remove button
    cartList.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            removeCartItem(index);
        });
    });

    // Update Subtotal and Total
    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const subtotalSpan = document.getElementById('cart-subtotal');
    const shippingSpan = document.getElementById('cart-shipping');
    const totalSpan = document.getElementById('cart-total');

    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    
    let shipping = 0;
    if (subtotal > 0 && subtotal < 99) {
        shipping = 9.99;
        shippingSpan.textContent = `$${shipping.toFixed(2)}`;
    } else if (subtotal >= 99) {
        shipping = 0;
        shippingSpan.textContent = "Gratis";
    } else {
        shippingSpan.textContent = "$0.00";
    }

    const total = subtotal + shipping;
    totalSpan.textContent = `$${total.toFixed(2)}`;
}

/* ==========================================================================
   FAVORITES OPERATIONS
   ========================================================================== */
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('maki_favorites', JSON.stringify(favorites));
    updateFavoritesBadge();
}

function updateFavoritesBadge() {
    document.getElementById('fav-count').textContent = favorites.length;
}

/* ==========================================================================
   TOAST ALERTS
   ========================================================================== */
function showToast(message) {
    const messageSpan = document.getElementById('toast-message');
    messageSpan.textContent = message;
    
    toastNotification.classList.add('show');
    
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3500);
}

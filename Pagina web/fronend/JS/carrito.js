// === MANEJO DE ERRORES GLOBALES ===

// Capturar errores JavaScript que podrían estar rompiendo el script
window.addEventListener('error', function(event) {
    console.error('❌ Error JavaScript detectado:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // Si el error es en nuestro script, mostrar notificación
    if (event.filename && event.filename.includes('carrito.js')) {
        console.error('🚨 Error crítico en carrito.js - intentando recuperar...');
        
        // Intentar reinicializar después de un breve delay
        setTimeout(() => {
            try {
                if (window.reinitializeCart) {
                    window.reinitializeCart();
                }
            } catch (e) {
                console.error('❌ No se pudo recuperar el carrito:', e);
            }
        }, 1000);
    }
});

// === CARRITO DE COMPRAS CON SISTEMA DE RECOMENDACIONES ===
const usuario = JSON.parse(localStorage.getItem("usuario-ares")) || null;
const usuarioId = usuario ? usuario.id : null;

// Variable global del carrito
let cart = JSON.parse(localStorage.getItem('ares-cart')) || [];

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('ares-cart', JSON.stringify(cart));
}

// Función para obtener el carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('ares-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

// Función para agregar producto al carrito
function addToCart(productCard) {
    console.log('🛍️ Iniciando addToCart');
    
    try {
        const nameElement = productCard.querySelector('h4');
        const priceElement = productCard.querySelector('p strong');
        const imgElement = productCard.querySelector('img');
        
        if (!nameElement || !priceElement || !imgElement) {
            console.error('❌ Elementos requeridos no encontrados:', {
                name: !!nameElement,
                price: !!priceElement,
                img: !!imgElement
            });
            showNotification('Error: Información del producto incompleta');
            return;
        }
        
        const name = nameElement.innerText;
        const price = priceElement.innerText;
        const img = imgElement.src;
        const categories = Array.from(productCard.querySelectorAll('.category-btn'))
            .map(btn => btn.innerText);

        console.log('📋 Datos del producto:', { name, price, img, categories });

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.qty += 1;
            console.log('➕ Cantidad incrementada para:', name);
        } else {
            cart.push({
                name,
                price,
                img,
                qty: 1,
                categories
            });
            console.log('🆕 Nuevo producto agregado:', name);
        }

        saveCart();
        updateCartDisplay();
        showNotification(`${name} agregado al carrito`);
        
        // Reproducir sonido específico para agregar al carrito
        playAddToCartSound();
        
        console.log('✅ Producto agregado exitosamente');
        console.log('🛒 Carrito actual:', cart);
        
    } catch (error) {
        console.error('❌ Error en addToCart:', error);
        showNotification('Error al agregar producto al carrito');
    }
}

// Función para remover producto del carrito
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
    showNotification(`Producto eliminado del carrito`);
}

// Función para actualizar cantidad de un producto
function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(name);
        } else {
            item.qty = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

// Función para vaciar completamente el carrito
function clearCart() {
    showConfirmation('¿Estás seguro de que quieres vaciar el carrito?', () => {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Carrito vaciado');
    });
}

// Función para continuar comprando
function continueShopping() {
    window.location.href = 'suple.html';
}

// Función para ir a ver productos
function browseProducts() {
    window.location.href = 'suple.html';
}

// Función para actualizar el display del carrito
function updateCartDisplay() {
    updateCartCount();

    if (window.location.pathname.includes('carrito.html')) {
        updateCartPage();
    }
}

// Función para actualizar el contador del carrito en el header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Función para actualizar la página completa del carrito
function updateCartPage() {
    console.log('🔄 Actualizando página del carrito...');

    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSection = document.getElementById('cart-total-section');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContent = document.querySelector('.cart-content');
    const recommendationsList = document.getElementById('recommendations-list');

    if (!cartItemsList || !cartTotalSection || !emptyCartMessage || !cartContent) {
        console.error('❌ Elementos del carrito no encontrados');
        return;
    }

    console.log('📦 Carrito actual:', cart);
    console.log('📊 Items en carrito:', cart.length);

    if (cart.length === 0) {
        console.log('🛒 Carrito vacío, mostrando mensaje');
        // Mostrar mensaje de carrito vacío
        cartContent.classList.add('hidden');
        cartContent.style.display = 'none';
        emptyCartMessage.classList.remove('hidden');
        emptyCartMessage.style.display = 'block';
        return;
    }

    console.log('📋 Carrito con productos, mostrando contenido');
    // Mostrar contenido del carrito
    cartContent.classList.remove('hidden');
    cartContent.style.display = 'grid';
    emptyCartMessage.classList.add('hidden');
    emptyCartMessage.style.display = 'none';

    // Actualizar lista de items
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        console.log(`📝 Procesando item ${index + 1}:`, item);
        const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        const itemTotal = priceNum * item.qty;
        total += itemTotal;

        const cartItemElement = createCartItemElement(item, priceNum);
        cartItemsList.appendChild(cartItemElement);
    });

    console.log('💰 Total calculado:', total);

    // Actualizar total
    updateCartTotal(cartTotalSection, total);

    // Actualizar recomendaciones
    if (recommendationsList) {
        console.log('🎯 Actualizando recomendaciones...');
        updateRecommendations(recommendationsList);
    } else {
        console.log('⚠️ No se encontró la lista de recomendaciones');
    }

    console.log('✅ Página del carrito actualizada');
}

// Función para crear elemento de item del carrito
function createCartItemElement(item, priceNum) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';

    cartItemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="price">${item.price}</div>
            <div class="categories">
                ${item.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.qty - 1})">-</button>
                <span class="quantity-display">${item.qty}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.qty + 1})">+</button>
            </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart('${item.name}')" title="Eliminar producto">
            ×
        </button>
    `;

    return cartItemDiv;
}

// Función para actualizar el total del carrito
function updateCartTotal(totalSection, total) {
    const subtotal = total;
    const shipping = total > 100 ? 0 : 10; // Envío gratis si es mayor a 100
    const finalTotal = subtotal + shipping;

    totalSection.innerHTML = `
        <div class="total-line">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="total-line">
            <span>Envío:</span>
            <span>${shipping === 0 ? 'Gratis' : 'S/ ' + shipping.toFixed(2)}</span>
        </div>
        <div class="total-line final">
            <span>Total:</span>
            <span>S/ ${finalTotal.toFixed(2)}</span>
        </div>
    `;
}

// Función para actualizar recomendaciones
function updateRecommendations(recommendationsList) {
    console.log('🔍 Iniciando proceso de recomendaciones...');

    if (!recommendationsList) {
        console.log('❌ No se encontró el elemento recommendations-list');
        return;
    }

    console.log('📦 Carrito actual:', cart);
    const recommendations = getRecommendations(cart);
    console.log('✨ Recomendaciones generadas:', recommendations);

    recommendationsList.innerHTML = '';

    if (recommendations.length === 0) {
        console.log('⚠️ No se generaron recomendaciones');
        recommendationsList.innerHTML = '<p style="text-align: center; color: #999;">No hay recomendaciones disponibles</p>';
        return;
    }

    console.log(`📝 Mostrando ${recommendations.length} recomendaciones en la interfaz`);
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';

        recElement.innerHTML = `
            <img src="${rec.img}" alt="${rec.name}">
            <div class="recommendation-details">
                <div class="name">${rec.name}</div>
                <div class="price">${rec.price}</div>
            </div>
            <button class="add-recommended-btn" onclick="addRecommendedToCart('${rec.name}')" title="Agregar al carrito">
                +
            </button>
        `;

        recommendationsList.appendChild(recElement);
    });
}

// === SISTEMA DE RECOMENDACIONES ===

function getRecommendations(cartItems) {
    console.log('🎯 Calculando recomendaciones para:', cartItems.length, 'productos en carrito');

    // Solo recomendar si hay al menos 1 item en el carrito
    if (cartItems.length < 1) {
        console.log('🚫 Carrito vacío, no hay recomendaciones');
        return [];
    }

    // Obtener categorías de los items en el carrito
    const cartCategories = cartItems.map(item => item.categories || []).flat();
    console.log('🏷️ Categorías en el carrito:', cartCategories);

    // Si no hay categorías, mostrar productos populares
    if (cartCategories.length === 0) {
        console.log('📈 Sin categorías específicas, mostrando productos populares');
        const popularProducts = getAllAvailableProducts().slice(0, 3);
        console.log('⭐ Productos populares seleccionados:', popularProducts);
        return popularProducts;
    }

    // Simulación de productos disponibles (en una aplicación real, esto vendría de una base de datos)
    const allProducts = getAllAvailableProducts();
    console.log('🛍️ Productos disponibles para recomendar:', allProducts.length);

    // Encontrar productos similares
    const recommendations = [];

    allProducts.forEach(product => {
        // No recomendar productos que ya están en el carrito
        if (cartItems.some(item => item.name === product.name)) {
            console.log('❌ Producto ya en carrito, omitiendo:', product.name);
            return;
        }

        // Calcular puntuación de similitud
        let score = 0;
        if (product.categories) {
            product.categories.forEach(cat => {
                if (cartCategories.includes(cat)) {
                    score++;
                    console.log(`✅ Coincidencia encontrada: "${cat}" en producto "${product.name}"`);
                }
            });
        }

        // Agregar productos con puntuación > 0 o productos populares
        if (score > 0 || recommendations.length < 3) {
            console.log(`📋 Agregando recomendación: "${product.name}" con puntuación ${score || 0.5}`);
            recommendations.push({
                ...product,
                score: score || 0.5 // Dar puntuación mínima a productos populares
            });
        }
    });

    // Ordenar por puntuación y tomar los 5 mejores
    const finalRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    console.log('🏆 Recomendaciones finales ordenadas por puntuación:', finalRecommendations);
    return finalRecommendations;
}

// Función para obtener todos los productos disponibles (simulación)
function getAllAvailableProducts() {
    return [
        {
            name: "Platinum 100% Creatine",
            price: "S/ 125.00",
            img: "Imagenes/produ1.png",
            categories: ["Muscletech", "Sin sabor", "Creatina monohidratada (5g)"]
        },
        {
            name: "HMB Power 2000 mg",
            price: "S/ 95.00",
            img: "Imagenes/produ2.png",
            categories: ["Vecos Nutriceutical", "Sin sabor", "HMB, Vitamina B6"]
        },
        {
            name: "Gold Standard 100% Whey",
            price: "S/ 185.00",
            img: "Imagenes/produ4.png",
            categories: ["Optimum Nutrition", "Caramelo", "Proteína de suero, BCAA"]
        },
        {
            name: "WheyPlus",
            price: "S/ 145.00",
            img: "Imagenes/produ9.png",
            categories: ["Powergym", "Chocolate", "Proteína de suero y vegetal, BCAA"]
        },
        {
            name: "Giftcard 1 Mes",
            price: "S/ 89.00",
            img: "Imagenes/membre1.png",
            categories: ["Mensual", "Todas las sedes"]
        },
        {
            name: "Gatorade",
            price: "S/ 5.50",
            img: "Imagenes/snack1.png",
            categories: ["PepsiCo", "Sin sabor"]
        },
        {
            name: "Costa Cereal Almendra",
            price: "S/ 3.50",
            img: "Imagenes/snack12.png",
            categories: ["Costa", "Almendra y miel"]
        }
    ];
}

// Función para agregar producto recomendado al carrito
function addRecommendedToCart(productName) {
    const allProducts = getAllAvailableProducts();
    const product = allProducts.find(p => p.name === productName);

    if (product) {
        const existingItem = cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                img: product.img,
                qty: 1,
                categories: product.categories
            });
        }

        saveCart();
        updateCartDisplay();
        showNotification(`${product.name} agregado al carrito`);
        
        // Reproducir sonido específico para agregar al carrito
        playAddToCartSound();
    }
}

// === FUNCIONES DE NOTIFICACIÓN ===

// Contador para IDs únicos de notificaciones
let notificationCounter = 0;

function showNotification(message) {
    // Limpiar notificaciones antiguas
    clearOldNotifications();
    
    // Crear contenedor de notificaciones si no existe
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Limpiar notificaciones antiguas
    clearOldNotifications();

    // Crear la notificación
    const notification = document.createElement('div');
    notification.id = `notification-${notificationCounter++}`;
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cursor = 'pointer';
    notification.title = 'Clic para cerrar';

    // Agregar funcionalidad de clic para cerrar
    notification.addEventListener('click', function() {
        notification.classList.add('hide');
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Agregar al contenedor
    notificationContainer.appendChild(notification);

    // Reproducir sonido de confirmación
    playNotificationSound();

    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 50);

    // Ocultar después de 2.5 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        notification.classList.remove('show');

        // Eliminar después de la animación
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

// Función para limpiar notificaciones existentes
function clearOldNotifications() {
    const container = document.getElementById('notification-container');
    if (container) {
        const notifications = container.querySelectorAll('.notification');
        if (notifications.length > 3) { // Máximo 3 notificaciones visibles
            // Remover las más antiguas
            for (let i = 0; i < notifications.length - 3; i++) {
                notifications[i].classList.add('hide');
                setTimeout(() => {
                    if (notifications[i].parentNode) {
                        notifications[i].parentNode.removeChild(notifications[i]);
                    }
                }, 300);
            }
        }
    }
}

// Función para reproducir sonido de confirmación
function playNotificationSound() {
    try {
        // Crear un sonido usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Fallback silencioso si no se puede reproducir el sonido
        console.log('No se pudo reproducir el sonido de notificación');
    }
}

// Función específica para reproducir sonido al agregar al carrito
function playAddToCartSound() {
    try {
        // Crear un sonido más distintivo para agregar al carrito
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Primer tono (grave)
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(400, audioContext.currentTime);
        gainNode1.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.15);
        
        // Segundo tono (agudo) - suena después
        setTimeout(() => {
            try {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();
                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);
                
                oscillator2.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
                gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
                
                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.25);
            } catch (e) {
                console.log('Error en segundo tono del sonido de carrito');
            }
        }, 100);
        
    } catch (e) {
        // Fallback: usar sonido de notificación normal
        console.log('Error en sonido de carrito, usando sonido por defecto');
        playNotificationSound();
    }
}

// === FUNCIONES DE CONFIRMACIÓN ===

function showConfirmation(message, onConfirm) {
    const modal = document.getElementById('confirmation-modal');
    const messageElement = document.getElementById('confirmation-message');
    const confirmBtn = document.getElementById('confirm-yes');
    const cancelBtn = document.getElementById('confirm-no');

    if (!modal) return;

    messageElement.textContent = message;
    modal.style.display = 'flex';

    // Limpiar listeners anteriores
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Agregar nuevos listeners
    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        onConfirm();
    });

    newCancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar con ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// === FUNCIONES DE CHECKOUT ===

function processCheckout() {
    const usuario = JSON.parse(localStorage.getItem("usuario-ares"));
    
    if (!usuario || !usuario.id) {
        showNotification("Debes iniciar sesión para completar la compra");
        return;
    }

    if (cart.length === 0) {
        showNotification("Tu carrito está vacío");
        return;
    }

    showConfirmation("¿Confirmar compra?", () => {
        const pedido = {
            idUsuario: usuario.id,
            items: cart.map(item => ({
                nombre: item.name,
                cantidad: item.qty,
                precio: parseFloat(item.price.replace(/[^\d.]/g, ''))
            }))
        };

        fetch("http://localhost:3000/api/pedido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Pedido confirmado:", data);
            showNotification("¡Compra realizada con éxito!");
            cart = [];
            saveCart();
            updateCartDisplay();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        })
        .catch(error => {
            console.error("❌ Error al enviar pedido:", error);
            showNotification("Error al procesar la compra. Intenta de nuevo.");
        });
    });
}


// === CONFIGURACIÓN DE LISTENERS PARA PRODUCTOS ===

function setAddToCartListeners() {
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log(`🛒 Configurando ${buttons.length} botones "Agregar al Carro"`);
    
    buttons.forEach((btn, index) => {
        btn.onclick = function (event) {
            console.log(`🔘 Click en botón ${index + 1}`);
            event.preventDefault();
            
            const card = btn.closest('.product-card');
            if (card) {
                console.log('📦 Product card encontrada:', card);
                try {
                    addToCart(card);
                } catch (error) {
                    console.error('❌ Error al agregar al carrito:', error);
                    showNotification('Error al agregar producto al carrito');
                }
            } else {
                console.error('❌ No se encontró product-card para el botón');
            }
        };
    });
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando carrito...');
    console.log('📍 Página actual:', window.location.pathname);
    
    // Cargar carrito
    loadCart();
    
    // Esperar un poco antes de configurar los listeners para asegurarse de que el DOM esté listo
    setTimeout(() => {
        console.log('⚙️ Configurando listeners...');
        setAddToCartListeners();
        setBuyNowListeners(); // Add buy now listeners
        
        // Verificar que los listeners se configuraron
        const buttons = document.querySelectorAll('.add-to-cart');
        const buyNowButtons = document.querySelectorAll('.buy-now');
        console.log(`✅ ${buttons.length} botones "Agregar al Carro" encontrados y configurados`);
        console.log(`✅ ${buyNowButtons.length} botones "Comprar Ahora" encontrados y configurados`);
        
        // Verificar estructura de algunos product cards
        const cards = document.querySelectorAll('.product-card');
        console.log(`📦 ${cards.length} product cards encontradas`);
        
        if (cards.length > 0) {
            const firstCard = cards[0];
            console.log('🔍 Estructura del primer product card:', {
                hasH4: !!firstCard.querySelector('h4'),
                hasPrice: !!firstCard.querySelector('p strong'),
                hasImg: !!firstCard.querySelector('img'),
                hasButton: !!firstCard.querySelector('.add-to-cart')
            });
        }
    }, 100);

    // Configurar checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }

    // Actualizar display inicial
    updateCartDisplay();

    // Auto-test si estamos en la página de carrito (para debugging)
    if (window.location.pathname.includes('carrito.html')) {
        console.log('📋 Página de carrito detectada');

        // Verificar si hay elementos necesarios
        const cartItemsList = document.getElementById('cart-items-list');
        const recommendationsList = document.getElementById('recommendations-list');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        console.log('Elementos detectados:', {
            cartItemsList: !!cartItemsList,
            recommendationsList: !!recommendationsList,
            emptyCartMessage: !!emptyCartMessage
        });

        // Forzar actualización de la página del carrito
        setTimeout(() => {
            updateCartPage();
        }, 100);
    }

    console.log('✅ Carrito inicializado correctamente');
});

// === FUNCIONES GLOBALES PARA COMPATIBILIDAD ===

// Función para mostrar modal del carrito (para compatibilidad con suple.js)
function showCartModal() {
    window.location.href = 'carrito.html';
}

// Función para toggle del carrito (para compatibilidad con header)
function toggleCart() {
    window.location.href = 'carrito.html';
}

// Función para reinicializar el carrito (útil después de cargar contenido dinámico)
function reinitializeCart() {
    console.log('🔄 Reinicializando carrito...');
    setAddToCartListeners();
    setBuyNowListeners(); // Add buy now listeners
    updateCartDisplay();
    console.log('✅ Carrito reinicializado');
}

// Función de debugging para probar el carrito
function debugCart() {
    console.log('🐛 Debug del carrito:');
    console.log('📦 Carrito actual:', cart);
    console.log('🔢 Total de items:', cart.reduce((sum, item) => sum + item.qty, 0));
    
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('🔘 Botones encontrados:', buttons.length);
    
    const cards = document.querySelectorAll('.product-card');
    console.log('📋 Product cards encontradas:', cards.length);
    
    // Simular click en el primer botón
    if (buttons.length > 0) {
        console.log('🧪 Simulando click en primer botón...');
        buttons[0].click();
    }
}

// Exportar funciones para uso global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.continueShopping = continueShopping;
window.browseProducts = browseProducts;
window.addRecommendedToCart = addRecommendedToCart;
window.showCartModal = showCartModal;
window.toggleCart = toggleCart;
window.setAddToCartListeners = setAddToCartListeners;
window.reinitializeCart = reinitializeCart;
window.debugCart = debugCart;
window.testCart = testCart;
window.reinitializeCart = reinitializeCart;
window.debugCart = debugCart;

// === TEST FUNCTIONALITY ===

// Function to add sample products for testing
function addSampleProducts() {
    const sampleProducts = [
        {
            name: "Platinum 100% Creatine",
            price: "S/ 125.00",
            img: "Imagenes/produ1.png",
            qty: 1,
            categories: ["Muscletech", "Sin sabor", "Creatina monohidratada (5g)"]
        },
        {
            name: "Gold Standard 100% Whey",
            price: "S/ 185.00",
            img: "Imagenes/produ4.png",
            qty: 2,
            categories: ["Optimum Nutrition", "Caramelo", "Proteína de suero, BCAA"]
        }
    ];

    cart = sampleProducts;
    saveCart();
    updateCartDisplay();
    showNotification('Productos de prueba agregados');
}

// Función de testing completa
function testCart() {
    console.log('🧪 Iniciando test completo del carrito...');
    
    // Test 1: Verificar que el carrito esté inicializado
    console.log('Test 1: Carrito inicializado:', typeof cart !== 'undefined');
    console.log('Contenido actual del carrito:', cart);
    
    // Test 2: Verificar botones
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Test 2: Botones encontrados:', buttons.length);
    
    // Test 3: Verificar product cards
    const cards = document.querySelectorAll('.product-card');
    console.log('Test 3: Product cards encontradas:', cards.length);
    
    // Test 4: Verificar estructura de una card
    if (cards.length > 0) {
        const testCard = cards[0];
        const hasName = !!testCard.querySelector('h4');
        const hasPrice = !!testCard.querySelector('p strong');
        const hasImg = !!testCard.querySelector('img');
        const hasButton = !!testCard.querySelector('.add-to-cart');
        
        console.log('Test 4: Estructura de product card:', {
            hasName, hasPrice, hasImg, hasButton
        });
        
        // Test 5: Simular agregar producto
        if (hasName && hasPrice && hasImg && hasButton) {
            console.log('Test 5: Intentando agregar producto de prueba...');
            try {
                addToCart(testCard);
                console.log('✅ Producto agregado exitosamente');
                console.log('Carrito después del test:', cart);
            } catch (error) {
                console.error('❌ Error al agregar producto:', error);
            }
        }
    }
    
    // Test 6: Verificar localStorage
    const savedCart = localStorage.getItem('ares-cart');
    console.log('Test 6: Carrito en localStorage:', savedCart);
    
    console.log('🏁 Test completo del carrito finalizado');
}

// Function to test the cart system
function testCart() {
    console.log('🧪 Testing cart system...');
    console.log('Current cart:', cart);

    if (cart.length === 0) {
        console.log('Cart is empty, adding sample products...');
        addSampleProducts();
    }

    updateCartDisplay();
    console.log('✅ Cart test completed');
}

// === ENHANCED CART FUNCTIONALITY ===

// Function to get cart statistics
function getCartStats() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalValue = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        return sum + (price * item.qty);
    }, 0);

    return {
        totalItems,
        totalValue,
        averagePrice: totalItems > 0 ? totalValue / totalItems : 0
    };
}

// === BUY NOW FUNCTIONALITY ===

// Function to handle "Buy Now" button clicks
function buyNow(productCard) {
    console.log('🛒 Iniciando compra inmediata...');
    
    try {
        // Add product to cart first
        addToCart(productCard);
        
        // Redirect to cart page immediately
        setTimeout(() => {
            window.location.href = 'carrito.html';
        }, 500); // Small delay to ensure cart is updated
        
        console.log('✅ Redirigiendo al carrito...');
        
    } catch (error) {
        console.error('❌ Error en buyNow:', error);
        showNotification('Error al procesar la compra');
    }
}

// Function to set up buy now listeners
function setBuyNowListeners() {
    console.log('🔧 Configurando listeners para botones "Comprar Ahora"...');
    
    const buyNowButtons = document.querySelectorAll('.buy-now');
    
    buyNowButtons.forEach(btn => {
        // Remove any existing listeners
        btn.removeEventListener('click', handleBuyNowClick);
        
        // Add new listener
        btn.addEventListener('click', handleBuyNowClick);
    });
    
    console.log(`✅ ${buyNowButtons.length} botones "Comprar Ahora" configurados`);
}

// Handler function for buy now button clicks
function handleBuyNowClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const productCard = button.closest('.product-card');
    
    if (productCard) {
        buyNow(productCard);
    } else {
        console.error('❌ No se encontró la tarjeta del producto');
        showNotification('Error: No se pudo identificar el producto');
    }
}

// === EXPORT FUNCTIONS FOR GLOBAL USE ===
window.addSampleProducts = addSampleProducts;
window.testCart = testCart;
window.getCartStats = getCartStats;
window.buyNow = buyNow;
window.setBuyNowListeners = setBuyNowListeners;

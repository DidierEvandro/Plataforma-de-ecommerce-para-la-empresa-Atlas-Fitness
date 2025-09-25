// --- Banner principal (slider) ---
let currentSlide = 0;
let slides, bannerSlides, totalSlides;

function showSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    bannerSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// --- Filtrado de suplementos por categoría o sabor ---
function filtrarSuplementos(cat) {
    const cards = document.querySelectorAll('#suplementos-slider .product-card');
    if (cat === 'todos') {
        cards.forEach(card => card.style.display = 'flex');
    } else {
        cards.forEach(card => {
            if (card.classList.contains(cat)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

function filtrarExtras(cat) {
    const cards = document.querySelectorAll('#extras-slider .product-card');
    if (cat === 'todos') {
        cards.forEach(card => card.style.display = 'flex');
    } else {
        cards.forEach(card => {
            if (card.classList.contains(cat)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// --- Slider de suplementos ---
const totalProducts = 18;
const rows = 2;
let currentSlideSup = 0;

function getCols() {
    if(window.innerWidth <= 600) return 1;
    if(window.innerWidth <= 900) return 2;
    if(window.innerWidth <= 1200) return 4;
    return 6;
}

function moverSuplementos(dir) {
    const slider = document.getElementById('suplementos-slider');
    const colsNow = getCols();
    const productsPerPage = colsNow * rows;
    const maxSlide = Math.ceil(totalProducts / productsPerPage) - 1;
    currentSlideSup += dir;
    if(currentSlideSup < 0) currentSlideSup = 0;
    if(currentSlideSup > maxSlide) currentSlideSup = maxSlide;
    const move = currentSlideSup * 100;
    slider.style.transform = `translateX(-${move}%)`;
}

// --- Slider de membresías ---
function moverMembresias(dir) {
    const slider = document.getElementById('membresias-slider');
    const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(slider).transform);
    const currentX = currentTransform.m41;
    const containerWidth = slider.parentElement.offsetWidth;
    const sliderWidth = slider.offsetWidth;
    
    let newX = currentX + (dir * containerWidth);
    
    // Prevent scrolling beyond boundaries
    if (newX > 0) newX = 0;
    if (newX < -(sliderWidth - containerWidth)) newX = -(sliderWidth - containerWidth);
    
    slider.style.transform = `translateX(${newX}px)`;
}

// --- Slider de extras ---
function moverExtras(dir) {
    const slider = document.getElementById('extras-slider');
    const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(slider).transform);
    const currentX = currentTransform.m41;
    const containerWidth = slider.parentElement.offsetWidth;
    const sliderWidth = slider.offsetWidth;
    
    let newX = currentX + (dir * containerWidth);
    
    // Prevent scrolling beyond boundaries
    if (newX > 0) newX = 0;
    if (newX < -(sliderWidth - containerWidth)) newX = -(sliderWidth - containerWidth);
    
    slider.style.transform = `translateX(${newX}px)`;
}

// --- Carrito de compras (delegado a carrito.js) ---
// La lógica del carrito se ha movido a carrito.js para una mejor organización

function buscarProductos(query, sliderId) {
    query = query.toLowerCase();
    const productos = document.querySelectorAll(`#${sliderId} .product-card`);
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h4').textContent.toLowerCase();
        const categorias = Array.from(producto.querySelectorAll('.category-btn'))
            .map(btn => btn.textContent.toLowerCase());
        const descripcion = producto.querySelector('p:not(:first-of-type)')
            .textContent.toLowerCase();
        
        if (nombre.includes(query) || 
            categorias.some(cat => cat.includes(query)) || 
            descripcion.includes(query)) {
            producto.style.display = 'flex';
        } else {
            producto.style.display = 'none';
        }
    });
}

// --- Banner toggle ---
let bannerVisible = true;
let toggleBannerBtn, bannerContainer;

document.addEventListener('DOMContentLoaded', function() {
    // Banner slider setup
    slides = document.querySelectorAll('.banner-slide');
    bannerSlides = document.querySelector('.banner-slides');
    totalSlides = slides.length;

    setInterval(nextSlide, 4000);

    // Slider responsive
    window.addEventListener('resize', () => {
        currentSlideSup = 0;
        moverSuplementos(0);
    });

    // Banner toggle
    toggleBannerBtn = document.getElementById('toggle-banner-btn');
    bannerContainer = document.getElementById('banner-container');
    if (toggleBannerBtn) {
        toggleBannerBtn.addEventListener('click', function() {
            bannerVisible = !bannerVisible;
            if (bannerVisible) {
                bannerContainer.style.display = '';
                toggleBannerBtn.innerHTML = 'Ocultar &#9650;';
            } else {
                bannerContainer.style.display = 'none';
                toggleBannerBtn.innerHTML = 'Mostrar &#9660;';
            }
        });
    }

    // Carrito configurado en carrito.js
    // No necesitamos configurar listeners aquí ya que carrito.js se encarga de ello
});



// --- Sidebar Filters Functionality ---

// Toggle filter sections
function toggleFilterSection(sectionId) {
    const content = document.getElementById(sectionId);
    const toggle = content.previousElementSibling;
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        toggle.classList.remove('active');
    } else {
        content.classList.add('active');
        toggle.classList.add('active');
    }
}

// Update price range display
function updatePriceRange() {
    const minSlider = document.getElementById('min-price-slider');
    const maxSlider = document.getElementById('max-price-slider');
    const minDisplay = document.getElementById('min-price-display');
    const maxDisplay = document.getElementById('max-price-display');
    const minInput = document.getElementById('min-price-input');
    const maxInput = document.getElementById('max-price-input');
    
    let minValue = parseInt(minSlider.value);
    let maxValue = parseInt(maxSlider.value);
    
    // Ensure min is not greater than max
    if (minValue > maxValue) {
        minValue = maxValue;
        minSlider.value = minValue;
    }
    
    minDisplay.textContent = minValue;
    maxDisplay.textContent = maxValue;
    minInput.value = minValue;
    maxInput.value = maxValue;
}

// Sync price slider with input
function syncPriceSlider(type) {
    if (type === 'min') {
        const input = document.getElementById('min-price-input');
        const slider = document.getElementById('min-price-slider');
        const maxSlider = document.getElementById('max-price-slider');
        
        let value = parseInt(input.value) || 0;
        value = Math.max(0, Math.min(value, parseInt(maxSlider.value)));
        
        slider.value = value;
        input.value = value;
        document.getElementById('min-price-display').textContent = value;
    } else {
        const input = document.getElementById('max-price-input');
        const slider = document.getElementById('max-price-slider');
        const minSlider = document.getElementById('min-price-slider');
        
        let value = parseInt(input.value) || 2000;
        value = Math.min(2000, Math.max(value, parseInt(minSlider.value)));
        
        slider.value = value;
        input.value = value;
        document.getElementById('max-price-display').textContent = value;
    }
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const cards = document.querySelectorAll('#productos-slider .product-card, .suplementos-slider .product-card');
    
    // Get selected filters (removed type filter since we removed it from sidebar)
    const selectedBrands = getCheckedValues('#brand input[type="checkbox"]:checked');
    const selectedFlavors = getCheckedValues('#flavor input[type="checkbox"]:checked');
    const selectedFunctionalities = getCheckedValues('#functionality input[type="checkbox"]:checked');
    
    // Get price range if elements exist
    const minPrice = document.getElementById('min-price-input') ? parseInt(document.getElementById('min-price-input').value) || 0 : 0;
    const maxPrice = document.getElementById('max-price-input') ? parseInt(document.getElementById('max-price-input').value) || 2000 : 2000;
    
    // Desactivar botones de categoría cuando se usan filtros de la barra lateral
    const hasActiveFilters = selectedBrands.length > 0 || selectedFlavors.length > 0 || selectedFunctionalities.length > 0;
    if (hasActiveFilters) {
        document.querySelectorAll('.suplemento-cat-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    cards.forEach(card => {
        let showCard = true;
        
        // Filter by brand
        if (selectedBrands.length > 0 && showCard) {
            const cardBrand = getProductBrand(card);
            const hasBrand = selectedBrands.some(brand => cardBrand === brand);
            if (!hasBrand) showCard = false;
        }
        
        // Filter by flavor
        if (selectedFlavors.length > 0 && showCard) {
            const hasFlavor = selectedFlavors.some(flavor => card.classList.contains(flavor));
            if (!hasFlavor) showCard = false;
        }
        
        // Filter by functionality
        if (selectedFunctionalities.length > 0 && showCard) {
            const cardFunctionality = getProductFunctionality(card);
            const hasFunctionality = selectedFunctionalities.some(func => cardFunctionality.includes(func));
            if (!hasFunctionality) showCard = false;
        }
        
        // Filter by price
        if (showCard) {
            const cardPrice = getProductPrice(card);
            if (cardPrice < minPrice || cardPrice > maxPrice) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'flex' : 'none';
    });
}

// Helper function to get checked values
function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector)).map(input => input.value);
}

// Helper function to get product brand
function getProductBrand(card) {
    const categories = card.querySelectorAll('.category-btn');
    const brandText = categories[0]?.textContent.toLowerCase() || '';
    
    // Map brand names to filter values
    const brandMap = {
        'muscletech': 'muscletech',
        'optimum nutrition': 'optimum-nutrition',
        'vecos nutriceutical': 'vecos',
        'powergym': 'powergym',
        'amix': 'amix',
        'biotechusa': 'biotech',
        'dymatize': 'dymatize',
        'evolution': 'evolution',
        'costa': 'costa',
        'pepsico': 'gatorade',
        'gatorade': 'gatorade',
        'coca-cola': 'powerade',
        'powerade': 'powerade',
        'the coca-cola company': 'powerade',
        'ajegroup': 'otras-marcas'
    };
    
    for (const [brand, value] of Object.entries(brandMap)) {
        if (brandText.includes(brand)) {
            return value;
        }
    }
    
    return 'otras-marcas';
}

// Helper function to get product functionality
function getProductFunctionality(card) {
    const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p:last-of-type')?.textContent.toLowerCase() || '';
    const categories = Array.from(card.querySelectorAll('.category-btn')).map(btn => btn.textContent.toLowerCase()).join(' ');
    
    const text = `${title} ${description} ${categories}`;
    
    const functionalities = [];
    
    if (text.includes('proteína') || text.includes('protein') || text.includes('masa') || text.includes('muscle')) {
        functionalities.push('construccion-muscular');
    }
    if (text.includes('energía') || text.includes('energy') || text.includes('pre') || text.includes('rendimiento')) {
        functionalities.push('energia-rendimiento');
    }
    if (text.includes('recuperación') || text.includes('recovery') || text.includes('post') || text.includes('hmb')) {
        functionalities.push('recuperacion');
    }
    if (text.includes('hidratación') || text.includes('electrolitos') || text.includes('isotónica') || text.includes('deportiva')) {
        functionalities.push('hidratacion');
    }
    if (text.includes('carnitina') || text.includes('quemador') || text.includes('peso')) {
        functionalities.push('perdida-peso');
    }
    if (text.includes('vitamina') || text.includes('salud') || text.includes('antioxidante')) {
        functionalities.push('salud-general');
    }
    if (text.includes('membresía') || text.includes('giftcard') || text.includes('sede')) {
        functionalities.push('acceso-gimnasio');
    }
    
    return functionalities;
}

// Helper function to get product price
function getProductPrice(card) {
    const priceText = card.querySelector('p strong')?.textContent || '';
    const price = parseFloat(priceText.replace('S/', '').replace(',', '').trim()) || 0;
    return price;
}

// Clear all filters
function clearAllFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price range if elements exist
    if (document.getElementById('min-price-slider')) {
        document.getElementById('min-price-slider').value = 0;
        document.getElementById('max-price-slider').value = 2000;
        document.getElementById('min-price-input').value = 0;
        document.getElementById('max-price-input').value = 2000;
        document.getElementById('min-price-display').textContent = '0';
        document.getElementById('max-price-display').textContent = '2000';
    }
    
    // Remove active class from category buttons
    document.querySelectorAll('.suplemento-cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show all products
    const cards = document.querySelectorAll('#productos-slider .product-card, .suplementos-slider .product-card');
    cards.forEach(card => card.style.display = 'flex');
}

// Nueva función para manejar el toggle de filtros con estado visual
function toggleFiltro(category, buttonElement) {
    console.log('toggleFiltro called with category:', category);
    
    // Obtener todos los botones de filtro
    const allButtons = document.querySelectorAll('.suplemento-cat-btn');
    
    // Verificar si el botón ya está activo
    const isActive = buttonElement.classList.contains('active');
    
    // Remover clase active de todos los botones
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Obtener todas las tarjetas de productos
    const cards = document.querySelectorAll('#productos-slider .product-card');
    
    if (isActive) {
        // Si el botón estaba activo, desactivarlo y mostrar todos los productos
        console.log('Desactivando filtro, mostrando todos los productos');
        cards.forEach(card => {
            card.style.display = 'flex';
        });
    } else {
        // Si el botón no estaba activo, activarlo y filtrar productos
        buttonElement.classList.add('active');
        console.log('Activando filtro para:', category);
        
        let visibleCount = 0;
        cards.forEach(card => {
            let shouldShow = false;
            
            // Verificar si la tarjeta tiene la clase requerida
            if (card.classList.contains(category)) {
                shouldShow = true;
                visibleCount++;
            }
            
            // Mostrar u ocultar la tarjeta
            card.style.display = shouldShow ? 'flex' : 'none';
        });
        
        console.log(`Filtro aplicado para ${category}: ${visibleCount} productos mostrados`);
    }
}

// Initialize toggle states for filter sections
function initializeFilterSections() {
    const filterSections = document.querySelectorAll('.filter-content');
    filterSections.forEach(section => {
        section.style.display = 'block';
        section.classList.add('active');
    });
    
    const filterToggles = document.querySelectorAll('.filter-toggle');
    filterToggles.forEach(toggle => {
        toggle.classList.add('active');
    });
}

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter sections
    initializeFilterSections();
    
    // Initialize price range if elements exist
    if (document.getElementById('min-price-slider')) {
        updatePriceRange();
        
        // Set up price range event listeners
        document.getElementById('min-price-slider').addEventListener('input', updatePriceRange);
        document.getElementById('max-price-slider').addEventListener('input', updatePriceRange);
    }
    
    // Make sure all products are visible initially
    const cards = document.querySelectorAll('#productos-slider .product-card, .suplementos-slider .product-card');
    cards.forEach(card => card.style.display = 'flex');
    
    // Reinitializar carrito después de que todo esté cargado
    setTimeout(() => {
        if (window.reinitializeCart) {
            window.reinitializeCart();
        }
    }, 200);
});
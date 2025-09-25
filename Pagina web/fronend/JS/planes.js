document.addEventListener('DOMContentLoaded', function() {
    // ===== EFECTO PARALLAX =====
    const gymSection = document.querySelector('.gym-section');
    const bannerImage = document.querySelector('.banner-image');
    const bannerContent = document.querySelector('.banner-content');
    
    // Marcar la página como cargada
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);

    // Configurar Intersection Observer para animaciones
    const setupIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Efecto especial para las tarjetas de planes
                    if (entry.target.classList.contains('plan-card')) {
                        setTimeout(() => {
                            entry.target.style.transform = 'translateY(0) rotateY(0)';
                        }, 50);
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar todos los elementos con animación
        document.querySelectorAll('.plan-card, .gym-section').forEach(el => {
            observer.observe(el);
        });
    };

    // Efecto Parallax mejorado
    const setupParallax = () => {
        if (!gymSection || !bannerImage) return;

        const parallaxEffect = () => {
            const scrollPosition = window.scrollY;
            const sectionPosition = gymSection.offsetTop;
            const sectionHeight = gymSection.offsetHeight;
            
            // Solo activar cuando la sección está visible
            if (scrollPosition > sectionPosition - window.innerHeight && 
                scrollPosition < sectionPosition + sectionHeight) {
                
                // Calcular la intensidad del parallax
                const parallaxIntensity = (scrollPosition - sectionPosition) / sectionHeight;
                const scaleValue = 1.1 - (parallaxIntensity * 0.1);
                
                bannerImage.style.transform = `scale(${Math.max(1, scaleValue)}) translateZ(${parallaxIntensity * -0.5}px)`;
                gymSection.classList.toggle('parallax-effect', scrollPosition > sectionPosition);
            }
        };

        // Optimización con requestAnimationFrame y throttle
        let lastScroll = 0;
        const throttleParallax = () => {
            const now = Date.now();
            if (now - lastScroll >= 16) { // ~60fps
                parallaxEffect();
                lastScroll = now;
            }
        };

        window.addEventListener('scroll', throttleParallax);
        parallaxEffect(); // Ejecutar al cargar
    };

    // ===== INTERACTIVIDAD DE BOTONES =====
    const setupButtons = () => {
        const buttons = document.querySelectorAll('.btn-magic');
        
        buttons.forEach(button => {
            // Efecto hover con GSAP (opcional) o con CSS
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'none';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.animation = 'pulse 3s infinite';
            });
            
            // Efecto de clic
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Efecto de onda
                const wave = document.createElement('span');
                wave.className = 'button-wave';
                button.appendChild(wave);
                
                // Posicionar la onda
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                wave.style.width = wave.style.height = `${size}px`;
                wave.style.left = `${e.clientX - rect.left - size/2}px`;
                wave.style.top = `${e.clientY - rect.top - size/2}px`;
                
                // Eliminar después de la animación
                setTimeout(() => {
                    wave.remove();
                }, 1000);
                
                // Navegar después de la animación
                setTimeout(() => {
                    window.location.href = button.closest('a').href;
                }, 300);
            });
        });
    };

    // ===== RESPONSIVIDAD DINÁMICA =====
    const handleResponsive = () => {
        // Ajustar altura del banner en móviles
        if (window.innerWidth < 768) {
            document.documentElement.style.setProperty('--banner-height', '80vh');
        } else {
            document.documentElement.style.setProperty('--banner-height', '100vh');
        }
    };

    // ===== INICIALIZACIÓN =====
    const init = () => {
        setupIntersectionObserver();
        setupParallax();
        setupButtons();
        handleResponsive();
        
        // Precargar imágenes importantes
        const preloadImages = () => {
            const images = [
                'Imagenes/Gym-4.1.PNG',
                'Imagenes/logo.png'
            ];
            
            images.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        };
        
        preloadImages();
    };

    // Event listeners
    window.addEventListener('resize', handleResponsive);
    window.addEventListener('load', init);
});

// ===== POLYFILLS PARA NAVEGADORES ANTIGUOS =====
// Polyfill para IntersectionObserver si es necesario
if (!('IntersectionObserver' in window)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js';
    document.head.appendChild(script);
}

// Polyfill para requestAnimationFrame
(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
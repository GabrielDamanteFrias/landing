// --- Gerenciamento de Tema ---
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
}

// Define o tema com base no localStorage ou preferência do sistema
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}


// --- Menu Mobile ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fecha o menu ao clicar em um link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// --- Efeito de Digitação (Typed.js) ---
document.addEventListener('DOMContentLoaded', () => {
    new Typed('#typed-subtitle', {
        strings: ['Dev Front-End'],
        typeSpeed: 50,
        loop: false,
    });
});


// --- Animação de Scroll (Intersection Observer) ---
const sections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Anima apenas uma vez
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- Carousel de Projetos ---
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('[data-index]');
    let currentIndex = 0;
    const totalSlides = 3;

    function updateCarousel() {
        // Atualiza a posição do carousel
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.remove('bg-slate-300', 'dark:bg-neutral-700');
                indicator.classList.add('bg-indigo-600', 'dark:bg-indigo-500');
            } else {
                indicator.classList.add('bg-slate-300', 'dark:bg-neutral-700');
                indicator.classList.remove('bg-indigo-600', 'dark:bg-indigo-500');
            }
        });
    }

    // Event listeners para os botões
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });

    // Event listeners para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto-play do carousel (opcional)
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }, 5000); // Muda a cada 5 segundos

    // Pausa o autoplay quando o mouse está sobre o carousel
    const carouselContainer = document.querySelector('#projetos');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }, 5000);
    });

    // Suporte a gestos touch para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Quantidade mínima de pixels para considerar como swipe
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe para direita
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            } else {
                // Swipe para esquerda
                currentIndex = (currentIndex + 1) % totalSlides;
            }
            updateCarousel();
        }
    }
});

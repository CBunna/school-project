document.addEventListener('DOMContentLoaded', function() {
    

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
        
            navToggle.textContent = isExpanded ? '✕' : '☰';
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
            });
        });
    }
    
    

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
        
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
  
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
 
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            

            if (!data.name || !data.email || !data.subject || !data.message) {
                showMessage('Prosím vyplňte všechna povinná pole.', 'error');
                return;
            }
            
 
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Prosím zadejte platnou e-mailovou adresu.', 'error');
                return;
            }
            
     
            console.log('Form data:', data);
            
   
            showMessage('Děkujeme za vaši zprávu! Odpovíme vám co nejdříve.', 'success');
            
   
            contactForm.reset();
        });
    }
    
    

    function showMessage(message, type) {
 
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#2c5f2d' : '#d32f2f'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideDown 0.3s ease-out;
        `;
        

        document.body.appendChild(messageDiv);
        

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }
    
    

    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollTopBtn);
    

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    

    const animateElements = document.querySelectorAll('.card, .feature-item, .info-section');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateObserver.observe(el);
    });
    
    
 
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    
    // ===================================
    // ACCESSIBILITY: SKIP TO CONTENT
    // ===================================
    const skipLink = document.querySelector('.skip-link');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
    
    

    const activityForm = document.querySelector('form[action=""]');
    
    if (activityForm && window.location.pathname.includes('activities')) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(activityForm);
            const season = formData.get('season');
            const activity = formData.get('activity');
            const difficulty = formData.get('difficulty');
            const days = formData.get('days');
            
            if (!season || !activity) {
                showMessage('Prosím vyberte roční období a typ aktivity.', 'error');
                return;
            }
            
            console.log('Activity planner data:', {season, activity, difficulty, days});
            showMessage(`Skvělá volba! Připravujeme itinerář na ${days} dní...`, 'success');
        });
    }
    

    const filterForm = document.querySelector('form[action=""]');
    
    if (filterForm && window.location.pathname.includes('accommodation')) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(filterForm);
            const filters = {
                type: formData.get('type'),
                location: formData.get('location'),
                price: formData.get('price')
            };
            
            console.log('Filtering with:', filters);
            

            showMessage('Filtrujeme ubytování podle vašich kritérií...', 'success');
        });
    }
    
    

    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                        window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        

    });
    
    
  
    console.log('%c🏔️ Beskydy Region Tourism Website', 'font-size: 20px; font-weight: bold; color: #2c5f2d;');
    console.log('%cStudent Project - PEF CZU', 'font-size: 14px; color: #666;');
    console.log('%cFor Educational Purposes Only', 'font-size: 12px; color: #999;');
    
});



const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);



if ('serviceWorker' in navigator) {
    // Service worker would be registered here in production
    // navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker support detected (not registered in development)');
}



const API_BASE_URL = 'https://api.beskydy-region.cz'; 


async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}



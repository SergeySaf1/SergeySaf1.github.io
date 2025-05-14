document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    
    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        mobileMenuBtn.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрываем меню на мобильных
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Инициализация галереи
    const portfolioItems = [
        { img: 'images/brows/before-after-1.jpg', category: 'brows' },
        { img: 'images/lashes/before-after-1.jpg', category: 'lashes' },
        // Добавьте другие работы
    ];

    const portfolioGrid = document.querySelector('.portfolio-grid');
    const tabButtons = document.querySelectorAll('.tab-btn');

    function renderPortfolio(category = 'all') {
        portfolioGrid.innerHTML = '';
        
        portfolioItems.forEach(item => {
            if (category === 'all' || item.category === category) {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.dataset.category = item.category;
                portfolioItem.innerHTML = `
                    <img src="${item.img}" alt="Работа мастера">
                    <div class="portfolio-overlay">
                        <p>${item.category === 'brows' ? 'Брови' : 'Ресницы'}</p>
                    </div>
                `;
                portfolioGrid.appendChild(portfolioItem);
            }
        });
    }

    // Фильтрация работ
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderPortfolio(this.dataset.category);
        });
    });

    // Инициализация
    renderPortfolio();
});
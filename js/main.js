document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    
    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        mobileMenuBtn.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Smooth scrolling
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
                
                // Close mobile menu
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Portfolio gallery
    const portfolioItems = [
        { img: 'images/lamination/12345.jpg', category: 'lamination' },
        { img: 'images/correction/before-after-1.jpg', category: 'correction' },
        { img: 'images/shaping/1234.jpg', category: 'shaping' },
        { img: 'images/coloring/123.jpg', category: 'coloring' }
    ];

    const portfolioGrid = document.querySelector('.portfolio-grid');
    const tabButtons = document.querySelectorAll('.tab-btn');

    function renderPortfolio(category = 'lamination') {
        portfolioGrid.innerHTML = '';
        
        portfolioItems.forEach(item => {
            if (category === 'all' || item.category === category) {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.dataset.category = item.category;
                portfolioItem.innerHTML = `
                    <img src="${item.img}" alt="Пример работы">
                    <div class="portfolio-overlay">
                        <p>${getCategoryName(item.category)}</p>
                    </div>
                `;
                portfolioGrid.appendChild(portfolioItem);
            }
        });
    }

    function getCategoryName(category) {
        const names = {
            'lamination': 'Ламинирование',
            'correction': 'Коррекция',
            'shaping': 'Придание формы',
            'coloring': 'Окрашивание'
        };
        return names[category] || category;
    }

    // Filter portfolio
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderPortfolio(this.dataset.category);
        });
    });

    // Initialize with lamination
    renderPortfolio('lamination');
});
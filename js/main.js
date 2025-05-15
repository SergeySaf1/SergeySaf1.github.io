document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            mobileMenuBtn.innerHTML = navList.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

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
                
                if (navList && navList.classList.contains('active')) {
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

    function renderPortfolio(category = 'all') {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;
        
        portfolioGrid.innerHTML = '';
        
        portfolioItems.forEach(item => {
            if (category === 'all' || item.category === category) {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.innerHTML = `
                    <img src="${item.img}" alt="Пример работы">
                    <div class="portfolio-overlay">
                        <h3>${getCategoryName(item.category)}</h3>
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
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderPortfolio(this.dataset.category);
        });
    });

    // Initialize portfolio
    renderPortfolio('all');

    // Auto-scrolling photo folders
    document.querySelectorAll('.service-folder').forEach(folder => {
        const gallery = folder.querySelector('.service-gallery');
        if (!gallery) return;
        
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        let currentIndex = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Автоперелистывание
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 3000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        startSlideShow();
        
        folder.addEventListener('mouseenter', stopSlideShow);
        folder.addEventListener('mouseleave', startSlideShow);
    });

    // Folder buttons functionality
    document.querySelectorAll('.folder-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const serviceFolder = this.closest('.service-folder');
            if (serviceFolder) {
                const serviceName = serviceFolder.dataset.service;
                const serviceSelect = document.getElementById('service');
                
                if (serviceSelect) {
                    serviceSelect.value = serviceName;
                    
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        window.scrollTo({
                            top: bookingSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
});
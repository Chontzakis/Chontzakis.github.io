(function() {
  // Theme toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleFloating = document.getElementById('theme-toggle-floating');
  const themeIcon = themeToggleBtn?.querySelector('i');
  const themeIconFloating = themeToggleFloating?.querySelector('i');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
      if (themeIconFloating) {
        themeIconFloating.classList.remove('fa-moon');
        themeIconFloating.classList.add('fa-sun');
      }
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
      if (themeIconFloating) {
        themeIconFloating.classList.remove('fa-sun');
        themeIconFloating.classList.add('fa-moon');
      }
      localStorage.setItem('theme', 'dark');
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setTheme('light');
    else setTheme('dark');
  }

  // Add click listeners to both theme buttons
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  if (themeToggleFloating) {
    themeToggleFloating.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  loadTheme();

  // Contact dropdown functionality (supports both navbar and floating)
  const contactDropdowns = document.querySelectorAll('.contact-dropdown');
  
  contactDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.contact-toggle');
    if (!toggle) return;

    const closeContactMenu = () => {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      
      // Close all other dropdowns
      contactDropdowns.forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove('open');
          const t = d.querySelector('.contact-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      
      if (isOpen) {
        closeContactMenu();
      } else {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (event) => {
      contactDropdowns.forEach((d) => {
        if (!d.contains(event.target)) {
          d.classList.remove('open');
          const t = d.querySelector('.contact-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        contactDropdowns.forEach((d) => {
          d.classList.remove('open');
          const t = d.querySelector('.contact-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    dropdown.querySelectorAll('.contact-menu-item').forEach((item) => {
      item.addEventListener('click', () => {
        closeContactMenu();
        // Also close other dropdowns
        contactDropdowns.forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove('open');
            const t = d.querySelector('.contact-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });
  });

  // Active navigation link highlighting
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    let currentPage = 'home';
    if (currentPath.includes('projects.html')) currentPage = 'projects';
    else if (currentPath.includes('thesis.html')) currentPage = 'thesis';
    else if (currentPath.includes('education.html') || currentPath.includes('certifications.html')) currentPage = 'education';
    else if (currentPath.endsWith('/') || currentPath.endsWith('home.html') || currentPath === '' || currentPath.endsWith('index.html')) currentPage = 'home';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const linkPage = link.getAttribute('data-page');
      if (linkPage === currentPage) link.classList.add('active');
    });
  }
  setActiveNavLink();

  // Fade-in observer (for elements with .fade-in class)
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.9 });
  fadeElements.forEach(el => fadeObserver.observe(el));

  // Fade the thesis intro smoothly as it reaches the top-button area
  const thesisHero = document.getElementById('thesis-hero');
  if (thesisHero) {
    const fadeStart = 260;
    const fadeEnd = 80;
    let ticking = false;

    const updateThesisHeroFade = () => {
      const rect = thesisHero.getBoundingClientRect();
      const top = rect.top;

      if (top >= fadeStart) {
        thesisHero.style.opacity = '1';
        return;
      }

      const progress = Math.min(1, Math.max(0, (fadeStart - Math.max(top, fadeEnd)) / (fadeStart - fadeEnd)));
      thesisHero.style.opacity = (1 - progress).toString();
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateThesisHeroFade();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateThesisHeroFade();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }
})();


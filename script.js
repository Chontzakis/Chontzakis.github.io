(function() {
  // Theme toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn?.querySelector('i');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
      localStorage.setItem('theme', 'dark');
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setTheme('light');
    else setTheme('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      setTheme(isLight ? 'dark' : 'light');
    });
  }
  loadTheme();

  // Active navigation link highlighting
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    let currentPage = 'home';
    if (currentPath.includes('projects.html')) currentPage = 'projects';
    else if (currentPath.includes('thesis.html')) currentPage = 'thesis';
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
  }, { threshold: 0.1 });
  fadeElements.forEach(el => fadeObserver.observe(el));
})();
document.addEventListener("DOMContentLoaded", () => {
  // Fade-in observer
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));

  // --- THEME TOGGLE LOGIC ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn?.querySelector('i');

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    // default dark
    document.body.classList.remove('light-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  // Notify canvas of theme change (canvas will redraw)
  function notifyCanvasTheme() {
    const isLight = document.body.classList.contains('light-theme');
    // Dispatch a custom event so background_home.js can react
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isLight } }));
  }

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
    notifyCanvasTheme();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // initial notification to canvas
  notifyCanvasTheme();
});

// Sidebar toggle functions (unchanged)
function toggleNav() {
  const sidebar = document.getElementById("mySidebar");
  const main = document.getElementById("main");
  if (sidebar.style.width === "300px" || sidebar.classList.contains('active')) {
    closeNav();
  } else {
    openNav();
  }
}

function openNav() {
  document.getElementById("mySidebar").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

// Ensure menu-toggle exists (if you have one)
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) menuToggle.addEventListener('click', toggleNav);
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});

// Simple toggle functions
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

document.querySelector('.menu-toggle').addEventListener('click', toggleNav);
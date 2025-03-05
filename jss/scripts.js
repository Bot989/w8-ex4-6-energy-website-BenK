// js/scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const navLinks = document.querySelectorAll('#navigation a');
    const powerLogo = document.getElementById('power-logo');
    
    // Get content sections
    const homeContent = document.getElementById('home-content');
    const televisionsContent = document.getElementById('televisions-content');
    const aboutContent = document.getElementById('about-content');
    
    // Show a specific content section and update navigation
    function showPage(pageName) {
        // Hide all content sections
        homeContent.style.display = 'none';
        televisionsContent.style.display = 'none';
        aboutContent.style.display = 'none';
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show the selected content and mark corresponding nav as active
        if (pageName === 'home') {
            homeContent.style.display = 'block';
            document.querySelector('[data-page="home"]').classList.add('active');
        } else if (pageName === 'televisions') {
            televisionsContent.style.display = 'block';
            document.querySelector('[data-page="televisions"]').classList.add('active');
        } else if (pageName === 'about') {
            aboutContent.style.display = 'block';
            document.querySelector('[data-page="about"]').classList.add('active');
        }
    }
    
    // Add click events to navigation linkss
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Add click event to logo to return to home page
    powerLogo.addEventListener('click', function() {
        showPage('home');
    });
});
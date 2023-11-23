console.log('Hello from script.js');
let currentUrl = window.location.pathname;

// Get all the anchor elements
let links = document.querySelectorAll('a');

// Loop through each link and check if its href matches the current URL
links.forEach(function (link) {
    if (link.getAttribute('href') === currentUrl) {
        link.classList.add('active'); // Add the 'active' class to the matching link
    }
});
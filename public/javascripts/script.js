console.log('Hello from script.js');
let currentUrl = window.location.pathname;
// import Toastify from 'toastify-js';
// Highlight active link
let links = document.querySelectorAll('a');

links.forEach(function (link) {
    if (link.getAttribute('href') === currentUrl) {
        link.classList.add('active');
    }
});

// Register logic

const authenticatedNav = document.getElementById('authenticated'); // Fix typo
const unAuthenticatedNav = document.getElementById('unauthenticated'); // Fix typo
const logoutButton = document.getElementById('logout');


const logout = async () => {
    const isAuthenticated = localStorage.getItem('token');
    if (isAuthenticated) {
        Swal.fire({
            title: `<b style='font-size:3rem; color:black;'>Are you sure!</b>`,
            html: `<strong style='color:red;font-size:1.5rem;'>You won't be able to take notes!</strong>`,
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Logout',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            // reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                Swal.fire({
                    title: `<b style='font-size:2rem; color:green;'>Logged out Successfully!</b>`,
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    showConfirmButton: false,
                    showCloseButton: false,
                    timer: 1500,
                }).then(() => {
                    window.location.replace('/login');
                })
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: `<b style='font-size:2rem; color:red;'>Cancelled!</b>`,
                    icon: 'error',
                    confirmButtonText: 'Continue',
                    showConfirmButton: false,
                    showCloseButton: false,
                    timer: 1500,
                })
            }
        })
        // localStorage.removeItem('token');
        // window.location.replace('/');
    }
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

const checkAuth = () => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
        authenticatedNav.style.display = 'block';
        unAuthenticatedNav.style.display = 'none';
    } else {
        authenticatedNav.style.display = 'none';
        unAuthenticatedNav.style.display = 'block';
    }
}







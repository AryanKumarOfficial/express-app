// import Toastify from 'toastify-js';
console.log('login.js loaded');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginSubmit');
const loginEmailInput = document.querySelector('#lemail');
const loginPasswordInput = document.querySelector('#lpassword');

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        let formData = { email: loginEmailInput.value, password: loginPasswordInput.value }
        console.log('data', formData);
        if (!loginEmailInput.value || !loginPasswordInput.value) {
            console.log('Fill all Details');
        } else {
            console.log('Hello from handleLogin');
            const res = await fetch('/api/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (res.status === 401) {
                // Toastify({
                //     text: "❌ Invalid Credentials",
                //     duration: 3000,
                //     destination: "/login",
                //     newWindow: true,
                //     gravity: "top", // `top` or `bottom`
                //     position: "center", // `left`, `center` or `right`
                //     stopOnFocus: true, // Prevents dismissing of toast on hover
                //     style: {
                //         background: "black",
                //         color: "white",
                //         fontSize: "20px",
                //         fontWeight: "bold",
                //         fontFamily: "sans-serif",
                //         textAlign: "center",
                //         display: "flex",
                //         alignItems: "center",
                //         justifyContent: "center",
                //         borderRadius: "10px",
                //         boxShadow: "0px 0px 20px 2px #888888"
                //     },
                //     offset: {
                //         x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                //         y: 100 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                //     },

                //     onClick: function () {
                //     } // Callback after click
                // }).showToast();
                Swal.fire({
                    title: `<b style='font-size:3rem; color:black;'>Error!</b>`,
                    html: `<strong style='color:red;font-size:2rem;'>Invalid Credentials</strong>`,
                    icon: 'error',
                    confirmButtonText: 'Try again',
                    showCloseButton: true,
                })
            }
            const data = await res.json()
            if (data?.success) {
                localStorage.setItem('token', data.authToken);
                Swal.fire({
                    title: `<b style='font-size:2rem; color:green;'>Logged in Successfully!</b>`,
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    showConfirmButton: false,
                    showCloseButton: false,
                    timer: 1500,
                }).then(() => {
                    window.location.replace('/');
                })


            }
            else {
                console.log('Login Failed', data);
            }
        }
    } catch (error) {
        console.log('Error during login', error);
    }
}

const checkLogin = () => {
    if (loginEmailInput.value && loginPasswordInput.value) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (loginEmailInput && loginPasswordInput) {
    loginEmailInput.addEventListener('input', checkLogin);
    loginPasswordInput.addEventListener('input', checkLogin);
}



window.addEventListener('load', () => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
        window.history.back();
    }
})
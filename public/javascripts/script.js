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

// Register logic 
let form = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerButton');
const nameInput = document.getElementById('rname');
const emailInput = document.getElementById('remail');
const passwordInput = document.getElementById('rpassword');
const confirmPasswordInput = document.getElementById('rcpassword');
const errorElement = document.getElementById('passwordError');
let disable = false;
const checkPassword = () => {
    if (passwordInput.value === confirmPasswordInput.value) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        registerBtn.disabled = false;
    }
    else {
        errorElement.textContent = 'Password does not match';
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
        registerBtn.disabled = true;
    }
}

nameInput.addEventListener('change', (e) => {
    nameInput.value = e.target.value
})

emailInput.addEventListener('change', (e) => {
    emailInput.value = e.target.value
})

passwordInput.addEventListener('change', (e) => {
    passwordInput.value = e.target.value
})

confirmPasswordInput.addEventListener('change', (e) => {
    confirmPasswordInput.value = e.target.value

})

confirmPasswordInput.addEventListener('input', (e) => {
    checkPassword()
})


const handleRegister = async (e) => {
    e.preventDefault();
    let formData = { name: nameInput.value, email: emailInput.value, password: passwordInput.value, cpassword: confirmPasswordInput.value }

    console.log('data', formData);
    if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        console.log('Fill all Details');
    }
    else {
        console.log('Hello from handleRegister');
        const res = await fetch('/api/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (data?.success) {
            localStorage.setItem('token', data.authToken)
            window.history.back()
            alert('Registration Successful')
        }
    }
    nameInput.value = ''
    emailInput.value = ''
    passwordInput.value = ''
    confirmPasswordInput.value = ''

}

form.addEventListener('submit', handleRegister);
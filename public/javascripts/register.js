let form = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerButton');
const nameInput = document.getElementById('rname');
const emailInput = document.getElementById('remail');
const passwordInput = document.getElementById('rpassword');
const confirmPasswordInput = document.getElementById('rcpassword');
const errorElement = document.getElementById('passwordError');

const checkPassword = () => {
    if (passwordInput.value === confirmPasswordInput.value) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        registerBtn.disabled = false;
    } else {
        errorElement.textContent = 'Password does not match';
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
        registerBtn.disabled = true;
    }
}

if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener('input', checkPassword);
    confirmPasswordInput.addEventListener('input', checkPassword);
}

const handleRegister = async (e) => {
    e.preventDefault();
    let formData = { name: nameInput.value, email: emailInput.value, password: passwordInput.value, cpassword: confirmPasswordInput.value }

    console.log('data', formData);
    if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        console.log('Fill all Details');
    } else {
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
            localStorage.setItem('token', data.authToken);
            window.history.back();
            alert('Registration Successful');
        }
    }
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
}

if (form) {
    form.addEventListener('submit', handleRegister);
}

const authToken = localStorage.getItem('token');
if (authToken) {
    window.history.back();
}

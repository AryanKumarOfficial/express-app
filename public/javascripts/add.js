console.log('add.js');
const addForm = document.querySelector('#addForm');
const categorySelect = document.querySelector('#category');
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#body');
const addBtn = document.querySelector('#addBtn');

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = categorySelect.value;
    const title = titleInput.value;
    const content = contentInput.value;
    const authToken = localStorage.getItem('token');
    const data = { category, title, content, authToken };
    console.log(data, 'data');
    const res = await fetch('/api/addnote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    console.log(resData, 'resData');
    if (resData.success) {
        console.log('note added');
        Swal.fire({
            title: `<b style='font-size:2rem; color:green;'>Note added successfully!</b>`,
            icon: 'success',
            confirmButtonText: 'Continue',
            showConfirmButton: false,
            showCloseButton: false,
            timer: 1500,
        })
        addForm.reset();
    }
    else {
        console.log('note not added');
    }
});
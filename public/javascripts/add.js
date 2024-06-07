console.log('add.js');
const addForm = document.querySelector('#addForm');
const categorySelect = document.querySelector('#category');
const bodySelect = document.querySelector('#BodyType')
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#body');
const addBtn = document.querySelector('#addBtn');
const hoursInputElement = document.getElementById('hoursInput');
const minutesInputElement = document.getElementById('minutesInput');
const secondsInputElement = document.getElementById('secondsInput');
const outputElement = document.getElementById('output');
const timeSection = document.querySelector('#timeSection')


hoursInputElement.addEventListener('input', updateDuration);
minutesInputElement.addEventListener('input', updateDuration);
secondsInputElement.addEventListener('input', updateDuration);


let hours = 0;
let minutes = 0;
let seconds = 0;

function updateDuration() {
    // Get the current values of the input elements
    hours = hoursInputElement.value || 0;
    minutes = minutesInputElement.value || 0;
    seconds = secondsInputElement.value || 0;

    // Display the duration in the output paragraph
    outputElement.textContent = `You entered: ${hours} hours : ${minutes} minutes, and ${seconds} seconds`;
}



bodySelect.addEventListener("change", (e) => {
    console.log("change detected");
    if (e.target.value == 'time') {
        timeSection.style.display = 'block'
    }
    else {
        timeSection.style.display = 'none'

    }
})
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = categorySelect.value;
    const title = titleInput.value;
    const content = contentInput.value;
    const authToken = localStorage.getItem('token');
    let time = { hours, minutes, seconds }
    time.hours = parseInt(time.hours);
    time.minutes = parseInt(time.minutes);
    time.seconds = parseInt(time.seconds);
    const data = { category, title, content, authToken, time };
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
        }).then(() => {
            window.location.href = '/notes';
        });
        addForm.reset();
    }
    else {
        console.log('note not added');
    }
});
const section = document.querySelector('#topnotes');
const updateTitle = document.querySelector("#utitle");
const updateBody = document.querySelector("#udescription");
const updateTag = document.querySelector("#ucategory");
const confirmUpdateBtn = document.querySelector("#cupdatebtn");
const authToken = localStorage.getItem('token');

const getFewNotes = async () => {
    const response = await fetch('/api/getfewnotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authToken, limit: 5 })
    });
    const data = await response.json();
    console.log(data, 'data');
    return data;
}
let currentNoteId = null;
const getNoteById = async (noteId) => {
    try {
        const res = await fetch("/api/getnotesbyid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken: authToken, id: noteId }),
        });
        const data = await res.json();
        if (data.success) {
            console.log(data);
            currentNoteId = noteId;
            updateTitle.value = data.note.title;
            updateBody.value = data.note.desc;
            updateTag.value = data.note.tag;
        }
    } catch (error) {
        console.log(error);
    }
};

const renderNotes = async () => {
    const notes = await getFewNotes();
    console.log(notes, 'notes');
    if (notes.notes.length === 0) {
        section.innerHTML = `<div class="d-flex flex-column justify-content-center align-items-center position-relative top-50" style='margin-right:3.25rem;'>
        <h1 class="text-center">No Notes Found</h1>
        <a href="#add" class="btn btn-primary">Add Note</a>
    </div>`;
    } else {
        notes.notes.forEach(note => {
            const div = document.createElement('div');
            div.classList.add('note');
            div.setAttribute('key', note._id);
            div.innerHTML = `
            <div class="card border-0" style="width: 18rem;">
                <div class="border-0 shadow m-4">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold fs-4 text-capitalize" id="title">${note.title}</h5>
                        <h5 class="card-title fw-bold fs-5 text-secondary text-capitalize" id="title">${note.tag}</h5>
                        <p class="card-text" id="body">${note.desc}</p>
                        <p class="card-text text-success" id="body">${note?.time?.hours + " : " + note?.time?.minutes + " : " + note?.time?.seconds}</p>
                        <blockquote class="blockquote">
                            <footer class="fs-6 fw-light fst-italic text-end">${(new Date(note.updatedAt)).toDateString()}</footer>
                            <footer class="fs-6 fw-light fst-italic text-end">${(new Date(note.updatedAt)).toLocaleTimeString()}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between mt-auto pt-2 pb-2 border-1 border-dark rounded border-bottom-0 mx-2">
                            <button class="btn btn-danger w-50 mx-1 deleteBtn" data-note-id="${note._id}">
                                <i class="fa-solid fa-trash fa-lg"></i>
                            </button>
                            <button class="btn btn-primary w-50 mx-1 updateBtn" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-note-id="${note._id}">
                                <i class="fa-solid fa-file-pen fa-lg mx-auto"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
            section.appendChild(div);

            // add event listener inside the loop
            const deleteBtn = div.querySelector('.hdeleteBtn');
            const updateBtn = div.querySelector('.hupdateBtn');
            updateBtn?.addEventListener('click', () => getNoteById(note._id.toString()));
            deleteBtn?.addEventListener('click', () => handleDelete(note._id));
            confirmUpdateBtn.addEventListener('click', () => updateNote(updateBtn.dataset.noteId));
        });
    }
}


const handleDelete = async (noteId) => {
    console.log('delete clicked');
    try {
        const res = await fetch("/api/deletenote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken: authToken, id: noteId }),
        });
        const data = await res.json();
        if (data.success) {
            console.log(data);
            swal.fire({
                title: "Note Deleted",
                text: "Note has been deleted successfully",
                icon: "success",
                confirmButtonText: "Ok",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                window.location.href = "/";
            });
            getNotes();
        }
    } catch (error) {
        console.log(error);
    }
};

const updateNote = async (noteId) => {
    console.log('update clicked');
    try {
        const res = await fetch("/api/updatenote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken: authToken, id: currentNoteId, title: updateTitle.value, content: updateBody.value, category: updateTag.value }),
        });
        const data = await res.json();
        if (data.success) {
            console.log(data);
            swal.fire({
                title: "Note Updated",
                text: "Note has been updated successfully",
                icon: "success",
                confirmButtonText: "Ok",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                window.location.href = "/";
            });
            getNotes();
        }
    } catch (error) {
        console.log(error);
    }
}

renderNotes();

// Path: public/javascripts/notes.js

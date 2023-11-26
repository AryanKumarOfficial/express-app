console.log("hello from notes.js");
const notesContainer = document.querySelector("#notescontainer");
const authToken = localStorage.getItem("token");
const updateTitle = document.querySelector("#utitle");
const updateBody = document.querySelector("#udescription");
const updateTag = document.querySelector("#ucategory");
const confirmUpdateBtn = document.querySelector("#cupdatebtn");
// get the note by id and fill the form

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
            updateTitle.value = data.note.title;
            updateBody.value = data.note.desc;
            updateTag.value = data.note.tag;
        }
    } catch (error) {
        console.log(error);
    }
};


if (!authToken) {
    window.location.href = "/login.html";
} else {
    const getNotes = async () => {
        try {
            const res = await fetch("/api/getnotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ authToken }),
            });
            const data = await res.json();
            if (data.success) {
                console.log(data.notes);
                if (data.notes.length === 0) {
                    const noteDiv = document.createElement("div");
                    noteDiv.classList.add("note");
                    noteDiv.innerHTML = `
                        <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
                            <h1 class="text-center">No Notes Found</h1>
                            <a href="/" class="btn btn-primary">Add Note</a>
                        </div>
                    `;
                    document.body.appendChild(noteDiv);
                    return;
                }
                data.notes.forEach(note => {
                    const noteDiv = document.createElement("div");

                    noteDiv.classList.add("note");
                    noteDiv.innerHTML = `
                        <div class="card border-0" style="width: 18rem;">
                            <div class="border-0 shadow m-4">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title fw-bold fs-4 text-capitalize" id="title">${note.title}</h5>
                                    <p class="card-text" id="body">${note.desc}</p>
                                    <blockquote class="blockquote">
                                        <footer class="blockquote-footer text-end">${note.tag}</footer>
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
                    notesContainer.appendChild(noteDiv);

                    // Add event listener inside the loop
                    const deleteBtn = noteDiv.querySelector(".deleteBtn");
                    const updateBtn = noteDiv.querySelector(".updateBtn");
                    updateBtn.addEventListener("click", () => getNoteById(note._id));
                    console.log(updateBtn.dataset.noteId);
                    deleteBtn.addEventListener("click", () => handleDelete(note._id));
                    confirmUpdateBtn.addEventListener("click", () => updateNote(updateBtn.dataset.noteId));
                });
            } else {
                window.location.href = "/login.html";
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                    window.location.href = "/notes";
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
                body: JSON.stringify({ authToken: authToken, id: noteId, title: updateTitle.value, content: updateBody.value, category: updateTag.value }),
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
                    window.location.href = "/notes";
                });
                getNotes();
            }
        } catch (error) {
            console.log(error);
        }
    }

    getNotes();
}

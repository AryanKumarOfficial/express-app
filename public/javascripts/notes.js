console.log("hello from notes.js");
const notesContainer = document.querySelector("#notescontainer");
const authToken = localStorage.getItem("token");
const updateTitle = document.querySelector("#utitle");
const updateBody = document.querySelector("#udescription");
const updateTag = document.querySelector("#ucategory");
const confirmUpdateBtn = document.querySelector("#cupdatebtn");
const uhoursInput = document.querySelector("#uhoursInput");
const uminutesInput = document.querySelector("#uminutesInput");
const usecondsInput = document.querySelector("#usecondsInput");
const uoutput = document.querySelector("#uoutput");
const uBodyType = document.querySelector("#uBodyType");
const utimeSection = document.querySelector("#utimeSection");
// get the note by id and fill the form


uhoursInput.addEventListener("input", updateTime);
uminutesInput.addEventListener("input", updateTime);
usecondsInput.addEventListener("input", updateTime);

function updateTime() {
    const uHours = parseInt(uhoursInput.value) || 0;
    const uMinutes = parseInt(uminutesInput.value) || 0;
    const uSeconds = parseInt(usecondsInput.value) || 0;

    if (uHours < 0 || uMinutes < 0 || uSeconds < 0) {
        uoutput.textContent = "Please enter a valid time";
        return;

    }
    uoutput.textContent = `${uHours} hours ${uMinutes} minutes ${uSeconds} seconds`;
}


uBodyType.addEventListener("input", (e) => {
    if (e.target.value == 'time') {
        utimeSection.style.display = 'block';
    }
    else {
        utimeSection.style.display = 'none';
    }
});


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
            uBodyType.value = data.note.bodyType;
            uhoursInput.value = data.note?.time?.hours;
            uminutesInput.value = data.note?.time?.minutes;
            usecondsInput.value = data.note?.time?.seconds;
            updateTime();
        }
    } catch (error) {
        console.log(error);
    }
};


if (!authToken) {
    window.location.href = "/login";
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
                                    <h5 class="card-title fw-bold fs-5 text-secondary text-capitalize" id="title">${note.tag}</h5>
                                    <p class="card-text" id="body">${note.desc}</p>
                                    <p class="card-text text-success" id="body">${note?.time?.hours + " : " + note?.time?.minutes + " : " + note?.time?.seconds}</p>
                                    <blockquote class="blockquote">
                                        <footer class="fs-6 fw-light fst-italic text-end">${(new Date(note.date)).toDateString()}</footer>
                                        <footer class="fs-6 fw-light fst-italic text-end">${(new Date(note.date)).toLocaleTimeString()}</footer>
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
                    updateBtn.addEventListener("click", () => {
                        uBodyType.value == 'time' ? utimeSection.style.display = 'block' : utimeSection.style.display = 'none';
                        getNoteById(note._id);
                    });
                    console.log(updateBtn.dataset.noteId);
                    deleteBtn.addEventListener("click", () => handleDelete(note._id));
                    confirmUpdateBtn.addEventListener("click", () => updateNote(updateBtn.dataset.noteId));
                });
            } else {
                window.location.href = "/login";
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

    const updateNote = async () => {
        console.log('update clicked');
        try {
            const res = await fetch("/api/updatenote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ authToken: authToken, id: currentNoteId, title: updateTitle.value, content: updateBody.value, category: updateTag.value, bodyType: uBodyType.value, time: { hours: parseInt(uhoursInput.value) || 0, minutes: parseInt(uminutesInput.value) || 0, seconds: parseInt(usecondsInput.value) || 0 } }),
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

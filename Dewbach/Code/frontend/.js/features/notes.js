import { DOM } from "../core/dom.js";
import { loadNotes, saveNotes } from "../core/storage.js";

export function renderNotes() {
  if (!DOM.notesList) return;
  DOM.notesList.innerHTML = "";
  allNotes.forEach(createNoteElement);
}

DOM.addBtn2.addEventListener("click", () => {
  DOM.noteCreationDiv.style.display = "flex";
});

let selectedNoteColor = null;

DOM.noteColorOptions.forEach((button) => {
  button.addEventListener("click", () => {
    selectedNoteColor = button.dataset.color;
    DOM.noteInput.style.backgroundColor = selectedNoteColor;
  });
});

DOM.cancelNoteCreationBtn.addEventListener("click", () => {
  DOM.noteCreationDiv.style.display = "none";
  DOM.noteInput.style.backgroundColor = "";
  selectedNoteColor = null;
});

DOM.addNoteBtn.addEventListener("click", () => {
  addNote();
  showNoNotesYet();
});

DOM.notesList.addEventListener("mouseover", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;

  const editNoteBtn = closestMainNote.querySelector(".editNoteBtn");
  const deleteNoteBtn = closestMainNote.querySelector(".deleteNoteBtn");
  if (editNoteBtn) editNoteBtn.style.display = "flex";
  if (deleteNoteBtn) deleteNoteBtn.style.display = "flex";

  closestMainNote.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
});

notesList.addEventListener("mouseout", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;
  const editNoteBtn = closestMainNote.querySelector(".editNoteBtn");
  const deleteNoteBtn = closestMainNote.querySelector(".deleteNoteBtn");
  if (editNoteBtn) editNoteBtn.style.display = "none";
  if (deleteNoteBtn) deleteNoteBtn.style.display = "none";
  closestMainNote.style.boxShadow = "none";
});

notesList.addEventListener("click", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;

  if (e.target.closest(".editNoteBtn")) {
    showOverlay();

    const isEditingNote = document.documentElement.classList.toggle("editingNote");

    if (isEditingNote) {
      const noteId = closestMainNote.closest(".listNote").id.replace("note-", "");
      const note = allNotes.find(n => n.id === noteId);
      if (!note) return;

      editingNoteColor = note.color || null;

      const noteEditDiv = document.createElement("div");
      noteEditDiv.className = "noteEditDiv";

      const noteEditInput = document.createElement("textarea");
      noteEditInput.className = "noteEditInput";
      noteEditInput.value = closestMainNote.querySelector(".mainNoteText").textContent;
      noteEditInput.placeholder = "Edit your note...";
      noteEditInput.style.backgroundColor = note.color || "";

      const editNoteColorOptions = document.querySelector(".noteColorOptions").cloneNode(true);

      editNoteColorOptions.style.flexDirection = "column";
      editNoteColorOptions.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          editingNoteColor = button.dataset.color;
          noteEditInput.style.backgroundColor = editingNoteColor;
        });
      })

      const editNoteOptions = document.createElement("div");
      editNoteOptions.className = "editNoteOptions";

      const cancelNoteEditBtn = document.createElement("button");
      cancelNoteEditBtn.className = "cancelNoteEditBtn";
      cancelNoteEditBtn.textContent = "Cancel";

      const saveNoteBtn = document.createElement("button");
      saveNoteBtn.className = "saveNoteBtn";
      saveNoteBtn.textContent = "Save";

      noteEditDiv.appendChild(noteEditInput);
      noteEditDiv.appendChild(editNoteColorOptions);
      editNoteOptions.appendChild(cancelNoteEditBtn);
      cancelNoteEditBtn.addEventListener("click", () => {
        document.documentElement.classList.remove("editingNote");
        noteEditDiv.remove();
        editingNoteColor = null;
        hideOverlay();
      });
      editNoteOptions.appendChild(saveNoteBtn);
      saveNoteBtn.addEventListener("click", () => {
        const newNoteText = noteEditInput.value.trim();
        if (!newNoteText) return;

        note.text = newNoteText;
        note.color = editingNoteColor ?? note.color;

        editingNoteColor = null;

        saveNotes();
        renderNotes();
        document.documentElement.classList.remove("editingNote");
        noteEditDiv.remove();
        hideOverlay();
      })
      noteEditDiv.appendChild(editNoteOptions);
      document.body.appendChild(noteEditDiv);
    }
  }

  if (e.target.closest(".deleteNoteBtn")) {
    const listNote = e.target.closest(".listNote");
    if (!listNote) return;
    const noteId = listNote.id.replace("note-", "");

    const noteIndex = allNotes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      allNotes.splice(noteIndex, 1);
      saveNotes();
      renderNotes();
      showNoNotesYet();
      addActivity("Deleted a note", "delete");
    }
  }
});
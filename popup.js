document.getElementById("mode").addEventListener("change", (event) => {
    const value = event.target.value;
    // Navigate to different pages
    if (value === "notes"){
        return
    } else if (value === "summarize") {
        window.location.href = "summarize.html";
    } else if (value === "weather") {
        window.location.href = "weather.html";
    } else if (value === "Todo") {
        window.location.href = "todo.html";
    }
  });
  

const input = document.getElementById("noteInput");
const button = document.getElementById("addNote");
const list = document.getElementById("noteList");

// Format timestamp like "2025-06-01 14:35"
function formatTimestamp(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // get last 2 digits
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
  
    return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
}

// Display a single note in the list
function displayNote(note) {
    const li = document.createElement("li");
    li.setAttribute("data-id", note.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

    const noteText = document.createElement("div");

    const timestampEl = document.createElement("div");
    timestampEl.textContent = note.timestamp;
    timestampEl.className = "timestamp";

    const bodyEl = document.createElement("div");
    bodyEl.innerHTML = note.text.replace(/\n/g, "<br>");
    bodyEl.className = "note-body";

    noteText.appendChild(timestampEl);
    noteText.appendChild(bodyEl);

    li.appendChild(deleteBtn);
    li.appendChild(noteText);
    list.appendChild(li);
}

// Load existing notes on startup
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("notes", (data) => {
    list.innerHTML = ""; // clear existing list
    const notes = data.notes || [];
    notes.forEach(displayNote);
  });
});

// Add new note on click
button.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const newNote = {
    id: Date.now(),
    text,
    timestamp: formatTimestamp(new Date())
  };

  chrome.storage.sync.get("notes", (data) => {
    const notes = data.notes || [];
    notes.unshift(newNote); // add to beginning
    chrome.storage.sync.set({ notes }, () => {
      displayNote(newNote);
      input.value = "";
    });
  });
});

// Delete note and update storage
function deleteNote(id, listItem) {
  chrome.storage.sync.get("notes", (data) => {
    const updatedNotes = (data.notes || []).filter((note) => note.id !== id);
    chrome.storage.sync.set({ notes: updatedNotes }, () => {
      listItem.remove();
    });
  });
}


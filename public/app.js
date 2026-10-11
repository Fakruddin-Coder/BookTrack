const bookForm = document.getElementById("bookForm");
const showFormButton = document.getElementById("showFormButton");
const emptyAddButton = document.getElementById("emptyAddButton");
const closeFormButton = document.getElementById("closeFormButton");
const cancelButton = document.getElementById("cancelButton");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const bookIdInput = document.getElementById("bookId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const statusInput = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const bookGrid = document.getElementById("bookGrid");
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("message");

let allBooks = [];
let messageTimeout;

function showMessage(text, type = "success") {
  clearTimeout(messageTimeout);
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageTimeout = setTimeout(() => messageBox.classList.add("hidden"), 3500);
}

function openForm(book = null) {
  bookForm.reset();
  bookIdInput.value = "";
  if (book) {
    formTitle.textContent = "Edit book";
    saveButton.textContent = "Save changes";
    bookIdInput.value = book._id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre || "Other";
    statusInput.value = book.status;
  } else {
    formTitle.textContent = "Add a new book";
    saveButton.textContent = "Save book";
    statusInput.value = "Want to Read";
  }
  bookForm.classList.remove("hidden");
  bookForm.scrollIntoView({ behavior: "smooth", block: "center" });
  titleInput.focus();
}

function closeForm() {
  bookForm.classList.add("hidden");
  bookForm.reset();
  bookIdInput.value = "";
}

showFormButton.addEventListener("click", () => openForm());
emptyAddButton.addEventListener("click", () => openForm());
closeFormButton.addEventListener("click", closeForm);
cancelButton.addEventListener("click", closeForm);

function updateStats(books) {
  document.getElementById("totalCount").textContent = books.length;
  document.getElementById("readingCount").textContent =
    books.filter(book => book.status === "Reading").length;
  document.getElementById("completedCount").textContent =
    books.filter(book => book.status === "Completed").length;
}

function statusClass(status) {
  if (status === "Reading") return "reading";
  if (status === "Completed") return "completed";
  return "";
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderBooks(books) {
  updateStats(books);
  bookGrid.innerHTML = "";

  if (!books.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  books.forEach((book, index) => {
    const card = document.createElement("article");
    card.className = "book-card";
    const coverClass = `color-${index % 4}`;
    card.innerHTML = `
      <div class="card-top">
        <div class="cover ${coverClass}" aria-hidden="true">▤</div>
        <span class="status-pill ${statusClass(book.status)}">${escapeHTML(book.status)}</span>
      </div>
      <h3 class="book-title">${escapeHTML(book.title)}</h3>
      <p class="book-author">by ${escapeHTML(book.author)}</p>
      <p class="book-meta">${escapeHTML(book.genre || "Other")}</p>
      <div class="card-actions">
        <button type="button" data-action="edit" data-id="${book._id}">Edit</button>
        <button type="button" data-action="status" data-id="${book._id}">Change status</button>
        <button type="button" class="delete-button" data-action="delete" data-id="${book._id}">Delete</button>
      </div>`;
    bookGrid.appendChild(card);
  });
}

async function loadBooks() {
  try {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
    if (statusFilter.value) params.set("status", statusFilter.value);

    const response = await fetch(`/api/books?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load books.");
    renderBooks(data);
  } catch (error) {
    showMessage("Could not load books. Check that the server and MongoDB are running.", "error");
    bookGrid.innerHTML = "";
    emptyState.classList.add("hidden");
  }
}

async function loadAllBooksForStats() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) return;
    allBooks = await response.json();
    // Stats reflect the complete library, not only filtered search results.
    updateStats(allBooks);
  } catch (error) {
    // loadBooks displays the user-facing connection error.
  }
}

bookForm.addEventListener("submit", async event => {
  event.preventDefault();

  const book = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value,
    status: statusInput.value
  };

  if (!book.title || !book.author) {
    showMessage("Please enter both a book title and author.", "error");
    return;
  }

  const id = bookIdInput.value;
  const url = id ? `/api/books/${id}` : "/api/books";
  const method = id ? "PUT" : "POST";

  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not save the book.");

    closeForm();
    showMessage(id ? "Book updated successfully." : "Book added to your library.");
    await loadBooks();
    await loadAllBooksForStats();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = bookIdInput.value ? "Save changes" : "Save book";
  }
});

bookGrid.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const book = allBooks.find(item => item._id === button.dataset.id);
  if (!book) {
    await loadAllBooksForStats();
  }
  const selectedBook = allBooks.find(item => item._id === button.dataset.id);
  if (!selectedBook) return;

  if (button.dataset.action === "edit") {
    openForm(selectedBook);
    return;
  }

  if (button.dataset.action === "status") {
    const statuses = ["Want to Read", "Reading", "Completed"];
    const nextStatus = statuses[(statuses.indexOf(selectedBook.status) + 1) % statuses.length];
    await updateBook(selectedBook, { ...selectedBook, status: nextStatus });
    return;
  }

  if (button.dataset.action === "delete") {
    if (!confirm(`Delete "${selectedBook.title}" from your library?`)) return;
    try {
      const response = await fetch(`/api/books/${selectedBook._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete the book.");
      showMessage("Book deleted successfully.");
      await loadBooks();
      await loadAllBooksForStats();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }
});

async function updateBook(original, updated) {
  try {
    const response = await fetch(`/api/books/${original._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updated.title,
        author: updated.author,
        genre: updated.genre,
        status: updated.status
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not update status.");
    showMessage(`Status changed to "${updated.status}".`);
    await loadBooks();
    await loadAllBooksForStats();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadBooks, 250);
});
statusFilter.addEventListener("change", loadBooks);

async function initialize() {
  await loadAllBooksForStats();
  await loadBooks();
}

initialize();

// Fungsi untuk menghasilkan ID unik untuk setiap buku berdasarkan timestamp
function generateBookId() {
  return new Date().getTime();
}

// Mengambil daftar buku dari localStorage
function getBooksFromStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

// Menyimpan daftar buku ke localStorage
function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Menambahkan buku baru ke rak buku
function addBook(book) {
  const books = getBooksFromStorage();
  books.push(book);
  saveBooksToStorage(books);
  renderBooks();
}

// Menghapus buku dari rak buku
function deleteBook(id) {
  let books = getBooksFromStorage();
  books = books.filter((book) => book.id !== id);
  saveBooksToStorage(books);
  renderBooks();
}

// Mengubah status buku (pindah antar rak)
function toggleBookCompletion(id) {
  const books = getBooksFromStorage();
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage(books);
    renderBooks();
  }
}

// Merender buku-buku ke halaman
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const books = getBooksFromStorage();

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Membuat elemen HTML untuk setiap buku
function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

  // Menambahkan event listener untuk tombol-tombol
  const completeButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
  const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
  const editButton = bookItem.querySelector('[data-testid="bookItemEditButton"]');

  completeButton.addEventListener("click", () => toggleBookCompletion(book.id));
  deleteButton.addEventListener("click", () => deleteBook(book.id));
  editButton.addEventListener("click", () => editBook(book.id));

  return bookItem;
}

// Menangani pengeditan buku
function editBook(id) {
  const books = getBooksFromStorage();
  const book = books.find((b) => b.id === id);

  if (book) {
    // Populasikan form dengan data buku
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // Simpan ID buku yang sedang diedit
    editingBookId = id;

    // Perbarui teks tombol submit
    const submitButton = document.getElementById("bookFormSubmit");
    submitButton.textContent = "Perbarui Buku";
    submitButton.classList.add("editing");

    // Arahkan ke form tambah buku
    const bookFormSection = document.querySelector("form#bookForm");
    bookFormSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Menangani pengiriman form buku
document.getElementById("bookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateBookId(),
    title,
    author,
    year,
    isComplete,
  };

  addBook(newBook);

  // Menghapus nilai form setelah pengiriman
  document.getElementById("bookForm").reset();
});

// Menangani pencarian buku
document.getElementById("searchBook").addEventListener("submit", function (event) {
  event.preventDefault();

  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const books = getBooksFromStorage();

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

// Inisialisasi aplikasi dan render buku yang ada
renderBooks();

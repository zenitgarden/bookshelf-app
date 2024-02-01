const book = [];
const RENDER_EVENT = 'render-book';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }

  function findBook(BookId) {
    for (bookItem of book) {
      if (bookItem.id === BookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function findBookIndex(BookId) {
    for (index in book) {
      if (book[index].id === BookId) {
        return index;
      }
    }
    return -1;
  }

function insertBook(bookObject) {
    const {id, title, author, year, isCompleted} = bookObject;
  
    const textTitle = document.createElement('h3');
    textTitle.innerText =  title;
  
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Author : " + author;

    const textYear = document.createElement('p');
    textYear.innerText ="Tahun : " + year;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor,textYear);
  
    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);
  
    if (isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.textContent = 'Belum dibaca';
      undoButton.addEventListener('click', function () {
        undoFromCompleted(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.textContent = 'Delete';
      trashButton.addEventListener('click', function () {
        removeFromCompleted(id);
      });
  
      container.append(undoButton, trashButton);
  
    } else {
      const addButton = document.createElement('button');
      addButton.classList.add('check-button');
      addButton.textContent = 'Sudah di baca';
      addButton.addEventListener('click', function () {
        addToCompleted(id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.textContent = 'Delete';
      trashButton.addEventListener('click', function () {
        removeFromCompleted(id);
      });
  
      container.append(addButton,trashButton);
    }
  
    return container;
  }


  function addBook() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const textYear = document.getElementById('date').value;
    const checkBoxR = document.getElementById('baca').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor,textYear, checkBoxR);
    book.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }


  function addToCompleted(BookId) {
    const bookTarget = findBook(BookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function removeFromCompleted(BookId) {
    let dConfirm = confirm("Anda yakin ingin menghapus buku ini ?");

    if(dConfirm == true){
    const bookTarget = findBookIndex(BookId);
    const target = findBook(BookId);
    if (bookTarget === -1) return;
    book.splice(bookTarget, 1);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert(`Buku dengan judul '${target.title}' telah terhapus dari rak`);
    }else{
        return false;
    }
    saveData();
  }
  
  function undoFromCompleted(BookId) {
    const bookTarget = findBook(BookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
      submitForm.reset();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  document.addEventListener(RENDER_EVENT, function () {
    const nread = document.getElementById('nread');
    const  read = document.getElementById('read');
  
    nread.innerHTML = '';
    read.innerHTML = '';
  
    for (bookItem of book) {
      const bookElement = insertBook(bookItem);
      if (bookItem.isCompleted) {
        read.append(bookElement);
      } else {
        nread.append(bookElement);
      }
    }
  });

  function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByTagName("h3");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".item").style.display = "";
        } else {
            titles[i].closest(".item").style.display = "none";
        }
    }
}

const formSearch = document.getElementById('cari');
formSearch.addEventListener("click", function (event) {
    event.preventDefault();

    const inputSearch = document.getElementById('search').value;
    bookSearch(inputSearch);
})




const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookItem of data) {
      book.push(bookItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}


const books = []

const booksContainer = document.getElementsByClassName('books')[0]

const deleteMenu = document.getElementById('delete-choice')

const generateHoverEffectOnBook = (book = 0, element = undefined) => {
    if(book === 0) {
        book = document.getElementsByClassName('book')
    } else {
        book = [element]
    }
    for(let i = 0; i < book.length; i++){
        book[i].addEventListener('mouseover', () => {
            if(book[i].children.length < 3) {
                const div = document.createElement('div')
                div.className = 'actions-book'
                div.innerHTML = '<button class="update-btn">Edit</button> <button class="delete-btn">Delete</button>'
                book[i].appendChild(div)

                book[i].addEventListener('mouseleave', () => {
                    if(book[i].children.length > 2 && book[i].children) {
                        if(book[i].children[2]){
                            book[i].children[2].remove() 
                        }
                    }
                })
                const btns = book[i].children[2].children
                btns[1].addEventListener('click', (e) => {
                    const id = e.target.parentElement.parentElement.id
                    const result = books.find(b => b.id === Number(id))
                    deleteMenu.previousElementSibling.innerHTML = `Menghapus '<b>${result.title}</b>' ?`
                    deleteMenu.parentElement.parentElement.classList.add('delete-modal')
                    deleteMenu.parentElement.parentElement.classList.remove('hidden-delete-modal')
                    deleteMenu.children[1].setAttribute('data-id', id);
                })

                btns[0].addEventListener('click', (e) => {
                    const id = e.target.parentElement.parentElement.id
                    const hiddenEditModal = document.getElementsByClassName('hidden-modal-edit-book')[0]
                    hiddenEditModal.classList.remove('hidden-modal-edit-book')
                    hiddenEditModal.classList.add('modal-edit-book')
                    const result = books.find(b => b.id === Number(id))
                    const formEdit  = document.getElementById('editbook');
                    formEdit.elements['title'].value = result.title
                    formEdit.elements['author'].value = result.author
                    formEdit.elements['year'].value = result.year
                    formEdit.elements['checkboxR'].checked = result.isCompleted
                    formEdit.elements['data-id'].value = result.id
                })


            }
        })
    }
}
generateHoverEffectOnBook()

const addBtn = document.getElementsByClassName('add-btn')[0]
addBtn.addEventListener('click', () => {
   const hiddenAddModal = document.getElementsByClassName('hidden-modal-add-book')[0]
   hiddenAddModal.classList.remove('hidden-modal-add-book')
   hiddenAddModal.classList.add('modal-add-book')
})

const exitModal = () => {
    const modal = document.getElementsByClassName('modal-add-book')[0]
    modal.classList.remove('modal-add-book')
    modal.classList.add('hidden-modal-add-book')
}
document.getElementById('exit-modal').addEventListener('click', () => exitModal())

const exitModalEdit = () => {
    const modal = document.getElementsByClassName('modal-edit-book')[0]
    modal.classList.remove('modal-edit-book')
    modal.classList.add('hidden-modal-edit-book')
}
document.getElementById('exit-modal-edit').addEventListener('click', () => exitModalEdit())

const generateBooks = (book, event = 'none') => {
    for(let i = 0; i < book.length; i++){
        const newBook = document.createElement('div')
        if(event === 'none'){
            if(menuBtn[0].classList[1] === 'active') {
                newBook.className = 'book'
                if(!book[i].isCompleted){
                    newBook.className = 'book-hidden'
                }
            } else {
                newBook.className = 'book-hidden'
                if(!book[i].isCompleted) {
                    newBook.className = 'book'
                }
            }
        } else {
            newBook.className = book[i].isCompleted ? 'book' : 'book-hidden'
        }
        newBook.setAttribute('id', book[i].id)
        newBook.setAttribute('data-iscompleted', book[i].isCompleted)
        newBook.innerHTML = `
        <div class="flex-column title-author">
            <span class="title">${book[i].title}</span>
            <span class="author">${book[i].author}</span>
            <div class="${book[i].isCompleted ? 'n-read' : 'read'}">${book[i].isCompleted ? 'Belum Selesai' : 'Selesai'}</div>
        </div>
        <div class="year"><span style="font-size:10px; color: #727D8C;">Tahun</span><span>${book[i].year}</span></div>`
        generateHoverEffectOnBook(1, newBook)
        booksContainer.appendChild(newBook)
        moveBook([newBook.children[0].children[2]])
    }
}

const form  = document.getElementById('addbook');
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = form.elements['title'].value
    const author = form.elements['author'].value
    const year = form.elements['year'].value
    const checkboxR = form.elements['checkboxR'].checked

    const bookObj = {
        id: +new Date(),
        title,
        author,
        year: Number(year),
        isCompleted: checkboxR
    }
    books.push(bookObj)

    generateBooks([bookObj])
    exitModal()
    form.reset()
    saveData()
});

const formEdit  = document.getElementById('editbook');
formEdit.addEventListener('submit', (e) => {
    e.preventDefault()
    const id = formEdit.elements['data-id'].value
    const title = formEdit.elements['title'].value
    const author = formEdit.elements['author'].value
    const year = formEdit.elements['year'].value
    const checkboxR = formEdit.elements['checkboxR'].checked 
    const bookObj = {
        id: Number(id),
        title,
        author,
        year: Number(year),
        isCompleted: checkboxR
    }
    const index = books.findIndex(b => b.id === Number(id))
    books.splice(index, 1, bookObj)

    for(let i = 0; i < booksContainer.children.length; i++ ){
        const b = booksContainer.children[i]
        if(b.id === id){
            b.remove();
        }
    }
    generateBooks([bookObj])
    exitModalEdit()
    formEdit.reset()
    saveData()
});

const removeBook = () => {
    const id = deleteMenu.children[1].getAttribute('data-id')
    const index = books.findIndex(b => b.id === Number(id))
    books.splice(index, 1);
    saveData();
    document.getElementById(id).remove()
    deleteMenu.children[1].removeAttribute('data-id')
}

const exitModalDelete = () => {
    deleteMenu.parentElement.parentElement.classList.remove('delete-modal')
    deleteMenu.parentElement.parentElement.classList.add('hidden-delete-modal')
    if(deleteMenu.children[1].getAttribute('data-id')){
        deleteMenu.children[1].removeAttribute('data-id')
    }
}
deleteMenu.children[0].addEventListener('click', () => {
    exitModalDelete()
})
deleteMenu.children[1].addEventListener('click', () => {
    removeBook()
    exitModalDelete()
})

const menuBtn = document.getElementsByClassName('menu-btn')
const show = (el) => {
    el.classList.add('book')
    el.classList.remove('book-hidden')
}
const hide = (el) => {
    el.classList.add('book-hidden')
    el.classList.remove('book')
}
menuBtn[0].addEventListener('click', () => {
    const read = document.getElementsByClassName('books')[0].children
    for(let i = 0; i < read.length; i++){
        if(read[i].getAttribute('data-iscompleted') === 'true'){
            show(read[i])
        }
        if(read[i].getAttribute('data-iscompleted') === 'false'){
            hide(read[i])
        }
    }
    menuBtn[0].classList.add('active')
    menuBtn[1].classList.remove('active')
    inputSearch.value = ''
})

menuBtn[1].addEventListener('click', () => {
    const read = document.getElementsByClassName('books')[0].children
    for(let i = 0; i < read.length; i++){
        if(read[i].getAttribute('data-iscompleted') === 'false'){
            show(read[i])
        }
        if(read[i].getAttribute('data-iscompleted') === 'true'){
            hide(read[i])
        }
    } 
    menuBtn[0].classList.remove('active')
    menuBtn[1].classList.add('active')
    inputSearch.value = ''
})

const inputSearch = document.getElementById('search-book')
const searchBtn = document.getElementsByClassName('icon-search')[0]

const searchBook = () => {
    const value = inputSearch.value.toLowerCase()
    const result = books.filter((b) => {
        const x = b.title.toLowerCase().search(value)
        if(menuBtn[0].classList[1] === 'active'){
            if(x !== -1 && b.isCompleted){
                return b.id
            }
        } else {
            if(x !== -1 && !b.isCompleted){
                return b.id
            }
        }
    }).map(value => value.id)
    const dataBooks = document.getElementsByClassName('books')[0].children
    
    for(let i = 0; i < dataBooks.length; i++){
        if(!result.includes(Number(dataBooks[i].id))){
            hide(dataBooks[i])
        } else {
            show(dataBooks[i])
        }
    }
}

searchBtn.addEventListener('click', () => {
    searchBook()
})

inputSearch.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchBook()
    }
});


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
    const data = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, data);
  }
}

function loadDataFromStorage() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(rawData);

  if (data !== null) {
    for (const bookItem of data) {
      books.push(bookItem);
    }
  }
}

const moveBook = (rack) => {
    for(let i = 0; i < rack.length; i++){
        rack[i].addEventListener('click', (e) => {
            const id = e.target.parentElement.parentElement.id
            const index = books.findIndex(b => b.id === Number(id))
            let result = books.find(b => b.id === Number(id))
            result = {
                ...result,
                isCompleted: !result.isCompleted
            }
            books.splice(index, 1, result)
            saveData()
            const el = e.target.parentElement.parentElement
            e.target.className = result.isCompleted ? 'n-read' : 'read'
            e.target.innerHTML = result.isCompleted ? 'Belum selesai' : 'Selesai'
            el.setAttribute('data-iscompleted', result.isCompleted)
            if(menuBtn[0].classList[1] === 'active') {
                el.className = 'book'
                if(!result.isCompleted){
                    el.className = 'book-hidden'
                }
            } else {
                el.className = 'book-hidden'
                if(!result.isCompleted) {
                    el.className = 'book'
                }
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (isStorageExist()) {
      loadDataFromStorage();
      generateBooks(books, 'loadDataFromStorage')
    }
});
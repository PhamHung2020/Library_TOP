/* ---------------------------------------- */
/* ------------- BOOK SECTION --------------*/ 
/* ---------------------------------------- */


const BOOK_STATUS = {
    READ: "read",
    NOT_READ: "not-read",
    READING: "reading"
}

const initialBook1 = {
    title: 'Harry Potter',
    authors: 'J.K.Rowling',
    publisher: 'Bloomsbury',
    publishing_year: 1990,
    number_of_pages: 300,
    book_status: BOOK_STATUS.READING,
    id: 1,
}

const initialBook2 = {
    title: 'A Game Of Thrones',
    authors: 'Unknown',
    publisher: 'Unknown',
    publishing_year: 1960,
    number_of_pages: 800,
    book_status: BOOK_STATUS.NOT_READ,
    id: 2,
}

function Book(book_property) {
    this.title = book_property.title;
    this.authors = book_property.authors;
    this.publisher = book_property.publisher;
    this.publishing_year = book_property.publishing_year;
    this.number_of_pages = book_property.number_of_pages;
    this.book_status = book_property.book_status;
    this.id = book_property.id;
}  

function BookHTML(book) {
    this.book = book;
    this.div_book_card = document.createElement('div');
    this.HTML_code =
        `<div class="title-author">
                <h2 class="title">${book.title}</h2>
                <p class="author">by ${book.authors}</p>
        </div>
        <div class="info-text">
            <p>Publisher: ${book.publisher}</p>
            <p>Year: ${book.publishing_year}</p>
            <p>Number of pages: ${book.number_of_pages}</p>
            <label for="read">Read: </label>
            <select name="read" id="read" class="read-dropdown">
                <option value="read">Read</option>
                <option value="not-read">Not read</option>
                <option value="reading">Reading</option>
            </select>
        </div>
        <div class="buttons">
            <button id="edit" class="edit button">Edit</button>
            <button id="delete" class="delete button">Delete</button>
        </div>`;

    this.DropDownChange = function() {
        this.div_book_card.querySelector('select').addEventListener('change', (e) => {
            this.div_book_card.classList.remove(this.book.book_status);
            book.book_status = e.target.value;
            this.div_book_card.classList.add(this.book.book_status);
        })
    }

    this.ButtonEvent = function(){
        this.div_book_card.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.id == 'edit')
                {
                    form.On_Edit(this.book);
                }
                else if (button.id == 'delete')
                {
                    form.On_Delete(this.book);
                }
            })
        })
    }

    this.ReturnHTMLCode = function() {
        this.div_book_card.classList.add('book-card');
        switch (this.book.book_status){
            case BOOK_STATUS.READ:
                this.div_book_card.classList.add('read');
                break;
            case BOOK_STATUS.READING:
                this.div_book_card.classList.add('reading');
                break;
            case BOOK_STATUS.NOT_READ:
                this.div_book_card.classList.add('not-read');
                break;
        }
        this.div_book_card.id = `book-${this.book.id}`;
        this.div_book_card.insertAdjacentHTML('afterbegin', this.HTML_code);
        this.div_book_card.querySelector('select').value = this.book.book_status;
        this.DropDownChange();
        this.ButtonEvent();
        return this.div_book_card;
    }
}

const book_view = {
    book_container: document.querySelector('.books-section'),
    DisplayNewBook: function(new_bookHTML) {
        this.book_container.appendChild(new_bookHTML.ReturnHTMLCode());
    },

    EditBook: function(new_bookHTML){
        console.log(new_bookHTML.book.id);
        const edit_bookHTML = document.getElementById(`book-${new_bookHTML.book.id}`);
        edit_bookHTML.after(new_bookHTML.ReturnHTMLCode());
        this.book_container.removeChild(edit_bookHTML);
    },

    DeleteBook: function(id){
        this.book_container.removeChild(document.getElementById(`book-${id}`));
    }
}

const service = {
    book_shelf: [initialBook1, initialBook2],

    Get: function (id) {
        return this.book_shelf.filter((book) => book.id == id);
    },

    Add: function (book) {
        if (this.book_shelf.length == 0) book.id = 1;
        else {
            const max_id = this.book_shelf[this.book_shelf.length - 1].id;
            book.id = max_id + 1;
        }
        this.book_shelf.push(book);
    },

    Remove: function (id) {
        const remove_book = this.Get(id);
        this.book_shelf.splice(this.book_shelf.indexOf(remove_book), 1);
    },

    Edit: function (book) {
        let edit_book = this.Get(book.id);
        edit_book = book;
    }
}

const book_controller = {
    Add: function () {
        const book_property = form.ReturnBookPropertyFromInput();
        const new_book = new Book(book_property);
        service.Add(new_book);
        const new_bookHTML = new BookHTML(new_book);
        book_view.DisplayNewBook(new_bookHTML);
    },

    Edit: function(){
        const book_property = form.ReturnBookPropertyFromInput();
        const new_book = new Book(book_property);
        service.Edit(book_property);
        const new_bookHTML = new BookHTML(new_book);
        book_view.EditBook(new_bookHTML);
    },

    Delete: function(){
        const delete_book = form.ReturnBookPropertyFromInput();
        service.Remove(delete_book.id);
        book_view.DeleteBook(delete_book.id);
    }
}

/* -------------------------------- */
/* ------------ FORM ---------------*/
/* -------------------------------- */

const FORM_STATUS = {
    ADD: "add",
    EDIT: "edit",
    DELETE: "delete"
}

const form = {
    form_wrapper: document.querySelector('.form-wrapper'),
    form_status: FORM_STATUS.ADD, // default
    On_Add: function () {
        this.form_status = FORM_STATUS.ADD;
        this.form_wrapper.querySelector('h1').textContent = 'Add New Book';
        this.form_wrapper.classList.remove('display-none');
    },

    On_Edit: function(book_property){
        this.form_status = FORM_STATUS.EDIT;
        this.SetInputValueFromBookProperty(book_property);
        this.form_wrapper.querySelector('h1').textContent = 'Edit Book';
        this.form_wrapper.classList.remove('display-none');
    },

    On_Delete: function(book_property){
        this.form_status = FORM_STATUS.DELETE;
        this.SetInputValueFromBookProperty(book_property); 
        this.HiddenElement(true);
        this.form_wrapper.querySelector('h1').textContent = 'Delete This Book?';
        this.form_wrapper.classList.remove('display-none');
    },

    Off: function () {
        this.form_wrapper.classList.add('display-none');
    },

    Clear: function () {
        const input_fields = this.form_wrapper.querySelector('.enter-information').children;
        for (let i = 0; i < input_fields.length; ++i) {
            if (input_fields[i].tagName.toLowerCase() == 'input')
                input_fields[i].value = '';
        }
    },

    ReturnBookPropertyFromInput: function () {
        let book_property = {};
        const input_fields = this.form_wrapper.querySelector('.enter-information').children;
        for (let i = 0; i < input_fields.length; ++i) {
            if (input_fields[i].tagName.toLowerCase() == 'input')
                book_property[`${input_fields[i].id}`] = input_fields[i].value;
        }
        book_property['book_status'] = this.form_wrapper.getElementsByTagName('select')[0].value;
        return book_property;
    },

    SetInputValueFromBookProperty: function(book_property){
        const input_fields = this.form_wrapper.querySelector('.enter-information').children;
        for (let i = 0; i < input_fields.length; ++i) {
            if (input_fields[i].tagName == 'INPUT' || input_fields[i].tagName == 'SELECT')
                input_fields[i].value = book_property[`${input_fields[i].id}`];
        }
    },

    HiddenElement: function(isDisable){
        const elements = this.form_wrapper.querySelector('.form').children;
        for (let i = 0; i < elements.length; ++i) {
            if (elements[i].tagName == 'DIV')
                if (isDisable) 
                    elements[i].classList.add('display-none');
                else 
                    elements[i].classList.remove('display-none');
        }
    }
}

form.form_wrapper.addEventListener('click', function (e) {
    console.log(e.target);
    if (e.target.id == 'cancel') {
        if (form.form_status == FORM_STATUS.DELETE)
            form.HiddenElement(false);
        form.Clear();
        form.Off();
    }
    else if (e.target.id == 'submit') {
        if (form.form_status == FORM_STATUS.ADD) 
            book_controller.Add();
        else if (form.form_status == FORM_STATUS.EDIT)
            book_controller.Edit();
        else if (form.form_status == FORM_STATUS.DELETE)
        {
            book_controller.Delete();
            form.HiddenElement(false);
        }
        form.Clear();
        form.Off();
    }
});

document.querySelector('.add-button').addEventListener('click', () => {
    form.On_Add();
})

window.addEventListener('load', () => 
{
    service.book_shelf.forEach(book => {
        const bookHTML = new BookHTML(book);
        book_view.DisplayNewBook(bookHTML);
    })
});
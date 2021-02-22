/* ---------------------------------------- */
/* ------------- BOOK SECTION --------------*/ 
/* ---------------------------------------- */
let isAscending = true;

const BOOK_STATUS = {
    READ: "read",
    NOT_READ: "not-read",
    READING: "reading",

    IndexOf: function(status){
        switch (status)
        {
            case this.READ:
                return 1;
            case this.NOT_READ:
                return 2;
            case this.READING:
                return 3;
            default:
                return -1;
        }
    }
}

const Book_Info = {
    div_info: document.querySelectorAll('#info-number'), // 0: total, 1: read, 2: not read, 3: reading
    UpdateInfoTotal: function(){
        this.div_info[0].textContent = service.book_shelf.length;
        for (let i = 1; i < 4; ++i)
            this.div_info[i].textContent = 0;
        for (let i = 0; i < service.book_shelf.length; ++i)
        {
            ++this.div_info[BOOK_STATUS.IndexOf(service.book_shelf[i].book_status)].textContent;
        }
    },

    UpdateInfoEdit: function(old_status, new_status){
        --this.div_info[BOOK_STATUS.IndexOf(old_status)].textContent;
        ++this.div_info[BOOK_STATUS.IndexOf(new_status)].textContent;
    },

    UpdateInfoAdd: function(status){
        ++this.div_info[0].textContent;
        ++this.div_info[BOOK_STATUS.IndexOf(status)].textContent;
    },

    UpdateInfoDelete: function(status){
        --this.div_info[0].textContent;
        --this.div_info[BOOK_STATUS.IndexOf(status)].textContent;
    }
}

// BOOK CONSTRUCTOR

function Book(book_property) {
    this.title = book_property.title;
    this.authors = book_property.authors;
    this.publisher = book_property.publisher;
    this.publishing_year = book_property.publishing_year;
    this.number_of_pages = book_property.number_of_pages;
    this.book_status = book_property.book_status;
    this.id = book_property.id;
    this.insertion_date = new Date();
}  

// BOOKHTML CONSTRUCTOR

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
            Book_Info.UpdateInfoEdit(this.book.book_status, e.target.value);
            this.div_book_card.classList.remove(this.book.book_status);
            this.book.book_status = e.target.value;
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
    
    Display: function(book_shelf){
        book_shelf.forEach(book => {
            const bookHTML = new BookHTML(book);
            this.AddBook(bookHTML);
        })
    },

    Clear: function(){
        while (this.book_container.firstElementChild)
            this.book_container.firstElementChild.remove();
    },

    AddBook: function(new_bookHTML) {
        if (isAscending)
            this.book_container.appendChild(new_bookHTML.ReturnHTMLCode());
        else
            this.book_container.insertBefore(new_bookHTML.ReturnHTMLCode(), this.book_container.firstElementChild);
    },

    EditBook: function(new_bookHTML){
        const edit_bookHTML = document.getElementById(`book-${new_bookHTML.book.id}`);
        edit_bookHTML.after(new_bookHTML.ReturnHTMLCode());
        this.book_container.removeChild(edit_bookHTML);
    },

    DeleteBook: function(id){
        this.book_container.removeChild(document.getElementById(`book-${id}`));
    },
}

const service = {
    book_shelf: [],
    GetAllBookFormLocalStorage: function(){
        this.book_shelf = JSON.parse(localStorage.getItem('book_shelf'));
        if (this.book_shelf == null)
            this.book_shelf = [];
    },

    Search: function(keyword){
        keyword = keyword.toLowerCase();
        return this.book_shelf.filter(book => {
            return book.id.toString().includes(keyword) ||
                   book.title.toLowerCase().includes(keyword) ||
                   book.authors.toLowerCase().includes(keyword) || 
                   book.publisher.toLowerCase().includes(keyword) || 
                   book.publishing_year.toString().includes(keyword) ||
                   book.number_of_pages.toString().includes(keyword);
        })
    },

    Get: function (id) {
        for (let i = 0; i < this.book_shelf.length; ++i)
            if (this.book_shelf[i].id == id)
                return this.book_shelf[i];
        return null;
    },

    Add: function (book) {
        if (this.book_shelf.length == 0) book.id = 1;
        else {
            const max_id = +this.book_shelf[this.book_shelf.length - 1].id;
            book.id = max_id + 1;
        }
        this.book_shelf.push(book);
        Book_Info.UpdateInfoAdd(book.book_status);
    },

    Delete: function (book) {
        const remove_book = this.Get(book.id);
        this.book_shelf.splice(this.book_shelf.indexOf(remove_book), 1);
        Book_Info.UpdateInfoDelete(book.book_status);
    },

    Edit: function (book) {
        const edit_book = this.Get(book.id);
        const index = this.book_shelf.indexOf(edit_book);
        this.book_shelf[index] = book;
        Book_Info.UpdateInfoEdit(edit_book.book_status, book.book_status);
    },

    SaveToLocalStorage: function(){
        localStorage.setItem('book_shelf', JSON.stringify(this.book_shelf));
    }
}

const book_controller = {
    Add: function () {
        const book_property = form.ReturnBookPropertyFromInput();
        const new_book = new Book(book_property);
        service.Add(new_book);
        const new_bookHTML = new BookHTML(new_book);
        book_view.AddBook(new_bookHTML);
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
        service.Delete(delete_book);
        book_view.DeleteBook(delete_book.id);
    },

    Search: function(){
        const keyword = document.querySelector('.search-bar').value;
        book_view.Clear();
        if (keyword != '')
            book_view.Display(service.Search(keyword));
        else
            book_view.Display(service.book_shelf);
    },
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
            if (input_fields[i].tagName == 'INPUT')
                input_fields[i].value = book_property[`${input_fields[i].id}`];
        }
        this.form_wrapper.getElementsByTagName('select')[0].value = book_property['book_status'];
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

document.querySelector('.search-button').addEventListener('click', () => {
    book_controller.Search();
})

document.getElementById('sort').addEventListener('change', () => {
    isAscending = !isAscending;
    book_controller.Search();
})

window.addEventListener('load', () => 
{
    service.GetAllBookFormLocalStorage();
    book_view.Clear();
    book_view.Display(service.book_shelf);
    Book_Info.UpdateInfoTotal();
});

window.addEventListener('beforeunload', () => {
    service.SaveToLocalStorage();
});

window.addEventListener('keydown', function(e){
    console.log(e.key);
    if (e.key == 'Enter')
        document.querySelector('.search-button').click();
});
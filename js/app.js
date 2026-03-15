class App {
constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    this.title = '';
    this.text = '';
    this.id = '';

    this.$notes = document.querySelector("#notes");
    this.$placeholder = document.querySelector('#placeholder');
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$noteDate = document.querySelector('#note-date');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalDate = document.querySelector('.modal-date');
    this.$modalCloseButton = document.querySelector('.modal-close-button');

    this.render();
    this.addEventListener();
}

addEventListener() {
    document.body.addEventListener('click', event => {
        // Close any open color picker when clicking outside
        if (!event.target.closest('.color-picker')) {
            document.querySelectorAll('.color-options.open').forEach(el => el.classList.remove('open'));
        }
        this.handleFormClick(event);
        this.selectNote(event);
        this.openModal(event);
        this.deleteNote(event);
        this.toggleColorPicker(event);
        this.handleColorPick(event);
    });

    this.$form.addEventListener('submit', event => {
        event.preventDefault();
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const date = this.$noteDate.value;
        const hasNote = title || text;
        if (hasNote) {
            this.addNote({ title, text, date });
        }
    });

    this.$formCloseButton.addEventListener('click', event => {
        event.stopPropagation();
        this.closeForm();
    });

    this.$modalCloseButton.addEventListener('click', event => {
        this.closeModal(event);
    });
}

handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const date = this.$noteDate.value;
    const hasNote = title || text;

    if (isFormClicked) {
        this.openForm();
    } else if (hasNote) {
        this.addNote({ title, text, date });
    } else {
        this.closeForm();
    }
}

openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$noteDate.style.display = 'block';
    this.$formButtons.style.display = 'flex';
}

closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$noteDate.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
}

openModal(event) {
    if (event.target.matches('.toolbar-delete')) return;
    if (event.target.closest('.color-picker')) return;
    if (event.target.closest('.note')) {
        this.$modal.classList.toggle('open-modal');
        this.$modalTitle.value = this.title;
        this.$modalText.value = this.text;
        this.$modalDate.value = this.date;
    }
}

closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
}

toggleColorPicker(event) {
    if (!event.target.matches('.toolbar-color')) return;
    event.stopPropagation();
    const options = event.target.closest('.color-picker').querySelector('.color-options');
    options.classList.toggle('open');
}

handleColorPick(event) {
    if (!event.target.matches('.color-dot')) return;
    event.stopPropagation();
    const color = event.target.dataset.color;
    const id = event.target.dataset.id;
    if (color && id) {
        this.id = id;
        this.editNoteColor(color);
    }
}

addNote({ title, text, date }) {
    const newNote = {
        title,
        text,
        date: date.split('-').reverse().join('-'),
        color: 'white',
        id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
}

editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    const date = this.$modalDate.value.split('-').reverse().join('-');
    this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? { ...note, title, text, date } : note
    );
    this.render();
}

editNoteColor(color) {
    this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render();
}

selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
}

deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
}

render() {
    this.saveNotes();
    this.displayNotes();
}

saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
}

displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
    this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="note-date">${note.date}</div>
            <div class="toolbar">
                <div class="color-picker">
                    <i class="fas fa-palette toolbar-color" data-id="${note.id}"></i>
                    <div class="color-options">
                        <div class="color-dot" data-color="#de7136" data-id="${note.id}"></div>
                        <div class="color-dot" data-color="#6eb269" data-id="${note.id}"></div>
                        <div class="color-dot" data-color="#3baad7" data-id="${note.id}"></div>
                        <div class="color-dot" data-color="#de8e83" data-id="${note.id}"></div>
                        <div class="color-dot" data-color="#d59200" data-id="${note.id}"></div>
                    </div>
                </div>
                <i class="fas fa-trash toolbar-delete" data-id="${note.id}"></i>
            </div>
        </div>
    `).join("");
}

}

new App();

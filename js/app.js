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
    this.$formCloseButton = document.querySelector('#form-close-button')
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalDate = document.querySelector('.modal-date');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$colorTooltip = document.querySelector('#color-tooltip');

    this.render();
    this.addEventListener();
}

addEventListener() {
    document.body.addEventListener('click', event => {
    this.handleFormClick(event);
    this.selectNote(event);
    this.openModal(event);
    this.deleteNote(event);
    });

document.body.addEventListener('mouseover', event => {
    this.openTooltip(event);  
     });

document.body.addEventListener('mouseout', event => {
    this.closeTooltip(event);  
     });  
     
this.$colorTooltip.addEventListener('mouseover', function() {
        this.style.display = 'flex';
    })
    
this.$colorTooltip.addEventListener('mouseout', function() {
        this.style.display = 'none';
    })

this.$colorTooltip.addEventListener('click', event => {
        const color = event.target.dataset.color; 
        if (color) {
          this.editNoteColor(color);  
        }
     })

this.$form.addEventListener('submit', event => {
        event.preventDefault();
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const date = this.$noteDate.value;
        const hasNote = title || text;
        if (hasNote) {
            this.addNote({ title, text, date});
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

handleFormClick() {
const isFormClicked = this.$form.contains(event.target);

const title = this.$noteTitle.value;
const text = this.$noteText.value;
const date = this.$noteDate.value;
const hasNote = title || text;

if (isFormClicked) {
    this.openForm();
    } else if (hasNote) {
    this.addNote({ title, text, date});
    }
    else {
    this.closeForm(); 
    }
}

openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$noteDate.style.display = 'block';
    this.$formButtons.style.display = 'block';
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

openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.id = event.target.dataset.id; 
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX + 20;
    const vertical = noteCoords.top + window.scrollY + 10;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';
  }

closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';  
}

addNote ({ title, text, date}) {
    
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

// var result = date.split('/').reverse().join('')

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
    this.render();
 }

deleteNote(event) {
    event.stopPropagation();
    if(!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
}

render() {
    this.saveNotes();
    this.displayNotes();
}

saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
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
        <img class="toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
        <img class="toolbar-delete" data-id=${note.id}  src="https://icon.now.sh/delete">
    </div>
    </div>
    </div>
   `).join("");
   
}

}

new App();
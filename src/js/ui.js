let quill

export function startEditor() {
    quill = new Quill('#editorContainer', {
        theme: 'snow',
        placeholder: 'Write Content',
        modules: {
            toolbar: [
                ['bold', 'italic', { 'list': 'ordered'}, { 'list': 'bullet' }, 'clean'],
            ]
        }
    });
    $('.ql-toolbar').hide();
}

export function getEditorContent() {
        return quill.root.innerHTML;
}

export function expandEditor() {
    $("#noteTypeSwitch").removeClass('note-hidden');
    $("#noteSubmit").removeClass('note-hidden');
    $("#editorContainer").removeClass('note-hidden');
    $('.ql-toolbar').show();
    $("#dateSubDiv").removeClass('note-hidden');
}

export function collapseEditor() {
    $("#noteTypeSwitch").addClass('note-hidden');
    $("#noteSubmit").addClass('note-hidden');
    $("#editorContainer").addClass('note-hidden');
    $('.ql-toolbar').hide();
    $("#dateSubDiv").addClass('note-hidden');

    $("#noteTitle").val("");

    quill.setContents([]);
}


export function setTaskMode() {
    $("#noteTypeSwitch").text('Task');
    $("#noteTypeSwitch").removeClass('bg-emerald-300/70');
    $("#noteTypeSwitch").addClass('bg-amber-300/70');

    $("#taskDeadlineText").removeClass('note-hidden');

}

export function setNoteMode() {
    $("#noteTypeSwitch").text('Note');
    $("#noteTypeSwitch").removeClass('bg-amber-300/70');
    $("#noteTypeSwitch").addClass('bg-emerald-300/70');
    $("#taskDeadlineText").addClass('note-hidden');
}
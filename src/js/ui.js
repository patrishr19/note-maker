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

export function openCreateModal(){
    $('#createField').appendTo('#mobileCreate');

    $('#mobileModal').removeClass('opacity-0 pointer-events-none').addClass('opacity-100 pointer-events-auto');
    $('#mobileCreate').removeClass('opacity-0 scale-95').addClass('opacity-100 scale-100');

    $('body').removeClass('overflow-y-auto');
    $('body').addClass('overflow-y-hidden');

    expandEditor();
}

export function closeCreateModal(){
    $('#createField').appendTo('#desktopCreate');

    $('#mobileModal').removeClass('opacity-100 pointer-events-auto').addClass('opacity-0 pointer-events-none');
    $('#mobileCreate').removeClass('opacity-100 scale-100').addClass('opacity-0 scale-95');

    $('body').removeClass('overflow-y-hidden');
    $('body').addClass('overflow-y-auto');

    collapseEditor();
}

export function expandPinned() {
    $('#pinnedNotes').removeClass('hidden');
    $('#collapsePinned svg').removeClass('rotate-180').addClass('rotate-0');
}

export function collapsePinned() {
    $('#pinnedNotes').addClass('hidden');
    $('#collapsePinned svg').removeClass('rotate-0').addClass('rotate-180');
}

export function expandRecent() {
    $('#recentNotes').removeClass('hidden');
    $('#collapseRecent svg').removeClass('rotate-180').addClass('rotate-0');
}

export function collapseRecent() {
    $('#recentNotes').addClass('hidden');
    $('#collapseRecent svg').removeClass('rotate-0').addClass('rotate-180');
}

export function openMoreOptions() {
    $('#moreOptions').removeClass('opacity-0 scale-95 pointer-events-none').addClass('opacity-100 scale-100 pointer-events-auto');
}

export function closeMoreOptions() {
    $('#moreOptions').removeClass('opacity-100 scale-100 pointer-events-auto').addClass('opacity-0 scale-95 pointer-events-none');
}
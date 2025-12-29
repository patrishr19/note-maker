import {startEditor, getEditorContent, collapseEditor, expandEditor, setNoteMode, setTaskMode} from './ui.js';

startEditor();

const $field = $('#createField')

$(document).on("click", (e) => {
    const isInside = $field.is(e.target) || $field.has(e.target).length > 0;
    const isHidden = $("#editorContainer").hasClass("note-hidden");

    if (isInside && isHidden) {
        expandEditor();
    } 
    else if (!isInside && !isHidden) {
        collapseEditor();
        setNoteMode();
        $("#noteType").val('note');
    }
});

const $noteTypeSwitch = $('#noteTypeSwitch');

$noteTypeSwitch.on("click", () => {
    const currentType = $('#noteType').val();
    let newType = currentType;
    if (currentType === 'note') {
        newType = 'task';
        setTaskMode();
    }
    else {
        newType = 'note';
        setNoteMode();
    }
    $("#noteType").val(newType);
})
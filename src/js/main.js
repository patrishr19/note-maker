import {startEditor, getEditorContent, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent} from './ui.js';

startEditor();

$(document).on("click", (e) => {
    const modal = $('#mobileModal');
    const isModalHidden = modal.hasClass('opacity-0'); // Opacity
    const clickedToggleButton = $(e.target).closest('#modalToggleButton').length > 0;

    if (clickedToggleButton) {
        if (isModalHidden) {
            openCreateModal();
        } else {
            closeCreateModal();
        }
        return;
    }
    if (!isModalHidden) {
        const isInsideModal = $(e.target).closest('#createField').length > 0;

        if (!isInsideModal) {
            closeCreateModal();
        }
        return;
    }

    const isInside = $(e.target).closest('#createField').length > 0;
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

$(window).on('resize', () =>{
    if ($(window).width() > 640 && !$("#mobileModal").hasClass('hidden')) {
        closeCreateModal();
    }
});

$('#collapsePinned').on('click', (e) => {
    const isPinnedHidden = $('#pinnedNotes').hasClass('hidden');

    if (isPinnedHidden) {
        expandPinned();
    } else {
        collapsePinned();
    }
});

$('#collapseRecent').on('click', (e) => {
    const isRecentHidden = $('#recentNotes').hasClass('hidden');

    if (isRecentHidden) {
        expandRecent();
    } else {
        collapseRecent();
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
let quill;

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

export function getCreationNoteData() {
    return {
        title: $('#noteTitle').val().trim(),
        content: quill.root.innerHTML,
        type: $('#noteType').val(),
        deadline: $('#taskDeadline').val() || ""
    }
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

    $("#taskDeadline").val('');
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

export function renderNotes(note) {
    //console.log(note);

    let isTask = false;
    let typeColor = 'text-white';
    let deadlineColor = 'text-lime-600';
    let pinFill = 'fill-none';
    let pinned = false;
    const noteType = note.type || "";
    if (noteType === 'task') {
        isTask = true;
        typeColor = 'text-amber-500';
    } else {
        isTask = false;
        typeColor = 'text-emerald-300';
    }
    if (note.is_pinned == 1) {
        pinFill = 'fill-white';
        pinned = true;
    } else {
        pinFill = 'fill-none';
        pinned = false;
    }
    let deadlineHTML = '';

    if (isTask && note.deadline) {
        const time = new Date(note.deadline);
        const now = new Date();
        //console.log(time, now)
        if (now > time) {
            deadlineColor = 'text-red-500';
        }

        deadlineHTML = `<!-- divider -->
                            <div class="h-px bg-white/50"></div>
                            <!-- bottom section -->
                             <div class="flex mx-1 h-8 gap-2 items-center justify-between">
                                <span class="select-none font-montserrat font-semibold uppercase text-sm ${deadlineColor}"><span>${note.deadline}</span></span>
                                <span class="select-none font-ubuntu font-medium uppercase text-md text-sky-200">${note.taskStatus || ''}</span>
                             </div>`;
    }

    const noteHTML = `
        <div class="min-h-60 h-full bg-zinc-700 rounded-md p-2 border border-zinc-600 transition-all flex hover:scale-103 cursor-pointer noteCard" data-note-id='${note.ID}' data-pinned='${note.is_pinned}'>
                        <div class="flex flex-1 flex-col min-w-0">
                            <!-- upper section -->
                            <div class="flex mx-1 h-8 gap-2 items-center">
                                <div class="break-all flex-1 min-w-0 line-clamp-1 font-sans font-medium text-lg text-white/80">
                                ${note.title}
                                </div>
                                <span class="select-none font-montserrat font-semibold uppercase text-lg tracking-normal ${typeColor}">${note.type}</span>
                                <button type='button' class="p-1 cursor-pointer rounded-md hover:bg-zinc-800 transition-all pinNote">
                                    <svg class="size-6 stroke-white ${pinFill}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z" stroke-width="1" stroke-linecap="round"></path> </g></svg>
                                </button>
                            </div>
                            <!-- divider -->
                            <div class="h-px bg-white/50"></div>
                            <!-- task content -->
                            <div class="mx-1 mt-1 flex-1">
                                <div class="break-all line-clamp-6 text-md font-light font-notoSans text-zinc-100">
                                    ${note.content}
                                </div>
                            </div>
                            ${deadlineHTML || ''}
                        </div>
                    </div>
    ` 
    if (pinned) {
        $(noteHTML).appendTo($('#pinnedNotes'));
    } else {
        $(noteHTML).appendTo($('#recentNotes'));
    }
}

export function updateNav(url){
    $('.nav-link').removeAttr('aria-current');
    $(`.nav-link[href="${url}"]`).attr('aria-current', 'page');

    $('.nav-desktop').removeClass('bg-gray-950/25 text-white').addClass('text-gray-300 hover:bg-white/5 hover:text-white');
    $(`.nav-desktop[href="${url}"]`).removeClass('text-gray-300 hover:bg-white/5 hover:text-white').addClass('bg-gray-950/25 text-white');
    
    $('.nav-extra').removeClass('text-gray-100').addClass('text-gray-400')
    $(`.nav-extra[href="${url}"]`).removeClass('text-gray-400').addClass('text-gray-100');

    $('.nav-mobile').removeClass('text-white bg-gray-950/25').addClass('text-zinc-400');
    $(`.nav-mobile[href="${url}"]`).removeClass('text-zinc-400').addClass('text-white bg-gray-950/25');
}
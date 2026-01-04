import {BASE} from './main.js';

let quill;
let quill2;

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
    $('#createField .ql-toolbar').hide();
}

export function startUpdateEditor() {
    quill2 = new Quill('#editorUpdateContainer', {
        theme: 'snow',
        placeholder: 'Write Content',
        modules : {
            toolbar: [
                ['bold', 'italic', { 'list': 'ordered'}, { 'list': 'bullet' }, 'clean'],
            ]
        }
    });
}

export function loadDataToUpdate(data) {
    $('#noteUpdateTitle').val(data.title);
    quill2.root.innerHTML = data.content;
    $('#noteUpdateType').val(data.type);
    $('#taskUpdateDeadline').val(data.deadline) || "";
    $('#updateField').data('note-id', data.ID);
    $('#updateField').data('note-status', data.status);
}

export function loadUserData(user) {
    $('#firstProfileName').val(hsc(user.first_name));
    $('#lastProfileName').val(hsc(user.last_name));
    $('#profileEmail').val(hsc(user.email));
}

export function getUpdateData() {
    return {
        title: hsc($('#noteUpdateTitle').val()),
        content: quill2.root.innerHTML,
        type: hsc($('#noteUpdateType').val()),
        deadline: hsc($('#taskUpdateDeadline').val()) || '',
        status: $('#updateField').data('note-status')
    }
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
    if ($("#editorContainer").length === 0) return;
    
    $("#noteTypeSwitch").addClass('note-hidden');
    $("#noteSubmit").addClass('note-hidden');
    $("#editorContainer").addClass('note-hidden');
    $('#createField .ql-toolbar').hide();
    $("#dateSubDiv").addClass('note-hidden');

    $("#noteTitle").val("");

    quill.setContents([]);
}


export function setTaskMode(noteTypeSwitch, taskDeadlineText) {
    noteTypeSwitch.text('Task');
    noteTypeSwitch.removeClass('bg-emerald-300/70');
    noteTypeSwitch.addClass('bg-amber-300/70');

    taskDeadlineText.removeClass('note-hidden');

}

export function setNoteMode(noteTypeSwitch, taskDeadlineText, taskDeadline) {
    noteTypeSwitch.text('Note');
    noteTypeSwitch.removeClass('bg-amber-300/70');
    noteTypeSwitch.addClass('bg-emerald-300/70');
    taskDeadlineText.addClass('note-hidden');

    //taskDeadline.val('');
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
    const isCompact = localStorage.getItem('compactMode') === 'true';
    const minH = isCompact ? 'min-h-28 h-auto' : 'min-h-60 h-full';
    const clamp = isCompact ? 'line-clamp-2' : 'line-clamp-6';
    let isTask = false;
    let typeColor = 'text-white';
    let deadlineColor = 'text-lime-600';
    let pinFill = 'fill-none';
    let isArchive;
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
    if (note.status === 'archive') {
        isArchive = true;
    } else {
        isArchive = false;
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
                                <span class="select-none font-montserrat font-semibold uppercase text-sm ${deadlineColor}"><span>${hsc(note.deadline)}</span></span>
                             </div>`;
    }

    const noteHTML = `
        <div class="${minH} bg-zinc-700 rounded-md p-2 border border-zinc-600 transition-all flex hover:scale-103 cursor-pointer noteCard" data-note-id='${note.ID}' data-pinned='${note.is_pinned}'>
                        <div class="flex flex-1 flex-col min-w-0">
                            <!-- upper section -->
                            <div class="flex mx-1 h-8 gap-2 items-center">
                                <div class="break-all flex-1 min-w-0 line-clamp-1 font-sans font-medium text-lg text-white/80 noteCard-title">
                                ${hsc(note.title)}
                                </div>
                                <span class="select-none font-montserrat font-semibold uppercase text-lg tracking-normal ${typeColor}">${hsc(note.type)}</span>
                                <button type='button' class="p-1 cursor-pointer rounded-md hover:bg-zinc-800 transition-all pinNote">
                                    <svg class="size-6 stroke-white ${pinFill}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g class="SVGRepo_bgCarrier" stroke-width="0"></g><g class="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g class="SVGRepo_iconCarrier"> <path d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z" stroke-width="1" stroke-linecap="round"></path> </g></svg>
                                </button>
                            </div>
                            <!-- divider -->
                            <div class="h-px bg-white/50"></div>
                            <!-- task content -->
                            <div class="mx-1 mt-1 flex-1">
                                <div class="break-all ${clamp} text-md font-light font-notoSans text-zinc-100 noteCard-content">
                                    ${note.content}
                                </div>
                            </div>
                            ${deadlineHTML || ''}
                        </div>
                    </div>
    ` 
    if (!isArchive) {
        if (pinned) {
            $(noteHTML).appendTo($('#pinnedNotes'));
        } else {
            $(noteHTML).appendTo($('#recentNotes'));
        }   
    } else if (isArchive) {
        $(noteHTML).appendTo($('#archiveNotes'));
    }
}

export function updateNav(url){
    $('.nav-link').removeAttr('aria-current');
    $(`.nav-link[data-view="${url}"]`).attr('aria-current', 'page');

    $('.nav-desktop').removeClass('bg-gray-950/25 text-white').addClass('text-gray-300 hover:bg-white/5 hover:text-white');
    $(`.nav-desktop[data-view="${url}"]`).removeClass('text-gray-300 hover:bg-white/5 hover:text-white').addClass('bg-gray-950/25 text-white');
    
    $('.nav-extra').removeClass('text-gray-100').addClass('text-gray-400')
    $(`.nav-extra[data-view="${url}"]`).removeClass('text-gray-400').addClass('text-gray-100');

    $('.nav-mobile').removeClass('text-white bg-gray-950/25').addClass('text-zinc-400');
    $(`.nav-mobile[data-view="${url}"]`).removeClass('text-zinc-400').addClass('text-white bg-gray-950/25');
}


export function openUpdateModal(){

    $('#updateModal').removeClass('opacity-0 pointer-events-none').addClass('opacity-100 pointer-events-auto');
    $('#updateCreate').removeClass('opacity-0 scale-95').addClass('opacity-100 scale-100');

    $('body').removeClass('overflow-y-auto');
    $('body').addClass('overflow-y-hidden');

}

export function closeUpdateModal(){

    $('#updateModal').removeClass('opacity-100 pointer-events-auto').addClass('opacity-0 pointer-events-none');
    $('#updateCreate').removeClass('opacity-100 scale-100').addClass('opacity-0 scale-95');

    $('body').removeClass('overflow-y-hidden');
    $('body').addClass('overflow-y-auto');
}
export function removeAddSearch(state) {
    const button = $('#searchButton');
    const restore = $('#restoreSearch');
    if (state) {
        button.remove();
        restore.remove();
    } else {
        $('#moreNavbar').prepend(button);
        $('#moreNavbar').prepend(restore);
        $(restore).hide();
    }
}


export function showInfo(message, status) {
    $('.popup-info').remove();

    const color = {
        success: 'bg-green-600',
        error: 'bg-red-700' 
    }[status];

    const popup = $(`
        <div class='popup-info fixed top-5 left-1/2 -translate-x-1/2 ${color} text-white font-openSans px-4 z-[100] flex items-center transition-all duration-300 outline rounded-xs outline-zinc-800 opacity-0'>
            <span>${hsc(message)}</span>
        </div>
        `);

    $('body').append(popup);

    setTimeout(() => popup.removeClass('opacity-0'), 10);

    setTimeout(() => {
        popup.addClass('opacity-0');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}


export function hsc(text) { // nahrada za html special chars ze stack overflow
    if (!text) {
        return '';
    } else {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
}

export function openSearchModal(){

    $('#searchModal').removeClass('opacity-0 pointer-events-none').addClass('opacity-100 pointer-events-auto');
    $('#searchField').removeClass('opacity-0 scale-95').addClass('opacity-100 scale-100');

    $('body').removeClass('overflow-y-auto');
    $('body').addClass('overflow-y-hidden');

    setTimeout(() => {
        $('#searchInput').focus();
    }, 300);
}

export function closeSearchModal(){

    $('#searchModal').removeClass('opacity-100 pointer-events-auto').addClass('opacity-0 pointer-events-none');
    $('#searchField').removeClass('opacity-100 scale-100').addClass('opacity-0 scale-95');

    $('body').removeClass('overflow-y-hidden');
    $('body').addClass('overflow-y-auto');
}

export function openPasswordModal() {
    $('#passwordModal').removeClass('opacity-0 pointer-events-none').addClass('opacity-100 pointer-events-auto');
    $('#passwordField').removeClass('opacity-0 scale-95').addClass('opacity-100 scale-100');

    $('body').removeClass('overflow-y-auto');
    $('body').addClass('overflow-y-hidden');
}

export function closePasswordModal() {
    $('#passwordModal').removeClass('opacity-100 pointer-events-auto').addClass('opacity-0 pointer-events-none');
    $('#passwordField').removeClass('opacity-100 scale-100').addClass('opacity-0 scale-95');

    $('body').removeClass('overflow-y-hidden');
    $('body').addClass('overflow-y-auto');

    $('#currentPassword').val('');
    $('#newPassword').val('');
}

export function getPasswordData() {
    return {
        currentPassword: $('#currentPassword').val(),
        newPassword: $('#newPassword').val()
    }
}

export function resetPfp() {
    const userJson = localStorage.getItem('user');

    let pfp = null;
    if (userJson) {
        const user = JSON.parse(userJson);
        pfp = user.profile_picture || user.pfp;
    }

    if (pfp) {
        const url = `${BASE}/src/uploads/${pfp}`;

        $('#profilePictureUrl, #profilePictureMain').attr('src', url);
    }
}

export function toggleOffline() {
    if (!navigator.onLine) {
        $('body').addClass('is-offline');
        showInfo('You are offline', 'error');
    } else {
        $('body').removeClass('is-offline');
        showInfo('You are online', 'success');
    }
}

export function syncPref() {
    const compactToggle = $('#compactToggle');

    if (compactToggle.length > 0) {
        const isCompact = localStorage.getItem('compactMode') === 'true';
        compactToggle.prop('checked', isCompact);
    }
}

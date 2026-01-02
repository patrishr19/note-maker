export const views = {
    home: {
        content: `
            <!-- desktop create -->
            <div id="desktopCreate" class="hidden sm:block mx-auto max-w-lg">
                <!-- Create Field -->
                <form id="createField" class="block w-full max-w-lg! mx-auto! rounded-md bg-zinc-800 shadow-md outline outline-solid outline-white/50 outline-offset-1 my-3">
                    <div class="flex flex-col p-2 gap-1">
                        <span class="flex">
                            <input id="noteTitle" type="text" placeholder="Create a note" name="noteTitle" class="flex-1 bg-transparent outline-none border-none font-normal px-3 font-openSans text-white/80 placeholder-white/40 placeholder:font-light placeholder:select-none">
                            <button type="button" id="noteTypeSwitch" class="transition-all cursor-pointer px-2 py-1 bg-emerald-300/70 rounded-md text-white/80 font-medium select-none hover:scale-110 note-hidden">Note</button>
                        </span>
                        <div id="editorContainer" class="text-white min-h-11 note-hidden"></div>
                        <div id="dateSubDiv" class="flex items-center note-hidden">
                            <div class="px-3 text-white/60 font-light font-openSans note-hidden" id="taskDeadlineText">
                                <span class="select-none">Set Deadline:</span>
                                <input type="datetime-local" class="border-none outline-none w-48 select-none cursor-pointer" id="taskDeadline" name="taskDeadline">
                            </div>
                            <button id="noteSubmit" type="submit" class="p-1 w-1/6 ml-auto text-white/60 font-openSans font-light cursor-pointer hover:bg-zinc-700/30 rounded-md note-hidden select-none">Save</button>
                        </div>
                        <input type="hidden" id="noteType" value="note" name="noteType">
                    </div>
                </form>
            </div>
            <!-- Pinned notes collapse -->
            <div id="pinnedHr" class="flex items-center gap-1 my-2 group">
                <div class="h-px bg-zinc-600 w-1/18"></div>
                <div class="flex items-center gap-1 text-zinc-500">
                    <svg class="size-6 stroke-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z" stroke-width="1" stroke-linecap="round"></path> </g></svg>
                    <span class="text-lg font-sans select-none">Pinned</span>
                </div>
                <div class="h-px bg-zinc-600 flex-1"></div>
                <button class="text-zinc-500 cursor-pointer rounded-md hover:text-zinc-100 hover:bg-zinc-700 transition-all" id="collapsePinned">
                    <svg class="size-10 stroke-current fill-current transition-all" viewBox="-8.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>angle-down</title> <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path> </g></svg>
                </button>
            </div>
            <!-- Pinned Notes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none" id="pinnedNotes">
                
            </div>
                
            <!-- Recent notes collapse -->
                <div id="recentHr" class="flex items-center gap-1 my-2 group">
                <div class="h-px bg-zinc-600 w-1/18"></div>
                <div class="flex items-center gap-1 text-zinc-500">
                    <svg class="size-6 stroke-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 6V12" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16.24 16.24L12 12" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <span class="text-lg font-sans select-none">Recent</span>
                </div>
                <div class="h-px bg-zinc-600 flex-1"></div>
                <button class="text-zinc-500 cursor-pointer rounded-md hover:text-zinc-100 hover:bg-zinc-700 transition-all" id="collapseRecent">
                    <svg class="size-10 stroke-current fill-current transition-all" viewBox="-8.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>angle-down</title> <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path> </g></svg>
                </button>
            </div>
            <!-- Recent Notes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="recentNotes">
            
            </div>
        `,
        dynamic: `
            <button class="fixed sm:hidden bottom-6 right-6 z-50 bg-zinc-600 text-white/80 rounded-2xl p-2 inset-shadow-lg cursor-pointer" id="modalToggleButton">
                <svg class="select-none size-10 stroke-current group-hover:stroke-white transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H20M12 4V20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="sr-only">New Note</span>
            </button>
            <!-- mobile create modal -->
            <div id="mobileModal" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-md sm:hidden transition-all duration-300 ease-in-out opacity-0 pointer-events-none">
                <div class="w-full transition-all duration-300 transform scale-95 opacity-0" id="mobileCreate"></div>
            </div>
        `
    },
    pinned: {
        content: `
            <!-- Pinned Notes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none mt-3" id="pinnedNotes">
                
            </div>        
        `,
        dynamic: ``
    },
    profile: {
        content: `
            <div class="flex flex-col justify-self-center rounded-xl bg-zinc-700 min-h-60 w-full md:w-3/4 lg:w-1/2 shadow-2xl outline outline-white/10 -outline-offset-1 py-2 px-4">
                <div class="flex flex-col items-center gap-3 mt-2">
                    <div id="profilePicturePlaceholder" class="relative md:size-48 size-32 select-none rounded-full outline outline-white/10">
                            <img class="size-full rounded-full object-cover" src="https://i.ibb.co/tw4whtRs/phil-Mahar.jpg" alt="Profile Picture">
                    </div>
                    <div class="flex flex-col gap-4 w-full px-3">
                        <div class="relative flex">
                            <input id="firstName" name="firstName" type="text" class="flex-1 border-none rounded-lg peer outline outline-white/40 focus:outline-white/80 min-h-8 bg-zinc-300/1 font-notoSans text-white/70 px-2 font-light focus:text-white/95 focus:outline-3 items-center w-full">
                            <label for="firstName" class="absolute -top-3 z-20 bg-zinc-700 text-sm text-white/70 left-3 select-none peer-focus:text-white/95 font-openSans">First name</label>
                        </div>
                        <div class="relative flex">
                            <input id="lastName" name="lastName" type="text" class="flex-1 border-none rounded-lg peer outline outline-white/40 focus:outline-white/80 min-h-8 bg-zinc-300/1 font-notoSans text-white/70 px-2 font-light focus:text-white/95 focus:outline-3 items-center w-full">
                            <label for="lastName" class="absolute -top-3 z-20 bg-zinc-700 text-sm text-white/70 left-3 select-none peer-focus:text-white/95 font-openSans">Last name</label>
                        </div>
                        <div class="relative flex">
                            <input id="email" name="email" type="email" class="flex-1 border-none rounded-lg peer outline outline-white/40 focus:outline-white/80 min-h-8 bg-zinc-300/1 font-notoSans text-white/70 px-2 font-light focus:text-white/95 focus:outline-3 items-center w-full">
                            <label for="email" class="absolute -top-3 z-20 bg-zinc-700 text-sm text-white/70 left-3 select-none peer-focus:text-white/95 font-openSans">Email</label>
                        </div>
                        <button class="text-center rounded-lg bg-white/70 min-h-8 font-montserrat font-medium cursor-pointer select-none transition-all transform ease-in-out duration-300 hover:scale-105">Change password</button>
                    </div>
                    <button id="submitProfileChanges" type="submit" class="text-center rounded-lg bg-white/95 min-h-10 w-full font-medium cursor-pointer select-none transition-all transform ease-in-out duration-300 hover:scale-105 font-montserrat">Save</button>
                </div>
            </div>            
        `,
        dynamic: ``
    },
    preferences: {
        content: `
            <div class="flex flex-col justify-self-center rounded-xl bg-zinc-700 min-h-20 w-full sm:w-2/3 md:w-1/2 lg:w-1/4 shadow-2xl outline outline-white/10 -outline-offset-1 py-4 px-6 gap-4">
                <div class="flex select-none">
                    <span class="font-medium font-openSans text-white/95 w-full">Light theme</span>
                    <label for="lightThemeToggle" class="relative inline-flex items-center cursor-pointer select-none">
                        <input name="settingLightTheme" type="checkbox" id="lightThemeToggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-zinc-600 rounded-full peer outline-1 outline-white/50 transition-all duration-200 peer-checked:bg-white/75"></div>

                        <div class="absolute left-1 top-1 size-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 peer-checked:outline peer-checked:outline-black/25 shadow-2xl"></div>
                    </label>
                </div>
                <div class="flex select-none">
                    <span class="font-medium font-openSans text-white/95 w-full">List view</span>
                    <label for="listToggle" class="relative inline-flex items-center cursor-pointer select-none">
                        <input name="settingList" type="checkbox" id="listToggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-zinc-600 rounded-full peer outline-1 outline-white/50 transition-all duration-200 peer-checked:bg-white/75"></div>

                        <div class="absolute left-1 top-1 size-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 peer-checked:outline peer-checked:outline-black/25 shadow-2xl"></div>
                    </label>
                </div>
            </div>
        `,
        dynamic: ``
    }
}
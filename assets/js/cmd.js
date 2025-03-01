document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyQ') {
        event.stopPropagation();
        if (document.activeElement.id === 'command-line') {
            console.log('goodbye!');
            document.getElementById('command-line').remove();
        } else {
            openCommandLine();
        }
    }
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('#command-line')) {
        const commandLine = document.getElementById('command-line');
        if (commandLine) {
            console.log('goodbye!');
            commandLine.remove();
        }
    }
});

// exporting .oto storage

function exportLocalStorage() {
    console.log('exporting localstorage');

    tabs.forEach((tab) => {
        if (tab.type === "simplemde") {
            const editor = tabInstances.get(tab.id);
            if (editor) {
                tab.content = editor.value();
                tab.history = editor.codemirror.getHistory();
                tab.previewState = editor.isPreviewActive();
            }
            localStorage.setItem(`smde_tab${tab.id}`, JSON.stringify(tab));
        }
    });

    // Backup all localStorage keys (iterating explicitly for reliability)
    const backupData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backupData[key] = localStorage.getItem(key);
    }

    const data = JSON.stringify(backupData);
    const compressedData = pako.gzip(data);
    const base64Data = btoa(String.fromCharCode(...compressedData));
    const date = new Date();
    const filename = `backup_${date.toLocaleDateString('en-GB').replace(/\//g, '-')}_${date.toLocaleTimeString('en-GB').replace(/:/g, '-')}.oto`;

    const blob = new Blob([base64Data], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    console.log(`exported to ${filename}`);
}

// importing .oto storage

function importLocalStorage() {
    console.log('importing localstorage');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.oto';

    fileInput.addEventListener('change', function (event) {
        console.log('change event:', event);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log('reading file...');
                try {
                    const base64Data = e.target.result;
                    const binaryString = atob(base64Data);
                    const compressedData = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        compressedData[i] = binaryString.charCodeAt(i);
                    }
                    const decompressedData = pako.ungzip(compressedData, { to: 'string' });
                    const data = JSON.parse(decompressedData);
                    console.log('parsed data:', data);

                    localStorage.clear();
                    for (const key in data) {
                        localStorage.setItem(key, data[key]);
                    }

                    tabs = JSON.parse(localStorage.getItem("tabs")) || [{
                        id: String(Date.now()),
                        name: "tab1",
                        type: "simplemde",
                        content: localStorage.getItem("tab1") || "",
                        history: null,
                        previewState: false,
                    }];

                    renderTabs();
                    switchTab(tabs[0].id);

                    // Retrieve the editor instance for the active tab
                    const editor = tabInstances.get(tabs[0].id);
                    if (editor) {
                        editor.value(tabs[0].content);
                    }

                    console.log('imported localstorage');
                } catch (error) {
                    console.error('failed to import localstorage:', error);
                    alert('Failed to import localstorage. The file might be corrupted or invalid.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click();
}

// Global flag to indicate when a reset is in progress
let isResetting = false;

// Update beforeunload to check for the reset flag
window.addEventListener("beforeunload", () => {
    if (isResetting) return; // Skip saving state if resetting

    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab && currentTab.type === "simplemde") {
            const simplemde = tabInstances.get(currentTabId);
            if (simplemde) {
                currentTab.content = simplemde.value();
                currentTab.history = simplemde.codemirror.getHistory();
                currentTab.previewState = simplemde.isPreviewActive();
                localStorage.setItem(`smde_tab${currentTabId}`, simplemde.value()); // Explicitly save
            }
        }
    }
    localStorage.setItem("tabs", JSON.stringify(tabs));
});

// Updated "factory reset" function
function begone() {
    const shouldProceed = confirm("This will remove everything, and there is no going back. Are you sure?");
    if (shouldProceed) {
        // Set the flag to bypass beforeunload saving
        isResetting = true;
        
        // Clear all saved data
        localStorage.clear();

        // Clear content container and tab instances
        const contentContainer = document.getElementById("ca-tab-content");
        if (contentContainer) contentContainer.innerHTML = "";
        tabInstances.clear();

        // Reset tabs to the initial state
        tabs = [{
            id: String(Date.now()),
            name: "tab1",
            type: "simplemde",
            content: "",
            history: null,
            previewState: false,
        }];

        renderTabs();
        switchTab(tabs[0].id);

        // Reload the page to fully cancel any pending autosave timers
        window.location.reload();
    }
}



function openCommandLine() {
    console.log('hello! summoning command line...');
    let commandLine = document.getElementById('command-line');

    if (!commandLine) {
        commandLine = document.createElement('input');
        commandLine.id = 'command-line';
        document.body.appendChild(commandLine);

        commandLine.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                const input = commandLine.value.trim().split(' ');
                const command = input[0];
                const args = input.slice(1);

                console.log('command:', command, 'args:', args);

                if (commands[command]) {
                    commands[command](args);
                } else {
                    alert(`unknown command: "${command}". type "help" for a list`);
                }

                console.log('goodbye!');
                commandLine.remove();
            }
        });
    }

    commandLine.focus();
}

// Command list
const commands = {
    export: exportLocalStorage, 

    import: importLocalStorage, 

    help: () => {
        alert('available commands: ' + Object.keys(commands).join(', '));
    },

    clear: begone,

    calc: (args) => {
        const expression = args.join(' ');
        if (expression === '9+10') {
            alert('21... you stupid');
        } else {
            try {
                const result = eval(expression);
                alert(result);
            } catch (error) {
                alert('invalid math expression');
            }
        }
    },
};
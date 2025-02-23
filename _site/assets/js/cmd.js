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
        if (tab.id === simplemde.options.autosave.uniqueId.replace("tab", "")) {
            tab.content = simplemde.value();
            tab.history = simplemde.codemirror.getHistory();
            tab.previewState = simplemde.isPreviewActive();
        }
        localStorage.setItem(`smde_tab${tab.id}`, JSON.stringify(tab));
    });

    // Convert localStorage data to a JSON string
    const data = JSON.stringify(localStorage);

    // Compress the data using gzip
    const compressedData = pako.gzip(data);

    // Convert the compressed data to Base64
    const base64Data = btoa(String.fromCharCode(...compressedData));

    // Create a filename with the current date and time
    const date = new Date();
    const filename = `backup_${date.toLocaleDateString('en-GB').replace(/\//g, '-')}_${date.toLocaleTimeString('en-GB').replace(/:/g, '-')}.oto`;

    // Create a Blob and trigger the download
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
                    // Decode Base64 to binary string
                    const base64Data = e.target.result;
                    const binaryString = atob(base64Data);

                    // Convert binary string to Uint8Array
                    const compressedData = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        compressedData[i] = binaryString.charCodeAt(i);
                    }

                    // Decompress the data using pako
                    const decompressedData = pako.ungzip(compressedData, { to: 'string' });

                    // Parse the decompressed data as JSON
                    const data = JSON.parse(decompressedData);
                    console.log('parsed data:', data);

                    // Clear existing localStorage and restore the imported data
                    localStorage.clear();
                    for (const key in data) {
                        localStorage.setItem(key, data[key]);
                    }

                    // Restore tabs and update the editor
                    tabs = JSON.parse(localStorage.getItem("tabs")) || [
                        { 
                            id: String(Date.now()),
                            name: "tab 1", 
                            content: localStorage.getItem("tab1") || "", 
                            history: null, 
                            previewState: false
                        },
                    ];

                    simplemde.value(tabs[0].content);
                    renderTabs();
                    switchTab(tabs[0].id);
                    simplemde.autosave();

                    console.log('imported localstorage');
                } catch (error) {
                    console.error('failed to import localstorage:', error);
                    alert('failed to import localstorage. the file might be corrupted or invalid.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click();
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

// command list

const commands = {
    // export backup
    export: exportLocalStorage,

    // import backup
    import: importLocalStorage,

    // list commands
    help: () => {
        alert('available commands: ' + Object.keys(commands).join(', '));
    },
    // begone
    begone: () => {
        const shouldProceed = confirm("this will remove everything, and there is no going back. are you sure?");
        if (shouldProceed) {
            localStorage.clear();
            tabs = [{ id: "1", name: "tab 1", content: "", history: null }];
            simplemde.value("");
            renderTabs();
            switchTab("1");
        }
    },
    // calculator real
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
    noclip: () => {
        alert('noclip: true');
    }
};

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.altKey && event.code === 'KeyQ') {
        event.stopPropagation();
        if (document.activeElement.id === 'command-line') {
            console.log('goodbye');
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
            console.log('goodbye');
            commandLine.remove();
        }
    }
});

// creatures

// [ creatures here ] //

// exporting .oto storage

function exportLocalStorage() {
    console.log('exporting LocalStorage');
    const data = JSON.stringify(localStorage);
    const date = new Date();
    const filename = `backup_${date.toLocaleDateString('en-GB').replace(/\//g, '-')}_${date.toLocaleTimeString('en-GB').replace(/:/g, '-')}.oto`;
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    console.log(`exported to ${filename}`);
}

// importing .oto storage

function importLocalStorage() {
    console.log('importing LocalStorage');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.oto';

    fileInput.addEventListener('change', function (event) {
        console.log('change event:', event);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log('Reading file');
                try {
                    // Clear existing localStorage
                    localStorage.clear();

                    // Parse the imported data
                    const data = JSON.parse(e.target.result);
                    console.log('Parsed data:', data);

                    // Store the imported data in localStorage
                    for (const key in data) {
                        localStorage.setItem(key, data[key]);
                    }

                    // Update the tabs array with the imported data
                    tabs = JSON.parse(localStorage.getItem("tabs")) || [
                        { id: "1", name: "Tab 1", content: localStorage.getItem("tab1") || "", history: null },
                    ];

                    // Update the editor's content with the first tab's content
                    simplemde.value(tabs[0].content);

                    // Render the tabs and switch to the first tab
                    renderTabs();
                    switchTab("1");

                    // Trigger autosave
                    simplemde.autosave();

                    console.log('imported LocalStorage');
                } catch (error) {
                    console.error('failed to import LocalStorage:', error);
                    alert('failed to import LocalStorage. the file might be corrupted or invalid.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click();
}

function openCommandLine() {
    console.log('hello!');
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

                console.log('Command:', command, 'Args:', args);

                if (commands[command]) {
                    commands[command](args);
                } else {
                    console.log(`Unknown: ${command}. type "help" for a list`);
                }

                console.log('goodbye');
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
        console.log('Available commands:', Object.keys(commands).join(', '));
    }
};
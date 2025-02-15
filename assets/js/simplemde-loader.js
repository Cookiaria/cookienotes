var simplemde = new SimpleMDE({
    hideIcons: ["columns", "table"],
    autoDownloadFontAwesome: false,
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "tab1",
        delay: 1000,
    },
    renderingConfig: {
        codeSyntaxHighlighting: true
    },
    shortcuts: {
        toggleFullscreen: null,
        toggleSideBySide: null
    },
    toolbar: [{
        name: "Bold",
        action: SimpleMDE.toggleBold,
        className: "nf nf-fa-bold",
        title: "Bold (Ctrl+B)"
    },
    {
        name: "Italic",
        action: SimpleMDE.toggleItalic,
        className: "nf nf-fa-italic",
        title: "Italic (Ctrl+I)"
    },
    {
        name: "Strikethrough",
        action: SimpleMDE.toggleStrikethrough,
        className: "nf nf-fa-strikethrough",
        title: "Strikethrough"
    },
    "|",
    {
        name: "Heading 1",
        action: SimpleMDE.toggleHeading1,
        className: "nf nf-md-format_header_1",
        title: "Heading 1"
    },
    "|",
    {
        name: "Preview",
        action: SimpleMDE.togglePreview,
        className: "nf nf-cod-preview",
        title: "Preview"
    },
    "|",
    {
        name: "creatures",
        action: function (editor) {
            showCreatureList(); 
        },
        className: "nf nf-fa-paw",
        title: "creatures"
    },
    {
        name: "Clock",
        action: function (editor) {
            const cm = editor.codemirror;
            const doc = cm.getDoc();
            const cursor = doc.getCursor();
            doc.replaceRange('<p class="ca-clock"></p>', cursor);
        },
        className: "nf nf-fa-clock",
        title: "Insert clock"
    }
    ]
});

let tabs = JSON.parse(localStorage.getItem("tabs")) || [
    { id: "1", name: "Tab 1", content: localStorage.getItem("tab1") || "", history: null, previewState: false },
];


tabs = tabs.map(tab => ({
    ...tab,
    previewState: tab.previewState !== undefined ? tab.previewState : false,
}));

simplemde.value(tabs[0].content);

localStorage.setItem("tabs", JSON.stringify(tabs));

function renderTabs() {
    const tabContainer = document.getElementById("tab-container");
    tabContainer.innerHTML = "";
    tabs.forEach((tab) => {
        const tabElement = document.createElement("div");
        tabElement.className = "tab";
        tabElement.setAttribute("data-tab", tab.id);
        tabElement.draggable = true; // Make the tab draggable

        // Create a span for the tab name
        const tabName = document.createElement("span");
        tabName.textContent = tab.name;
        tabElement.appendChild(tabName);

        // Add close button for all tabs
        const closeButton = document.createElement("span");
        closeButton.className = "tab-close";
        closeButton.textContent = "x";
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });
        tabElement.appendChild(closeButton);

        // Right-click to make the tab name editable
        tabElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            makeTabNameEditable(tabName, tab.id);
        });

        // Left-click to switch tab
        tabElement.addEventListener("click", () => switchTab(tab.id));

        // Drag-and-drop event listeners
        tabElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tab.id); // Store the tab ID being dragged
            e.currentTarget.classList.add("dragging");
        });

        tabElement.addEventListener("dragend", (e) => {
            e.currentTarget.classList.remove("dragging");
        });

        tabContainer.appendChild(tabElement);
    });

    // Add the "+" button to create new tabs
    const addTab = document.createElement("div");
    addTab.className = "add-tab";
    addTab.textContent = "+";
    addTab.addEventListener("click", addNewTab);
    tabContainer.appendChild(addTab);

    // Highlight the active tab
    const activeTab = document.querySelector(`.tab[data-tab="${simplemde.options.autosave.uniqueId.replace("tab", "")}"]`);
    if (activeTab) activeTab.classList.add("active");

    // Add drag-and-drop listeners to the tab container
    tabContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector(".dragging");
        const closestElement = getClosestElement(tabContainer, e.clientX);
        if (closestElement) {
            tabContainer.insertBefore(draggingElement, closestElement);
        }
    });

    tabContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedTabId = e.dataTransfer.getData("text/plain");
        const draggedTab = tabs.find((tab) => tab.id === draggedTabId);
        const newIndex = Array.from(tabContainer.children).findIndex((child) => child.getAttribute("data-tab") === draggedTabId);

        // Remove the dragged tab from the array
        tabs = tabs.filter((tab) => tab.id !== draggedTabId);

        // Insert the dragged tab at the new position
        tabs.splice(newIndex, 0, draggedTab);

        // Save the updated tabs array to localStorage
        localStorage.setItem("tabs", JSON.stringify(tabs));

        // Re-render the tabs to reflect the new order
        renderTabs();
    });
}

function makeTabNameEditable(tabNameElement, tabId) {
    // Save the current name for reference
    const originalName = tabNameElement.textContent;

    // Create an input element
    const input = document.createElement("input");
    input.className = "ca-tab-renamer";
    input.type = "text";
    input.value = originalName;

    // Create a temporary span to measure the text width
    const tempSpan = document.createElement("span");
    tempSpan.style.position = "absolute";
    tempSpan.style.visibility = "hidden";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.fontFamily = window.getComputedStyle(tabNameElement).fontFamily;
    tempSpan.style.fontSize = window.getComputedStyle(tabNameElement).fontSize;
    tempSpan.textContent = input.value;

    // Append the span to the body to measure its width
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Set the input width based on the measured text width
    input.style.width = `${textWidth + 10}px`; // Add a little padding

    // Replace the tab name with the input element
    tabNameElement.replaceWith(input);
    input.focus();

    // Update the input width as the user types
    input.addEventListener("input", () => {
        tempSpan.textContent = input.value;
        document.body.appendChild(tempSpan);
        const newWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        input.style.width = `${newWidth + 10}px`; // Add a little padding
    });

    // Save the new name when the user clicks away or presses Enter
    const saveName = () => {
        const newName = input.value.trim();
        if (newName) {
            // Update the tab name in the tabs array
            const tab = tabs.find((tab) => tab.id === tabId);
            if (tab) {
                tab.name = newName;
                localStorage.setItem("tabs", JSON.stringify(tabs));
            }
        }

        // Replace the input with the updated tab name
        tabNameElement.textContent = newName || originalName; // Fallback to original name if new name is empty
        input.replaceWith(tabNameElement);
    };

    // Save on Enter key press
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveName();
        }
    });

    // Save on blur (when the input loses focus)
    input.addEventListener("blur", saveName);
}

function switchTab(tabId) {
    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab) {
            currentTab.content = simplemde.value();
            currentTab.history = simplemde.codemirror.getHistory();
            currentTab.previewState = simplemde.isPreviewActive(); // Save preview state
        }
    }

    // Turn off the preview before switching tabs
    if (simplemde.isPreviewActive()) {
        simplemde.togglePreview();
    }

    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelector(`.tab[data-tab="${tabId}"]`)?.classList.add("active");
    const newTab = tabs.find((tab) => tab.id === tabId);
    if (newTab) {
        simplemde.value(newTab.content || "");
        if (newTab.history) {
            simplemde.codemirror.setHistory(newTab.history);
        }
        simplemde.options.autosave.uniqueId = `tab${tabId}`;
        simplemde.codemirror.refresh();

        // Restore preview state
        if (newTab.previewState) {
            simplemde.togglePreview();
        }
    }
}

function addNewTab() {
    const newTabId = String(Date.now());
    tabs.push({ id: newTabId, name: `tab${tabs.length + 1}`, content: "", history: null, previewState: false });
    localStorage.setItem("tabs", JSON.stringify(tabs));
    renderTabs();
    switchTab(newTabId);
}

function closeTab(tabId) {
    const shouldClose = window.confirm("Are you sure you want to close this tab?");
    if (shouldClose) {
        // Remove the tab from the tabs array
        tabs = tabs.filter((tab) => tab.id !== tabId);
        localStorage.setItem("tabs", JSON.stringify(tabs));

        // Remove the autosaved content for the closed tab
        localStorage.removeItem(`smde_tab${tabId}`);

        // If no tabs are left, create a new one
        if (tabs.length === 0) {
            addNewTab();
        } else {
            // Re-render the tabs and switch to the first tab
            renderTabs();
            switchTab(tabs[0].id);
        }
    }
}

function renameTab(tabId) {
    const newName = prompt("Enter a new name for the tab:");
    if (newName) {
        if (newName.toLowerCase() === "begone") {
            const shouldDelete = confirm("This will remove EVERYTHING, and there is no going back. Are you sure?");
            if (shouldDelete) {
                tabs = [{ id: "1", name: "tab1", content: "", history: null }];
                localStorage.clear();
                simplemde.value("");
                renderTabs();
                switchTab("1");
                return;
            }
        }
        if (newName === "nyan") {
            const imgElement = document.getElementById('creature');
            imgElement.style.transform =  'scaleX(-1)';
            imgElement.style.width = '160px';
            imgElement.src = '/assets/creatures/nya.gif';
        }
        const tab = tabs.find((tab) => tab.id === tabId);
        if (tab) tab.name = newName;
        localStorage.setItem("tabs", JSON.stringify(tabs));
        renderTabs();
    }
}

// Helper function to find the closest element during drag-and-drop
function getClosestElement(container, x) {
    const elements = Array.from(container.querySelectorAll(".tab:not(.dragging)"));
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


window.addEventListener("beforeunload", () => {
    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab) {
            currentTab.content = simplemde.value();
            currentTab.history = simplemde.codemirror.getHistory();
            currentTab.previewState = simplemde.isPreviewActive(); // Save preview state
        }
    }
    localStorage.setItem("tabs", JSON.stringify(tabs));
});



renderTabs();
if (tabs.length > 0) {
    switchTab(tabs[0].id);
}
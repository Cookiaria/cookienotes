function initializeSimpleMDE(elementId, tabId) {
    const simplemde = new SimpleMDE({
        element: document.getElementById(elementId),
        hideIcons: ["columns", "table"],
        autoDownloadFontAwesome: false,
        spellChecker: false,
        autosave: {
            enabled: true,
            uniqueId: `tab${tabId}`,
            delay: 1000,
        },
        renderingConfig: {
            codeSyntaxHighlighting: true,
        },
        shortcuts: {
            toggleFullscreen: null,
            toggleSideBySide: null,
        },
        initialValue: tabId === 0 ? "" : "# Welcome to cookinotes!",
        toolbar: [
            {
                name: "Bold",
                action: SimpleMDE.toggleBold,
                className: "nf nf-fa-bold",
                title: "Bold (Ctrl+B)",
            },
            {
                name: "Italic",
                action: SimpleMDE.toggleItalic,
                className: "nf nf-fa-italic",
                title: "Italic (Ctrl+I)",
            },
            {
                name: "Strikethrough",
                action: SimpleMDE.toggleStrikethrough,
                className: "nf nf-fa-strikethrough",
                title: "Strikethrough",
            },
            "|",
            {
                name: "Heading 1",
                action: SimpleMDE.toggleHeading1,
                className: "nf nf-md-format_header_1",
                title: "Heading 1",
            },
            "|",
            {
                name: "creatures",
                action: function (editor) {
                    showCreatureList();
                },
                className: "nf nf-fa-paw",
                title: "creatures",
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
                title: "Insert clock",
            },
            {
                name: "Winamp",
                action: function () {
                    showWinamp();
                },
                className: "nf nf-fa-music", 
                title: "Winamp (why?)",
            },
            "|",
            {
                name: "Preview",
                action: SimpleMDE.togglePreview,
                className: "nf nf-md-eye",
                title: "Preview",
            },
        ],
    });
    return simplemde;
}

function showWinamp() {
    // Initialize Webamp
    const webamp = new Webamp({
        initialTracks: [
            {
                title: 'Toilet 1',
                url: '/assets/winamp/toilet.mp3',
            },
            {
                title: 'Toilet 2',
                url: '/assets/winamp/toilet2.mp3',
            },
            {
                title: 'Toilet 3',
                url: '/assets/winamp/toilet3.mp3',
            },
            {
                title: 'Toilet 4',
                url: '/assets/winamp/toilet4.mp3',
            },
            {
                title: 'Toilet 5',
                url: '/assets/winamp/toilet5.mp3',                
            },
            {
                title: 'Toilet 6',
                url: '/assets/winamp/toilet6.mp3',
            },
            {
                title: 'meek.mp3',
                url: '/assets/winamp/meek.mp3',
            },
            {
                title: 'kuk.mp3',
                url: '/assets/winamp/kuk.mp3',
            },
            {
                title: 'hybridsong.mp3',
                url: '/assets/winamp/hybridsong.mp3',
            },
            {
                title: 'dubmood_-_last_step.mp3',
                url: '/assets/winamp/dubmood_-_last_step.mp3',
            },
            {
                title: 'badapple.mp3',
                url: '/assets/winamp/badapple.mp3',
            },
            {
                title: 'wiibrew.mp3',
                url: '/assets/winamp/wiibrew.mp3',
            }
        ]
    });

    // Append Webamp to the DOM
    webamp.renderWhenReady(document.getElementById('webamp'))
}

// Load tabs from localStorage
let tabs = JSON.parse(localStorage.getItem("tabs")) || [
    {
        id: String(Date.now()),
        name: "tab1",
        type: "simplemde",
        content: localStorage.getItem("tab1") || "",
        history: null,
        previewState: false,
    },
];

// Ensure all tabs have required properties
tabs = tabs.map((tab) => ({
    ...tab,
    type: tab.type || "simplemde",
    previewState: tab.previewState !== undefined ? tab.previewState : false,
}));

let tabInstances = new Map(); // Store instances (e.g., SimpleMDE) for each tab

// Render tabs and initialize content
function renderTabs() {
    const tabContainer = document.getElementById("tab-container");
    const contentContainer = document.getElementById("ca-tab-content");
    tabContainer.innerHTML = "";

    tabs.forEach((tab) => {
        if (!document.getElementById(`tab-content-${tab.id}`)) {
            const contentDiv = document.createElement("div");
            contentDiv.id = `tab-content-${tab.id}`;
            contentDiv.style.display = "none";
            contentDiv.style.width = "100%";
            contentContainer.appendChild(contentDiv);

            if (tab.type === "simplemde") {
                const textarea = document.createElement("textarea");
                textarea.id = `notepad-${tab.id}`;
                contentDiv.appendChild(textarea);
                const simplemde = initializeSimpleMDE(`notepad-${tab.id}`, tab.id); // Pass tab.id
                simplemde.value(tab.content || localStorage.getItem(`smde_tab${tab.id}`) || ""); // Load autosaved content
                if (tab.history) simplemde.codemirror.setHistory(tab.history);
                tabInstances.set(tab.id, simplemde);
            } else if (tab.type === "iframe") {
                const iframe = document.createElement("iframe");
                iframe.src = tab.content;
                contentDiv.appendChild(iframe);
            }
        }

        // Render tab UI
        const tabElement = document.createElement("div");
        tabElement.className = "tab";
        tabElement.setAttribute("data-tab", tab.id);
        tabElement.draggable = true;

        const tabName = document.createElement("span");
        tabName.textContent = tab.name;
        tabElement.appendChild(tabName);

        const closeButton = document.createElement("span");
        closeButton.className = "tab-close";
        closeButton.textContent = "x";
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });
        tabElement.appendChild(closeButton);

        tabElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            makeTabNameEditable(tabName, tab.id);
        });

        tabElement.addEventListener("click", () => switchTab(tab.id));

        tabElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tab.id);
            e.currentTarget.classList.add("dragging");
        });
        tabElement.addEventListener("dragend", (e) => {
            e.currentTarget.classList.remove("dragging");
        });

        tabContainer.appendChild(tabElement);
    });

    const addTab = document.createElement("div");
    addTab.className = "add-tab";
    addTab.textContent = "+";
    addTab.addEventListener("click", () => addNewTab("simplemde"));
    addTab.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showTabTypeMenu(e.clientX, e.clientY);
    });
    tabContainer.appendChild(addTab);

    const activeTabId = document.querySelector(".tab.active")?.getAttribute("data-tab") || tabs[0].id;

    // Ensure the first tab is visible on initial load
    if (tabs.length > 0) {
        switchTab(activeTabId); // Keep previously selected tab active
    }


    tabContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector(".dragging");
        const closestElement = getClosestElement(tabContainer, e.clientX);
        if (closestElement) tabContainer.insertBefore(draggingElement, closestElement);
    });

    tabContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedTabId = e.dataTransfer.getData("text/plain");
        const draggedTab = tabs.find((tab) => tab.id === draggedTabId);
        const newIndex = Array.from(tabContainer.children).findIndex(
            (child) => child.getAttribute("data-tab") === draggedTabId
        );
    
        const activeTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    
        tabs = tabs.filter((tab) => tab.id !== draggedTabId);
        tabs.splice(newIndex, 0, draggedTab);
        localStorage.setItem("tabs", JSON.stringify(tabs));
    
        renderTabs();
        switchTab(activeTabId); // Restore active tab
    });
    

    // Ensure the first tab is visible on initial load
    if (tabs.length > 0 && !document.querySelector(".tab.active")) {
        switchTab(tabs[0].id);
    }
}

// Function to make tab names editable
function makeTabNameEditable(tabNameElement, tabId) {
    const originalName = tabNameElement.textContent;
    const input = document.createElement("input");
    input.className = "ca-tab-renamer";
    input.type = "text";
    input.value = originalName;

    const tempSpan = document.createElement("span");
    tempSpan.style.position = "absolute";
    tempSpan.style.visibility = "hidden";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.fontFamily = window.getComputedStyle(tabNameElement).fontFamily;
    tempSpan.style.fontSize = window.getComputedStyle(tabNameElement).fontSize;
    tempSpan.textContent = input.value;

    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    input.style.width = `${textWidth + 10}px`;
    tabNameElement.replaceWith(input);
    input.focus();

    input.addEventListener("input", () => {
        tempSpan.textContent = input.value;
        document.body.appendChild(tempSpan);
        const newWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        input.style.width = `${newWidth + 10}px`;
    });

    const saveName = () => {
        const newName = input.value.trim();
        if (newName) {
            const tab = tabs.find((tab) => tab.id === tabId);
            if (tab) {
                tab.name = newName;
                localStorage.setItem("tabs", JSON.stringify(tabs));
            }
        }
        tabNameElement.textContent = newName || originalName;
        input.replaceWith(tabNameElement);
    };

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveName();
    });
    input.addEventListener("blur", saveName);
}

// Show tab type selection menu
function showTabTypeMenu(x, y) {
    const existingMenu = document.querySelector(".ca-tab-type-menu");
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement("div");
    menu.className = "ca-tab-type-menu";
    menu.style.position = "absolute";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const options = [
        { name: "cookienotes", type: "simplemde" },
        { name: "schedule", type: "iframe", content: "/extratabs/scheduler/index.html" },
        { name: "midi-player", type: "iframe", content: "/extratabs/midi-player/index.html" },
    ];

    options.forEach((option) => {
        const item = document.createElement("div");
        item.className = "ca-tab-type-item";
        item.textContent = option.name;
        item.addEventListener("click", () => {
            addNewTab(option.type, option.content);
            menu.remove();
        });
        menu.appendChild(item);
    });

    document.body.appendChild(menu);

    document.addEventListener("click", function handler(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener("click", handler);
        }
    });
}

// Global flag to detect initial page load
let initialLoad = true;

function switchTab(tabId) {
    // Hide ALL tab content before showing the new one
    document.querySelectorAll("#ca-tab-content > div").forEach((content) => {
        content.style.display = "none";
    });
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));

    const tabElement = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (tabElement) tabElement.classList.add("active");

    const newTab = tabs.find((tab) => tab.id === tabId);
    if (newTab) {
        const contentDiv = document.getElementById(`tab-content-${tabId}`);
        if (contentDiv) {
            contentDiv.style.display = "block"; // Show new tab

            if (newTab.type === "simplemde") {
                const simplemde = tabInstances.get(tabId);
                if (simplemde) {
                    simplemde.codemirror.refresh();
                    // Only on page reload (initial load) restore preview state
                    if (newTab.previewState && !simplemde.isPreviewActive()) {
                        simplemde.togglePreview();
                    }
                }
            }
        }
    }
    // Mark that the initial load has completed
    initialLoad = false;
}



// Add a new tab
function addNewTab(type, content = "") {
    const newTabId = String(Date.now());
    tabs.push({
        id: newTabId,
        name: `tab${tabs.length + 1}`,
        type,
        content,
        history: null,
        previewState: false,
    });
    localStorage.setItem("tabs", JSON.stringify(tabs));
    renderTabs();
    switchTab(newTabId);
}

// Close tab
function closeTab(tabId) {
    const shouldClose = window.confirm("are you sure you want to close this tab?");
    if (shouldClose) {
        const tab = tabs.find((t) => t.id === tabId);
        if (tab && tab.type === "simplemde") {
            tabInstances.delete(tabId);
        }
        document.getElementById(`tab-content-${tabId}`).remove();
        tabs = tabs.filter((t) => t.id !== tabId);
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.removeItem(`smde_tab${tabId}`);
        if (tabs.length === 0) {
            addNewTab("simplemde");
        } else {
            renderTabs();
            switchTab(tabs[0].id);
        }
    }
}

// Helper function for drag-and-drop
function getClosestElement(container, x) {
    const elements = Array.from(container.querySelectorAll(".tab:not(.dragging)"));
    return elements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Save state before unload
window.addEventListener("beforeunload", () => {
    tabs.forEach((tab) => {
        if (tab.type === "simplemde") {
            const simplemde = tabInstances.get(tab.id);
            if (simplemde) {
                tab.content = simplemde.value();
                tab.history = simplemde.codemirror.getHistory();
                tab.previewState = simplemde.isPreviewActive();
                localStorage.setItem(`smde_tab${tab.id}`, simplemde.value());
            }
        }
    });
    localStorage.setItem("tabs", JSON.stringify(tabs));
});


renderTabs();
if (tabs.length > 0) {
    switchTab(tabs[0].id); // Explicitly switch to the first tab on load
}
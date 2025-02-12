var simplemde = new SimpleMDE({
    hideIcons: ["columns", "table"],
    autoDownloadFontAwesome: true,
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "tab1", // Default unique ID for the first tab
        delay: 1000, // Autosave every 1 second
    },
});

// Store tabs and their content along with editor state
let tabs = JSON.parse(localStorage.getItem("tabs")) || [
    { id: "1", name: "Tab 1", content: localStorage.getItem("tab1") || "", history: null },
];

// Initialize the first tab's content
simplemde.value(tabs[0].content);

// Render tabs
function renderTabs() {
    const tabContainer = document.getElementById("tab-container");
    tabContainer.innerHTML = "";

    tabs.forEach((tab, index) => {
        const tabElement = document.createElement("div");
        tabElement.className = "tab";
        tabElement.setAttribute("data-tab", tab.id);

        const tabName = document.createElement("span");
        tabName.textContent = tab.name;
        tabElement.appendChild(tabName);

        // Add close button (except for the first tab)
        if (index !== 0) {
            const closeButton = document.createElement("span");
            closeButton.className = "tab-close";
            closeButton.textContent = "x";
            closeButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent tab switch
                closeTab(tab.id);
            });
            tabElement.appendChild(closeButton);
        }

        // Add right-click to rename
        tabElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            renameTab(tab.id);
        });

        tabElement.addEventListener("click", () => switchTab(tab.id));
        tabContainer.appendChild(tabElement);
    });

    // Add "+" tab
    const addTab = document.createElement("div");
    addTab.className = "add-tab";
    addTab.textContent = "+";
    addTab.addEventListener("click", addNewTab);
    tabContainer.appendChild(addTab);

    // Set active tab
    const activeTab = document.querySelector(`.tab[data-tab="${simplemde.options.autosave.uniqueId.replace("tab", "")}"]`);
    if (activeTab) activeTab.classList.add("active");
}

// Switch tabs
function switchTab(tabId) {
    // Save current content and history
    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab) {
            currentTab.content = simplemde.value();
            currentTab.history = simplemde.codemirror.getHistory();
        }
    }

    // Update active tab
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelector(`.tab[data-tab="${tabId}"]`)?.classList.add("active");

    // Load new content and history
    const newTab = tabs.find((tab) => tab.id === tabId);
    if (newTab) {
        simplemde.value(newTab.content || "");
        if (newTab.history) {
            simplemde.codemirror.setHistory(newTab.history);
        }
        simplemde.options.autosave.uniqueId = `tab${tabId}`;
        simplemde.codemirror.refresh();
    }
}

// Add new tab
function addNewTab() {
    const newTabId = String(Date.now()); // Unique ID
    tabs.push({ id: newTabId, name: `tab${tabs.length + 1}`, content: "", history: null });
    localStorage.setItem("tabs", JSON.stringify(tabs));
    renderTabs();
    switchTab(newTabId);
}

// Close tab
function closeTab(tabId) {
    if (tabId === "1") return; // Prevent closing the first tab

    // Show a confirmation dialog
    const shouldClose = window.confirm("Are you sure you want to close this tab?");
    
    // If the user confirms, proceed with closing the tab
    if (shouldClose) {
        tabs = tabs.filter((tab) => tab.id !== tabId);
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.removeItem(`tab${tabId}`);
        renderTabs();
        switchTab("1"); // Switch to the first tab after closing
    }
}

// Rename tab
function renameTab(tabId) {
    const newName = prompt("Enter a new name for the tab:");
    if (newName) {
        if (newName.toLowerCase() === "begone") {
            const shouldDelete = confirm("this will remove EVERYTHING, and there is no going back. are you sure?");
            if (shouldDelete) {
                // Clear all tabs and local storage
                tabs = [{ id: "1", name: "Tab 1", content: "", history: null }];
                localStorage.clear();
                renderTabs();
                switchTab("1");
                return;
            }
        }

        const tab = tabs.find((tab) => tab.id === tabId);
        if (tab) tab.name = newName;
        localStorage.setItem("tabs", JSON.stringify(tabs));
        renderTabs();
    }
}

// Save all tabs when the page is closed
window.addEventListener("beforeunload", () => {
    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab) {
            currentTab.content = simplemde.value();
            currentTab.history = simplemde.codemirror.getHistory();
        }
    }
    localStorage.setItem("tabs", JSON.stringify(tabs));
});

// Initial render
renderTabs();
// Initialize SimpleMDE
var simplemde = new SimpleMDE({
    hideIcons: ["columns", "table"],
    autoDownloadFontAwesome: true,
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "tab1", // Default unique ID for the first tab
        delay: 1000,
    },
});

// Store content for each tab
const tabContent = {
    1: localStorage.getItem("tab1") || "",
    2: localStorage.getItem("tab2") || "",
    3: localStorage.getItem("tab3") || "",
    4: localStorage.getItem("tab4") || "",
};

// Initialize the first tab's content
simplemde.value(tabContent[1]);

// Tab Management
const tabs = document.querySelectorAll('.tab');

// Function to switch tabs
function switchTab(event) {
    const tab = event.target;
    const tabId = tab.getAttribute('data-tab');

    // Save current content to localStorage before switching
    const currentTabId = document.querySelector('.tab.active').getAttribute('data-tab');
    localStorage.setItem(`tab${currentTabId}`, simplemde.value());

    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Load new content
    const newContent = localStorage.getItem(`tab${tabId}`) || "";
    simplemde.value(newContent);

    // Update autosave uniqueId for the new tab
    simplemde.options.autosave.uniqueId = `tab${tabId}`;

    // Force SimpleMDE to refresh its internal state
    simplemde.codemirror.refresh();
}

// Attach event listeners to tabs
tabs.forEach(tab => tab.addEventListener('click', switchTab));

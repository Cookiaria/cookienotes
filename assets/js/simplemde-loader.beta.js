var simplemde = new SimpleMDE({
    hideIcons: ["columns", "table"],
    autoDownloadFontAwesome: true,
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "tab1",
        delay: 1000,
    },
});

let tabs = JSON.parse(localStorage.getItem("tabs")) || [
    { id: "1", name: "Tab 1", content: localStorage.getItem("tab1") || "", history: null },
];

simplemde.value(tabs[0].content);

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
        if (index !== 0) {
            const closeButton = document.createElement("span");
            closeButton.className = "tab-close";
            closeButton.textContent = "x";
            closeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                closeTab(tab.id);
            });
            tabElement.appendChild(closeButton);
        }
        tabElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            renameTab(tab.id);
        });
        tabElement.addEventListener("click", () => switchTab(tab.id));
        tabContainer.appendChild(tabElement);
    });
    const addTab = document.createElement("div");
    addTab.className = "add-tab";
    addTab.textContent = "+";
    addTab.addEventListener("click", addNewTab);
    tabContainer.appendChild(addTab);
    const activeTab = document.querySelector(`.tab[data-tab="${simplemde.options.autosave.uniqueId.replace("tab", "")}"]`);
    if (activeTab) activeTab.classList.add("active");
}

function switchTab(tabId) {
    const currentTabId = document.querySelector(".tab.active")?.getAttribute("data-tab");
    if (currentTabId) {
        const currentTab = tabs.find((tab) => tab.id === currentTabId);
        if (currentTab) {
            currentTab.content = simplemde.value();
            currentTab.history = simplemde.codemirror.getHistory();
        }
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
    }
}

function addNewTab() {
    const newTabId = String(Date.now());
    tabs.push({ id: newTabId, name: `tab${tabs.length + 1}`, content: "", history: null });
    localStorage.setItem("tabs", JSON.stringify(tabs));
    renderTabs();
    switchTab(newTabId);
}

function closeTab(tabId) {
    if (tabId === "1") return;
    const shouldClose = window.confirm("Are you sure you want to close this tab?");
    if (shouldClose) {
        tabs = tabs.filter((tab) => tab.id !== tabId);
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.removeItem(`tab${tabId}`);
        renderTabs();
        switchTab("1");
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

renderTabs();

if (tabs.length > 0) {
    switchTab(tabs[0].id);
}

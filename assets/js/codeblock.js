// Add this after initializing SimpleMDE
const codemirror = simplemde.codemirror;

// Map of languages to their Nerd Font icons
const languageIcons = {
    python: "nf-dev-python",
    bash: "nf-dev-terminal",
    cpp: "nf-dev-cpp",
    css: "nf-dev-css3",
    javascript: "nf-dev-javascript",
    html: "nf-dev-html5",
    java: "nf-dev-java",
    json: "nf-dev-json",
    markdown: "nf-dev-markdown",
    // Add more languages and icons as needed
};

// Function to add a title bar to code blocks
function addTitleToCodeBlocks() {
    // Target code blocks in both the editor and the preview
    const codeBlocks = document.querySelectorAll(`
        .CodeMirror pre code,
        div.CodeMirror.cm-s-paper.CodeMirror-wrap div.editor-preview.editor-preview-active pre code
    `);

    codeBlocks.forEach((codeBlock) => {
        // Check if the title bar already exists
        if (!codeBlock.previousElementSibling || !codeBlock.previousElementSibling.classList.contains("code-title")) {
            // Get the language from the code block's class (e.g., "lang-python")
            const languageClass = Array.from(codeBlock.classList).find((cls) => cls.startsWith("lang-"));
            if (languageClass) {
                const language = languageClass.replace("lang-", "");
                const iconClass = languageIcons[language] || "nf-dev-code"; // Default icon

                // Create the title bar
                const titleBar = document.createElement("div");
                titleBar.className = "code-title";
                titleBar.innerHTML = `<span class="nf ${iconClass}"></span> ${language}`;

                // Insert the title bar before the code block
                codeBlock.parentNode.insertBefore(titleBar, codeBlock);
            }
        }
    });
}

// Listen for changes in the editor to update code blocks
codemirror.on("change", () => {
    addTitleToCodeBlocks();
});

// Listen for preview updates
simplemde.codemirror.on("update", () => {
    addTitleToCodeBlocks();
});

// Initial call to add titles to existing code blocks
addTitleToCodeBlocks();
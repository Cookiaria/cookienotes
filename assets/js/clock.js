function updateClocks() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Update all elements with the class .ca-clock
    const clockElements = document.querySelectorAll('.ca-clock');
    clockElements.forEach((clock) => {
        clock.textContent = timeString;
    });
}

// Update clocks every second
setInterval(updateClocks, 1000);

// Initial call to display the time immediately
updateClocks();

// Use MutationObserver to detect new .ca-clock elements
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if any added nodes have the .ca-clock class
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.ca-clock')) {
                    updateClocks(); // Update clocks immediately
                }
                // Also check for .ca-clock elements inside added nodes
                if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.ca-clock')) {
                    updateClocks(); // Update clocks immediately
                }
            });
        }
    }
});

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true, // Observe added/removed nodes
    subtree: true,   // Observe all descendants
});
// ===================== CLOCK ELEMENT =========================

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    // hours
    const hourElements = document.querySelectorAll('.ca-hours');
    hourElements.forEach((clock) => {
        clock.textContent = `${hours}`;
    });

    // minutes
    const minuteElements = document.querySelectorAll('.ca-minutes');
    minuteElements.forEach((clock) => {
        clock.textContent = `${minutes}`;
    });

    // seconds
    const secondElements = document.querySelectorAll('.ca-seconds');
    secondElements.forEach((clock) => {
        clock.textContent = `${seconds}`;
    });

    // mixed
    const clockElement = document.querySelectorAll('.ca-clock');
    clockElement.forEach((clock) => {
        clock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    })
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the time immediately
updateClock();


const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.ca-clock')) {
                    updateClocks(); 
                }
                if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.ca-clock')) {
                    updateClocks(); 
                }
            });
        }
    }
});


observer.observe(document.body, {
    childList: true, 
    subtree: true,   
});


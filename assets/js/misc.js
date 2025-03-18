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
                    updateClock(); 
                }
                if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.ca-clock')) {
                    updateClock(); 
                }
            });
        }
    }
});


observer.observe(document.body, {
    childList: true, 
    subtree: true,   
});

// =================== COPYABLE QUOTEBLOCKS =====================

document.head.appendChild(document.createElement('style')).textContent = `
  blockquote {
    max-width: 650px;
    user-select: none;
    position: relative; /* Needed for positioning the overlay */
  }
  blockquote:hover {
    background: #232323;
    cursor: pointer;
  }
  blockquote > p {
    margin: 8px 0;
    position: relative; /* Needed for positioning the overlay */
  }
  .copied-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(54, 54, 54, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    pointer-events: none; /* Ensure it doesn't interfere with clicks */
    opacity: 0; /* Initially hidden */
    transition: opacity 0.2s ease-in-out;
  }
  .copied-overlay.visible {
    opacity: 1; /* Show the overlay */
  }
`;

document.head.appendChild(document.createElement('style')).textContent = `
  blockquote {
    max-width: 650px;
    width: 300px;
    user-select: none;
    position: relative; /* Needed for positioning the overlay */
  }
  blockquote:hover {
    background: #232323;
    cursor: pointer;
  }
  blockquote > p {
    margin: 8px 0;
    position: relative; /* Needed for positioning the overlay */
  }
  .copied-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    pointer-events: none; /* Ensure it doesn't interfere with clicks */
    opacity: 0; /* Initially hidden */
    transition: opacity 0.2s ease-in-out;
  }
  .copied-overlay.visible {
    opacity: 1; /* Show the overlay */
  }
`;

document.addEventListener('click', e => {
  const blockquote = e.target.closest('blockquote');
  if (blockquote) {
    const textContent = Array.from(blockquote.children)
      .map(child => child.textContent.trim()) 
      .filter(text => text.length > 0)        
      .join('\n');                           

    let overlay = blockquote.querySelector('.copied-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'copied-overlay';
      blockquote.appendChild(overlay); 
    }

    navigator.clipboard.writeText(textContent)
      .then(() => {
        overlay.textContent = 'copied!'; 
        overlay.classList.add('visible'); 

        setTimeout(() => {
          overlay.classList.remove('visible');
        }, 1000);
      })
  }
});
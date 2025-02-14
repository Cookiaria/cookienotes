async function setRandomCreatureImage() {
    try {
        const response = await fetch('/assets/creatures.txt');
        if (!response.ok) throw new Error('THE PURGE HAS BEGUN');

        const text = await response.text();
        let urls = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('!') && !line.startsWith('//'));

        if (urls.length === 0) throw new Error('No valid image URLs found');

        let randomCreature = urls[Math.floor(Math.random() * urls.length)];
        let mirror = false;
        let scaleDown = false;
        let scaleUp = false;
        let transparent = false;

        if (randomCreature.includes('*')) {
            mirror = true;
            randomCreature = randomCreature.replace('*', '').trim();
        }

        if (randomCreature.includes('<')) {
            scaleDown = true;
            randomCreature = randomCreature.replace('<', '').trim();
        }

        if (randomCreature.includes('^')) {
            scaleUp = true;
            randomCreature = randomCreature.replace('^', '').trim();
        }

        if (randomCreature.includes('!')) {
            transparent = true;
            randomCreature = randomCreature.replace('!', '').trim();
        }

        const imgElement = document.getElementById('creature');

        imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
        imgElement.style.opacity = transparent ? '0' : '0.25';
        imgElement.src = randomCreature;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

let lastMousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
});

async function showCreatureList(event) {
    let x, y;
    if (event) {
        event.preventDefault(); // For right-click context menu prevention
        x = event.clientX;
        y = event.clientY;
    } else {
        x = lastMousePosition.x;
        y = lastMousePosition.y;
    }

    try {
        const response = await fetch('/assets/creatures.txt');
        if (!response.ok) throw new Error('Failed to load creatures');
        const text = await response.text();
        const urls = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//'));

        const listContainer = document.createElement('div');
        listContainer.classList.add('ca-creature-list');
        listContainer.style.position = 'absolute';
        listContainer.style.top = `${y + 10}px`; // Position below cursor
        listContainer.style.left = `${x}px`;

        // Add Randomize option
        const randomizeItem = document.createElement('div');
        randomizeItem.textContent = 'randomize';
        randomizeItem.classList.add('ca-creature-item');
        randomizeItem.addEventListener('click', () => {
            localStorage.removeItem('selectedCreature');
            setRandomCreatureImage();
            listContainer.remove();
        });
        listContainer.appendChild(randomizeItem);

        // Add creature items
        urls.forEach(url => {
            const fileName = url.split('/').pop().split('.')[0];
            const listItem = document.createElement('div');
            listItem.textContent = fileName;
            listItem.classList.add('ca-creature-item');
            listItem.addEventListener('click', () => {
                const imgElement = document.getElementById('creature');
                let processedUrl = url;
                let mirror = processedUrl.includes('*');
                let scaleDown = processedUrl.includes('<');
                let scaleUp = processedUrl.includes('^');
                let transparent = processedUrl.includes('!');

                processedUrl = processedUrl.replace(/[*<^!]/g, '').trim();

                imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
                imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
                imgElement.style.opacity = transparent ? '0' : '0.25';
                imgElement.src = processedUrl;

                // Save to localStorage
                localStorage.setItem('selectedCreature', JSON.stringify({
                    url: processedUrl,
                    mirror,
                    scaleDown,
                    scaleUp,
                    transparent,
                }));

                listContainer.remove();
            });
            listContainer.appendChild(listItem);
        });

        document.body.appendChild(listContainer);

        // Remove list on outside click
        document.addEventListener('click', function onClickOutside(e) {
            if (!listContainer.contains(e.target)) {
                listContainer.remove();
                document.removeEventListener('click', onClickOutside);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Load the saved creature from localStorage on page load
function loadSavedCreature() {
    const savedCreature = localStorage.getItem('selectedCreature');
    if (savedCreature) {
        const { url, mirror, scaleDown, scaleUp, transparent } = JSON.parse(savedCreature);
        const imgElement = document.getElementById('creature');
        imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
        imgElement.style.opacity = transparent ? '0' : '0.25';
        imgElement.src = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // If there's a saved creature, load it; otherwise, randomize.
    if (localStorage.getItem('selectedCreature')) {
        loadSavedCreature();
    } else {
        setRandomCreatureImage();
    }
});

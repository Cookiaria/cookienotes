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

async function showCreatureList(event) {
    event.preventDefault(); // Prevent the default right-click menu

    const response = await fetch('/assets/creatures.txt');
    const text = await response.text();
    const urls = text.split('\n')
        .map(line => line.trim()) // Trim whitespace
        .filter(line => line && !line.startsWith('//')); // Ignore empty lines and comments

    // Create a container for the list
    const listContainer = document.createElement('div');
    listContainer.classList.add('ca-creature-list'); // Add the class for styling
    listContainer.style.position = 'absolute';
    listContainer.style.bottom = `${window.innerHeight - event.clientY + 10}px`; // Position above the cursor
    listContainer.style.left = `${event.clientX}px`;

    // Add each creature to the list
    urls.forEach(url => {
        const fileName = url.split('/').pop().split('.')[0]; // Extract file name without extension
        const listItem = document.createElement('div');
        listItem.textContent = fileName;
        listItem.classList.add('ca-creature-item'); // Add a class for list items
        listItem.addEventListener('click', () => {
            const imgElement = document.getElementById('creature');

            // Process the URL to handle "^", "<", and "*"
            let processedUrl = url;
            let mirror = false;
            let scaleDown = false;
            let scaleUp = false;
            let transparent = false;

            if (processedUrl.includes('*')) {
                mirror = true;
                processedUrl = processedUrl.replace('*', '').trim();
            }

            if (processedUrl.includes('<')) {
                scaleDown = true;
                processedUrl = processedUrl.replace('<', '').trim();
            }

            if (processedUrl.includes('^')) {
                scaleUp = true;
                processedUrl = processedUrl.replace('^', '').trim();
            }
            
            if (processedUrl.includes('!')) {
                processedUrl = processedUrl.replace('!', '').trim();
            }

            // Apply styles and set the image source
            imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
            imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
            imgElement.style.opacity = transparent ? '0' : '0.25';
            imgElement.src = processedUrl;

            listContainer.remove(); // Remove the list after selection
        });
        listContainer.appendChild(listItem);
    });

    // Add the list to the body
    document.body.appendChild(listContainer);

    // Remove the list if clicked outside
    document.addEventListener('click', function onClickOutside(event) {
        if (!listContainer.contains(event.target)) {
            listContainer.remove();
            document.removeEventListener('click', onClickOutside);
        }
    });
}

document.addEventListener('DOMContentLoaded', setRandomCreatureImage);
document.getElementById("randomizer").addEventListener("click", setRandomCreatureImage);
document.getElementById("randomizer").addEventListener("contextmenu", showCreatureList);

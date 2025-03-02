let lastMousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
});

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
        let positionFixed = false;

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
        
        if (randomCreature.includes('~')) {
            positionFixed = true;
            randomCreature = randomCreature.replace('~', '').trim();
        }

        const imgElement = document.getElementById('creature');
        imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
        imgElement.style.opacity = transparent ? '0' : '0.25';
        imgElement.style.bottom = positionFixed ? '16px' : '';
        imgElement.style.right = positionFixed ? '16px' : '';
        imgElement.src = randomCreature;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function loadSavedCreature() {
    const savedCreature = localStorage.getItem('selectedCreature');
    if (savedCreature) {
        const { url, mirror, scaleDown, scaleUp, transparent, positionFixed } = JSON.parse(savedCreature);
        const imgElement = document.getElementById('creature');
        imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
        imgElement.style.opacity = transparent ? '0' : '0.25';
        imgElement.style.bottom = positionFixed ? '16px' : '';
        imgElement.style.right = positionFixed ? '16px' : '';
        imgElement.src = url;
    }
}

async function showCreatureList(event) {
    let x, y;
    if (event) {
        event.preventDefault();
        x = event.clientX;
        y = event.clientY;
    } else {
        x = lastMousePosition.x;
        y = lastMousePosition.y;
    }

    const listContainer = document.createElement('div');
    listContainer.classList.add('ca-creature-list');
    listContainer.style.position = 'absolute';
    listContainer.style.top = `${y + 10}px`;
    listContainer.style.left = `${x}px`;
    
    const loadingItem = document.createElement('div');
    loadingItem.textContent = 'loading...';
    loadingItem.classList.add('ca-creature-item', 'ca-loading');
    loadingItem.style.pointerEvents = 'none';
    listContainer.appendChild(loadingItem);
    document.body.appendChild(listContainer);

    try {
        const response = await fetch('/assets/creatures.txt');
        if (!response.ok) throw new Error('failed to load creatures');
        const text = await response.text();
        const urls = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//'));

        listContainer.innerHTML = '';
        
        const randomizeItem = document.createElement('div');
        randomizeItem.textContent = 'randomize';
        randomizeItem.classList.add('ca-creature-item');
        randomizeItem.addEventListener('click', () => {
            localStorage.removeItem('selectedCreature');
            setRandomCreatureImage();
            listContainer.remove();
        });
        listContainer.appendChild(randomizeItem);

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
                let positionFixed = processedUrl.includes('~');

                processedUrl = processedUrl.replace(/[*<^!~]/g, '').trim();

                imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
                imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
                imgElement.style.opacity = transparent ? '0' : '0.25';
                imgElement.style.bottom = positionFixed ? '16px' : '';
                imgElement.style.right = positionFixed ? '16px' : '';
                imgElement.src = processedUrl;

                localStorage.setItem('selectedCreature', JSON.stringify({
                    url: processedUrl,
                    mirror,
                    scaleDown,
                    scaleUp,
                    transparent,
                    positionFixed
                }));

                listContainer.remove();
            });
            listContainer.appendChild(listItem);
        });

        document.body.appendChild(listContainer);

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

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('selectedCreature')) {
        loadSavedCreature();
    } else {
        setRandomCreatureImage();
    }
});

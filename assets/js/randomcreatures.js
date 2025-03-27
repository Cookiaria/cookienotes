let lastMousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
});

let creatureListCache = null;

(async function preloadCreatures() {
    try {
        const response = await fetch('/assets/creatures.json');
        creatureListCache = await response.json();
        console.log('creatures preloaded');
    } catch (error) {
        console.error('creature error:', error.message);
    }
})();

async function fetchCreatureData() {
    if (creatureListCache) {
        return creatureListCache;
    }

    try {
        const response = await fetch('/assets/creatures.json');
        if (!response.ok) throw new Error('Failed to load creature data');
        creatureListCache = await response.json();
        console.log('creatures are loaded:', creatureListCache);
        return creatureListCache;
    } catch (error) {
        console.error('creature error:', error.message);
        return null;
    }
}

function parseCreatureData(data) {
    const creatures = [];

    data.forEach(category => {
        if (category.creatures) {
            creatures.push(...category.creatures.map(creature => ({
                name: creature.name,
                image: creature.image,
                modifiers: creature.modifiers || [] 
            })));
        }
    });
    return creatures;
}

function applyModifiers(imgElement, modifiers) {
    imgElement.className = 'serotonin'; 

    modifiers.forEach(modifier => {
        imgElement.classList.add('sero-' + modifier);
    });
}

async function setRandomCreatureImage() {
    try {
        const data = await fetchCreatureData();
        if (!data) return;
        const creatures = parseCreatureData(data);
        const validCreatures = creatures.filter(creature => !creature.modifiers.includes('blank') && !creature.modifiers.includes('no-random'));

        if (validCreatures.length === 0) {
            console.error('No valid creatures available for randomization.');
            return;
        }

        const randomCreature = validCreatures[Math.floor(Math.random() * validCreatures.length)];
        const imgElement = document.getElementById('creature');
        imgElement.src = randomCreature.image;

        applyModifiers(imgElement, randomCreature.modifiers);

        // Save the "random" state in localStorage
        localStorage.setItem('isRandom', 'true');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function loadSavedCreature() {
    const savedCreature = localStorage.getItem('selectedCreature');
    if (savedCreature) {
        const creature = JSON.parse(savedCreature);
        const imgElement = document.getElementById('creature');
        imgElement.src = creature.image;

        applyModifiers(imgElement, creature.modifiers);
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


    let listContainer = document.querySelector('.ca-creature-list');
    if (listContainer) {
        listContainer.remove();
    }

    listContainer = document.createElement('div');
    listContainer.classList.add('ca-creature-list');
    listContainer.style.position = 'absolute';
    listContainer.style.top = `${y + 10}px`;
    listContainer.style.left = `${x}px`;


    try {
        const data = await fetchCreatureData();
        if (!data) {
            console.error('no data returned');
            return;
        }

        const creatures = parseCreatureData(data);

        console.log(`total creatures parsed: ${creatures.length}`);

        listContainer.innerHTML = '';

        const randomizeItem = document.createElement('div');
        randomizeItem.textContent = 'randomize';
        randomizeItem.classList.add('ca-creature-item');
        randomizeItem.addEventListener('click', () => {
            localStorage.setItem('isRandom', 'true');
            localStorage.removeItem('selectedCreature'); 
            setRandomCreatureImage();
            listContainer.remove();
        });
        listContainer.appendChild(randomizeItem);

        creatures.forEach(creature => {
            const listItem = document.createElement('div');
            listItem.textContent = creature.name;
            listItem.classList.add('ca-creature-item');
            listItem.addEventListener('click', () => {
                const imgElement = document.getElementById('creature');
                imgElement.src = creature.image;
                applyModifiers(imgElement, creature.modifiers);
                localStorage.setItem('selectedCreature', JSON.stringify(creature));
                localStorage.removeItem('isRandom');
                listContainer.remove();
            });
            listContainer.appendChild(listItem);
        });

        document.body.appendChild(listContainer);
        
        setTimeout (() => {
            document.addEventListener('click', function onClickOutside(e) {
                if (!listContainer.contains(e.target)) {
                    listContainer.remove();
                    document.removeEventListener('click', onClickOutside);
                }
        });
        }, 0);
    } catch (error) {
        console.error('Error showing creature list:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isRandom = localStorage.getItem('isRandom') === 'true';

    if (isRandom) {
        // If "random" is selected, randomize the creature on every page load
        await setRandomCreatureImage();
    } else {
        // Otherwise, load the saved creature or randomize if none is saved
        const savedCreature = localStorage.getItem('selectedCreature');
        if (savedCreature) {
            loadSavedCreature();
        } else {
            await setRandomCreatureImage();
        }
    }
});


const creatureOpacity = localStorage.getItem('creature-opacity');
const creature = document.getElementById('creature');
creature.style.opacity = creatureOpacity !== null ? creatureOpacity : 0.25;
if (creatureOpacity === null) {
    localStorage.setItem('creature-opacity', 0.25);
}


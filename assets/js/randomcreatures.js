let lastMousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
});

async function fetchCreatureData() {
    try {
        const response = await fetch('/assets/creatures.json');
        if (!response.ok) throw new Error('Failed to load creature data');
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
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
                modifiers: creature.modifiers || [] // Default to empty array if no modifiers
            })));
        }
    });
    return creatures;
}

function applyModifiers(imgElement, modifiers) {
    // Reset all modifier classes while keeping the base class
    imgElement.className = 'serotonin'; // Base class for all creatures

    // Add modifier classes dynamically
    modifiers.forEach(modifier => {
        imgElement.classList.add('sero-' + modifier);
    });
}

async function setRandomCreatureImage() {
    try {
        const data = await fetchCreatureData();
        if (!data) return;

        const creatures = parseCreatureData(data);

        // Filter out creatures with the "blank" modifier
        const validCreatures = creatures.filter(creature => !creature.modifiers.includes('blank'));

        if (validCreatures.length === 0) {
            console.error('No valid creatures available for randomization.');
            return;
        }

        // Randomly select a creature from the filtered list
        const randomCreature = validCreatures[Math.floor(Math.random() * validCreatures.length)];

        const imgElement = document.getElementById('creature');
        imgElement.src = randomCreature.image;

        // Apply modifiers
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

        // Apply modifiers
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

    const listContainer = document.createElement('div');
    listContainer.classList.add('ca-creature-list');
    listContainer.style.position = 'absolute';
    listContainer.style.top = `${y + 10}px`;
    listContainer.style.left = `${x}px`;

    const loadingItem = document.createElement('div');
    loadingItem.textContent = 'Loading...';
    loadingItem.classList.add('ca-creature-item', 'ca-loading');
    loadingItem.style.pointerEvents = 'none';
    listContainer.appendChild(loadingItem);
    document.body.appendChild(listContainer);

    try {
        const data = await fetchCreatureData();
        if (!data) return;

        const creatures = parseCreatureData(data);

        listContainer.innerHTML = '';

        const randomizeItem = document.createElement('div');
        randomizeItem.textContent = 'randomize';
        randomizeItem.classList.add('ca-creature-item');
        randomizeItem.addEventListener('click', () => {
            // Set the "random" flag in localStorage
            localStorage.setItem('isRandom', 'true');
            localStorage.removeItem('selectedCreature'); // Clear any saved creature
            setRandomCreatureImage();
            listContainer.remove();
        });
        listContainer.appendChild(randomizeItem);

        // Add creatures to the list
        creatures.forEach(creature => {
            const listItem = document.createElement('div');
            listItem.textContent = creature.name;
            listItem.classList.add('ca-creature-item');
            listItem.addEventListener('click', () => {
                const imgElement = document.getElementById('creature');
                imgElement.src = creature.image;

                // Apply modifiers
                applyModifiers(imgElement, creature.modifiers);

                // Save the selected creature in localStorage and clear the "random" flag
                localStorage.setItem('selectedCreature', JSON.stringify(creature));
                localStorage.removeItem('isRandom');
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


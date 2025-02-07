async function setRandomCreatureImage() {
    try {
        const response = await fetch('/assets/creatures.txt');
        if (!response.ok) throw new Error('THE PURGE HAS BEGUN');

        const text = await response.text();
        const urls = text.split('\n').map(line => line.trim()).filter(line => line);

        if (urls.length === 0) throw new Error('No valid image URLs found');

        let randomCreature = urls[Math.floor(Math.random() * urls.length)];
        let mirror = false;
        let scaleDown = false;
        let scaleUp = false;

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

        const imgElement = document.getElementById('creature');
        
        imgElement.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        imgElement.style.width = scaleDown ? '160px' : scaleUp ? '300px' : '';
        imgElement.src = randomCreature;


    } catch (error) {
        console.error('Error:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', setRandomCreatureImage);
document.getElementById("randomizer").addEventListener("click", setRandomCreatureImage);
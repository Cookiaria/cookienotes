const keyPresses = [
    './assets/sfx/key-press-1.mp3',
    './assets/sfx/key-press-2.mp3',
    './assets/sfx/key-press-3.mp3',
    './assets/sfx/key-press-4.mp3'
];
const selectAll = './assets/sfx/select-all.wav';
const keyDelete = './assets/sfx/key-delete.mp3';
const keyCaps = './assets/sfx/key-caps.mp3';
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};
let sfxEnabled = false; 

async function loadSounds() {
    const soundFiles = [
        ...keyPresses,
        selectAll,
        keyDelete,
        keyCaps
    ];
    for (const file of soundFiles) {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundBuffers[file] = audioBuffer;
    }
}

function playSound(buffer) {
    if (!sfxEnabled || !buffer) return; 
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

document.addEventListener('keydown', (event) => {
    if (!sfxEnabled) return; 
    
    const isCapsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    if (event.ctrlKey && event.key === 'a') {
        playSound(soundBuffers[selectAll]);
        return;
    }
    if (event.key === 'Backspace') {
        playSound(soundBuffers[keyDelete]);
        return;
    }
    if (isCapsLockOn) {
        playSound(soundBuffers[keyCaps]);
    } else {
        const randomSound = keyPresses[Math.floor(Math.random() * keyPresses.length)];
        playSound(soundBuffers[randomSound]);
    }
});

function toggleSFX() {
    sfxEnabled = !sfxEnabled;
    console.log(`SFX ${sfxEnabled ? 'enabled' : 'disabled'}`);
}

loadSounds()

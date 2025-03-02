function updateClocks() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursString = hours.toString().padStart(2, '0');
    const timeString = `${hoursString}:${minutes}:${seconds} ${ampm}`;

    // Update all elements with the class .ca-clock
    const clockElements = document.querySelectorAll('.ca-clock');
    clockElements.forEach((clock) => {
        clock.textContent = timeString;
    });
}

setInterval(updateClocks, 100);
updateClocks();


// DATE 

function updateDates() {
    const now = new Date();
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const weekday = weekdays[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    
    let suffix;
    if (day === 1 || day === 21 || day === 31) {
        suffix = 'st';
    } else if (day === 2 || day === 22) {
        suffix = 'nd';
    } else if (day === 3 || day === 23) {
        suffix = 'rd';
    } else {
        suffix = 'th';
    }
    
    const dateString = `${weekday}, ${month} ${day}${suffix}`;
    
    const dateElements = document.querySelectorAll('.ca-date');
    dateElements.forEach((date) => {
        date.textContent = dateString;
    });
}

// Call immediately when the page loads
updateDates();

// Function to calculate the time until midnight
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to next midnight
    return midnight - now; // Difference in milliseconds
}

// Set a timeout to update the date at midnight
setTimeout(function() {
    updateDates(); // Update the date at midnight
    setInterval(updateDates, 86400000); // Set interval for subsequent updates every 24 hours
}, getTimeUntilMidnight());

// --------------------- RANDOM FLAVOR TEXT GENERATOR ---------------------

let lastRandomLine = '';

async function fetchHeaderLines() {
    try {
        const response = await fetch('./assets/flavor.html');
        const text = await response.text();
        return text.split('\n').map(line => line.trim()).filter(line => line);
    } catch (error) {
        console.error('Error fetching header lines:', error);
        return [];
    }
}

function getRandomHeaderLine(lines) {
    if (lines.length === 0) return null;

    let randomLine;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        randomLine = lines[Math.floor(Math.random() * lines.length)];
        attempts++;
    } while (randomLine === lastRandomLine && attempts < maxAttempts);

    lastRandomLine = randomLine;
    return randomLine;
}

async function randomHeader(prefix = '') {
    const element = document.getElementById('flavor-text');

    if (prefix.trim()) {
        // If a prefix is provided, parse it as HTML and replace content
        const parser = new DOMParser();
        const dom = parser.parseFromString(prefix, 'text/html');
        element.innerHTML = ''; // Clear just before replacing
        element.append(...dom.body.childNodes);
        return;
    }

    // Otherwise, fetch a random line from headers.txt
    const lines = await fetchHeaderLines();
    const randomLine = getRandomHeaderLine(lines);

    if (!randomLine) {
        console.warn('No valid header line found.');
        return;
    }

    // Parse the random line as HTML and replace content
    const parser = new DOMParser();
    const dom = parser.parseFromString(randomLine, 'text/html');
    element.innerHTML = ''; // Clear just before replacing
    element.append(...dom.body.childNodes);
}

// Attach to the global object for console access
window.randomHeader = randomHeader;

randomHeader();
setInterval(randomHeader, 300000);

// -------------------- ALARM FUNCTIONALITY ---------------------   

document.addEventListener('DOMContentLoaded', function() {
    const alarmContainer = document.querySelector('.sched-customalarms');
    const alarmSound = new Audio('./assets/nintendo.wav');

    // Function to create a new alarm element
    function createAlarm(alarmNum, hour = '', minute = '', ampm = 'AM', enabled = false) {
        const newAlarm = document.createElement('div');
        newAlarm.classList.add('alarms');
        newAlarm.innerHTML = `
            <div class="alarm-setup">
            <div class="alarm-name-container"> <span class="alarm-name" data-default="alarm-${alarmNum}">alarm-${alarmNum}</span> <span class="alarm-remove">x</span> </div> 
            <div class="alarm-selectors">
            <input type="number" class="hours" min="1" max="12" value="${hour}">:<input type="number" class="minutes" min="0" max="59" value="${minute}">
            <select>
                <option value="AM" ${ampm === 'AM' ? 'selected' : ''}>AM</option>
                <option value="PM" ${ampm === 'PM' ? 'selected' : ''}>PM</option>
            </select>
            </div> <br>
            <input type="checkbox" id="alarm-enabled-${alarmNum}" ${enabled ? 'checked' : ''}> <br> <br>
            <span class="alarm-status">${enabled ? 'alarm going off in <span class="alarm-time">[seconds]</span>' : 'alarm disabled'}</span>
            </div>
        `;
        alarmContainer.insertBefore(newAlarm, alarmContainer.lastElementChild);

        // Add scroll wheel event listeners to the hour and minute inputs
        const hourInput = newAlarm.querySelector('.hours');
        const minuteInput = newAlarm.querySelector('.minutes');

        addScrollWheelListener(hourInput);
        addScrollWheelListener(minuteInput);

        return newAlarm;
    }

    // Function to add scroll wheel event listener to an input
    function addScrollWheelListener(input) {
        input.addEventListener('wheel', function(event) {
            event.preventDefault();
            const delta = Math.sign(event.deltaY); // Get the direction of the scroll
            let value = parseInt(input.value) || 0;
            const min = parseInt(input.min) || 0;
            const max = parseInt(input.max) || 0;

            // Update the value based on the scroll direction
            value -= delta;

            // Ensure the value stays within the min and max bounds
            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
        });
    }

    // Preload some example alarms (optional, adjust as needed)
    createAlarm(1, 12, 45, 'PM', false);
    createAlarm(2, 1, 45, 'PM', false);
    createAlarm(3, 5, 45, 'PM', false);

    // Function to update the time remaining for each alarm
    function updateAlarmTime(alarm, now) {
        const alarmEnabled = alarm.querySelector('input[type="checkbox"]');
        const alarmStatus = alarm.querySelector('.alarm-status');
        const alarmTimeDisplay = alarm.querySelector('.alarm-time');
        const hourInput = alarm.querySelector('.hours');
        const minuteInput = alarm.querySelector('.minutes');
        const ampmSelect = alarm.querySelector('select');
        const alarmSetup = alarm.querySelector('.alarm-setup'); // Get the alarm setup div
    
        if (alarmEnabled.checked) {
            let hours = parseInt(hourInput.value) || 0;
            const minutes = parseInt(minuteInput.value) || 0;
            const ampm = ampmSelect.value;
    
            // Adjust hours for PM/AM
            hours = ampm === 'PM' && hours < 12 ? hours + 12 : hours;
            hours = ampm === 'AM' && hours === 12 ? 0 : hours;
    
            let alarmTime = new Date(now);
            alarmTime.setHours(hours, minutes, 0, 0);
    
            if (alarmTime <= now) {
                alarmTime.setDate(alarmTime.getDate() + 1); // Set for next day if time has passed
            }
    
            const timeDiff = alarmTime - now;
            const secondsRemaining = Math.floor(timeDiff / 1000);
    
            // Convert seconds to MM:SS format
            const minutesRemaining = Math.floor(secondsRemaining / 60);
            const seconds = secondsRemaining % 60;
            const timeString = `${String(minutesRemaining).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
            // Update the status text
            alarmStatus.innerHTML = `alarm going off in <span class="alarm-time">${timeString}</span>`;
    
            // Play sound and disable alarm when it hits
            if (secondsRemaining <= 0) {
                alarmSound.play();
                alarmEnabled.checked = false; // Disable alarm after it goes off
                alarmStatus.textContent = 'alarm disabled'; // Update status text
    
                // Add the flashing class to the alarm setup div
                alarmSetup.classList.add('flashing');
    
                // Remove the flashing class after 1 second
                setTimeout(() => {
                    alarmSetup.classList.remove('flashing');
                }, 1000);
            }
        } else {
            alarmStatus.textContent = 'alarm disabled'; // Update status text when disabled
        }
    }

    // Function to update the clocks
    function updateClocks() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hoursString = hours.toString().padStart(2, '0');
        const timeString = `${hoursString}:${minutes}:${seconds} ${ampm}`;

        // Update all elements with the class .ca-clock
        const clockElements = document.querySelectorAll('.ca-clock');
        clockElements.forEach((clock) => {
            clock.textContent = timeString;
        });

        // Update all alarms using the same `now` object
        const alarms = alarmContainer.querySelectorAll('.alarms');
        alarms.forEach((alarm) => updateAlarmTime(alarm, now));
    }

    // Function to add a new alarm
    function addAlarm() {
        const alarmCount = alarmContainer.querySelectorAll('.alarms').length + 1;
        createAlarm(alarmCount);
    }

    // Event delegation for enabling/disabling alarms and removing alarms
    alarmContainer.addEventListener('change', function(event) {
        if (event.target.matches('input[type="checkbox"]')) {
            const alarm = event.target.closest('.alarms');
            updateAlarmTime(alarm, new Date()); // Update immediately when toggled
        }
    });

    alarmContainer.addEventListener('click', function(event) {
        if (event.target.matches('.alarm-remove')) {
            const alarm = event.target.closest('.alarms');
            alarm.remove();
        } else if (event.target.matches('.alarm-add')) {
            addAlarm();
        }
    });

    // Make alarm name editable on right-click
    alarmContainer.addEventListener('contextmenu', function(event) {
        if (event.target.matches('.alarm-name')) {
            event.preventDefault(); // Prevent default right-click menu
            const alarmName = event.target;
            alarmName.contentEditable = true;
            alarmName.focus();

            // Save changes on Enter key
            alarmName.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    alarmName.blur();
                }
            });

            // Save changes on blur
            alarmName.addEventListener('blur', function() {
                alarmName.contentEditable = false;
                if (alarmName.textContent.trim() === '') {
                    alarmName.textContent = alarmName.dataset.default; // Revert to default if empty
                }
            }, { once: true }); // Remove listener after blur
        }
    });

    // Update clocks and alarms every 100ms
    setInterval(() => {
        const now = new Date();
        updateClocks(now);
        const alarms = alarmContainer.querySelectorAll('.alarms');
        alarms.forEach((alarm) => updateAlarmTime(alarm, now));
    }, 100);
    updateClocks(); // Initial call
});
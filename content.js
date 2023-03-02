const petImageId = 'chrm_ext_pet';
let interval;

// Date object extension
Date.prototype.addHours = function(hours) {
    this.setTime(this.getTime() + (hours * 60 * 60 * 1000));
    return this;
}
Date.prototype.addSeconds = function(seconds) {
    this.setTime(this.getTime() + (seconds * 1000));
    return this;
}

async function summonPet(imageFile = 'scared') {
    const pet = document.createElement('img');
    const { petState } = await chrome.storage.local.get('petState');

    // Src
    pet.src = chrome.runtime.getURL(`images/${imageFile}.gif`);

    // Styling
    pet.id = petImageId;
    pet.style.width = '200px';
    pet.style.height = 'auto';
    pet.style.position = 'fixed';
    pet.style.top = `${petState.top}px` || '50%';
    pet.style.left = `${petState.left}px` || '50%';
    pet.style.transform = 'translate(-50%, -50%)';
    // pet.style.pointerEvents = 'none';
    pet.style.zIndex = '10000000000';
    pet.style.cursor = 'grab';
    pet.style['user-drag'] = 'none';
    pet.style['-webkit-user-drag'] = 'none';
    pet.style['user-select'] = 'none';
    pet.style['-moz-user-select'] = 'none';
    pet.style['-webkit-user-select'] = 'none';
    pet.style['-ms-user-select'] = 'none';

    // Append to body
    document.body.appendChild(pet);

    // Activate drag
    activateDragging();
}

function hideAllPets() {
    const pets = document.querySelectorAll(`img#${petImageId}`);

    pets.forEach(function(pet) {
        pet?.remove();
    })
}

function activateDragging() {
    const pet = document.querySelector(`img#${petImageId}`);
    let isDragging = false;

    if(pet !== null) {
        // On mouse down
        pet?.addEventListener('mousedown', () => {
            isDragging = true;

            pet.style.cursor = 'grab';
        });

        // On move
        pet?.addEventListener('mousemove', event => {
            const { clientX, clientY } = event;

            if(isDragging) {
                pet.style.left = `${clientX}px`;
                pet.style.top = `${clientY}px`;
                pet.style.cursor = 'grabbing';
            }
            return false;
        });

        // On mouse up
        pet?.addEventListener('mouseup', async event => {
            const { clientX, clientY } = event;
            const { petState } = await chrome.storage.local.get('petState');

            isDragging = false;
            pet.style.cursor = 'grab';

            // Set pet position to local storage
            if(typeof petState !== 'undefined') {
                chrome.storage.local.set({
                    petState: {
                        ...petState,
                        left: clientX,
                        top: clientY,
                    }
                });
            }
        });
    }
}

async function autoSummonPet(chrome) {
    const { petState } = await chrome.storage.local.get('petState');
    const { isPetHappy, visibleAt } = petState;

    interval = setInterval(function() {
        const currentTime = new Date();

        if(currentTime >= new Date(visibleAt)) {
            chrome.storage.local.set({
                petState: {
                    ...petState,
                    isPetVisible: true,
                    visibleAt: null,
                }
            });

            if(isPetHappy) summonPet('happy');
            else summonPet();

            clearInterval(interval);
        }
    }, 1000);
}

async function showPet() {
    const { petState:oldPetState } = await chrome.storage.local.get('petState');

    hideAllPets();

    // Set state to local storage
    await chrome.storage.local.set({
        petState: {
            ...oldPetState,
            isPetVisible: true,
            isPetHappy: false,
            visibleAt: null,
        }
    });

    summonPet();
    clearInterval(interval);
}

async function hidePet() {
    const { petState:oldPetState } = await chrome.storage.local.get('petState');

    hideAllPets();
    const plusTwoHours = new Date().addSeconds(10);

    // Hide for 2 hours
    await chrome.storage.local.set({
        petState: {
            ...oldPetState,
            isPetVisible: false,
            visibleAt: plusTwoHours.toString(),
        }
    });

    autoSummonPet(chrome);
}

async function feedPet() {
    const { petState:oldPetState } = await chrome.storage.local.get('petState');

    hideAllPets();

    // Set state to local storage
    await chrome.storage.local.set({
        petState: {
            ...oldPetState,
            isPetVisible: true,
            isPetHappy: true,
            visibleAt: null,
        }
    });

    summonPet('happy');
    clearInterval(interval);
}

async function initEvents() {
    eventOne();
    eventTwo();
}

async function eventOne() {}
async function eventTwo() {}

// On page load
chrome.storage.local.get('petState', ({ petState }) => {

    if(typeof petState !== 'undefined') {
        const { isPetVisible, isPetHappy, visibleAt, left, top } = petState;
        const now = new Date();

        if(isPetVisible) {
            if(isPetHappy) summonPet('happy');
            else summonPet();
        }

        // Check for timeout
        if(!isPetVisible && typeof visibleAt !== 'undefined' && visibleAt !== null) {

            if(now >= new Date(visibleAt)) {
                if(isPetHappy) summonPet('happy');
                else summonPet();

                chrome.storage.local.set({
                    petState: {
                        ...petState,
                        isPetVisible: true,
                        isPetHappy: isPetHappy,
                        visibleAt: null,
                    }
                });
            } else {
                autoSummonPet(chrome);
            }
        }
    }
});

// User actions
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { action } = message;

    switch (action) {
        case 'show':
            showPet();
            break;
        case 'hide':
            hidePet();
            break;
        case 'feed':
            feedPet();
            break;
    }
});
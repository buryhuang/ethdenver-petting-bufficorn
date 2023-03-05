const petWrapperId = 'chrm_ext_pet_123456';
let visibilityInterval,
    eventsInterval;

// Date object extension
Date.prototype.addHours = function(hours) {
    this.setTime(this.getTime() + (hours * 60 * 60 * 1000));
    return this;
}
Date.prototype.addSeconds = function(seconds) {
    this.setTime(this.getTime() + (seconds * 1000));
    return this;
}

async function summonPet(imageFile = 'sleep') {
    const wrapper = document.createElement('div');
    const pet = document.createElement('img');
    const { petState } = await chrome.storage.local.get('petState');

    // Src
    pet.src = chrome.runtime.getURL(`images/${imageFile}.gif`);

    // Wrapper Styling
    wrapper.id = petWrapperId;
    wrapper.style.width = '200px';
    wrapper.style.height = 'auto';
    wrapper.style.position = 'fixed';
    wrapper.style.top = petState.top ? `${petState.top}px` : '50%';
    wrapper.style.left = petState.left ? `${petState.left}px` : '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';
    wrapper.style.zIndex = '10000000000';
    wrapper.style.cursor = 'grab';
    wrapper.style['user-drag'] = 'none';
    wrapper.style['-webkit-user-drag'] = 'none';
    wrapper.style['user-select'] = 'none';
    wrapper.style['-webkit-user-select'] = 'none';

    // Pet Styling
    pet.style.width = '200px';
    pet.style.pointerEvents = 'none';

    // Append to body
    document.body.appendChild(wrapper);
    wrapper.appendChild(pet);

    // Activate drag
    activateDragging();

    // Init events
    initEvents();
}

function hideAllPets() {
    const pets = document.querySelectorAll(`#${petWrapperId}`);

    pets.forEach(function(pet) {
        pet?.remove();
    })
}

function activateDragging() {
    const pet = document.querySelector(`#${petWrapperId}`);
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

    visibilityInterval = setInterval(function() {
        const currentTime = new Date();

        if(currentTime >= new Date(visibleAt)) {
            chrome.storage.local.set({
                petState: {
                    ...petState,
                    isPetVisible: true,
                    visibleAt: null,
                }
            });

            // if(isPetHappy) summonPet('happy');
            // else summonPet();
            summonPet('sleep');

            clearInterval(visibilityInterval);
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
    clearInterval(visibilityInterval);
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
    clearInterval(eventsInterval);
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
            reacction: 'sleep',
        }
    });

    await summonPet('sleep');
    clearInterval(visibilityInterval);
}

async function makePetSay(sentence = '') {
    const wrapper = document.querySelector(`#${petWrapperId}`);
    const text = wrapper?.querySelectorAll('h4');

    // Remove existing sentences
    if(text?.length) {
        text?.forEach(function(item) {
            item.remove();
        });
    }

    // SAYYY
    if(sentence !== null || sentence !== '' || typeof sentence !== 'undefined') {
        const newText = document.createElement('h4');

        // Styling
        newText.style.margin = '0';
        newText.style.marginBottom = '10px';
        newText.style.padding = '0';
        newText.style.fontSize = '16px';
        newText.style.fontFamily = 'Roboto, sans-serif';
        newText.style.color = 'red';
        newText.style.textAlign = 'center';
        newText.style.lineHeight = '1.2';

        // Text
        newText.innerText = sentence;

        wrapper?.prepend(newText);
    }
}

async function initEvents() {
    eventsInterval = setInterval(function() {
        // event0();
        event1();
        event2();
    }, 3000);
}

async function event0() {
    const url = window.location.href;
    await chrome.storage.local.set({myPetAccount: '0xE120a1C90a813796425a2e9eF36F692F92d17073'});
}

async function event1() {
    try {
        // const response = await fetch('https://random-data-api.com/api/users/random_user');
        const response = await fetch('http://127.0.0.1:8700/pet_state');
        const data = await response.json();

        const { reaction, state } = data;
        // const { myPetAccount } = await chrome.storage.local.get('myPetAccount');
        makePetSay(`${reaction} ${state}`);
        const { petState } = await chrome.storage.local.get('petState');
        if (petState.reaction !== reaction) {
            console.log('reaction changed', petState.reaction, reaction)
            hideAllPets(); // remove existing pets
            summonPet(reaction);
        }
        await chrome.storage.local.set({
            petState: {
                ...petState,
                reaction: reaction
            }
        });

    } catch (err) {
        console.log(err);
    }
}
async function event2() {
    const url = window.location.href;
    console.log('Event 2', url);
}

// On page load
chrome.storage.local.get('petState', ({ petState }) => {

    if(typeof petState !== 'undefined') {
        const { isPetVisible, isPetHappy, visibleAt, left, top, reaction } = petState;
        const now = new Date();

        if(isPetVisible) {
            // if(isPetHappy) summonPet('happy');
            // else summonPet();
            summonPet(reaction);
        }

        // Check for timeout
        if(!isPetVisible && typeof visibleAt !== 'undefined' && visibleAt !== null) {

            if(now >= new Date(visibleAt)) {
                // if(isPetHappy) summonPet('happy');
                // else summonPet();
                summonPet(reaction);

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

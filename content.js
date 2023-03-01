const petImageId = 'chrm_ext_pet';

async function showPet(imageFile = 'scared') {
    const pet = document.createElement('img');
    const { petState } = await chrome.storage.local.get('petState');

    // Src
    pet.src = chrome.runtime.getURL(`images/${imageFile}.gif`);

    // Styling
    pet.id = petImageId;
    pet.style.width = '200px';
    pet.style.height = 'auto';
    pet.style.position = 'fixed';
    pet.style.top = '50%';
    pet.style.left = '50%';
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

    // Reposition pet
    if(typeof petState !== 'undefined') {
        const { left, top } = petState;

        pet.style.left = `${left}px`;
        pet.style.top = `${top}px`;
    }

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

chrome.storage.local.get('petState', ({ petState }) => {

    if(typeof petState !== 'undefined') {
        const { isPetVisible, isPetHappy } = petState;

        if(isPetVisible) {
            if(isPetHappy) showPet('happy');
            else showPet();
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action } = message;

    switch (action) {
        case 'show':
            hideAllPets();
            showPet();

            // Set state to local storage
            chrome.storage.local.set({
                petState: {
                    isPetVisible: true,
                    isPetHappy: false,
                }
            });
            break;
        case 'hide':
            hideAllPets();

            // Remove state from local storage
            chrome.storage.local.set({
                petState: {
                    isPetVisible: false,
                    isPetHappy: true,
                }
            });
            break;
        case 'feed':
            hideAllPets();
            showPet('happy');

            // Set state to local storage
            chrome.storage.local.set({
                petState: {
                    isPetVisible: true,
                    isPetHappy: true,
                }
            });
            break;
    }
});
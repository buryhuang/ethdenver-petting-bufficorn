// Get references to the buttons
const showButton = document.getElementById('show');
const hideButton = document.getElementById('hide');
const feedButton = document.getElementById('feed');

function showHideButton() {
    hideButton.style.display = 'block';
    showButton.style.display = 'none';
}
function showShowButton() {
    hideButton.style.display = 'none';
    showButton.style.display = 'block';
}

// Show / Hide proper buttons
window.onload = async function() {
    const { petState } = await chrome.storage.local.get('petState');

    if(typeof petState !== 'undefined') {
        const { isPetVisible } = petState;

        if(typeof isPetVisible !== 'undefined' && isPetVisible === true) {
            showHideButton();
        } else {
            showShowButton();
        }
    } else {
        showShowButton();
    }
}

// Add event listeners to the buttons
showButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'show' });
    });

    showHideButton();
});

hideButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'hide' });
    });

    showShowButton();
});

feedButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'feed' });
    });

    showHideButton();
});

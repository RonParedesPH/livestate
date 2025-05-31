// LiveState.js
const stateRegistry = new Map(); // Stores state values
const subscribers = new Map(); // Stores elements subscribed to state changes

function useState(key, initialValue) {
    if (!stateRegistry.has(key)) {
        stateRegistry.set(key, initialValue);
        subscribers.set(key, new Set());
    }

    function setState(newValue) {
        if (stateRegistry.get(key) !== newValue) {
            stateRegistry.set(key, newValue);
            console.log(`[${key}] State updated:`, newValue);
            notifySubscribers(key);
        }
    }

    return [key, setState];
}

function getState(key) {
    return stateRegistry.get(key) ?? null;
}

function deleteState(key) {
    if (stateRegistry.has(key)) {
        stateRegistry.delete(key);
        subscribers.delete(key);
        console.log(`[${key}] State deleted`);
    }
}

// Allow elements to subscribe to state changes
function subscribeState(key, element) {
    if (!subscribers.has(key)) {
        subscribers.set(key, new Set());
    }

    subscribers.get(key).add(element);
    updateElement(element, stateRegistry.get(key)); // Set initial value
}

// Notify subscribed elements when state updates
function notifySubscribers(key) {
    if (subscribers.has(key)) {
        subscribers.get(key).forEach(element => {
            updateElement(element, stateRegistry.get(key));
        });
    }
}

// Update element based on state changes
function updateElement(element, value) {
    requestAnimationFrame(() => {
        if ('value' in element) {
            element.value = value; // Input elements
        } else {
            element.textContent = value; // Other elements
        }
    });
}

export { useState, getState, deleteState, subscribeState };

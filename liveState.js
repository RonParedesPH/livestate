// LiveState.js
const stateRegistry = new Map(); // Stores state values
const subscribers = new Map(); // Stores elements subscribed to state changes

function useState(key, initialValue) {
    if (!stateRegistry.has(key)) {
        stateRegistry.set(key, { initial: initialValue, current: initialValue, previous: null });
        // stateRegistry.set(key, initialValue);
    }

    function setState(newValue) {
        let stateObj = stateRegistry.get(key);

        if (stateObj.current !== newValue) {
            stateObj.previous = stateObj.current; // Store previous value
            stateObj.current = newValue; // Update current value
            console.log(`[${key}] State updated:`, stateObj);
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
function subscribeState(key, selector, template = "%1") {
    if (!subscribers.has(selector)) {
        // subscribers.set(selector, new Set());
        subscribers.set(selector, { state: key, template });
    }

    //subscribers.get(selector).add({ template, state: key });
    document.querySelectorAll(selector).forEach(element => {
        //subscribers.get(key).add({ element, template });
        updateElement(element, stateRegistry.get(key), template); // Set initial value
    });
}

// Allow template to be updated on the fly
function updateTemplate(selector, newTemplate) {
    if (subscribers.has(selector)) {
        subscribers.get(selector).template = newTemplate;
        const key = subscribers.get(selector).state;
        document.querySelectorAll(selector).forEach(element => {
            updateElement(element, stateRegistry.get(key), newTemplate);
        });
    }
}


// Update element with template formatting or plain value
// internal - do not export
function updateElement(element, stateObj, template) {
    requestAnimationFrame(() => {
        // let formattedValue = template ? template.replace("%", value) : value;
        let formattedValue = template
            .replace("%0", stateObj.initial)   // Initial value
            .replace("%1", stateObj.current)   // Current value
            .replace("%2", stateObj.previous); // Previous value

        if ('value' in element) {
            element.value = formattedValue;
        } else {
            element.textContent = formattedValue;
        }
    });
}

// Notify subscribers with formatted output
// internal - do not export
function notifySubscribers(key) {
    subscribers.entries().forEach( (subs) => {
        if (subs[1].state === key) {
            document.querySelectorAll(subs[0]).forEach(element => {
                    updateElement(element, stateRegistry.get(key), subs[1].template); 
                });
        }
    });
}

const liveState = { useState, getState, deleteState, subscribeState, updateTemplate };

export { useState, liveState };

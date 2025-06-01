import { useState, liveState } from './liveState.js';

const [counterKey, setCounter] = useState("counter", 0);
const [messageKey, setMessage] = useState("message", "Hello!");

// Wait for the DOM to be fully loaded before interacting with it
document.addEventListener('DOMContentLoaded', () => {
    // Subscribe DOM elements to state changes
    // document.querySelectorAll(".counter").forEach(el => subscribeState(counterKey, el));
    // document.querySelectorAll(".message").forEach(el => subscribeState(messageKey, el));
    liveState.subscribeState(counterKey, ".counter", "Current: %1");

    setCounter(5); // Updates ".counter" elements dynamically
    setCounter(10); // Elements will now display: "Initial: 0 | Previous: 5 | Current: 10"

    // Updates elements dynamically
    setTimeout(() => {
        liveState.updateTemplate(".counter", "Final count: %1, previous: %2, count: %0");
    }, 5000);

    liveState.subscribeState(messageKey, ".message")

    console.log("Initial counter:", liveState.getState(counterKey)); // 0
    setCounter(15); // Auto-updates subscribed elements (if they were found and subscribed)
    console.log("Updated counter:", liveState.getState(counterKey)); // 5

    console.log("Initial message:", liveState.getState(messageKey)); // "Hello!"
    setMessage("Updated message!"); // Auto-updates subscribed elements
    console.log("Updated message:", liveState.getState(messageKey)); // "Updated message!"

    // Delete state when no longer needed
    liveState.deleteState(messageKey);
    console.log("Message after delete:", liveState.getState(messageKey)); // null
});

// Note: If this script is loaded with 'defer' or placed at the end of the <body>,
// the DOMContentLoaded wrapper might not be strictly necessary but is good practice for robustness.
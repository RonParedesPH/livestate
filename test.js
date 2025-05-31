import { useState, getState, deleteState, subscribeState } from './liveState.js';

const [counterKey, setCounter] = useState("counter", 0);
const [messageKey, setMessage] = useState("message", "Hello!");

// Wait for the DOM to be fully loaded before interacting with it
document.addEventListener('DOMContentLoaded', () => {
    // Subscribe DOM elements to state changes
    document.querySelectorAll(".counter").forEach(el => subscribeState(counterKey, el));
    document.querySelectorAll(".message").forEach(el => subscribeState(messageKey, el));

    console.log("Initial counter:", getState(counterKey)); // 0
    setCounter(5); // Auto-updates subscribed elements (if they were found and subscribed)
    console.log("Updated counter:", getState(counterKey)); // 5

    console.log("Initial message:", getState(messageKey)); // "Hello!"
    setMessage("Updated message!"); // Auto-updates subscribed elements
    console.log("Updated message:", getState(messageKey)); // "Updated message!"

    // Delete state when no longer needed
    deleteState(counterKey);
    console.log("Counter after delete:", getState(counterKey)); // null
});

// Note: If this script is loaded with 'defer' or placed at the end of the <body>,
// the DOMContentLoaded wrapper might not be strictly necessary but is good practice for robustness.
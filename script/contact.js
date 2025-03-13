import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCH_ifqZOJG2nRF_CBi15QLL4qPnbHW4mk",
    authDomain: "cafe-meraki.firebaseapp.com",
    databaseURL: "https://cafe-meraki-default-rtdb.firebaseio.com",
    projectId: "cafe-meraki",
    storageBucket: "cafe-meraki.firebasestorage.app",
    messagingSenderId: "283530227710",
    appId: "1:283530227710:web:cc081b99c76797e6605aaf",
    measurementId: "G-77EP68HM39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Form submission event
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const contactData = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    };

    // Store data in Firebase Realtime Database
    push(ref(database, "contactMessages"), contactData)
        .then(() => {
            console.log("Message sent successfully");
            alert("Your message has been sent successfully!");
            document.getElementById('contact-form').reset();
        })
        .catch(error => {
            console.error("Error sending message:", error);
            alert("There was an error sending your message. Please try again.");
        });
});
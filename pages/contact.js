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

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // ✅ Input Validation
    if (name === "" || email === "" || subject === "" || message === "") {
        alert("⚠️ Please fill out all fields before submitting.");
        return;
    }

    // ✅ Validate Email Format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("⚠️ Please enter a valid email address.");
        return;
    }

    // ✅ Check Firebase Database Connection
    if (!database) {
        alert("⚠️ Database connection failed. Please try again later.");
        return;
    }

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
            alert("✅ Your message has been sent successfully!");
            document.getElementById('contact-form').reset();
        })
        .catch(error => {
            console.error("❌ Error sending message:", error);
            alert("There was an error sending your message. Please try again.");
        });
});

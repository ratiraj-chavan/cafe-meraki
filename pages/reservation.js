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

document.addEventListener("DOMContentLoaded", function () {
    const reservationForm = document.getElementById("reservation-form");

    reservationForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents form from submitting automatically

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const dateInput = document.getElementById("date");
        const timeInput = document.getElementById("time");
        const guests = document.getElementById("guests").value.trim();

        const reservationDate = new Date(dateInput.value);
        const reservationTime = timeInput.value;
        const currentDate = new Date();

        // Ensure date is not in the past
        if (reservationDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
            alert("⚠️ Reservation date cannot be in the past. Please select a valid date.");
            return;
        }

        // Ensure time is at least 1 hour ahead if reservation is for today
        if (reservationDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)) {
            const [hours, minutes] = reservationTime.split(":").map(Number);
            const reservationDateTime = new Date();
            reservationDateTime.setHours(hours, minutes, 0);

            const minTime = new Date();
            minTime.setHours(minTime.getHours() + 1); // At least 1 hour ahead

            if (reservationDateTime < minTime) {
                alert("⚠️ Reservation time must be at least one hour from the current time.");
                return;
            }
        }

        // Prepare reservation data
        const reservationData = {
            name,
            email,
            date: dateInput.value,
            time: reservationTime,
            guests
        };

        // Send data to Firebase Realtime Database
        const reservationsRef = ref(database, "reservations");
        push(reservationsRef, reservationData)
            .then(() => {
                alert("✅ Reservation successful!");
                reservationForm.reset(); // Reset the form after submission
            })
            .catch((error) => {
                alert("❌ Failed to submit reservation. Please try again.");
                console.error("Error saving reservation:", error);
            });
    });
});
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

        // Extract hours and minutes from time input
        const [hours, minutes] = reservationTime.split(":").map(Number);
        const reservationDateTime = new Date(reservationDate);
        reservationDateTime.setHours(hours, minutes, 0);

        // Check if the reservation time is within allowed hours (8:00 AM - 10:00 PM)
        if (hours < 8 || hours >= 24) {
            alert("⚠️ Reservations are only allowed between 8:00 AM and 12:00 AM.");
            return;
        }

        // Ensure reservation is at least 15 minutes ahead if for today
        if (reservationDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)) {
            const minTime = new Date();
            minTime.setMinutes(minTime.getMinutes() + 15); // At least 15 minutes ahead

            if (reservationDateTime < minTime) {
                alert("⚠️ Reservation must be at least 15 minutes ahead of the current time.");
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

        console.log("Reservation successful:", reservationData);
        reservationForm.reset(); // Reset the form after submission



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
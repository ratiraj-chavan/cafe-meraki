// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ Get Elements
const userEmail = document.getElementById("userEmail");
const userName = document.getElementById("userName");
const userPhone = document.getElementById("userPhone");

// ✅ Check Authentication Status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ User logged in:", user.uid);

        // ✅ Display Email
        userEmail.textContent = user.email;

        // ✅ Fetch user data from Firebase Realtime Database
        const userRef = ref(database, "users/" + user.uid);
        get(userRef)
            .then(snapshot => {
                if (snapshot.exists()) {
                    console.log("✅ User data found:", snapshot.val());
                    userName.textContent = snapshot.val().name || "Not Provided";
                    userPhone.textContent = snapshot.val().phone || "Not Provided";
                } else {
                    console.warn("⚠️ No user data found in database!");
                    userName.textContent = "Not Found";
                    userPhone.textContent = "Not Found";
                }
            })
            .catch(error => {
                console.error("❌ Error fetching user data:", error);
            });
    } else {
        console.warn("⚠️ No user logged in. Redirecting to login...");
        window.location.href = "login.html";
    }
});

// Logout Function
window.logout = function () {
    signOut(auth).then(() => {
        alert("✅ Logged out successfully!");
        window.location.href = "login.html";
    }).catch(error => {
        console.error("❌ Logout Error:", error);
    });
};
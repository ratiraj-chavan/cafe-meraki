// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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
const database = getDatabase(app); // ✅ Fix: Now database is properly defined

console.log("🔥 Firebase Initialized:", app);

window.signup = function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();

    if (!name || !email || !phone || !password) {
        alert("❌ Please fill in all fields.");
        return;
    }
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("✅ User Created:", user);

            // ✅ Store user data in Firebase Database
            return set(ref(database, 'users/' + user.uid), {
                name: name,
                email: email,
                phone: phone
            });
        })
        .then(() => {
            alert("✅ Signup successful! Redirecting to Home...");
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error("❌ Signup Error:", error.code, error.message);
            alert("❌ Signup Failed: " + error.message);
        });
};
// ✅ Login Function
window.login = function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("❌ Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("✅ Login successful! Redirecting to home...");
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error("❌ Login Error:", error);
            alert(error.message);
        });
};

// ✅ Logout Function
window.logout = function () {
    signOut(auth).then(() => {
        alert("✅ Logged out successfully!");
        window.location.href = "../index.html";
    }).catch(error => {
        console.error("❌ Logout Error:", error);
    });
};

// ✅ Restrict Reservation & Cart Pages// Restrict Reservation & Cart Pages
const restrictedPages = ["/reservation.html", "/cart.html"];
const currentPage = window.location.pathname;

// Wait until Firebase is ready and check authentication
onAuthStateChanged(auth, (user) => {
    if (restrictedPages.includes(currentPage) && !user) {
        alert("❌ Access Denied! Please log in to continue.");
        window.location.replace("../pages/login.html"); // Force redirect
    }
});
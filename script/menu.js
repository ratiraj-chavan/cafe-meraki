// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// ✅ Firebase Configuration
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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ Function to animate the item image flying to the cart
function animateToCart(itemImage) {
    let cartIcon = document.querySelector("#cart-count");
    if (!cartIcon || !itemImage) return;

    let imgRect = itemImage.getBoundingClientRect();
    let cartRect = cartIcon.getBoundingClientRect();

    // Clone the image for animation
    let flyingImg = itemImage.cloneNode(true);
    flyingImg.classList.add("flying-item");

    // Set initial position relative to viewport
    flyingImg.style.position = "fixed";
    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = "80px";
    flyingImg.style.height = "auto";
    flyingImg.style.opacity = "1";
    flyingImg.style.transition = "transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-in-out";

    document.body.appendChild(flyingImg);

    // Move image toward cart with rotation and scaling
    setTimeout(() => {
        flyingImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) rotate(720deg) scale(0.3)`;
        flyingImg.style.opacity = "0.8";
    }, 10);

    // Slight bounce effect on reaching the cart
    setTimeout(() => {
        flyingImg.style.transform += " scale(0.5)";
        flyingImg.style.opacity = "0";
    }, 900);

    // Remove the animated image after animation
    setTimeout(() => {
        flyingImg.remove();
    }, 1100);
}

// ✅ Function to Add Items to Firebase Cart
window.addToCart = function (itemId, itemName, itemPrice, imgElementId) {
    const user = auth.currentUser; // Get the current logged-in user
    if (!user) {
        alert("❌ Please log in to add items to the cart.");
        window.location.replace("../pages/login.html");
        return;
    }

    const quantityInput = document.getElementById(`${itemId}-quantity`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    if (quantity < 1) {
        alert("Quantity must be at least 1!");
        return;
    }

    const cartRef = ref(database, `carts/${user.uid}/${itemId}`);

    get(cartRef).then((snapshot) => {
        if (snapshot.exists()) {
            // ✅ Update item quantity if it exists
            const existingData = snapshot.val();
            update(cartRef, { quantity: existingData.quantity + quantity });
        } else {
            // ✅ Add new item to cart
            set(cartRef, { name: itemName, price: itemPrice, quantity: quantity });
        }

        updateCartCount(); // Refresh cart count

        // ✅ Play the flying animation
        const itemImage = document.getElementById(imgElementId);
        if (itemImage) {
            animateToCart(itemImage);
        }
    }).catch(error => console.error("❌ Error adding to cart:", error));
};

// ✅ Function to Update Cart Count on Navbar
function updateCartCount() {
    const user = auth.currentUser;
    if (!user) {
        document.getElementById("cart-count").textContent = 0;
        return;
    }

    const cartRef = ref(database, `carts/${user.uid}`);
    get(cartRef).then((snapshot) => {
        if (snapshot.exists()) {
            let totalItems = 0;
            Object.values(snapshot.val()).forEach(item => {
                totalItems += item.quantity;
            });

            // ✅ Update Cart Count on UI
            document.getElementById("cart-count").textContent = totalItems;
        } else {
            document.getElementById("cart-count").textContent = 0;
        }
    }).catch(error => console.error("❌ Error fetching cart count:", error));
}

// ✅ Initialize Cart Count on Page Load
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        updateCartCount();
    });
});
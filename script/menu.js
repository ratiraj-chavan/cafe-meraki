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

// ✅ Initialize Firebase (Fix for 'No Firebase App' Error)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


 // Function to animate the item image flying to the cart
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
    flyingImg.style.transition = "all 0.8s ease-in-out";

    document.body.appendChild(flyingImg);

    // Move image toward cart
    setTimeout(() => {
        flyingImg.style.left = `${cartRect.left}px`;
        flyingImg.style.top = `${cartRect.top}px`;
        flyingImg.style.opacity = "0";
    }, 10);

    // Remove the animated image after animation
    setTimeout(() => {
        flyingImg.remove();
    }, 1000);
}
// ✅ Call the animateToCart function when the item image is clicked

// ✅ Function to Add Items to Firebase Cart
window.addToCart = function (itemId, itemName, itemPrice, imgElementId) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const quantityInput = document.getElementById(`${itemId}-quantity`);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1; // Fix: Read input value

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
        } else {
            alert("❌ Please log in to add items to the cart.");
            window.location.replace("../pages/login.html");
        }
    });
};

// ✅ Function to Update Cart Count on Navbar
function updateCartCount() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
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
        } else {
            document.getElementById("cart-count").textContent = 0;
        }
    });
}

// ✅ Initialize Cart Count on Page Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

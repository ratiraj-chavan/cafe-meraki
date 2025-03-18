// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// ✅ Firebase Configuration (Same as in menu.js)
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

// ✅ Function to Load Cart Data from Firebase
function loadCart() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const cartRef = ref(database, `carts/${user.uid}`);
            get(cartRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const cartData = snapshot.val();
                    displayCart(cartData);
                } else {
                    document.getElementById("cart-items").innerHTML = "<p>🛒 Cart is empty!</p>";
                }
            }).catch(error => console.error("❌ Error loading cart:", error));
        } else {
            alert("❌ Please log in to view your cart.");
            window.location.href = "login.html";
        }
    });
}

// ✅ Function to Display Cart Items
function displayCart(cartData) {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = ""; // Clear previous content

    let totalPrice = 0;
    let cartCount = 0; // To update cart count in the navbar

    for (const itemId in cartData) {
        const item = cartData[itemId];
        totalPrice += item.price * item.quantity;
        cartCount += item.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <p>${item.name} :- ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                <div class="cart-buttons">
                    <button onclick="updateItemQuantity('${itemId}', ${item.quantity - 1})">—</button>
                    <button onclick="updateItemQuantity('${itemId}', ${item.quantity + 1})">✚</button>
                    <button onclick="removeItem('${itemId}')">🗑️ Remove</button>
                </div>
            </div>
        `;
    }

    // ✅ Update Total Price Display
    document.getElementById("total-price").innerText = totalPrice.toFixed(2);

    // ✅ Update Cart Count in Navbar
    document.getElementById("cart-count").innerText = cartCount;

    // ✅ If cart is empty, show message
    if (cartCount === 0) {
        cartContainer.innerHTML = "<p>🛒 Your cart is empty!</p>";
        document.getElementById("total-price").innerText = "0.00";
    }
}
// ✅ Function to Update Item Quantity
window.updateItemQuantity = function (itemId, newQuantity) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const cartRef = ref(database, `carts/${user.uid}/${itemId}`);
            if (newQuantity <= 0) {
                remove(cartRef);
            } else {
                update(cartRef, { quantity: newQuantity });
            }
            loadCart();
        }
    });
};
// Proceed to checkout (place order)
function proceedToCheckout() {
    if (cart.length > 0) {
        window.location.href = '../pages/order.html'; // Redirect to the order details page
    } else {
        alert('Your cart is empty!');
    }
}
// ✅ Function to Remove Item from Cart
window.removeItem = function (itemId) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            remove(ref(database, `carts/${user.uid}/${itemId}`));
            loadCart();
        }
    });
};

// ✅ Initialize Cart on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});
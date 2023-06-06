const nav = document.querySelector("#nav");
const header = document.querySelector("#header");

const navScrollCallback = function (entries, observer) {
    const [entry] = entries;

    if (entry.isIntersecting) {
        nav.classList.remove("bg-black");
        nav.classList.add("bg-transparent");
    } else {
        nav.classList.remove("bg-transparent");
        nav.classList.add("bg-black");
    }
};

const navScrollOptions = {
    root: null,
    rootMargin: "100px",
    threshold: 1,
};

const navScrollObserver = new IntersectionObserver(
    navScrollCallback,
    navScrollOptions
);
navScrollObserver.observe(header);

//
const cartBtn = document.getElementById("cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartOverlayContent = document.getElementById("cart-overlay-content");
const cartClose = document.getElementById("cart-close");

cartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("invisible");
    cartOverlayContent.classList.remove("translate-x-[100%]");
});
cartClose.addEventListener("click", () => {
    cartOverlay.classList.add("invisible");
    cartOverlayContent.classList.add("translate-x-[100%]");
});

// implementing the app
const cartTotal = document.querySelector("#cart-total");
const clearCart = document.querySelector("#clear-cart");
const myCart = document.querySelector("#cart-items");
const products = document.getElementById("product-content");
const cartCount = document.querySelector("#cart-items-count");

// alert
const alertBox = document.querySelector("#alert-box");
const alertname = document.querySelector("#name");

// cart
let cart = [];
let buttonsDom = [];

// getting our products
class Product {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let response = await result.json();
            let products = response.items;
            // products is disorganised, so we'll destructure and return it organised
            products = products.map((item) => {
                const { id } = item.sys;
                const { title, price } = item.fields;
                const image = item.fields.image.fields.file.url;
                return { id, title, price, image };
            });
            return products;
        } catch (err) {
            console.error(err);
        }
    }
}

// receives and manipulates products in iteraction with ui
class UI {
    displayProducts(data) {
        let content = "";
        data.forEach((item) => {
            content += `<div>
                    <div
                        class="w-full h-[160px] rounded-sm overflow-hidden relative group""
                    >
                        <img
                            src=${item.image}
                            alt="image of the product"
                            class="object-fit w-full h-full"
                        />
                        <div
                            class="flex space-x-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                        >
                            <button
                                class="w-8 h-8 rounded-full flex items-center justify-center bg-amber-600 cursor-pointer focus:outline-none"
                                id="search-btn"
                            >
                                <i class="bx bx-search text-white"></i>
                            </button>
                            <button
                                class="w-8 h-8 rounded-full flex items-center justify-center bg-amber-600 cursor-pointer focus:outline-none add-to-cart"
                                data-id=${item.id}
                            >
                                <i class="bx bx-cart-alt text-white"></i>
                            </button>
                        </div>
                    </div>
                    <h4
                        class="mt-3 text-center text-gray-600 text-base capitalize font-semibold"
                    >
                        ${item.title}
                    </h4>
                    <h5
                        class="mt-1 text-center text-gray-950 text-[18px] font-medium"
                    >
                        $${item.price}
                    </h5>
                </div>`;
        });
        products.innerHTML = content;
    }
    getButtons() {
        const buttons = [...document.querySelectorAll(".add-to-cart")];
        buttonsDom = buttons;
        buttons.forEach((btn) => {
            let id = btn.dataset.id;
            let inCart = cart.find((item) => item.id === id);
            if (inCart) {
                btn.disabled = true;
                btn.classList.add("opacity-50");
            }
            btn.addEventListener("click", (e) => {
                btn.disabled = true;
                btn.classList.add("opacity-50");

                // GET PRODUCT FROM YOUR PRODUCTS
                let cartItem = { ...Storage.getProducts(id), amount: 1 };
                // cart products in cart
                cart = [...cart, cartItem];
                // save cart in local
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // append cart to dom
                this.addCartItems(cartItem);
                // show the cart
                // this.showCart();
                // make the alert
                this.showAlert(cartItem, "added to cart");
                // remove the alert
                setTimeout(this.removeAlert, 5000);
            });
        });
    }
    setCartValues(cart) {
        let totalPrice = 0;
        let totalItems = 0;

        cart.map((item) => {
            totalPrice += item.price * item.amount;
            totalItems += item.amount;
        });
        cartTotal.textContent = +totalPrice.toFixed(2);
        cartCount.textContent = totalItems;
    }
    addCartItems(item) {
        const div = document.createElement("div");
        div.classList = "grid items-center gap-4 grid-cols-cartItem";
        div.innerHTML = `
                        <div class="w-16 h-16 rounded-sm overflow-hidden grid">
                            <img
                                src="./images/product-1.jpeg"
                                class="object-fit w-full h-full"
                            />
                        </div>
                        <div class="">
                            <h4 class="font-bold text-base capitalize">
                                ${item.title}
                            </h4>
                            <h5 class="font-normal text-base capitalize">
                                $${item.price}
                            </h5>
                            <p
                                class="text-base font-medium capitalize text-red-500 cursor-pointer remove-cart-item"
                                data-id=${item.id}
                            >
                                remove
                            </p>
                        </div>
                        <div class="">
                            <i
                                class="bx bx-caret-up text-gray-950 cursor-pointer text-lg increase-amount"
                                data-id=${item.id}
                            ></i>
                            <p
                                id="cart-count"
                                class="leading-[0.8] text-center"
                                data-id=${item.id}
                            >
                                ${item.amount}
                            </p>
                            <i
                                class="bx bx-caret-down text-gray-950 cursor-pointer text-lg decrease-amount"
                                data-id=${item.id}
                            ></i>
                        </div>`;
        myCart.append(div);
    }
    showCart() {
        // cartOverlay.classList.remove("invisible");
        // cartOverlayContent.classList.remove("translate-x-[100%]");
    }
    showAlert(item, text) {
        const navControl = document.getElementById("nav-control");
        const div = document.createElement("div");
        div.classList =
            "w-[90%] md:w-72 z-[80] rounded-md bg-gray-100 bg-opacity-60 fixed top-20 md:right-4 mx-[18px] backdrop-blur-sm transition duration-300 ease-in-out shadow-sm";
        div.id = "alert-box";
        div.innerHTML = `
                <div
                    class="relative w-full h-full py-4 px-3"
                >
                    <i
                        class="bx bxs-up-arrow text-white backdrop-blur-md opacity-60 text-2xl absolute left-[88%] -top-[20px] z-[20]"
                    ></i>
                    <p class="text-black text-lg font-semibold text-center">
                        <span id="name">${item ? item.title : ""}</span> ${text}
                    </p>
                </div>`;
        navControl.appendChild(div);
    }
    removeAlert() {
        document.getElementById("alert-box").remove();
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        this.showCart();
    }
    populateCart(cart) {
        cart.forEach((item) => {
            this.addCartItems(item);
        });
    }
    closeCart() {
        cartOverlay.classList.add("invisible");
        cartOverlayContent.classList.add("translate-x-[100%]");
    }
    cartLogic() {
        clearCart.addEventListener("click", () => {
            this.clearCart(cart);
        });
        myCart.addEventListener("click", (e) => {
            let clickedItem = e.target;
            if (clickedItem.classList.contains("remove-cart-item")) {
                let id = clickedItem.dataset.id;
                myCart.removeChild(clickedItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (clickedItem.classList.contains("increase-amount")) {
                let id = clickedItem.dataset.id;
                let action = cart.find((item) => item.id === id);
                action.amount++;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                clickedItem.nextElementSibling.textContent = action.amount;
            } else if (clickedItem.classList.contains("decrease-amount")) {
                let id = clickedItem.dataset.id;
                let action = cart.find((item) => item.id === id);
                action.amount--;
                if (action.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    clickedItem.previousElementSibling.textContent =
                        action.amount;
                } else {
                    myCart.removeChild(clickedItem.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart(cart) {
        let cartItems = cart.map((item) => item.id);
        cartItems.forEach((id) => this.removeItem(id));
        while (myCart.children.length > 0) {
            myCart.removeChild(myCart.children[0]);
        }
    }
    removeItem(id) {
        cart = cart.filter((item) => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        if (cart.length < 1) {
            this.closeCart();
            this.showAlert(undefined, "no items in cart");
            // remove the alert
            setTimeout(this.removeAlert, 5000);
        }
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.classList.remove("opacity-50");
    }
    getSingleButton(id) {
        return buttonsDom.find((button) => button.dataset.id === id);
    }
}

// interacts with storage ie local or database
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProducts(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((item) => item.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const product = new Product();
    const ui = new UI();

    ui.setupApp();
    // get all products
    product
        .getProducts()
        .then((data) => data)
        .then((data) => {
            ui.displayProducts(data);
            Storage.saveProducts(data);
        })
        .then((data) => {
            ui.getButtons();
            ui.cartLogic();
        });
});

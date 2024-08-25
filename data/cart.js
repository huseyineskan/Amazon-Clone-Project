export let cart =  JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1
    }];
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    console.log(productQuantity)
    let matchingItem;

    cart.forEach((item) => {
        if(productId === item.productId) {
            matchingItem = item;
        }
    });

    if(matchingItem) {
        matchingItem.quantity += productQuantity;
    } else {
        cart.push({
            productId: productId,
            quantity: productQuantity
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}
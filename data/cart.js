export const cart = [];

export function addToCart(productId) {
    const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
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
}
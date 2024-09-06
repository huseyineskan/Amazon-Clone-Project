import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
    let cartSummarytHTML = '';

    document.addEventListener('DOMContentLoaded', () => {
        calculateCartQuantity('js-checkout-page-items');
        calculateCartQuantity('js-checkout-summary-items');
        
    });

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
    );
    const dateString = deliveryDate.format(
        'dddd, MMMM D'
    );

    cartSummarytHTML +=`
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input class="quantity-input"/>
                    <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
                </div>
            </div>
        </div>
    `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            const dateString = deliveryDate.format(
                'dddd, MMMM D'
            );
            const priceString = deliveryOption.priceCents === 0 
                ? 'FREE' 
                : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked': ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        $${priceString} Shipping
                    </div>
                    </div>
                </div>
            `
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummarytHTML;

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.remove();
                calculateCartQuantity('js-checkout-page-items');
                calculateCartQuantity('js-checkout-summary-items');
                renderPaymentSummary();
            })
        })

    document.querySelectorAll('.js-update-quantity-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add('is-editing-quantity');
            })
        })

    document.querySelectorAll('.save-quantity-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                updateInputSave(link);
            });
            const productId = link.dataset.productId;
            const inputElement = document.querySelector(`.js-cart-item-container-${productId} .quantity-input`);
            inputElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    updateInputSave(link);
                }
            });
        });


    function updateInputSave (link) {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');
        
        const inputElement = document.querySelector(`.js-cart-item-container-${productId} .quantity-input`);
        const newQuantity = Number(inputElement.value);
        
        if (newQuantity < 1 || newQuantity > 10) {
            alert("Product quantity is limited to 1-10");
            inputElement.value = "";
        } else {
            updateQuantity(productId, newQuantity);

            document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerHTML = newQuantity;
            calculateCartQuantity('js-checkout-page-items');
            inputElement.value = "";
            renderPaymentSummary();
            calculateCartQuantity('js-checkout-summary-items');
        }
    }

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId)
                renderOrderSummary();
                renderPaymentSummary();
            })
        });
}
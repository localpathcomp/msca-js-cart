let productRow = document.querySelector('.products-feed'),
    entryTitle = document.getElementById('entry-title'),
    cart = document.getElementById('cart'),
    cartCount,
    cartTotal,
    items;

let cartObj = {
    cart: [],
    model: {
        getCart: function() {
            document.getElementById('clearCart').addEventListener('click', cartObj.controller.destroy);
            items = document.querySelectorAll('.add-to-cart');
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                item.addEventListener('click', function(e) {
                    let found = false;
                    let name = item.getAttribute('data-product-name');
                    let price = item.getAttribute('data-product-price');
                    for (let j = 0; j < cartObj.cart.length; j++) {
                        const cartItem = cartObj.cart[j];
                        if (cartItem.name == item.getAttribute('data-product-name')) {
                            found = true;
                            cartObj.cart[j].qty++;
                        }
                    }
                    if (!found) {
                        cartObj.cart.push({ name, price, qty: 1 });
                    }
                    localStorage.setItem('cart', JSON.stringify(cartObj.cart));
                    cartObj.view.updateCart();
                });
            }
        },
        getLocalStorage: function() {
            if (!localStorage.getItem('cart')) {
                return;
            } else {
                let persistCart = JSON.parse(localStorage.getItem('cart'));
                cartObj.cart = persistCart;
                cartObj.view.updateCart();
            }
        },
        clearCart: function() {
            localStorage.clear();
            cartObj.cart = [];
            cartObj.view.updateCart();
        }
    },
    view: {
        updateCart: function() {
            cartCount = document.getElementById('cartCount');
            cartTotal = document.getElementById('cartTotal');
            let totalAmount = 0,
                totalCount = 0;
            for (let i = 0; i < cartObj.cart.length; i++) {
                const item = cartObj.cart[i];
                totalAmount += item.price * item.qty;
                totalCount += item.qty;
            }
            cartTotal.innerText = `$${totalAmount.toFixed(2)}`;
            cartCount.innerText = `${totalCount}`;
            (totalCount > 0) ? cart.classList.remove('none'): cart.classList.add('none');
        },
        getProducts: async function() {
            let response = await fetch('assets/products.json');
            let products = await response.json();
            /* await new Promise(r => setTimeout(r, 5000)); */
            products.forEach(el => {
                productRow.insertAdjacentHTML('beforeend', `
                <div class="col-6 col-md-3 pb-5 text-center product-div">
                <figure><img src="${el.productImage}" class="img-fluid"><figcaption class="pt-3">${el.productName}</figcaption></figure>
                <p>$${el.productPrice.toFixed(2)}</p>
                <button class="btn btn-success add-to-cart" type="button" data-product-id="${el.productId}" data-product-price="${el.productPrice.toFixed(2)}" data-product-name="${el.productName}">Add To Cart</button>
                <div class="none hidden-product-description">${el.productDescription}</div>
                </div>
                `);
            });
        }
    },
    controller: {
        init: async function() {
            await cartObj.view.getProducts();
            await cartObj.model.getLocalStorage();
            await cartObj.model.getCart();
        },
        destroy: async function() {
            await cartObj.model.clearCart();
            alert('success');
        }
    }
}
cartObj.controller.init();
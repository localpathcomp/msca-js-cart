let productRow = document.querySelector('.products-feed'),
    entryTitle = document.getElementById('entry-title'),
    cart = document.getElementById('cart'),
    clearCartBtn = document.getElementById('clearCartBtn'),
    viewCartBtn = document.getElementById('viewCartBtn'),
    productsModalTable = document.getElementById('productsModalTable'),
    submitUpdatCartBtn = document.getElementById('submitUpdatCartBtn'),
    cartCount,
    cartTotal,
    items;

let cartObj = {
    cart: [],
    currencyRate: 1,
    model: {
        getCart: function() {
            document.getElementById('clearCart').addEventListener('click', cartObj.controller.destroy);
            viewCartBtn.addEventListener('click', cartObj.controller.update);
            submitUpdatCartBtn.addEventListener('click', cartObj.controller.updateQty);
            items = document.querySelectorAll('.add-to-cart');
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                item.addEventListener('click', function() {
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
        updateQty: function() {
            let cartProdInputs = document.querySelectorAll('#productsModalTable input');
            cartProdInputs.forEach(el => {
                cartObj.cart[el.getAttribute('data-idx')].qty = el.value;
            });
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
            productsModalTable.innerHTML = '';
            cartObj.view.updateCart();
        }
    },
    view: {
        updateCart: function(where) {
            if (where === 'modal') {
                cartObj.cart.forEach((el, idx) => {
                    productsModalTable.insertAdjacentHTML('beforeend', `
                    <tr>
                    <td>${el.name}</td>
                    <td>${el.price}</td>
                    <td><input class="form-control" type="number" step="1" min="0" max="9999" placeholder="${el.qty}" value="${el.qty}" data-idx="${idx}"></td>
                  </tr>
                    `);
                });

            } else {
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
                if (totalCount > 0) {
                    cart.classList.remove('none');
                    clearCartBtn.classList.remove('none');
                    viewCartBtn.classList.remove('none');
                } else {
                    cart.classList.add('none');
                    clearCartBtn.classList.add('none');
                    viewCartBtn.classList.add('none');
                }
            }
        },
        getProducts: async function() {
            let response = await fetch('assets/products.json');
            let products = await response.json();
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
            cartObj.model.getLocalStorage();
            cartObj.model.getCart();
        },
        destroy: function() {
            cartObj.model.clearCart();
            $('#clearCartModal').modal('hide');
        },
        update: function() {
            cartObj.view.updateCart('modal');
        },
        updateQty: function() {
            cartObj.model.updateQty();
            $('#updateCartModal').modal('hide');
        }
    }
}
cartObj.controller.init();
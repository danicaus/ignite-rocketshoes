import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => {
    const priceFormatted = formatPrice(product.price)
    const subTotal = formatPrice(product.amount * product.price)
    return {...product, priceFormatted, subTotal}
  })
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal +=(product.amount * product.price)
        return sumTotal
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    const productData = {
      productId: product.id,
      amount: (product.amount + 1)
    }
    updateProductAmount(productData)
  }
  
  function handleProductDecrement(product: Product) {
    const productData = {
      productId: product.id,
      amount: (product.amount - 1)
    }
    updateProductAmount(productData)
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>

          {cartFormatted.map(cartProduct => {

            return(
              <tr data-testid="product" key={cartProduct.id}>
                <td>
                  <img src={cartProduct.image} alt={cartProduct.title} />
                </td>
                <td>
                  <strong>{cartProduct.title}</strong>
                  <span>{cartProduct.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={cartProduct.amount <= 1}
                      onClick={() => handleProductDecrement(cartProduct)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={cartProduct.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(cartProduct)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{cartProduct.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(cartProduct.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>

            )
          })}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;

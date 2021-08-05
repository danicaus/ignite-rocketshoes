import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { isConstructorDeclaration } from 'typescript';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const response = await api.get('stock')
      const stock: Stock[] = response.data
      const productStock = stock.filter(stockItem => stockItem.id === productId)
      const isProductOnCart = cart.filter(cartItem => cartItem.id === productId)
      let productAmountOnCart = { 
        productId: productId, 
        amount: 1,
      }
      
      if(isProductOnCart.length){
        const amount = productStock[0].amount - isProductOnCart[0].amount
        if(!amount){
          productAmountOnCart = {...productAmountOnCart, amount: (isProductOnCart[0].amount)}
          toast.error('Quantidade solicitada fora de estoque')
        } else {
          productAmountOnCart = {...productAmountOnCart, amount: (isProductOnCart[0].amount + 1)}
        }
      }
      updateProductAmount(productAmountOnCart)

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const isProductOnCart = cart.filter(cartItem => cartItem.id === productId)
      let productAmountOnCart = { 
        productId: productId, 
        amount: (isProductOnCart[0].amount - 1),
      }

      updateProductAmount(productAmountOnCart)
      
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      let itemAmountUpdated: Product
      const isProductOnCart = cart.filter(cartItem => cartItem.id === productId)
      
      if(isProductOnCart.length > 0){
        itemAmountUpdated = {
          id: isProductOnCart[0].id,
          title: isProductOnCart[0].title,
          price: isProductOnCart[0].price,
          image: isProductOnCart[0].image,
          amount: amount
        }
        
        const cartUpdated = cart.map(cartItem => {
          if(cartItem.id === itemAmountUpdated.id){
            return {...cartItem, amount: itemAmountUpdated.amount}
          }
          return cartItem
        })
        
        setCart(cartUpdated)
      
      } else {
        const response = await api.get('products')
        const getProduct: Product[] = response.data
        const selectProduct = getProduct.filter(product => product.id === productId)
        
        itemAmountUpdated = {
          id: selectProduct[0].id,
          title: selectProduct[0].title,
          price: selectProduct[0].price,
          image: selectProduct[0].image,
          amount: amount
        }
        
        setCart([...cart, itemAmountUpdated])
      }
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

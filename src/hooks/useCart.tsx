import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
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
      const stock: Stock[] = await api.get('stock')
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

  //Receber a quantidade e gravar no localStorage
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const cartUpdated = cart.map(cartItem => {
        if(cartItem.id === productId){
          return {...cartItem, amount: amount}
        } else {
          return {...cartItem}
        }
      })

      setCart(cartUpdated)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartUpdated))

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

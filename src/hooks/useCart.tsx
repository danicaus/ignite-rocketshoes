import { createContext, ReactNode, useContext, useState } from 'react';
// import { MdPermContactCalendar } from 'react-icons/md';
import { toast } from 'react-toastify';
// import { isConstructorDeclaration } from 'typescript';
import { api } from '../services/api';
import { Product } from '../types';

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
  
  //Só adiciona o produto que não estiver no carrinho
  const addProduct = async (productId: number) => {
    try {
      const stock = await api.get(`/stock/${productId}`)
      const amountStock = stock.data.amount
      
      const tempCart = [...cart]
      const isProductOnCart = tempCart.find(cartItem => cartItem.id === productId)
      
      const amountCart = isProductOnCart ? isProductOnCart.amount : 0
      const amount = amountCart + 1
      
      if(amount > amountStock){
        toast.error('Quantidade solicitada fora de estoque')
        return
      } 
      
      if(isProductOnCart){
        isProductOnCart.amount = amount
      } else {
        const product = await api.get(`/products/${productId}`)
        const newProduct: Product = {...product.data, amount: 1}
        tempCart.push(newProduct)
        
      }
      
      setCart(tempCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(tempCart))
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  //Deleta o produto do carrinho
  const removeProduct = (productId: number) => {
    try {
      const tempCart = [...cart]
      const isProductOnCart = tempCart.find(cartItem => cartItem.id === productId)
      
      if(isProductOnCart){
        const cartUpdated = cart.filter(cartProduct => cartProduct.id !== productId)
        setCart(cartUpdated)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartUpdated))
      } else {
        toast.error('Erro na remoção do produto');
      }
    
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  //Altera a quantidade de produtos no carrinho
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const response = await api.get(`/stock/${productId}`)
      const amountStock = response.data.amount
      
      if(amountStock >= amount && amount >= 1){
        const tempCart = cart.map(product => {
          if(product.id === productId){
            return {...product, amount: amount}
          } else {
            return product
          }
        })
        setCart(tempCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(tempCart))
      } else {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

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

import {createContext,useContext,useEffect,useMemo,useState} from "react";

interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    quantity: number;
    category: string;
}

interface CartContextType {
    cart:CartItem[];
    addToCart: (product:Omit<CartItem,'quantity'>, quantity?:number) => void;
    removeFromCart: (productId:string) => void;
    updateCartQuantity: (productId:string, quantity:number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children}:{children:React.ReactNode}) => {
    const [cart,setCart] = useState<CartItem[]>([]);

//load from localstorage
  useEffect(() => {
  const stored = localStorage.getItem("cart");
  if (stored) {
    setCart(JSON.parse(stored));
  }
}, []); // ✅ EMPTY dependency array


    // save to localstorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    },[cart]);
// add to cart
    const addToCart = (product:Omit<CartItem,'quantity'>, quantity:number=1) => {
        setCart(prev => {
            const existingItem = prev.find(item => item._id === product._id);
            if (existingItem) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity:Math.min( item.quantity + quantity, item.stock) }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity:Math.min(quantity, product.stock) }];
            }
        });
    };

    // remove from cart
    const removeFromCart = (productId:string) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    }

    // update cart quantity
    const updateCartQuantity = (productId:string, quantity:number) => {
        setCart(prev =>
            prev.map(item =>
                item._id === productId
                    ? { ...item, quantity:Math.max(Math.min(quantity, item.stock), 1) }
                    : item
            )
        );
    };

    // clear cart
    const clearCart = () => {
        setCart([]);
    };

    // derived values
    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
     [cart]);

     const value={
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        totalItems,
        totalPrice,
     };

    return( <CartContext.Provider value={value}>{children}</CartContext.Provider>);
}
export const useCart = () => {
    const ctc = useContext(CartContext);
    if (!ctc) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return ctc;

}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "../data/catalog";

export interface CartLine {
  productId: string;
  color: string;
  qty: number;
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
}

type Action =
  | { type: "ADD"; productId: string; color: string; qty: number }
  | { type: "REMOVE"; productId: string; color: string }
  | { type: "QTY"; productId: string; color: string; qty: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISH"; productId: string }
  | { type: "HYDRATE"; state: ShopState };

const CART_KEY = "uxt-cart-v1";
const WISH_KEY = "uxt-wishlist-v1";

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "ADD": {
      const existing = state.cart.find(
        (l) => l.productId === action.productId && l.color === action.color,
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l === existing ? { ...l, qty: l.qty + action.qty } : l,
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { productId: action.productId, color: action.color, qty: action.qty },
        ],
      };
    }
    case "REMOVE":
      return {
        ...state,
        cart: state.cart.filter(
          (l) => !(l.productId === action.productId && l.color === action.color),
        ),
      };
    case "QTY":
      return {
        ...state,
        cart: state.cart
          .map((l) =>
            l.productId === action.productId && l.color === action.color
              ? { ...l, qty: Math.max(1, action.qty) }
              : l,
          )
          .filter((l) => l.qty > 0),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISH":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.productId)
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    default:
      return state;
  }
}

export interface CartLineDetailed extends CartLine {
  product: Product;
  lineTotal: number;
}

interface Toast {
  id: number;
  message: string;
}

interface ShopContextValue extends ShopState {
  cartDetailed: CartLineDetailed[];
  cartCount: number;
  subtotal: number;
  addToCart: (productId: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, color: string) => void;
  setQty: (productId: string, color: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  bump: number;
  toasts: Toast[];
}

const ShopContext = createContext<ShopContextValue | null>(null);

function loadInitialState(): ShopState {
  if (typeof window === "undefined") return { cart: [], wishlist: [] };
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const wishlist = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
    return {
      cart: Array.isArray(cart) ? cart : [],
      wishlist: Array.isArray(wishlist) ? wishlist : [],
    };
  } catch {
    return { cart: [], wishlist: [] };
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const pushToast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const addToCart = useCallback(
    (productId: string, color: string, qty = 1) => {
      dispatch({ type: "ADD", productId, color, qty });
      setBump((n) => n + 1);
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product) pushToast(`${product.name} added to cart`);
      setDrawerOpen(true);
    },
    [pushToast],
  );

  const value = useMemo<ShopContextValue>(() => {
    const cartDetailed: CartLineDetailed[] = state.cart
      .map((line) => {
        const product = PRODUCTS.find((p) => p.id === line.productId);
        if (!product) return null;
        return {
          ...line,
          product,
          lineTotal: product.price * line.qty,
        };
      })
      .filter((l): l is CartLineDetailed => l !== null);

    return {
      ...state,
      cartDetailed,
      cartCount: state.cart.reduce((sum, l) => sum + l.qty, 0),
      subtotal: cartDetailed.reduce((sum, l) => sum + l.lineTotal, 0),
      addToCart,
      removeFromCart: (productId, color) =>
        dispatch({ type: "REMOVE", productId, color }),
      setQty: (productId, color, qty) =>
        dispatch({ type: "QTY", productId, color, qty }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleWishlist: (productId) =>
        dispatch({ type: "TOGGLE_WISH", productId }),
      isWishlisted: (productId) => state.wishlist.includes(productId),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      bump,
      toasts,
    };
  }, [state, drawerOpen, bump, toasts, addToCart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

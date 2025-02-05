import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase"; // Pastikan path ke firebase benar
import { collection, doc, setDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const clearLocalCart = () => {
    setCart([]);
  };

  // Muat item dari Firestore saat halaman dimuat
  const loadCartFromFirestore = async (userId) => {
    if (!userId) return;
    const cartRef = collection(db, `users/${userId}/carts`);
    const querySnapshot = await getDocs(cartRef);
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCart(items);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadCartFromFirestore(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Menyimpan item ke Firestore di dalam koleksi pengguna
  const saveToFirestore = async (item) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    const cartRef = doc(collection(db, `users/${userId}/carts`), item.id);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      await setDoc(cartRef, {
        ...item,
        quantity: cartSnap.data().quantity + item.quantity,
      }, { merge: true });
    } else {
      await setDoc(cartRef, item);
    }
  };

  // Hapus item dari Firestore
  const removeFromFirestore = async (id) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const cartRef = doc(collection(db, `users/${userId}/carts`), id);
    await deleteDoc(cartRef);
  };

  // Perbarui jumlah di Firestore
  const updateQuantityInFirestore = async (id, quantity) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const cartRef = doc(collection(db, `users/${userId}/carts`), id);
    await setDoc(cartRef, { quantity }, { merge: true });
  };

  // Tambah item ke keranjang dan Firestore
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((product) => product.id === item.id);
      if (existingProduct) {
        return prevCart.map((product) =>
          product.id === item.id
            ? { ...product, quantity: product.quantity + item.quantity }
            : product
        );
      } else {
        return [...prevCart, item];
      }
    });
    saveToFirestore(item);
  };

  // Hapus item dari keranjang dan Firestore
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    removeFromFirestore(id);
  };

  // Perbarui jumlah item di keranjang dan Firestore
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    updateQuantityInFirestore(id, quantity);
  };

  // Kosongkan seluruh keranjang di Firestore
  const clearCart = async () => {
    setCart([]);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const cartRef = collection(db, `users/${userId}/carts`);
    const querySnapshot = await getDocs(cartRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, clearLocalCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

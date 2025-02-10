import React, { useEffect, useState} from 'react';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { ThemeProvider } from './components/ThemeContext';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Signin from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Admin from './pages/adminexmple';
import ShopCr from './pages/ShopCr';
import ShopCk from './pages/ShopCk';
import Homepage from './pages/Homepage';
import Checkout from './components/Checkout';
import Navbar2 from './components/Navbar2';
import Gallery from './pages/Gallery';
import Event from './pages/Event';
import FloatingWhatsApp from './components/FloatingWhatsapp';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white text-black">
            <Navbar2 />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin2" element={<Admin />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/shopck" element={<ShopCk />} />
              <Route path="/shopcr" element={<ShopCr />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/event" element={<Event />} />
            </Routes>
            <FloatingWhatsApp />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
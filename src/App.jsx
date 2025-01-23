import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
// import Navbar from './components/Navbar';
import Signin from './pages/Login';
import UpdateProfile from './pages/UpdateProfile';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Admin from './pages/adminexmple';
import ShopCr from './pages/ShopCr';
import ShopCk from './pages/ShopCk';
import Homepage from './pages/Homepage';
import { CartProvider } from './components/CartContext';
import Checkout from './components/Checkout';
import Navbar2 from './components/Navbar2';
// import { AuthProvider } from "./components/AuthContext";
import Gallery from './pages/Gallery';
import Event from './pages/Event';

function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin2" element={<Admin/>} />
        <Route path="/user" element={<UserDashboard/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/shopck" element={<ShopCk />} />
        <Route path="/shopcr" element={<ShopCr />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/event" element={<Event />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/modern.png";
import cartIcon from "../assets/cart.png";
import userIcon from "../assets/user.png";
import product1 from "../assets/cro.jpg";
import product2 from "../assets/coo.jpg";

const Navbar2 = () => {
  const [shopPopupVisible, setShopPopupVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-white text-white py-5 px-8 flex justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-200">
      <ul className="hidden md:flex items-center justify-center space-x-6 flex-1">
        <li>
          <Link to="/" className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer">
            Home
          </Link>
        </li>
        <li>
          <Link to="/gallery" className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer">
            Gallery
          </Link>
        </li>
        <li className="relative">
                  <a href="#" className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer"
                     onMouseEnter={() => setShopPopupVisible(true)}
                     onMouseLeave={() => setShopPopupVisible(false)}>
                    Shop
                  </a>
                  {shopPopupVisible && (
                    <div className="absolute left-1/2 transform -translate-x-[72%] top-full mt-2 w-80 p-4 bg-white shadow-lg rounded-lg">
                      <div className="flex justify-between space-x-4">
                        <div className="w-32 h-32">
                          <Link to="/shopcr">
                            <img src={product1} alt="Product 1" className="w-full h-full object-cover cursor-pointer" />
                          </Link>
                        </div>
                        <div className="w-32 h-32">
                          <Link to="/shopck">
                            <img src={product2} alt="Product 2" className="w-full h-full object-cover cursor-pointer" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
        <li>
          <Link to="/event" className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer">
            Event
          </Link>
        </li>
      </ul>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <img src={cartIcon} alt="Cart" className="w-8 h-8 cursor-pointer" onClick={() => navigate("/checkout")} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <button onClick={() => navigate(user ? "/user" : "/signin")}> 
          <img src={userIcon} alt="User" className="w-8 h-8 cursor-pointer" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar2;

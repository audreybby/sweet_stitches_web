import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import menuIcon from "../assets/menu.png";
import closeIcon from "../assets/close.png";
import logo from "../assets/modern.png";
import cartIcon from "../assets/cart.png";
import userIcon from "../assets/user.png";
import product1 from "../assets/cro.jpg";
import product2 from "../assets/coo.jpg";

const Navbar2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopPopupVisible, setShopPopupVisible] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false); // New state for hover
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);

  const { cart } = useCart(); // Access cart data
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

  const handleUserClick = () => {
    if (!user) {
      navigate("/signin"); // Arahkan ke halaman login jika user belum login
    } else {
      if (role === "admin") {
        navigate("/admin2"); // Arahkan ke halaman admin jika role adalah admin
      } else {
        navigate("/user"); // Arahkan ke halaman user jika role adalah user
      }
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/checkout"); // Arahkan ke halaman checkout
    } else {
      navigate("/signin"); // Arahkan ke halaman login jika belum login
    }
  };

  const handleShopClick = (e) => {
    e.preventDefault();
    setShopPopupVisible(!shopPopupVisible);
  };

  const handleNavigation = () => {
    setMenuOpen(false); // Tutup menu saat navigasi
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShopPopupVisible(false);
        setIsShopHovered(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce function
  function debounceHover(callback, delay) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(callback, delay);
    };
  }

  const handleMouseEnter = debounceHover(() => {
    setShopPopupVisible(true);
    setIsShopHovered(true);
  }, 200); // Delay in ms

  const handleMouseLeave = debounceHover(() => {
    setShopPopupVisible(false);
    setIsShopHovered(false);
  }, 200);

  return (
    <nav
      className="bg-white text-white py-5 px-8 flex justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-200"
      style={{
        boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.8)",
        zIndex: 1000,
      }}
    >
      <div className="text-gray-600 hover:text-pink-300 text-lg font-bold absolute left-1/2 transform -translate-x-1/2 md:hidden">
        <img src={logo} alt="Logo" className="w-10 h-10 object-cover rounded-full" />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center justify-center space-x-6 flex-1">
        {["Home", "Gallery"].map((item) => (
          <li key={item}>
            <Link
              to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer"
              onClick={handleNavigation}
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              {item}
            </Link>
          </li>
        ))}

        {/* Logo between Gallery and Shop */}
        <li>
          <div>
            <img src={logo} className="w-10 h-10 object-cover rounded-full" alt="Logo" />
          </div>
        </li>

        {/* Shop Menu */}
        <li
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a
            href="#"
            className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer"
            style={{ fontFamily: "'Quintessential', cursive" }}
          >
            Shop
          </a>

          {/* Popup */}
          <div
            ref={popupRef}
            className={`absolute left-1/2 transform -translate-x-[72%] top-full mt-2 w-80 p-4 bg-white shadow-lg rounded-lg opacity-0 scale-95 transition duration-300 ease-in-out ${
              shopPopupVisible || isShopHovered
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{
              transitionProperty: "opacity, transform",
            }}
          >
            <div className="flex justify-between space-x-4">
              <div className="w-32 h-32">
                <Link to="/shopcr" onClick={() => setShopPopupVisible(false)}>
                  <img
                    src={product1}
                    alt="Product 1"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </Link>
              </div>
              <div className="w-32 h-32">
                <Link to="/shopck" onClick={() => setShopPopupVisible(false)}>
                  <img
                    src={product2}
                    alt="Product 2"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </Link>
              </div>
            </div>
          </div>
        </li>


        {["Event"].map((item) => (
          <li key={item}>
            <Link
              to={item.toLowerCase()}
              className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer"
              onClick={handleNavigation}
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* Cart and User Icons */}
      <div className="flex items-center space-x-2 md:space-x-6 absolute right-4 md:right-8">
        {/* Cart Icon with Badge */}
        <div className="relative">
          <img
            src={cartIcon}
            alt="Cart"
            onClick={handleCartClick}
            className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <button onClick={handleUserClick}>
          <img
            src={userIcon}
            alt="User"
            className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
          />
        </button>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        <img src={menuIcon} alt="Menu" className="w-6 h-6 opacity-50" />
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-[-100%]"
        } transition-transform duration-500 ease-in-out md:hidden bg-white z-50`}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4" onClick={() => setMenuOpen(false)}>
          <img src={closeIcon} alt="Close" className="w-8 h-8 opacity-30" />
        </button>

        {/* Mobile Menu Items */}
        <ul className="flex flex-col items-center space-y-6 mt-20">
          {["Home", "Gallery", "Event"].map((item) => (
            <li key={item}>
              <Link
                to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer text-lg"
                onClick={() => {
                  handleNavigation(); // Navigate
                  setMenuOpen(false); // Close menu
                }}
                style={{ fontFamily: "'Quintessential', cursive" }}
              >
                {item}
              </Link>
            </li>
          ))}
          
          {/* Shop Dropdown */}
          <li className="relative group">
            <button
              onClick={handleShopClick}
              className="text-gray-600 hover:text-pink-300 transition duration-300 cursor-pointer text-lg"
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Shop
            </button>
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 top-[calc(100%+1rem)] mt-2 w-[240px] p-4 bg-white shadow-lg rounded-lg opacity-0 transition-opacity duration-500 ease-in-out ${
                shopPopupVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
              }`}
              style={{
                transitionProperty: "opacity, transform",
              }}
            >
              <div className="space-y-4">
                <Link to="/shopcr" className="block text-gray-600 hover:text-pink-300" onClick={() => setMenuOpen(false)}>
                  Shop Crochet
                </Link>
                <Link to="/shopck" className="block text-gray-600 hover:text-pink-300" onClick={() => setMenuOpen(false)}>
                  Shop Cake
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar2;

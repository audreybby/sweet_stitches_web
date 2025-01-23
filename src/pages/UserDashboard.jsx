// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const UserDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [originalEmail, setOriginalEmail] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const db = getFirestore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setOriginalEmail(userData.email || "");
          setPhone(userData.phone || "");
          setAddress(userData.address || "");
        } else {
          await setDoc(doc(db, "users", user.uid), {
            name: "New User",
            email: user.email,
            phone: "",
            address: "",
          });
          setName("New User");
          setEmail(user.email);
          setOriginalEmail(user.email); 
        }
      }
    };

    fetchUserProfile();
  }, [db]);

  const validateForm = (formData) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.get("username")) newErrors.username = "Username is required.";
    if (!formData.get("email")) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.get("email"))) {
      newErrors.email = "Please enter a valid email address.";
    } else if (formData.get("email") !== originalEmail) {
      newErrors.email = "Email cannot be changed.";
    }
    if (!formData.get("phone")) newErrors.phone = "Phone number is required.";
    if (!formData.get("address")) newErrors.address = "Address is required.";
    return newErrors;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const updatedData = {
        name: formData.get("username"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      };

      setName(updatedData.name);
      setEmail(updatedData.email);
      setPhone(updatedData.phone);
      setAddress(updatedData.address);

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen font-poppins pt-16">
      <div className="w-full lg:w-[250px] bg-[#FFD6D6] p-5 lg:p-10 flex flex-col items-center">
        <h3 className="text-center text-[#333] mb-0 text-sm lg:text-base">{name}</h3>
        <p className="text-center text-xs lg:text-sm text-[#777]">{email}</p>

        <nav className="mt-8 w-full flex flex-col lg:block items-center lg:items-start">
          <ul className="list-none p-0 flex flex-row lg:flex-col w-full justify-center gap-4 lg:gap-0">
            <li>
              <button
                onClick={() => setActiveMenu("account")}
                className={`w-full text-left p-1 text-md lg:text-md ${
                  activeMenu === "account"
                    ? "text-[#B3114B] font-bold"
                    : "text-[#555]"
                } hover:text-[#FF8A8A]`}
                style={{ fontFamily: "'Quintessential', cursive" }}
              >
                My Account
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu("order")}
                className={`w-full text-left p-1 text-md lg:text-md ${
                  activeMenu === "order"
                    ? "text-[#B3114B] font-bold"
                    : "text-[#555]"
                } hover:text-[#FF8A8A]`}
                style={{ fontFamily: "'Quintessential', cursive" }}
              >
                My Order
              </button>
            </li>
            <LogoutButton/>
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-5 lg:p-10 bg-white">
        {activeMenu === "account" && (
          <>
            <h1
              className="text-xl lg:text-3xl mb-2"
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              My Profile
            </h1>
            <p className="text-xs lg:text-sm text-[#777] mb-8">
              Manage your profile information to control, protect, and secure your account.
            </p>
            <form className="w-full" onSubmit={handleFormSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block mb-1 font-semibold text-xs lg:text-sm"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your Username"
                  defaultValue={name}
                  className="w-full p-2 border border-gray-300 rounded-md text-xs lg:text-sm focus:border-[#FF8A8A] focus:outline-none"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-1 font-semibold text-xs lg:text-sm"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  defaultValue={email}
                  className="w-full p-2 border border-gray-300 rounded-md text-xs lg:text-sm focus:border-[#FF8A8A] focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="phone"
                  className="block mb-1 font-semibold text-xs lg:text-sm"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  defaultValue={phone}
                  className="w-full p-2 border border-gray-300 rounded-md text-xs lg:text-sm focus:border-[#FF8A8A] focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="address"
                  className="block mb-1 font-semibold text-xs lg:text-sm"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  defaultValue={address}
                  className="w-full p-10 border border-gray-300 rounded-md text-xs lg:text-sm focus:border-[#FF8A8A] focus:outline-none"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-[#FF8A8A] text-white rounded-md text-xs lg:text-sm"
              >
                Save
              </button>
            </form>
          </>
        )}

        {activeMenu === "order" && (
          <>
            <h1
              className="text-xl lg:text-3xl mb-2"
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Order Details
            </h1>
            <p className="text-xs lg:text-sm text-[#777] mb-8">
              Manage and control your orders
            </p>
            <div className="flex flex-col lg:flex-row border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-[#CCE2CB] p-5 w-full lg:w-1/2">
                <p>
                  <strong>Order ID:</strong> #23952220
                </p>
                <p>
                  <strong>Date:</strong> 22 January 2024
                </p>
                <p>
                  <strong>Total Amount:</strong> Rp150.000,00
                </p>
                <p>
                  <strong>Order Status:</strong>{" "}
                  <span className="text-green-600">Confirmed</span>
                </p>
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-center mb-3">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Brown Bear Crochet"
                    className="mr-3"
                  />
                  <div>
                    <p>Brown Bear Crochet</p>
                    <p>Rp60.000,00</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Cookies Choco"
                    className="mr-3"
                  />
                  <div>
                    <p>Cookies Choco</p>
                    <p>Rp90.000,00</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

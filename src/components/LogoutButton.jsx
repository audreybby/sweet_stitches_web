import React, { useState } from 'react';
import { auth } from '../firebase';
import { useCart } from "./CartContext";
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { clearLocalCart } = useCart();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    await auth.signOut();
    setShowModal(false);
    clearLocalCart();
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <div className="relative py-2">
      {/* Logout Button */}
      <button
        onClick={handleLogoutClick}
        className="bg-red-300 rounded px-4 p-1 text-left text-red-600 hover:text-red-100 hover:bg-red-600 transition duration-300"
        style={{ fontFamily: "'Quintessential', cursive" }}
      >
        Logout
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
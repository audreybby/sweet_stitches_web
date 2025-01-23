// eslint-disable-next-line no-unused-vars
import React from "react";
import { useCart } from "./CartContext"; 

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity } = useCart(); // Access cart data 

  const handleQuantityChange = (id, delta) => {
    updateQuantity(id, Math.max(1, delta)); // Update quantity 
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id); 
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // WhatsApp message
    const message = cart
      .map((item) => `*${item.name}* x${item.quantity} - Rp ${item.price * item.quantity}`)
      .join("%0A"); 

    const total = calculateTotal();
    const finalMessage = `Halo, Saya mau order product dari Sweet Stitches:%0A${message}%0A%0ATotal: Rp ${total}`;

    const phoneNumber = "6287716272187"; 
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${finalMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pt-16">
      {/* Header */}
      <div className="text-center py-6 mb-4">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl pt-2 font-bold text-[#c87878]"
          style={{ fontFamily: "'Quintessential', cursive" }}
        >
          Your Cart
        </h2>
      </div>

      {/* Product List */}
      <div className="flex-grow overflow-auto">
        {cart.length > 0 ? (
          <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-20">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center py-4 border-b border-gray-200"
              >
                {/* Product Image and Details */}
                <div className="flex w-full sm:w-auto">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-md"
                    />
                  </div>

                  {/* Product Name, Price, and Quantity */}
                  <div className="ml-4 flex flex-col w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                      {item.name}
                    </h2>
                    {/* Original Price */}
                    <div className="text-gray-700 font-semibold mt-2">
                      Rp {item.price}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4">
                      <button
                        className="px-2 py-1 border rounded-l bg-[#ffeeee]"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border rounded-r bg-[#ffeeee]"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="flex flex-col items-end mt-4 sm:mt-0 sm:ml-auto">
                  <button
                    className="text-red-500 hover:underline mb-2"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl text-gray-600">Your cart is empty.</h2>
            <p className="text-gray-500">Start adding items to your cart from the shop.</p>
          </div>
        )}
      </div>

      {/* Subtotal and Checkout Section */}
      <div className="bg-orange-50 px-4 sm:px-8 lg:px-20 py-6 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Subtotal */}
          <div className="relative w-full sm:w-auto">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-600 absolute left-0"
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Subtotal:
            </h2>
            {/* Adjusted margin classes */}
            <span className="text-xl font-semibold text-gray-600 ml-52 sm:ml-32 md:ml-40 lg:ml-32">
              Rp {calculateTotal()}
            </span>
          </div>

          {/* Checkout Button */}
          <button
            className="mt-4 sm:mt-0 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full sm:w-auto"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

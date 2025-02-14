import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phoneNumber: "",
    paymentMethod: "",
    shippingOption: ""
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists() && userDoc.data()) {
            setFormData(prevData => ({
              ...prevData,
              address: userDoc.data().address || "",
              phoneNumber: userDoc.data().phone || ""
            }));
          } else {
            console.warn("User data not found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user address:", error);
        }
      }
    };

    fetchUserAddress();
  }, []);

  const handleQuantityChange = (id, delta) => {
    updateQuantity(id, Math.max(1, delta));
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setShowPopup(true);
  };

  const redirectToWhatsApp = (order) => {
    const ownerNumber = "6281393716998";
    const message = `Halo, saya ingin mengkonfirmasi order berikut:%0A%0A` +
      `🆔 Order ID: ${order.id}%0A` +
      `💰 Total: Rp${order.total}%0A` +
      `📦 Status: ${order.status}%0A%0A` +
      `Detail Items:%0A` +
      order.items.map(item => `- ${item.name} (Rp${item.price})`).join("%0A") +
      `%0A%0AMohon konfirmasinya, terima kasih!`;
  
    const whatsappURL = `https://wa.me/${ownerNumber}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };
  
  const handleSubmitOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (!formData.address || !formData.phoneNumber || !formData.paymentMethod || !formData.shippingOption) {
      alert("Please fill in all details.");
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: calculateTotal(),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        paymentMethod: formData.paymentMethod,
        shippingOption: formData.shippingOption,
        status: "Menunggu Konfirmasi",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      clearCart();
      setShowPopup(false);
      redirectToWhatsApp(orderData);
      alert("Order berhasil dibuat! Admin akan segera menghubungi Anda.");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Terjadi kesalahan saat menyimpan order.");
    }
  };

  const formatPrice = (price) => {
    return `Rp ${parseInt(price).toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pt-16">
      <div className="text-center py-6 mb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl pt-2 font-bold text-[#c87878]" style={{ fontFamily: "'Quintessential', cursive" }}>
          Your Cart
        </h2>
      </div>

      <div className="flex-grow overflow-auto">
        {cart.length > 0 ? (
          <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-20">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center py-4 border-b border-gray-200">
                <div className="flex w-full sm:w-auto">
                  <div className="flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-md" />
                  </div>
                  <div className="ml-4 flex flex-col w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{item.name}</h2>
                    <div className="text-gray-700 font-semibold mt-2">{formatPrice(item.price)}</div>
                    <div className="flex items-center mt-4">
                      <button className="px-2 py-1 border rounded-l bg-[#ffeeee]" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                      <span className="px-4">{item.quantity}</span>
                      <button className="px-2 py-1 border rounded-r bg-[#ffeeee]" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-4 sm:mt-0 sm:ml-auto">
                  <button className="text-red-500 hover:underline mb-2" onClick={() => handleRemoveItem(item.id)}>Remove</button>
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

      <div className="bg-pink-50 px-4 sm:px-8 lg:px-20 py-6 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="relative w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">Subtotal:</h2>
            <span className="text-xl font-semibold text-gray-600">Rp {calculateTotal()}</span>
          </div>
          <button className="mt-4 sm:mt-0 px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-600 w-full sm:w-auto" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <input type="text" placeholder="Alamat" className="w-full mb-2 p-2 border" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <input type="text" placeholder="Nomor Telepon" className="w-full mb-2 p-2 border" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
            <select className="w-full mb-2 p-2 border" onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
              <option value="">Metode Pembayaran</option>
              <option value="Cash">Cash (COD)</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <select className="w-full mb-2 p-2 border" onChange={(e) => setFormData({ ...formData, shippingOption: e.target.value })}>
              <option value="">Opsi Pengiriman</option>
              <option value="COD">COD</option>
              <option value="Jasa Kirim">Jasa Pengiriman</option>
              <option value="Ambil di toko">Ambil di Toko</option>
            </select>
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={handleSubmitOrder}>Confirm</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
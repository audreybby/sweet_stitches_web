// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import bgImage from "../assets/2.jpg"; 
import product1 from "../assets/cro.jpg"; 
import product2 from "../assets/croo.jpg";
import product3 from "../assets/cro.jpg";
import product4 from "../assets/croo.jpg";
import product5 from "../assets/cro.jpg";
import product6 from "../assets/croo.jpg";
import product7 from "../assets/cro.jpg";
import product8 from "../assets/croo.jpg";
import cake1 from "../assets/coo.jpg";
import cake2 from "../assets/cooo.jpg";
import cake3 from "../assets/coo.jpg";
import cake4 from "../assets/cooo.jpg";
import cake5 from "../assets/coo.jpg";
import cake6 from "../assets/cooo.jpg";
import closeIcon from "../assets/close.png";
import leftArrow from "../assets/panahkiri.png"; 
import rightArrow from "../assets/panahkanan.png";
import Footer from "../components/Footer";

const Event = () => {
  const TABS = {
    CROCHET: "Crochet",
    CAKE: "Cake",
  };

  const crochetProducts = [
    { id: 1, image: product1, name: "Crochet Hat", price: "Rp. 150000" },
    { id: 2, image: product2, name: "Heart Sweater", price: "Rp. 200000" },
    { id: 3, image: product3, name: "Crochet Penguin", price: "Rp. 75000" },
    { id: 4, image: product4, name: "Crochet Tote Bag", price: "Rp. 180000" },
    { id: 5, image: product5, name: "Rainbow Scarf", price: "Rp. 100000" },
    { id: 6, image: product6, name: "Cozy Socks", price: "Rp. 50000" },
    { id: 7, image: product7, name: "Crochet Blanket", price: "Rp. 250000" },
    { id: 8, image: product8, name: "Winter Beanie", price: "Rp. 120000" },
  ];

  const cakeProducts = [
    { id: 1, image: cake1, name: "Chocolate Cake", price: "Rp. 300000" },
    { id: 2, image: cake2, name: "Vanilla Cupcake", price: "Rp. 50000" },
    { id: 3, image: cake3, name: "Red Velvet Cake", price: "Rp. 350000" },
    { id: 4, image: cake4, name: "Rainbow Cake", price: "Rp. 400000" },
    { id: 5, image: cake5, name: "Cheesecake", price: "Rp. 250000" },
    { id: 6, image: cake6, name: "Fruit Tart", price: "Rp. 200000" },
  ];

  const [activeTab, setActiveTab] = useState(TABS.CROCHET);
  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false); // State for success notification
  const { addToCart } = useCart();

  const products = activeTab === TABS.CROCHET ? crochetProducts : cakeProducts;
  const displayedProducts = products.slice(startIndex, startIndex + 3);

  const nextProducts = () => {
    if (startIndex + 3 < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevProducts = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };


  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({ ...selectedProduct, quantity });
      setIsModalOpen(false);
      setShowSuccess(true); // Show success notification
      setTimeout(() => {
        setShowSuccess(false); // Hide the success notification after 3 seconds
      }, 3000);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-[660px] flex flex-col justify-center items-center relative mb-2"
      >
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
          <h1 className="text-[#ad5d54] text-4xl sm:text-6xl font-bold text-center"
            style={{ fontFamily: "'Quintessential', cursive" }}
            >
            Christmas
          </h1>
        </div>
        <div className="w-full h-[600px] flex opacity-70 justify-center items-center overflow-hidden relative">
          <img
            src={bgImage}
            alt="Decorative Background"
            className="object-cover w-[90%] h-full rounded-3xl"
          />
        </div>
      </section>

      {/* Tabs Section */}
      <div className="w-full flex justify-center items-center py-2 bg-white">
        <div className="relative flex border-[1px] border-gray-300 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-32 bg-[#f28c8c] rounded-full transition-transform duration-300 ease-in-out`}
            style={{
              transform: activeTab === TABS.CROCHET ? "translateX(0)" : "translateX(100%)",
            }}
          ></div>
          <button
            onClick={() => setActiveTab(TABS.CROCHET)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${
              activeTab === TABS.CROCHET ? "text-white" : "text-gray-600"
            }`}
          >
            {TABS.CROCHET}
          </button>
          <button
            onClick={() => setActiveTab(TABS.CAKE)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${
              activeTab === TABS.CAKE ? "text-white" : "text-gray-600"
            }`}
          >
            {TABS.CAKE}
          </button>
        </div>
      </div>

      {/* Product Section */}
      <section id="event" className="w-full bg-white py-6">
        <div className="container mx-auto px-4 mt-4 sm:mb-32">
          {/* Desktop View */}
          <div className="hidden sm:flex gap-8 items-center justify-center relative">
            <button
              onClick={prevProducts}
              className="hover:text-[#e85c5c] absolute left-[-60px] z-20"
              disabled={startIndex === 0}
            >
              <img
                src={leftArrow}
                alt="Left Arrow"
                className="w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
              />
            </button>
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="w-[350px] sm:w-[500px] h-[500px] bg-white rounded-lg p-4"
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image}
                  alt={`Product ${product.id}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold">{product.name}</p>
                  <p className="inline-block text-lg text-[#e85c5c] font-bold mt-2 border-2 border-[#ffc0c0] rounded-full px-2 py-1">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
            <button
              onClick={nextProducts}
              className="hover:text-[#e85c5c] absolute right-[-60px] z-20"
              disabled={startIndex + 3 >= products.length}
            >
              <img
                src={rightArrow}
                alt="Right Arrow"
                className="w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
              />
            </button>
          </div>

          {/* Mobile View */}
          <div className="block sm:hidden grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full h-[300px] bg-white rounded-lg p-2"  // Increased height for larger product size
              >
                <img
                  src={product.image}
                  alt={`Product ${product.id}`}
                  className="w-full h-[200px] object-cover rounded-md"  // Increased image height for larger product image
                />
                <div className="mt-4 text-center">
                  <p className="text-base font-semibold">{product.name}</p>
                  <p className="inline-block text-sm text-[#e85c5c] font-bold mt-2 border-2 border-[#ffc0c0] rounded-full px-2 py-1">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Popup */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed bottom-0 left-0 w-full bg-white z-50 p-4 rounded-t-2xl h-[60vh] sm:h-[50vh] md:h-[50vh] lg:h-[50vh]"
        >
          <div className="relative flex items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-0"
            >
              <img
                src={closeIcon}
                alt="Close"
                className="w-8 h-8 opacity-30 hover:opacity-100"
              />
            </button>

            {/* Responsive Product Image */}
            <div className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-md mr-4 mt-16">
              <img
                src={selectedProduct.image}
                alt={`Product ${selectedProduct.id}`}
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            <div className="flex flex-col w-full">
              {/* Product Name and Price */}
              <div className="flex flex-col sm:flex-row justify-between items-start mt-16">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="text-lg text-gray-600 mt-2 sm:mt-0">Rp {selectedProduct.price}</p>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Here you can describe the product&apos;s features, benefits, and anything else that would help the customer make a decision.
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="mt-4 flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 bg-[#ffeeee] rounded-md mr-2"
                >
                  -
                </button>
                <span className="text-xl">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 bg-[#ffeeee] rounded-md ml-2"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Subtotal Section with Border */}
          <div className="mt-2 text-lg font-semibold flex items-center justify-between border-t pt-2">
            <span className="text-gray-600">Subtotal:</span>
            <div className="flex items-center">
              <span className="text-gray-600">Rp </span>
              <span className="text-black">{subtotal}</span>
            </div>
          </div>

          {/* Cart Button */}
          <div className="mt-6 text-center absolute bottom-4 left-4 right-4">
            <button
              onClick={handleAddToCart} // Update this button to call handleAddToCart
              className="w-full py-2 bg-[#c87878] text-white font-semibold rounded-full"
            >
              Tambah Keranjang
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg border border-gray-300 w-64 text-center">
            <p className="text-gray-500 font-bold text-lg">Berhasil masuk keranjang!</p>
          </div>
        </div>
      )}    

      <Footer/>        
    </div>
  );
};

export default Event;

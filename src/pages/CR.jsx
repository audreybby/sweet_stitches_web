// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useCart } from "./CartContext";
import bgImage from "../assets/bgg.jpg";
import product1 from "../assets/cro.jpg";
import product2 from "../assets/croo.jpg";
import product3 from "../assets/cro.jpg";
import product4 from "../assets/croo.jpg";
import product5 from "../assets/cro.jpg";
import product6 from "../assets/croo.jpg";
import product7 from "../assets/cro.jpg";
import product8 from "../assets/croo.jpg";
import leftArrow from "../assets/kirii.png";
import rightArrow from "../assets/kanann.png";
import closeIcon from "../assets/close.png";

const Shop = () => {
  const products = [
    { id: 1, image: product1, name: "Product 1", price: 100000 },
    { id: 2, image: product2, name: "Product 2", price: 150 },
    { id: 3, image: product3, name: "Product 3", price: 200 },
    { id: 4, image: product4, name: "Product 4", price: 250 },
    { id: 5, image: product5, name: "Product 5", price: 300 },
    { id: 6, image: product6, name: "Product 6", price: 350 },
    { id: 7, image: product7, name: "Product 7", price: 400 },
    { id: 8, image: product8, name: "Product 8", price: 450 },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false); // State for success notification
  const { addToCart } = useCart();

  const nextProducts = () => {
    if (startIndex < products.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevProducts = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const displayedProductsDesktop = products.slice(startIndex, startIndex + 3);

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
    <div>
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen w-full flex justify-center items-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-pink-500 opacity-20 z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent z-15"></div>
        <h2
          className="text-5xl sm:text-8xl md:text-9xl text-white z-20 text-center px-4"
          style={{ fontFamily: "'Quintessential', cursive" }}
        >
          <span className="block sm:inline">Crochet</span>
        </h2>
      </section>

      {/* Product Section */}
      <section id="shop" className="min-h-screen w-full bg-white py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#c87878] font-[Quintessential] mb-10">
            Products
          </h1>
        </div>

        <div className="container mx-auto px-4 mt-8">

      {/* Produk - Mobile */}
      <div className="sm:hidden grid grid-cols-2 gap-4 overflow-y-auto pb-4 relative">
       {/* Products for Mobile */}
         {products.map((product) => (
      <div
         key={product.id}
         className="w-50 h-60 bg-white object-cover hover:scale-100 transition-transform rounded-lg p-1 cursor-pointer"
         onClick={() => openModal(product)}
       >
      <img
        src={product.image}
        alt={`Product ${product.id}`}
        className="w-full h-full object-cover rounded-md"
        />
       </div>
     ))}
      </div>

          {/* Produk - Desktop */}
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

            {displayedProductsDesktop.map((product) => (
              <div
                key={product.id}
                className="w-[350px] sm:w-[500px] h-[500px] bg-white rounded-lg p-4 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image}
                  alt={`Product ${product.id}`}
                  className="w-full h-full object-cover rounded-md"
                />
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
    </div>
  );
};

export default Shop;

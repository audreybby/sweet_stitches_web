// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import bgImage from "../assets/2.jpg"; // Pastikan path ke file benar
import product1 from "../assets/cro.jpg"; // Ganti dengan path gambar Anda
import product2 from "../assets/croo.jpg";
import product3 from "../assets/cro.jpg";
import product4 from "../assets/croo.jpg";
import product5 from "../assets/cro.jpg";
import product6 from "../assets/croo.jpg";
import product7 from "../assets/cro.jpg";
import product8 from "../assets/croo.jpg";
import leftArrow from "../assets/panahkiri.png"; // Ganti dengan path ke ikon panah kiri
import rightArrow from "../assets/panahkanan.png"; // Ganti dengan path ke ikon panah kanan

const Event = () => {
  const TABS = {
    CROCHET: "Crochet",
    CAKE: "Cake",
  };

  const crochetProducts = [
    { id: 1, image: product1, name: "Colorful Crochet Hat", price: "Rp150.000" },
    { id: 2, image: product2, name: "Heart Sweater", price: "Rp200.000" },
    { id: 3, image: product3, name: "Crochet Penguin", price: "Rp75.000" },
    { id: 4, image: product4, name: "Crochet Tote Bag", price: "Rp180.000" },
    { id: 5, image: product5, name: "Rainbow Scarf", price: "Rp100.000" },
    { id: 6, image: product6, name: "Cozy Socks", price: "Rp50.000" },
    { id: 7, image: product7, name: "Crochet Blanket", price: "Rp250.000" },
    { id: 8, image: product8, name: "Winter Beanie", price: "Rp120.000" },
  ];

  const [activeTab, setActiveTab] = useState(TABS.CROCHET);
  const [startIndex, setStartIndex] = useState(0);

  const displayedProducts = crochetProducts.slice(startIndex, startIndex + 3);

  const nextProducts = () => {
    if (startIndex + 3 < crochetProducts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevProducts = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center items-center relative mb-4"
      >
        {/* Background Image */}
        <div className="w-full h-[600px] flex justify-center items-center overflow-hidden">
          <img
            src={bgImage}
            alt="Decorative Background"
            className="object-cover w-[90%] h-full rounded-3xl"
          />
        </div>
      </section>

      {/* Tabs Section */}
      <div className="w-full flex justify-center items-center py-4 bg-white">
        <div className="relative flex border-[1px] border-gray-300 rounded-full overflow-hidden">
          {/* Active Background Animation */}
          <div
            className={`absolute top-0 left-0 h-full w-32 bg-[#f28c8c] rounded-full transition-transform duration-300 ease-in-out`}
            style={{
              transform: activeTab === TABS.CROCHET ? "translateX(0)" : "translateX(100%)",
            }}
          ></div>

          {/* Crochet Tab */}
          <button
            onClick={() => setActiveTab(TABS.CROCHET)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${
              activeTab === TABS.CROCHET ? "text-white" : "text-gray-600"
            }`}
            aria-pressed={activeTab === TABS.CROCHET}
          >
            {TABS.CROCHET}
          </button>

          {/* Cake Tab */}
          <button
            onClick={() => setActiveTab(TABS.CAKE)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${
              activeTab === TABS.CAKE ? "text-white" : "text-gray-600"
            }`}
            aria-pressed={activeTab === TABS.CAKE}
          >
            {TABS.CAKE}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <section className="min-h-[30vh] flex flex-col justify-center items-center">
        {activeTab === TABS.CROCHET ? (
          <div>
            {/* Product Carousel Section */}
            <div className="container mx-auto px-4 mt-8 flex items-center justify-center">
              {/* Left Arrow */}
              <button
                onClick={prevProducts}
                className="hover:text-[#e85c5c] mr-4"
                disabled={startIndex === 0}
              >
                <img
                  src={leftArrow}
                  alt="Left Arrow"
                  className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
                />
              </button>

              {/* Products */}
              <div className="flex justify-center gap-8">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-72 h-auto bg-white rounded-lg p-4 transition-transform duration-500 ease-in-out transform flex flex-col items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-md"
                    />
                    {/* Nama Produk */}
                    <p className="text-lg font-semibold mt-4">{product.name}</p>
                    {/* Harga Produk dengan Border */}
                    <p className="text-lg text-[#e85c5c] font-bold mt-2 border-2 border-[#ffc0c0] rounded-full px-2 py-1">
                      {product.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextProducts}
                className="hover:text-[#e85c5c] ml-4"
                disabled={startIndex + 3 >= crochetProducts.length}
              >
                <img
                  src={rightArrow}
                  alt="Right Arrow"
                  className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity opacity-50"
                />
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-4xl font-bold">Cake Products Coming Soon!</h1>
        )}
      </section>
    </div>
  );
};

export default Event;

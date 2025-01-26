import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Pastikan path firebase sesuai
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCart } from "../components/CartContext"; // Pastikan hook cart sesuai
import bgImage from "../assets/bgg.jpg";
import leftArrow from "../assets/panahkiri.png";
import rightArrow from "../assets/panahkanan.png";
import closeIcon from "../assets/close.png";

const ShopCr = () => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  // Fetch products from Firestore based on category "crochet"
  useEffect(() => {
    const fetchCrochetProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", "crochet"));
        const querySnapshot = await getDocs(q);
        const crochetProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(crochetProducts);
      } catch (error) {
        console.error("Error fetching crochet products:", error);
      }
    };

    fetchCrochetProducts();
  }, []);

  const displayedProducts = products.slice(startIndex, startIndex + 3);

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
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen w-full flex justify-center items-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-pink-600 opacity-20 z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent z-15"></div>
        <h2
          className="text-6xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-[10rem] text-white z-20 text-center px-4"
          style={{ fontFamily: "'Quintessential', cursive" }}
        >
          <span className="block sm:inline">Crochet</span>
        </h2>
      </section>

      {/* Product Section */}
      <section id="shop" className="min-h-screen w-full bg-white py-12">
        <div className="text-center pt-16">
          <h1 className="text-5xl font-bold text-[#c87878] font-[Quintessential] mb-4">
            Products
          </h1>
        </div>

        <div className="container mx-auto px-4 mt-8">
          {/* Mobile Product Carousel */}
          <div className="sm:hidden grid grid-cols-2 gap-4 overflow-y-auto pb-4 relative">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-50 h-60 bg-white object-cover hover:scale-100 transition-transform rounded-lg p-1 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <h2>{product.name}</h2>
                <p>Rp {product.price}</p>
              </div>
            ))}
          </div>

          {/* Desktop Product Carousel */}
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
                className="w-[350px] sm:w-[500px] h-[500px] bg-white rounded-lg p-4 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <h2>{product.name}</h2>
                <p>Rp {product.price}</p>
              </div>
            ))}

            <button
              onClick={nextProducts}
              className="hover:text-[#e85c5c] absolute right-[-60px] z-20"
              disabled={startIndex >= products.length - 3}
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

      {/* Cart Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed bottom-0 left-0 w-full bg-white z-50 p-4 rounded-t-2xl">
          <button onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-5">
          <img
                src={closeIcon}
                alt="Close"
                className="w-8 h-8 opacity-30 hover:opacity-100"
              />
          </button>

          <div className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-md mr-4 mt-16">
              <img
                src={selectedProduct.image}
                alt={`Product ${selectedProduct.id}`}
                className="w-full h-full object-contain rounded-md"
              />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
            <p className="text-lg">Rp {selectedProduct.price}</p>
            <div className="flex mt-4 items-center">
              <button onClick={decrementQuantity} className="px-4 py-2 bg-[#ffeeee] rounded-md mr-2">
                -
              </button>
              <span className="text-xl">{quantity}</span>
              <button onClick={incrementQuantity} className="px-4 py-2 bg-[#ffeeee] rounded-md ml-2">
                +
              </button>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">Subtotal: Rp {subtotal}</p>
            </div>
            <button onClick={handleAddToCart} className="w-full mt-4 py-2 bg-[#c87878] text-white font-bold rounded-lg">
              Tambahkan ke Keranjang
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

export default ShopCr;

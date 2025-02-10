import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useCart } from "../components/CartContext";
import bgImage from "../assets/bg.jpg";
import leftArrow from "../assets/panahkiri.png";
import rightArrow from "../assets/panahkanan.png";
import closeIcon from "../assets/close.png";
import Footer from "../components/Footer";

const Event = () => {
  const TABS = {
    CROCHET: "Crochet",
    CAKE: "Cake",
  };

  const [activeTab, setActiveTab] = useState(TABS.CROCHET);
  const [startIndex, setStartIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventCollection);
        const eventList = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchEventName = async () => {
        try {
            const docRef = doc(db, "events", "eventName");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setEventName(docSnap.data().name);
            }
        } catch (error) {
            console.error("Error fetching event name:", error);
        }
    };

    fetchEventName();
  }, []);

  const filteredProducts = events.filter(
    (event) => event.category && event.category.toLowerCase() === activeTab.toLowerCase()
  );  

  const displayedProducts = filteredProducts.slice(startIndex, startIndex + 3);

  const nextProducts = () => {
    if (startIndex < filteredProducts.length - 3) {
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

 const subtotal = selectedProduct ? parseInt(selectedProduct.price.replace(/\D/g, ""), 10) * quantity : 0;


const handleAddToCart = () => {
  if (selectedProduct) {
    const productPrice = parseInt(selectedProduct.price.replace(/\D/g, ""), 10);
    addToCart({ ...selectedProduct, price: productPrice, quantity });
    setIsModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }
};

  const formatPrice = (price) => {
    return `Rp ${parseInt(price).toLocaleString("id-ID")}`;
  };

  return (
    <div className="pt-16">
      <section id="hero" className="min-h-[660px] flex flex-col justify-center items-center relative">
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
          <h1 className="text-[#ad5d54] text-4xl sm:text-6xl font-bold text-center"
            style={{ fontFamily: "'Quintessential', cursive" }}>
            { eventName }
          </h1>
        </div>
        <div className="w-full h-[600px] flex opacity-70 justify-center items-center overflow-hidden relative">
          <img src={bgImage} alt="Decorative Background" className="object-cover w-[90%] h-full rounded-3xl" />
        </div>
      </section>

      <div className="w-full flex justify-center items-center py-2 bg-white">
        <div className="relative flex border-[1px] border-gray-300 rounded-full overflow-hidden">
          <div className={`absolute top-0 left-0 h-full w-32 bg-[#f28c8c] rounded-full transition-transform duration-300 ease-in-out`}
            style={{
              transform: activeTab === TABS.CROCHET ? "translateX(0)" : "translateX(100%)",
            }}>
          </div>
          <button onClick={() => setActiveTab(TABS.CROCHET)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${activeTab === TABS.CROCHET ? "text-white" : "text-gray-600"}`}>
            {TABS.CROCHET}
          </button>
          <button onClick={() => setActiveTab(TABS.CAKE)}
            className={`relative z-10 px-6 py-2 font-semibold text-lg w-32 transition-all duration-300 ${activeTab === TABS.CAKE ? "text-white" : "text-gray-600"}`}>
            {TABS.CAKE}
          </button>
        </div>
      </div>

      <section id="event" className="w-full bg-white py-6">
        <div className="container mx-auto px-4 mt-8 pb-36">

          <div className="hidden sm:flex gap-8 items-center justify-center relative">
            <button onClick={prevProducts} className="absolute left-[-60px] z-20" disabled={startIndex === 0}>
              <img src={leftArrow} alt="Left Arrow" className="w-16 h-16 cursor-pointer hover:opacity-80 opacity-50" />
            </button>

            {displayedProducts.map((product) => (
              <div key={product.id} className="w-[350px] sm:w-[500px] h-[500px] bg-white rounded-lg p-4" onClick={() => openModal(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="inline-block text-lg text-[#e85c5c] font-bold mt-2 border-2 border-[#ffc0c0] rounded-full px-2 py-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}

            <button onClick={nextProducts} className="absolute right-[-60px] z-20" disabled={startIndex + 3 >= filteredProducts.length}>
              <img src={rightArrow} alt="Right Arrow" className="w-16 h-16 cursor-pointer hover:opacity-80 opacity-50" />
            </button>
          </div>

          <div className="sm:hidden grid grid-cols-2 gap-4 overflow-y-auto pb-4 relative">
            {filteredProducts.map((product) => (
              <div key={product.id} className="w-50 h-60 bg-white object-cover hover:scale-100 transition-transform rounded-lg p-1 cursor-pointer pb-16" onClick={() => openModal(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
                <div className="mt-1 text-center">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-[#e85c5c] font-bold">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer/>

       {isModalOpen && selectedProduct && (
        <div
          className="fixed bottom-0 left-0 w-full bg-white z-50 p-4 rounded-t-2xl h-[60vh] sm:h-[50vh] md:h-[50vh] lg:h-[50vh]"
        >
          <div className="relative flex items-center">
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

            <div className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-md mr-4 mt-16">
              <img
                src={selectedProduct.image}
                alt={`Product ${selectedProduct.id}`}
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            <div className="flex flex-col w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start mt-16">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <p className="text-lg text-gray-600 mt-2 sm:mt-0">{formatPrice(selectedProduct.price)}</p>

              </div>

              {/* <div className="mt-4 text-sm text-gray-500">
                <p>
                  Here you can describe the product&apos;s features, benefits, and anything else that would help the customer make a decision.
                </p>
              </div> */}

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

          <div className="mt-2 text-lg font-semibold flex items-center justify-between border-t pt-2">
            <span className="text-gray-600">Subtotal:</span>
            <div className="flex items-center">
              <span className="text-black">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 text-center absolute bottom-4 left-4 right-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-[#c87878] text-white font-semibold rounded-full"
            >
              Tambah Keranjang
            </button>
          </div>
        </div>
      )}

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

export default Event;

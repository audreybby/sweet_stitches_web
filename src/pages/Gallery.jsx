import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";

const Gallery = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, "reviews");
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsList = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Open pop-up with selected review
  const openPopup = (review) => {
    setSelectedReview(review);
  };

  // Close pop-up
  const closePopup = () => {
    setSelectedReview(null);
  };

  return (
    <div className="pt-16">
      <div className="text-center py-6">
        <h2
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl pt-2 font-bold text-[#c87878]"
          style={{ fontFamily: "'Quintessential', cursive" }}
        >
          Gallery Of Latest Reviews
        </h2>
      </div>

      {/* Gallery Section */}
      <div className="p-6 bg-white">
        <div
          className="columns-2 sm:columns-3 lg:columns-3 gap-0"
          style={{ columnGap: "0px" }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="mb-4 break-inside-avoid px-2 relative"
              onClick={() => openPopup(review)} // Open popup on click
            >
              <div className="relative group cursor-pointer">
                {/* Image */}
                <img
                  src={review.image}
                  alt={review.description || `Image ${index}`}
                  className="w-full h-auto object-cover rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-white opacity-5 rounded-lg group-hover:opacity-0 transition-opacity duration-300"></div>

                {/* Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white bg-opacity-75 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-full">
                  <h3 className="text-sm sm:text-lg font-semibold text-[#333] truncate">
                    {review.description}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-24">
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
            >
              ✕
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-1/2 w-full flex justify-center items-center mb-4 lg:mb-0">
                <img
                  src={selectedReview.image}
                  alt={selectedReview.description}
                  className="w-full h-auto max-w-md rounded-lg"
                />
              </div>

              {/* Description */}
              <div className="lg:w-1/2 w-full p-4 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#c87878] mb-4">
                  Review Description
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base leading-relaxed"
                  style={{ wordWrap: "break-word" }}
                >
                  {selectedReview.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
};

export default Gallery;

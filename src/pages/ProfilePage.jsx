import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div className="text-center mt-6">
    <span className="text-gray-500">
      <Link to="/updateprofile" className="underline text-[#873930] hover:text-[#a34a40]">
        Edit Profile
      </Link>
    </span>
  </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-purple-400 min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Profile Page</h1>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Username:</label>
          <p className="text-gray-800">{profileData.username}</p>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Email:</label>
          <p className="text-gray-800">{profileData.email}</p>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Address:</label>
          <p className="text-gray-800">{profileData.address}</p>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Phone Number:</label>
          <p className="text-gray-800">{profileData.phoneNumber}</p>
        </div>

        <div className="text-center mt-6">
        <button className="text-gray-500">
          <Link to="/updateprofile" className="underline text-black hover:text-gray-700">
            Edit Profile
          </Link>
        </button>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
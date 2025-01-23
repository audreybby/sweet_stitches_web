import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, updateEmail, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    username: "",
    profilePicture: "",
    address: "",
    phoneNumber: "",
    email: "",
    role: "user"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateEmail(user, profileData.email);
        await updateProfile(user, { displayName: profileData.username });
        await setDoc(doc(db, "users", user.uid), profileData);

        alert("Profile updated successfully!");

        navigate('/profile');
      } catch (error) {
        console.error("Error updating profile: ", error);
        alert("Failed to update profile");
      }
    }
  };

  return (
    <div className="items-center flex flex-col space-y-8">
      <h1>User Profile</h1>

      <label> 
        Username:
        <input
          type="text"
          className="border border-gray-600 rounded px-1 py-1"
          value={profileData.username}
          onChange={(e) =>
            setProfileData({ ...profileData, username: e.target.value })
          }
        />
      </label>

      <label>
        Address:
        <input
          type="text"
          className="border border-gray-600 rounded px-1 py-1"
          value={profileData.address}
          onChange={(e) =>
            setProfileData({ ...profileData, address: e.target.value })
          }
        />
      </label>

      <label>
        Phone Number:
        <input
          type="text"
          className="border border-gray-600 rounded px-1 py-1"
          value={profileData.phoneNumber}
          onChange={(e) =>
            setProfileData({ ...profileData, phoneNumber: e.target.value })
          }
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          className="border border-gray-600 rounded px-1 py-1"
          value={profileData.email}
          onChange={(e) =>
            setProfileData({ ...profileData, email: e.target.value })
          }
        />
      </label>

      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default UpdateProfile;

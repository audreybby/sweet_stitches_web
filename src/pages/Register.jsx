import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: new Date()
      });

      navigate('/signin');
      alert("User Registered");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#873930]">Register</h2>
        <form>
          <input
            type='email'
            placeholder='email'
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa095]"
          />
          <input
            type='password'
            placeholder='password'
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:ou only:tline-none focus:ring-2 focus:ring-[#ffa095]"
          />
          <button
            type="submit"
            className="w-full p-3 text-base bg-[#f6867a] text-white rounded-full hover:bg-[#e77a6d] transition mb-3"
            onClick={handleSignup}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

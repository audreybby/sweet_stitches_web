import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import GoogleIcon from '../assets/Google.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          navigate('/admin2');
        } else {
          navigate('/user');
        }
      } else {
        throw new Error("User data not found in Firestore");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const GoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
  
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          navigate('/admin2');
        } else {
          navigate('/user');
        }
      } else {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName,
          role: "user",
          createdAt: new Date(),
        });
  
        navigate('/user');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#873930]">Login</h2>
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
            className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa095]"
          />
          <button
            type="submit"
            className="w-full p-3 text-base bg-[#f6867a] text-white rounded-full hover:bg-[#e77a6d] transition mb-3"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="flex items-center justify-center w-auto px-5 py-2.5 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition mx-auto"
            onClick={GoogleLogin}
          >
            <img
              src={GoogleIcon}
              alt="Google Icon"
              className="w-5 h-5 mr-2"
            />
            <span className="text-gray-500">Login with Google</span>
          </button>
        </div>

        <div className="text-center mt-6">
          <span className="text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline text-[#873930] hover:text-[#a34a40]">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signin;

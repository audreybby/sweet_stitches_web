import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
import { Timestamp, addDoc, collection } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const userSignupFunct = async (e) => {
    e.preventDefault();
    if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
      toast.error("All fields are required!");
      return;
    }

    try {
      const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

      const user = {
        name: userSignup.name,
        email: users.user.email,
        uid: users.user.uid,
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleString(
              "en-US",
              {
              month: "short",
              day: "2-digit",
              year: "numeric",
              }
          )
      }

      const userRefrence = collection(db, "users");

      await addDoc(userRefrence, user);

      setUserSignup({
        name: "",
        email: "",
        password: ""
      })
      toast.success("Signup Successfully")
      navigate('/signin')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#873930]">Register</h2>
      <form>
      <input
          type="text"
          placeholder='name'
          value={userSignup.name}
          onChange={(e) => setUserSignup({
            ...userSignup,
            name: e.target.value})}
          className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa095]"
      />
      <input
          type="text"
          placeholder='email'
          value={userSignup.email}
          onChange={(e) => setUserSignup({
            ...userSignup,
            email: e.target.value})}
          className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa095]"
      />
      <input
          type='password'
          placeholder='password'
          value={userSignup.password}
          onChange={(e) => setUserSignup({
            ...userSignup,
            password: e.target.value})}
          className="w-full p-3 mb-6 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa095]"
      />
        <button
          type="submit"
          className="w-full p-3 text-base bg-[#f6867a] text-white rounded-full hover:bg-[#e77a6d] transition mb-3"
          onClick={userSignupFunct}
        >
          Register
        </button>
      </form>
    </div>
  </div>
  );
};

export default Register;
import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./index.css";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registration successful! Now you can login.");
    } catch (error) {
      let customMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        customMessage = "This email is already registered. Try logging in.";
      } else if (error.code === "auth/weak-password") {
        customMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/invalid-email") {
        customMessage = "Invalid email format. Please check and try again.";
      }

      toast.error(customMessage);
    }
  };


// const handleRegister = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//     //   setMessage("Registration successful! You can now login.");
//      toast.success("Registration successful! Now you can login.");
//     } catch (error) {
//     //   setMessage(error.message);
//     toast.error("Registration failed: " + error.message);
//     }
//   };



  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-5">
      <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (6+ chars)"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
      >
        Register
      </button>
    </form>
  );
}

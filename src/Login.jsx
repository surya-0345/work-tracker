import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./index.css"; 
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";


export default function Login({ onLogin, setShowForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      onLogin(token);
    //   setMessage("Login successful!");
    toast.success("Login successful!");
    } catch (error) {
    //   setMessage(error.message);
    toast.error("Login failed: " + error.message);
    }
  };

  return (

    <form onSubmit={handleLogin} className="flex flex-col space-y-5">
      <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        // className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition"

      >
        Login
      </button>
      {message && (
        <p
          className={`text-center ${
            message === "Login successful!" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>

      )}

      {/* 👇 Forgot Password link */}
      <p
        className="text-sm text-blue-700 text-center mt-3 cursor-pointer hover:underline"
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot Password?
      </p>
    </form>

  );
}

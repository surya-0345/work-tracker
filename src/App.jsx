import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import AdminPage from "./AdminPage";


import "./index.css"; 
import { Toaster } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import toast from "react-hot-toast"; 



export default function App() {
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

const [userEmail, setUserEmail] = useState(null);
const [showForgotPassword, setShowForgotPassword] = useState(false);



const handleLogin = (idToken) => {
  const user = auth.currentUser;
  if (user) {
    setToken(idToken);
    setUserEmail(user.email); // ✅ Save user's email here
    console.log("Logged in as:", user.email);
  }
};





  // const handleLogin = (idToken) => {
  //   setToken(idToken);
  //   console.log("Firebase ID Token:", idToken);
  // };



  // const handleLogout = () => {
  //   setToken(null);
  //   setShowLogin(true);
  // };




// function handleLogout() {
//   signOut(auth)
//     .then(() => {
//       setToken(null); // or whatever you use to clear login state
//       toast.success("Logged out successfully!");
//     })
//     .catch((error) => {
//       toast.error("Logout failed: " + error.message);
//     });
// }

function handleLogout() {
  signOut(auth)
    .then(() => {
      setToken(null);
      setUserEmail(null); // ✅ Clear on logout
      toast.success("Logged out successfully!");
    })
    .catch((error) => {
      toast.error("Logout failed: " + error.message);
    });
}





  return (



    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white flex flex-col">


<Toaster position="top-center" reverseOrder={false} />


      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-30">
        <h1 className="text-3xl font-bold">WorkTracker</h1>


      <nav>
  {!token ? (
    <>
      {showForgotPassword ? (
        <button
          onClick={() => setShowForgotPassword(false)}
          className="mb-2 px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition bg-white text-black w-full sm:w-auto"
        >
          Back to Login
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={() => { setShowLogin(true); setShowForgotPassword(false); }}
            className={`px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition w-full sm:w-auto ${
              showLogin ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setShowLogin(false); setShowForgotPassword(false); }}
            className={`px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition w-full sm:w-auto ${
              !showLogin ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            Register
          </button>
        </div>
      )}
    </>
  ) : (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 transition w-full sm:w-auto"
    >
      Logout
    </button>
  )}
</nav>




      </header>




   <main className="flex-grow flex flex-col items-center justify-center px-4 text-black">
  {token ? (
    userEmail === "suriyaprakash@aactni.edu.in" ? (
      // Full-width layout for Admin
      <div className="w-full">
        <AdminPage />
      </div>
    ) : (
      // Centered layout for normal user
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-10 max-w-md w-full">
        <Dashboard userEmail={userEmail} />
      </div>
    )
  ) : showForgotPassword ? (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-10 max-w-md w-full">
      <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
    </div>
  ) : showLogin ? (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-10 max-w-md w-full">
      <Login onLogin={handleLogin} setShowForgotPassword={setShowForgotPassword} />
    </div>
  ) : (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-10 max-w-md w-full">
      <Register />
    </div>
  )}
</main>



      {/* Footer */}
      <footer className="py-4 text-center text-white bg-black bg-opacity-30">
        &copy; 2025 WorkTracker. Developed by Suriya Prakash B.
      </footer>
    </div>

  );
}

"use client";
import { useEffect, useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../src/firebase/firebase-config";

const LoginPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem("firebaseAuthToken", token); // Using localStorage instead of Cookies
          setIsOpen(false);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      } else {
        setIsOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("firebaseAuthToken", token); // Store token in localStorage
      setIsOpen(false);
      window.location.reload(); // Reload to apply changes
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Login to Continue</h2>
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign in with Google
          </button>
        </div>
      </div>
    )
  );
};

export default LoginPopup;

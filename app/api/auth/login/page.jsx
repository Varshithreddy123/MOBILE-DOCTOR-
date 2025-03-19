"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebase-config"; 
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/popular-doctors"); // 🔹 Use replace instead of push
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Prevent render before checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // ✅ Error mapping function for better messages
  const getFriendlyError = (errorCode) => {
    const errorMap = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/invalid-email": "Enter a valid email address.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
    };
    return errorMap[errorCode] || "Login failed. Please try again.";
  };

  // ✅ Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/popular-doctors");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            className={`p-2 rounded text-white ${
              loggingIn ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loggingIn}
          >
            {loggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

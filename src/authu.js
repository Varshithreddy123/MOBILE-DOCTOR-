import { auth, provider } from "./firebase/firebase-config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// 🔹 Google Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Login successful:", result.user);

    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      },
    };
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return { success: false, message: error.message };
  }
};

// 🔹 Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Successfully logged out");
    return { success: true, message: "Logged Out!" };
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    return { success: false, message: error.message };
  }
};

// 🔹 Check if User is Logged In
export const checkUser = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
    } else {
      callback(null);
    }
  });
};

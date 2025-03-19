"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut,Calendar } from "lucide-react";
import { auth, provider } from "../../src/firebase/firebase-config";
import { 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const db = getFirestore();
  const [authMode, setAuthMode] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const modalRef = useRef(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigateTo, setNavigateTo] = useState('');
  const provider = new GoogleAuthProvider();
  const [profileImage, setProfileImage] = useState(user?.photoURL || "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741004092/samples/smile.jpg");

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Persistence setting error:", error);
    });

    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("Signed in after redirect", result.user);
        updateUserInFirestore(result.user);
        setUser(result.user);
        showNotification(`Welcome ${result.user.displayName || result.user.email}!`);
        navigateToProfile();
      }
    });

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (shouldNavigate && navigateTo) {
      router.push(navigateTo);
      setShouldNavigate(false);
      setNavigateTo('');
    }
  }, [shouldNavigate, navigateTo, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        updateUserInFirestore(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
      setProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewProfile = () => {
    setProfileOpen(false);
    router.push('/profile');
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setAuthError(`Google sign-in error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      updateUserInFirestore(userCredential.user);
      setShowAuthModal(false);
      navigateToProfile();
    } catch (error) {
      console.error("Email login error:", error);
      setAuthError(`Login error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      updateUserInFirestore(userCredential.user);
      setShowAuthModal(false);
      navigateToProfile();
    } catch (error) {
      console.error("Email signup error:", error);
      setAuthError(`Signup error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (authMode === "login") {
        await handleEmailLogin(e);
      } else {
        await handleEmailSignup(e);
      }
    } catch (error) {
      console.error("Authentication Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInFirestore = async (user) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741004092/samples/smile.jpg",
        createdAt: new Date(),
      });
      }
       catch (error) {
       console.error("Error updating Firestore:", error);
    }
  };

  const navigateToProfile = () => {
    setNavigateTo('/profile');
    setShouldNavigate(true);
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    notification.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

const menu = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Explore", path: "/explore" },
  { id: 3, name: "Contact Us", path: "/contact" },
  // Add profile link to the menu when user is logged in
  ...(user ? [{ id: 4, name: "My Profile", path: "/profile" }] : [])
];

return (
  <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white shadow-md relative">
    <div className="flex items-center gap-8">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logoipsum-364.svg"
          alt="Logo"
          width={150}
          height={50}
          priority
          className="hidden sm:block"
        />
        <span className="text-lg font-bold sm:hidden">MyBrand</span>
      </Link>

     {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        <ul className="flex gap-6">
          {menu.map((item) => (
            <li key={item.id}>
              <Link
                href={item.path}
                className={`text-gray-700 font-semibold transition-all duration-300 ${
                  pathname === item.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "hover:text-blue-500"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

      {/* Auth Buttons or Profile */}
<div className="flex items-center gap-4">
  {isLoading ? (
    <div className="h-8 w-8 rounded-full border-t-2 border-blue-500 animate-spin"></div>
  ) : user ? (
    <div ref={profileRef} className="relative">
      <button
        onClick={toggleProfile}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
      >
        {user.photoURL ? (
           <Image 
              src={user.photoURL || "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741004092/samples/smile.jpg"} 
              alt="Profile" 
              width={32} 
              height={32} 
              className="rounded-full"
              onError={(e) => { e.target.src = "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741004092/samples/smile.jpg"; }}
           />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span>{user.email?.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span className="hidden sm:inline">{user.displayName || user.email?.split('@')[0]}</span>
      </button>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>

      {/* Profile Dropdown */}
      {profileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={viewProfile}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="mr-2 h-4 w-4" />
            My Profile
          </button>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
             <Calendar className="mr-2 h-4 w-4" />
      My Bookings
    </button>
    <button
      onClick={logout}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="mr-2 h-4 w-4" />
           Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <>
       <button
  onClick={() => {
    setAuthMode('login');
    setShowAuthModal(true);
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold w-full transition-colors"
>
  Login
</button>
      <button
        onClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Sign Up
      </button>
    </>
  )}

         {/* Mobile Menu Button */}
<button
  className="md:hidden text-gray-700 hover:text-blue-600"
  onClick={toggleMenu}
>
  {menuOpen ? <X size={24} /> : <Menu size={24} />}
</button>
</div>

{/* Mobile Navigation */}
<div
  className={`absolute top-full left-0 w-full bg-white shadow-md md:hidden transition-all duration-300 ${
    menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
>
  <ul className="flex flex-col items-center gap-4 py-4">
    {menu.map((item) => (
      <li key={item.id} className="w-full text-center">
        <Link
          href={item.path}
          className={`text-gray-700 font-semibold transition duration-300 block py-2 ${
            pathname === item.path
              ? "text-blue-600 underline"
              : "hover:text-blue-500"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          {item.name}
        </Link>
      </li>
    ))}
    <li className="w-full px-8 pt-2">
      {isLoading ? (
        <div className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : !user ? (
        <button
  onClick={() => {
    setAuthMode('login');
    setShowAuthModal(true);
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold w-full transition-colors"
>
  Login
</button>
      ) : (
  <div className="flex flex-col gap-2 items-center p-2 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 w-full">
      <div className="h-10 w-10 rounded-full border overflow-hidden">
      <Image 
          src={profileImage} 
          alt="Profile" 
          width={32} 
          height={32} 
          className="rounded-full"
          onError={() => setProfileImage("https://res.cloudinary.com/dfpw0itu3/image/upload/v1741004092/samples/smile.jpg")}
        />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={viewProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Profile
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </li>
  </ul>
</div>
     {/* Auth Modal */}
{showAuthModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {authMode === 'login' ? 'Login to Your Account' : 'Create an Account'}
        </h3>
        <button 
          onClick={() => setShowAuthModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {authError}
        </div>
      )}
      
      <form onSubmit={authMode === 'login' ? handleEmailLogin : handleEmailSignup}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            authMode === 'login' ? 'Login' : 'Sign Up'
          )}
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {authMode === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              {authMode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}

    </header>
  );
};

export default Header;
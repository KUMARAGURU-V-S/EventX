import { useState } from "react";
import { FaEnvelope, FaFacebook, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();
const provider = new GoogleAuthProvider();

export default function Login() {
  const [input, setInput] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SELECT ROLE");
  const [isLogin, setIsLogin] = useState(true);
  const [googleStep, setGoogleStep] = useState(0); // 0: idle, 1: username, 2: password
  const [googleUser, setGoogleUser] = useState(null);
  const [googleUsername, setGoogleUsername] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [googleRole, setGoogleRole] = useState("SELECT ROLE");
  const navigate = useNavigate();

  // Login with username or email
  const handleLogin = async (e) => {
    e.preventDefault();
    let email = input;
    try {
      if (role === "SELECT ROLE") return alert("Please select a role");
      if (!input) return alert("Enter username or email");
      if (!password || password.length < 6) return alert("Password must be at least 6 characters");
      let userRole;
      if (!input.includes("@")) {
        const usernameRef = doc(db, "usernames", input);
        const snap = await getDoc(usernameRef);
        if (!snap.exists()) return alert("Username not found");
        email = snap.data().email;
        userRole = snap.data().role;
      } else {
        const usernameRef = doc(db, "usernames", input);
        const snap = await getDoc(usernameRef);
        if (!snap.exists()) return alert("Email not found");
        userRole = snap.data().role;
      }
      if (userRole !== role) return alert("Role does not match!");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome ${userCredential.user.email}`);
      // Redirect based on role
      if (role === "Organizer") {
        navigate("/organiser-dashboard");
      } else if (role === "Student") {
        navigate("/student-dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (role === "SELECT ROLE") return alert("Please select a role");
      if (!input || !input.includes("@")) return alert("Enter a valid email for signup");
      if (!password || password.length < 6) return alert("Password must be at least 6 characters");
      const userCredential = await createUserWithEmailAndPassword(auth, input, password);
      await setDoc(doc(db, "usernames", input), { email: input, role });
      alert(`Account created for ${userCredential.user.email}`);
      // Redirect based on role
      if (role === "Organizer") {
        navigate("/organiser-dashboard");
      } else if (role === "Student") {
        navigate("/student-dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Google sign-in for signup and forgot password
  const handleGoogleLogin = async (mode = "signup") => {
    try {
      const result = await signInWithPopup(auth, provider);
      setGoogleUser(result.user);

      // Check if user already exists in usernames collection
      const usernamesRef = getFirestore();
      let found = false;
      let usernameSnapshot = null;

      // Search for a username with this email
      // (Firestore doesn't support reverse lookup on doc id, so scan all)
      const querySnapshot = await getDocs(collection(usernamesRef, "usernames"));
      querySnapshot.forEach((docSnap) => {
        if (docSnap.data().email === result.user.email) {
          found = true;
          usernameSnapshot = docSnap;
        }
      });

      if (mode === "signup") {
        if (found) {
          alert("Account already exists. Logging you in!");
          setGoogleStep(0);
          setGoogleUser(null);
          setGoogleUsername("");
          setGooglePassword("");
          setIsLogin(true);
          // Optionally, you can redirect or update UI here
        } else {
          setGoogleStep(1); // Ask for username
          setIsLogin(false);
        }
      } else if (mode === "forgot") {
        if (!found) {
          alert("Account does not exist");
          setGoogleStep(0);
          setGoogleUser(null);
          setGoogleUsername("");
          setGooglePassword("");
        } else {
          setGoogleStep(1); // Ask for new username
          setIsLogin(false);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Username step for Google (signup or forgot)
  const handleGoogleUsername = async (e) => {
    e.preventDefault();
    if (!googleUsername) return alert("Username required");
    if (googleRole === "SELECT ROLE") return alert("Please select a role");

    // Find the old username for this email
    const usernamesCol = collection(db, "usernames");
    const allUsernames = await getDocs(usernamesCol);
    let oldUsernameDoc = null;
    for (const docSnap of allUsernames.docs) {
      if (docSnap.data().email === googleUser.email) {
        oldUsernameDoc = docSnap;
        break;
      }
    }

    if (oldUsernameDoc) {
      if (oldUsernameDoc.id === googleUsername) {
        setGoogleStep(2);
      } else {
        const usernameRef = doc(db, "usernames", googleUsername);
        const snap = await getDoc(usernameRef);
        if (snap.exists()) return alert("Username already taken");
        // Remove old mapping and add new mapping with role
        await setDoc(usernameRef, { email: googleUser.email, role: googleRole });
        await setDoc(doc(db, "usernames", oldUsernameDoc.id), {}, { merge: false });
        await setDoc(doc(db, "usernames", oldUsernameDoc.id), { deleted: true });
        setGoogleStep(2);
      }
    } else {
      // For signup flow, or if no old username found
      const usernameRef = doc(db, "usernames", googleUsername);
      const snap = await getDoc(usernameRef);
      if (snap.exists()) return alert("Username already taken");
      await setDoc(usernameRef, { email: googleUser.email, role: googleRole });
      setGoogleStep(2);
    }
  };

  // Password step for Google
  const handleGooglePassword = async (e) => {
    e.preventDefault();
    if (!googlePassword || googlePassword.length < 6) return alert("Password must be at least 6 characters");
    try {
      await updatePassword(auth.currentUser, googlePassword);
      alert("Google signup complete!");
      // Redirect based on role
      if (role === "Organizer") {
        navigate("/organiser-dashboard");
      } else if (role === "Student") {
        navigate("/student-dashboard");
      }
      setGoogleStep(0);
      setGoogleUser(null);
      setGoogleUsername("");
      setGooglePassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  // Main UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-purple-500">
      <div className="bg-transparent w-full max-w-4xl p-8 flex rounded-lg text-white">
        {/* Left Section */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-gray-100 text-black text-xl font-semibold px-6 py-4 rounded-md">
            EVENT X
          </div>
        </div>
        {/* Divider */}
        <div className="w-px bg-gray-300 mx-10 " />
        {/* Right Section */}
        <div className="w-1/2 space-y-6 space-x-3">
          {/* Google signup flow */}
          {googleStep === 1 && (
            <form onSubmit={handleGoogleUsername}>
              <select
                value={googleRole}
                onChange={e => setGoogleRole(e.target.value)}
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none cursor-pointer font-bold mb-2"
              >
                <option>SELECT ROLE</option>
                <option>Organizer</option>
                <option>Student</option>
              </select>
              <input
                value={googleUsername}
                onChange={e => setGoogleUsername(e.target.value)}
                placeholder="Choose a unique username"
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
              />
              <button type="submit" className="w-full bg-orange-500 mt-2 py-2 rounded-md">Set Username</button>
            </form>
          )}
          {googleStep === 2 && (
            <form onSubmit={handleGooglePassword}>
              <input
                type="password"
                value={googlePassword}
                onChange={e => setGooglePassword(e.target.value)}
                placeholder="Create a password (min 6 chars)"
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
              />
              <button type="submit" className="w-full bg-orange-500 mt-2 py-2 rounded-md">Set Password</button>
            </form>
          )}
          {googleStep === 0 && (
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none cursor-pointer font-bold"
              >
                <option>SELECT ROLE</option>
                <option>Organizer</option>
                <option>Student</option>
              </select>
              <input
                type="text"
                placeholder="Email or Username"
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200 cursor-pointer"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          )}
          {googleStep === 0 && (
            <>
              <div className="flex justify-between text-sm text-white mt-2">
                <a
                  href="#"
                  className="hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoogleLogin("forgot");
                  }}
                >
                  Forgot password?
                </a>
                <button
                  className="hover:underline cursor-pointer"
                  onClick={() => {
                    if (isLogin) {
                      handleGoogleLogin("signup");
                    } else {
                      setIsLogin(true);
                    }
                  }}
                  type="button"
                >
                  {isLogin ? "New? Sign up" : "Already have an account? Login"}
                </button>
              </div>
              <div className="mt-6">
                <p className="text-orange-400 font-semibold mb-2">Continue with</p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="bg-white p-2 rounded-full text-black cursor-pointer hover:text-gray-500"
                    onClick={handleGoogleLogin}
                  >
                    <FaEnvelope />
                  </button>
                  <button className="bg-white p-2 rounded-full text-black cursor-pointer hover:text-gray-500">
                    <FaFacebook />
                  </button>
                  <button className="p-2 rounded-full text-black bg-white cursor-pointer hover:text-gray-500">
                    <FaTwitter />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



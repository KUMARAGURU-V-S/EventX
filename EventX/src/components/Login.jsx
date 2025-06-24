import { useState } from "react";
import { FaEnvelope, FaFacebook, FaTwitter } from "react-icons/fa";
import {signInWithEmailAndPassword} from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

import {auth} from "../firebase";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SELECT ROLE");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  const handleLogin = async (email, password, role) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in user:", user.email, "with role:", role);
    alert(`Welcome user ${user.email}`);
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
  }
};

 const handleSignup = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed up user:", user.email, "with role:", role);
    alert(`Account created for ${user.email}`);
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message);
  }
};

 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google user:", user.email);
    alert(`Signed in with Google: ${user.email}`);
  } catch (error) {
    console.error("Google login error:", error);
    alert(error.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-purple-500">
      <div className="bg-transparent w-full max-w-4xl p-8 flex rounded-lg text-white">
        
        {/*  Left Section */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-gray-100 text-black text-xl font-semibold px-6 py-4 rounded-md">
            EVENT X
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 mx-10 "/>

        {/*  Right Section - login credentials*/}
        <div className="w-1/2 space-y-6 space-x-3">
         
          <form 
          onSubmit={isLogin ? handleLogin : handleSignup}>
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
            type="email"
            placeholder="Email@address.com"
            className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/90 text-black px-4 py-2 rounded-md focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/*  Login Button */}
          <button 
          type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200 cursor-pointer"
          >
            {isLogin ? "Login":"Sign UP"}
          </button>
          </form>

          <div className="flex justify-between text-sm text-white mt-2">
            <a href="#" className="hover:underline cursor-pointer">
              Forgot password?
            </a>
            <button
             className="hover:underline cursor-pointer"
             onClick={()=>setIsLogin(!isLogin)}
             type="button"
             >
              {isLogin ? "New? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          {/* Continue via other choices */}
          <div className="mt-6">
            <p className="text-orange-400 font-semibold mb-2">Continue with</p>
            <div className="flex space-x-4">
              <button className="bg-white p-2 rounded-full text-black cursor-pointer hover:text-gray-500">
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
        </div>
      </div>
      {/* Final div */}
    </div>
  );
}



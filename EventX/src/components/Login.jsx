import { useState } from "react";
import { FaEnvelope, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SELECT ROLE");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password, role });
    alert("Login clicked!");
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
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200 cursor-pointer"
          >
            Login
          </button>

          <div className="flex justify-between text-sm text-white mt-2">
            <a href="#" className="hover:underline cursor-pointer">
              Forgot password?
            </a>
            <a href="#" className="hover:underline cursor-pointer">
              New ? Sign up
            </a>
          </div>

          {/* Continue via other choices */}
          <div className="mt-6">
            <p className="text-orange-400 font-semibold mb-2">Continue with</p>
            <div className="flex space-x-4">
              <button className="bg-white p-2 rounded-full text-black cursor-pointer hover:text-gray-700">
                <FaEnvelope />
              </button>
              <button className="bg-white p-2 rounded-full text-black cursor-pointer hover:text-gray-700">
                <FaFacebook />
              </button>
              <button className="p-2 rounded-full text-black bg-white cursor-pointer hover:text-gray-700">
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



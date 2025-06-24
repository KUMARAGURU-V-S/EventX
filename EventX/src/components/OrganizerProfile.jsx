import { FaTwitter, FaFacebook, FaInstagram, FaEdit, FaArrowLeft } from "react-icons/fa";

export default function OrganizerProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-purple-100 px-6 py-10 font-poppins">
      
      {/* Simple Button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl shadow hover:bg-cyan-700 transition cursor-pointer"
          type="button"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Box */}
        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-cyan-200 relative text-center hover:bg-gray-100 h-64">
          <div className="absolute top-4 right-4 group flex flex-col items-center">
            <button className="text-cyan-600 hover:text-cyan-800 transition cursor-pointer">
              <FaEdit size={22} />
            </button>
            <div className="mt-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition duration-200">
              Edit Profile
            </div>
          </div>
          <div className="w-24 h-24 mx-auto mb-4 border-4 border-cyan-500 rounded-full flex items-center justify-center text-xs text-gray-500 bg-gray-100 font-semibold">
            profile picture
          </div>
          <h2 className="text-xl font-bold text-cyan-700 tracking-wide">USER NAME</h2>
          <p className="text-sm text-gray-600 mt-1">organizer</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-purple-200 hover:bg-gray-100 h-64">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">Contact Info</h3>
          <p className="mb-2"><span className="font-semibold text-gray-700">Full Name:</span> John Doe</p>
          <p className="mb-2"><span className="font-semibold text-gray-700">E-mail:</span> john@example.com</p>
          <p className="mb-2"><span className="font-semibold text-gray-700">Mobile:</span> +91 98765 43210</p>
          <p><span className="font-semibold text-gray-700">Address:</span> Chennai, India</p>
        </div>

        {/* Social Media Links */}
        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-pink-200 hover:bg-gray-100 h-48">
          <h3 className="text-lg font-semibold text-pink-600 mb-4">Social Links</h3>
          <div className="flex items-center gap-3 mb-3 text-gray-700 hover:text-blue-500 transition cursor-pointer">
            <FaTwitter className="text-blue-400" />
            <span>Twitter</span>
          </div>
          <div className="flex items-center gap-3 mb-3 text-gray-700 hover:text-blue-600 transition cursor-pointer">
            <FaFacebook className="text-blue-600" />
            <span>Facebook</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 hover:text-pink-500 transition cursor-pointer">
            <FaInstagram className="text-pink-500" />
            <span>Instagram</span>
          </div>
        </div>

        {/* Organized Events */}
        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-indigo-200 hover:bg-gray-100 min-h-[250px]">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Organized Events:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Tech Fest 2025</li>
            <li>AI Conference</li>
            <li>Startup Meetup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

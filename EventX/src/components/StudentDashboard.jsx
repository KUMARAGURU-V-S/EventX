import { FaSearch, FaUserCircle } from "react-icons/fa";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-poppins">
      {/* Top Row: Search | View Registered Events | Profile */}
      <div className="flex items-center justify-between gap-x-6 max-w-4xl mx-auto mb-10">
        {/* Search Bar */}
        <div className="flex items-center flex-grow border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Enter an event to search"
            className="flex-grow outline-none text-gray-700 placeholder-gray-500 text-sm"
          />
          <FaSearch className="ml-2 text-lg text-gray-600" />
        </div>

        {/* View Registered Events Button */}
        <button className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap cursor-pointer">
          View Registered Events
        </button>

        {/* Profile Icon */}
        <div className="text-4xl text-gray-700 cursor-pointer hover:text-gray-800">
          <FaUserCircle />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="bg-gray-400 text-white p-6 rounded-xl shadow-md text-center hover:bg-gray-500 cursor-pointer"
          >
            <div className="text-lg font-bold">Event {num}</div>
            <div className="text-sm font-light">date and other info</div>
          </div>
        ))}
      </div>
    </div>
  );
}

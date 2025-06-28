import { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");
  const EVENTS_PER_PAGE = 5;

  useEffect(() => {
    async function fetchEvents() {
      const eventsCol = collection(db, "events");
      const eventsSnap = await getDocs(eventsCol);
      const eventsArr = [];
      eventsSnap.forEach((doc) => {
        eventsArr.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsArr);
    }
    fetchEvents();
  }, []);

  // Filter and search logic
  const filteredEvents = events.filter((event) => {
    // Search by title, tags, or hosted_by
    const keyword = search.trim().toLowerCase();
    const matchesSearch =
      !keyword ||
      event.title?.toLowerCase().includes(keyword) ||
      event.hosted_by?.toLowerCase().includes(keyword) ||
      (Array.isArray(event.tags) &&
        event.tags.join(" ").toLowerCase().includes(keyword));
    // Filter by level
    const matchesLevel =
      filterLevel === "ALL" || event.level === filterLevel;
    // Filter by format
    const matchesFormat =
      filterFormat === "ALL" || event.format === filterFormat;
    return matchesSearch && matchesLevel && matchesFormat;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * EVENTS_PER_PAGE,
    page * EVENTS_PER_PAGE
  );

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, filterLevel, filterFormat]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-poppins">
      {/* Top Row: Search | Filters | View Registered Events | Profile */}
      <div className="flex items-center justify-between gap-x-6 max-w-4xl mx-auto mb-10">
        {/* Search Bar */}
        <div className="flex items-center flex-grow border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search events by keyword, tag, or host"
            className="flex-grow outline-none text-gray-700 placeholder-gray-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="ml-2 text-lg text-gray-600" />
        </div>

        {/* Filters */}
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="bg-white text-black px-2 py-1 rounded-md text-sm font-semibold"
        >
          <option value="ALL">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
          className="bg-white text-black px-2 py-1 rounded-md text-sm font-semibold"
        >
          <option value="ALL">All Formats</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

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
        {paginatedEvents.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No events available.
          </div>
        ) : (
          paginatedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-400 text-white p-6 rounded-xl shadow-md text-center hover:bg-gray-500 cursor-pointer"
            >
              <div className="text-lg font-bold">{event.title}</div>
              <div className="text-sm font-light">{event.date}</div>
              <div className="text-xs mt-2">
                {event.type} | {event.level} | {event.format}
              </div>
              <div className="text-xs mt-1">
                {Array.isArray(event.tags)
                  ? event.tags.join(", ")
                  : event.tags}
              </div>
              <a
                href={event.registration_link}
                className="text-blue-200 underline text-xs block mt-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
              </a>
            </div>
          ))
        )}
      </div>

      {/* Pagination Panel */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded ${
              page === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

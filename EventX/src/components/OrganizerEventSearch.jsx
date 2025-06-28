import React from "react";
import { FaSearch } from "react-icons/fa";

export default function OrganizerEventSearch({
  search,
  setSearch,
  filterLevel,
  setFilterLevel,
  filterFormat,
  setFilterFormat,
}) {
  return (
    <div className="flex items-center flex-grow border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm gap-2">
      <input
        type="text"
        placeholder="Search your events by keyword, tag, or host"
        className="flex-grow outline-none text-gray-700 placeholder-gray-500 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FaSearch className="ml-2 text-lg text-gray-600" />
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
    </div>
  );
}
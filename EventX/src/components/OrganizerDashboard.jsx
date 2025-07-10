import { useState, useEffect } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import OrganizerEventSearch from "./OrganizerEventSearch";

const db = getFirestore();

export default function OrganizerDashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    hosted_by: "",
    date: "",
    price: 1000,
    level: "",
    format: "",
    registration_link: "",
    tags: "",
    banner: "",
  });
  const [myEvents, setMyEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle event creation
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Store event in "events" collection
      const eventRef = await addDoc(collection(db, "events"), {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
        price: Number(form.price),
        created_by: auth.currentUser?.email || "unknown",
        created_at: new Date(),
      });

      // Get current username
      const currentUsername = await getCurrentUsername();
      if (!currentUsername) throw new Error("Organizer username not found!");

      // Update organiser's details in "usernames" collection
      const orgRef = doc(db, "usernames", currentUsername);
      const orgSnap = await getDoc(orgRef);
      let eventsCreated = 1;
      let eventsList = [eventRef.id];
      if (orgSnap.exists()) {
        const data = orgSnap.data();
        eventsCreated = (data.events_created || 0) + 1;
        eventsList = Array.isArray(data.events)
          ? [...data.events, eventRef.id]
          : [eventRef.id];
        await updateDoc(orgRef, {
          events_created: eventsCreated,
          events: eventsList,
        });
      } else {
        // Create the document if it doesn't exist
        await setDoc(orgRef, {
          events_created: eventsCreated,
          events: eventsList,
          email: auth.currentUser?.email || "unknown",
          role: "Organizer",
        });
      }

      alert("Event created!");
      setShowPopup(false);
      setForm({
        title: "",
        type: "",
        hosted_by: "",
        date: "",
        price: 0,
        level: "",
        format: "",
        registration_link: "",
        tags: "",
        banner: "",
      });

      // Refetch events after creation
      fetchMyEvents();

    } catch (err) {
      alert("Error creating event: " + err.message);
    }
  };

  // Helper to get current user's username (doc id)
  async function getCurrentUsername() {
    const q = collection(db, "usernames");
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      if (docSnap.data().email === auth.currentUser?.email) {
        return docSnap.id;
      }
    }
    return null;
  }

  // Fetch my events
  async function fetchMyEvents() {
    if (!auth.currentUser?.email) return;
    // Get current username
    const currentUsername = await getCurrentUsername();
    if (!currentUsername) return;
    // Get organizer doc
    const orgRef = doc(db, "usernames", currentUsername);
    const orgSnap = await getDoc(orgRef);
    if (!orgSnap.exists()) {
      setMyEvents([]);
      return;
    }
    const eventsList = orgSnap.data().events || [];
    if (eventsList.length === 0) {
      setMyEvents([]);
      return;
    }
    // Fetch event docs by ID
    const eventsCol = collection(db, "events");
    const allEventsSnap = await getDocs(eventsCol);
    const myEventsArr = [];
    allEventsSnap.forEach((eventDoc) => {
      if (eventsList.includes(eventDoc.id)) {
        myEventsArr.push({ id: eventDoc.id, ...eventDoc.data() });
      }
    });
    setMyEvents(myEventsArr);
  }

  // Filter and search logic for organizer's events
  const filteredMyEvents = myEvents.filter((event) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch =
      !keyword ||
      event.title?.toLowerCase().includes(keyword) ||
      event.hosted_by?.toLowerCase().includes(keyword) ||
      (Array.isArray(event.tags) &&
        event.tags.join(" ").toLowerCase().includes(keyword));
    const matchesLevel = filterLevel === "ALL" || event.level === filterLevel;
    const matchesFormat = filterFormat === "ALL" || event.format === filterFormat;
    return matchesSearch && matchesLevel && matchesFormat;
  });

  // useEffect to load events on mount and when popup closes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyEvents();
      } else {
        setMyEvents([]);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [showPopup]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-poppins">
      {/* Top Row: Search | Add Event | Profile */}
      <div className="flex items-center justify-between gap-x-6 max-w-4xl mx-auto mb-10">
        {/* Organizer Event Search Bar */}
        <OrganizerEventSearch
          search={search}
          setSearch={setSearch}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          filterFormat={filterFormat}
          setFilterFormat={setFilterFormat}
        />
        {/* Add Button */}
        <button
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap cursor-pointer"
          onClick={() => setShowPopup(true)}
        >
          Add a new event
        </button>

        {/* Profile Icon */}
        <div className="text-4xl text-gray-700 cursor-pointer hover:text-gray-800">
          <FaUserCircle />
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleCreate}
            className="bg-white text-black rounded-lg p-8 w-full max-w-lg shadow-lg space-y-4"
          >
            <h2 className="text-xl font-bold mb-2">Create New Event</h2>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Type"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="hosted_by"
              value={form.hosted_by}
              onChange={handleChange}
              placeholder="Hosted By"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Date (YYYY-MM-DD)"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Level"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="format"
              value={form.format}
              onChange={handleChange}
              placeholder="Format"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="registration_link"
              value={form.registration_link}
              onChange={handleChange}
              placeholder="Registration Link"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              name="banner"
              value={form.banner}
              onChange={handleChange}
              placeholder="Banner URL"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {
        
        filteredMyEvents.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No events found.
          </div>
        ) : (
          filteredMyEvents.map((event) => (
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
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const doctorsPerPage = 6;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/api/doctors", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };

    fetchDoctors();
  }, [user]);

  const filteredDoctors = doctors
    .filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((doc) =>
      specialization ? doc.specialization === specialization : true
    )
    .filter((doc) => (city ? doc.city === city : true))
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "available") return b.available - a.available;
      return 0;
    });

  const startIndex = (page - 1) * doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  const handleBook = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const specializations = [...new Set(doctors.map((doc) => doc.specialization))];
  const cities = [...new Set(doctors.map((doc) => doc.city))];

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Available Doctors</h2>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="rating">Rating</option>
          <option value="available">Availability</option>
        </select>
      </div>

      {/* Doctor Cards */}
      {currentDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doc) => (
            <div key={doc._id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <img
                src={doc.profileImage || "/default-doctor.jpg"}
                alt={doc.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{doc.name}</h3>
              <p className="text-gray-600">Specialization: {doc.specialization}</p>
              <p className="text-gray-600">City: {doc.city}</p>
              <p className="text-yellow-600">⭐ {doc.rating || "N/A"}</p>
              <p className="text-green-600 mt-2">
                {doc.available ? "Available Today" : "Not Available"}
              </p>
              <button
                onClick={() => handleBook(doc._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No doctors found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={startIndex + doctorsPerPage >= filteredDoctors.length}
          className={`px-4 py-2 rounded ${
            startIndex + doctorsPerPage >= filteredDoctors.length
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorList;

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => setDoctor(res.data));
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/appointments", {
        doctorId,
        date,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Appointment booked!");
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Book Appointment</h2>
      {doctor && (
        <>
          <p className="text-lg mb-2">Dr. {doctor.name}</p>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Choose Date & Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default BookAppointment;

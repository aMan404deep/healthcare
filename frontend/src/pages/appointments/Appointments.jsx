import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");

  // Fetch available doctors
  useEffect(() => {
    if (user?.token && user?.role === "patient") {
      axios
        .get("/api/doctors", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setDoctors(res.data))
        .catch(console.error);
    }
  }, [user]);

  // Fetch user's appointments
  useEffect(() => {
    if (user?.token) {
      axios
        .get("/api/appointments", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setAppointments(res.data))
        .catch(console.error);
    }
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date) return alert("Fill all fields");
    try {
      await axios.post(
        "/api/appointments/book",
        { doctorId: selectedDoctor, date },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Appointment Booked");
      setDate("");
      setSelectedDoctor("");
    } catch (err) {
      alert("❌ Error booking appointment");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>

      {/* Booking Form (Patients only) */}
      {user?.role === "patient" && (
        <form
          onSubmit={handleBook}
          className="mb-8 bg-white p-4 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold">Book New Appointment</h2>
          <select
            className="w-full border p-2 rounded"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Book Appointment
          </button>
        </form>
      )}

      {/* Appointments List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">
                  {user.role === "doctor" ? "Patient" : "Doctor"}
                </th>
                <th className="border-b p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="border-b p-2">
                    {new Date(appt.date).toLocaleDateString()}
                  </td>
                  <td className="border-b p-2">
                    {user.role === "doctor"
                      ? appt.patient?.name
                      : appt.doctor?.name}
                  </td>
                  <td className="border-b p-2">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Appointments;

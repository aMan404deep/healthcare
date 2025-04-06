// components/BookAppointmentModal.jsx
import React, { useState } from "react";
import axios from "axios";

const BookAppointmentModal = ({ doctor, user, onClose }) => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(
        "/api/appointments/book",
        {
          doctor: doctor._id,
          date,
          timeSlot,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Appointment requested!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Book with {doctor.name}</h2>
        <label className="block mb-2">Select Date:</label>
        <input type="date" className="border p-2 w-full mb-3" value={date} onChange={(e) => setDate(e.target.value)} />

        <label className="block mb-2">Select Time Slot:</label>
        <select className="border p-2 w-full mb-3" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          <option value="">Choose</option>
          <option>09:00 AM</option>
          <option>10:00 AM</option>
          <option>11:00 AM</option>
          <option>02:00 PM</option>
        </select>

        <label className="block mb-2">Reason (Optional):</label>
        <textarea className="border p-2 w-full mb-4" value={reason} onChange={(e) => setReason(e.target.value)} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
          Book
        </button>
        <button className="ml-4 text-gray-600" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default BookAppointmentModal;

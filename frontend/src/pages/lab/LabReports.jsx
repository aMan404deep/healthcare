import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const LabReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/lab/report", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !patientId) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);

    try {
      await axios.post("/api/lab/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("✅ Report uploaded");
      setFile(null);
      setPatientId("");
      fetchReports();
    } catch (err) {
      alert("❌ Upload failed");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/lab/report/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("🗑️ Report deleted");
      fetchReports();
    } catch (err) {
      alert("❌ Failed to delete report");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📁 Lab Reports</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-8 bg-white p-4 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">Upload New Report</h2>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {/* Reports Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Uploaded Reports</h2>
        {reports.length === 0 ? (
          <p>No reports uploaded yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Patient ID</th>
                <th className="border-b p-2">Report</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="border-b p-2">{report.patientId}</td>
                  <td className="border-b p-2">
                    <a
                      href={report.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Report
                    </a>
                  </td>
                  <td className="border-b p-2">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LabReports;

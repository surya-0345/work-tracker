import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard({userEmail}) {
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null); // 🆕 Track edit mode
  const [workLogs, setWorkLogs] = useState([]);

  useEffect(() => {
    if (userEmail) {
      fetchLogs();
    }
  }, [userEmail]);

  const fetchLogs = () => {
    axios
      .get(`http://localhost:8080/api/logs?email=${userEmail}`)

      .then((res) => setWorkLogs(res.data))
      .catch((err) => toast.error("Failed to fetch logs."));
  };

  const handleAddOrUpdate = () => {
    if (!date || !task) {
      toast.error("Please fill in all fields.");
      return;
    }

    const logData = { date, task, userEmail };

    if (editId) {
      // ✅ Update existing log
      axios
        .put(`http://localhost:8080/api/logs/${editId}`, logData)
        .then(() => {
          toast.success("Log updated!");
          resetForm();
          fetchLogs();
        })
        .catch(() => toast.error("Update failed."));
    } else {
      // ✅ Add new log
      axios
        .post("http://localhost:8080/api/logs", logData)
        .then((res) => {
          setWorkLogs([...workLogs, res.data]);
          resetForm();
          toast.success("Log added!");
        })
        .catch(() => toast.error("Failed to save log."));
    }
  };

  const handleEdit = (log) => {
    setDate(log.date);
    setTask(log.task);
    setEditId(log.id); // 🆕 Set ID for update mode
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/logs/${id}`)
      .then(() => {
        setWorkLogs(workLogs.filter((log) => log.id !== id));
        toast.success("Log deleted!");
      })
      .catch(() => toast.error("Delete failed."));
  };

  const resetForm = () => {
    setDate("");
    setTask("");
    setEditId(null);
  };

  return (
    <div className="text-black">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editId ? "Edit Work Log" : "Add Work Log"}
      </h2>
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <textarea
          placeholder="What did you do today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2"
        ></textarea>
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {editId ? "Update Log" : "Add Log"}
        </button>
        {editId && (
          <button
            onClick={resetForm}
            className="mt-2 w-full text-sm text-gray-600 hover:underline"
          >
            Cancel Editing
          </button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-2 text-center">Your Logs</h2>
      {workLogs.length === 0 ? (
        <p className="text-center text-gray-500">No logs found.</p>
      ) : (
        <ul className="space-y-3">
          {workLogs.map((log) => (
            <li
              key={log.id}
              className="bg-gray-100 rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{log.date}</p>
                <p>{log.task}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(log)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

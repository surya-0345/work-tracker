import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Search, Download } from "lucide-react";

export default function AdminPage() {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/logs?email=suriyaprakash@aactni.edu.in"
        );
        const logs = res.data;

        // Group by userEmail and sort each group by date descending
        const grouped = {};
        logs.forEach((log) => {
          if (!grouped[log.userEmail]) grouped[log.userEmail] = [];
          grouped[log.userEmail].push(log);
        });

        Object.keys(grouped).forEach((email) => {
          grouped[email].sort((a, b) => new Date(b.date) - new Date(a.date));
        });

        setGroupedLogs(grouped);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };

    fetchLogs();
  }, []);

  const toggleExpand = (email) => {
    setExpandedUsers((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  // Download CSV for one user
  const downloadCSV = (email) => {
    const logs = groupedLogs[email];
    if (!logs || logs.length === 0) return;

    const headers = ["Date", "Task"];
    const rows = logs.map((log) => [
      new Date(log.date).toLocaleString(),
      `"${log.task.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${email}_logs.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download CSV for all users combined
  const downloadAllLogsCSV = () => {
    // Flatten all logs from all users into one array
    const allLogs = Object.entries(groupedLogs).flatMap(([email, logs]) =>
      logs.map((log) => ({ ...log, userEmail: email }))
    );

    if (allLogs.length === 0) return;

    const headers = ["User Email", "Date", "Task"];
    const rows = allLogs.map((log) => [
      log.userEmail,
      new Date(log.date).toLocaleString(),
      `"${log.task.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `all_users_logs.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredEmails = Object.keys(groupedLogs).filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-black">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🛠 Admin Work Logs
      </h2>

      <div className="mb-6 flex justify-center">
        <button
          onClick={downloadAllLogsCSV}
          className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
        >
          <Download size={18} />
          <span>Download All Logs</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search user email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
      </div>

      {filteredEmails.length === 0 ? (
        <p className="text-center text-gray-600">No matching users or logs found.</p>
      ) : (
        filteredEmails.map((email) => (
          <div key={email} className="mb-8 border rounded-lg bg-white shadow">
            <div
              className="flex items-center justify-between p-4 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200"
              onClick={() => toggleExpand(email)}
            >
              <h3 className="font-semibold text-lg text-blue-800">{email}</h3>
              {expandedUsers[email] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            {expandedUsers[email] && (
              <>
                <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {groupedLogs[email].map((log) => (
                    <div
                      key={log.id}
                      className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Task:</strong> {log.task}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 flex justify-end">
                  <button
                    onClick={() => downloadCSV(email)}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                  >
                    <Download size={18} />
                    <span>Download Logs</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function AdminPage() {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/logs?email=suriyaprakash@aactni.edu.in");
        const logs = res.data;

        // Group by email & sort by date descending
        const grouped = {};
        logs.forEach((log) => {
          if (!grouped[log.userEmail]) {
            grouped[log.userEmail] = [];
          }
          grouped[log.userEmail].push(log);
        });

        for (const email in grouped) {
          grouped[email].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

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

  const filteredEmails = Object.keys(groupedLogs).filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-black">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🛠 Admin Work Logs</h2>

      <div className="mb-6">
        <div className="relative">
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
          <div key={email} className="mb-6 border rounded-lg bg-white shadow">
            <div
              className="flex items-center justify-between p-4 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200"
              onClick={() => toggleExpand(email)}
            >
              <h3 className="font-semibold text-lg text-blue-800">{email}</h3>
              {expandedUsers[email] ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expandedUsers[email] && (
              <div className="p-4 space-y-3">
                {groupedLogs[email].map((log) => (
                  <div key={log.id} className="border p-3 rounded shadow-sm">
                    <p><strong>Date:</strong> {log.date}</p>
                    <p><strong>Task:</strong> {log.task}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { getSession } from "../feature/authService";
import { supabase } from '../lib/supabase'; // Import Supabase client

const statusColors = {
  open: "bg-blue-100 text-blue-600",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-600",
};

const priorityColors = {
  low: "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-600",
};

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [dataCount, setDataCount] = useState({
    critical: 0,
    inProgress: 0,
    resolved: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const getIssues = async () => {
      const sess = await getSession();
      if (!sess) {
        navigate("/login");
        return;
      }
      try {
        // Fetch the latest 5 issues, ordered by created_at descending
        const { data, error, count } = await supabase
          .from('issues')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false }) // Order by creation time (newest first)
          .limit(5); // Limit to 5 results

        if (error) {
          throw new Error(`Failed to fetch issues: ${error.message}`);
        }

        // Calculate status counts from all data, not just the latest 5
        const allIssues = await supabase.from('issues').select('*');
        const allIssuesData = allIssues.data || [];

        const calculatedDataCount = {
          critical: allIssuesData.filter(i => i.priority === "critical").length,
          inProgress: allIssuesData.filter(i => i.status === "in-progress").length,
          resolved: allIssuesData.filter(i => i.status === "resolved").length,
        };

        setIssues(data || []); // Ensure we don't set null
        setDataCount(calculatedDataCount);
      } catch (error) {
        console.error("Failed to fetch issues:", error.message);
        alert('Failed to load issues. Please try again.');
      }
    };

    getIssues();
  }, [navigate]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name || "User"}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of campus issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Critical Issues</span>
            <AlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold mt-2">{dataCount.critical}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">In Progress</span>
            <Clock className="text-yellow-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold mt-2">{dataCount.inProgress}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Resolved</span>
            <CheckCircle className="text-green-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold mt-2">{dataCount.resolved}</p>
        </div>
      </div>

      {/* Recent Issues Table */}
      <div className="bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold px-4 pt-4">Recent Issues</h2>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 font-semibold px-4 py-2 text-gray-600">
          <div>Title</div>
          <div>Location</div>
          <div>Priority</div>
          <div>Status</div>
        </div>

        <div className="divide-y">
          {issues.map((issue, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 px-4 py-2 text-sm hover:bg-gray-50 transition"
            >
              <div>{issue.title}</div>
              <div>{issue.location}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    priorityColors[issue.priority] || ""
                  }`}
                >
                  {issue.priority}
                </span>
              </div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[issue.status] || ""
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

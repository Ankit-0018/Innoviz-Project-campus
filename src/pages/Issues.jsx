import React, { useEffect, useState } from "react";
import { Funnel, Plus, X } from "lucide-react";
import Card from "../components/Card";
import ReportIssue from "../components/ReportIssue"; // Import the ReportIssue component
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getSession } from "../feature/authService";
import { fetchIssues } from "../services/fetchIssues";

const Issues = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function first() {
      const sess = await getSession();
      if (!sess) {
        navigate("/login");
        return;
      }
    }
    first();

    const getIssues = async () => {
      try {
        const { data } = await fetchIssues();
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    getIssues();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...issues];

    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (issue) => issue.priority.toLowerCase() === selectedPriority
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  }, [searchTerm, selectedPriority, issues]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className={`max-w-full mx-auto px-2 py-6 space-y-6`}>
      {/* Page Header */}
      <header className="text-center flex justify-between space-y-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Campus Watch</h1>
          <h3 className="text-gray-600">View and report campus issues</h3>
        </div>
        <button
         onClick={() => setIsFormOpen(true)} 
          className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Report Issue
        </button>
        
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search Issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm"
        />
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Funnel className="text-gray-500" />
          {["all", "critical", "medium", "low"].map((level) => (
            <label key={level} className="flex items-center gap-1 capitalize">
              <input
                type="radio"
                name="priority"
                value={level}
                checked={selectedPriority === level}
                onChange={() => setSelectedPriority(level)}
                className="accent-blue-500"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Report Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative w-full max-w-xl bg-white rounded-xl p-6 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setIsFormOpen(false)} // Close the form when clicked
            >
              <X className="w-6 h-6" />
            </button>
            <ReportIssue setFormVisible={setIsFormOpen} /> {/* Use ReportIssue and pass setIsFormOpen */}
          </div>
        </div>
      )}

      {/* Render Cards */}
      {filteredIssues.length > 0 ? (
        <Card issues={filteredIssues} />
      ) : (
        <div className="text-center text-gray-500">No issues found.</div>
      )}
    </div>
  );
};

export default Issues;
import React, { useState, useEffect } from "react";
import { fetchLost } from "../services/fetchLost";
import LostFoundHeader from "../components/LostFoundHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getSession } from "../feature/authService";
import ReportItem from "../components/ReportItem"; // Corrected import

const Lost_Found = () => {
  const [lostItems, setLostItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
  const [selectedItem, setSelectedItem] = useState(null);

  const { user } = useAuth();
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

    const getData = async () => {
      try {
        const { data } = await fetchLost();
        setLostItems(data);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    getData();
  }, []);

  // Combined Filter
  useEffect(() => {
    let filtered = [...lostItems];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === statusFilter
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.type && item.type.toLowerCase() === typeFilter
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [statusFilter, typeFilter, searchTerm, lostItems]);

    const handleClaim = (item) => {
        setSelectedItem(item);
        // In a real application, you would open a modal or navigate to a new page
        // to confirm the claim and handle any necessary backend updates.
        alert(`You have claimed the ${item.title}.  The implementation to change status needs to be added.`);
    };


  return (
    <>
      <LostFoundHeader
        filter={typeFilter}
        setFilter={setTypeFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onReport={() => setIsFormOpen(true)} // Open form on button click
      />

      {/* Claimed/Unclaimed Filter */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${statusFilter === "claimed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("claimed")}
        >
          Claimed
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${statusFilter === "unclaimed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("unclaimed")}
        >
          Unclaimed
        </button>
      </div>

      {/* Display filtered items */}
      <div className="flex flex-wrap gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[48%] lg:w-[32%] bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
          >
            {/* Header */}
            <header className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-800">{item.title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {item.priority}
                </span>
                <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                  {item.status}
                </span>
              </div>
            </header>

            <p className="text-xs text-gray-400">{item.location}</p>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{item.description}</p>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt="Lost Item"
                  className="rounded-lg w-full h-36 object-cover"
                />
              )}
            </div>

            {/* Footer */}
            <footer className="flex justify-between items-center border-t pt-3">
              <div className="flex items-center gap-2">
                <img
                  src={item.user_avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
                  alt={item.reported_by || "Unknown"}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <p className="text-sm text-gray-600">{item.reported_by || "Unknown"}</p>
              </div>
              <button
                onClick={() => handleClaim(item)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                This is Mine
              </button>
            </footer>
          </div>
        ))}
      </div>

      {/* Render the form as a modal */}
      {isFormOpen && (
        <ReportItem setFormVisible={setIsFormOpen} />
      )}
    </>
  );
};

export default Lost_Found;

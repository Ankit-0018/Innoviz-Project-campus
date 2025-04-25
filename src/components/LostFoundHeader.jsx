import React from "react";

const LostFoundHeader = ({ filter, setFilter, searchTerm, setSearchTerm, onReport }) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost &amp; Found</h1>
          <p className="text-gray-500 text-sm">Report lost items or items you've found</p>
        </div>
        <button
          onClick={onReport}
          className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Report Item
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="🔍 Search items..."
          className="w-full md:w-[60%] px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-4">
          {["all", "lost", "found"].map((option) => (
            <label
              key={option}
              className="flex items-center text-sm font-medium text-gray-600 gap-1 cursor-pointer"
            >
              <input
                type="radio"
                name="filter"
                value={option}
                checked={filter === option}
                onChange={() => setFilter(option)}
                className="accent-purple-600"
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LostFoundHeader;

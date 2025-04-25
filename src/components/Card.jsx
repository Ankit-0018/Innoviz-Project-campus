import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const Card = ({ issues }) => {
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [upvotes, setUpvotes] = useState({});
  const [randomImageUrls, setRandomImageUrls] = useState({});
  const [userHasUpvoted, setUserHasUpvoted] = useState({}); // Track user's upvotes

  useEffect(() => {
    if (issues) {
      const initialUpvotes = {};
      const imageMap = {};
      const initialUserUpvotes = {};

      const placeholderImages = [
        'https://placehold.co/400x300/EEE/31343C?text=Issue&font=Montserrat',
      ];

      issues.forEach((issue) => {
        initialUpvotes[issue.id] = issue.upvotes || 0;
        imageMap[issue.id] = issue.image_url && issue.image_url[0]
          ? issue.image_url[0]
          : placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

        const hasUpvoted = localStorage.getItem(`upvoted_${issue.id}`);
        initialUserUpvotes[issue.id] = hasUpvoted === 'true';
      });

      setUpvotes(initialUpvotes);
      setRandomImageUrls(imageMap);
      setUserHasUpvoted(initialUserUpvotes);
    }
  }, [issues]);

  const toggleExpanded = (id) => {
    setExpandedIssueId((prevId) => (prevId === id ? null : id));
  };

  const handleUpvote = (id) => {
    setUpvotes(prevUpvotes => {
        const currentUpvotes = prevUpvotes[id] || 0;  // Ensure we have a valid number
        const newUpvotes = userHasUpvoted[id] ? currentUpvotes - 1 : currentUpvotes + 1;

        // Update the upvotes state.
        return {
            ...prevUpvotes,
            [id]: newUpvotes
        };
    });

    setUserHasUpvoted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    // Store in local storage
    localStorage.setItem(`upvoted_${id}`, String(!userHasUpvoted[id]));
  };

  if (!issues) {
    return <div>Loading issues...</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="w-full sm:w-[48%] lg:w-[32%] bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
        >
          {/* Header */}
          <header className="space-y-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {issue.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className={`px-2 py-0.5 rounded-full ${issue.priority === 'critical' ? 'bg-red-100 text-red-600' :
                issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                {issue.priority}
              </span>
              <span className={`px-2 py-0.5 rounded-full ${issue.status === 'open' ? 'bg-blue-100 text-blue-600' :
                issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-600'
                }`}>
                {issue.status}
              </span>
            </div>
          </header>

          {/* Location and time */}
          <p className="text-xs text-gray-400">{issue.location}</p>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              {expandedIssueId === issue.id
                ? issue.description
                : `${issue.description.slice(0, 100)}...`}
            </p>
            <img
              src={randomImageUrls[issue.id]}
              alt={`Issue: ${issue.title}`}
              className="rounded-lg w-full h-48 object-cover"
            />
            {issue.description.length > 100 && (
              <span
                className="text-xs text-blue-600 cursor-pointer select-none"
                onClick={() => toggleExpanded(issue.id)}
              >
                {expandedIssueId === issue.id ? "Show less ↑" : "Show more ↓"}
              </span>
            )}
          </div>

          {/* Footer */}
          <footer className="flex justify-between items-center border-t pt-3">
            <div className="flex items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt={issue.created_by || "Unknown"}
                className="w-7 h-7 rounded-full object-cover"
              />
              <p className="text-sm text-gray-600">
                {issue.created_by || "Unknown"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <button
                className="hover:text-blue-600 transition-colors"
                title="Comment"
              >
                <MessageCircle size={18} />
              </button>
              <button
                onClick={() => handleUpvote(issue.id)}
                className="hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded hover:bg-gray-100 active:scale-95"
                title="Upvote"
              >
                ↑ {upvotes[issue.id]}
              </button>
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
};

export default Card;

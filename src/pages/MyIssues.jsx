import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSession } from '../feature/authService';
import { supabase } from '../lib/supabase'; // Import your Supabase client

const MyIssues = () => {
  const [activeTab, setActiveTab] = useState('issues');
  const [userIssues, setUserIssues] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function checkSession() {
      const sess = await getSession();
      if (!sess) {
        navigate('/login');
        return;
      }
    }
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchUserIssues = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('created_by', user.id); // Filter by the user's ID

          if (error) {
            throw new Error(`Failed to fetch user issues: ${error.message}`);
          }
          setUserIssues(data);
        } catch (error) {
          console.error('Error fetching user issues:', error);
          alert('Failed to load your issues. Please try again.'); // Provide user feedback
        }
      }
    };

    fetchUserIssues();
  }, [user]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        {/* Left: Title & Tabs */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 text-sm">Manage your reported issues and items</p>

          {/* Tabs */}
          <div className="mt-4 flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
            {[
              { key: 'issues', label: 'My Issues' },
              { key: 'lost', label: 'My Lost & Found' },
              { key: 'claimed', label: 'Claimed Items' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm rounded-md font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Display user's issues */}
      {activeTab === 'issues' && (
        <div className="flex flex-wrap gap-4">
          {userIssues.length > 0 ? (
            userIssues.map((issue) => (
              <Card key={issue.id} issue={issue} /> // Assuming you have a Card component
            ))
          ) : (
            <div className="text-gray-500">You have not reported any issues.</div> // message when there are no issues.
          )}
        </div>
      )}

      {/* Lost & Found and Claimed Items - To be implemented later */}
      {activeTab === 'lost' && (
        <div className="text-gray-500">
          {' '}
          To be implemented later (My Lost & Found){' '}
        </div>
      )}
      {activeTab === 'claimed' && (
        <div className="text-gray-500">
          {' '}
          To be implemented later (Claimed Items){' '}
        </div>
      )}
    </>
  );
};

export default MyIssues;

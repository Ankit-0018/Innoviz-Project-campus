import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/fetchProfile";
import { getSession } from "../feature/authService";
import { useProfile } from "../context/ProfileContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const sess = await getSession();
      if (!sess) {
        navigate("/login");
        return;
      }

      // Check if profile data exists in localStorage
      const savedProfile = JSON.parse(localStorage.getItem("profile"));

      if (savedProfile) {
        setProfile(savedProfile); // Update context from localStorage
        setProfileInfo(savedProfile); // Set profile info
        setLoading(false);
        return;
      }

      // Fetch profile if not in localStorage
      if (profile?.user?.id) {
        try {
          const { data } = await fetchProfile(profile.user.id);
          setProfileInfo(data);
          localStorage.setItem("profile", JSON.stringify(data)); // Save profile to localStorage
          setProfile(data); // Update context
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }

      setLoading(false);
    };

    init();
  }, [navigate, profile, setProfile]);

  // Wait for profile to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  // If no profile data is found, show a message
  if (!profileInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Profile not found. Please try again later.
      </div>
    );
  }

  const userInfo = {
    name: profileInfo.full_name || "Unknown User",
    email: user?.email || "No Email",
    gender: profileInfo.gender || "Not specified",
    phone: profileInfo.phone || "N/A",
    department: profileInfo.department || "N/A",
    role: profileInfo.role || "Student",
    totalReports: profileInfo.totalReports || 0,
    profilePic: profileInfo.profilePic || "",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-600 overflow-hidden">
              {userInfo.profilePic ? (
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                userInfo.name?.[0]?.toUpperCase() || "?"
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Profile Information</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Full Name:</span> {userInfo.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {userInfo.email}
              </div>
              <div>
                <span className="font-semibold">Gender:</span> {userInfo.gender}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {userInfo.phone}
              </div>
              <div>
                <span className="font-semibold">Department:</span> {userInfo.department}
              </div>
              <div>
                <span className="font-semibold">Role:</span>{" "}
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {userInfo.role}
                </span>
              </div>
              <div>
                <span className="font-semibold">Reports Submitted:</span> {userInfo.totalReports}
              </div>
            </div>

            <div className="mt-8">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "../../src/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { User, Mail, Calendar, MapPin, ExternalLink, Shield, Edit, Activity, Settings, Bookmark, Clock } from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to home if not logged in
        router.push('/');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Let the redirect happen without rendering anything
  }

  // Get the creation time as a Date object
  const creationTime = new Date(user.metadata.creationTime);
  const formattedCreationDate = creationTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: <User size={18} /> },
    { id: "activity", label: "Activity", icon: <Activity size={18} /> },
    { id: "saved", label: "Saved Items", icon: <Bookmark size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative">
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <Image
                src={user.photoURL || "/man-avatar-clipart-illustration-free-png.webp"}
                alt={user.displayName || "User Profile"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left pb-2">
              <h1 className="text-2xl font-bold text-gray-800">{user.displayName || "User"}</h1>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>Joined {formattedCreationDate}</span>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-auto flex pb-2">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with top margin for profile overlap */}
      <div className="mt-20 sm:mt-24 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Profile Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <User className="mt-1 mr-3 text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Full Name</p>
                        <p className="text-sm text-gray-600">{user.displayName || "Not provided"}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="mt-1 mr-3 text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Shield className="mt-1 mr-3 text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email Verification</p>
                        <p className={`text-sm ${user.emailVerified ? "text-green-600" : "text-amber-600"}`}>
                          {user.emailVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="mt-1 mr-3 text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Account Created</p>
                        <p className="text-sm text-gray-600">{formattedCreationDate}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ExternalLink className="mt-1 mr-3 text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Provider</p>
                        <p className="text-sm text-gray-600">{user.providerData[0]?.providerId || "Unknown"}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <div className="text-3xl font-bold text-blue-500">0</div>
                      <div className="text-sm text-gray-600 mt-1">Posts</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <div className="text-3xl font-bold text-green-500">0</div>
                      <div className="text-sm text-gray-600 mt-1">Comments</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <div className="text-3xl font-bold text-purple-500">0</div>
                      <div className="text-sm text-gray-600 mt-1">Likes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <div className="text-3xl font-bold text-amber-500">0</div>
                      <div className="text-sm text-gray-600 mt-1">Saved</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Complete Your Profile</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">30% Complete - Add more profile details to increase your profile score!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "activity" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Activity size={48} className="mb-4 opacity-50" />
                <p className="text-lg">No recent activity found</p>
                <p className="text-sm">Start interacting with the platform to see your activity here</p>
              </div>
            </div>
          )}
          
          {activeTab === "saved" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Saved Items</h2>
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Bookmark size={48} className="mb-4 opacity-50" />
                <p className="text-lg">No saved items found</p>
                <p className="text-sm">Save items to see them listed here</p>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your personal information and how it appears to others</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                    Edit Profile
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Email & Notifications</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your email address and notification preferences</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                    Notification Settings
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Security</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your password and account security options</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                    Security Settings
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg bg-red-50">
                  <h3 className="text-lg font-medium mb-2 text-red-700">Danger Zone</h3>
                  <p className="text-sm text-red-600 mb-4">Delete your account and all associated data</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
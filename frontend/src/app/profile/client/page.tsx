'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { 
  User, 
  MapPin, 
  Building,
  Star,
  Briefcase,
  Upload,
  CheckCircle
} from 'lucide-react';

export default function ClientProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    company_name: '',
    bio: '',
    location: '',
    avatar: '',
    website: '',
    verified: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        company_name: user.company_name || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
        website: user.website || '',
        verified: user.verified || false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await api.updateProfile(profile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile.full_name.charAt(0) || 'C'}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                      <Upload className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                    {profile.verified && (
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  {profile.company_name && (
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <Building className="h-5 w-5" />
                      <span className="text-lg">{profile.company_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location || 'Not specified'}
                    </div>
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className="btn-primary"
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Name</h3>
                {editing ? (
                  <input
                    type="text"
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Your company name"
                  />
                ) : (
                  <p className="text-gray-600">{profile.company_name || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell freelancers about your company..."
                  />
                ) : (
                  <p className="text-gray-600">{profile.bio || 'No description added yet'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-600">{profile.location || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Website</h3>
                  {editing ? (
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourcompany.com"
                    />
                  ) : (
                    <p className="text-gray-600">{profile.website || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Projects Posted</h4>
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Active Projects</h4>
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Completed</h4>
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Rating</h4>
                <Star className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0.0</p>
            </div>
          </div>

          {/* Verification */}
          {!profile.verified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Verified</h3>
                  <p className="text-blue-800 mb-4">
                    Verify your account to increase trust and attract more freelancers
                  </p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Start Verification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

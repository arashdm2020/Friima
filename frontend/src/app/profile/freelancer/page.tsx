'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { 
  User, 
  MapPin, 
  DollarSign, 
  Star, 
  Award,
  Briefcase,
  Upload,
  Plus,
  X
} from 'lucide-react';

export default function FreelancerProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    bio: '',
    skills: [] as string[],
    hourly_rate: 0,
    location: '',
    avatar: '',
    resume_url: '',
    portfolio: [] as any[],
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        title: user.title || '',
        bio: user.bio || '',
        skills: user.skills || [],
        hourly_rate: user.hourly_rate || 0,
        location: user.location || '',
        avatar: user.avatar || '',
        resume_url: user.resume_url || '',
        portfolio: user.portfolio || [],
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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // آپلود رزومه به سرور/IPFS
      try {
        const result = await api.uploadToIPFS(file);
        setProfile({ ...profile, resume_url: result.url });
      } catch (error) {
        console.error('Failed to upload resume:', error);
      }
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
                  <div className="w-24 h-24 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile.full_name.charAt(0) || 'F'}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                      <Upload className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{profile.title || 'Freelancer'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location || 'Not specified'}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${profile.hourly_rate || 0}/hour
                    </div>
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

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
              {editing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell clients about yourself..."
                />
              ) : (
                <p className="text-gray-600">{profile.bio || 'No bio added yet'}</p>
              )}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    {editing && (
                      <button
                        onClick={() => setProfile({
                          ...profile,
                          skills: profile.skills.filter((_, i) => i !== index)
                        })}
                        className="hover:text-primary-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {editing && (
                  <button className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:border-primary-500 hover:text-primary-600">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Resume */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
              {profile.resume_url ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <Briefcase className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Resume.pdf</p>
                    <p className="text-sm text-gray-600">Uploaded</p>
                  </div>
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View
                  </a>
                  {editing && (
                    <button className="text-error-600 hover:text-error-700">
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No resume uploaded</p>
                  <label className="btn-primary cursor-pointer inline-block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    Upload Resume
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Portfolio</h3>
              {editing && (
                <button className="btn-primary inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Project
                </button>
              )}
            </div>

            {profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No portfolio items yet</p>
                <p className="text-sm text-gray-500">Add your best work to showcase your skills</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

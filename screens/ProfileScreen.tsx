
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import Button from '../components/Button';

interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, isEditing, onChange }) => (
  <div>
    <label className="text-sm text-white/70">{label}</label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-white/10 border-b-2 border-pink-400 text-white rounded-t-lg px-2 py-1.5 focus:outline-none"
      />
    ) : (
      <p className="text-lg font-semibold text-white p-2">{value}</p>
    )}
  </div>
);


const ProfileScreen: React.FC = () => {
  const { user, addNotification } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    id: '',
    department: 'N/A',
  });

  // Sync user data from context whenever it changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        id: user.role === 'Student' ? (user.studentId || '') : (user.cnic || ''),
        department: user.department || 'N/A',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof profileData) => {
    setProfileData(prev => ({...prev, [field]: e.target.value}));
  };

  const handleSave = () => {
      // Here you would typically call an API to save the profile data.
      addNotification({ title: 'Profile Updated', message: 'Your changes have been saved successfully.' });
      setIsEditing(false);
  }

  return (
    <div className="w-full h-full flex flex-col text-white">
      <Header title="Profile" showBackButton />
      <main className="flex-grow p-6 space-y-6 overflow-y-auto pb-24 flex flex-col">
        <div className="flex flex-col items-center space-y-2">
            <div className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center">
                <img src={`https://i.pravatar.cc/150?u=${user?.id}`} alt="User" className="w-full h-full rounded-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
            <p className="text-white/70">{user?.role}</p>
        </div>

        <div className="space-y-4 bg-white/10 p-4 rounded-lg">
            <ProfileField label="Full Name" value={profileData.fullName} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'fullName')} />
            <ProfileField label="Email Address" value={profileData.email} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'email')} />
            <ProfileField label={user?.role === 'Student' ? "Student ID" : "CNIC"} value={profileData.id || ''} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'id')} />
            {user?.role === 'Student' && (
                <ProfileField label="Department" value={profileData.department} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'department')} />
            )}
        </div>
        
        <div className="mt-auto">
            {isEditing ? (
                 <Button onClick={handleSave}>Save Profile</Button>
            ) : (
                <Button onClick={() => setIsEditing(true)} variant="secondary">Edit Profile</Button>
            )}
        </div>
        

      </main>
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
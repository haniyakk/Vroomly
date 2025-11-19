
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';


interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div>
    <label className="text-sm text-white/70">{label}</label>
    <p className="text-lg font-semibold text-white p-2">{value}</p>
  </div>
);


const ProfileScreen: React.FC = () => {
  const { user } = useAppContext();
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
  
  // Profile is view-only in this app. Edits are not available from the mobile UI.

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
            <ProfileField label="Full Name" value={profileData.fullName} />
            <ProfileField label="Email Address" value={profileData.email} />
            <ProfileField label={user?.role === 'Student' ? "Student ID" : "CNIC"} value={profileData.id || ''} />
            {user?.role === 'Student' && (
                <ProfileField label="Department" value={profileData.department} />
            )}
        </div>
        
        {/* No edit controls in view-only profile */}
        

      </main>
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
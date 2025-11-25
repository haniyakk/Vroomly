
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { supabase } from '../backend/supabaseClient';

interface SettingsItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
        <div className="mr-4 text-pink-300">{icon}</div>
        <span className="font-semibold">{label}</span>
        <div className="ml-auto text-white/50">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
    </button>
);

const SettingsScreen: React.FC = () => {
    const { setScreen, logout } = useAppContext();
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
    };

    const handleChangePassword = () => {
        localStorage.setItem('changePasswordMode', 'true');
        setScreen(Screen.FORGOT_PASSWORD);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account Deleted (mock)!");
            logout();
        }
    };

    return (
        <div className="w-full h-full flex flex-col text-white">
            <Header title="Settings" showBackButton />
            <main className="flex-grow p-6 space-y-4 overflow-y-auto pb-24">
                <SettingsItem
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                    label="View profile"
                    onClick={() => setScreen(Screen.PROFILE)}
                />
                <SettingsItem
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                    label="Change Password"
                    onClick={handleChangePassword}
                />
                 <SettingsItem
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>}
                    label="Logout"
                    onClick={handleLogout}
                />
            </main>
            <BottomNav />
        </div>
    );
};

export default SettingsScreen;
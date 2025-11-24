import React from 'react';
import { useAppContext } from '../context/AppContext';
import { VanIcon } from '../constants';
import { Screen } from '../types';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, onBack }) => {
  const { logout, setScreen } = useAppContext();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setScreen(Screen.DASHBOARD);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 text-white">
        <div className="flex items-center flex-1">
            {showBackButton && (
                <button onClick={handleBack} className="mr-4 p-1 rounded-full hover:bg-white/10">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
            )}
            {title ? (
                <h1 className="text-xl font-bold">{title}</h1>
            ) : (
                <div className="flex items-center gap-2">
                    <VanIcon width={40} height={25} />
                  <h1 className="text-xl font-bold">VROOMLY</h1>
                </div>
            )}
        </div>
      
      <button
        onClick={logout}
        aria-label="Logout"
        title="Logout"
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm border border-[#FF4D4D] bg-[#FF4D4D]/30 hover:bg-[#FF4D4D]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D4D]/50"
      >
        <span className="text-white">Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    </div>
  );
};

export default Header;
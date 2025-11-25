import React from 'react';
import { useAppContext } from '../context/AppContext';
import { markStatus } from '../backend/supabaseSessionApi';
import { Screen } from '../types';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';

const ReminderCard: React.FC<{ time: string; pickup: string }> = ({ time, pickup }) => (
    <div className="bg-white/10 border border-white/10 p-3 rounded-lg text-center flex-1 backdrop-blur-sm shadow-sm">
        <p className="text-white font-semibold">{time}</p>
        <p className="text-white/70 text-sm">Pickup - {pickup}</p>
    </div>
);

const StudentDashboard: React.FC = () => {
    const { user, setScreen, addNotification } = useAppContext();

  return (
    <div className="w-full h-full flex flex-col text-white">
      <Header />
      <main className="flex-grow p-6 space-y-6 overflow-y-auto pb-24">
        <div className="bg-white/10 border border-white/12 p-4 rounded-lg backdrop-blur-sm shadow-sm">
            <h2 className="text-2xl font-bold">WELCOME {user?.fullName?.replace(/^Mr\. /i, '').split(' ')[0].toUpperCase() || 'STUDENT'}</h2>
            <p className="text-white/70">Are you ready for today's ride?</p>
        </div>

        <div>
            <h3 className="font-semibold mb-2">Reminders</h3>
            <div className="flex space-x-3">
                <ReminderCard time="Morning" pickup="7:00 am" />
                <ReminderCard time="Noon" pickup="2:00 pm" />
                <ReminderCard time="Evening" pickup="5:00 pm" />
            </div>
        </div>

                <div className="bg-white/10 p-4 rounded-lg flex flex-col items-center justify-center space-y-3 border border-white/12 hover:shadow-md transition-shadow">
                    <div className="text-center">
                        <h3 className="font-semibold text-lg">Mark your status</h3>
                        <p className="text-white/70 text-sm">Select your attendance for this session.</p>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={async () => {
                                const studentId = user?.id;
                                const sessionId = localStorage.getItem('active_session');
                                if (!studentId || !sessionId) {
                                    addNotification({ title: 'Error', message: 'No active session or not signed in' });
                                    return;
                                }
                                const res = await markStatus({ studentId, sessionId, status: 'present' });
                                if (res.error) addNotification({ title: 'Error', message: res.error }); else addNotification({ title: 'Status updated', message: 'Your attendance has been recorded.' });
                        }} className="px-4 py-2 bg-green-500 rounded">Present</button>
                        <button onClick={async () => {
                                const studentId = user?.id;
                                const sessionId = localStorage.getItem('active_session');
                                if (!studentId || !sessionId) {
                                    addNotification({ title: 'Error', message: 'No active session or not signed in' });
                                    return;
                                }
                                const res = await markStatus({ studentId, sessionId, status: 'coming' });
                                if (res.error) addNotification({ title: 'Error', message: res.error }); else addNotification({ title: 'Status updated', message: 'Your attendance has been recorded.' });
                        }} className="px-4 py-2 bg-yellow-500 rounded">Coming</button>
                    </div>
                </div>

        <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/12 hover:shadow-md transition-shadow">
             <div>
                 <h3 className="font-semibold text-lg">Not taking the van?</h3>
                 <p className="text-white/70 text-sm">Drop a message early to let others know.</p>
             </div>
             <Button onClick={() => setScreen(Screen.MESSAGES)} className="w-auto px-4 py-2 text-sm">Send Message</Button>
         </div>

        <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/12 hover:shadow-md transition-shadow">
             <div>
                 <h3 className="font-semibold text-lg">Got any issues with the driver?</h3>
                 <p className="text-white/70 text-sm">Submit a complaint here.</p>
             </div>
             <Button onClick={() => setScreen(Screen.COMPLAINT)} className="w-auto px-4 py-2 text-sm">Submit Complaint</Button>
         </div>
       </main>
       <BottomNav />
     </div>
   );
};

export default StudentDashboard;
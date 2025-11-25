import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import { startSession } from '../backend/supabaseSessionApi';

const ReminderCard: React.FC<{ time: string, pickup: string }> = ({ time, pickup }) => (
    <div className="bg-white/10 p-3 rounded-lg text-center flex-1 border border-white/12 hover:shadow-md transition-shadow">
        <p className="text-white font-semibold">{time}</p>
        <p className="text-white/70 text-sm">Pickup - {pickup}</p>
    </div>
);

const DriverDashboard: React.FC = () => {
    const { user, setScreen, addNotification } = useAppContext();

    const handleSendReminder = async () => {
        const driverId = user?.id;
        if (!driverId) {
            addNotification({ title: 'Error', message: 'Driver not signed in.' });
            return;
        }

        const result = await startSession(driverId);
        if (result.error) {
            addNotification({ title: 'Error', message: result.error });
            return;
        }

        const newSessionId = result.session_id;
        try {
            localStorage.setItem('active_session', String(newSessionId));
        } catch (e) {
            console.warn('Could not access localStorage', e);
        }

        addNotification({ title: 'Session Started', message: 'Reminder sent and session started!' });
    };

  return (
    <div className="w-full h-full flex flex-col text-white">
      <Header />
      <main className="flex-grow p-6 space-y-6 overflow-y-auto pb-24">
        <div className="bg-white/10 p-4 rounded-lg border border-white/12 hover:shadow-md transition-shadow">
             <h2 className="text-2xl font-bold">WELCOME {user?.fullName?.toUpperCase() || 'DRIVER'}</h2>
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
        
        <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/12 hover:shadow-md transition-shadow">
            <div>
                <h3 className="font-semibold text-lg">Student List</h3>
                <p className="text-white/70 text-sm">Check today's attendance.</p>
            </div>
            <Button onClick={() => setScreen(Screen.ATTENDANCE)} className="w-auto px-4 py-2 text-sm">View List</Button>
        </div>

        <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/12 hover:shadow-md transition-shadow">
            <div>
                <h3 className="font-semibold text-lg">Send reminders</h3>
                <p className="text-white/70 text-sm">Broadcast reminders, get their status.</p>
            </div>
            <Button onClick={handleSendReminder} className="w-auto px-4 py-2 text-sm">Send Reminder</Button>
        </div>

        <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/12 hover:shadow-md transition-shadow">
            <div>
                <h3 className="font-semibold text-lg">Check Inbox</h3>
                <p className="text-white/70 text-sm">Respond to student messages.</p>
            </div>
             <Button onClick={() => setScreen(Screen.MESSAGES)} className="w-auto px-4 py-2 text-sm">Message</Button>
        </div>

      </main>
      <BottomNav />
    </div>
  );
};

export default DriverDashboard;
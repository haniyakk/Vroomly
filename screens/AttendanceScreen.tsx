import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, Student as StudentType, AttendanceStatus } from '../types';
import { MOCK_STUDENTS } from '../constants';
import Button from '../components/Button';
import { fetchViewList } from '../backend/supabaseSessionApi';

const AttendanceButton: React.FC<{
  label: AttendanceStatus;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, isActive, onClick, disabled }) => {
  const activeClasses = {
    [AttendanceStatus.PRESENT]: 'bg-green-500 text-white',
    [AttendanceStatus.ABSENT]: 'bg-red-500 text-white',
    [AttendanceStatus.PENDING]: 'bg-yellow-500 text-white',
  }
  return (
    <button
      onClick={() => { if (!disabled) onClick(); }}
      disabled={disabled}
      className={`px-2 py-1 text-xs rounded transition-all ${isActive ? activeClasses[label] : 'bg-white/20 text-white/80'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

const StudentRow: React.FC<{
  student: StudentType;
  onStatusChange: (id: string, status: AttendanceStatus) => void;
  disabled?: boolean;
}> = ({ student, onStatusChange, disabled }) => {
    return (
        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
            <div>
                <p className="font-semibold text-white">{student.name}</p>
                <p className="text-xs text-white/70">{student.studentId}</p>
            </div>
            <div className="flex space-x-1.5">
        <AttendanceButton label={AttendanceStatus.PRESENT} isActive={student.status === AttendanceStatus.PRESENT} onClick={() => onStatusChange(student.id, AttendanceStatus.PRESENT)} disabled={disabled} />
        <AttendanceButton label={AttendanceStatus.ABSENT} isActive={student.status === AttendanceStatus.ABSENT} onClick={() => onStatusChange(student.id, AttendanceStatus.ABSENT)} disabled={disabled} />
        <AttendanceButton label={AttendanceStatus.PENDING} isActive={student.status === AttendanceStatus.PENDING} onClick={() => onStatusChange(student.id, AttendanceStatus.PENDING)} disabled={disabled} />
            </div>
        </div>
    );
};

const AttendanceScreen: React.FC = () => {
  const { setScreen, addNotification, role } = useAppContext();
  const [students, setStudents] = useState<StudentType[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const presentCount = useMemo(() => students.filter(s => s.status === AttendanceStatus.PRESENT).length, [students]);
  const capacity = 12;

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    if(isLocked) return;
    setStudents(prev => prev.map(s => s.id === id ? {...s, status} : s));
  };

  // If there is an active session, fetch live attendance list for driver view
  useEffect(() => {
    const sessionId = localStorage.getItem('active_session');
    if (!sessionId) return;

    fetchViewList(sessionId).then(res => {
      if (res.error) {
        console.error('fetchViewList error', res.error);
        return;
      }

      // Map returned rows to StudentType
      const mapped: StudentType[] = (res.data || []).map((row: any) => ({
        id: row.student_id,
        name: row.users?.name || 'Unknown',
        studentId: row.users?.reg_no || '',
        status: row.status === 'present' ? AttendanceStatus.PRESENT : (row.status === 'coming' ? AttendanceStatus.PENDING : AttendanceStatus.ABSENT),
      }));

      setStudents(mapped);
    }).catch(err => console.error('fetchViewList exception', err));
  }, []);
  
  const filteredStudents = useMemo(() => {
    let list = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if(isLocked) {
        list = list.filter(s => s.status === AttendanceStatus.PRESENT || s.status === AttendanceStatus.PENDING);
    }
    return list;
  }, [students, searchTerm, isLocked]);

  const handleSendReminder = () => {
    addNotification({
        title: 'Van Reminder',
        message: 'The driver has sent a reminder for the upcoming trip.',
        targetRole: 'Student'
    });
    addNotification({
        title: 'Sent!',
        message: 'Reminder sent to all students.'
    });
  }

  return (
    <div className="w-full h-full flex flex-col text-white">
      <div className="p-4 flex items-center">
         <button onClick={() => setScreen(Screen.DASHBOARD)} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
         </button>
         <h1 className="text-xl font-bold">Student Attendance</h1>
      </div>
      
      <main className="flex-grow p-6 pt-0 flex flex-col min-h-0">
        <div className="bg-white/10 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">VAN 1</h3>
                <p className="text-sm text-white/80">Capacity: {presentCount}/{capacity}</p>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
                <div className="bg-pink-400 h-2.5 rounded-full" style={{width: `${(presentCount/capacity) * 100}%`}}></div>
            </div>
            <p className="text-sm mt-2 font-semibold">Trip: Morning Pickup</p>
        </div>

        <div className="relative mb-4">
            <input 
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2E2E55] border-transparent text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {filteredStudents.length > 0 ? filteredStudents.map(student => (
              <StudentRow key={student.id} student={student} onStatusChange={handleStatusChange} disabled={role === 'Driver'} />
            )) : <p className="text-center text-white/70">No students found.</p>}
        </div>
      </main>
      
      <footer className="p-6 border-t border-white/10">
        <Button onClick={handleSendReminder}>Send Reminder</Button>
        <p className="text-center text-sm text-white/70 mt-3">Attendance locks at 7:10 AM</p>
      </footer>
    </div>
  );
};

export default AttendanceScreen;
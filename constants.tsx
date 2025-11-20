import React from 'react';
import { Student, AttendanceStatus, Conversation } from './types';

export const VanIcon: React.FC<{ className?: string, width?: number, height?: number }> = ({ className, width = 120, height = 74 }) => (
    <svg className={className} width={width} height={height} viewBox="0 0 120 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M107.943 66.864H11.231C8.611 66.864 6.471 64.724 6.471 62.104V24.577C6.471 19.344 10.686 15.129 15.919 15.129H89.231C94.464 15.129 98.679 19.344 98.679 24.577V29.81H109.83C113.33 29.81 115.83 33.31 114.33 36.56L110.088 45.815C108.588 49.065 105.338 51.065 101.838 51.065H98.679V62.104C98.679 64.724 96.539 66.864 93.919 66.864H107.943Z" fill="#FAD1D1" stroke="#2F2E41" strokeWidth="4"/>
        <path d="M98.679 29.81H6.471V45.815H98.679V29.81Z" fill="#FAD1D1" stroke="#2F2E41" strokeWidth="4"/>
        <path d="M22.096 37.812H37.448" stroke="#2F2E41" strokeWidth="4" strokeLinecap="round"/>
        <path d="M52.096 37.812H82.448" stroke="#2F2E41" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="27.448" cy="61.432" r="8.432" fill="#FAD1D1" stroke="#2F2E41" strokeWidth="4"/>
        <circle cx="79.948" cy="61.432" r="8.432" fill="#FAD1D1" stroke="#2F2E41" strokeWidth="4"/>
        <path d="M110.088 45.815L114.33 36.56C115.83 33.31 113.33 29.81 109.83 29.81H98.679V51.065H101.838C105.338 51.065 108.588 49.065 110.088 45.815Z" fill="#E8B0B0" stroke="#2F2E41" strokeWidth="4"/>
    </svg>
);

export const StudentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3A3A69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const DriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3A3A69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <line x1="12" y1="4" x2="12" y2="10"></line>
        <line x1="12" y1="14" x2="12" y2="20"></line>
        <line x1="20" y1="12" x2="14" y2="12"></line>
        <line x1="10" y1="12" x2="4" y2="12"></line>
    </svg>
);

export const DEPARTMENTS = [
  'Computer Science Department',
  'Software Engineering Department',
  'Environments Science Department',
  'Business Administration Department',
];

export const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Haniyya Khan', studentId: '01-00000-000', status: AttendanceStatus.PENDING },
    { id: '2', name: 'Abdul Mannan', studentId: 'BSSE-01024', status: AttendanceStatus.PENDING },
    { id: '3', name: 'Fatima Khan', studentId: 'BSCS-01022', status: AttendanceStatus.PENDING },
    { id: '4', name: 'Saif ur Rehman', studentId: 'BSCS-01035', status: AttendanceStatus.PENDING },
    { id: '5', name: 'Hadia Khan', studentId: 'BSEE-01012', status: AttendanceStatus.PENDING },
    { id: '6', name: 'Saif ul Mannan', studentId: 'BSDS-01099', status: AttendanceStatus.PENDING },
    { id: '7', name: 'Alina Amel', studentId: 'BSAF-01029', status: AttendanceStatus.PENDING },
    { id: '8', name: 'Ahmed Ali', studentId: 'BSCS-01045', status: AttendanceStatus.PENDING },
    { id: '9', name: 'Zainab Ahmed', studentId: 'BSSE-01050', status: AttendanceStatus.PENDING },
    { id: '10', name: 'Usman Tariq', studentId: 'BSCS-01055', status: AttendanceStatus.PENDING },
    { id: '11', name: 'Ayesha Khan', studentId: 'BSDS-01060', status: AttendanceStatus.PENDING },
    { id: '12', name: 'Bilal Hasan', studentId: 'BSEE-01065', status: AttendanceStatus.PENDING },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        name: 'Ali (Driver)',
        avatar: '',
        messages: [
            { id: 1, text: 'Hi, just a reminder that the morning pickup is at 7:00 AM sharp tomorrow.', sender: 'other', timestamp: '8:15 PM' },
            { id: 2, text: 'Got it, thanks for the heads up!', sender: 'me', timestamp: '8:16 PM' },
            { id: 3, text: 'No problem. See you tomorrow!', sender: 'other', timestamp: '8:17 PM' },
        ]
    }
];
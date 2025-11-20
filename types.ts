export enum Screen {
  SPLASH,
  LAUNCH,
  AUTH,
  FORGOT_PASSWORD,
  DASHBOARD,
  COMPLAINT,
  ATTENDANCE,
  PROFILE,
  SETTINGS,
  MESSAGES,
  CHANGE_PASSWORD,
}

export type Role = 'Student' | 'Driver';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  studentId?: string;
  cnic?: string;
  department?: string;
  user_type?: string;
}

export enum AttendanceStatus {
    PENDING = 'Coming',
    PRESENT = 'Present',
    ABSENT = 'Absent',
}

export interface Student {
    id: string;
    name: string;
    studentId: string;
    status: AttendanceStatus;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  targetRole?: Role;
}

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
}
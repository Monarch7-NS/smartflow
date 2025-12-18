
export type UserRole = 'patient' | 'doctor' | 'personnel';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface Patient {
  name: string;
  id: string;
  appointmentTime: string; // HH:mm
  doctor: string;
  department: string;
}

export interface AppointmentStatus {
  status: 'on-time' | 'delayed' | 'significant-delay';
  estimatedTime: string; // HH:mm
  delayMinutes: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface NavigationStep {
  id: number;
  instruction: string;
  distance: number; // meters
  type: 'straight' | 'turn-left' | 'turn-right' | 'elevator' | 'stairs' | 'destination';
  targetHeading: number; // 0-360 degrees
}

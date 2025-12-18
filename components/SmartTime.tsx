import React, { useState, useEffect } from 'react';
import { Patient, AppointmentStatus } from '../types';
import { CheckCircle, AlertTriangle, Coffee } from 'lucide-react';
import { Button } from './Button';
import { useLanguage, useAuth } from '../App';

interface SmartTimeProps {
  patient: Patient;
  status: AppointmentStatus;
}

export const SmartTime: React.FC<SmartTimeProps> = ({ patient, status }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getFreeTime = () => {
    return 25; // Mock data
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'on-time': return 'bg-clinic-success';
      case 'delayed': return 'bg-clinic-warning';
      case 'significant-delay': return 'bg-clinic-alert';
      default: return 'bg-gray-500';
    }
  };

  // Determine display name based on auth context
  const displayName = user ? user.name.split(' ')[0] : patient.name.split(' ')[0];
  const displayInitial = user ? user.name.charAt(0) : patient.name.charAt(0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-2xl mx-auto">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.smartTime.hello}, {displayName}
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            {t.smartTime.apptWith} <span className="font-semibold text-clinic-blue dark:text-clinic-accent">{patient.doctor}</span>
          </p>
        </div>
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-clinic-blue text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg ring-4 ring-white dark:ring-clinic-dark-surface">
          {displayInitial}
        </div>
      </div>

      {/* Main Status Card */}
      <div className="bg-white dark:bg-clinic-dark-surface rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 p-6 md:p-8 relative overflow-hidden transition-colors duration-300">
        <div className={`absolute top-0 left-0 w-full h-2 ${getStatusColor()}`}></div>
        
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">{t.smartTime.scheduled}</p>
            <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-600 font-semibold line-through decoration-red-400 decoration-2">
              {patient.appointmentTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-clinic-blue dark:text-clinic-accent text-xs md:text-sm font-bold uppercase tracking-wider mb-1">{t.smartTime.estimatedPassage}</p>
            <p className={`text-5xl md:text-7xl font-bold tracking-tighter ${
              status.status === 'on-time' ? 'text-clinic-success' : 
              status.status === 'delayed' ? 'text-clinic-warning' : 'text-clinic-alert'
            }`}>
              {status.estimatedTime}
            </p>
          </div>
        </div>

        {status.delayMinutes > 0 && (
          <div className="flex items-start md:items-center gap-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 p-4 rounded-2xl mb-6 text-sm border border-orange-100 dark:border-orange-800/30">
            <AlertTriangle size={20} className="shrink-0" />
            <span>Dr. Martin {t.smartTime.late} <strong>{status.delayMinutes} {t.smartTime.minsLate}</strong>.</span>
          </div>
        )}

        {/* Free Time Indicator */}
        <div className="bg-clinic-light dark:bg-slate-800 rounded-2xl p-5 flex items-center gap-5 transition-colors">
            <div className="bg-white dark:bg-slate-700 p-3 md:p-4 rounded-full text-clinic-blue dark:text-clinic-accent shadow-sm">
                <Coffee size={24} />
            </div>
            <div>
                <p className="text-clinic-blue dark:text-white font-bold text-lg md:text-xl">{t.smartTime.haveMins} {getFreeTime()} {t.smartTime.mins}</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.smartTime.relax}</p>
            </div>
        </div>
      </div>

      {/* Check In Action */}
      {!isCheckedIn ? (
        <div className="bg-white dark:bg-clinic-dark-surface p-6 md:p-8 rounded-3xl shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 text-center transition-colors">
          <p className="mb-6 text-gray-600 dark:text-gray-300">{t.smartTime.confirmArrival}</p>
          <Button fullWidth onClick={() => setIsCheckedIn(true)}>
            {t.smartTime.arriveBtn}
          </Button>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/10 p-6 md:p-8 rounded-3xl border border-green-100 dark:border-green-800/30 flex flex-col items-center justify-center text-center animate-pulse-once">
          <div className="bg-white dark:bg-green-900/20 p-4 rounded-full mb-4">
             <CheckCircle className="text-green-500" size={48} />
          </div>
          <h3 className="text-green-800 dark:text-green-400 font-bold text-xl mb-2">{t.smartTime.checkedIn}</h3>
          <p className="text-green-600 dark:text-green-300 text-sm">{t.smartTime.headTo}</p>
        </div>
      )}
    </div>
  );
};
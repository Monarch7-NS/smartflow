import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { 
    Users, Clock, Activity, Bell, MoreHorizontal, 
    AlertCircle, Play, ShieldAlert, Sparkles, Calendar, CheckSquare
} from 'lucide-react';
import { Button } from './Button';

interface QueueItem {
  id: string;
  time: string;
  name: string;
  reason: string;
  status: 'checked-in' | 'late' | 'consulting' | 'waiting' | 'done';
  priority: 'normal' | 'high' | 'critical';
  notes?: string;
}

const MOCK_QUEUE: QueueItem[] = [
  { id: '1', time: '13:45', name: 'Marc Lavoine', reason: 'Initial Consult', status: 'consulting', priority: 'normal', notes: 'Referral from Dr. House' },
  { id: '2', time: '14:00', name: 'Sophie Dubois', reason: 'Orthopedics Check', status: 'checked-in', priority: 'high', notes: 'Post-op week 4' },
  { id: '3', time: '14:30', name: 'Pierre Niney', reason: 'Emergency', status: 'late', priority: 'critical', notes: 'Reported severe pain' },
  { id: '4', time: '15:00', name: 'Alain Delon', reason: 'Surgery Prep', status: 'waiting', priority: 'normal' },
  { id: '5', time: '15:30', name: 'Marion Cotillard', reason: 'Follow-up', status: 'waiting', priority: 'normal' },
  { id: '6', time: '16:00', name: 'Jean Dujardin', reason: 'X-Ray Review', status: 'waiting', priority: 'normal' },
];

export const DoctorDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAction = (action: string) => {
      alert(`${action} triggered.`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* --- Top Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-clinic-dark-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
           <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">{t.doctor.title}</p>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
               Dr. {user?.name.split(' ')[1] || 'Martin'}
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">
             {t.doctor.room}
           </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">14:12</span>
                <span className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">System Normal</span>
            </div>
            <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clinic-blue to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                DM
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- Left Column: Stats & Actions --- */}
        <div className="space-y-6 lg:col-span-1">
             {/* Key Metrics Small */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-white dark:bg-clinic-dark-surface p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">{t.doctor.stats.waiting}</span>
                        <Users size={16} className="text-clinic-blue" />
                     </div>
                     <p className="text-2xl font-black text-gray-900 dark:text-white">12</p>
                </div>
                <div className="bg-white dark:bg-clinic-dark-surface p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">{t.doctor.stats.delay}</span>
                        <Clock size={16} className="text-orange-500" />
                     </div>
                     <p className="text-2xl font-black text-orange-500">+25m</p>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white dark:bg-clinic-dark-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-clinic-accent" />
                    {t.doctor.actions.title}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <button onClick={() => handleAction('Delay')} className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 text-xs font-semibold hover:bg-orange-100 transition-colors flex items-center gap-3 text-left border border-orange-100 dark:border-orange-900/20">
                        <Clock size={20} className="shrink-0" />
                        <span>{t.doctor.actions.notifyDelay}</span>
                    </button>
                    <button onClick={() => handleAction('Next')} className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-3 text-left border border-blue-100 dark:border-blue-900/20">
                        <Play size={20} className="shrink-0" />
                        <span>{t.doctor.actions.next}</span>
                    </button>
                    <button onClick={() => handleAction('Cleaning')} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 transition-colors flex items-center gap-3 text-left border border-purple-100 dark:border-purple-900/20">
                        <Sparkles size={20} className="shrink-0" />
                        <span>{t.doctor.actions.cleaning}</span>
                    </button>
                    <button onClick={() => handleAction('Emergency')} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-3 text-left border border-red-100 dark:border-red-900/20">
                        <ShieldAlert size={20} className="shrink-0" />
                        <span>{t.doctor.actions.emergency}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* --- Main Area: Detailed Queue --- */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-clinic-dark-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-clinic-light dark:bg-slate-800 p-2 rounded-lg text-clinic-blue dark:text-clinic-accent">
                            <Calendar size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.doctor.queue.title}</h3>
                    </div>
                    <div className="flex gap-2">
                         <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                            Today, {new Date().toLocaleDateString()}
                         </span>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold pl-8">{t.doctor.queue.time}</th>
                                <th className="p-5 font-semibold">{t.doctor.queue.patient}</th>
                                <th className="p-5 font-semibold">{t.doctor.queue.reason}</th>
                                <th className="p-5 font-semibold">{t.doctor.queue.status}</th>
                                <th className="p-5 font-semibold text-right pr-8">{t.doctor.queue.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {queue.map((q) => (
                                <React.Fragment key={q.id}>
                                <tr 
                                    onClick={() => setSelectedId(selectedId === q.id ? null : q.id)}
                                    className={`group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer ${selectedId === q.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <td className="p-5 pl-8 font-mono text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                                        {q.time}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {q.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{q.name}</p>
                                                {q.priority === 'critical' && <p className="text-xs text-red-500 font-bold mt-0.5">⚠️ High Priority</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-600 dark:text-gray-400">
                                        {q.reason}
                                    </td>
                                    <td className="p-5">
                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            q.status === 'consulting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-pulse' :
                                            q.status === 'checked-in' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' :
                                            q.status === 'late' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' :
                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                q.status === 'consulting' ? 'bg-blue-500' :
                                                q.status === 'checked-in' ? 'bg-green-500' :
                                                q.status === 'late' ? 'bg-red-500' :
                                                'bg-gray-400'
                                            }`}></span>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <button className="p-2 text-gray-400 hover:text-clinic-blue transition-colors hover:bg-white dark:hover:bg-gray-700 rounded-lg">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                                {selectedId === q.id && (
                                    <tr className="bg-gray-50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800">
                                        <td colSpan={5} className="p-5 pl-8 pr-8">
                                            <div className="flex gap-6 animate-fade-in">
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Patient Notes</p>
                                                    <div className="bg-white dark:bg-clinic-dark-bg p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {q.notes || "No specific notes available for this patient."}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-1/3">
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Next Actions</p>
                                                    <div className="flex flex-col gap-2">
                                                        <Button fullWidth variant="primary" className="!py-2 text-sm justify-center">
                                                            Call Patient
                                                        </Button>
                                                        <Button fullWidth variant="secondary" className="!py-2 text-sm justify-center">
                                                            <CheckSquare size={16} /> Mark Done
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
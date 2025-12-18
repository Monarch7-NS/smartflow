import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { Thermometer, Activity, AlertCircle, TrendingUp, TrendingDown, Minus, Users, DoorOpen } from 'lucide-react';

interface ZoneData {
    id: string;
    label: string;
    occupancy: number; // 0-100%
    capacity: number;
    trend: 'up' | 'down' | 'stable';
    path: string; // SVG Path
    textPos: { x: number, y: number };
}

export const DoctorMonitoring: React.FC = () => {
  const { t } = useLanguage();
  
  // Define zones based on the provided floor plan geometry (800x600 coordinate system)
  const [zones, setZones] = useState<ZoneData[]>([
      { 
          id: 'waiting', 
          label: 'Waiting Room', 
          occupancy: 75, 
          capacity: 40, 
          trend: 'up',
          path: "M50,400 L350,400 L350,550 L50,550 Z", // Bottom Left
          textPos: { x: 200, y: 475 }
      },
      { 
          id: 'treatment', 
          label: 'Treatment Wing', 
          occupancy: 45, 
          capacity: 20, 
          trend: 'stable',
          path: "M50,50 L750,50 L750,180 L50,180 Z", // Top Strip
          textPos: { x: 400, y: 115 }
      },
      { 
          id: 'lab', 
          label: 'Sterilization / Lab', 
          occupancy: 10, 
          capacity: 5, 
          trend: 'down',
          path: "M250,220 L550,220 L550,320 L450,380 L250,320 Z", // Center Island
          textPos: { x: 400, y: 300 }
      },
      { 
          id: 'consultation', 
          label: 'Consultation', 
          occupancy: 90, 
          capacity: 10, 
          trend: 'up',
          path: "M600,200 L750,200 L750,400 L600,400 Z", // Right Room
          textPos: { x: 675, y: 300 }
      },
      { 
          id: 'reception', 
          label: 'Reception', 
          occupancy: 30, 
          capacity: 15, 
          trend: 'stable',
          path: "M450,420 Q550,420 550,520 L550,550 L400,550 L400,520 Q400,420 450,420 Z", // Bottom Right curved
          textPos: { x: 475, y: 500 }
      },
  ]);

  // Simulate dynamic heatmap updates
  useEffect(() => {
    const interval = setInterval(() => {
        setZones(prev => prev.map(z => ({
            ...z,
            occupancy: Math.min(100, Math.max(0, z.occupancy + (Math.random() * 15 - 7.5)))
        })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (occupancy: number) => {
      if (occupancy < 30) return 'fill-emerald-400/30 stroke-emerald-500';
      if (occupancy < 70) return 'fill-amber-400/30 stroke-amber-500';
      return 'fill-rose-500/40 stroke-rose-600 animate-pulse-slow';
  };

  const getTrendIcon = (trend: ZoneData['trend']) => {
      if (trend === 'up') return <TrendingUp size={16} className="text-red-500" />;
      if (trend === 'down') return <TrendingDown size={16} className="text-green-500" />;
      return <Minus size={16} className="text-gray-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 bg-white dark:bg-clinic-dark-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-3">
               <Activity className="text-clinic-blue" />
               {t.doctor.heatmap.title}
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-9">
             Live floor plan monitoring. Airlock sensors active.
           </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
             <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                 <Users size={18} className="text-gray-500" />
                 <span className="text-sm font-bold text-gray-900 dark:text-white">42 Active Patients</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- Main Floor Plan Area --- */}
        <div className="lg:col-span-9 bg-white dark:bg-clinic-dark-surface p-1 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden h-[600px] lg:h-[700px]">
             
             {/* Legend Overlay */}
             <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Thermometer size={14} /> Density Levels
                 </h3>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Low (&lt;30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Med (30-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">High (&gt;70%)</span>
                    </div>
                 </div>
             </div>

             {/* SVG Map */}
             <div className="w-full h-full bg-[#f8fafc] dark:bg-[#0f172a] rounded-2xl flex items-center justify-center p-4 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                     style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* --- Architectural Structure (Walls) --- */}
                    <g className="stroke-gray-300 dark:stroke-gray-700 stroke-[4] fill-white dark:fill-gray-900">
                        {/* Outer Perimeter */}
                        <path d="M10,10 L790,10 L790,590 L450,590 L450,550 L350,550 L350,590 L10,590 Z" />
                        
                        {/* Airlock / Entrance */}
                        <path d="M350,550 L350,520 L450,520 L450,550" className="fill-none stroke-gray-400 dark:stroke-gray-600 stroke-[2]" />
                        <text x="400" y="580" textAnchor="middle" className="text-[10px] fill-gray-400 font-mono tracking-widest uppercase border-none stroke-none">Airlock</text>
                    </g>

                    {/* --- Furniture Details (Static) --- */}
                    <g className="opacity-20 pointer-events-none fill-gray-400">
                        {/* Treatment Chairs Top */}
                        {[100, 200, 300, 400, 500, 600, 700].map(x => (
                            <rect key={x} x={x} y={60} width="40" height="60" rx="5" />
                        ))}
                        {/* Waiting Room Chairs */}
                        <circle cx="100" cy="450" r="15" />
                        <circle cx="150" cy="450" r="15" />
                        <circle cx="200" cy="450" r="15" />
                        <circle cx="100" cy="500" r="15" />
                        <circle cx="150" cy="500" r="15" />
                        <circle cx="200" cy="500" r="15" />
                        
                        {/* Office Desk */}
                        <rect x="620" y="250" width="100" height="40" rx="2" />
                    </g>

                    {/* --- Interactive Zones --- */}
                    {zones.map(zone => (
                        <g key={zone.id} className="group cursor-pointer transition-all duration-300 hover:opacity-90">
                            <path 
                                d={zone.path} 
                                className={`stroke-[2] transition-colors duration-700 ease-in-out ${getHeatColor(zone.occupancy)}`}
                            />
                            
                            {/* Zone Labels & Stats */}
                            <g className="pointer-events-none">
                                <rect 
                                    x={zone.textPos.x - 60} 
                                    y={zone.textPos.y - 20} 
                                    width="120" 
                                    height="40" 
                                    rx="20" 
                                    className="fill-white/90 dark:fill-gray-900/90 shadow-sm"
                                />
                                <text 
                                    x={zone.textPos.x} 
                                    y={zone.textPos.y} 
                                    textAnchor="middle" 
                                    className="text-[10px] font-bold fill-gray-800 dark:fill-gray-200 uppercase tracking-wide font-sans stroke-none"
                                >
                                    {zone.label}
                                </text>
                                <text 
                                    x={zone.textPos.x} 
                                    y={zone.textPos.y + 12} 
                                    textAnchor="middle" 
                                    className="text-[11px] font-bold fill-gray-500 font-mono stroke-none"
                                >
                                    {Math.round(zone.occupancy)}% occ.
                                </text>
                            </g>
                        </g>
                    ))}

                    {/* --- Dynamic Elements (Simulation) --- */}
                    <g>
                        <circle cx="400" cy="250" r="5" className="fill-blue-500 animate-[ping_3s_ease-in-out_infinite]" />
                        <circle cx="650" cy="300" r="4" className="fill-indigo-500 animate-[bounce_2s_infinite]" />
                        {/* Moving dots in corridor */}
                        <circle r="4" className="fill-gray-400 dark:fill-gray-500">
                            <animateMotion dur="10s" repeatCount="indefinite" path="M400,520 L400,350 L200,350 L200,150" />
                        </circle>
                        <circle r="4" className="fill-gray-400 dark:fill-gray-500">
                            <animateMotion dur="15s" repeatCount="indefinite" begin="2s" path="M400,520 L400,350 L600,300" />
                        </circle>
                    </g>

                </svg>
             </div>
        </div>

        {/* --- Sidebar: Detailed Metrics --- */}
        <div className="lg:col-span-3 space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Zone Details</h3>
            {zones.map(zone => (
                <div key={zone.id} className="bg-white dark:bg-clinic-dark-surface p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                             <div className={`w-3 h-3 rounded-full shadow-sm ${
                                 zone.occupancy > 70 ? 'bg-rose-500' : 
                                 zone.occupancy > 30 ? 'bg-amber-400' : 'bg-emerald-400'
                             }`}></div>
                             <div>
                                 <p className="font-bold text-gray-900 dark:text-white text-sm">{zone.label}</p>
                                 <p className="text-[10px] text-gray-400 font-medium">Capacity: {zone.capacity}</p>
                             </div>
                         </div>
                         {getTrendIcon(zone.trend)}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                zone.occupancy > 70 ? 'bg-rose-500' : 
                                zone.occupancy > 30 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${zone.occupancy}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400">{Math.round(zone.occupancy)}% Full</span>
                        {zone.occupancy > 85 && (
                            <span className="text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle size={10} /> Overload
                            </span>
                        )}
                    </div>
                </div>
            ))}
            
            {/* Quick Actions for Map */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                <h4 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">
                    <DoorOpen size={16} /> Auto-Diverting
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                    High density detected in waiting room. New arrivals are being routed to overflow seating Area B.
                </p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Override Protocol
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
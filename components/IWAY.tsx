import React, { useState, useEffect, useCallback } from 'react';
import { NavigationStep } from '../types';
import { Navigation, Footprints, Layers, MapPin, Compass as CompassIcon, ArrowUp } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../App';

const STEPS_DATA = [
    { id: 1, distance: 15, type: 'straight', targetHeading: 0 },
    { id: 2, distance: 10, type: 'turn-left', targetHeading: 270 },
    { id: 3, distance: 5, type: 'stairs', targetHeading: 0 },
    { id: 4, distance: 0, type: 'destination', targetHeading: 0 },
];

export const IWAY: React.FC = () => {
  const { t } = useLanguage();
  
  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [distance, setDistance] = useState(STEPS_DATA[0].distance);
  const [heading, setHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Merge static data with translations
  const steps: NavigationStep[] = STEPS_DATA.map((step, index) => ({
      ...step,
      instruction: t.iway.instructions[index],
      type: step.type as any 
  }));
  const currentStep = steps[currentStepIndex];

  const getBearing = () => {
    let diff = currentStep.targetHeading - heading;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    return diff;
  };

  const bearing = getBearing();
  const isAligned = Math.abs(bearing) < 15;

  useEffect(() => {
    if (isAligned && distance > 0 && navigator.vibrate && permissionGranted) {
       // Haptic feedback loop
       const interval = setInterval(() => {
         navigator.vibrate(10); 
       }, 500);
       return () => clearInterval(interval);
    }
  }, [isAligned, distance, permissionGranted]);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    setIsMobile(true);
    let compass = 0;
    if ((e as any).webkitCompassHeading) {
        compass = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
        compass = Math.abs(e.alpha - 360);
    }
    setHeading(compass);
  }, []);

  const requestAccess = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
            const response = await (DeviceOrientationEvent as any).requestPermission();
            if (response === 'granted') {
                setPermissionGranted(true);
                window.addEventListener('deviceorientation', handleOrientation);
            } else {
                alert('Permission denied. Navigation requires compass access.');
            }
        } catch (e) {
            console.error(e);
            alert("Error requesting compass permission");
        }
    } else {
        // Non-iOS or Desktop
        setPermissionGranted(true);
        if (typeof window !== 'undefined' && window.addEventListener) {
             window.addEventListener('deviceorientation', handleOrientation);
        }
    }
  };

  useEffect(() => {
    return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  const walk = () => {
    if (distance > 0) {
      setDistance(prev => Math.max(0, prev - 1));
    } else if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setDistance(steps[nextIndex].distance);
    }
  };

  const manualRotate = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHeading(parseInt(e.target.value));
  };

  return (
    <div className={`flex flex-col h-full min-h-[500px] relative overflow-hidden md:rounded-2xl transition-colors duration-500 ease-in-out ${
        isAligned && distance > 0 ? 'bg-green-500' : 'bg-black'
    }`}>
      
      {/* Top Overlay */}
      <div className="absolute top-0 w-full p-6 z-20 flex justify-between items-start text-white/90">
         <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest uppercase opacity-70">{t.iway.title}</span>
            <span className="text-xl font-bold">{t.iway.toRadiology}</span>
         </div>
         <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10">
            <span>{distance}m</span>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Start / Permission Gate */}
        {!permissionGranted && (
            <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-gray-800 p-4 rounded-full mb-6 animate-pulse">
                    <CompassIcon size={48} className="text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Ready to Navigate?</h3>
                <p className="text-gray-400 mb-8 max-w-xs">Tap below to calibrate your compass and start finding your way.</p>
                <Button onClick={requestAccess} className="rounded-full py-4 px-10 text-lg shadow-blue-500/50 shadow-lg">
                    {t.iway.enableCompass}
                </Button>
            </div>
        )}

        {/* The Arrow (Custom SVG for AirTag style) */}
        {distance > 0 ? (
            <div 
                className="relative transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `rotate(${bearing}deg)` }}
            >
                {/* Rounded Arrow SVG */}
                <svg 
                    width="240" 
                    height="240" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-all duration-300 ${isAligned ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105' : 'opacity-50 scale-100'}`}
                >
                    <path 
                        d="M45.5 15C47.5 12 52.5 12 54.5 15L85 60C87 63 85 68 81 68H60V90C60 93 57 95 54 95H46C43 95 40 93 40 90V68H19C15 68 13 63 15 60L45.5 15Z" 
                        fill="white"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        ) : (
            // Arrived State
            <div className="bg-white text-green-600 p-10 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)] animate-bounce">
                <MapPin size={80} />
            </div>
        )}

        {/* Dynamic Text */}
        <div className="mt-12 text-center h-24">
            {distance > 0 ? (
                <>
                <div className="text-6xl font-black text-white tracking-tighter tabular-nums">
                    {distance}<span className="text-2xl opacity-60 ml-1">m</span>
                </div>
                {permissionGranted && (
                    <div className="text-white/80 font-bold text-lg mt-2 flex items-center justify-center gap-2">
                        {isAligned ? t.iway.walkForward : (bearing > 0 ? `Turn Right` : `Turn Left`)}
                    </div>
                )}
                </>
            ) : (
                <div className="text-4xl font-black text-white tracking-tight">
                    {t.iway.arrived}
                </div>
            )}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-24 md:pb-6 relative z-20 shadow-2xl transition-transform duration-300">
         <div className="flex gap-4 items-center mb-6">
             <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl text-gray-900 dark:text-white">
                {currentStep.type === 'destination' ? <MapPin size={24} /> : 
                 currentStep.type === 'stairs' ? <Layers size={24} /> : 
                 <ArrowUp size={24} className={currentStep.type === 'turn-left' ? '-rotate-90' : ''} />}
             </div>
             <div>
                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Next Step</p>
                 <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">{currentStep.instruction}</h3>
             </div>
         </div>

         {/* Debug/Manual Controls */}
         <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
             <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={heading} 
                    onChange={manualRotate}
                    className={`flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${isMobile && permissionGranted ? 'opacity-30' : ''}`}
                 />
                 <Button onClick={walk} variant="secondary" className="whitespace-nowrap py-2 text-sm">
                    {t.iway.step} ({distance}m)
                 </Button>
             </div>
             {!isMobile && (
                 <p className="text-[10px] text-gray-400 text-center mt-2">
                     Desktop Mode: Use slider to rotate
                 </p>
             )}
         </div>
      </div>
    </div>
  );
};
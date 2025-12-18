import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, MessageSquare, Stethoscope, LogOut, Activity } from 'lucide-react';
import { useLanguage, useAuth } from '../App';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { logout, user } = useAuth();
  
  const isMedicalStaff = user?.role === 'doctor' || user?.role === 'personnel';

  // Base classes for links
  const baseLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group";
  
  // Active/Inactive state logic
  const getLinkClass = (isActive: boolean) => {
      // Mobile styles (flex-col, small text) vs Desktop styles (flex-row, larger text)
      const responsiveClass = "flex-col md:flex-row justify-center md:justify-start flex-1 md:flex-none h-full md:h-auto text-xs md:text-sm font-medium";
      const colorClass = isActive 
        ? "text-clinic-blue dark:text-clinic-accent bg-blue-50 dark:bg-slate-800" 
        : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/50";
      
      return `${baseLinkClass} ${responsiveClass} ${colorClass}`;
  };

  return (
    <>
    {/* Desktop Sidebar (Hidden on mobile) */}
    <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-clinic-dark-surface border-r border-gray-200 dark:border-clinic-dark-border h-full p-6 z-40 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-clinic-blue p-2 rounded-lg">
                <Stethoscope className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">SmartFlow</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.nav.portal}</p>
            </div>
        </div>

        <div className="flex flex-col gap-2 space-y-2">
            <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>
                <LayoutDashboard size={22} />
                <span>{t.nav.dashboard}</span>
            </NavLink>
            
            {/* Doctor-Specific Tab */}
            {isMedicalStaff && (
                <NavLink to="/monitoring" className={({ isActive }) => getLinkClass(isActive)}>
                    <Activity size={22} />
                    <span>{t.nav.monitoring}</span>
                </NavLink>
            )}
            
            {/* Hide Navigation for Medical Staff */}
            {!isMedicalStaff && (
                <NavLink to="/iway" className={({ isActive }) => getLinkClass(isActive)}>
                    <Compass size={22} />
                    <span>{t.nav.navigation}</span>
                </NavLink>
            )}

            <NavLink to="/iwi" className={({ isActive }) => getLinkClass(isActive)}>
                <MessageSquare size={22} />
                <span>{t.nav.assistant}</span>
            </NavLink>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-clinic-dark-border">
            <div className="flex items-center justify-between mb-4 px-2">
               <div className="text-xs">
                   <p className="text-gray-900 dark:text-white font-semibold">{user?.name}</p>
                   <p className="text-gray-400 capitalize">{user?.role}</p>
               </div>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium"
            >
                <LogOut size={18} />
                <span>{t.auth.logout}</span>
            </button>
        </div>
    </nav>

    {/* Mobile Bottom Bar (Hidden on desktop) */}
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-clinic-dark-surface border-t border-gray-200 dark:border-clinic-dark-border h-20 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50 transition-colors duration-300">
      <div className="w-full h-full flex justify-around items-center px-2">
        <NavLink to="/" className={({ isActive }) => getLinkClass(isActive).replace('px-4 py-3 rounded-xl', '')}>
          <LayoutDashboard size={24} className="mb-1" />
          <span>{t.nav.home}</span>
        </NavLink>
        
        {/* Doctor Monitoring Tab Mobile */}
        {isMedicalStaff && (
            <NavLink to="/monitoring" className={({ isActive }) => getLinkClass(isActive).replace('px-4 py-3 rounded-xl', '')}>
                <Activity size={24} className="mb-1" />
                <span>View</span>
            </NavLink>
        )}

        {/* Hide Navigation for Medical Staff */}
        {!isMedicalStaff && (
            <NavLink to="/iway" className={({ isActive }) => getLinkClass(isActive).replace('px-4 py-3 rounded-xl', '')}>
              <Compass size={24} className="mb-1" />
              <span>{t.nav.way}</span>
            </NavLink>
        )}

        <NavLink to="/iwi" className={({ isActive }) => getLinkClass(isActive).replace('px-4 py-3 rounded-xl', '')}>
          <MessageSquare size={24} className="mb-1" />
          <span>{t.nav.chat}</span>
        </NavLink>
        
        <button 
            onClick={logout} 
            className="flex flex-col justify-center items-center flex-1 h-full text-xs font-medium text-gray-400 hover:text-red-500"
        >
          <LogOut size={24} className="mb-1" />
          <span>{t.auth.logout}</span>
        </button>
      </div>
    </nav>
    </>
  );
};
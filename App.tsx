import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SmartTime } from './components/SmartTime';
import { IWI } from './components/IWI';
import { IWAY } from './components/IWAY';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { DoctorMonitoring } from './components/DoctorMonitoring';
import { Navbar } from './components/Navbar';
import { Patient, AppointmentStatus, User } from './types';
import { Moon, Sun, Globe } from 'lucide-react';
import { translations } from './translations';

// --- Theme Context ---
type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

// --- Language Context ---
export type Language = 'en' | 'fr';
const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void; t: typeof translations['en'] }>({ 
  language: 'en', 
  toggleLanguage: () => {}, 
  t: translations['en'] 
});
export const useLanguage = () => useContext(LanguageContext);

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType>({ user: null, login: () => false, logout: () => {}, isAuthenticated: false });
export const useAuth = () => useContext(AuthContext);


// --- Mock Data ---
const MOCK_PATIENT: Patient = {
  id: 'P-12345',
  name: 'Sophie Dubois',
  appointmentTime: '14:00',
  doctor: 'Dr. Martin',
  department: 'Orthopedics'
};

const MOCK_STATUS: AppointmentStatus = {
  status: 'delayed',
  estimatedTime: '14:25',
  delayMinutes: 25
};

// --- App Provider Component ---
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  const login = (u: string, p: string): boolean => {
    if (u === 'doctor' && p === 'doctor') {
        setUser({ id: 'doc-1', username: 'doctor', name: 'Dr. Martin', role: 'doctor' });
        return true;
    } else if (u === 'personnel' && p === 'personnel') {
        setUser({ id: 'staff-1', username: 'personnel', name: 'Sarah Staff', role: 'personnel' });
        return true;
    } else if (u === 'sophie' && p === 'sophie') {
        setUser({ id: 'pat-1', username: 'sophie', name: 'Sophie Dubois', role: 'patient' });
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const t = translations[language];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

// --- Main View Dispatcher ---
const HomeView: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'doctor' || user?.role === 'personnel') {
    return <DoctorDashboard />;
  }
  
  return <SmartTime patient={MOCK_PATIENT} status={MOCK_STATUS} />;
};

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Login />;

  const isNavView = location.pathname === '/iway';

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-clinic-dark-bg transition-colors duration-300">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Toggles - Floating Top Right */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-xs font-bold"
                aria-label="Toggle Language"
            >
                <Globe size={16} />
                {language.toUpperCase()}
            </button>
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-gray-800 dark:text-yellow-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle Dark Mode"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>

        {/* Scrollable Page Content */}
        <div className={`flex-1 overflow-y-auto ${!isNavView ? 'p-4 md:p-8' : ''} pb-24 md:pb-8 scroll-smooth`}>
             <div className={`mx-auto h-full ${!isNavView ? 'max-w-5xl' : 'w-full'}`}>
                 {children}
             </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/monitoring" element={<DoctorMonitoring />} />
            <Route path="/iwi" element={<IWI />} />
            <Route path="/iway" element={<IWAY />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
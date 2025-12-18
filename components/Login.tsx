
import React, { useState } from 'react';
import { User, Lock, ArrowRight, Stethoscope } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../App';
import { useLanguage } from '../App';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
        alert("Account creation is disabled in this demo.");
        return;
    }
    const success = login(username, password);
    if (!success) {
      setError(t.auth.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-clinic-dark-bg p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-clinic-dark-surface rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Branding Header */}
        <div className="bg-clinic-blue p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-sm">
                <Stethoscope className="text-white" size={32} />
             </div>
             <h1 className="text-2xl font-bold text-white mb-1">SmartFlow</h1>
             <p className="text-blue-100 text-sm">{t.nav.clinic}</p>
           </div>
        </div>

        {/* Form */}
        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {isRegistering ? t.auth.createAccount : t.auth.welcome}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                {t.auth.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">{t.auth.username}</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="sophie / doctor / personnel"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinic-blue dark:text-white transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">{t.auth.password}</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Same as username"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinic-blue dark:text-white transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg text-center animate-pulse">
                        {error}
                    </div>
                )}

                <Button fullWidth type="submit" className="mt-4">
                    {isRegistering ? t.auth.createAccount : t.auth.login} <ArrowRight size={18} />
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    className="text-sm text-clinic-blue dark:text-clinic-accent font-semibold hover:underline"
                >
                    {isRegistering ? t.auth.login : t.auth.createAccount}
                </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-400">Demo Credentials:</p>
                <div className="flex justify-center gap-2 mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">doctor</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">personnel</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">sophie</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

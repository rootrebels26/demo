// Top navigation bar with auth-aware links, theme toggle, and logout behavior.
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Sun, Moon } from 'lucide-react';
=======
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff

const Navbar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme')) // Default to dark if no theme is set
    );
    // Dropdown state for features
    const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-2xl">
            <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
<<<<<<< HEAD
                        <div className="absolute -inset-2 bg-sky-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
=======
                        <motion.div 
                            className="absolute -inset-2 bg-sky-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"
                            whileHover={{ scale: 1.1 }}
                        ></motion.div>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                        <img src="/logo.png" alt="Logo" className="relative h-12 w-12 rounded-2xl shadow-2xl object-cover ring-2 ring-white/10 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-xl font-black tracking-tighter text-pro-gradient uppercase">ROOT REBELS AI</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Future Interview Platform</p>
                    </div>
                </Link>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <button 
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Moon size={18} />
                        </button>
                        <button 
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${!isDarkMode ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Sun size={18} />
                        </button>
                    </div>
                    
                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>

                    <div className="flex items-center gap-6 text-sm font-bold tracking-tight">
<<<<<<< HEAD
                        <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
                        {pathname === "/" && (
                            <Link to="/about-us" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link>
=======
                        <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                        </Link>
                        {pathname === "/" && (
                            <Link to="/about-us" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                                About Us
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                            </Link>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                        )}
                        {token ? (
                            <>
                                {user.role === 'admin' ? (
<<<<<<< HEAD
                                    <Link to="/admin" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:bg-rose-600 transition-all font-black text-xs uppercase tracking-widest">Admin Dashboard</Link>
                                ) : (
                                    <>
                                        <Link to="/history" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">History</Link>
                                        <Link to="/progress" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Progress</Link>
                                        <Link to="/subject-selection" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Interview</Link>
                                        <Link to="/resume" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">ATS Checker</Link>
=======
                                    <Link to="/admin" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:bg-rose-600 active:scale-95 transition-all font-black text-xs uppercase tracking-widest">Admin Dashboard</Link>
                                ) : (
                                    <>
                                        <Link to="/history" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                                            History
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link to="/progress" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                                            Progress
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link to="/subject-selection" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                                            Interview
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link to="/resume" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group">
                                            ATS Checker
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                                        </Link>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                                    </>
                                )}
                                <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
<<<<<<< HEAD
                                        <div className="h-6 w-6 rounded-lg bg-sky-500 flex items-center justify-center text-[10px] text-white font-black">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{user.username}</span>
                                    </div>
                                    <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 font-black text-xs uppercase tracking-widest">Logout</button>
=======
                                        <motion.div 
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="h-6 w-6 rounded-lg bg-sky-500 flex items-center justify-center text-[10px] text-white font-black"
                                        >
                                            {user.username?.charAt(0).toUpperCase()}
                                        </motion.div>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{user.username}</span>
                                    </div>
                                    <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all duration-300 font-black text-xs uppercase tracking-widest">Logout</button>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Features Dropdown for guests (clickable) */}
                                <div className="relative">
                                    <button
<<<<<<< HEAD
                                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl font-bold focus:outline-none flex items-center gap-1"
                                        onClick={() => setShowFeaturesDropdown((prev) => !prev)}
                                        onBlur={() => setTimeout(() => setShowFeaturesDropdown(false), 150)}
                                        aria-haspopup="true"
                                        aria-expanded={showFeaturesDropdown ? 'true' : 'false'}
                                    >
                                        Features
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {showFeaturesDropdown && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-50">
                                            <button
                                                onClick={() => { setShowFeaturesDropdown(false); navigate('/login'); }}
                                                className="block w-full text-left px-6 py-3 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-900/40 transition-colors"
                                            >Resume ATS Score Checker</button>
                                            <button
                                                onClick={() => { setShowFeaturesDropdown(false); navigate('/login'); }}
                                                className="block w-full text-left px-6 py-3 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-900/40 transition-colors"
                                            >AI Interviewer</button>
                                        </div>
                                    )}
                                </div>
                                <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Login</Link>
                                <Link to="/signup" className="px-6 py-2.5 rounded-xl bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:bg-sky-600 transition-all font-black text-xs uppercase tracking-widest">Sign Up</Link>
=======
                                        onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                                        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
                                    >
                                        Features
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${showFeaturesDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showFeaturesDropdown && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-4 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-2 shadow-2xl backdrop-blur-xl overflow-hidden"
                                            >
                                                {[
                                                    { to: "/login", label: "Mock Interviews", desc: "Real-time AI voice feedback" },
                                                    { to: "/resume", label: "ATS Scanner", desc: "Optimize your resume" },
                                                    { to: "/about-us", label: "Case Studies", desc: "Success stories" }
                                                ].map((item, idx) => (
                                                    <Link 
                                                        key={idx}
                                                        to={item.to} 
                                                        className="flex flex-col gap-0.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                                        onClick={() => setShowFeaturesDropdown(false)}
                                                    >
                                                        <span className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{item.label}</span>
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.desc}</span>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-sm font-black text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors uppercase tracking-widest">Sign In</Link>
                                    <Link to="/signup" className="px-6 py-2.5 rounded-xl bg-sky-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:bg-sky-600 active:scale-95 transition-all font-black text-xs uppercase tracking-widest">Join Now</Link>
                                </div>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

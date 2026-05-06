import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const Icons = {
    Dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Absensi: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Riwayat: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    Izin: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Tim: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Jadwal: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Office: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
};

const navigation = {
    karyawan: [
        { name: 'Dashboard', href: 'dashboard', icon: Icons.Dashboard },
        { name: 'Absensi', href: 'attendance.index', icon: Icons.Absensi },
        { name: 'Riwayat Absensi', href: 'attendance.history', icon: Icons.Riwayat },
        { name: 'Izin/Cuti', href: 'leaves.index', icon: Icons.Izin },
    ],
    supervisor: [
        { name: 'Dashboard', href: 'dashboard', icon: Icons.Dashboard },
        { name: 'Absensi', href: 'attendance.index', icon: Icons.Absensi },
        { name: 'Riwayat Absensi', href: 'attendance.history', icon: Icons.Riwayat },
        { name: 'Tim Saya', href: 'supervisor.team', icon: Icons.Tim },
        { name: 'Jadwal Tim', href: 'supervisor.schedule', icon: Icons.Jadwal },
        { name: 'Izin/Cuti', href: 'leaves.index', icon: Icons.Izin },
    ],
    admin: [
        { name: 'Dashboard', href: 'dashboard', icon: Icons.Dashboard },
        { name: 'Kelola User', href: 'admin.users.index', icon: Icons.Users },
        { name: 'Kelola Kantor', href: 'admin.offices.index', icon: Icons.Office },
        { name: 'Monitor Tim', href: 'admin.team', icon: Icons.Tim },
        { name: 'Jadwal Semua', href: 'admin.schedule', icon: Icons.Jadwal },
        { name: 'Persetujuan Izin', href: 'admin.leaves.index', icon: Icons.Izin, badge: true },
    ],
};

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, notifications } = usePage().props;
    const pendingLeavesCount = notifications?.pendingLeavesCount || 0;
    const user = auth.user;
    const role = auth.role || 'karyawan';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    const navItems = navigation[role] || navigation.karyawan;

    const roleLabel = {
        admin: 'Administrator',
        supervisor: 'Supervisor',
        karyawan: 'Karyawan',
    };

    const roleBadgeColor = {
        admin: 'bg-rose-500/20 text-white border border-rose-400/30',
        supervisor: 'bg-amber-500/20 text-white border border-amber-400/30',
        karyawan: 'bg-blue-400/20 text-white border border-blue-300/30',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Flash Messages */}
            {showFlash && flash?.success && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                        <span className="font-medium text-sm">{flash.success}</span>
                        <button onClick={() => setShowFlash(false)} className="ml-2 hover:opacity-70 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
            )}
            {showFlash && flash?.error && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-rose-500/25 flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        <span className="font-medium text-sm">{flash.error}</span>
                        <button onClick={() => setShowFlash(false)} className="ml-2 hover:opacity-70 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/70 backdrop-blur-2xl border-r border-white/40 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'} shadow-[20px_0_50px_-20px_rgba(0,0,0,0.05)]`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="px-8 py-10">
                        <Link href={route('dashboard')} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                <span className="text-white font-black text-xl tracking-tighter">L</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">Locattend</h1>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">GeoTrack HR</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                        <div className="px-4 mb-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Main Menu</p>
                        </div>
                        {navItems.map((item) => {
                            const isActive = route().current(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={`${isActive 
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                                        : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                                    } group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm relative overflow-hidden`}
                                >
                                    <span className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`}>{item.icon}</span>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && pendingLeavesCount > 0 && (
                                        <span className="ml-auto px-2.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full min-w-[22px] text-center animate-pulse shadow-lg shadow-rose-500/40">
                                            {pendingLeavesCount}
                                        </span>
                                    )}
                                    {isActive && (
                                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Card */}
                    <div className="p-6">
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-5 rounded-[2.2rem] shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.08] rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-black text-lg border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white truncate tracking-tight">{user.name}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 mt-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg ${roleBadgeColor[role]}`}>
                                            {roleLabel[role]}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href={route('profile.edit')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 group/btn">
                                        <svg className="w-3 h-3 opacity-60 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Profil
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all border border-white/10 group/out">
                                        <svg className="w-3 h-3 opacity-60 group-hover/out:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-2xl border-b border-white/20">
                    <div className="flex items-center justify-between px-6 lg:px-10 h-20">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2.5 rounded-2xl bg-white/50 border border-white shadow-sm text-slate-600 hover:text-blue-600 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            
                            <div className="hidden md:block">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                    <span>Main</span>
                                    <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                                    <span className="text-blue-600">{header}</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{header}</h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search Bar Placeholder */}
                            <div className="hidden xl:flex items-center gap-3 px-5 py-2.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 group focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                <input type="text" placeholder="Cari sesuatu..." className="bg-transparent border-none p-0 text-xs font-bold text-slate-600 focus:ring-0 placeholder:text-slate-400 w-48" />
                                <span className="text-[10px] font-black text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded-md">⌘K</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="relative p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-blue-600 hover:shadow-md transition-all group">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                                </button>
                                
                                <div className="h-10 w-px bg-slate-200/60 mx-1 hidden sm:block"></div>
                                
                                <div className="hidden sm:flex items-center gap-3 pl-1">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Hari ini</p>
                                        <p className="text-xs font-black text-slate-700 tracking-tight">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-inner">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

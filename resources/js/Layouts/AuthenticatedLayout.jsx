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
        { name: 'Izin/Cuti', href: 'leaves.index', icon: Icons.Izin },
    ],
    supervisor: [
        { name: 'Dashboard', href: 'dashboard', icon: Icons.Dashboard },
        { name: 'Absensi', href: 'attendance.index', icon: Icons.Absensi },
        { name: 'Tim Saya', href: 'supervisor.team', icon: Icons.Tim },
        { name: 'Jadwal Tim', href: 'supervisor.schedule', icon: Icons.Jadwal },
        { name: 'Persetujuan Izin', href: 'supervisor.leaves.index', icon: Icons.Izin, badge: true },
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
        admin: 'bg-red-100 text-red-700',
        supervisor: 'bg-amber-100 text-amber-700',
        karyawan: 'bg-primary-100 text-primary-700',
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
            <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-dark-100 transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="px-6 py-6 border-b border-dark-100">
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-dark-900 tracking-tight">Locattend</h1>
                                <p className="text-xs text-dark-400">GeoTrack HR System</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = route().current(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={`${isActive ? 'sidebar-link-active' : 'sidebar-link'} relative`}
                                >
                                    <span className={`transition-colors ${isActive ? 'text-white' : 'text-blue-500'}`}>{item.icon}</span>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && pendingLeavesCount > 0 && (
                                        <span className="ml-auto px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full min-w-[20px] text-center animate-pulse shadow-lg shadow-rose-500/30">
                                            {pendingLeavesCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Card */}
                    <div className="p-4 border-t border-dark-100">
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-dark-900 truncate">{user.name}</p>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${roleBadgeColor[role]}`}>
                                        {roleLabel[role]}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('profile.edit')} className="flex-1 text-center text-xs py-2 rounded-lg bg-dark-50 text-dark-600 hover:bg-dark-100 transition-colors font-medium">
                                    Profil
                                </Link>
                                <Link href={route('logout')} method="post" as="button" className="flex-1 text-center text-xs py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-dark-100">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-dark-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {header && <div className="text-xl font-bold text-dark-900">{header}</div>}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-semibold text-slate-600">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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

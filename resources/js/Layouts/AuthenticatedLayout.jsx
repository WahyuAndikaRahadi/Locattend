import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navigation = {
    karyawan: [
        { name: 'Dashboard', href: 'dashboard', icon: '📊' },
        { name: 'Absensi', href: 'attendance.index', icon: '📍' },
        { name: 'Riwayat', href: 'attendance.history', icon: '📋' },
        { name: 'Izin/Cuti', href: 'leaves.index', icon: '📝' },
    ],
    supervisor: [
        { name: 'Dashboard', href: 'dashboard', icon: '📊' },
        { name: 'Absensi', href: 'attendance.index', icon: '📍' },
        { name: 'Tim Saya', href: 'supervisor.team', icon: '👥' },
        { name: 'Izin/Cuti', href: 'leaves.index', icon: '📝' },
    ],
    admin: [
        { name: 'Dashboard', href: 'dashboard', icon: '📊' },
        { name: 'Kelola User', href: 'admin.users.index', icon: '👤' },
        { name: 'Kelola Kantor', href: 'admin.offices.index', icon: '🏢' },
        { name: 'Tim', href: 'supervisor.team', icon: '👥' },
    ],
};

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
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
                    <div className="bg-accent-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-accent-500/25 flex items-center gap-3">
                        <span>✅</span>
                        <span className="font-medium">{flash.success}</span>
                        <button onClick={() => setShowFlash(false)} className="ml-2 hover:opacity-70">✕</button>
                    </div>
                </div>
            )}
            {showFlash && flash?.error && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 flex items-center gap-3">
                        <span>❌</span>
                        <span className="font-medium">{flash.error}</span>
                        <button onClick={() => setShowFlash(false)} className="ml-2 hover:opacity-70">✕</button>
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
                                    className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
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
                            <div className="hidden sm:flex items-center gap-2 text-sm text-dark-500">
                                <span>📅</span>
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

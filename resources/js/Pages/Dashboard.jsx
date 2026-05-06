import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const statusStyles = {
    hadir: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    izin: 'bg-amber-100 text-amber-700 border-amber-200',
    alpha: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusLabels = {
    hadir: 'Hadir',
    izin: 'Izin',
    alpha: 'Alpha',
};

const StatusBadge = ({ status }) => {
    return (
        <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${statusStyles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {statusLabels[status] || status}
        </span>
    );
};

const StatCard = ({ title, value, icon, colorClass, shadowColor, trend }) => (
    <div className="relative group overflow-hidden bg-white/40 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${colorClass}`}></div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${colorClass} ${shadowColor}`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {trend.label}
                        </span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">{value}</p>
                </div>
            </div>
        </div>
    </div>
);

const OfficeLocationCard = ({ office, todayAttendance }) => {
    if (!office) return null;
    return (
        <div className="group relative bg-white/40 backdrop-blur-xl p-1 w-full rounded-[3rem] border border-white/60 shadow-2xl shadow-blue-500/5 overflow-hidden transition-all duration-700 hover:shadow-blue-500/10">
            {/* High-tech background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-[0.03] rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative bg-white/60 backdrop-blur-md rounded-[2.8rem] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                {/* Main Content Area */}
                <div className="flex items-center gap-6 sm:gap-8 flex-1">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:rotate-6 transition-all duration-500">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                    </div>
                    
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg mb-2 border border-blue-100/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Lokasi Penempatan</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 truncate group-hover:text-blue-600 transition-colors duration-300">
                            {office.name}
                        </h3>
                        <p className="text-slate-500 font-medium flex items-center gap-2 text-xs sm:text-sm">
                            <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {office.address || 'Alamat kantor terdaftar'}
                        </p>
                    </div>
                </div>

                {/* Status & Action Area */}
                <div className="shrink-0 w-full md:w-auto">
                    {!todayAttendance ? (
                        <Link 
                            href={route('attendance.index')} 
                            className="flex items-center justify-center gap-3 w-full md:px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Absen Sekarang
                        </Link>
                    ) : (
                        <div className="flex items-center justify-center gap-4 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] text-emerald-600">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">Anda Sudah Absen</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function KaryawanDashboard({ todayAttendance, pendingLeavesCount, office }) {
    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Status Hari Ini" 
                    value={todayAttendance ? statusLabels[todayAttendance.status] : 'Belum Absen'}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    shadowColor="shadow-blue-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                />
                <StatCard 
                    title="Jam Masuk" 
                    value={todayAttendance ? todayAttendance.clock_in_time : '--:--'}
                    colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    shadowColor="shadow-emerald-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard 
                    title="Izin Pending" 
                    value={pendingLeavesCount}
                    colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                    shadowColor="shadow-amber-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <OfficeLocationCard office={office} todayAttendance={todayAttendance} />

                <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 opacity-[0.05] rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Aksi Lainnya</h3>
                            <p className="text-slate-500 font-medium">Akses riwayat atau ajukan izin dengan mudah.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href={route('leaves.create')} className="flex flex-col items-center justify-center px-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-amber-200 hover:bg-amber-50 group/item transition-all duration-300 shadow-sm">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-2 group-hover/item:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Ajukan Izin</span>
                            </Link>
                            <Link href={route('attendance.history')} className="flex flex-col items-center justify-center px-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-blue-200 hover:bg-blue-50 group/item transition-all duration-300 shadow-sm">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2 group-hover/item:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Riwayat</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SupervisorDashboard({ todayAttendance, pendingLeavesCount, teamCount, teamPresentToday, office }) {
    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <StatCard 
                    title="Total Karyawan" 
                    value={teamCount || 0}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    shadowColor="shadow-blue-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
                />
                <StatCard 
                    title="Hadir Hari Ini" 
                    value={teamPresentToday || 0}
                    colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    shadowColor="shadow-emerald-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                    trend={{ label: '85% Aktif', positive: true }}
                />
                <StatCard 
                    title="Status Saya" 
                    value={todayAttendance ? 'Hadir' : 'Belum Absen'}
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    shadowColor="shadow-indigo-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                />
            </div>

            <OfficeLocationCard office={office} todayAttendance={todayAttendance} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <Link href={route('attendance.index')} className="group relative p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-white/60 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-[0.03] rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Presensi Mandiri</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">Lakukan clock in/out harian Anda dan pantau riwayat absensi personal.</p>
                        <span className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Buka Sekarang <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                        </span>
                    </div>
                </Link>

                <Link href={route('supervisor.team')} className="group relative p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-white/60 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-[0.03] rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Tim Saya</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">Pantau kehadiran harian seluruh karyawan di kantor Anda secara real-time.</p>
                        <span className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            Monitor Tim <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function AdminDashboard({ totalUsers, totalOffices, todayTotalAttendance, totalPendingLeaves, attendanceTrends, recentActivities, lateComersCount, office }) {
    return (
        <div className="space-y-10 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Pengguna" 
                    value={totalUsers || 0}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    shadowColor="shadow-blue-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
                />
                <StatCard 
                    title="Total Kantor" 
                    value={totalOffices || 0}
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    shadowColor="shadow-indigo-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
                />
                <StatCard 
                    title="Absensi Hari Ini" 
                    value={todayTotalAttendance || 0}
                    colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    shadowColor="shadow-emerald-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>}
                    trend={{ label: '+12% vs Kemarin', positive: true }}
                />
                <StatCard 
                    title="Izin Pending" 
                    value={totalPendingLeaves || 0}
                    colorClass="bg-gradient-to-br from-rose-500 to-rose-600"
                    shadowColor="shadow-rose-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                />
            </div>

            <OfficeLocationCard office={office} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-xl shadow-blue-500/5 flex flex-col min-h-[520px] group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-[0.02] rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Statistik Kehadiran</h3>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Visualisasi tren aktivitas seminggu terakhir</p>
                        </div>
                        <div className="px-5 py-2.5 bg-white border border-slate-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Real-time Analytics
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceTrends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800, textAnchor: 'middle'}} 
                                    dy={15} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)', 
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '6 6' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-xl shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Aktivitas</h3>
                        <Link href={route('attendance.history')} className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {recentActivities?.length > 0 ? recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 bg-emerald-50 text-emerald-500 shadow-sm">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 border-b border-slate-50 pb-4 group-last:border-0">
                                    <p className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{activity.user_name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] font-bold text-slate-400">{activity.time}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">Hadir</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Belum ada aktivitas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                <Link href={route('admin.users.index')} className="group p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Data Karyawan</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">Manajemen database pengguna, departemen, dan hak akses sistem.</p>
                </Link>

                <Link href={route('admin.offices.index')} className="group p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Lokasi Kantor</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">Konfigurasi titik koordinat GPS dan radius aman absensi kantor.</p>
                </Link>

                <Link href={route('admin.team')} className="group p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Monitor Tim</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">Pantau aktivitas dan kehadiran seluruh karyawan secara terpusat.</p>
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard(props) {
    const { role } = props;
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout header={`Dashboard ${role === 'admin' ? 'Admin' : role === 'supervisor' ? 'Supervisor' : 'Karyawan'}`}>
            <Head title="Dashboard" />

            {/* Hero Welcome Section */}
            <div className="mb-12 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-10 sm:p-14 rounded-[3.5rem] shadow-2xl shadow-blue-500/20 group">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-1000 group-hover:-translate-y-10"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-2xl animate-slide-down">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            System Online
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                            Selamat Datang Kembali, <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{user.name}!</span>
                        </h2>
                        <p className="text-blue-100 text-lg font-medium opacity-80 leading-relaxed">
                            Aplikasi <span className="font-black text-white">Locattend</span> siap membantu Anda mengelola 
                            dan memantau kehadiran hari ini dengan presisi.
                        </p>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-4 animate-fade-in">
                        <div className="px-8 py-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col items-center sm:items-end gap-1 group/date transition-all hover:bg-white/20">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <span className="text-2xl font-black text-white tracking-tighter">
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em]">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {role === 'admin' && <AdminDashboard {...props} />}
                {role === 'supervisor' && <SupervisorDashboard {...props} />}
                {role === 'karyawan' && <KaryawanDashboard {...props} />}
            </div>
        </AuthenticatedLayout>
    );
}

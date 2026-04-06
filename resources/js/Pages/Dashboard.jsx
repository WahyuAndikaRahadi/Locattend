import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const statusStyles = {
    hadir: 'bg-emerald-100 text-emerald-700',
    izin: 'bg-amber-100 text-amber-700',
    alpha: 'bg-slate-100 text-slate-700',
};

const statusLabels = {
    hadir: 'Hadir',
    izin: 'Izin',
    alpha: 'Alpha',
};

const StatusBadge = ({ status }) => {
    return (
        <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${statusStyles[status] || 'bg-slate-100 text-slate-600'}`}>
            {statusLabels[status] || status}
        </span>
    );
};

const StatCard = ({ title, value, icon, colorClass, shadowColor }) => (
    <div className="relative group overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all duration-500">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${colorClass}`}></div>
        <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-6 ${colorClass} ${shadowColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

const OfficeLocationCard = ({ office }) => {
    if (!office) return null;
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-[0.03] rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span>🏢</span> Lokasi Penempatan Kantor
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{office.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold border border-blue-100 shadow-sm">
                        Radius: {office.radius_meters}m
                    </div>
                    <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100 shadow-sm flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Geo-fencing Aktif
                    </div>
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
                    colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                    shadowColor="shadow-amber-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard 
                    title="Izin Pending" 
                    value={pendingLeavesCount}
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    shadowColor="shadow-indigo-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 flex flex-col justify-center border-t-4 border-blue-500">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Aksi Cepat</h3>
                    <p className="text-slate-500 mb-6 text-sm">Akses fitur utama absensi Anda dengan satu klik.</p>
                    <div className="grid grid-cols-1 gap-4">
                        {!todayAttendance && (
                            <Link href={route('attendance.index')} className="btn-primary py-4 text-center text-lg">
                                📍 Clock In Sekarang
                            </Link>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Link href={route('leaves.create')} className="bg-white border border-slate-200 py-3 rounded-2xl text-center text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                📝 Ajukan Izin
                            </Link>
                            <Link href={route('attendance.history')} className="bg-white border border-slate-200 py-3 rounded-2xl text-center text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                📋 Riwayat
                            </Link>
                        </div>
                    </div>
                </div>

                <OfficeLocationCard office={office} />
            </div>
        </div>
    );
}

function SupervisorDashboard({ todayAttendance, pendingLeavesCount, teamCount, teamPresentToday, teamPendingLeaves, office }) {
    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Tim" 
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
                />
                <StatCard 
                    title="Izin Pending" 
                    value={teamPendingLeaves || 0}
                    colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                    shadowColor="shadow-amber-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                />
                <StatCard 
                    title="Status Saya" 
                    value={todayAttendance ? 'Clocked In' : 'Belum Absen'}
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    shadowColor="shadow-indigo-500/30"
                    icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                />
            </div>

            <OfficeLocationCard office={office} />

            {/* Quick Links with Refined Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                <Link href={route('attendance.index')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Presensi Mandiri</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Lakukan clock in/out harian Anda dan pantau riwayat absensi personal.</p>
                </Link>

                <Link href={route('supervisor.team')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl cursor-pointer">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Tim Saya</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Pantau statistik, laporan kehadiran harian, dan aktivitas semua anggota tim.</p>
                </Link>

                <Link href={route('supervisor.leaves.index')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl relative overflow-hidden">
                    {teamPendingLeaves > 0 && (
                         <div className="absolute top-8 right-8 flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 text-white font-black text-xs animate-pulse shadow-lg shadow-rose-500/30">
                            {teamPendingLeaves}
                         </div>
                    )}
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Persetujuan Izin</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Lakukan validasi dan proses permohonan izin/cuti yang diajukan bawahan.</p>
                </Link>
            </div>
        </div>
    );
}

function AdminDashboard({ totalUsers, totalOffices, todayTotalAttendance, totalPendingLeaves, attendanceTrends, recentActivities, lateComersCount, office }) {
    return (
        <div className="space-y-10 animate-slide-up">
            {/* Top refined Stat Cards */}
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
                {/* Main Trends Chart */}
                <div className="lg:col-span-2 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm flex flex-col min-h-[480px]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tren Absensi</h3>
                            <p className="text-slate-500 text-sm mt-1">Laporan aktivitas kehadiran seminggu terakhir</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Analytics
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceTrends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="space-y-8">
                    {/* Activity List */}
                    <div className="bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Aktivitas</h3>
                            <Link href={route('attendance.history')} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">
                                Semua
                            </Link>
                        </div>
                        <div className="space-y-5">
                            {recentActivities?.length > 0 ? recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-emerald-50 text-emerald-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 truncate">{activity.user_name}</p>
                                        <p className="text-[11px] font-bold text-slate-500 mt-0.5">{activity.time} &bull; <span className="text-emerald-500">Hadir</span></p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-50">
                                    <p className="text-sm font-bold text-slate-400 italic">Belum ada aktivitas.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Quick Links with Refined Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                <Link href={route('admin.users.index')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Data Karyawan</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Manajemen data pengguna dan hak akses sistem.</p>
                </Link>

                <Link href={route('admin.offices.index')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Lokasi Kantor</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Atur titik GPS dan radius aman absensi kantor.</p>
                </Link>

                <Link href={route('admin.team')} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Monitor Tim</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Pantau kinerja dan kehadiran seluruh supervisor secara real-time.</p>
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard(props) {
    const { role } = props;

    return (
        <AuthenticatedLayout header={`Dashboard ${role === 'admin' ? 'Admin' : role === 'supervisor' ? 'Supervisor' : 'Karyawan'}`}>
            <Head title="Dashboard" />

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="animate-slide-down">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Selamat Datang, <span className="text-blue-600">{usePage().props.auth.user.name}</span>!
                    </h2>
                    <p className="text-slate-500 mt-3 font-bold text-lg">
                        Pantau aktivitas harian sistem <span className="text-slate-900">Locattend</span> Anda.
                    </p>
                </div>
                <div className="px-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-slate-100 flex items-center gap-4 animate-fade-in group">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {role === 'admin' && <AdminDashboard {...props} />}
            {role === 'supervisor' && <SupervisorDashboard {...props} />}
            {role === 'karyawan' && <KaryawanDashboard {...props} />}
        </AuthenticatedLayout>
    );
}
